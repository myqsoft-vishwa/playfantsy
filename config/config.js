var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
//mongoose.connect('mongodb://localhost:27017/sixsense');
module.exports = mongoose;