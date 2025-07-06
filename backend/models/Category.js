const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    maxlength: 100,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  }, // null for main categories
});

module.exports = mongoose.model("Category", categorySchema);
