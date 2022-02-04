const mongoose = require('mongoose');
const historySchema = mongoose.Schema(
  {from: String,
    name: String,
    amount: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
  { minimize: false }
);

module.exports = mongoose.model('History', historySchema);
