//#region Comment Header
/*
CAP805 Demo S2023
Four Guys
June/July, 2023
Version 1.0.0 - June 7, 2023 by Zehan
*/
//#endregion

//#region Server Setup
var express = require("express");
var app = express();
const path = require("path");
var HTTP_PORT = process.env.PORT || 8080; //use port number found in .env file or 8080
require('dotenv').config();
var users = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
];
app.use(express.static("views"));
app.use("/css", express.static("public/css"));
app.use(express.static("public"));
const { isUserAdmin } = require('./auth');

const { engine } = require("express-handlebars");
// Define a custom helper to serialize JavaScript objects as JSON
const handlebars = require('handlebars');

handlebars.registerHelper('json', function (object) {
    return new handlebars.SafeString(JSON.stringify(object));
});

app.engine('.hbs', engine({
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));

app.set('view engine', '.hbs');

const clientSession = require("client-sessions");
app.use(clientSession({
    cookieName: "Cap805Session",
    secret: "Cap805_week6_mongodbDemo",
    duration: 2*60*1000,
    activeDuration: 60*1000
}))

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

//#endregion

//#region databse
const mongoose = require("mongoose");
mongoose.connect(process.env.dbConn, {useNewUrlParser: true, useUnifiedTopology: true});

//model
const UserModel = require("./models/userModel");

//connect database
const connection1 = mongoose.createConnection(process.env.dbConn, {
    dbName: 'province',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
const connection2 = mongoose.createConnection(process.env.dbConn, {
    dbName: 'city',
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connection3 = mongoose.createConnection(process.env.dbConn, {
    dbName: 'testSearchHistory',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });  
// Schema for province database
const provinceSchema = new mongoose.Schema({
    provinceId: Number,
    provinceName: String,
    taxRate: Number,
    salaryAverage: Number
});

// Schema for city database
const citySchema = new mongoose.Schema({
    cityId: Number,
    cityName: String,
    provinceId: Number,
    crimeRateTotal: Number,
    crimeRateViolent: Number,
    crimeRateNonViolent: Number,
    costOfLivingIndex: Number,
    groceriesIndex: Number,
    population: String,
    rentIndex: Number
});
const SearchHistorySchema = new mongoose.Schema({
    username: String,
    email: String,
    results: [{}], // Array of Mixed type to store the search results
  });
  
const SearchHistoryModel = connection3.model('data', SearchHistorySchema);  
const ProvinceModel = connection1.model('Data', provinceSchema, 'data');
const CityModel = connection2.model('Data', citySchema, 'data');
//#endregion

//#region Custom Server Functions
function OnHttpStart(){
    console.log("Express started on port: " + HTTP_PORT);
}

function ensureLogin(req, res, next){
    if(!req.Cap805Session.user){
        res.render("login",{errorMsg: "You don't have permission for the requested page!", layout: false});
    } else{
        next();
    }
}
function renderUserList() {
    var userList = document.getElementById("userList");
    userList.innerHTML = "";

    users.forEach(function (user) {
        var listItem = document.createElement("li");
        listItem.innerHTML = '<span>' + user.name + '</span><span>' + user.email + '</span>';
        userList.appendChild(listItem);
    });
}
function addUser() {
    var nameInput = document.getElementById("nameInput");
    var emailInput = document.getElementById("emailInput");
    var name = nameInput.value;
    var email = emailInput.value;

    if (name && email) {
        var newUser = { name: name, email: email };
        users.push(newUser);
        renderUserList();
        nameInput.value = "";
        emailInput.value = "";
    }
}
function deleteUser() {
    if (users.length > 0) {
        users.pop();
        renderUserList();
    }
}

function ensureAdmin(req, res, next){
    if(!req.Cap805Session.user.isAdmin){
        res.render("login",{errorMsg: "You don't have permission for the requested page!", layout: false});
    } else{
        next();
    }
}
// Event listener for the "Add User" button
// document.getElementById("addUserButton").addEventListener("click", addUser);

// Event listener for the "Delete User" button
// document.getElementById("deleteUserButton").addEventListener("click", deleteUser);

// Initial rendering of the user list
// renderUserList();


//#endregion

//#region TEMP ONE TIME RUN ONLY
// app.get("/firstrunsetup",(req,res) =>{
//     var Admin = new UserModel({
//         username:'admin',
//         password:'pwd',
//         firstName:'Admin',
//         lastName:'admin',
//         email:'admin@myseneca.ca',
//         isAdmin:true
//     })
//     Admin.save().then((d)=>{
//         console.log("Get here after creating User")
//     })
//     .catch((err)=>{
//         console.log("There is a err" + err);
//         res.redirect("/");
//     })
// });
//#endregion

//#region TEMPORARY USER
// const usr = {
//     username:"AB",
//     password:"pwd",
//     email:"ab@gmail.com",
//     isAdmin:false,
//     firstName:"A",
//     lastName:"B"
// }
//#endregion

//#region Routes
app.get("/",(req,res) => {
    res.render("home",{layout: false})
});
app.get("/contact",(req,res) => {
    res.render("contact",{ user: req.Cap805Session.user, layout: false})
});
app.get("/searchrecommendation", (req, res) => {
    res.render("searchrecommendation", { user: req.Cap805Session.user, layout: false}) 
}); 
app.get("/admindashboard", ensureAdmin, (req, res) => {
    // Fetch all users from the database
    UserModel.find()
        .then(users => {
            res.render("admindashboard", { user: req.Cap805Session.user, users, layout: false });
        })
        .catch(error => {
            console.log("Error fetching user data:", error);
            res.render("admindashboard", { user: req.Cap805Session.user, users: [], layout: false });
        });
});

app.get("/login", (req, res) => {
    if (req.Cap805Session.user) {
      // If the user is already logged in, redirect to the main page
      res.redirect("/");
    } else {
      res.render("login", { user: req.Cap805Session.user, layout: false });
    }
  });
  
app.get("/registration", (req, res) => {
    res.render("registration",{layout: false}) 
}); 
app.get("/rentacar", (req, res) => {
    res.render("rentacar",{ user: req.Cap805Session.user,layout: false}) 
}); 
app.get("/driverlicense", (req, res) => {
    res.render("driverlicense",{ user: req.Cap805Session.user,layout: false}) 
}); 

app.get("/feedback", ensureLogin, (req, res) => {
    const userFullName = `${req.Cap805Session.user.firstName} ${req.Cap805Session.user.lastName}`;
    res.render("feedback", { user: req.Cap805Session.user, userFullName, layout: false });
  });

app.get("/myaccount", ensureLogin, (req, res) => {
    const userFullName = `${req.Cap805Session.user.firstName} ${req.Cap805Session.user.lastName}`;
    res.render("myaccount", { user: req.Cap805Session.user, userFullName, layout: false });
  });
  
  
  
  
app.get("/logout",(req,res)=>{
    req.Cap805Session.reset();
    res.render("login",{layout:false})
})
app.post("/login", (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;

    if(email === "" || password === ""){
        res.render("/login",{errorMsg: "Both the email and the password are required", layout:false});
    }

    //go to the database
    UserModel.findOne({ email: email })
        .exec()
        .then((usr)=>{
            if (password === usr.password){
                req.Cap805Session.user = {
                    username: usr.username,
                    email: usr.email,
                    isAdmin: usr.isAdmin,
                    firstName: usr.firstName,
                    lastName: usr.lastName
                };
                if (usr.isAdmin){
                    res.redirect("/admindashboard")
                } else {
                    res.redirect("/searchrecommendation")
                }
                console.log("login successful!")
            } else {
                res.render("login", {errorMsg: "Your login failed!",layout:false})
            }
        })
        .catch((err)=>{
            console.log("There is an error" + err);
        })

    // if (username === usr.username){
    //     if (password === usr.password){
    //         req.Cap805Session.user = {
    //             username: usr.username,
    //             email: usr.email,
    //             isAdmin: usr.isAdmin,
    //             firstName: usr.firstName,
    //             lastName: usr.lastName
    //         };
    //         if (usr.isAdmin){
    //             res.redirect("/admin/dashboard")
    //         } else {
    //             res.redirect("/dashboard")
    //         }
    //         console.log("login successful!")
    //     } else {
    //         res.render("login", {errorMsg: "Your login failed!",layout:false})
    //     }
    // } else {
    //     res.render("login", {errorMsg: "Your login failed!",layout:false})
    // }
});
app.post("/registration", async (req, res) => {
    const username = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const rpassword = req.body.rpassword;

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (username === "" || email === "" || password === "" || rpassword === "") {
        res.render("registration", { errorMsg: "All fields are required", layout: false });
        return;
    }

    if (!emailRegex.test(email)) {
        res.render("registration", { errorMsg: "Invalid email format", layout: false });
        return;
    }

    if (password !== rpassword) {
        res.render("registration", { errorMsg: "Passwords do not match", layout: false });
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[%._!])[A-Za-z\d%._!]{2,}$/;
    if (!passwordRegex.test(password)) {
        res.render("registration", { errorMsg: "Password should contain at least a lowercase, an uppercase, and one of % . ! _", layout: false });
        return;
    }

    if (username.length > 25) {
        res.render("registration", { errorMsg: "Username should be less than 25 characters", layout: false });
        return;
    }

    if (password.length > 50) {
        res.render("registration", { errorMsg: "Password should be less than 50 characters", layout: false });
        return;
    }

    const userExists = await UserModel.findOne({ email: email }).exec();

    if (userExists) {
        res.render("registration", { errorMsg: "The email already exists!", layout: false });
        return;
    }

    const newUser = new UserModel({
        username: username,
        email: email,
        password: password, // make sure to hash password in production!
        isAdmin: false
    });

    newUser.save()
        .then(() => {
            req.Cap805Session.user = {
                username: username,
                email: email,
                isAdmin: false
            };
            res.render("searchrecommendation", { user: req.Cap805Session.user, layout: false });
        })
        .catch((err) => {
            console.log("There is an error" + err);
            res.render("registration", { errorMsg: "Error during registration", layout: false });
        });
});

app.post("/submit-feedback", ensureLogin, (req, res) => {
    const feedback = req.body.feedback;
    // Save the feedback to the database or perform any other required operations
    // ...
    res.render("feedback-success", { user: req.Cap805Session.user, layout: false });
  });

  app.post("/update-account", ensureLogin, (req, res) => {
    const userId = req.Cap805Session.user._id; // Assuming you have an "_id" field in the user object
    const { email, firstName, lastName } = req.body;
  
    // Update the user's account information in the database using the userId
    UserModel.findByIdAndUpdate(
      userId,
      { email, firstName, lastName },
      { new: true }
    )
      .then(updatedUser => {
        // Update the user object in the session
        req.Cap805Session.user.firstName = updatedUser.firstName;
        req.Cap805Session.user.lastName = updatedUser.lastName;
  
        res.redirect("/myaccount");
      })
      .catch(error => {
        console.log("Error updating account information:", error);
        res.redirect("/myaccount"); // Redirect back to the My Account page
      });
  });
// Add User API
app.post("/api/users", ensureAdmin, (req, res) => {
    const { username, email, password } = req.body;

    // Create a new user object
    const newUser = new UserModel({
        username,
        email,
        password,
        isAdmin: false // Modify this as per your requirements
    });

    // Save the new user to the database
    newUser.save()
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            console.error("Error adding user:", error);
            res.status(500).json({ error: "Failed to add user" });
        });
});
// Delete User API
app.delete("/api/users/:id", ensureAdmin, (req, res) => {
    const userId = req.params.id;

    // Delete the user from the database
    UserModel.findByIdAndDelete(userId)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            console.error("Error deleting user:", error);
            res.status(500).json({ error: "Failed to delete user" });
        });
});

app.post("/searchrecommendation", async (req, res) => {
    const provinceId = parseInt(req.body.province);
    const prefs = [
        req.body.firstPref,
        req.body.secondPref,
        req.body.thirdPref,
        req.body.fourthPref,
        req.body.fifthPref,
        req.body.sixthPref,
        req.body.seventhPref
    ].filter(Boolean); // Removes null values
  
    const provinces = await ProvinceModel.find({}).lean();
    const cities = await CityModel.find({ provinceId }).sort({ [prefs[0]]: -1 }).limit(5);
  
    const currentResults = cities.map(city => {
        const province = provinces.find(p => p.provinceId === city.provinceId);
        return { ...city.toObject(), province };
    });

    // Retrieve all past search results for the current user before storing the current search
    const pastSearchResults = await SearchHistoryModel.find({
        username: req.Cap805Session.user.username,
        email: req.Cap805Session.user.email,
    }).lean();
    
    // Store the search results in the testSearchHistory database
    const searchHistory = new SearchHistoryModel({
        username: req.Cap805Session.user.username,
        email: req.Cap805Session.user.email,
        results: currentResults,
    });
    await searchHistory.save();

    res.render("searchhistory", { 
        user: req.Cap805Session.user, 
        currentResults, 
        pastSearchResults, 
        layout: false 
    });
});

app.get("/forgotpassword",(req,res)=>{
    res.render("forgotpassword",{ user: req.Cap805Session.user, layout:false})
});
app.get("/attractions", (req, res) => {
    res.render("attractions",{ user: req.Cap805Session.user, layout: false}) 
});
app.get("/education", (req, res) => {
    res.render("education",{ user: req.Cap805Session.user, layout: false}) 
});
app.get("/ownacar", (req, res) => {
    res.render("ownacar",{ user: req.Cap805Session.user, layout: false}) 
});
app.get('/banking', (req, res) => {
    res.render("banking", { user: req.Cap805Session.user,layout: false})
});
app.get("/housing", (req, res) => {
    res.render("housing",{ user: req.Cap805Session.user,layout: false})
}); 
app.get("/mobile", (req, res) => {
    res.render("mobile",{ user: req.Cap805Session.user,layout: false}) 
}); 
app.get("/crimeRate", (req, res) => {
    var sampleData= [{
        provinceId: 1,
        provinceName: "Ontario",
        cityId: 1,
        cityName: "Toronto",
        population: 100000,
        crimeRateViolent: 22,
        crimeRateNonViolent: 27,
        crimeRateTotal: 49
    },
    {
        provinceId: 1,
        provinceName: "Ontario",
        cityId: 2,
        cityName: "Ottawa",
        population: 70000,
        crimeRateViolent: 15,
        crimeRateNonViolent: 22,
        crimeRateTotal: 37
    },
    {
        provinceId: 2,
        provinceName: "British Columbia",
        cityId: 3,
        cityName: "Vancouver",
        population: 90000,
        crimeRateViolent: 10,
        crimeRateNonViolent: 20,
        crimeRateTotal: 30
    },
    {
        provinceId: 3,
        provinceName: "Quebec",
        cityId: 4,
        cityName: "Montreal",
        population: 60000,
        crimeRateViolent: 13,
        crimeRateNonViolent: 19,
        crimeRateTotal: 32
    }];

    var provinces = [
        { provinceId: 1, provinceName: "Ontario" },
        { provinceId: 2, provinceName: "British Columbia" },
        { provinceId: 3, provinceName: "Quebec" }
    ];

    // Fetch the selected province and city from the request parameters
    const selectedProvinceId = parseInt(req.query.province);
    const selectedCityId = parseInt(req.query.city);

    // Find the selected province and city from the sampleData
    const selectedProvince = sampleData.find(province => province.provinceId === selectedProvinceId);
    const selectedCity = sampleData.find(city => city.cityId === selectedCityId);

    res.render('crimeRate', {
        user: req.Cap805Session.user,
        layout: false,
        sampleData: sampleData,
        provinces: provinces,
        selectedProvince: selectedProvince,
        selectedCity: selectedCity
    });
});

//Forgot Password:
app.post('/forgotpassword', (req, res) => {
    const { email } = req.body;
    let message = 'Email Address is Mandatory.'
    if(email) {
        message = 'An email with an instruction to reset password was sent.'
    }
    res.render("forgotpassword",{ errorMsg: message, layout: false}) 
});

app.get("/resetpassword", (req, res) => {
    res.render("resetPassword",{ user: req.Cap805Session.user, layout: false}) 
});

app.post('/resetpassword', (req, res) => {
    const { password1, password2 } = req.body;
    if (password1 !== password2) {
        res.render("resetPassword", { errorMsg: "Passwords do not match", layout: false });
        return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[%._!])[A-Za-z\d%._!]{2,}$/;
    if (!passwordRegex.test(password1)) {
        res.render("resetPassword", { errorMsg: "Password should contain at least a lowercase, an uppercase, and one of % . ! _", layout: false });
        return;
    }
    if (password1.length > 50) {
        res.render("resetPassword", { errorMsg: "Password should be less than 50 characters", layout: false });
        return;
    }
    res.render("resetPassword", { errorMsg: "Password changed successfully. You can now logged in.", layout: false });
});

app.get("/attractions/add", isUserAdmin, (req, res) => {
    let message = '';
    res.render("addAttractions",{ errorMsg: message, layout: false}) 
});

app.post("/attractions/add", (req, res) => {
    const { attractionName, attractionDesc } = req.body;
  
    // Validate description length
    if (attractionDesc.length > 1000) {
      return res.render('addAttractions', { error: 'Description exceeds the maximum character limit.', layout: false  });
    }
  
    res.render('addAttractions', { success: 'Attraction added successfully!', layout: false });
});

//#endregion

app.listen(HTTP_PORT, OnHttpStart);

module.exports = {
    app,
    ensureLogin,
    ensureAdmin
  }
