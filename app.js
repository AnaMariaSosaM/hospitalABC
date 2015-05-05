// server lib
var express = require('express');
var app = express();

// file system
var fs = require('fs');

// xml helper
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var builder = new xml2js.Builder();

// xml data
var patientsA;
var patientsB;

// parser body response
var bodyParser = require('body-parser');

function returnUsers (user, patientsArray) {
	var returnArray = [];

	patientsArray.forEach(function (field) {
		var userName = field.name.toString();

		if (userName != user ){
			returnArray.push(field);
		}

	});

	return returnArray;
}

// parse response
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


// routes
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/dist/index.html');
});

app.get('/api/patients', function (req, res) {
	fs.readFile(__dirname + '/data/patients.xml', function (err, data) {
		parser.parseString(data,function (err, result) {
			patientsA = result;
			res.send(patientsA);
		})
	});
})

app.get('/api/patients2', function (req, res) {
	fs.readFile(__dirname + '/data/patients2.xml', function (err, data) {
		parser.parseString(data,function (err, result) {
			patientsB = result;
			res.send(patientsB);
		})
	});
});

app.post('/delete/', function(req, res){
	var name = req.body.name;
	var newPatients = returnUsers(name, patientsA.patients.patient);

	delete patientsA.patients.patient;
	patientsA.patients.patient = newPatients;

	var xml = builder.buildObject(patientsA);

	fs.writeFile(__dirname + "/data/patients.xml", xml, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	});

	res.send("deleted");
});

// public static files
app.use(express.static('dist'));

// server
var server = app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Hospital app listening at http://%s:%s', host, port);
});