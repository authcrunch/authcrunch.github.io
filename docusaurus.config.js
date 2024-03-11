// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import tailwindPlugin from "./plugins/tailwind-plugin.cjs";
const { themes } = require("prism-react-renderer");
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "AuthCrunch aka Caddy Security Documentation",
  tagline: "Security App for Caddy v2",
  url: "https://docs.authcrunch.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "authcrunch",
  projectName: "authcrunch.github.io",
  trailingSlash: false,

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        googleAnalytics: {
          trackingID: "G-Q4KYV782E8",
        },
        gtag: {
          trackingID: "G-Q4KYV782E8",
        },
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/authcrunch/authcrunch.github.io/edit/main/",
        },
        blog: {
          showReadingTime: true,
          editUrl:
            "https://github.com/authcrunch/authcrunch.github.io/edit/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
        },
      }),
    ],
  ],

  plugins: [tailwindPlugin],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/authcrunch.jpg',
      announcementBar: {
        id: 'support_project_20240306',
        content:
          '<p class="text-lg mt-4 pb-0 mb-0">Project Needs Your Help <a target="_blank" rel="noopener noreferrer" href="/help-needed">Here</a>!</p>',
        backgroundColor: '#b91c1c',
        textColor: '#ffffff',
        isCloseable: false,
      },
      navbar: {
        title: "AuthCrunch aka Caddy Security",
        logo: {
          alt: "AuthCrunch Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "authenticate/intro",
            position: "left",
            label: "Authenticate",
          },
          {
            type: "doc",
            docId: "authorize/intro",
            position: "left",
            label: "Authorize",
          },
          {
            type: "doc",
            docId: "credentials/intro",
            position: "left",
            label: "Credentials",
          },
          {
            type: "doc",
            docId: "messaging/intro",
            position: "left",
            label: "Messaging",
          },
          {
            type: "doc",
            docId: "apps/intro",
            position: "left",
            label: "Apps",
          },
          {
            href: "https://github.com/greenpau/caddy-security/issues/new/choose",
            label: "💡 Ask Questions",
            position: "right",
            className: "button button--secondary",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Authenticate",
                to: "docs/authenticate/intro",
              },
              {
                label: "Authorize",
                to: "docs/authorize/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Caddy Community",
                href: "https://caddy.community",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/GreenbergTech",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/authcrunch/authcrunch.github.io",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Paul Greenberg @greenpau.`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
      },
      algolia: {
        appId: "S074F3F45X",
        apiKey: "f65f8a1b016375fdf6f6cc20fba8ff49",
        indexName: "authp",
      },
    }),
};

module.exports = config;
