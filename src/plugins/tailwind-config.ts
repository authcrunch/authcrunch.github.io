import type { Plugin } from '@docusaurus/types';
import type { AcceptedPlugin } from 'postcss';

export default function tailwindPlugin(): Plugin {
  return {
    name: 'tailwind-plugin',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(require('@tailwindcss/postcss') as AcceptedPlugin);
      return postcssOptions;
    },
  };
}