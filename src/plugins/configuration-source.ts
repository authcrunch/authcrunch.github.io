import type {Plugin} from '@docusaurus/types';

/** Embed runnable examples in MDX without maintaining a second config copy. */
export default function configurationSource(): Plugin {
  return {
    name: 'configuration-source',
    configureWebpack() {
      return {
        module: {
          rules: [{test: /[\\/]Caddyfile$/, resourceQuery: /^\?raw$/, type: 'asset/source'}],
        },
      };
    },
  };
}
