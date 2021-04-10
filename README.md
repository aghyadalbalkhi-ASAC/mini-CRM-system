# mini-CRM-system

## Project Description:
*You have to build a mini-CRM system to manage internal operations for a*
*call center company according to the following functions and rules:*

● The system contains the following pages:
a. Sign up for admins
b. Login for admins
c. Home page contains a graph to demonstrate the number of
added orders from the database &amp; the number of admins.
d. Orders Page where the admin can add/delete/edit/show orders
- Notes:
1. The orders has three attributes:
    - ID
    - Customer name
    - Service

2. The admins has three attributes:

    - ID
    - Full name
    - Username
    - password

● The technology stack will be the following:
1. FrontEnd: React.js
2. Backend: Node.js
3. Database: MongoDB
4. Deployment: AWS - EC2

-------------------------

## MongoDB

**Start With MongoDB**

- > useful links for MongoDB

    [mongoose package](https://www.npmjs.com/package/mongoose)
    
    [mongoose Queries](https://mongoosejs.com/docs/queries.html)

- Install MongoDB Instructions :

    Follow This Link [ Microsoft For WSL Users](https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-database#install-mongodb)

    * Open your WSL terminal (ie. Ubuntu 18.04).
    * Update your Ubuntu packages: `sudo apt update`
    * Once the packages have updated, install MongoDB with: `sudo apt-get install mongodb`
    * Confirm installation and get the version number: `mongod --version`

The 3 MongoDB Commands To Deal with server :

1. `sudo service mongodb status` for checking the status of your database.
2. `sudo service mongodb start` to start running your database.
3. `sudo service mongodb stop` to stop running your database.

- Install `mongoose` package

*Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.*

**Note :** *First install Node.js and MongoDB. Then:*
`npm install mongoose`

- Create models Folder in Project directory and `touch food.js` schema Files inside it :

```
    //food-schema.js
    //./models/food-schema.js


'use strict';

const mongoose = require('mongoose');

const food = mongoose.Schema({
    name: { type: String, required: true},
    calories: {type: Number, required: true},
    type: { type: String,uppercase: true, enum: ['FRUIT', 'BREAD', 'VEGETABLE']}
});

module.exports = mongoose.model('food', food);      // its return a class and when we require this model we can create an object and pass our object to insert in database

```
*Then we can require schema file as a module where we want to use CRUD ... ex: server.js and used in Routes Endpoint*


**The First way**

```
// server.js file

...

const Food = require('./models/food-schema.js');
...

    const foodOperations = async () => {        // async function coz it takes a time {promise function}

        let carrot = {              // the record that we want to inserted
            name: 'Apple',
            calories: 15,
            type: 'FRUIT'
        };

        // Create 
        // here we create an object from Food Module that we reqired and it return the record inserted
        let food = new Food(carrot);        

        // save the record in DB and its and promise function so we use await {we can use then()}
        // all instruction after await will be excutied after await function finish


        let foodItem = await food.save();   
        console.log("food Created :::::> ", foodItem);

        // get record by Id

        let oneItem = await Food.findById("5f573c577f1ae54dc4bcfc52");   // or food.id <- the returned one
        
        
        console.log(" findById >>>> ", oneItem);


        //get all records 

        let allFoodItems = await Food.find({});
        console.log("------------------------------")
        console.log("allFoodItems : ",allFoodItems)


}

foodOperations();

```

**The OOP way** `I like it ^-^`

*In Modele Folder -> create `touch food-schema.js` and `touch food-collection.js` and `touch mongo-model.js` where its OOP ^-^*

* The `food-schema.js` its the same above one .

* The `food-collection.js` its should extends Model class and use the Model methods to deal with database

```
    //food-collection.js
    //./models/food-collection.js

'use strict';

// we need the schema to it pass it to parent constructor (Model that we created)

const schema = require('./food-schema.js');     

// our custom class where we create a custom method to simulate the CRUD methods
const Model = require('./mongo-model.js');

// Food Inherits from Model -> Inherit all methods and we can send up to parent constructor
// its a middleware class its take a schema and send itup to Model


class Food extends Model {
    constructor() {
        super(schema);
    }
   
}

module.exports = new Food();

```

* The `mongo-model.js` it take the scheam form collection class and recived in constructor and then declare an (Object) from this schema and its contains 4 methode {create - get - update - delete}
-> its export the class its self 

```
    //mongo-model.js
    //./models/mongo-model.js



'use strict';

class Model {
    
    // recived a schema object in general               {in our case its from food-collection}

    constructor(schema) {
        this.schema = schema;                   // declare a varible {Object}
    }
    // crud operations
    create(record) {
        let newRecord = new this.schema(record);        // create a record
        return newRecord.save();
    }
    
    get(_id) {
        let obj = _id ? { _id } : {};           // if _id undefind so obj={} otherwise obj={_id}
        return this.schema.find(obj);               
    }

    update(_id, record) {
        return this.schema.findByIdAndUpdate(_id, record);
    }

    delete(_id) {
         return this.schema.findByIdAndDelete(_id);
    }
}

module.exports = Model;


```
**After finish require the collection Module (remember its export an object) where u want to use ex: server.js and use the methods**

```
// server.js

....
const food = require('../models/food-collection.js');
....

router.get('/food/:id', getFood);

function getFood(req, res, next) {
    const id = req.params.id;

    food.get(id).then(data => {            // remember it? its a get method in Model class that         
        res.status(200).json(data);         // that collection extends from - we use it here
    }).catch(next);                         // rembmer all db methods are promise
}

```

----------------------------------------------------------

## Express

**Start With Node Js** 

- Create server file `Touch server.js File`
- Create package Josn file and config server
    `npm init -y ` or `npm init -n`
- install dependencies 
    `npm i express cors dotenv superagent pg method-override ejs`

- Create `.env` file 

- requires all dependencies in server.js and require varible & Things -> its like a general Templete so we can copy it and paste and then start write code


```

'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const methodOverride = require('method-override');
const superagent = require('superagent');

/////////////// App Setup Related /////////////////////

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// its very very important - > without it we will receive req.body as an empty object {}
app.use(express.json({type: ['application/json', 'text/plain']}))

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3002;


```

- To Create a Route -> such as `/home`

*we use `app.get(route as a string, The handelfunction )` and the function take `req` and `res` as a defulte parameters*

*For Example*

```
app.get('/home',handelHome);

function handelHome (req,res){

    res.send('Hello')       // render on window

    // OR //
    res.render('index.ejs', { booksItems: selctedBooksArr }); 
    
    // it render in specific ejs page (index.ejs) and pass an object that carry the data to this page
}
```



---------------------------------------------------------
## Fetch


> The Correct way to fire / fetch and post data 

```
handleSubmit(event) {
        let url = `http://localhost:3031/round`;
        fetch(url,
        {
            body: JSON.stringify(this.state),           // should be a JOSN Format and an Object
            method: "post"
        }).then(res => res.json())                      // the res should convert josn to object
        .then(res => console.log('res >>>>',res));          // res is the fetch response from server

        event.preventDefault();
    }
```