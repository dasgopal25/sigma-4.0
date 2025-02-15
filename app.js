if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
// const { string, required } = require("joi");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

const dbUrl = process.env.ATLAS_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});

app.use(session({ secret:process.env.SECRET,store, resave: false, saveUninitialized: true, cookie: { expires: Date.now() + 1000 * 60 * 60 * 24 * 3, maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: flash }, }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.originalUrl = req.originalUrl;
  next();
});

// app.get("/demouser",async(req,res)=>{
//   let fackUser = new User ({
//     email:"student@gmail.com",
//     username:"delta-student",
//   });
//   let registeredUser = await User.register(fackUser,"helloworld");
//   res.send(registeredUser);
// })



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",user);



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "SOMTHING WRONG!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});


app.listen( () => {
  console.log("server is listening on port 8080");
});
