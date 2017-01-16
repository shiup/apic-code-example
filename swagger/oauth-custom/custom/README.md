## OAuth providers
This provider shows how the custom support works in OAuth for IBM APIC.

If you are going to import this provider yaml into BlueMix Public, make sure you disable the 'Enable revocation', [see this for more info.](http://www.ibm.com/support/knowledgecenter/en/SSFS6T/com.ibm.apic.toolkit.doc/tapim_sec_api_config_scheme_oauth_endpoint.html)

This provider shows :
- host a custom login page on a 3rd party
- how to use authenticate url, and return an authenticated credential for the authenticated user..
  - for example :
    - user : **spoon**, with password : password
    - after authenticated successfully, customer would like to use **cn=spoon,email=spoon@poon.com** as the user credential, instead of **spoon**.
- host a custom authorization/consent form

### step 0.
Make sure you have stage the utility product that will be used by this exercise to support the
1. [custom user login form](http://www.ibm.com/support/knowledgecenter/SSFS6T/com.ibm.apic.toolkit.doc/task_apionprem_Create_a_custom_login_form.html)
2. [authenticate url](http://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/com.ibm.apic.toolkit.doc/con_auth_url.html)
3. [custom authorization/consent form](http://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/com.ibm.apic.toolkit.doc/task_apionprem_create_a_custom_authorization_form.html)

### step 1.
Create a product to include the oauth provider yaml, and the banking.yaml in the parent directory. The **apis** section of your product.yaml should look similar to this.  [Make sure you stage/publish the product.](https://www.ibm.com/support/knowledgecenter/en/SSFS6T/com.ibm.apic.toolkit.doc/capim_products.html)
```
apis:
  banking:
    id: 5872f599e4b02da17f54b137
  oauth-3legged:
    id: 5872f534e4b02da17f54b132
```

### step 2.
Register an application, and subscribe to the product above. [See IBM APIC document on how to do this.](https://www.ibm.com/support/knowledgecenter/SSFS6T/com.ibm.apic.toolkit.doc/capim_cli_overview.html)

### step 3.
Issue the request.
For implicit grant type:
```
~ (💃 )  curl -k https://datapower/spoon/sb/oauth-3legged/oauth2/authorize -d 'response_type=token&client_id=e4dfd797-9fd9-49b7-b9db-3dde9d89471c&client_secret=xS3iJ6yT5bU0qJ6wV3aV3jF3nC7oS1vA5dT4aT4iF6tK3vU4hK&scope=checking saving openid&redirect_uri=https://www.getpostman.com/oauth2/callback'

<html lang="en" xml:lang="en"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">Spoon Company</head><body><form method="POST" enctype="application/x-www-form-urlencoded" action="authorize"><h1>Please sign in</h1><p>Username </p><p style="text-indent: 0em;"><input type="text" name="username" required="required"></p><p>Password </p><p style="text-indent: 0em;"><input type="password" name="password" required="required"></p><input type="hidden" name="response_type" value="token"><input type="hidden" name="client_id" value="e4dfd797-9fd9-49b7-b9db-3dde9d89471c"><input type="hidden" name="state" value=""><input type="hidden" name="scope" value="checking saving openid"><input type="hidden" name="redirect_uri" value="https://www.getpostman.com/oauth2/callback"><input type="hidden" name="original-url" value="/spoon/sb/oauth-3legged/oauth2/authorize"><input type="hidden" name="apim-source" value="html-login"><p style="text-indent: 2em;"> <button id="login_button" type="submit" name="login" value="true">Log in</button> </p><p>If you have forgotten your user name or password, contact your system administrator.</p></form></body></html>
~ (💃 )
....
~ (💃 )  curl -k https://datapower/spoon/sb/oauth-3legged/oauth2/authorize -d 'response_type=token&client_id=e4dfd797-9fd9-49b7-b9db-3dde9d89471c&client_secret=xS3iJ6yT5bU0qJ6wV3aV3jF3nC7oS1vA5dT4aT4iF6tK3vU4hK&scope=checking saving openid&redirect_uri=https://www.getpostman.com/oauth2/callback' --user spoon:spoon

<html lang="en" xml:lang="en"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"><title>Request for permission</title></head><body class="customconsent"><div><div><form method="post" enctype="application/x-www-form-urlencoded" action="https://datapower/spoon/sb/oauth-3legged/oauth2/authorize"><input type="hidden" name="original-url" value="https://172.19.0.2:443/spoon/sb/oauth-3legged/oauth2/authorize"><input type="hidden" name="client_id" value="e4dfd797-9fd9-49b7-b9db-3dde9d89471c"><input type="hidden" name="dp-state" value="1sZU7p26OK6J7cFtVdb2mA"><input type="hidden" name="resource-owner" value="cn=spoon,email=spoon@poon.com"><input type="hidden" name="dp-data" value="0-1:159150118:159150418:token:A14sU71mKSA:"><input type="hidden" name="redirect_uri" value="https://www.getpostman.com/oauth2/callback"><input type="hidden" name="scope" value="checking saving openid"><input type="hidden" name="response_type" value="token"><p>Greeting..</p>spoon<p>This app </p>OIDCOAuthTestApplication<p> would like to access your data.</p><div><button class="cancel" type="submit" name="approve" value="false">No Thanks</button><button class="submit" type="submit" name="approve" value="true">Allow Access</button></div></form></div></div></body></html>
~ (💃 )
```

[note that this utilizes the utility apis hosted here](https://github.com/shiup/apic-code-example/tree/master/swagger/oauth-custom/utility)
