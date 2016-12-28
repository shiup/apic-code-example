# Backend api to show case custom OAUTH 

This is work in progress..

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
