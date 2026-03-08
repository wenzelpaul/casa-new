# Casa Orizzonte Blu

A vacation rental website built with Eleventy, featuring automatic image fetching from Immich and automated deployment via Vercel.

## Features

- **Static Site Generation**: Built with Eleventy for fast, secure static hosting
- **Dynamic Gallery**: Automatically fetches images from an Immich photo server
- **Interactive Map**: Shows the property location using Leaflet
- **Responsive Design**: Works perfectly on mobile and desktop
- **Automated Deployment**: CI/CD natively handled via Vercel

## Tech Stack

- **Eleventy** (v3.1.2) - Static site generator
- **Vercel** - Global CDN and automated deployments
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
│   └── fetch-immich-gallery.js  # Downloads images from Immich
├── .env                         # Environment variables
├── .eleventy.js                 # Eleventy configuration
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
Vercel handles deployments automatically on git push.
1. Commit changes and push to `main` branch.
2. Vercel automatically builds and deploys.

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

### Environment Variables
- `.env` file (not committed to git)
- Contains sensitive credentials
- Ensure `IMMICH_*` variables are set in your Vercel project settings.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with live reload |
| `npm run build` | Build static site |
| `npm run build:prod` | Build with fresh gallery images |
| `npm run fetch-gallery` | Download latest images from Immich |

## Deployment Details

Deployments are handled automatically by Vercel when you push to the Git repository.

1.  Connect your repository to Vercel.
2.  Set the Framework Preset to "Other" or "Eleventy".
3.  Set the Build Command to `npm run build:prod`.
4.  Set the Output Directory to `_site`.
5.  Add the three `IMMICH_*` environment variables in the settings.

## Contributing

1. Make changes
2. Test locally with `npm run dev`
3. Commit and push to deploy.

## License

This project is private and not intended for public distribution.