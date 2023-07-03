const router = require('express').Router();
const Customer=require('../model/Customer');
const historymodel=require('../model/History');

// /CREATE
router.post("/create",async (req, res) => {
  const newCustomer = new Customer(req.body);
  try {
    const savedCustomer = await newCustomer.save();
    res.status(200).json(savedCustomer);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/', (req, res) => {
  Customer.find({}, function (err, customer) {
      res.render('home', {
        list: customer,
      });
      // console.log(customer)
    });
  });
  router.get('/view', (req, res) => {
    Customer.find({}, function (err, customer) {

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
      const senderamount = await Customer.findOne({ name: from });
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
      const senderamount = await Customer.findOne({ name: from });
      if (amount < senderamount.balance) {
        await Customer.findOneAndUpdate(
          {
            name: name,
          },
          {
            $inc: { balance: amount },
          }
        );
        await Customer.findOneAndUpdate(
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