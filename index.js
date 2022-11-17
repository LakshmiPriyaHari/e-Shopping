//import all the modules needed
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
//set up express validator
const{check, validationResult} = require('express-validator');

//connect to DB
mongoose.connect('mongodb://localhost:27017/onlinecart',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//define the model
const Order = mongoose.model('Order',{
    name : String, //first name is pagedata , second name is name in the function - both can be same
    email : String,
    phone : String,
    address : String,
    postcode : String,
    city : String,
    province : String,
    itemCap : String,
    itemShoe : String,
    itemSunglass : String,
    itemWatch : String,
    totalcost : String,
    subTotal : String
});
//set up the app
var myApp = express();

//setup body parser middleware
myApp.use(express.urlencoded({extended:false}));

//set the path to public and views folder
myApp.set('view engine','ejs');
myApp.set('views',path.join(__dirname,'views')); //set a value for express
myApp.use(express.static(__dirname + '/public'));//setup a middleware to server static file

//define the routes
//define the route for index page "/"
myApp.get('/',function(req,res){
    res.render('form')
})

myApp.get('/order',function(req, res){
    res.render('order'); // will render views/home.ejs
});

//show all cards
myApp.get('/allorders',function(req, res){
    //write code to fetch cards from DB and send it to the view allcards
    Order.find({}).exec(function(err,orders){
        console.log(err);
        console.log(orders);
        res.render('allorders',{orders:orders}); // will render views/home.ejs
    });
    
});
//handle post
//we can fetch data from req using boday parser
myApp.post('/',[
    check('name','Name is Required').notEmpty(),
    check('email','Email is incorrect format').isEmail(),
    check('phone','Phone is incorrect format').matches(/^\d{10}$/),
    check('address','Address is required').notEmpty(),
    check('city','City is required').notEmpty(),
    check('postcode','Potscode is required').matches(/^[A-Za-z][0-9][A-Za-z]\s[0-9][A-Za-z][0-9]$/),
    check('province','Province is required').notEmpty()
],function(req,res){

    const errors = validationResult(req);
    if(errors.isEmpty())
{

    var itemCap = req.body.itemCap;
    var itemShoe = req.body.itemShoe;
    var itemSunglass = req.body.itemSunglass;
    var itemWatch = req.body.itemWatch;


    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var postcode = req.body.postcode;
    var city = req.body.city;
    var province = req.body.province;
    

    var totalcost;
    var gst = 0;
    var subTotal = 0;
    
      
    if(province == 'alberta'){
        tax = 0.05;
    }
    if(province == 'britishcolumbia'){
        tax = 0.05;
    }
    if(province == 'manitoba'){
        tax = 0.05;
    }
    if(province == 'newbrunswick'){
        tax = 0.15;
    }
    if(province == 'newfoundlandlabrador'){
        tax = 0.15;
    }
    if(province == 'northwestterritories'){
        tax = 0.05;
    }
    if(province == 'novascotia'){
        tax = 0.15;
    }
    if(province == 'nunavut'){
        tax = 0.05;
    }
    if(province == 'ontario'){
        tax = 0.13;
    }
    if(province == 'quebec'){
        tax = 0.05;
    }
    if(province == 'princeedwardisland'){
        tax = 0.15;
    }
    if(province == 'saskatchewan'){
        tax = 0.05;
    }
    if(province == 'yukon'){
        tax = 0.05;
    }

    totalcost = (itemCap * 10) + (itemShoe *50) + (itemSunglass*30) + (itemWatch*100);
    // totalcost = captotalcost + shoetotalcost + sunglasstotalcost + watchtotalcost;

     gst = totalcost * tax;
     subTotal = totalcost + gst;
    //prepare data to send to the view
    var pageData = {
        name : name, //first name is pagedata , second name is name in the function - both can be same
        email : email,
        phone : phone,
        address : address,
        postcode : postcode,
        city : city,
        province : province,
        itemCap : itemCap,
        itemShoe : itemShoe,
        itemSunglass : itemSunglass,
        itemWatch : itemWatch,
        totalcost : totalcost,
        subTotal : subTotal         
    }

    //create an object from model to save to db
    var myOrder = new Order(pageData);

    //save it to db
    myOrder.save();
    // send the data to the view and render it
    res.render('order', pageData);
}
else{
    console.log(errors.array());
    res.render('form',{errors:errors.array()})
}
 
});


//start the server(listen at the port)
myApp.listen(8080);
console.log('Everything Executed, open http://localhost:8080/ in the browser')