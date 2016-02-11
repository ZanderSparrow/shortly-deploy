var path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/shortly');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we\'re connected');
});

var urlsSchema = new Schema({
  url: {type: String, unique: true},
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
}, {collection: 'urls'});

var usersSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: String,
}, {collection: 'users'});

var Url = mongoose.model('Url', urlsSchema);
var User = mongoose.model('User', usersSchema);

module.exports = db;
module.exports.User = User;
module.exports.Url = Url;
module.exports.urls = urlsSchema;
