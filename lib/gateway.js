const braintree = require('braintree');

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: '5ft6m4bgw9kjkwff',
  publicKey: 'sgwn6qtvwhzx59p6',
  privateKey: '089c1f8906edb414358836d991ab735d',
});

module.exports = gateway;
