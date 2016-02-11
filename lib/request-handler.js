var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var db = require('../app/config');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  var links = db.Url.find({}, function(err, urls) {
    res.send(200, urls);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  db.Url.findOne({'url': uri}, function(err, url) {
    if (err) return console.error(err);
    if (url) {
      res.send(200, url);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var shasum = crypto.createHash('sha1');
        shasum.update(uri);
        var code = shasum.digest('hex').slice(0, 5);

        new db.Url({'url': uri, 'title': title, 'baseUrl': req.headers.origin, 'code':code}).save(function(err, url) {
          if (err) return console.error(err);
          res.send(200, url);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // Need to query mongo
  db.User.findOne({ username: username }, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      util.comparePassword(password, user.password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  
  util.hashPassword(username, password).then(function(user) {
    util.createSession(req, res, user);    
  });

};

exports.navToLink = function(req, res) {
  db.Url.find({'code': req.params[0]}, function(err, url) {
    if (!url[0] || url[0] === 'favicon.ico') {
      res.redirect('/');
    } else {
      res.redirect(url[0].url);  
    }
  });
};