const router = require('express').Router();
const customer=require('../model/Customer');
const historymodel=require('../model/History');


router.get('/', (req, res) => {
    customer.find({}, function (err, customer) {
      res.render('home', {
        list: customer,
      });
    });
  });
  router.get('/view', (req, res) => {
    customer.find({}, function (err, customer) {
      res.render('index', {
        list: customer,
      });
    });
  });
  router.get('/transaction', (req, res) => {
    res.render('transaction');
  });
  
  router.post('/transfer', async (req, res) => {
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
  router.get('/transfer', (req, res) => {
    historymodel.find({}, function (err, doc) {
      if (err) console.log(err);
      res.send(doc);
    });
  });

  module.exports = router;