---
slug: azure-container-instances-caddy-security
title: Secure Deployment of Application with Azure Container Instances and Caddy
authors: [greenpau]
tags: [blog]
---

This tutorial walks you through deploying applications protected by caddy security app,
hosted by Caddy web server via Azure Container Instances (ACI) service.

## Azure Configuration

Define environment variables. Change `app` to something else, e.g. `xyz`.

```bash
export ACI_RG_NAME=app-auth-rg-001
export ACI_ST_ACCOUNT_NAME=appauthst001
export ACI_LOCATION=eastus
export ACI_ST_SHARE_NAME=appauthstsh001
```

Next, create resource group:

```bash
az group create --name "${ACI_RG_NAME}" --location eastus
```

### Add Azure File Share

References:
* https://learn.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files
* Reference: https://learn.microsoft.com/en-us/cli/azure/provider?view=azure-cli-latest#az-provider-register

Register a provider using your subscription ID:

```bash
az provider register -n Microsoft.Storage --subscription 91cd6b60-64b7-46e2-bffb-952352196549
```

Create a storage account:

```bash
az storage account create --resource-group "${ACI_RG_NAME}" --name "${ACI_ST_ACCOUNT_NAME}" --location "${ACI_LOCATION}" --sku Standard_LRS
```

Review the newly created account:

```bash
az storage account list | jq -r '.[]
```

Create a file share:

```bash
az storage share create --name "${ACI_ST_SHARE_NAME}" --account-name "${ACI_ST_ACCOUNT_NAME}"
```


## Copy Files to Azure File Share

Navigate to Resource Group, then browse to Storage Share associated with it.

![image](https://github.com/authcrunch/authcrunch.github.io/assets/3826416/447d6cef-d50e-4c2b-85be-676970a2712a)

Next, open the share, click "Browse" and add the following nested directories. The `app-auth-ci-001` is the name of the Caddy instance (ACI container).

* `caddy`,
  - `app-auth-ci-001`
    * `config`

![image](https://github.com/authcrunch/authcrunch.github.io/assets/3826416/ee9c2d02-e9a7-4790-a34b-7c959b5c1d8e)

Next, browse to `caddy/app-auth-ci-001/config` and upload `Caddyfile` with the following content.

![image](https://github.com/authcrunch/authcrunch.github.io/assets/3826416/a58883fc-3d13-40e9-aae0-1ed037f6cd0a)

```
{
	http_port 80
	https_port 443
	admin off
	debug

	order authenticate before respond
	order authorize before basicauth

	security {
		local identity store localdb {
			realm local
			path {env.LOCAL_DATA_PATH}caddy/app-auth-ci-001/userdb/users.json
			user webadmin {
				name Webmaster
				email webadmin@localhost.localdomain
				# echo -n "App@2f4cb79053be" | bcrypt-cli -c 10
				password "$2a$10$JqJEf2pra4hIkw4CSDePoOfIoXVUFwSn6pJie6m02MUP7YGQVPQAi" overwrite
				roles "authp/admin" "authp/user"
			}
			user jsmith {
				name John Smith
				email jsmith@localhost.localdomain
				# password {env.USER_JSMITH_SECRET}
				password "App@2f4cb79053be"
				roles "authp/admin" "authp/user"
			}
		}

		authentication portal myportal {
			crypto default token lifetime 7200
			crypto key sign-verify {env.JWT_SHARED_KEY}
			cookie domain app-auth-ci-001.eastus.azurecontainer.io
			ui {
				links {
					"My Identity" "/auth/whoami" icon "las la-user"
					"File Server" "/" icon "las la-cloud"
				}
			}
			transform user {
				match origin local
				action add role authp/user
			}
			enable identity store localdb
		}

		authorization policy file_server_policy {
			crypto key sign-verify {env.JWT_SHARED_KEY}
			set auth url /auth/
			allow roles "authp/admin" "authp/user"
		}
	}
}

:80 {
	redir https://{host}{uri} 302
}

:443 {
	tls internal {
		on_demand
	}

	route /version* {
		respond "app 1.0"
	}

	route /debug* {
		authorize with file_server_policy
		header Content-Type text/html
		respond <<EOF
		<html>
		<body>
		<p>Host: <code>{http.request.host}</code></p>
		<p>Time: <code>{time.now.common_log}</code></p>
		<p>ID: <code>{http.auth.user.id}</code></p>
		</body>
		</html>
		EOF 200
	}

	route /auth* {
		authenticate with myportal
	}

	route /* {
		authorize with file_server_policy
		file_server {
			root {env.LOCAL_DATA_PATH}
			browse
		}
	}
}
```

## Container Deployment

Get Storage Account Key:

```bash
ACI_ST_ACCOUNT_KEY=$(az storage account keys list --resource-group "${ACI_RG_NAME}" --account-name "${ACI_ST_ACCOUNT_NAME}" --query "[0].value" --output tsv)
echo $ACI_ST_ACCOUNT_KEY
```

Next, deploy the container:

```
TBD
```
