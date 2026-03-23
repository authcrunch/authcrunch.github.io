import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

const HomepageHeader = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div id="tw-scope">
      <header className="bg-(--ifm-color-primary) dark:bg-(--ifm-color-primary-dark) py-16 px-6">
        <div className="container mx-auto text-center">
          <Heading
            as="h1"
            className="text-4xl md:text-5xl font-bold text-white dark:text-white mb-4"
          >
            {siteConfig.title}
          </Heading>
          <p className="text-lg md:text-xl text-white/90 dark:text-white/80 mb-8 max-w-2xl mx-auto">
            {siteConfig.tagline}. The knowledge base for the{" "}
            <b className="font-semibold text-white">security</b> application,{" "}
            <b className="font-semibold text-white">authenticate</b>{" "}
            (authentication portal) and{" "}
            <b className="font-semibold text-white">authorize</b> (authorization
            policies) plugins of Caddy v2
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              className="inline-block px-6 py-3 text-3xl font-medium rounded-lg border-2 border-gray-800 text-gray-800 bg-gray-300 hover:bg-gray-200 hover:text-(--ifm-color-primary) dark:hover:text-(--ifm-color-primary-dark) transition-colors duration-200 no-underline"
              to="/docs/intro"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description={`${siteConfig.tagline}`}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
