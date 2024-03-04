const express = require("express");
const axios = require('axios');
const app = express();
const multer = require("multer")
const path = require("path");

//setproject
app.set("views",path.join(__dirname,"/public/views"));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

const url = "http://localhost:3000";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'./public/images');
    },
    filename: (req, file, cb) => {
      cb(null,Date.now() + file.originalname);
    }
});
const upload = multer({storage: storage});

//var
let userlogin = false;

app.get("/", async (req,res) => {
    try{
        const response = await axios.get(url + "/showcar");
        console.log(response.data);
        if (userlogin == true) {

            res.render("showcar.ejs",{
                showcar: response.data
            });
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

app.get("/createcar",(req,res) => {
    res.render("createcar.ejs");
});

app.post("/createcar",upload.single("Image"), async (req,res) => {
    try{
        let data = {
            licenseplate:req.body.licenseplate,
            year:req.body.year,
            capacity:req.body.capacity,
            priceperday:req.body.priceperday,
            insurance_charge:req.body.insurance_charge,
            brand:req.body.brand,
            color:req.body.color,
            Image:req.file.filename
        };
        const response = await axios.post(url + "/createcar",data);
    }
    catch{
        res.status(500).send("error");
    }
});

app.get("/payment", async (req, res) => {
    try {
        const response = await axios.get(url + "/payment");
        console.log(response.data);
        if (userlogin == true) {
            res.render("payment.ejs", {
                payment: response.data
            });
        } else if (userlogin == false) {
            res.render("login.ejs");
        }
    } catch {
        res.status(500).send("error");
    }
});

app.get("/rental", async (req, res) => {
    try {
        const response = await axios.get(url + "/rental");
        console.log(response.data);
        if (userlogin == true) {
            res.render("rental.ejs", {
                rental: response.data
            });
        } else if (userlogin == false) {
            res.render("login.ejs");
        }
    } catch {
        res.status(500).send("error");
    }
});

app.get("/receipt", async (req, res) => {
    try {
        const response = await axios.get(url + "/receipt");
        console.log(response.data);
        if (userlogin == true) {
            res.render("receipt.ejs", {
                rental: response.data
            });
        } else if (userlogin == false) {
            res.render("login.ejs");
        }
    } catch {
        res.status(500).send("error");
    }
});

app.listen(5500, () => {
    console.log(`Server is running on http://localhost:5500`);
});