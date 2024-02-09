const mongoose = require('mongoose');

const DonacionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  typeDonation: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: 'vigente', 
    required: true,
  },
});

const Donation = mongoose.model('Donation', DonacionSchema);

module.exports = Donation;