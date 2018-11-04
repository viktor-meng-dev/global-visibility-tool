// IMPORT EXTERNAL MODULES //
var express = require('express');                                      // Import express module

var router = express.Router();                                         // Instantiate express router object


// INDEX ROUTES //
router.get('/', function(req, res, next) {                             // Define home route
	if (!req.login_session.user) {
		res.redirect('/login');
	}
	else {
		res.render('home');
	}
});


module.exports = router;                                               // Export routes