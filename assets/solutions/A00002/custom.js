(async () => {
  console.log("Injected JS Found");

  const whoamiEndpoint = "/whoami";
  const dashboardUrl = "https://assetq.myfiosgateway.com:8443/dash";

  async function fetchUserData(path) {
    try {
      const response = await fetch(path, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log("encountered error while fetching user data", error);
    }
    return null;
  }

  try {
    if (typeof window !== "undefined") {
      const currentURLPath = new URL(window.location.href).pathname;
      console.log(`Current Path: ${currentURLPath}`);
      const referrer = document.referrer;
      if (document.referrer) {
        console.log("Referrer:", document.referrer);
        const referrerURL = new URL(document.referrer);
        console.log("Referrer URL:", referrerURL);
        console.log("Referrer hostname:", referrerURL.hostname);
        console.log("Referrer path:", referrerURL.pathname);
        // Check whether the user logged in to portal through authentication sandbox
        if (
          referrerURL.pathname.startsWith("/sandbox/") &&
          referrerURL.hostname === "auth.myfiosgateway.com" &&
          currentURLPath === "/portal"
        ) {
          console.log(
            `User logged in to ${currentURLPath} from authentication sandbox`
          );
          // Get user data from /whoami endpoint
          const userData = await fetchUserData(whoamiEndpoint);
          console.log("user data", userData);
          // Extract id and roles
          if ("roles" in userData && "sub" in userData) {
            const userId = userData["sub"];
            const userRoles = userData["roles"];
            if (Array.isArray(userRoles)) {
              if (userRoles.includes("dash")) {
                // Redirect the user to personal dashboard
                console.log(
                  `redirecting user ${userId} to ${dashboardUrl}/${userId}`
                );
                window.location.href = `${dashboardUrl}/${userId}`;
              } else {
                console.log(
                  "the user is not subject to automatic redirect",
                  userRoles
                );
              }
            } else {
              console.log(
                "roles in user data is not a list of roles",
                userRoles
              );
            }
          } else {
            console.log("No roles found in user data", userData);
          }
        }
      } else {
        console.log("Referrer information is not available.");
      }
    }
  } catch (error) {
    console.log("encountered error", error);
  }
})();
