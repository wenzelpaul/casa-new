export default function (eleventyConfig) {
  // Add current year as global data
  eleventyConfig.addGlobalData("currentYear", () => {
    return new Date().getFullYear();
  });

  // Copy static assets (CSS, JS, images) to _site/assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  return {
    dir: { input: "src", output: "_site" }
  };
}