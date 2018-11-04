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
		// console.log(result[0][config.table2fields[table][fields[0]]]);
		// console.log(result[0][config.table2fields[table][fields[1]]]);
		// res.render('querydb', {fields: fields, data: result});
		// console.log(sqlFields);
		// res.render('querydb', {fields: fields, sqlFields: sqlFields, data: result});

		// console.log(result.length);

		// for (var i = 0; i < result.length; i++) {
		// 	var row = result[i];
		// 	for (var j = 0; j < sqlFields.length; j++) {
		// 		console.log(result[i][sqlFields[j]]);
		// 	}
		// }
		res.render('querydb', {fields: fields, sqlFields: sqlFields, data: result});
	});
	// res.render('querydb', {fields: fields});
});

router.get('/querydb', function(req, res, next) {
	res.redirect('/querydb/pol');
});

module.exports = router;                                                                                              // Export routes