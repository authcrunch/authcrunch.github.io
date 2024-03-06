import React from "react";
import { ShieldCheckIcon, DevicePhoneMobileIcon, KeyIcon } from '@heroicons/react/24/outline'

const FeatureList = [
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

function Feature(props) {
  return (
    <div key={props.title} className="relative pl-16">
      <div className="text-base font-semibold leading-7 text-gray-900">
        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
          <props.image className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        {props.title}
      </div>
      <div className="mt-2 text-base leading-7 text-gray-600">
        {props.description}
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-lg font-semibold leading-7 text-blue-500">
            Deploy securely
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to secure your Caddy instance
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-1 lg:gap-y-16">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
