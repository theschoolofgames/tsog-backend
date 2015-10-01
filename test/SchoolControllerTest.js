var request = require('supertest');
var expect = require('chai').expect;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

describe('express rest api server', function(){

    var log = console.log;
    var server = request.agent("http://localhost:3000");

    var randomSchoolId = null;

    it('HOME', function(done) {
        server
            .get('/')
            .expect(200, done);
    });


    it('should GET schools', function(done) {
        server
            .get('/api/schools')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(e,res){
                // log(res.error);
                expect(e).to.be.null;
                expect(res.error).to.be.false;
                expect(res.body).to.be.an('array');

                for (var i = 0; i < res.body.length; i++) {
                    var school = res.body[i];
                    expect(school.school_id).to.be.not.null;
                    expect(school.school_name).to.be.not.null;
                }

                randomSchoolId = res.body[Math.floor(Math.random() * res.body.length)].school_id;
                // log("school: " + randomSchoolId);
                done();
            });
    });

    // it('should GET accounts', function(done) {
    //     log("account: " + randomSchoolId);
    //     server
    //         .get('api/accounts')
    //         .query({ school_id: randomSchoolId })
    //         .expect(200)
    //         .expect('Content-Type', /json/)
    //         .end(function(e, res) {
    //             expect(e).to.be.null;
    //             // expect(res.error).to.be.false;
    //             // expect(res.body).to.be.an('array');

    //             done();
    //         });
    // });
});