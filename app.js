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

// patients functions
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
		var userName = field.name;
		var temp = {}
		if (userName == user) {
			temp.name = [name];
		 	temp.gender = [gender];
		 	temp.ssn = [ssn];
		 	temp.date_of_birth = [dob];
		 	temp.address = [address];
		 	temp.zip_code = [zipCode];
		 	temp.city = [city];
		 	temp.state = [state];
			returnArray.push(temp);
		}else{
			returnArray.push(field)
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

// patients2 functions
function editUsersB (user, patientsArray, first_name, middle_initial , last, ssn, dob, address) {

	var returnArray = [];
	patientsArray.forEach(function (field) {
		var userName = field.first_name.toString() + " " + field.last_name.toString();
		var temp = {}
		if (userName == user) {
			temp.first_name = [first_name];
			temp.middle_initial = [middle_initial];
			temp.last_name = [last];
		 	temp.social_security = [ssn];
		 	temp.dob = [dob];
		 	temp.address = [address];
			returnArray.push(temp);
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

function updateBFromXML (name, collection, first_name, middle_initial ,last_name, social_security, dob, address, doctor) {
	
	if (doctor == collection.hospital.physician[0].name){
		
		var newPatients = editUsersB(name, patientsB.hospital.physician[0].patient,first_name, middle_initial ,last_name, social_security, dob, address);
		
		delete collection.hospital.physician[0].patient
		collection.hospital.physician[0].patient = newPatients;
		return builder.buildObject(collection);
	}else if(doctor == collection.hospital.physician[1].name){
		var newPatients = editUsersB(name, patientsB.hospital.physician[1].patient,first_name, middle_initial ,last_name, social_security, dob, address);
		
		delete collection.hospital.physician[1].patient
		collection.hospital.physician[1].patient = newPatients;
		return builder.buildObject(collection);
	}
}

function deleteBFromXML (name, collection, doctor) {
	
	if (doctor == collection.hospital.physician[0].name){
		var newPatients = returnUsersB(name, patientsB.hospital.physician[0].patient);
		
		delete collection.hospital.physician[0].patient
		collection.hospital.physician[0].patient = newPatients;
		return builder.buildObject(collection);
	}else if(doctor == collection.hospital.physician[1].name){
		var newPatients = returnUsersB(name, patientsB.hospital.physician[1].patient);
		
		delete collection.hospital.physician[1].patient
		collection.hospital.physician[1].patient = newPatients;
		return builder.buildObject(collection);
	}
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

app.post('/deleteB/:user/:doctor', function(req, res){
	// el nombre del usuario viene en los parametros
	var user = req.params.user;
	var doctor = req.params.doctor;
	var xml = deleteBFromXML(user, patientsB, doctor);
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

app.post('/updateA/:user', function (req, res) {

	var user = req.params.user;
	var name = req.body.nameInput;
	var	gender = req.body.genderInput;
	var	ssn = req.body.ssnInput;
	var	date_of_birth = req.body.date_of_birthInput;
	var	address = req.body.addressInput;
	var	zip_code = req.body.zip_codeInput;
	var	city = req.body.cityInput;
	var	state = req.body.stateInput;

	var xml = updateAFromXML(user, patientsA, name, gender, ssn, date_of_birth, address, zip_code, city, state);
	
	fs.writeFile(__dirname + "/data/patients.xml", xml, function(err) {
	    if(err) {
	        return console.log(err);
	    }
    	console.log("The file was update!");
    	res.send("The patient " + user + " was successfully updated");
	});
	
});

app.post('/updateB/:user', function (req, res) {

	var user = req.params.user;
	var first_name = req.body.first_nameInput;
	var	social_security = req.body.social_securityInput;
	var	dob = req.body.dobInput;
	var	address = req.body.addressInput;
	var	last_name = req.body.last_nameInput;
	var doctor = req.body.doctorInput;
	var middle_initial = req.body.middle_initialInput;
	console.log(doctor);
	var xml = updateBFromXML(user, patientsB, first_name, middle_initial ,last_name, social_security, dob, address, doctor);
	
	fs.writeFile(__dirname + "/data/patients2.xml", xml, function(err) {
	    if(err) {
	        return console.log(err);
	    }
    	res.send("The patient " + user + " was successfully updated");
	});
	
});

// public static files
app.use(express.static('dist'));

// server
var server = app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('HospitalABC app listening at http://%s:%s', host, port);
});