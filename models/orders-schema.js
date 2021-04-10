'use strict';

// create a schema for Orders
// I will use mongoose.Schema()

const mongoose = require('mongoose');

// it will be like one object that has objects, 
//each one of these objects will have properties:
    // for example: type, required


const orders = mongoose.Schema({
    customername : {type:String , required:true},
    service : {type:String , required:true}

});


// create a model and expose it 
module.exports = mongoose.model('orders', orders);