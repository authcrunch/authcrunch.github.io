---
sidebar_position: 4
---

# Plugin Syntax

```
{
  security {
    authorization policy <policy_name> {
      crypto default token name <TOKEN_NAME>
      crypto default token lifetime <SECONDS>

      crypto key token name <TOKEN_NAME>
      crypto key <ID> token name <TOKEN_NAME>

      crypto key <verify|sign|sign-verify|auto> <SHARED_SECRET>
      crypto key <verify|sign|sign-verify|auto> from env <ENV_VAR_WITH_KEY>

      crypto key <ID> <verify|sign|sign-verify|auto> <SHARED_SECRET>
      crypto key <ID> <verify|sign|sign-verify|auto> from <directory|file> <PATH>

      crypto key <ID> <verify|sign|sign-verify|auto> from env <ENV_VAR_WITH_KEY>
      crypto key <ID> <verify|sign|sign-verify|auto> from env <ENV_VAR_NAME> as <directory|file>

      set auth url <path>
      set forbidden url <path>
      set token sources <value...>
      set user identity <claim_field>
      set redirect query parameter <value>
      set redirect status <3xx>

      disable auth redirect query
      disable auth redirect

      allow <field> <value...>
      allow <field> <value...> with <get|post|put|patch|delete> to <uri>
      allow <field> <value...> with <get|post|put|patch|delete>
      allow <field> <value...> to <uri>
      default <allow|deny>

      acl rule {
        comment <value>
        [no] [exact|partial|prefix|suffix|regex] match <field> <value> ... <valueN>
        [no] [exact|partial|prefix|suffix|regex] match method <http_method_name>
        [no] [exact|partial|prefix|suffix|regex] match path <http_path_uri>
        <allow|deny> [stop] [counter] [log <error|warn|info|debug>]
        field <field> [not] exists
      }

      validate path acl
      validate source address
      validate bearer header

      enable js redirect
      enable strip token
      
      enable login hint
      enable login hint with <email|phone|alphanumeric>

      inject headers with claims
    }
  }
}
```
