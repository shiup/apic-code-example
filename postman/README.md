# Postman #

Authors : Shiu Fun Poon

All kudos to Ozair Shiekh for pushing me to use Postman, and provide the helping hands on it.

There are 2 versions of [Postman](https://www.getpostman.com/apps), the one you install on your machine, vs the one you can run thru chrome browser as an extension.  I will cover both.

To use Postman OAuth support, you will need to use Chrome browser plug-in, it makes testing of OAuth straight forward, but it also has its limitation.

And Postman OAuth testtool only supports 2 grant types :
  - authorization code grant type
  - client credential grant type (also known as Application in OpenAPI)

Using OAuth Postman with IBM APIc, you will need APIc version 5080 or above.  The reason is due to this Postman issue https://github.com/postmanlabs/postman-app-support/issues/1360.

The instruction below can be used against all installation of IBM APIc. For self-contained purpose, I will use toolkits for the demo purpose.  And to install APIc for toolkits, follow this [instruction](https://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/com.ibm.apic.toolkit.doc/tapim_apic_test_with_dpdockergateway.html).

## Background ##

Postman is a nifty tool for testing api, it allows you to easily set up a set of api call to replace your friendly curl command.  You can extend the Postman with global, environment variables. And you can even write some script to set up environment and build a chain from there.

## Running locally ##

1. Install the Postman from the [official site](https://www.getpostman.com/apps).
2. Setting, `should you` or `should you not`
  - From the `Setting`, there are 2 options which are important
    - SSL certificate verification
      - Given Postman acts as SSL/TLS client, for testing non TLS issue, I would recommend this option be disabled.
    - Automatically follow redirects
      - This is a tricky one.  Under most circumstance, leaving this option to `on` makes testing going a lots easier.  The few times when I notice this to be an issue are :
        - testing OAuth implicit grant type
        - using the locally installed Postman to test OAuth (not using the OAuth authorization - i.e. building the call manually)
      - For testing IBM APIc OAuth identity->redirect, I would highly recommend to leave this to `on`.

  - To configure `Setting`,
    - From the top right corner, select the ![down arrow](https://github.com/shiup/apic-code-example/blob/master/postman/images/PostmanSetting-1.png)
    - From ![Setting](https://github.com/shiup/apic-code-example/blob/master/postman/images/PostmanSetting-2.png), configure the settings appropriately
3. Create/Manage environment variables
  - Since you can export the Postman package and use it in a different environment, you can use `environment` variables to adjust for the runtime setting.  Setting can be configured from ![top right corner](https://github.com/shiup/apic-code-example/blob/master/postman/images/PostmanEnvironment.png)
4. If you need to access result from one api call, as input for another, you can utilize `Tests` that is supported in Postman.  Here is an example on how I utilize the `access_token` returned as this api call, and use it for future api invocation.
  - Define an environment variable, access_token, set the value to `NA`
  - Add this script to the `Tests` section of the API invocation, this is triggered after the api call
    ```
    tests["Status code is 200"] = responseCode.code === 200;
    postman.clearEnvironmentVariable("access_token");
    postman.clearEnvironmentVariable("refresh_token");
    var at = JSON.parse(responseBody);
    postman.setEnvironmentVariable("access_token", at.access_token);
    postman.setEnvironmentVariable("refresh_token", at.refresh_token);
    ```
  ![As shown here][images/PostmanRunTimeEnvironmentVar.pn

  Putting it all together
  1. First determine what all the containers (and there are two) are running, and their corresponding ports.  To decipher the following DP 9090 port is mapped to 32809, this way, you can access DataPower webgui with `https://127.0.0.132809` from the browser
```
~/oidc (💃 ) docker ps
CONTAINER ID        IMAGE                                                      COMMAND                CREATED             STATUS              PORTS                                                                                             NAMES
7ab97a9ab924        ibm-apiconnect-toolkit/datapower-api-gateway:1.0.55        "/bin/drouter"         5 minutes ago       Up 5 minutes        0.0.0.0:32811->80/tcp, 0.0.0.0:32810->5554/tcp, 0.0.0.0:32809->9090/tcp, 0.0.0.0:4003->9443/tcp   postman_datapower-api-gateway_1
5bc2ab1c8493        ibm-apiconnect-toolkit/datapower-mgmt-server-lite:1.0.55   "node lib/server.js"   5 minutes ago       Up 5 minutes        0.0.0.0:32808->2443/tcp                                                                           postman_datapower-mgmt-server-lite_1
```
  - another trick to get to the DataPower server console is with this command, `docker logs -f <containerid>`.  For the above example, it would be `docker logs -f 7ab97a9ab924`

  2. Make sure you set up the redirect_uri properly, with `apic config:set` in the working directory
  ```
  ~/GitHub/openid/postman (💃 ) apic config:set oauth-redirect-uri=https://www.getpostman.com/oauth2/callback
oauth-redirect-uri: https://www.getpostman.com/oauth2/callback
  ```
  3. Bring up your microservices, with `apic edit`, followed by `apic services`
  ```
  ~/GitHub/openid/postman (💃 ) apic start
  Service postman-gw starting, use "apic services" to obtain port details.
  ~/GitHub/openid/postman (💃 ) apic services
  Service oauth-basic-gw running on port 4001.
  Service oidc-gw running on port 4002.
  Service postman-gw running on port 4003.
  ```

  If all works, you should see something simliar to ![this](https://github.com/shiup/apic-code-example/blob/master/postman/images/APIDevImage.png) on your browser.

  To test out the above, you can use the yamls and Postman setting attached.  Here is the [recording](https://www.youtube.com/watch?v=-Ha7OST5WvQ&feature=youtu.be), which covers this portion of Postman.

## Running as Chrome extension ##

1. Install Chrome and Postman, once you are done, you should be able to launch it from Chrome, as show ![here](https://github.com/shiup/apic-code-example/blob/master/postman/images/PostmanPluginChrome.png).
2. Make sure OAuth -> redirect_uri is set up properly, https://www/getpostman.com/oauth2/callback, the command is `apic config:set oauth-redirect-uri=https://www/getpostman.com/oauth2/callback`
3. Click `LAUNCH APP` from the Postman
4. Define the api that is protected by OAuth, in this case, we are using, `{{url}}/info`.
5. Select `Authorization` tab, choose `OAuth 2.0` as `Type`
  - Enter configuration for the OAuth Provider
    - Token Name : oauth-az-code-5080-760
    - Auth URL : <oauth authoriziaton endpoint>
    - Access Token URL : <oauth token endpoint>
    - Client ID : <client_id>
    - Client Secret : <client_secret>
    - Scope : <requested scope>
    - Grant Type : Authorization Code
      - the other grant type is `Client Credential`, which is less interesting
    - Select `Rquest access token locally`
  - Select `Request Token`, see ![Get New Access Token](https://github.com/shiup/apic-code-example/blob/master/postman/images/GetNewAccessToken.png)
6. If Step 5. works, you will see an entry under `Existing Tokens`
  - Select the new entry, the token information will show in `Token Details section`
  - Select `Use Token`, see ![Use Token screen](https://github.com/shiup/apic-code-example/blob/master/postman/images/UseAccessToken.png)
7. Select `Send`, and you should see the api response

The recording of the above will be posted shortly in the future.
