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


// flag
var isPatientAInXml = false;
var isPatientBInXml = false;

function returnUsersA (user, patientsArray) {
	var returnArray = [];

	patientsArray.forEach(function (field) {
		var userName = field.name.toString();

		if (userName != user ){
			returnArray.push(field);
		}else{
			isPatientAInXml = true;
		}

	});

	return returnArray;
}

function editUsersA (user, patientsArray, name, gender, ssn, dob, address, zipCode, city, state ) {
	var returnArray = [];

	patientsArray.forEach(function (field) {
		var userName = field.name.toString();

		if (userName == user ){
			field.name = name;
			field.gender = gender;
			field.ssn = ssn;
			field.date_of_birth = dob;
			field.address = address;
			field.zip_code = zipCode;
			field.city = city;
			field.state = state;
			returnArray.push(field);
		}else{
			returnArray.push(field)
		}

	});

	return returnArray;
}

function returnUsersB (user, patientsArray) {
	var returnArray = [];

	patientsArray.forEach(function (field) {
		var userName = field.first_name.toString() + " " + field.last_name.toString();

		if (userName != user ){
			returnArray.push(field);
		}else{
			isPatientBInXml = true;
		}

	});
	return returnArray;
}

function deleteAFromXML (name, collection) {
	var newPatients = returnUsersA(name, patientsA.patients.patient);

	delete collection.patients.patient;
	collection.patients.patient = newPatients;

	return builder.buildObject(collection);
}

function updateAFromXML (name, collection, username, gender, ssn, dob, address, zipCode, city, state) {
	var newPatients = editUsersA(name, patientsA.patients.patient, username, gender,ssn, dob, address, zipCode, city, state);

	delete collection.patients.patient;
	collection.patients.patient = newPatients;

	return builder.buildObject(collection);
}

function deleteBFromXML (name, collection) {
	patientsConcat = patientsB.hospital.physician[0].patient;
    patientsConcat = patientsConcat.concat(patientsB.hospital.physician[1].patient)
	var newPatients = returnUsersB(name, patientsConcat);
	
	patientsConcatCollection = collection.hospital.physician[0].patient;
	patientsConcatCollection = patientsConcatCollection.concat(collection.hospital.physician[1].patient)
	
	
	delete patientsConcatCollection
	patientsConcatCollection = newPatients;
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
	    if (isPatientAInXml) {
	    	console.log("The file was saved!");
	    	res.send("The patient " + user + " was successfully deleted");
	    	isPatientAInXml = false;
	    }else{
	    	console.log("The file wasn't saved!");
	    	res.send( "The patient " + user + " isn't in the xml file");
	    }
	});
});

app.post('/deleteB/:user', function(req, res){
	// el nombre del usuario viene en los parametros
	var user = req.params.user;
	var xml = deleteBFromXML(user, patientsB);

	fs.writeFile(__dirname + "/data/patients2.xml", xml, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    if (isPatientBInXml) {
	    	console.log("The file was saved!");
	    	res.send("The patient " + user + " was successfully deleted");
	    	isPatientBInXml = false;
	    }else{
	    	console.log("The file wasn't saved!");
	    	res.send( "The patient " + user + " isn't in the xml file");
	    }
	});

	
});


app.post('updateA/', function (req, res) {
	var user = req.params.user;
	var name = req.body.name;
	var	gender = req.body.gender;
	var	ssn = req.body.ssn;
	var	date_of_birth = req.body.date_of_birth;
	var	address = req.body.address;
	var	zip_code = req.body.zip_code;
	var	city = req.body.city;
	var	state = req.body.state;
	var xml = updateAFromXML(user, patientsA, name, gender, ssn, date_of_birth, address, zip_code, city, state);

	fs.writeFile(__dirname + "/data/patients.xml", xml, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	 
	    	console.log("The file was update!");
	    	res.send("The patient " + user + " was successfully updated");
	    
	
	});
	/*
	- ok,recibir el objeto y asignar los campos a variables
		ej: req.body.name, req.body.address, etc...
	- ok,buscar en patientsA al encotrar asignar las variables a los campos
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