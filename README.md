# broadsign
broadsign api wrapper

## instructions
Initial implementation works with the `content_mgr_import_from_url` action from broadsign. This is to demonstrate the request workflow.

* `npm install` node modules
* create `private` folder
* place `ca_cert.pem` broadsign api certificate inside folder
* place `sdk_key.pem` broadsign key inside folder
* place `sdk_cert.pem` broadsign signed certificate inside folder
* run providing your API domain_id `node app --domainid 1234567`
