var chai = require('chai');
var chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
var expect = chai.expect;
var request = chai.request;
var mongoose = require('mongoose');
var server = require(__dirname + '/../server');
var Person = require(__dirname + '/../models/person');

process.env.MONGOLAB_URI = 'mongodb://localhost/person_app_test';

describe('the person api', () => {
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      //server.close();
      done();
    });
  });

  it('should create a person with a post', (done) => {
    request('localhost:3000')
      .post('/api/person')
      .send({name: 'test person'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('test person');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should be able to retrieve all our persons', (done) => {
    request('localhost:3000')
      .get('/api/person')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });
});

describe('rest requests that require a person already in db', () => {
  beforeEach((done) => {
    Person.create({name: 'test person'}, (err, data) => {
      this.testPerson = data;
      done();
    });
  });

  it('should be able to update a person', (done) => {
    request('localhost:3000')
      .put('/api/person/' + this.testPerson._id)
      .send({name: 'new person name'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  it('should count the people', (done) => {
    request('localhost:3000')
      .get('/api/person/count')
      .end(function(err, res) {
        expect(err).to.eql(null);
        //expect(res).to.have.status(200);
        expect(res.body.count).to.eql(2);
        done();
      });
  });

  it('should be able to delete a person', (done) => {
    request('localhost:3000')
      .delete('/api/person/' + this.testPerson._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
  });
});
