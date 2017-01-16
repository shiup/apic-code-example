## OAuth providers
This set of providers showcase how to add OIDC support to the current APIC OAuth provider support.

If you are going to import these 2 yamls into BlueMix Public, make sure you disable the 'Enable revocation', [see this for more info.](http://www.ibm.com/support/knowledgecenter/en/SSFS6T/com.ibm.apic.toolkit.doc/tapim_sec_api_config_scheme_oauth_endpoint.html)

On high level, this relies on the 5060, metadata support.  The challenge on supporting OIDC is the end user's credential, how to make sure it is used for generating an id_token for OIDC.

- For *client credential grant type*, there is no owner, and thus id_token does not make a whole lots of sense.
- For *resource owner grant type*, it is easy since username is part of the request.
- For *implicit & authorization grant type*, these 2 provide the most challenge, due to the fact that the owner information may not be available to the provider **assemble** process after the access_token is created.
  - There is a known issue if metadata response contains a JSON, which this example relies on, please make sure you are using APIc 5061 or later release.

### step 0.
Make sure you have stage the utility product that will be used by this exercise to support the
1. authenticate url, or
2. you can use your own authenticate url, just make sure you update the yaml correspondingly

### step 1.
Create a product to include the 2 oauth provider yamls, and the banking.yaml in the parent directory. The **apis** section of your product.yaml should look similar to this.  [Make sure you stage/publish the product.](https://www.ibm.com/support/knowledgecenter/en/SSFS6T/com.ibm.apic.toolkit.doc/capim_products.html)
```
apis:
  oauth-2legged:
    id: 5872f441e4b02da17f54b129
  banking:
    id: 5872f599e4b02da17f54b137
  oauth-3legged:
    id: 5872f534e4b02da17f54b132
```

### step 2.
Register an application, and subscribe to the product above. [See IBM APIC document on how to do this.](https://www.ibm.com/support/knowledgecenter/SSFS6T/com.ibm.apic.toolkit.doc/capim_cli_overview.html)

### step 3.
If OIDC is desired, make sure scope from the oauth requested contains `openid`

Example request :
For *resource owner grant type* :
```
~ (💃 ) curl -k https://datapower/spoon/sb/oauth-2legged/oauth2/token -d 'grant_type=password&client_id=e4dfd797-9fd9-49b7-b9db-3dde9d89471c&client_secret=xS3iJ6yT5bU0qJ6wV3aV3jF3nC7oS1vA5dT4aT4iF6tK3vU4hK&scope=checking saving openid&username=spoon&password=spoon'

{"token_type":"bearer",
"access_token":"AAEkZTRkZmQ3OTctOWZkOS00OWI3LWI5ZGItM2RkZTlkODk0NzFj9HEegxIS1Tl-xNU-fIGuAbwC0zpxc6Oh_tDbF9ePFxDCEmf15d-HNT80xUvQeAMSWedm2neCoh2zy0CfETUjlT7_YMRwHpEBQlAScPZYpoa-pLvg-m1O7rLUJjzvtfOgX2gzS6e-i8kX5t7Ap1iadx464eBj4viYru6nE1NrR8ICdMdmmiV-KxJyTC7Zg4co32qFO_FbVjLMdGODmZfBN9Htf9YkyqG4X3lmLmUzVDc9UVcF8nTpWoBp4GcyyyH3Eq9P4q22h8OiRdL5PN41eQ",
"metadata":"a:{\"for\":\"access token payload\",\"username\":\"spoon\",\"data\":\"custom data whatever you want to add here\",\"id-for-oidc\":\"cn=spoon,o=spoonOrg\"}",
"expires_in":3600,
"scope":"checking saving openid",
"refresh_token":"AAExvS_Byd9-91Nk1_6lBfgOEjCzsdFGqY64OwZjEaX03gbup5bwKfB28Gw4hEjKnvtskUYGheRcH-TkWbQJzTegG2I-bhXsTW_Yj5spPAD5GtnmkX-5iLS05r49hgnkF4sMP11ttMeEbKw5e2e1GjvBPHyCixmq6P5-j-ZWK9yL9kz_MMG4fsEeTFL-hFxnCSyTKU33od1Q8rH-ayZ0jC507i1ntC6uw_noEZNWAd0pDmusoSCD7QbtMF0cTKUqKn-WpZb1-B8-lbV_YjDlKfH53jIzlREroLby_tzx1fjO_g",
"id_token":"eyJhbGciOiJSUzUxMiJ9.eyJqdGkiOiJjZjUxYTNhNi01NjA4LTQ2ZDAtODg3YS01MWIyODc2Zjc1OTYiLCJpc3MiOiJzcG9vbi1vaWRjIiwic3ViIjoiY249c3Bvb24sbz1zcG9vbk9yZyIsImF1ZCI6ImU0ZGZkNzk3LTlmZDktNDliNy1iOWRiLTNkZGU5ZDg5NDcxYyIsImV4cCI6MTQ4NDQ1NjIwNywiaWF0IjoxNDg0NDUyNjA3fQ.LMEFfef1qcR7WAnu767Ecw4exX77Zp7Wyo6qf1cQ7AJYFpowgPNeeiTpipcQLTNVG-8FW9U-dHxATGc_lAbz6NB667FaU7yQqyt2vKkV_MnJIBkvrls30Qj61y_cWh92bg5WSgbO8xMR1floJmQRSypF_ZGWN7ZHuD6-CDm498qRGhrkk2qbC9xQuT2AqBLWgis_TVUpJsDeD-vg8dV74u4WIIn8Ke0NenheSE43GkJSkXZmsf6finTGpIJpxClONiXiZZP98U40uUky3wokQsOJbhSvv2F_YdSgaoG8M-_gMmVRy09C3JKzczsx2co7Jfso6dLKextUk7X4p9d6lqDB7-f-vwsQ2wsW9_VZtPssSpSvdiM9C8GyyZi-8KvKtEyuV41r3fVAJRk0Ugg6VGCHG4hZ7KWRShZgW4rw7CJ5t3AuCzwlxDSYUc_bGCS6wG9gXOjODuZJt0hEDFDNiIT9v_DFkZiEr3rRD4yNiPFfTed30psGA5SAISpKMQknrhvLSwfAznJTBrnUs5GezeW7y8cqNwXQUnlQaj7WtdvzAFexDp09yBNhnOfk3NEyIo03a0nUFnU9wnpwi45K9wrkVyp9yXiPp_ShL1tFcSRTw0nrv7p5acljMdwQhqnG4P2TBvZglOMWKw6I2F1K5qVxKJehcSvssvlMOoNj8OA"}
~ (💃 )
```

For implicit grant type:
```
~ (💃 )  curl -k -v https://datapower/spoon/sb/oauth-3legged/oauth2/authorize -d 'response_type=token&client_id=e4dfd797-9fd9-49b7-b9db-3dde9d89471c&client_secret=xS3iJ6yT5bU0qJ6wV3aV3jF3nC7oS1vA5dT4aT4iF6tK3vU4hK&scope=checking saving openid&redirect_uri=https://www.getpostman.com/oauth2/callback' --user spoon:spoon
*   Trying 192.168.1.107...
........
>
* upload completely sent off: 216 out of 216 bytes
< HTTP/1.1 302 Processed
........
< Location: https://www.getpostman.com/oauth2/callback#
access_token=AAEkZTRkZmQ3OTctOWZkOS00OWI3LWI5ZGItM2RkZTlkODk0NzFjPZh1UULU72TojmQs_C3KWO0Ul42ynf98vEMoAW9NLVHJI6pFuv1Mks3Gp8QUnp7MfPRtgw-hOk9iMy1XGtw10avsAMNkMOnRgpGX7DaKcvdorp_1bSCh7q02odWdLq71nBn4aFAeT2ueQNqiV8MviOX721Zsyf2WFARR5hnUH3a2LT1M7Noq7O5jzC-zQP9u8XDRFEiGNC__3g-kaVjuEsDofRXU_mFslOVqh2CoyzqKF5HlsI-3Qa5poVj2dgxNk5-jVKLYTZuWrCe5YzvUVg
&expires_in=3600
&scope=checking+saving+openid
&token_type=bearer
&metadata=...
&id_token=eyJhbGciOiJSUzUxMiJ9.eyJqdGkiOiJjZDAyMWUyZS05ZTBhLTRmNDUtOTAwNy0wNTUwN2I0N2Q0ZDMiLCJpc3MiOiJzcG9vbiBvaWRjIiwic3ViIjoiY249c3Bvb24sbz1zcG9vbk9yZyIsImF1ZCI6ImU0ZGZkNzk3LTlmZDktNDliNy1iOWRiLTNkZGU5ZDg5NDcxYyIsImV4cCI6MTQ4NDQ1NjQyMywiaWF0IjoxNDg0NDUyODIzfQ.mzv7tvfQtHP_SeGtYpLIluIOX1P_dqrfYw-VKgtLQHgBjf9MCyCViWxzyWEBsirQpcVC7Jz-6l85E7E65aZnNSSAn6XgSJOqe7vtwzisbEoRyMt2tPkokXnZaexKfM651xNunlnaidn8NGx2Na0rc8aAqvZq3WWXiBZ7-AYAdMm8BC6ILemvHJkHiQlwnwRF5gtLnazFBqFAnaUphfgCDMY4kCsQ-y-54CrAGddEfkCYMe7-GEeFdULKI4BdALIJLcL3Izqfzsky_jC5M6_gAA-H46tyJ1IoaF1SnKusPBgDH-ruDI2FNcq8TSgwr1l7-0iqkzAT3oIyWyrblQGHKG_kTpuhTTNhreebObHZ7COD2wVEDKUZRnJpQqIRAttBvV2VreOwaQ2gfCtEBVwAmBX45X0hwkNy_ZQinC_LM2QnJUcwCY74eu4242wVPiiK-2_ldOtEjEQK18e6dJUIjn1DrZYR5uCU99FzTvfHBd-tTOKBJZb-TUJlFAtR6RhVrQ4odvQ6k9semRec22P8doEgx4rktkha-ULkITIZn7T8iFWLFXZGWq6o7LjqM6lFTThOTtghiBqMnwfo6kaaxvOyaalnaJ7rjbVLA_o1b3eblKqp7qPvH5kdCppTfjJsg7wXPh60n2nGEjdZflZaQkL8n0dy2UztTC_OFu4E8Ac
...
~ (💃 )
```

[note that this utilizes the utility apis hosted here](https://github.com/shiup/apic-code-example/tree/master/swagger/oauth-custom/utility)
