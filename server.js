'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');


// it using to connect To MongoDB Database
const mongoose = require('mongoose');

// require the Models Files
const admins = require('./models/admins-collection');
const orders = require('./models/orders-collection');

// this should be in your .env file 
// xina is the database -> if it exist then it will be connected , if not then mongo will create it for us
const MONGOOSE_URL = process.env.MONGOOSE_URL;
const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}
mongoose.connect(MONGOOSE_URL, mongooseOptions);



/////////////// App Setup Related /////////////////////

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
// app.use(methodOverride('_method'));

// its very very important - > without it we will receive req.body as an empty object {}
app.use(express.json({type: ['application/json', 'text/plain']}))

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3002;




//////////////////// Routes //////////////////

app.get('/', (req, res) => {
    res.send('<h1>Express Demo App</h1> <h4>Message: Success</h4>');
  })

  
app.post('/adminSingUp',handeladminSingUp);
app.post('/adminLogin',handeladminLogin);
app.get('/admins',handelAdmins);

app.get('/orders',handelOrders);
app.get('/orders/:id',handelOrders);

app.post('/newOrders',handelNewOrders);
app.put('/editOrders/:id',handelEditOrders);
app.delete('/deleteOrders/:id',handelDeleteOrders);



////////////// Admin Handel Functions ///////////////


function handeladminSingUp(req,res){
    console.log("req body >>>>",req.body);
    admins.create(req.body).then(data=>{
        res.status(201).json('registred');
    }).catch(err=> {
        res.status(201).json(err);
    });

}

function handeladminLogin(req,res){
    let recordObject = {username:"",password:""}
    console.log(req.body)
    admins.get().then(data => {
        
        data.forEach(record => {
            recordObject['username']=record.username;
            recordObject['password']=record.password;
            if (JSON.stringify(recordObject) === JSON.stringify(req.body)){
                res.status(200).json('ok');
            }
        });
        
    }).catch(err=> {
        console.log(err);
            //if admin Not exist
            res.status(200).json('Not exist');
    });



}

function handelAdmins(req,res){
    admins.get().then(data => {
        res.status(200).json(data);
    }).catch(err=> {
        console.log(err);
    });
}


////////////// Orders Handel Functions ///////////////

function handelOrders (req,res){
    const id = req.params.id;
    orders.get(id).then(data => {
        res.status(200).json(data);
    }).catch(err=> {
        console.log(err);
    });
}


function handelNewOrders (req,res){

    console.log("req body >>>>",req.body);
    orders.create(req.body).then(data=>{
        res.status(201).json(data);
    }).catch(err=> {
        res.status(201).json(err);
    });

}


function handelEditOrders (req,res){
    const id = req.params.id;
    orders.update(id,req.body).then(data => {
        res.status(200).json(data);
    }).catch(err=> {
        // console.log(err);
        res.status(200).json('err');
    });
}


function handelDeleteOrders (req,res){
    const id = req.params.id;
    console.log(id);
    orders.delete(id).then(data => {
        res.status(200).json('Deleted');
        // res.redirect(200, '/dashboard');        
    }).catch(err=> {
        res.status(200).json('Order Not Found');
    });
}





///////////////////// Connect To server   /////////////////////////////
app.listen(PORT, () => {
    console.log(`app is listning on port${PORT}`);
    });