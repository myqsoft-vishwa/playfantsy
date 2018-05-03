var mongoose = require(process.cwd() + '/config/config');
// create instance of Schema
var mongoSchema = mongoose.Schema;
// create schema
var teamPicSchema = {
    "name": String,
    "pic": String


};
// create model if not exists.
module.exports = mongoose.model('TeamPic', teamPicSchema, 'teamlogo');