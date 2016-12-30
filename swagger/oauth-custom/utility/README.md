# What is this for

This is created to provide a *pseudo backend* to showcase how the OAuth customization work.  
To use this, 
- create a product
- publish the product to your catalog

And start using it.

Refer to the comment in the utility.yaml for the function that can be customized for the oauth testing.

Note that this is work in progress, and as time allowed, and more customization is created, I will enhance this file.  And feel free to contribute to it too.

## using authenticate-url generic, /basic-auth-generic   
```
~/apim/datapower/xsl (💃 ) curl -v -k -v 'https://datapower/poon/sb/consent/basic-auth-generic?password=spoon&username=spoon' --user spoon:spoon
*   Trying 9.33.69.166...
...
* TLS 1.2 connection using TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
...
> 
< HTTP/1.1 200 OK
....
```
## using authenticate-url, /basic-auth   
```
~/apim/datapower/xsl (💃 ) curl -v -k -v 'https://datapower/poon/sb/consent/basic-auth?password=spoon&username=spoon' --user spoon:spoon
*   Trying 9.33.69.166...
...
* TLS 1.2 connection using TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
...
> 
< HTTP/1.1 200 OK
....
< api-authenticated-credential: cn=spoon,email=spoon@poon.com
....

```
## using authenticate-url, /basic-auth-metadata
```
~/apim/datapower/xsl (💃 ) curl -v -k -v 'https://datapower/poon/sb/consent/basic-auth-metadata?password=spoon&username=spoon' --user spoon:spoon
...
* Server auth using Basic with user 'spoon'
> GET /poon/sb/consent/basic-auth-metadata?password=spoon&username=spoon HTTP/1.1
...
> 
< HTTP/1.1 200 OK
...
< api-authenticated-credential: cn=spoon,email=spoon@poon.com
< api-oauth-metadata-for-accesstoken: custom metadata for the accesstoken for user spoon
< api-oauth-metadata-for-payload: custom payload data for the accesstoken for user spoon
...
```
## using the custom login form
```
~/docker/apiconnect-docker/sni-proxy (💃 ) curl -k 'https://datapower/spoon/sb/utility/custom-login-form'
...
< HTTP/1.1 200 OK
<html lang="en" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>Spoon Company</head><body><form method="POST" enctype="application/x-www-form-urlencoded" action="authorize"><h1>Please sign in</h1><p>Username </p><p style="text-indent: 0em;"><input type="text" name="username" required="required"/></p><p>Password </p><p style="text-indent: 0em;"><input type="password" name="password" required="required"/></p><EI-INJECT-HIDDEN-INPUT-FIELDS/><p style="text-indent: 2em;"> <button id="login_button" type="submit" name="login" value="true">Log in</button> </p><EI-LOGINFIRSTTIME><p>If you have forgotten your user name or password, contact your system administrator.</p></EI-LOGINFIRSTTIME><EI-LOGINFAILED><p style="color: red">At least one of your entries does not match our records. If you have forgotten your user name or password, contact your system administrator.</p></EI-LOGINFAILED><EI-INTERNAL-CUSTOM-FORM-ERROR/></form></body></html>
~/docker/apiconnect-docker/sni-proxy (💃 )
```
## using the custom consent/authorization form
```
~/docker/apiconnect-docker/sni-proxy (💃 ) curl -k -v 'https://datapower/spoon/sb/utility/custom-consent-form'
...
< HTTP/1.1 200 OK
...
<html lang="en" xml:lang="en"><head><title>Request for permission</title></head><body class="customconsent"><div><div><form method="post" enctype="application/x-www-form-urlencoded" action="authorize"><input type="hidden" name="original-url" value="A"/><input type="hidden" name="client_id" value="A"/><AZ-INJECT-HIDDEN-INPUT-FIELDS/><p>Greeting..</p><DISPLAY-RESOURCE-OWNER/><p>This app </p><OAUTH-APPLICATION-NAME/><p> would like to access your data.</p><div><button class="cancel" type="submit" name="approve" value="false">No Thanks</button><button class="submit" type="submit" name="approve" value="true">Allow Access</button></div></form></div><AZ-INTERNAL-CUSTOM-FORM-ERROR/></div></body></html>
~/docker/apiconnect-docker/sni-proxy (💃 ) 
```
