//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "Welcome to Life Tapestry — A dynamic and expressive Blog website where words come to life and writers find their digital haven. Tailored for blog writers, our platform is designed to elevate your writing experience, foster community engagement, and amplify your unique voice.Seamlessly compose and format your blogs with our user-friendly writing interface, allowing you to focus on your words without distractions.Whether you're into travel, tech, lifestyle, or personal growth, BlogHub offers a diverse range of categories to showcase your expertise and connect with like-minded readers.Engage with a thriving community of writers and readers. Receive feedback, build connections, and participate in discussions to enrich your blogging journey.Your blogs will look stunning on any device, ensuring that your audience can enjoy your content wherever they are."

const aboutContent = "Welcome to Life Tapestry, a digital space crafted with passion and expertise. I am Rajkumar A, the creator and developer behind this platform. Here, technology meets creativity, resulting in a unique and personalized experience for every visitor.";

const contactContent = "We value your connection and welcome the opportunity to hear from you. Whether you have questions, feedback, or just want to say hello, we're here and ready to engage. Reach out through the following channels:"
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema= new mongoose.Schema({title: String, content: String});

const post= mongoose.model("post",postSchema);

app.get("/",function(req,res){
  post.find().then((response)=>{
    res.render("home",{
      content:homeStartingContent,
      post:response
    });
  });
});

app.get("/posts/:postName", (req,res) => {
  const blogTitle=req.params.postName
  post.findOne({_id: blogTitle}).then((response)=>{
    res.render("blog",{
      title:response.title,
      content:response.content
    })
  })
});


app.get("/about",(req,res) => {
  res.render("about",{
    content: aboutContent,
  });
});

app.get("/contact", (req,res) => {
  res.render("contact",{
    content: contactContent,
  });
});


app.get("/compose",(req,res) => {
  res.render("compose");
});

app.post("/compose",(req,res) => {
  const post1=new post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post1.save().then((res)=>{
    console.log(res);
  })
  res.redirect("/");
});

let port= process.env.PORT;
if(port== null || port == ""){
  port=3000;
}
app.listen(port, function() {
  console.log("Server started on port: " + port );
});
