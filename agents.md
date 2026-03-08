# AI Agent Instructions for Casa Orizzonte Blu

This document outlines the rules, tech stack, and best practices for any AI agent working on the Casa Orizzonte Blu project. Please read and adhere to these guidelines before making changes to the codebase.

## 1. Tech Stack & Architecture

- **Static Site Generator**: Eleventy (v3.x)
- **Templating Engine**: Nunjucks (`.njk`) for base layouts and components. Page content is written in Markdown (`.md`).
- **Frontend Stack**: Vanilla HTML, plain CSS (No Tailwind or other frameworks), and Vanilla JS.
- **Map Integration**: Leaflet (v1.9.x) for interactive maps.
- **Dynamic Content**: Photos are fetched at build-time from a self-hosted Immich instance using an API script.
- **Server**: Caddy (for production hosting / reverse proxy).

## 2. Directory Structure

- `src/`: Contains all source files to be processed by Eleventy.
  - `_includes/`: Nunjucks templates/layouts (e.g., `base.njk`).
  - `_data/`: Global data files, including auto-generated content like `gallery.json`.
  - `assets/`: Static assets (`css/`, `js/`, `images/`) that are copied over to `_site/` during build.
  - Page specific files (e.g., `index.md`, `about.md`, `map.njk`).
- `scripts/`: Custom Node.js scripts for fetching data (`fetch-immich-gallery.js`) and deployment (`upload-to-server.js`).
- `_site/`: The generated static site output directory (ignored in git).

## 3. Development Workflow & Scripts

- **Development Server**: Run `npm run dev` to start Eleventy with live reload (defaults to `http://localhost:8080`).
- **Fetching Gallery Details**: Run `npm run fetch-gallery` to fetch the latest photos from the Immich API into `src/_data/gallery.json`.
- **Production Build**: Run `npm run build:prod` which automatically runs the fetch step before building.
- **Environment Variables**: The project requires a `.env` file (which is git-ignored) for storing API keys (`IMMICH_URL`, `IMMICH_API_KEY`, etc.) and deployment credentials (`SFTP_HOST`, etc.). Never hardcode secrets.

## 4. Coding Guidelines

### Frontend (HTML/CSS/JS)
- **Vanilla JS Only**: Do not introduce frameworks like React, Vue, or Alpine.js. Write standard JavaScript and place scripts in `src/assets/js/`. Load generic scripts with `<script defer>`.
- **Styling**: Do not add CSS frameworks like Bootstrap or Tailwind. Contribute to the existing CSS files in `src/assets/css/`. Ensure modern responsive design using Media Queries and CSS Grid/Flexbox.
- **Icons**: The project uses Font Awesome for icons (primarily via mobile navigation).
- **Dark Mode**: The site supports dark mode via a manual theme toggle. Keep styling dependent on CSS variables.

### Content & Templating
- Keep textual content in Markdown files and structural/reusable layouts in Nunjucks.
- Maintain appropriate standard frontmatter at the top of templates/pages (`title`, `description`, `cover`, etc.). Avoid duplicating `head` logic.

## 5. Deployment Procedures

- Deployment is handled via a custom SFTP script: `npm run upload`.
- **Crucial Rule**: The upload script deletes all existing files in the remote web root before pushing the new output. Always double check build outputs before triggering a deploy or modifying the `upload-to-server.js` script.
- Ensure all static assets are appropriately bundled and reachable relative to the root (`/assets/css/theme.css`).

## 6. General Agent Rules

- **Minimal Modifications**: Refactor files only if directly related to the user's objective or to fix an observed bug.
- **Readability**: Code should be readable. Add helpful comments explaining *why* something is done when working with complex APIs or deployment logic.
- **Verify Dependencies**: If you absolutely must use a new library, verify via user confirmation before adding it to `package.json`. Prefer native Node modules and standard Web APIs where possible.

## 7. Story Management Workflow

When working on a user story from the `stories/` directory, adhere strictly to the following state lifecycle:

1.  **Start Work**: Take a story that ends with `_OPEN` (e.g., `feature_OPEN.md`). Rename the file to end with `_IN_PROGRESS` (e.g., `feature_IN_PROGRESS.md`).
2.  **Implementation**: Implement all the acceptance criteria defined in the story.
3.  **Testing**: Write automated tests for the new code if applicable, and verify manual requirements.
4.  **Completion**: Once everything is finished, fully tested, and verified to be working, rename the story file to end with `_CLOSED` (e.g., `feature_CLOSED.md`).
