// IMPORT EXTERNAL MODULES //
var express = require('express');                                                                                     // Import express module

var router = express.Router();                                                                                        // Instantiate express router object

// IMPORT INTERNAL MODULES //
var config = require('../config');




// GET DATA ROUTES //
router.get(Object.keys(config.table2fields).map(x => '/querydb/' + x), function(req, res, next) {
	var table = req.url.split("/").pop();
	var fields = Object.keys(config.table2fields[table])
	var sqlFields = Object.values(config.table2fields[table])
	req.sqlcon.query('SELECT * FROM ' + table, function(err, result) {
		res.render('querydb', {fields: fields, sqlFields: sqlFields, data: result});
	});
	// res.render('querydb', {fields: fields});
});

router.get('/querydb', function(req, res, next) {
	res.redirect('/querydb/pol');
});

module.exports = router;                                                                                              // Export routes