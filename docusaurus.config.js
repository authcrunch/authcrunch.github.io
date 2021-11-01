// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Auth Portal and Authorize Plugins for Caddy v2',
  tagline: 'Simply Safe',
  url: 'https://authp.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'authp',
  projectName: 'authp.github.io',
  trailingSlash: false,

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/authp/authp.github.io/edit/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/authp/authp.github.io/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Auth with Caddy',
        logo: {
          alt: 'Auth Portal Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'authenticate/intro',
            position: 'left',
            label: 'Authenticate',
          },
          {
            type: 'doc',
            docId: 'authorize/intro',
            position: 'left',
            label: 'Authorize',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/greenpau/caddy-auth-portal',
            label: 'caddy-auth-portal',
            position: 'right',
          },
          {
            href: 'https://github.com/greenpau/caddy-authorize',
            label: 'caddy-authorize',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Authenticate',
                to: 'docs/authenticate/intro',
              },
              {
                label: 'Authorize',
                to: 'docs/authorize/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Caddy Community',
                href: 'https://caddy.community',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/GreenbergTech',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/authp/authp.github.io',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Paul Greenberg @greenpau.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      googleAnalytics: {
        trackingID: 'G-MVS6492XVX',
      },
    }),
};

module.exports = config;
