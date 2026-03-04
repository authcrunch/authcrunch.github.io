import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "AuthCrunch aka Caddy Security Documentation",
  tagline: "Security App for Caddy v2",
  favicon: 'img/favicon.ico',

  url: "https://docs.authcrunch.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  markdown: {
    format: 'mdx',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    }
  },
  organizationName: "authcrunch",
  projectName: "authcrunch.github.io",
  trailingSlash: false,


  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },
  
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        googleAnalytics: {
          trackingID: "G-Q4KYV782E8",
        },
        gtag: {
          trackingID: "G-Q4KYV782E8",
        },
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/authcrunch/authcrunch.github.io/edit/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/authcrunch/authcrunch.github.io/edit/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/authcrunch.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
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
          type: "doc",
          docId: "examples/intro",
          position: "left",
          label: "Examples",
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
      style: 'dark',
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
              href: "https://github.com/greenpau/caddy-security",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Paul Greenberg @greenpau`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: "S074F3F45X",
      apiKey: "f65f8a1b016375fdf6f6cc20fba8ff49",
      indexName: "authp",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
