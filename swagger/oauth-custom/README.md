# For APIC OAuth customization

This is work in progress, on providing some pointers/ideas on how to customization APIC OAuth providers.

## banking.yaml & product.yaml

#### banking.yaml
This is the consumer api that can be used to test the oauth.  The api is protected, if a given access_token contains the appropriate scope.
For example :
  - accessing checking account information, requires 'checking' scope
  - accessing saving account information, requires 'saving' scope

#### product.yaml
This showcases how the consumer yaml and the provider yaml are packaged together. Yours would be different, depends on how you packaged them.

## directory, utility/
This contains a yaml which supports a set of functions which can be used in conjunction with the OAuth provider cusomization, and also for stand alone.
  - package the utility.yaml in a product
  - publish the product
    - since this is used for demo, there is no security definition associated with it.
    - notice some of the calls take in {username} and {password}, so if those are utilized as authenticate-url, the current oauth provider yaml has {username} == {password} == spoon

## directory, custom/
This contains 2 oauth providers.  
#### oauth-3lgeed.yaml
Shows how to use all the custom step in the oauth providers.  This includes
  - using custom login html form
    - identity extraction : custom-form
  - using authenticate-url
    - authentication : authenticate-url
  - use custom authorization/consent
    - authorization : custom-form

#### oauth-redirect.yaml
This is for `3rd party AU/AZ`.

It shows how to use 3rd party entity for authentication [AU] (optional authorization/consent [AZ]).  APIc will offload enduser authentication and authorization to a 3rd party entity.  This is done thru a 302 redirect.  

The different between this and `authenticate-url` is :
- with `authenticate-url`, APIc will gather user login information and use a trusted 3rd party to verify the credential.
- with `3rd party AU/AZ`, APIc does not gather user login, this is offload to another entity.  Once this entity is satisfied with the enduser credential, it will redirect back to APIc, so APIc can continue processing.  When end user/application interact with the 3rd party entity, APIc is out of the loop of this communication.

## directory, oauth-oidc/
This shows how to add OIDC support to the current APIc.  See README.md for more information.

It contains 2 providers..
- client_credential [application] and password grant type : oauth-2legged-oidc.yaml
- authorization code, and implicit grant type : oauth-3legged-oidc.yaml
