import { v3 } from "node-hue-api";
const hueApi = v3.api;
const discovery = v3.discovery;

export const getApi = (ipAddress: string, user: string) => {
  return hueApi.createLocal(ipAddress).connect(user);
};

export const getLights = async (ipAddress: string, user: string) => {
  const api = await getApi(ipAddress, user);
  return api.lights.getAll();
};

export async function discoverBridge() {
  const discoveryResults = await discovery.upnpSearch(6000);

  if (discoveryResults.length === 0) {
    console.error("Failed to resolve any Hue Bridges");
    return null;
  } else {
    // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
    console.log(discoveryResults);
    return discoveryResults[0].ipaddress;
  }
}

export async function discoverAndCreateUser(
  appName: string,
  deviceName: string
) {
  const ipAddress = await discoverBridge();

  // Create an unauthenticated instance of the Hue API so that we can create a new user
  const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect();

  let createdUser;
  try {
    createdUser = await unauthenticatedApi.users.createUser(
      appName,
      deviceName
    );
    console.log(
      "*******************************************************************************\n"
    );
    console.log(
      "User has been created on the Hue Bridge. The following username can be used to\n" +
        "authenticate with the Bridge and provide full local access to the Hue Bridge.\n" +
        "YOU SHOULD TREAT THIS LIKE A PASSWORD\n"
    );
    console.log(`Hue Bridge User: ${createdUser.username}`);
    console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
    console.log(
      "*******************************************************************************\n"
    );

    // Create a new API instance that is authenticated with the new user we created
    const authenticatedApi = await hueApi
      .createLocal(ipAddress)
      .connect(createdUser.username);

    // Do something with the authenticated user/api
    const bridgeConfig: any = await authenticatedApi.configuration.getConfiguration();
    console.log(
      `Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`
    );
    return {
      ipAddress,
      username: createdUser.username,
    };
  } catch (err) {
    if (err.getHueErrorType() === 101) {
      throw new Error(
        "The Link button on the bridge was not pressed. Please press the Link button and try again."
      );
    } else {
      throw new Error(`Unexpected Error: ${err.message}`);
    }
  }
}

export default getApi;
