# Backend api to show case custom OAUTH 

This is work in progress..

## using authenticate-url 
   /basic-auth
   
   ```
   ~/apim/datapower/xsl (💃 ) curl -v -k -v 'https://datapower/poon/sb/consent/basic-auth?password=spoon&username=spoon' --user spoon:spoon
*   Trying 9.33.69.166...
* TCP_NODELAY set
* Connected to datapower (9.33.69.166) port 443 (#0)
* TLS 1.2 connection using TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* Server certificate: API Connect
* Server auth using Basic with user 'spoon'
> GET /poon/sb/consent/basic-auth?password=spoon&username=spoon HTTP/1.1
> Host: datapower
> Authorization: Basic c3Bvb246c3Bvb24=
> User-Agent: curl/7.51.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< X-Backside-Transport: OK OK
< Connection: Keep-Alive
< Transfer-Encoding: chunked
< Content-Type: application/json
< Date: Wed, 28 Dec 2016 19:10:39 GMT
< X-Global-Transaction-ID: 107761
< Authorization: Basic c3Bvb246c3Bvb24=
< User-Agent: IBM-APIConnect/API
< Accept: */*
< Via: 1.1 AQAAABuzclg-
< X-Client-IP: 172.19.0.3
< apic-authenticated-credential: cn=spoon,email=spoon@poon.com
< Access-Control-Expose-Headers: APIm-Debug-Trans-Id, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-Global-Transaction-ID
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET
< Access-Control-Allow-Credentials: false
< 
* Curl_http_done: called premature == 0
* Connection #0 to host datapower left intact
```
