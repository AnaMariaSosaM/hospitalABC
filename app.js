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
var bodyParser = require('body-parser')

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

function deleteAFromXML (name, collection) {
	var newPatients = returnUsers(name, patientsA.patients.patient);

	delete collection.patients.patient;
	collection.patients.patient = newPatients;

	return builder.buildObject(collection);
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
			res.send(patientsA = result);
		});
	});
})

app.get('/api/patients2', function (req, res) {
	fs.readFile(__dirname + '/data/patients2.xml', function (err, data) {
		parser.parseString(data, function (err, result) {
			patientsB = result;
			res.send(patientsB);
		});
	});
});

app.post('/delete/:user', function(req, res){
	// el nombre del usuario viene en los parametros
	var user = req.params.user;
	var xml = deleteAFromXML(user, patientsA);

	fs.writeFile(__dirname + "/data/patients.xml", xml, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("The file was saved!");
	});

	res.send(user + " deleted");
});

app.post('updateA/', function (req, res) {
	/*
	- recibir el objeto y asignar los campos a variables
		ej: req.body.name, req.body.address, etc...

	- buscar en patientsA al encotrar asignar las variables a los campos
		para buscar recuerda el foreach linea 23

	- guardar el archivo patientA en patient.xml
		builder (para construir el xml)...
		fs.writefile (para guardar archivos).....

	- si todo fue exitoso regresar mensaje de exito
		res.send()

	- de lo contrario regresar error
		res.send()
	*/
})

// public static files
app.use(express.static('dist'));

// server
var server = app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Hospital app listening at http://%s:%s', host, port);
});