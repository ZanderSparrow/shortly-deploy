var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shortly');
  // client: 'sqlite3',
  // connection: {
  //   filename: path.join(__dirname, '../db/shortly.sqlite')
  // }
// });
// var db = require('bookshelf')(knex);
var db = mongoose.connection;
var Schema = mongoose.Schema;

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

var Url = mongoose.model('Url', urlsSchema);

var usersSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: String,
}, {collection: 'users'});

var User = mongoose.model('User', usersSchema);

// var user1 = new User({username:'fred2', password:'pass'});

// user1.save(function (err, user1) {
//   if (err) return console.error(err);
// });
// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });
module.exports = db;
module.exports.User = User;
module.exports.Url = Url;
