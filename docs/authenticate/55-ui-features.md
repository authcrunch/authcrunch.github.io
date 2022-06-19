# Customizing the User Interface (UI)

The user interface (UI) can be setup the use custom templates or
the UI can be customized and altered with custom Cascading Style
Sheets (CSS), JavaScripts and other assets.

## Templates

### Defining another theme

A custom HTML theme can be defined in the **global options block** of the `Caddyfile`.
The theme name is set in the **ui** block that is nested in the
**authentication portal** of the **security** block as shown below.

```
{
  security {
    authentication portal myportal {
      ui {
        theme basic
      }
    }
  }
}
```

Defining a theme is optional, by default the `basic` theme is used.

### Creating a new theme
Every template has its own folder in the `assets` folder. The folder name
should equal the name of the theme. For example the basic template files
are located in the folder `assets/templates/basic/`. For reference and as 
an example the basic template files can be found here https://github.com/greenpau/go-authcrunch/tree/main/assets/portal/templates/basic.

Every template folder should include at least the following files:

```
generic.template
login.template
portal.template
register.template
whoami.template
settings.template
sandbox.template
```

These template engine used is based on the Go library `pkg/ui/pages.go`. 
The files template files are compiled in the portal's binary.

### Overriding a specific page template
When using the a theme you can also override one specific page template
as well. The example for that is shown below where the usage is: 
`template <PAGE_NAME> <FILEPATH>`.

```
{
  security {
    authentication portal myportal {
      ui {
        theme basic
        template login {env.HOME}/.local/caddy/ui/login.template
      }
    }
  }
}
```

## Other customization

### Portal Links

The following Caddyfile directive sets links that a user would see
upon a successful login:

```bash
{
  security {
    authentication portal myportal {
      ui {
        links {
          "Prometheus" /prometheus
          "Alertmanager" /alertmanager
          "My App" /myapp
        }
      }
    }
  }
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

### Cascading Style Sheets (CSS)

The following Caddyfile directive adds a custom CSS stylesheet to the
plugin's pages. The stylesheet is available under `auth/assets/css/custom.css`

```
{
  security {
    authentication portal myportal {
      ui {
        custom css path {env.HOME}/.local/caddy/ui/custom/styles.css
      }
    }
  }
}
```

### JavaScript

Adding custom JavaScript can for example be useful for adding 
Analytics tools or other JavaScript.

The following Caddyfile directive adds a custom JavaScript to the
plugin's pages. The script is available under `auth/assets/js/custom.js`

```
{
  security {
    authentication portal myportal {
      ui {
        custom js path {env.HOME}/.local/caddy/ui/custom/script.js
      }
    }
  }
}
```

### Custom HTML Template Header

The following Caddyfile directive injects the code found in `path/to/head.html`
to `<head>` section of the portal's pages:

```bash
{
  security {
    authentication portal myportal {
      ui {
        custom html header path {env.HOME}/.local/caddy/ui/custom/head.html
      }
    }
  }
}
```

### Other Static Assets

The following Caddyfile directive loads any other asset for 
static file serving such as jpg, png et cetera.

```bash
      ui {
        static_asset "assets/css/app.css" "text/css" /path/to/app/styles.css
      }
```

The above configuration would cause the plugin to read `/path/to/app/styles.css`
and begin serving it with content type of `text/css` at
`AUTH_PORTAL/assets/css/app.css`, e.g. `https://localhost/auth/assets/css/app.css`.
