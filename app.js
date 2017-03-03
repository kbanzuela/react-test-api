var express = require('express');
var _ = require('lodash');
var cors = require('cors');


var app = express();
app.use(cors());
app.use(express.bodyParser());

app.get('/', function(req, res) {
  res.type('text/plain'); // set content-type
  res.send('go to /persons'); // send text response
});


//this is the intial dummy DB
var persons = [
  { id: 1, first_name: 'Karlo', last_name: 'Banzuela', email : 'kbanzuela@gmail.com', contact_number: '09175720572'},
  { id: 2, first_name: 'Juan', last_name: 'Dela Cruz', email : 'jdc@gmail.com', contact_number: '09817461811'}
];
var cur_id = _.maxBy(persons, 'id').id;

//list all persons
app.get('/persons', function(req, res) {
  res.json(persons);
});


//get specific person with :id
app.get('/persons/:id', function(req, res) {
	if(req.params.id < 0) {
		res.statusCode = 404;
		return res.send('Error 404: No person found');
	}  
	var person = _.find(persons, function(o) { return o.id == req.params.id; });
  	if (!person) {
		return res.send('Error 404: No person found');
  	}
  	res.json(person);
});

//create a new person
app.post('/persons', function(req, res) {
	if(!req.body.hasOwnProperty('first_name') || 
		!req.body.hasOwnProperty('last_name') || 
		!req.body.hasOwnProperty('email') || 
		!req.body.hasOwnProperty('contact_number')) {
		res.statusCode = 400;
		return res.send('Error 400: Insufficient Parameters.');
	} 

	var newPerson = {
		first_name : req.body.first_name,
		last_name : req.body.last_name,
		email : req.body.email,
		contact_number : req.body.contact_number
	}; 

	newPerson.id = ++cur_id;
	persons.push(newPerson);
	res.json(true);
});

//delete a person using its ID
app.delete('/persons/:id', function(req, res) {
	if(!req.params.id) {
		res.statusCode = 400;
		return res.send('Error 400: Insufficient Parameters.');
	} 
	_.remove(persons, function(p) { return p.id == req.params.id});
	res.json(true);
});


//update a person using its ID
app.put('/persons/:id', function(req, res) {
	if(!req.params.id ||
		!req.body.hasOwnProperty('first_name') || 
		!req.body.hasOwnProperty('last_name') || 
		!req.body.hasOwnProperty('email') || 
		!req.body.hasOwnProperty('contact_number')) {
		res.statusCode = 400;
		return res.send('Error 400: Insufficient Parameters.');
	} 

	var existingPersonIdx = _.findIndex(persons, function(o) { return o.id == req.params.id; });
	var personUpdate = {
		first_name : req.body.first_name,
		last_name : req.body.last_name,
		email : req.body.email,
		contact_number : req.body.contact_number
	}; 

	var updatedPerson = Object.assign({}, persons[existingPersonIdx], personUpdate);
	persons[existingPersonIdx] = updatedPerson;
	res.json(true);
});

app.get('*', function(req, res, next){
  res.json({msg: 'This is CORS-enabled for all origins!'});
});

app.listen(process.env.PORT || 4000);