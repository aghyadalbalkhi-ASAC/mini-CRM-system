'use strict';

// create a schema for Admins
// I will use mongoose.Schema()

const mongoose = require('mongoose');

// it will be like one object that has objects, 
//each one of these objects will have properties:
    // for example: type, required


const admins = mongoose.Schema({
    fullname : {type:String , required:true},
    username : {type:String , required:true},
    password : {type:String , required:true}

});


// create a model and expose it 
module.exports = mongoose.model('admins', admins);