const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const items = ["Buy apples"];
const workItems = [];

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine","ejs");


app.get("/",function(req,res){
    const day = date.getDate();
    console.log(day);
    res.render("list",{listTitle : day, newlistItems:items});
});

app.post("/",function(req,res)
{
    //console.log(req.body.list);
    const item = req.body.newItem;
    
    if (req.body.list === "Work")
    {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    } 
});

app.get("/work", function(req,res){
    res.render("list", {listTitle : "Work List", newlistItems : workItems});
});

app.get("/about", function(req,res){
    res.render("about");
})

app.listen(3000, function(){
    console.log("Server is started at port 3000");
});