// IMPORT EXTERNAL MODULES //
var express      = require('express'),                                                                                                  // Import express module
    pythonShell  = require('python-shell'),                                                                                             // Import python-shell module
    spawn        = require('child_process').spawn;                                                                                      // Import spawn method from child_process module (node built-in API)


// IMPORT INTERNAL MODULES //
var ut2fn = require('../config').ut2fn;

var router = express.Router();                                                                                                          // Instantiate express router object



// DATA ROUTES //
router.get('/upload', function(req, res, next) {                                                                                        // Define upload get route (show form)
	res.render('upload');
});


router.post('/upload', function(req, res, next) {                                                                                       // Define upload post route (send form)
	var sqlrecord = {type: req.body['upload-type'],                                                                                 // Create an object containing the upload parameters
					 data: req.body['datatype'],
					 file_name: req.files['user-file'].name,
					 notes: req.body['upload-notes'],
					 user_id: req.login_session.user['id']
					};
	req.sqlcon.query('INSERT INTO uploads SET ?', sqlrecord, function(err, result) {                                                // Store the upload details in MySQL
		if (err) throw err;
		var logId = result.insertId

		// Build correct filepath to staging area for uploaded file
		var filename = ut2fn[req.body.datatype].concat('@',                                                                     // Convert upload type display name to staging area file name
		                                               Date.now(),                                                              // Append @{current-timestamp} to filename
		                                               '.',
		                                               req.files['user-file'].name.split(".").pop()                             // Append the correct file extension matching that of the uploaded file
		                                               );

		var filepath = '../../user-uploads/data/staging-area/'.concat(filename);                                                // File path to uploaded file once in staging area directory 

		req.files['user-file'].mv(filepath, function(err, next) {                                                               // Rename and move uploaded file to staging area
			if (err) {
				throw err;
			}
			else {
					var py = spawn('python', ['../../python/main.py', filename] );
					var pyout = [];
					
					py.stdout.on('data', function(data) {
						
						var pymsg = String(data);
						pyout.push(pymsg);

						console.log(pymsg);
						
						req.io.emit('status_msg', {logId: logId, pydata: pymsg});
						
						if (pymsg === 'Done\r\n') {
							console.log('Viktor was here');
						}
					});

					py.on('close', function(code) {
							var py_status = pyout[pyout.length-1];
							var query = 'UPDATE uploads SET status="'.concat(py_status.slice(0, py_status.length - 2), 
							                                                 '" WHERE id=', 
							                                                 logId);
							req.sqlcon.query(query, function(err) {
								if (err) throw err;
							});
						});
			}
		});
	});
	res.redirect('/upload/log');
});



router.get('/upload/log', function(req, res, next) {                                                                                    // Define user log route
	query = 'SELECT uploads.id AS id,first_name, last_name,type,data,file_name,notes,uploaded_at,status ' 
			+ 'FROM uploads LEFT JOIN users ON uploads.user_id = users.id ORDER BY uploads.id DESC;'
	req.sqlcon.query(query, function(err, result, fields) {
		if (err) throw err;
		res.render('log', {upload_log: result});
		// console.log(result);
	});
});


module.exports = router;                                                                                                                // Export routes