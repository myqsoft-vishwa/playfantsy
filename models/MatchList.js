var mongoose = require(process.cwd() + '/config/config');
// create instance of Schema
var mongoSchema = mongoose.Schema;
// create schema
var matchListSchema = {
    "unique_id": String,
    "team_2": String,
    "team_1": String,
    "type": String,
    "date": String,
    "dateTimeGMT": String,
    "squad": String,
    "matchStarted": String

};
// create model if not exists.
module.exports = mongoose.model('MatchList', matchListSchema, 'matches'); 