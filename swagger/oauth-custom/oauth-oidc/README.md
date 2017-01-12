## OAuth providers
This set of providers showcase how to add OIDC support to the current APIC OAuth provider support.

### step 1.
Create a product to include the 2 providers API, and the banking.yaml in the parent directory

### step 2.
Register an application, and subscribe to the provide

### step 3.
If OIDC is desired, make sure scope requested contains `openid`

[note that this utilizes the utility apis hosted here](https://github.com/shiup/apic-code-example/tree/master/swagger/oauth-custom/utility)
