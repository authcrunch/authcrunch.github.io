import type { ReactNode, ComponentType, SVGProps } from "react";
import Heading from "@theme/Heading";
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
        Bolster security with support for app-based authentication, hardware
        tokens, e.g. YubiKeys, and passkeys.
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
    <div className="flex flex-col items-center w-full md:w-1/3 px-4 pt-6">
      <div className="pb-6">
        <Image
          className="h-12 w-12 text-(--ifm-color-primary) dark:text-(--ifm-color-primary-light)"
          aria-hidden="true"
        />
      </div>
      <div className="text-center px-4 pb-6">
        <Heading
          as="h3"
          className="pb-6 text-2xl md:text-2xl font-bold text-(--ifm-heading-color) dark:text-(--ifm-heading-color)"
        >
          {title}
        </Heading>
        <p className="text-md text-(--ifm-font-color-base) dark:text-(--ifm-font-color-base)">
          {description}
        </p>
      </div>
    </div>
  );
};

const HomepageFeatures = (): ReactNode => {
  return (
    <div id="tw-scope">
      <section className="py-12 bg-(--ifm-background-color) dark:bg-(--ifm-background-color)">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomepageFeatures;
