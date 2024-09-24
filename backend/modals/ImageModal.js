const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now }
  });
  
   module.exports=mongoose.model('Images', ImageSchema);