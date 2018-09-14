const braintree = require("braintree");
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');

const routes = require('./routes/index');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', routes);

app.listen(3000, () => console.log('Example app listening on port 3000!'));