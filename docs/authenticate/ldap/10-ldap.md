# LDAP Configuration

It is recommended reading the documentation for Local identity store, because
it outlines important principles of operation of all identity stores.

Additionally, the LDAP identity store works in conjunction with Local identity store.
As you will see later, the two can be used together by introducing a
dropdown in UI interface to choose local versus LDAP domain authentication.

## Configuration Examples

The reference configuration for the identity store is in the following files:

* [`assets/conf/ldap/Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/Caddyfile):
  Microsoft AD LDAP integration
* [`assets/conf/ldap/posix/Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/posix/Caddyfile):
  LDAP integration with POSIX groups
* [`assets/conf/ldap/glauth/Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/glauth/Caddyfile):
  LDAP integration with GLAuth

The following Caddy endpoint at `/auth` authentications users
from `contoso.com` domain.

## Microsoft AD Integration

There is a single LDAP server associated with the domain: `ldaps://ldaps.contoso.com`.

The plugin DOES NOT ignore certificate errors when connecting to the servers.
However, one may ignore the errors by appending `ignore_cert_errors` to the
ldap server address.

```
          servers {
            ldaps://ldaps.contoso.com ignore_cert_errors
          }
```

As a better alternative to ignoring certificate errors, the plugin allows
adding trusted certificate authorities via `trusted_authority` Caddyfile directive:

```
          servers {
            ldaps://ldaps.contoso.com
          }
          trusted_authority /etc/gatekeeper/tls/trusted_authority/contoso_com_root1_ca_cert.pem
          trusted_authority /etc/gatekeeper/tls/trusted_authority/contoso_com_root2_ca_cert.pem
          trusted_authority /etc/gatekeeper/tls/trusted_authority/contoso_com_root3_ca_cert.pem
```

The following commands allow you connecting LDAPS server, e.g. `ldaps.localhost.local:636` and
collecting certificates for the `trusted_authority` directive.

```bash
mkdir -p certs && cd certs
openssl s_client -showcerts -verify 5 -connect ldaps.localhost.local:636 < /dev/null | \
    awk '/BEGIN/,/END/{ if(/BEGIN/){a++}; out="cert"a".crt"; print >out}' && \
    for cert in *.crt; do \
        newname=$(openssl x509 -noout -subject -in $cert | sed -n 's/^.*CN=\(.*\)$/\1/; s/[ ,.*]/_/g; s/__/_/g; s/^_//g;p').pem;
        mv $cert $newname;
    done
```

The LDAP attribute mapping to JWT fields is as follows. This is a typical Microsoft AD mapping.

| **JWT Token Field** | **LDAP Attribute** |
| --- | --- |
| `name` | `givenName` |
| `surname` | `sn` |
| `username` | `sAMAccountName` |
| `member_of` | `memberOf` |
| `email` | `mail` |

The plugin uses `authzsvc` domain user to perform LDAP bind.

The base search DN is `DC=CONTOSO,DC=COM`.

The plugin accepts username (`sAMAccountName`) or email address (`mail`)
and uses the following search filter: `(&(|(sAMAccountName=%s)(mail=%s))(objectclass=user))`.

For example:

```json
      {
        "Name": "sAMAccountName",
        "Values": [
          "jsmith"
        ]
      },
      {
        "Name": "mail",
        "Values": [
          "jsmith@contoso.com"
        ]
      }
```

Upon successful authentication, the plugin assign the following rules
to a user, provided the user is a member of a group:

| **JWT Role** | **LDAP Group Membership** |
| --- | --- |
| `admin` | `CN=Admins,OU=Security,OU=Groups,DC=CONTOSO,DC=COM` |
| `editor` | `CN=Editors,OU=Security,OU=Groups,DC=CONTOSO,DC=COM` |
| `viewer` | `CN=Viewers,OU=Security,OU=Groups,DC=CONTOSO,DC=COM` |

The security of the `password` could be improved by the following techniques:

* pass the password via environment variable `LDAP_USER_SECRET`
* store the password in a file and pass the file inside the `password`
  field with `file:` prefix, e.g. `file:/path/to/password`.

This [`Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/Caddyfile)
secures Prometheus/Alertmanager services. Users may access using local and LDAP credentials.

## POSIX Groups Integration

The configuration in [`assets/conf/ldap/posix/Caddyfile`](https://github.com/greenpau/caddy-auth-docs/blob/main/assets/conf/ldap/posix/Caddyfile)
is for the integration with [Online LDAP Test Server](https://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/).

The key differences of the configuration follow:

First, the `posix_groups` directive at the LDAP server level instructs the
plugin to make a secondary LDAP call to discover user memberships in groups.

The search similar to the command below:

```
ldapsearch -x -h ldap.forumsys.com -D "cn=read-only-admin,dc=example,dc=com" -w password -b "dc=example,dc=com" \
 "(&(uniqueMember=uid=riemann,dc=example,dc=com)(objectClass=groupOfUniqueNames))"
```

Second, the `search_group_filter` directive allows the modification of the
default `(&(uniqueMember=uid=` + USER_DN + `)(objectClass=groupOfUniqueNames))`
group search string.

Third, there are a number of attributes that would require modification.

The user object follows:

```
# riemann, example.com
dn: uid=riemann,dc=example,dc=com
objectClass: inetOrgPerson
objectClass: organizationalPerson
objectClass: person
objectClass: top
cn: Bernhard Riemann
sn: Riemann
uid: riemann
mail: riemann@ldap.forumsys.com
```

The comments in the below snippet explain the changes.

```
attributes {
    # The name us mapped to cn attribute, i.e. Bernhard Riemann
    name cn
    # Although surname is being kept in sn attribute, there is no
    # attribute for given name. Thus, it is useless in isolation.
    # Therefore, changeing surname value to non-existing attribute foo.
    surname foo
    # The username is mapped to uid attribute, i.e. riemann
    username uid
    # The member_of is not being used.
    member_of uniqueMember
    email mail
}
```

The relevant parts of the configuration follow:

```Caddyfile
		ldap identity store example.com {
			realm example.com
			servers {
				ldap://ldap.forumsys.com posix_groups
			}
			attributes {
				name cn
				surname foo
				username uid
				member_of uniqueMember
				email mail
			}
			username "cn=read-only-admin,dc=example,dc=com"
			password "password"
			search_base_dn "DC=EXAMPLE,DC=COM"
			search_filter "(&(|(uid=%s)(mail=%s))(objectClass=inetOrgPerson))"
			groups {
				"ou=mathematicians,dc=example,dc=com" authp/admin
				"ou=scientists,dc=example,dc=com" authp/user
			}
		}

...

		authentication portal myportal {
		  ...
			enable identity store example.com
		}
```

The configuration is for the [Online LDAP Test Server](https://www.forumsys.com/2022/05/10/online-ldap-test-server/).

All of the following usernames have password value of `password`.

```
riemann
gauss
euler
euclid
einstein
newton
galieleo
tesla
```

The screenshots from the login, portal, and whoami pages follow.

![Sign In](./images/ldap_demo_01.png)

![Username Prompt](./images/ldap_demo_02.png)

![Password Prompt](./images/ldap_demo_03.png)

![Portal Screen](./images/ldap_demo_04.png)

![Whoami Screen](./images/ldap_demo_05.png)

## Case Insensitive Matching of LDAP Groups

In complex environments, such as a **virtual federated directory**, attribute names and Distinguished Name (DN)
values are often unpredictable. Because data may be aggregated from multiple sources, the casing of group paths
and names can vary significantly even for the same logical entity.

When performing group membership lookups or authorization checks, exact string matching often fails due to
inconsistent casing. For example, a portal might encounter any of the following variations for what should
be considered the same group:

* `cn=MyGroup1,ou=groups,dc=example,dc=com`
* `CN=myGroup1,ou=Groups,dc=example,dc=com`
* `cn=MYGROUP1,OU=Groups,DC=example,DC=com`

According to standard LDAP administrative practices, client software is generally expected to treat DNs and attribute
types as **case-insensitive**. This requirement is reinforced by the behavior of major Java-based LDAP libraries, including:

* JLDAP
* UnboundID LDAP SDK
* JNDI (Java Naming and Directory Interface)

The project implements **case-insensitive** by default.

## Dynamic Role Mapping from LDAP Groups

In environments where LDAP group structures are well-organized, manual mapping of every individual
group to a role can become an administrative burden. To streamline this, the portal supports dynamic
mapping modes that automatically translate LDAP Group Distinguished Names (DNs) into application roles.

If your directory structure uses the first attribute of the DN (typically the Common Name
or Organizational Unit) as the functional role name, you can use
the `enable short automatic group mapping` configuration.

```Caddyfile
		ldap identity store example.com {
			enable short automatic group mapping
		}
```

If enabled, the portal extracts the value of the first Relative Distinguished Name (RDN). Technically, it
captures the string located between the first `=` and the first `,`.

Additionally, the the portal applies a mandatory lowercase normalization to the resulting role string.

| Original LDAP Group DN | Resulting Role |
| --- | --- |
| `cn=Admin,ou=Groups,dc=example,dc=com` | `admin` |
| `ou=mathematicians,dc=example,dc=com` | `mathematicians` |
| `cn=Editor,ou=Groups,dc=corp` | `editor` |

Additionally, you can use the `enable full automatic group mapping` configuration. In that
case the following transformation will apply.

| Original LDAP Group DN | Resulting Role |
| --- | --- |
| `cn=Admin,ou=Groups,dc=example,dc=com` | `cn=admin,ou=groups,dc=example,dc=com` |
| `ou=mathematicians,dc=example,dc=com` | `ou=mathematicians,dc=example,dc=com` |
| `cn=Editor,ou=Groups,dc=corp` | `cn=editor,ou=groups,dc=corp` |
