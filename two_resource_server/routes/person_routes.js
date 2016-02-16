var express = require('express');
var jsonParser = require('body-parser').json();
var Person = require(__dirname + '/../models/person');
var dbErrorHandler = require(__dirname + '/../lib/handle_db_error');

var personRouter = module.exports = express.Router();

personRouter.get('/person/count', (req, res) => {
  Person.find({}, function(err, data) {
    var people = {};

    data.forEach(function(p) {
      people[p._id] = p;
    });
    var count = Object.keys(people).length;
    res.status(200).json({count: count});
  });
});

personRouter.post('/person', jsonParser, (req, res) => {
  var newPerson = new Person(req.body);
  newPerson.save((err, data) => {
    if(err) return dbErrorHandler(err, res);
    res.status(200).json(data);
  });
});

personRouter.get('/person', (req, res) => {
  Person.find({}, (err, data) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json(data);
  });
});

personRouter.put('/person/:id', jsonParser, (req, res) => {
  var personData = req.body;
  delete personData._id;
  Person.update({_id: req.params.id}, {name: personData.name}, (err, data) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json({msg: 'success'});
  });
});

personRouter.delete('/person/:id', (req, res) => {
  Person.remove({_id: req.params.id}, (err, data) => {
    if (err) return dbErrorHandler(err, res);
    res.status(200).json({msg: 'success'});
  });
});
