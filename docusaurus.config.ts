import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import searchClient from "./assets/search/client.json";
import remarkMermaidDiagrams from "./src/plugins/mermaid-diagrams";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "AuthCrunch",
  tagline: "Authentication and authorization for Caddy",
  favicon: "img/brand/favicon.svg",

  url: "https://docs.authcrunch.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  markdown: {
    format: "mdx",
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
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
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        googleAnalytics: {
          trackingID: "G-Q4KYV782E8",
        },
        gtag: {
          trackingID: "G-Q4KYV782E8",
        },
        docs: {
          sidebarPath: "./sidebars.ts",
          remarkPlugins: [remarkMermaidDiagrams],
          editUrl:
            "https://github.com/authcrunch/authcrunch.github.io/edit/main/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl:
            "https://github.com/authcrunch/authcrunch.github.io/edit/main/",
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: ["./src/plugins/tailwind-config.ts", "./src/plugins/configuration-source.ts", "./src/plugins/discovery.ts"],

  themeConfig: {
    image: "img/brand/social-card.png",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "AuthCrunch",
      logo: {
        alt: "",
        src: "img/brand/logo.svg",
        width: 40,
        height: 40,
      },
      items: [
        {type: "doc", docId: "intro", position: "left", label: "Start here"},
        {to: "/docs/guides", position: "left", label: "Guides", activeBaseRegex: "^/docs/guides(?:/|$)"},
        {to: "/docs/reference", position: "left", label: "Reference", activeBaseRegex: "^/docs/reference(?:/|$)"},
        {to: "/docs/troubleshoot", position: "left", label: "Troubleshoot", activeBaseRegex: "^/docs/troubleshoot(?:/|$)"},
        {href: "https://github.com/greenpau/caddy-security", label: "GitHub", position: "right"},
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Learn",
          items: [
            {label: "Start here", to: "/docs/intro"},
            {label: "Your first protected app", to: "/docs/start/first-app"},
            {label: "Browse by topic", to: "/docs/guides"},
          ],
        },
        {
          title: "Build & operate",
          items: [
            {label: "Reference", to: "/docs/reference"},
            {label: "Troubleshoot", to: "/docs/troubleshoot"},
            {label: "Releases", href: "https://github.com/greenpau/caddy-security/releases"},
          ],
        },
        {
          title: "Community",
          items: [
            {label: "GitHub", href: "https://github.com/greenpau/caddy-security"},
            {label: "Ask a question", href: "https://github.com/greenpau/caddy-security/issues/new/choose"},
            {label: "Blog", to: "/blog"},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Paul Greenberg @greenpau`,
    },
    prism: {
      // Keep syntax highlighting legible on the light documentation surface.
      theme: {
        plain: {color: "#172b4d", backgroundColor: "#f6f8fc"},
        styles: [
          {types: ["comment", "prolog", "doctype", "cdata"], style: {color: "#52627a", fontStyle: "italic"}},
          {types: ["string", "attr-value"], style: {color: "#8b2454"}},
          {types: ["punctuation", "operator"], style: {color: "#52627a"}},
          {types: ["entity", "url", "symbol", "number", "boolean", "variable", "constant", "property", "regex", "inserted"], style: {color: "#126564"}},
          {types: ["atrule", "keyword", "attr-name", "selector"], style: {color: "#245bca"}},
          {types: ["function", "deleted", "tag"], style: {color: "#9d2235"}},
          {types: ["function-variable"], style: {color: "#6639a8"}},
        ],
      },
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      ...searchClient,
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
