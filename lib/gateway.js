'use strict';

var braintree = require('braintree');
var gateway;

// require('dotenv').load();
// environment = process.env.BT_ENVIRONMENT.charAt(0).toUpperCase() + process.env.BT_ENVIRONMENT.slice(1);

gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "5ft6m4bgw9kjkwff",
  publicKey: "sgwn6qtvwhzx59p6",
  privateKey: "089c1f8906edb414358836d991ab735d"
});

module.exports = gateway;