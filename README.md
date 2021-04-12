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

**plz make sure to send the request as JSON Object and you setup Express File to recive JSON through app.use**

`app.use(express.json({type: ['application/json', 'text/plain']}))`

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


------------------------------------------------------------

## Deploy On  AWS EC2

- Launch instance EC2 (Ubuntu Img)
- In Group Security Page make sure to Add Http (80) and Http Rules (Opening Port) and open add your Custom Port as you need  like port 3000 for Express server
- Ports that you need to open it :
    - Http port 80 by default 
    - Https 443 by defult 
    - 3000 for Express or the port that you defined in your server.js file or .env
    - 27017 for MongoDB

- Create a new Pair Key and Download it so we can used to connect to our EC2 through SSH
- open your terminal and locate to your key file path then run the command 
` ssh -i "file name" ubuntu@instance Public DNS` for example -> `ssh -i "xina.pem" ubuntu@ec2-54-209-2-124.compute-1.amazonaws.com`

- now you should access your EC2 ubuntu and you can deal with it through terminal (like wsl on windows)

- first things update packages -> `Update packages` and `sudo apt upgrade -y`

- install all configration that you need for example nodejs

    - NodeJs  - > [nodesource](https://github.com/nodesource/distributions/blob/master/README.md) open this link and choice you node version that you want and then run the commands for that version .. for example -> `curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -` and `sudo apt-get install -y nodejs`

    - MongoDB  - > [MongoDB ref ](https://faun.pub/install-mongodb-on-aws-ubuntu-ec2-instance-6794cd8e3b4e)
    open this link and follow the instructions

    - after install all dependencies the clone your projects `react app` or `express app`
    - **Note :** EC2 server deal with port 80 as a defualt port so we need reverse proxy using nginx 
    package

    - install nginx package `sudo apt install nginx -y` after installed run this command `sudo systemctl enable nginx` to enable to auto work on rebooting 

    - **important** copy your Public IPv4 DNS and hit it in broswer url with out `s` in https protocol 
    for example - > `http://ec2-54-209-2-124.compute-1.amazonaws.com/home` notice its http not https

    - if you see the nginx page then everything until now is running well ^-^

    - locate to your react app directory and run this command to build your app `npm run build` then 
    build folder will create to you 

    - In client side world we can just serve a static file to broswer (client) so for that we built our
    react app 

    - after build react app navigate to `/etc/nginx/sites-available` and you will see default inside it
    - The `default` server block is what will be responsible for handling requests that don't match any other server blocks. Right now if you navigate to your server ip, you will see a pretty bland html page that says NGINX is installed. That is the `default` server block in action. 

    - There is two ways to deal with this 1- modife the default file  2- create another file by copying the
    default file and modife it  **I modifed the default file and its work fine**

    - open the new server block file `default` and modify it so it matches below where the root is the path of build react folder that we create using `npm run build` and location is navgaite to index.html

```
    server {
        listen 80;
        listen [::]:80;

         root /home/ubuntu/apps/yelp-app/client/build;  

        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html;

        server_name sanjeev.xyz www.sanjeev.xyz;

        location / {
                try_files $uri /index.html;
        }

            // We can not use this location where its for example only if we have another route but the
             // first location is very important 

         location /api {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

}
```

- restart nginx by using this command `sudo service nginx restart` if not work go and google it ^-^ [helper ref](https://www.cyberciti.biz/faq/nginx-restart-ubuntu-linux-command/)

- **Very very Important Note:** without Specify the correct root then the app will not deploy it
(first and important thing make sure that nginx installed and work fine as we said above)

- **Very very Important Note:** without Specify `try_files $uri /index.html;` the index.html in location 
the routers will not work fine as the work on react app coz here we deal with static files

- if every things working fine the go and setup the backend server 

- use this offical link if you faced any issues [Deployment](https://create-react-app.dev/docs/deployment/)

- **if still doesnt work try to deploy the simplest react app -> the one we create react app *-^**

- clone your express app from your githun repo or connect to instance via `FileZilla Client` and upload your server file `without node modules & .git`

- run npm i to install dependencies and `touch .env` then open it using `sudo nano filename` and edit it (dont forgot `NODE_ENV=production`) it is common practice. For many other projects(depending on how the backend is setup) they may require this to be set in a production environment.

- to save use `ctrl o` and `enter to save` and then `ctrl x` to exit  (for remove files or folders use `sudo rm -r file/folder path`)

- if you have a database make sure that you installed it and refer to it in your `.env` file and you opened a port for it from `Security groups` in EC2 

- please note that you need to open the ports to the sever and database (if it loacly) and any thing using ports through Security groups EC2

- run your server and you should see `server is listening to port ####`

- after that hit the `Public IPv4 DNS` with your server port at any route to ensure you can fetch the server routes  --- > url in http mode without s

- for example the Public IPv4 DNS is `ec2-54-209-2-124.compute-1.amazonaws.com` and the server listening port is 3030 then fire the `http://ec2-54-209-2-124.compute-1.amazonaws.com:3030/books` and it should response 

- The finall thing Keep App Server running using `PM2` 
- To Install PM2 run `npm install pm2 -g` command and It will install PM2 package globally on server.
- Switch to our app directory and run `sudo pm2 start server.js`

- Now even if you close the terminal and check the url in the browser, the app will be running. Sweet! For automatically running PM2 when the server restarts, issue the following command: `sudo pm2 startup`

**Note :** Do not forget to change the endpoints url in your react app to Public IPv4 DNS 

> Useful Links
    - [ourcodeworld](https://ourcodeworld.com/articles/read/977/how-to-deploy-a-node-js-application-on-aws-ec2-server)
    - [dev](https://dev.to/sunilmore690/complete-setup-for-deploying-nodejs-app-with-mongodb-database-on-amazon-ec2-3plj)
    - [Sanjeev Thiyagarajan](https://www.youtube.com/watch?v=NjYsXuSBZ5U&t=1s)
    - [Deploy MERN STACK App with AWS EC2](https://www.youtube.com/watch?v=HtWgb_vbyvY&t=2s)
    - [Deploy a NodeJS React app to AWS EC2](https://www.youtube.com/watch?v=rE8mJ1OYjmM)
---------------------------------------------------

## Contact Info : 
**Please Feel Free To Contact Me When You Need help ^_^**
* [www.facebook.com/aghyadalbalkhi](www.facebook.com/aghyadalbalkhi)
* [https://www.linkedin.com/in/magheadalbalkhe/](https://www.linkedin.com/in/magheadalbalkhe/)
* Email : aghyadalbalkhi@gmail.com