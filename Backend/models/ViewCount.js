const mongoose = require('mongoose');

const viewCountSchema = new mongoose.Schema({
  views: {
    type: Number,
    default: 0,
  },
});

const ViewCount = mongoose.model('ViewCount', viewCountSchema);

module.exports = ViewCount;

