const express = require("express");
const axios = require('axios');
const app = express();
const path = require("path");

//setproject
app.set("views",path.join(__dirname,"/public/views"));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

const url = "http://localhost:3000";

//var
let userlogin = false;

app.get("/",(req,res) => {
    try{
        if (userlogin == true) {
            res.render("showcar.ejs");
        }
        else if (userlogin == false){
            res.render("login.ejs");
        }
    }
    catch{
        res.status(500).send("error")
    }
});

app.post("/login", async (req,res) => {
    try{
        const response = await axios.get(url + "/getuser");
        response.data.forEach(e => {
            if (req.body.username == e.username && req.body.password == e.password) {
                userlogin = true;
            }
        });
        res.redirect("/");
    }
    catch{
        res.status(500).send("error")
    }
});

app.get("/logout",(req,res) => {
    userlogin = false;
    res.redirect("/")
});

app.get("/createuser",(req,res) => {
    res.render("createuser.ejs");
});

app.post("/createuser", async (req,res) => {
    try{
        const response = await axios.post(url + "/createuser",req.body);
        res.redirect("/");
    }
    catch{
        res.status(500).send("error");
    }
});

app.listen(5500, () => {
    console.log(`Server is running on http://localhost:5500`);
});