var isAuthenticated = require("../config/middleware/isAuthenticated");


var db = require("../models");
var express = require('express');
var router  = express.Router();
var mysql = require('mysql')
// var connection = require('../config/connection.js')

// Student's home view 
// Get announcements from student's teacher(s) and project(s) student is working on 

// router.get('/home', isAuthenticated, function(req,res){
router.get('/home', function(req,res){

	db.User.findOne({
		where: {
      id: 1,
    },
    include: [db.Credential]
      }).then(function(result) {
    var hbs_obj = {data: result,
    			  section_creds: []}
    var possible_section_names = []
    // loop over all credentials 
    for (c in result.Credentials){
    	// reformat as json
    	cred = result.Credentials[c].toJSON()
    	// check whether the section_name is already registered 
    	if (possible_section_names.indexOf(cred.section_name) < 0){
    		// if not, add it to the list of section_names 
    		possible_section_names.push(cred.section_name)
    		// then add the whole credential to the handlebars obj
    		var cred_obj = {section_name: cred.section_name,
    						creds: [cred]} 
    		hbs_obj.section_creds.push(cred_obj)
    	}
    	else{
    		for (s in hbs_obj.section_creds){
    			if (hbs_obj.section_creds[s].section_name == cred.section_name){
					var current_section = hbs_obj.section_creds[s]
					current_section.creds.push(cred)
    		}
			}
    	
    }}
    console.log(hbs_obj)
    res.render("Applicant/home", hbs_obj)
  
    });
	
});

router.post('/update-basic-info', function(req,res){
	var changes = {
		name: req.body.name, 
		email: req.body.email,
		location: req.body.location
	}
	db.User.update(changes, {
		where: {
      		id: 1,
    	},
      }).then(function(result) {
    res.redirect("/applicant/home")
  
    });
});

module.exports = router;