import type { ReactNode, ComponentType, SVGProps } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import {
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

type FeatureItem = {
  title: string;
  image: ComponentType<SVGProps<SVGSVGElement>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Flexible Authentication Schemes",
    image: ShieldCheckIcon,
    description: (
      <>
        Implement various authentication methods, including form-based, basic,
        local, LDAP, OpenID Connect, OAuth 2.0 (with support for popular
        providers like GitHub, Google, and Facebook), and SAML
      </>
    ),
  },
  {
    title:
      "Multi-factor Authentication (MFA) / Two-factor Authentication (2FA)",
    image: DevicePhoneMobileIcon,
    description: (
      <>
        Bolster security with support for app-based authentication and YubiKeys
      </>
    ),
  },
  {
    title: "Authorization with JWT/PASETO Tokens",
    image: KeyIcon,
    description: (
      <>
        Manage access control efficiently using JSON Web Tokens (JWT) and
        Password-Authenticated Token Extension (PASETO) tokens
      </>
    ),
  },
];

const Feature = ({ title, image: Image, description }: FeatureItem) => {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-bottom--md">
        <Image
          width={"4em"}
          className="h-6 w-6 text-white"
          aria-hidden="true"
        />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
};

const HomepageFeatures = (): ReactNode => {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageFeatures;