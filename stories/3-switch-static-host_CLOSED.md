# Story 3: Migrate to Vercel

## Description
Currently, the Eleventy static site is hosted on Strato via Caddy. Migrating to Vercel removes the need for managing a web server, custom SFTP scripts, and provides automatic CI/CD on their free Hobby tier.

## Acceptance Criteria
- [ ] Connect the Git repository to Vercel.
- [ ] Ensure Vercel is configured to run the build command (`npm run build:prod`) and outputs to `_site`.
- [ ] Add the Immich API environment variables (`IMMICH_URL`, `IMMICH_API_KEY`, `IMMICH_ALBUM_ID`) to Vercel's project settings.
- [ ] Verify that pushing to the main branch automatically triggers a successful build and deployment to a global CDN.
- [ ] Verify the Immich server is accessible by Vercel and images are successfully fetched during the build.
- [ ] Remove `scripts/upload-to-server.js` and deployment dependencies (`ssh2-sftp-client`) from `package.json` since they are no longer needed.
