const mongoose = require('mongoose');
const customersSchema = mongoose.Schema(
  {
        name: String,
        email: String,
        balance: Number,
  },
  { timestamps: true },
  { minimize: false }
);

module.exports = mongoose.model('Customer', customersSchema);
