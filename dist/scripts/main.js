var patientsA, patientsB, isPatientA, isPatientB;
//patients
$.ajax({
  url: '/api/patients',
  type: 'get',
  dataType: 'json',

  success: function (data) {
    patientsA = data.patients.patient;
  }
});
//patients1
$.ajax({
  url: '/api/patients2',
  type: 'get',
  dataType: 'json',

  success: function (data) {
    patientsB = data.hospital.physician[0].patient;
    patientsB = patientsB.concat(data.hospital.physician[1].patient)
  }
});

function schemaClear (){
  return{
    name: "",
    gender: "",
    ssn: "",
    dob: "",
    address: "",
    zip_code: "",
    city: "",
    state: "",
  }
}

function schemaA (val){
  return{
    name: val.name,
    gender: val.gender,
    ssn: val.ssn,
    dob: val.date_of_birth,
    address: val.address,
    zip_code: val.zip_code,
    city: val.city,
    state: val.state,
  }
}

function schemaB (val) {
  return {
    first_name : val.first_name,
    middle_initial : val.middle_initial,
    last_name : val.last_name,
    name: val.first_name + " " + val.last_name,
    ssn: val.social_security,
    dob: val.dob,
    address: val.address
  }
}

function foundUser (collection, input, schema){
  // normalize input
  var nameInput = input.toString().toLowerCase();
  // obj to return
  var foundedOBJ = false;

  // loop looking the user
  $.each(collection, function(index, val){
    var nameFile = schema(val).name.toString().toLowerCase();

    if( nameInput == nameFile ) {
      foundedOBJ = schema(val);
    }
  });

  // return schema or false
  return foundedOBJ;
}

function showUserInTable (user) {
  $('.name').text(user.name);
  $('.gender').text(user.gender);
  $('.ssn').text(user.ssn);
  $('.date_of_birth').text(user.dob);
  $('.address').text(user.address);
  $('.zip_code').text(user.zip_code);
  $('.city').text(user.city);
  $('.state').text(user.state);
}

function showUserinForm (user) {
    $('.nameInput').val(user.name);
    $('.genderInput').val(user.gender);
    $('.ssnInput').val(user.ssn);
    $('.date_of_birthInput').val(user.dob);
    $('.addressInput').val(user.address);
    $('.zip_codeInput').val(user.zip_code);
    $('.cityInput').val(user.city);
    $('.stateInput').val(user.state);
}

function showUserBinForm (user) {

  $('.first_nameInput').val(user.first_name);
  $('.middle_initialInput').val(user.middle_initial);
  $('.last_nameInput').val(user.last_name);
  $('.dobInput').val(user.dob);
  $('.social_securityInput').val(user.ssn);
  $('.addressInput').val(user.address);
}

function searchA () {
  $('.tablePatients').addClass('hidden');
  var user = foundUser(patientsA, $('.nombre').val(), schemaA);
  
  if (user) {
    showUserInTable(user);
    $('.tablePatients').removeClass('hidden');
    
  }else{
    alert('The patient you are looking for is not in the list of accounting')
  }
}

function searchB () {
  $('.tablePatients').addClass('hidden');
  var user = foundUser(patientsB, $('.nombre').val(), schemaB);

  if (user) {
    showUserInTable(user);
    $('.tablePatients').removeClass('hidden');
    
  }else{
    alert('The patient you are looking for is not in the list of appointments')
    
  }
}

function comparefn () {

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

  });

  $.each(patientsB, function(index,val) {

    if ($('.nombre').val() == val.first_name + " " + val.last_name ) {
      nombreB = val.first_name + " " + val.last_name;
      direccionB = val.address;
      fechaB = val.dob;
      socialB = val.social_security;
    }
  });

  if ($('.nombre').val().length === 0) {
    alert('Write a patient name')
  }else{
    if (nombreA == nombreB && fechaA.toString() == fechaB.toString() && socialB.toString() == socialA.toString()) {
      alert('Data are equals')
    }else{
      alert('Data are not equals')
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

function listComunfn () {
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

function listInOne () {
  var patientsInA = []
    , patientsInB = [];

  $('.listaDiferentes').text('');
  $('.diferente').removeClass('hidden');

  recorrer(patientsInA, patientsInB);

  patientInOne = _.difference(_.union(patientsInA, patientsInB), _.intersection(patientsInA, patientsInB));

  for (var i = 0; i < patientInOne.length; i++) {
    $('.listaDiferentes').append(patientInOne[i] + "<br>") ;
  }
}

function clearTable (argument) {

  showUserInTable(schemaClear());
}

function doctorInfo (argument) {

  $('.doctor').removeClass('hidden');
}

function deleteBfn (userToDelete, doctor) {
  $.post('/deleteB/' + $('.nombre').val() + '/' + $('.doctorName').find(":selected").text() ,function (data) {
    alert(data);
    
    location.reload(true);
    $('.doctor').addClass('hidden')
  });
}

function updateUserInA () {
  var user = foundUser(patientsA, $('.nombre').val(), schemaA);
  if (user) {

    $('.updateFormA').removeClass('hidden');
    showUserinForm(user);
  }else{

   alert("This patient is not in the xml file");

  }
}

function updateUserInB () {
  var user = foundUser(patientsB, $('.nombre').val(), schemaB);
  if (user) {
    $('.updateFormB').removeClass('hidden');
    showUserBinForm(user);
    knowDoctor();
  }else{
   alert("This patient is not in the xml file");
  }
}

function knowDoctor () {
  $(".doctorSelect").change(function() {
    var doc = $(".doctorSelect option:selected").text()
    $('.doctorInput').val(doc);
  });
}

function deleteAfn (userToDelete) {
  $.post('/delete/' + $('.nombre').val(), function (data) {
    alert(data);
    
    location.reload(true);
  });
}

function updateXml (event) {
  event.preventDefault();

  $.post('/updateA/' + $('.nombre').val(), $('#updateFields').serialize(), function (data) {
    alert(data);
  });
  $('.updateFormA').addClass('hidden');
  $('.nombre').val('')
  location.reload(true);
}

function updateXml2 (event) {
  event.preventDefault();
  
  $.post('/updateB/' + $('.nombre').val(), $('#updateFieldsB').serialize(), function (data) {
    alert(data);
  });
  $('.updateFormB').addClass('hidden');
  $('.nombre').val('')
  location.reload(true);
}

$(document).ready(function($) {
  var $input = $(".nombre");
  $('.tablePatients').addClass('hidden');
  $('.enComun').addClass('hidden');
  $('.diferente').addClass('hidden');

  
  // Event listeners

  // clean table every click
  $('.buscarA, .buscarB').on('click', clearTable)

  // actual listeners
  $('.buscarA').on('click', searchA);
  $('.buscarB').on('click', searchB);
  $('.comparar').on('click', comparefn);
  $('.comun').on('click', listComunfn);
  $('.soloUno').on('click', listInOne);
  $('.borrarA').on('click', deleteAfn);
  $('.inputDoctor').on('click', doctorInfo);
  $('.borrarB').on('click', deleteBfn);
  $('.actualizarContabilidad').on('click', updateUserInA);
  $('.actualizarCitas').on('click', updateUserInB);
  $('.updateA').on('click', updateXml);
  $('.updateB').on('click', updateXml2);
});