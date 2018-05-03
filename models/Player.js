var mongoose = require(process.cwd() + '/config/config');
// create instance of Schema
var mongoSchema = mongoose.Schema;
// create schema
var playerSchema = {
    "pid": String,
    "name": String,
    "teamName": String,
    "pic": String


};
// create model if not exists.
module.exports = mongoose.model('Player', playerSchema, 'player');