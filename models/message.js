const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    text: String,
    sender: String,
    reciever:String,
    createdAt: { type: Date, default: Date.now },
  });
  
  const Message = mongoose.model('Message', messageSchema);
  
  module.exports =  Message