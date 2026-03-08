import 'dotenv/config';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const streamPipeline = promisify(pipeline);

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const IMMICH_URL = process.env.IMMICH_URL;
const IMMICH_API_KEY = process.env.IMMICH_API_KEY;
const ALBUM_ID = process.env.IMMICH_ALBUM_ID;

const OUTPUT_DIR = path.join(__dirname, '../src/assets/images/gallery');
const GALLERY_JSON_PATH = path.join(__dirname, '../src/_data/gallery.json');

// Ensure required environment variables are set
if (!IMMICH_URL) {
  console.error('Error: IMMICH_URL environment variable is required');
  process.exit(1);
}

if (!IMMICH_API_KEY) {
  console.error('Error: IMMICH_API_KEY environment variable is required');
  process.exit(1);
}

if (!ALBUM_ID) {
  console.error('Error: IMMICH_ALBUM_ID environment variable is required');
  process.exit(1);
}

/**
 * Make API request to Immich
 */
async function makeImmichRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${IMMICH_URL}/api${endpoint}`;
    const protocol = url.startsWith('https') ? https : http;

    const options = {
      headers: {
        'x-api-key': IMMICH_API_KEY,
        'Accept': 'application/json'
      }
    };

    protocol.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        } else {
          reject(new Error(`API request failed with status ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Download image from Immich
 */
async function downloadImage(assetId, outputPath, size = 'preview') {
  return new Promise((resolve, reject) => {
    const url = `${IMMICH_URL}/api/assets/${assetId}/thumbnail?size=${size}`;
    const protocol = url.startsWith('https') ? https : http;

    const options = {
      headers: {
        'x-api-key': IMMICH_API_KEY
      }
    };

    protocol.get(url, options, async (res) => {
      if (res.statusCode === 200) {
        try {
          await streamPipeline(res, fs.createWriteStream(outputPath));
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error(`Failed to download image: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

/**
 * Get detailed asset information including description
 */
async function getAssetInfo(assetId) {
  try {
    const assetInfo = await makeImmichRequest(`/assets/${assetId}`);
    return assetInfo;
  } catch (error) {
    console.warn(`  Warning: Could not fetch detailed info for asset ${assetId}: ${error.message}`);
    return null;
  }
}

/**
 * Main function to fetch album and download images
 */
async function fetchGallery() {
  console.log('Fetching album from Immich...');

  try {
    // Fetch album data
    const album = await makeImmichRequest(`/albums/${ALBUM_ID}`);

    if (!album.assets || album.assets.length === 0) {
      console.log('No assets found in album');
      return;
    }

    console.log(`Found ${album.assets.length} total assets in album "${album.albumName}"`);

    // Randomly select up to 30 assets
    const MAX_ASSETS = 30;
    let selectedAssets = album.assets;

    if (album.assets.length > MAX_ASSETS) {
      // Create a copy of the array and shuffle it
      const shuffled = [...album.assets].sort(() => 0.5 - Math.random());
      // Take the first MAX_ASSETS elements
      selectedAssets = shuffled.slice(0, MAX_ASSETS);
      console.log(`Randomly selected ${MAX_ASSETS} assets to fetch.`);
    } else {
      console.log(`Fetching all ${album.assets.length} assets.`);
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Clear old images
    const existingFiles = fs.readdirSync(OUTPUT_DIR);
    existingFiles.forEach(file => {
      if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
      }
    });
    console.log('Cleared old images from output directory');

    // Process each asset
    const galleryData = [];

    for (let i = 0; i < selectedAssets.length; i++) {
      const asset = selectedAssets[i];
      const assetId = asset.id;

      console.log(`Processing asset ${i + 1}/${selectedAssets.length}: ${assetId}`);

      // Get detailed asset information to retrieve description
      const assetInfo = await getAssetInfo(assetId);
      const description = assetInfo?.exifInfo?.description || '';

      if (description) {
        console.log(`  Found description: "${description}"`);
      }

      // Download thumbnail (for gallery view)
      const thumbFilename = `${assetId}_thumb.jpg`;
      const thumbPath = path.join(OUTPUT_DIR, thumbFilename);
      await downloadImage(assetId, thumbPath, 'thumbnail');

      // Download larger version (for lightbox)
      const largeFilename = `${assetId}_large.jpg`;
      const largePath = path.join(OUTPUT_DIR, largeFilename);
      await downloadImage(assetId, largePath, 'preview'); // preview is ~1080p

      // Add to gallery data
      galleryData.push({
        id: assetId,
        thumbnail: `/assets/images/gallery/${thumbFilename}`,
        large: `/assets/images/gallery/${largeFilename}`,
        originalFileName: asset.originalFileName || `Image ${i + 1}`,
        fileCreatedAt: asset.fileCreatedAt || asset.createdAt,
        description: description // Add description field
      });

      console.log(`  ✓ Downloaded thumbnail and large version`);
    }

    // Sort by date (newest first)
    galleryData.sort((a, b) => new Date(b.fileCreatedAt) - new Date(a.fileCreatedAt));

    // Write gallery.json
    fs.writeFileSync(
      GALLERY_JSON_PATH,
      JSON.stringify(galleryData, null, 2)
    );

    console.log(`\n✓ Successfully created gallery.json with ${galleryData.length} images`);
    console.log(`✓ Images saved to: ${OUTPUT_DIR}`);

    // Count images with descriptions
    const withDescriptions = galleryData.filter(img => img.description).length;
    console.log(`✓ ${withDescriptions} images have descriptions`);

  } catch (error) {
    console.error('Error fetching gallery:', error.message);
    process.exit(1);
  }
}

// Run the script
fetchGallery();
