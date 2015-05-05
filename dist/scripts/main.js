var patientsA, patientsB, isPatientA, isPatientB;
//patients
jQuery.ajax({
	url: '/api/patients',
	type: 'get',
	dataType: 'json',
	success: function (data) {
		patientsA = data.patients.patient;
	}
});
//patients1
jQuery.ajax({
	url: '/api/patients2',
	type: 'get',
	dataType: 'json',
	success: function (data) {
		patientsB = data.hospital.physician[0].patient;
		patientsB = patientsB.concat(data.hospital.physician[1].patient)

	}
});

$('.buscarA').on('click', buscarA);
$('.buscarB').on('click', buscarB);
$('.comparar').on('click', comparar);
$('.comun').on('click', comun);
$('.soloUno').on('click', soloUno);

function buscarA () {
	$('.tablePatients').removeClass('hidden');
	$.each(patientsA, function(index,val) {

		if ($('.nombre').val() == val.name) {
			isPatientA = true;
			$('.name').text(val.name);
			$('.gender').text(val.gender);
			$('.ssn').text(val.ssn);
			$('.date_of_birth').text(val.date_of_birth);
			$('.address').text(val.address);
			$('.zip_code').text(val.zip_code);
			$('.city').text(val.city);
			$('.state').text(val.state);
		}

	});
	if (!isPatientA) {
		alert('La persona que busca no se encuentra en la lista de contabilidad')
	};
}
function buscarB () {
	$.each(patientsB, function(index,val) {
		if ($('.nombre').val() == val.first_name + " " + val.last_name ) {
			isPatientB = true;
			$('.name').text(val.first_name + " " + val.last_name );
			$('.date_of_birth').text(val.dob)
			$('.social_security').text(val.social_security)
			$('.address').text(val.address)
		}
	});
	if (!isPatientB) {
		alert('La persona que busca no se encuentra en la lista de citas')
	};
}
function comparar () {

	var nombreA = '';
	var direccionA = '';
	var fechaA = '';
	var socialA = '';

	var nombreB = '';
	var direccionB = '';
	var fechaB = '';
	var socialB = '';

	$.each(patientsA, function(index,val) {

		if ($('.nombre').val() == val.name) {
			nombreA = val.name;
			direccionA = val.address;
			fechaA = val.date_of_birth;
			socialA = val.ssn;
		}

		console.log(nombreA + " "+ fechaA+ " "+ socialA , typeof fechaA);
	});

	$.each(patientsB, function(index,val) {

		if ($('.nombre').val() == val.first_name + " " + val.last_name ) {
			nombreB = val.first_name + " " + val.last_name;
			direccionB = val.address;
			fechaB = val.dob;
			socialB = val.social_security;
		}
		console.log(nombreB + " "+ fechaB+ " "+ socialB , typeof fechaB);
	});

	if ($('.nombre').val().length === 0) {
		alert('Write a patient name')
	}else{
		if (nombreA == nombreB && fechaA.toString() == fechaB.toString() && socialB.toString() == socialA.toString()) {
			alert('equals')
		}else{
			alert('not equals')
		}
	}
}
function recorrer (a,b) {
	$.each(patientsA, function(index,val) {
		a.push(val.name.toString());
	});
	$.each(patientsB, function(indexB,valB) {
		b.push(valB.first_name + " " + valB.last_name);
	});
}
function comun () {
	$('.enComun').removeClass('hidden')
	$('.listaEnComun').text('')
	var patientsInA = [];
	var patientsInB = [];
	recorrer(patientsInA, patientsInB);
	patientInBoth = _.intersection(patientsInA, patientsInB);
	for (var i = 0; i < patientInBoth.length; i++) {
		$('.listaEnComun').append(patientInBoth[i] + "<br>") ;
	}	
}
function soloUno () {
	$('.listaDiferentes').text('');
	$('.diferente').removeClass('hidden');
	
	var patientsInA = [];
	var patientsInB = [];
	recorrer(patientsInA, patientsInB);
	
	patientInOne = _.difference(_.union(patientsInA, patientsInB), _.intersection(patientsInA, patientsInB));
	for (var i = 0; i < patientInOne.length; i++) {
		$('.listaDiferentes').append(patientInOne[i] + "<br>") ;
	}
}
$(document).ready(function($) {
	$('.tablePatients').addClass('hidden')
	$('.enComun').addClass('hidden')
	$('.diferente').addClass('hidden')
});
