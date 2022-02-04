require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongodb connected !!!');
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('static'));
app.use('/', require('./router/routes'));

app.listen(port, function () {
  console.log(`the application started on port ${port}`);
});
