const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
//const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.set("strictQuery",true);

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemSchema = new mongoose.Schema({
    name : String
});

const listSchema = new mongoose.Schema({
    name : String,
    listItems : [itemSchema]
});

const Item = mongoose.model("Item", itemSchema);

const List =mongoose.model("List", listSchema);

const item1 = new Item({
    name : "Welcome to your Todo list"
});

const item2 = new Item({
    name : "Welcome to your Todo list"
});

const item3 = new Item({
    name : "Welcome to your Todo list"
});

const defaultItems = [item1, item2, item3];

  

app.get("/",function(req,res){
    //const day = date.getDate();
    //console.log(day);
    Item.find({},function(err, foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("New Items inserted successfully!");
                }
              });
              res.redirect("/");            
        } else {
            //console.log(foundItems);
            res.render("list",{listTitle : "Today", newlistItems: foundItems});
        }
   
    })
});


app.post("/",function(req,res)
{
    //console.log(req.body.list);
    const itemName = req.body.newItem;
    const list_Name = req.body.list;

    const item = new Item({
        name : itemName
    });

    if(list_Name === "Today")
    {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name : list_Name}, function(err, foundList){
            foundList.listItems.push(item);
            foundList.save();
            res.redirect("/"+list_Name);
        })
    }
});

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox;

    //which list item belongs to
    const listName = req.body.listName;
    if(listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err) {
                console.log("Checked item deleted Successfully");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({name:listName},{$pull:{listItems : {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        })
    }
    
});

app.get("/:customlistName", function(req,res){
    const listName = _.capitalize(req.params.customlistName);
    //console.log(req.params.customlistName);
    List.findOne({name:listName}, function(err, foundList){
        if(!err) {
            if(!foundList) {
                //Create a new list
                const list = new List({
                    name : listName,
                    listItems : defaultItems
                });
                list.save();
                res.redirect("/"+listName);
            } else {
                //Show an existing list
                res.render("list", {listTitle : foundList.name, newlistItems: foundList.listItems})
            }
        }
    });
});


app.listen(3000, function(){
    console.log("Server is started at port 3000");
});