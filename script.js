const braintree = require("braintree");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "5ft6m4bgw9kjkwff",
  publicKey: "sgwn6qtvwhzx59p6",
  privateKey: "089c1f8906edb414358836d991ab735d"
});

app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.listen(3000, () => console.log('Example app listening on port 3000!'));

app.get('/', function (req, res) {
  res.render('index', {title: 'hello'});
});

app.get('/checkouts/new', function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    let clientToken = response.clientToken;

    res.render('index', {title: 'New checkout', clientToken: clientToken});
  });
});

app.post("/checkout", function (req, res) {
  console.log(req.body);
  let amount = req.body.amount;
  let nonceFromTheClient = req.body.payment_method_nonce;

  console.log(nonceFromTheClient);
  // Use payment method nonce here

  // Verify and store in vault
  gateway.customer.create({
    firstName: "Jen",
    lastName: "Smith",
    company: "Braintree",
    email: "jen@example.com",
    phone: "312.555.1234",
    fax: "614.555.5678",
    website: "www.example.com",
    creditCard: {
      options: {
        verifyCard: true
      }
    }
  }, function (err, result) {
    result.success;
    // true

    result.customer.id;
    // e.g. 494019
  });

  // Create a transaction
  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    if (result.success || result.transaction) {
      res.redirect('checkouts/' + result.transaction.id);
    } else {
      transactionErrors = result.errors.deepErrors();
      req.flash('error', {msg: formatErrors(transactionErrors)});
      res.redirect('checkouts/new');
    }
  });
});
