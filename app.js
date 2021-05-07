//jshint esversion:6
const bodyParser=require("body-parser");
const express=require("express");
const ejs=require("ejs");
const app=express();
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
require('dotenv').config()

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true,useUnifiedTopology:true});
const userSchema= new mongoose.Schema({
  email:String,
  password:String

});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ['password']} );
const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home")
});

app.get("/login",function(req,res){
  res.render("login")
});

app.get("/register",function(req,res){
  res.render("register")
});

app.post("/register",function(req,res){
  const user= new User({
    email:req.body.username,
    password:req.body.password

  });
  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});
app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({email:username},function(err,found){
    if(err){
      console.log(err);
    }else{
      console.log(found);
    if(found.password ===password){
      res.render("secrets");
    }
    }
  });

});











app.listen(3000,function(){
  console.log("sever started 3000");
});
