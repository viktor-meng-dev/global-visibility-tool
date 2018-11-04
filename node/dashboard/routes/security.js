// IMPORT EXTERNAL MODULES //
var express = require('express'),                                                                                                     // Import express module
    bcrypt  = require('bcryptjs');                                                                                                    // Import bcryptjs module

var router = express.Router();                                                                                                        // Instantiate express router object


// AUTHENTICATION ROUTES //
router.get('/register', function(req, res, next) {                                                                                    // Define registration get route (show form)
	res.render('register');
});

router.post('/register', function(req, res, next) {                                                                                   // Define registration post route
	var hash = bcrypt.hashSync(req.body.password, 14);                                                                            // Hash user password - BWF hardcoded to 14 (set to env in prod)
	req.body.password = hash;
		
	req.sqlcon.query('INSERT INTO users SET ?', req.body, function(err, result, fields) {
		if (err) throw err;
	});
	res.redirect('/login');                                                                                                       // If registration is successful, redirect to login page
});


router.get('/login', function(req, res, next) {                                                                                       // Define login get route (show form)
	res.render('login');
});


router.post('/login', function(req, res, next) {                                                                                      // Define login post route
	req.sqlcon.query('SELECT * FROM users WHERE email='.concat('"', req.body.email, '"'), 
					 function(err, result, fields) {
					 	if (err) throw err;

					 	if (result.length === 0) {
					 		console.log('USER IS NOT REGISTERED');
					 		res.redirect('/login');                                                       // If email does not exist, redirect to login show page
					 	}
					 	else if (!bcrypt.compareSync(req.body.password, result[0].password)) {
					 		console.log('INCORRECT PASSWORD');                                            // If password is incorrect, redirect to login show page
					 		res.redirect('/login');
					 	}
					 	else {
					 		result[0].password = undefined;                                               // Remove the password from the user details
					 		req.login_session.user = result[0];                                           // Attach details of logged in user to req.login_session object
					 		res.redirect('/');                                                            // If login successful, redirect to homepage
					 	}		 	
					 });
});


router.get('/logout', function(req, res, next) {                                                                                      // Define logout route
	req.login_session.reset();                                                                                                    // Reset the req.login_session object to end login session
	res.redirect('/');                                                                                                            // Redirect to home page
});

module.exports = router;                                                                                                              // Export routes