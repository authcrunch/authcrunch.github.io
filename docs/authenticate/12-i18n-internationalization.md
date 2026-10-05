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

## Agentic Prompts

Copy a prompt into your LLM to explore this topic. Each prompt prioritizes
upstream repository guidance and code over this page, and asks for version-aware
reasoning.

<div className="agentic-prompts">

<details>
<summary>Explain language selection</summary>

```text
Help me understand Internationalization (i18n).

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-ui,
authentication-portal-themes.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/i18n-internationalization

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Trace ui language from Caddy parsing to the library’s normalized identifier
and rendered messages. Compare a supported short code, full language name, and
unknown value. Explain why successful adaptation does not prove the intended
language appeared.
```

</details>

<details>
<summary>Inspect translation coverage</summary>

```text
Help me understand Internationalization (i18n).

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-ui,
authentication-portal-themes.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/i18n-internationalization

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Help me inspect the compiled message catalog for login, MFA, registration,
errors, and account management. Distinguish a recognized language from
complete coverage of every template or Profile string. Ask for the running
release and screenshots with private identity data removed.
```

</details>

<details>
<summary>Diagnose mixed-language screens</summary>

```text
Help me understand Internationalization (i18n).

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-ui,
authentication-portal-themes.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/i18n-internationalization

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Build a diagnosis for a French login with English errors or Profile labels.
Separate catalog coverage, custom-template literal text, release mismatch, and
language fallback. Do not invent a runtime JSON-import directive.
```

</details>

<details>
<summary>Plan language layout checks</summary>

```text
Help me understand Internationalization (i18n).

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-ui,
authentication-portal-themes.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/i18n-internationalization

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Design a browser checklist for long translations, mobile text wrapping,
right-to-left languages, keyboard focus, error states, and MFA forms. Explain
how to observe the selected language independently from whether the
configuration parser accepts its name.
```

</details>

<details>
<summary>Understand an upstream contribution</summary>

```text
Help me understand Internationalization (i18n).

Primary authorities (take precedence over website documentation):
https://github.com/greenpau/caddy-security/blob/main/AGENTS.md
https://github.com/greenpau/caddy-security/tree/main/.codex/skills
https://github.com/greenpau/go-authcrunch/blob/main/AGENTS.md
https://github.com/greenpau/go-authcrunch/tree/main/.codex/skills
Read each repository's root AGENTS.md first, then any scoped AGENTS.md that
applies to inspected paths. Read the relevant SKILL.md files and follow their
implementation and test references.

Relevant skills to locate: configuration-authentication-ui,
authentication-portal-themes.

Secondary reference:
https://docs.authcrunch.com/docs/authenticate/i18n-internationalization

If a source is inaccessible, ask me to paste its relevant text. Identify the
versions your answer applies to; main may be newer than my release. Resolve
disagreements using code and tests, and flag unverified claims. Use synthetic
credentials and redacted examples; explain proposed checks before any changes.

Explain which upstream catalog and tests would need review for a missing
message, without modifying them. Compare a docs-site language change with
compiled portal translations. Quiz me on supported language, fallback, and
custom-template responsibilities.
```

</details>

</div>

## Source Code References

Start with the code search, then follow the parser, runtime, and tests relevant
to this topic. These links target `main`; use GitHub's branch/tag selector to
compare them with your installed release.

1. [Search this topic in both repositories](https://github.com/search?q=%28repo%3Agreenpau%2Fgo-authcrunch%20OR%20repo%3Agreenpau%2Fcaddy-security%29%20%28GetLanguage%20OR%20NormalizeLanguage%20OR%20path%3Apkg%2Ftranslate%29&type=code)
   — searches topic-specific symbols and paths across both codebases.
2. [caddy-security: caddyfile_authn_ui.go](https://github.com/greenpau/caddy-security/blob/main/caddyfile_authn_ui.go)
   — parses templates, metadata, links, language, and local UI assets.
3. [go-authcrunch: pkg/translate/language.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/translate/language.go)
   — normalizes supported language identifiers.
4. [go-authcrunch: pkg/translate/data/messages.json](https://github.com/greenpau/go-authcrunch/blob/main/pkg/translate/data/messages.json)
   — contains compiled-source portal message translations.
5. [go-authcrunch: pkg/translate/language_test.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/translate/language_test.go)
   — tests recognized languages and fallback normalization.
6. [go-authcrunch: pkg/authn/ui/ui.go](https://github.com/greenpau/go-authcrunch/blob/main/pkg/authn/ui/ui.go)
   — renders Go templates with portal state and template helpers.
