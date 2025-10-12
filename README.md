# Casa Orizzonte Blu

A vacation rental website built with Eleventy and Caddy, featuring automatic image fetching from Immich and automated deployment via SFTP.

## Features

- **Static Site Generation**: Built with Eleventy for fast, secure static hosting
- **Dynamic Gallery**: Automatically fetches images from an Immich photo server
- **Interactive Map**: Shows the property location using Leaflet
- **Responsive Design**: Works perfectly on mobile and desktop
- **Automated Deployment**: Deploy to production server with a single command

## Tech Stack

- **Eleventy** (v3.1.2) - Static site generator
- **Caddy** - Web server with automatic HTTPS
- **Leaflet** (v1.9.4) - Interactive maps
- **Immich** - Self-hosted photo management
- **NPM Scripts** - Task automation

## Project Structure

```
├── src/
│   ├── _data/
│   │   ├── gallery.json          # Auto-generated image data
│   │   └── versions.json         # Library versions
│   ├── _includes/
│   │   └── base.njk             # Base template
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── index.md                 # Homepage
│   ├── about.md                 # About page
│   ├── contact.md               # Contact page
│   ├── map.njk                  # Interactive map
│   ├── calendar.njk             # Booking calendar
│   └── pictures.njk             # Photo gallery
├── scripts/
│   ├── fetch-immich-gallery.js  # Downloads images from Immich
│   └── upload-to-server.js      # Deploys to SFTP server
├── .env                         # Environment variables
├── .eleventy.js                 # Eleventy configuration
├── Caddyfile                    # Caddy configuration
└── package.json                 # Dependencies and scripts
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file with:
   ```env
   # Immich API configuration
   IMMICH_URL=https://your-immich-server.com
   IMMICH_API_KEY=your-api-key-here
   IMMICH_ALBUM_ID=your-album-id-here

   # SFTP deployment configuration
   SFTP_HOST=ssh.strato.de
   SFTP_USER=your-username
   SFTP_PASS=your-password
   SFTP_REMOTE_DIR=/casa-orizzonteblu
   ```

3. **Fetch gallery images:**
   ```bash
   npm run fetch-gallery
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:8080`

## Building and Deployment

### Development Build
```bash
npm run build
```

### Production Build (with fresh gallery images)
```bash
npm run build:prod
```

### Deploy to Production
Upload the current `_site` contents to your SFTP server:
```bash
npm run upload
```

This command will:
1. Delete all existing files in the remote directory
2. Upload all files from `_site/` to the server

## Gallery Management

The photo gallery automatically pulls images from an Immich album:

- **Source**: Images stored in Immich photo management server
- **Thumbnails**: Generated for gallery grid view
- **Large Images**: Downloaded for lightbox viewing
- **Descriptions**: Uses image descriptions from Immich metadata
- **Auto-update**: Run `npm run fetch-gallery` to refresh images

Gallery data is stored in `src/_data/gallery.json` and automatically included in the build.

## Configuration

### Eleventy
- Configured in `.eleventy.js`
- Uses Nunjucks templates
- Processes Markdown files
- Outputs to `_site/` directory

### Caddy
- Configuration in `Caddyfile`
- Automatic HTTPS certificates
- Reverse proxy setup
- Static file serving

### Environment Variables
- `.env` file (not committed to git)
- Contains sensitive credentials
- Used by both gallery fetching and deployment scripts

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with live reload |
| `npm run build` | Build static site |
| `npm run build:prod` | Build with fresh gallery images |
| `npm run fetch-gallery` | Download latest images from Immich |
| `npm run upload` | Upload current build to production server |

## Deployment Details

The deployment script (`scripts/upload-to-server.js`):
- Connects to SFTP server using credentials from `.env`
- Deletes all files in the remote directory
- Recursively uploads all files from `_site/`
- Handles both files and directories
- Provides detailed logging

**Important**: The remote directory (`/casa-orizzonteblu`) gets completely emptied before each deployment.

## Contributing

1. Make changes
2. Test locally with `npm run dev`
3. Build with `npm run build:prod`
4. Upload with `npm run upload`

## License

This project is private and not intended for public distribution.