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
  $('.tablePatients').removeClass('hidden');
}

function buscarAfn () {

  var user = foundUser(patientsA, $('.nombre').val(), schemaA);

  if (user) {
    showUserInTable(user);
  }else{
    console.log('La persona que busca no se encuentra en la lista de contabilidad')
  }
}

function buscarBfn () {
  var user = foundUser(patientsB, $('.nombre').val(), schemaB);

  if (user) {
    showUserInTable(user);
  }else{
    console.log('La persona que busca no se encuentra en la lista de citas')
  }
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

function borrarAfn (userToDelete) {
  $.post('/delete/' + $('.nombre').val(), function (data) {
    console.log(data);
  })
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
  $('.buscarA').on('click', buscarAfn);
  $('.buscarB').on('click', buscarBfn);
  $('.comparar').on('click', comparar);
  $('.comun').on('click', comun);
  $('.soloUno').on('click', soloUno);
  $('.borrarA').on('click', borrarAfn)
  $('.actualizarContabilidad').on('click', updateUserInA)
});

function updateUserInA () {
  /*
  - desocultar el form con la tabla con inputs
  - poner en los input la info del usuario
  - escuchar el boton guardar
  - recorrer patientsA para ver si patient Name si existe
  - enviar esos campos en un objeto por el post a /updateA/
  - avisar que el guardado fue exitoso desde el POST
  */
}