---
description: "Set the portal language and find the translation messages used by the login interface."
discovery:
  topic: login-and-mfa
  kind: reference
  aliases: ["i18n", "localization", "translation"]
---

# Internationalization (i18n)

Select the language for translated portal messages inside the portal's `ui` block:

```caddyfile
ui {
    language fr
}
```

The released library recognizes `en`, `de`, `fr`, `ja`, `zh`, `he`, `ar` and `ru`
(English, German, French, Japanese, Chinese, Hebrew, Arabic and Russian).
Language names are normalized too; use the short code consistently. Unknown
language input normalizes to English in the library, so check the actual rendered
result rather than treating successful adaptation as proof of your intended language.

<figure className="doc-screenshot">
  <a href={require('./images/i18n_french_login.png').default}><img src={require('./images/i18n_french_login.png').default} alt="French portal login with translated username prompt and Continue action" /></a>
  <figcaption>French login illustrates translated portal messages. Branding and individual forms can differ from your installed release.</figcaption>
</figure>

Translations are compiled from the
[released message catalog](https://github.com/greenpau/go-authcrunch/blob/v1.3.8/pkg/translate/data/messages.json).
The presence of a language in the catalog does not promise that every profile,
OIDC, error or custom-template string has been translated. There is no Caddyfile
setting that imports a replacement message JSON file at runtime.

Test login, password/MFA prompts, registration, errors and account management in
the selected language. Check long text and right-to-left layout on mobile.
To contribute missing messages, update the upstream library's catalog and its
translation checks; a documentation-site language change does not update the
compiled authentication portal.
