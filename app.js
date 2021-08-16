const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');

mongoose.set('useFindAndModify', false);
mongoose.connect(
  process.env.MONGO_URL ||
    'mongodb+srv://meenalgupta2306:meenal@cluster0.hudms.mongodb.net/banking?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const port = process.env.PORT || 4000;

const customersSchema = {
  name: String,
  email: String,
  balance: Number,
};
const historySchema = {
  from: String,
  name: String,
  amount: Number,
  date: { type: Date, default: Date.now },
};
app.use('/static', express.static('static'));
const customer = mongoose.model('customer', customersSchema);
const historymodel = mongoose.model('historymodel', historySchema);

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  customer.find({}, function (err, customer) {
    res.render('home', {
      list: customer,
    });
  });
});
app.get('/view', (req, res) => {
  customer.find({}, function (err, customer) {
    res.render('index', {
      list: customer,
    });
  });
});
app.get('/transaction', (req, res) => {
  res.render('transaction');
});

app.post('/transfer', async (req, res) => {
  const name = req.body.name;
  const from = req.body.from;
  const amount = req.body.amount;
  try {
    const senderamount = await customer.findOne({ name: from });
    if (amount > 0 && amount < senderamount.balance && name != from) {
      var historydata = new historymodel(req.body);
      await historydata.save(function (err, doc) {
        if (err) return console.log(err);
      });
    }
    if (amount == 0 || amount < 0 || senderamount.balance < amount)
      res.redirect('/view');
    else res.redirect('/transaction');
  } catch {
    console.log('could not save');
  }
  try {
    const senderamount = await customer.findOne({ name: from });
    if (amount < senderamount.balance) {
      await customer.findOneAndUpdate(
        {
          name: name,
        },
        {
          $inc: { balance: amount },
        }
      );
      await customer.findOneAndUpdate(
        {
          name: from,
        },
        {
          $inc: { balance: -amount },
        }
      );
    }
  } catch {
    res.send('cannot Transact right now. Please try again later');
  }
});
app.get('/transfer', (req, res) => {
  historymodel.find({}, function (err, doc) {
    if (err) console.log(err);
    res.send(doc);
  });
});

app.listen(port, function () {
  console.log(`the application started on port ${port}`);
});
