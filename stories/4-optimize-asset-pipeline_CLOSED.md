# Story 4: Optimize the Asset Pipeline

## Description
If the Immich album grows large, downloading all high-res photos on every single build will become very slow and network-heavy. The asset pipeline needs to be optimized through caching.

## Acceptance Criteria
- [ ] Update `scripts/fetch-immich-gallery.js` to cache downloaded images and JSON data locally.
- [ ] The script should incrementally download only newly added or modified images that aren't already in the local cache.
- [ ] Ensure the cache folder is properly configured (e.g., added to `.gitignore` if it's purely temporary, or managed by Eleventy's Fetch plugin).
- [ ] Verify that a subsequent build runs significantly faster than the initial build.
