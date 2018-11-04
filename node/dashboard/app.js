// IMPORT EXTERNAL MODULES //
var express    = require('express'),                                                                                  // Import express module
    bodyParser = require('body-parser'),                                                                              // Import body-parser module
    fileUpload = require('express-fileupload'),                                                                       // Import express-fileupload module
    socketio   = require('socket.io'),                                                                                // Import socket.io module
    mysql      = require('mysql'),                                                                                    // Import mysql connector module
    sessions   = require('client-sessions');                                                                          // Import client-sessions module

var app = express();                                                                                                  // Instantiate the express application object
																			
// IMPORT INTERNAL MODULES //
var setdataRoutes  = require('./routes/setdata'),
	getdataRoutes  = require('./routes/getdata'),
    indexRoutes    = require('./routes/index'),
    securityRoutes = require('./routes/security'),
    config         = require('./config');


// START NODE SERVER //
port = 3000
IP = 'localhost'
server = app.listen(port, IP, function() {
	console.log('Node server started on ' + IP + ":" + port);
});


// CONFIGURE WEBSOCKETS //
var io = socketio(server);                                                                                            // Mount the socket.io server onto the HTTP server

// ESTABLISH CONNECTION TO MYSQL DATABASE //
var sqlcon = mysql.createConnection(config.sql);


// CONFIGURE USER SESSIONS //
app.use(sessions(config.login_session));


// APPLICATION CONFIGURATION //
app.set('views', 'views');                                                                                            // Set directory storing application's views
app.set('view engine', 'ejs');                                                                                        // Set the default view engine file extension to use when omitted


// APPLICATION MIDDLEWARE //
app.use(express.static('public'));                                                                                    // Serve up static files from public directory
app.use(bodyParser.urlencoded({extended: true}));                                                                     // Parse request body to JS object
app.use(fileUpload());
app.use(function(req, res, next) { 																				
	req.io = io;                                                                                                  // Attach socket.io object to req object (all routes)
	req.sqlcon = sqlcon;                                                                                          // Attach mysql connection object to req object (all routes)
	res.locals.user = req.login_session.user;
	next();
});

// ROUTES
app.use('/', setdataRoutes);                                                                                          // Routes associated with data upload
app.use('/', getdataRoutes);                                                                                          // Routes associated with querying the database
app.use('/', indexRoutes);                                                                                            // Routes associated with static pages e.g. home, docs etc.
app.use('/', securityRoutes);                                                                                         // Routes associated with authentication and authorisation



