// axios.js
const express = require("express");
const session = require("express-session");
const axios = require("axios");
const app = express();
const multer = require("multer");
const path = require("path");

//setproject********************************************************************************************
app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({ secret: "mysession", resave: false, saveUninitialized: true })
);

const url = "http://localhost:3000";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

//Menu********************************************************************************
// Your Express.js route handler งั้น ตั้งชื่อไฟล์เป็น index.els แล้ค่อย link to login    ไฟล์ที่จะให้ขึ้นก่อน login  อ่ะ  เปลี่ยนละ
//app.get("/", async (req, res) => {
//  try {
//      const response = await axios.get(url + "/showcar");
//     res.render("showcar.ejs", {
//        menu: "รืก.ejs", // Render the menu
//        showcar: response.data
//    });
// } catch (error) {
//     console.error("Error fetching showcar data:", error);
//    res.status(500).send("An error occurred while fetching showcar data");
// }
//});

//var********************************************************************************************
let userlogin = false;

app.use(
  session({
    secret: "key cookie",
    resave: false,
    saveUninitialized: false,
  })
);

// showcar********************************************************************************************
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(url + "/showcar");
    if (userlogin == true) {
      res.render("showcar.ejs", {
        showcar: response.data,
      });
    } else if (userlogin == false) {
      res.render("login.ejs");
    }
  } catch {
    res.status(500).send("error");
  }
});

// login********************************************************************************************
app.post("/login", async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
    };
    req.session.userlogin_ = data.username;
    const username = req.session.user ? req.session.user.name : "";
    const response = await axios.post(url + "/login", data);
    if (response.data.massage == true) {
      if (data.password === response.data.checkuser.password) {
        if (response.data.checkuser.typeid == "admin") {
          userlogin = true;
          req.session.userid_ = response.data.userid;
          res.redirect("/admincar");
        } else {
          userlogin = true;
          req.session.userid_ = response.data.userid;
          res.redirect("/showcar");
        }
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  } catch {
    res.status(500).redirect("/");
  }
});

// logout********************************************************************************************
app.get("/logout", (req, res) => {
  userlogin = false;
  res.redirect("/");
});

// createuser********************************************************************************************
app.get("/createuser", (req, res) => {
  res.render("createuser.ejs");
});

// createuser********************************************************************************************
app.post("/createuser", async (req, res) => {
  try {
    const response = await axios.post(url + "/createuser", req.body);
    res.redirect("/");
  } catch {
    res.status(500).send("error");
  }
});

// createcar********************************************************************************************
app.get("/createcar", (req, res) => {
  res.render("createcar.ejs");
});

app.get("/admincreatecar", (req, res) => {
  res.render("admincreatecar.ejs");
});

// createcar********************************************************************************************
app.post("/createcar", upload.single("Image"), async (req, res) => {
  try {
    let data = {
      licenseplate: req.body.licenseplate,
      year: req.body.year,
      capacity: req.body.capacity,
      priceperday: req.body.priceperday,
      priceperday: req.body.priceperday,
      brand: req.body.brand,
      color: req.body.color,
      Image: req.file.filename,
    };
    const response = await axios.post(url + "/createcar", data);
  } catch {
    res.status(500).send("error");
  }
});

// showcar********************************************************************************************
app.get("/showcar", async (req, res) => {
  try {
    const response = await axios.get(url + "/showcar");
    // เช็ค session และ userlogin
    if (req.session.userdata || userlogin == true) {
      res.render("showcar.ejs", {
        showcar: response.data,
      });
    } else {
      res.render("login.ejs");
    }
  } catch {
    res.status(500).send("error");
  }
});

// payment********************************************************************************************
app.get("/payment", async (req, res) => {
  try {
    res.render("payment.ejs");
  } catch {
    res.status(500).send("error");
  }
});

app.post("/payment", async (req, res) => {
  try {
    const data = {
      carholdername: req.session.userlogin_,
      cardnumber: req.body.cardnumber,
    };
    const response = await axios.post(url + "/payment", data);
    res.redirect("/payment");
  } catch (err) {}
});

// rental********************************************************************************************
app.get("/rental/:id", async (req, res) => {
  try {
    let checkbtnshow = false;
    const responseuser = await axios.get(
      url + "/getuser/" + req.session.userid_
    );
    const responsecar = await axios.get(url + "/detailrent/" + req.params.id);
    const responsepayment = await axios.get(
      url + "/payment/" + req.session.userlogin_
    );
    const responserental = await axios.get(
      url + "/rental/" + responseuser.data.userid
    );
    if (responserental.data == "") {
      checkbtnshow = true;
    } else {
      checkbtnshow = false;
    }
    res.render("rental.ejs", {
      datauser: responseuser.data,
      datacar: responsecar.data,
      datapayment: responsepayment.data,
      checkbtnshow: checkbtnshow,
      datarental: responserental.data,
    });
  } catch {
    res.status(500).send("error");
  }
});

app.post("/rental", async (req, res) => {
  // const data = {
  //     timein:req.body.checkindate,
  //     timeout:req.body.checkoutdate
  // }
  console.log(req.body.carid);
  await axios.post(url + "/rental", req.body);
  res.redirect("/rental/" + req.body.carid);
});

// receipt********************************************************************************************
app.get("/receipt/:id", async (req, res) => {
  try {
    const response = await axios.get(url + "/rental/" + req.params.id);
    const responsepriceperday = await axios.get(
      url + "/showcar/" + response.data.carid
    );
    let time1 = new Date(response.data.checkindate);
    let time2 = new Date(response.data.checkoutdate);
    let sumtime = new Date(time1 - time2);
    let price =
      sumtime.getDay() * parseInt(responsepriceperday.data.priceperday);
    console.log(price);
    res.render("receipt.ejs", { price: price });
  } catch {
    res.status(500).send("error receipt id");
  }
});
app.post("/receipt/:id", async (req, res) => {
  try {
  } catch {
    res.status(500).send("error");
  }
});

app.get("/admincar", async (req, res) => {
  try {
    const response = await axios.get(url + "/showcar");
    // เช็ค session และ userlogin
    if (req.session.userdata || userlogin == true) {
      res.render("showcar.ejs", {
        showcar: response.data,
      });
    } else {
      res.render("login.ejs");
    }
  } catch {
    res.status(500).send("error");
  }
});

app.get("/detailrent/:carid", async (req, res) => {
  try {
    const response = await axios.get(url + "/detailrent/" + req.params.carid);
    res.render("detailrent.ejs", { data: response.data });
  } catch {
    res.status(500).redirect("/showcar");
  }
});

app.get("/history/", async (req, res) => {
  try {
    const response = await axios.get(url + "/rental");
    res.render("history.ejs", { data: response.data });
    console.log(response.data);
  } catch {
    res.status(500).send("error");
  }
});
app.get("/deletehistory/:id", async (req, res) => {
  try {
    await axios.delete(url + "/rental/" + req.params.id);
    res.render("history.ejs", { data: response.data });
    // res.
    console.log(response.data);
  } catch {
    res.status(500).redirect("/history");
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await axios.delete(url + "/history/" + req.params.rentalid);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(5500, () => {
  console.log(`Server is running on http://localhost:5500`);
});
