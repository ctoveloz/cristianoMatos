// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

var config = {
  'consumerKey' : 'ce653cf1f55f7b22fc4d7b6597e50c97',
  'consumerSecret' : '93c2b66850c58c17',
//  'accessToken' : 'xxxxxxxx', // assign if known
//  'accessSecret' : 'xxxxxxxx', // assign if known
  'debug' : false
};

//var oDeskApi = require('../') // uncomment to use inside current package/sources
var oDeskApi = require('odesk-api') // use if package is installed via npm
//  , Auth = require('../lib/routers/auth').Auth // uncomment to use inside current package/sources
  , Auth = require('odesk-api/lib/routers/auth').Auth // use if package is installed via npm
  , rl = require('readline');

keystone.init({
	'cloudinary config': 'cloudinary://695316824865783:k0S8UONMrXUYsJj2I4Ii-yferjU@hsnbgtcq2',

	'name': 'KeystoneJS',
	'brand': 'KeystoneJS',

	'less': 'public',
	
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',
	
	'emails': 'templates/emails',
	
	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User'
	
});

// Load your project's Models

keystone.import('models');

// Your cookie secret is used to secure session cookies. This environment
// variable was added to your Heroku config for you if you used the "Deploy to
// Heroku" button. The secret below will be used for development.
// You may want to set it to something private and secure.

if (!keystone.get('cookie secret')) {
	keystone.set('cookie secret', '----change-me-to-something-secret----');
}

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

// You should ensure you have the EMAIL_HOSTNAME environment variable set on
// your production / staging servers, or images and links in your emails will 
// default to http://localhost:3000.

var email_hostname = process.env.EMAIL_HOSTNAME || 'localhost:3000';

keystone.set('email locals', {
	server: 'http://' + email_hostname,
	logo_src: 'http://' + email_hostname + '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'posts': ['posts', 'post-categories'],
	'galleries': 'galleries',
	'enquiries': 'enquiries',
	'users': 'users'
});

// a function to get access token/secret pair
function getAccessTokenSecretPair(api, callback) {
  // get authorization url
  api.getAuthorizationUrl('http://localhost/complete', function(error, url, requestToken, requestTokenSecret) {
    if (error) throw new Error('can not get authorization url, error: ' + error);
    debug(requestToken, 'got a request token');
    debug(requestTokenSecret, 'got a request token secret');

    // authorize application
    var i = rl.createInterface(process.stdin, process.stdout);
    i.question('Please, visit an url ' + url + ' and enter a verifier: ', function(verifier) {
      i.close();
      process.stdin.destroy();
      debug(verifier, 'entered verifier is');

      // get access token/secret pair
      api.getAccessToken(requestToken, requestTokenSecret, verifier, function(error, accessToken, accessTokenSecret) {
        if (error) throw new Error(error);

        debug(accessToken, 'got an access token');
        debug(accessTokenSecret, 'got an access token secret');

        callback(accessToken, accessTokenSecret);
      });
    });
  });
};

// get my data
function getUserData(api, callback) {
  // make a call
  var auth = new Auth(api);
  auth.getUserInfo(function(error, data) {
    // check error if needed and run your own error handler
    callback(error, data);
  });
}

(function main() {
  // uncomment only if you want to use your own client
  // make sure you know what you're doing
  // var client = new MyClient(config);
  // var api = new oDeskApi(null, client);

  // use a predefined client for OAuth routine
  var api = new oDeskApi(config);

  if (!config.accessToken || !config.accessSecret) {
    // run authorization in case we haven't done it yet
    // and do not have an access token-secret pair
    getAccessTokenSecretPair(api, function(accessToken, accessTokenSecret) {
      debug(accessToken, 'current token is');
      // store access token data in safe place!

      // get my auth data
      getUserData(api, function(error, data) {
        debug(data, 'response');
        console.log('Hello: ' + data.auth_user.first_name);
      });
    });
  } else {
    // setup access token/secret pair in case it is already known
    api.setAccessToken(config.accessToken, config.accessSecret, function() {
      // get my auth data
      getUserData(api, function(error, data) {
        debug(data, 'response');
        // server_time
        console.log('Hello: ' + data.auth_user.first_name);
      });
    });
  }
})();

// Start Keystone to connect to your database and initialise the web server
keystone.start();