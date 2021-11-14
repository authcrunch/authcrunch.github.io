# Customize UI

## Theming

The theming of the portal works as follows.

It starts with a concept of `theme`. By default, the portal uses `basic` theme.
There is no need to defind it in Caddyfile.

```
localhost {
  route /auth* {
    authp {
      ui {
        theme basic
      }
```

Each theme must have a set of default pages:

* `generic`
* `login`
* `portal`
* `register`
* `whoami`
* `settings`
* `sandbox`

The plain text templates are being stored in `assets/templates/<THEME>/<PAGE>.template`.

```
assets/templates/basic/generic.template
assets/templates/basic/login.template
assets/templates/basic/portal.template
assets/templates/basic/register.template
assets/templates/basic/whoami.template
assets/templates/basic/settings.template
assets/templates/basic/sandbox.template
```

These templates are the parts of `pkg/ui/pages.go`. They are compiled in the
portal's binary. That is, there is no need to store them on the disk.

Next, if a user wants to use a different template, then it could be passed via
Caddyfile directives. Specifically, use `template <PAGE_NAME>` directive to point
to a file on disk.

```
localhost {
  route /auth* {
    authp {
      ui {
        theme basic
        template login "/etc/gatekeeper/ui/login.template"
      }
```

## Custom CSS Styles

The following Caddyfile directive adds a custom CSS stylesheet to the
plugin's pages. The stylesheet is available under `auth/assets/css/custom.css`

```
      ui {
        ...
        custom css path path/to/styles.css
        ...
      }
```

## Custom Javascript

The following Caddyfile directive adds a custom javascript file to the
plugin's pages. The script is available under `auth/assets/js/custom.js`

```
      ui {
        ...
        custom js path path/to/script.js
        ...
      }
```

This directive is usefule for adding Google Analytics or other
minor javascript code.

## Portal Links

The following Caddyfile directive sets links that a user would see
upon a successful login:

```bash
      ui {
        ...
        links {
          "Prometheus" /prometheus
          "Alertmanager" /alertmanager
          "My App" /myapp
        }
        ...
      }
```

The link can be opened in a new tab or window via `target_blank` argument:

```
          "My App" /myapp target_blank
```

The link can be disabled with `disabled` argument:

```
          "My App" /myapp disabled
```

The link can have an icon associated with it via `icon` argument:

```
          "My App" /myapp icon "las la-cog"
```

The icon is the reference to [Line Awesome](https://icons8.com/line-awesome) by Icon8.

![Portal - UI - Icons](./images/portal_ui_icons.png)

## Custom Header

The following Caddyfile directive injects the code found in `path/to/head.html`
to `<head>` section of the portal's pages:

```bash
      ui {
        ...
        custom html header path path/to/head.html
        ...
      }
```


## Static Assets of Any Type

The following Caddyfile directive is capable of loading and serving any type of static
asset, e.g. `js`, `css`, etc.

```bash
      ui {
        ...
        static_asset "assets/css/app.css" "text/css" /path/to/app/styles.css
        ...
      }
```

The above configuration would cause the plugin to read `/path/to/app/styles.css`
and begin serving it with content type of `text/css`  at
`AUTH_PORTAL/assets/css/app.css`, e.g. `https://localhost:8443/auth/assets/css/app.css`.
