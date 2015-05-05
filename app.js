var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var builder = new xml2js.Builder();

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('/api/patients', function (req, res) {
	fs.readFile(__dirname + '/data/patients.xml', function (err, data) {
		parser.parseString(data,function (err, result) {
			res.send(result);
		})
	});
})

app.get('/api/patients2', function (req, res) {
	fs.readFile(__dirname + '/data/patients2.xml', function (err, data) {
		parser.parseString(data,function (err, result) {
			res.send(result);
		})
	});
})

app.use(express.static('dist'));
var server = app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port);
});