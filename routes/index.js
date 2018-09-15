const express = require('express');
const braintree = require('braintree');
const gateway = require('../lib/gateway');

const router = express.Router();

const TRANSACTION_SUCCESS_STATUSES = [
  braintree.Transaction.Status.Authorizing,
  braintree.Transaction.Status.Authorized,
  braintree.Transaction.Status.Settled,
  braintree.Transaction.Status.Settling,
  braintree.Transaction.Status.SettlementConfirmed,
  braintree.Transaction.Status.SettlementPending,
  braintree.Transaction.Status.SubmittedForSettlement,
];

function formatErrors(errors) {
  let formattedErrors = '';

  for (var i in errors) { // eslint-disable-line no-inner-declarations, vars-on-top
    if (errors.hasOwnProperty(i)) {
      formattedErrors += `Error: ${errors[i].code}: ${errors[i].message}\n`;
    }
  }
  return formattedErrors;
}

function createResultObject(transaction) {
  let result;
  const status = transaction.status;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Success!',
      icon: 'success',
      message: 'Your test transaction has been successfully processed.',
    };
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: `Your test transaction has a status of ${status}.`,
    };
  }

  return result;
}

router.get('/', function (req, res) {
  res.redirect('/checkouts/new');
});

router.get('/checkouts/new', function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.render('checkouts/new', { clientToken: response.clientToken, msg: '' });
  });
});

router.post("/checkout", function (req, res) {
  const amount = "10";
  const nonceFromTheClient = req.body.payment_method_nonce;

  // Create a transaction
  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true,
    },
  }, function (err, result) {
    if (result.success || result.transaction) {
      res.redirect(`checkouts/${result.transaction.id}`);
    } else {
      var transactionErrors = result.errors.deepErrors();
      res.render('checkouts/error', { msg: formatErrors(transactionErrors) });
    }
  });
});

router.get('/checkouts/:id', function (req, res) {
  const transactionId = req.params.id;
  let result;

  gateway.transaction.find(transactionId, function (err, transaction) {
    result = createResultObject(transaction);
    res.render('checkouts/show', { transaction, result });
  });
});

module.exports = router;
