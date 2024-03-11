# Advanced Features

## OAuth 2.0 Endpoint Delayed Start

The following configuration allows delaying getting key material of upstream
OAuth 2.0 server.

```
      oauth identity provider google {
          ...
          delay_start 5
```

This would delay querying the upstream server for 5 seconds.


## OAuth 2.0 Endpoint Retry Attempts

The following configuration permits for retries when getting key material of
upstream OAuth 2.0 server.

```
      oauth identity provider google {
          ...
          retry_attempts 3
          retry_interval 10
```

If unsuccessful at reaching a remote OAuth 2.0 server, the plugin would
try connecting 2 more times at 10 second intervals.

## OAuth 2.0 Logout

The `enable logout` directive instructs the plugin to redirect a user to OAuth provider's
logout URL. When, the plugin fetches identity provider metadata, it discovers logout URL
via `end_session_endpoint`.

Note: At the moment, this feature only works with Cognito. If you have a need for this,
please reach out.

```
      oauth identity provider cognito-us-east-1 {
          ...
          enable logout
```