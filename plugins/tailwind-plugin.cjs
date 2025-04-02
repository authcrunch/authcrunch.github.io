function tailwindPlugin(context, options) {
  return {
    name: "docusaurus-tailwindcss",
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(require("@tailwindcss/postcss"));
      return postcssOptions;
    },
  };
}

module.exports = tailwindPlugin;
