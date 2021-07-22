
const express = require('express');

const bodyParser = require('body-parser');

//acquiring EJS template using --require
const ejs = require('ejs');

//requiring the mongoose package after installing
const mongoose = require('mongoose');

//requiring the date.js file to be used to re-factor the code.
//its an example of a custom node.js file.
const date = require(__dirname + '/date.js');

//requiring lodash to always capitalise the starting of the newly created list name
const _=require("lodash");

const app = express();

//to include external files such as css or js files...
//to serve up the files when website is loaded up
app.use(express.static("public"));

//setting the ejs to view-engine so that we can use it along with express in our servers
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

//declaring a global variable called day which has the value of the current day
var day;

//connecting to the local mongodb database on port-27017 using mongoose
//todolistDB--->database name
mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//creating a new schema for to-do-list
//this is the main list Schema which is present in the home route
const itemsSchema = new mongoose.Schema({
  name: String
})

//model Item which is of Schema--->itemsSchema
const Item = mongoose.model("Item", itemsSchema);

//creating documents of model--->Item
//creating default documents which are by default present in the home route
const cricket = new Item({
  name: "Gotta watch cricket!!!"
})

const study = new Item({
  name: "Gotta study today!!!"
})

const football = new Item({
  name: "Gotta watch football!!!"
})

//storing the default documents in an array
var itemsArray = [cricket, study, football];

//creating an another schema for multiple routes/web pages
//to be used later down below
const listsSchema = new mongoose.Schema({
  name: String,
  //it also has a parameter called addedLists which accepts members of type itemsSchema
  addedLists: [itemsSchema]
})

//creating a new model of Schema--->listsSchema
const List = mongoose.model("List", listsSchema);




// get method starts
app.get("/", function(req, res) {
  //date.getDate or date.getDay can be done to either get whole date or only to get the day.
  //x here is like a key in the date.js document
   day = date.getDay();

  //using the below code
  //Item.find() helps in finding or displaying all the elements present
  //in find method inside {} the condition for specific elements can be specified
  //if left eempty it will disply all documents
  //xyz is an array with JSON objects representing the information present in model Item
  //xyz represnts the documents present in the Item model
  Item.find({}, function(err, xyz) {
    if (err) {
      console.log(err);
    } else {
      //if the database is empty and doesnt have any information yet then the if statement is executed
      //the default items are added if the database is empty and th epage is being rendered for first time.
      if (xyz.length === 0) {
        //inserting the existing default items into the database
        //the insertMany method takes an array of elements as parameter
        Item.insertMany(itemsArray, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("no problems bruh!!!...default items inserted...");
          }
        })
        //called after inserting documents to redirect back to the home page so that this time since the array length or database is not empty the else statement gets executed this time and the information is rendered to the user instaed of inserting the same elements again and again
        res.redirect('/');
      } else {
        //finally rendering the value to the list.ejs file in views folder and replacing the --title-- markup with this value
        //note-the ejs template will look inside views folder by default
        res.render("list", {
          title: day,
          //passing over the entire document array to the list.ejs page to be rendered when user requests it in browser
          newListItem: xyz
        })
      }
    }
  });
})
// get function ends for home route


//routing parameters method to create multiple pages using routing parameters and mongodb methods
app.get("/:topping", function(req, res) {
  //stores the route parameter typed by the user in a variable
  const routeName = _.capitalize(req.params.topping);
//using findone method to see if the list document already exists in the database
//of if the user is typing the list name for the first time
  List.findOne({
    name: routeName
  }, function(err, parameter) {
    if (err) {
      console.log(err);
    } else {
      //if the document typed by the user already exists ---->
      if (parameter) {
        //just rendering over the list ejs template with the title as the name parameter and newListItem as the array of default items
        res.render("list", {
          title: parameter.name,
          newListItem: parameter.addedLists
        });
      } else {
        //if the document doesnt already exist the we are creating one
        const sampleName = new List({
          //giving the name of doc as the routename and addedLists as the itemsArray
          //name of the document,routeName and title of the page are all the same.
          name: routeName,
          //thus whenever the user creates a new to-do-list that is goes to a new route name...the default items in the itemsArray is added to the List model document also.
          addedLists: itemsArray
        })
//then we are saving the document into the database
        sampleName.save();
//finally we are redirecting to the typed url to render the list ejs this time and display the list
        res.redirect("/" + routeName);
      }
    }
  });
})


//post route when the user hits + button in the form
app.post("/", function(req, res) {
  //gets the value added by the user using bodyParser
  var item2 = req.body.text1;
  //gets the value of the submit button which has same value as of the title of the web page
  var customName=req.body.submit123;
  //creating a document of model---->Item
  //it has only one parameter-name,which has been assigned to a value of item2
  //item2 is the value entered by the user in the form
  //whenever the user hits the + button the post request gets triggered and a new document gets created
  const item1 = new Item({
    name: item2
  })
  //this if statement finds out if the post request came from home page or any of the custom pages
  if(customName===day){
    //the request cam from home page.
    //this save the entered info into the database collection--->Items
    item1.save();
    //redirecting back to home page to trigger get request which helps in displaying the entered information by rendering the list.ejs
    res.redirect("/");
  }else{
    //using findOne method to find out the document which has same name as the title of this web pg
    //akash here represents the documents
    //its not an array cos its findOne method and not find() method
    List.findOne({name:customName},function(err,akash){
      //using callback function to push the created document into the addedLists array which is present inside the List Model.
        akash.addedLists.push(item1);
        //saving the document
        akash.save();
        //redirecting back to the custom-route page to trigger the get request.
        res.redirect("/"+customName);
    })
  }
})


app.post("/delete", function(req, res) {
  //gets the id of the document which has to deleted i.e, the document the user has checked out
  var del = req.body.deletePurpose;
  //gets the value of the hidden input present in the form
  //it has value of the title of that web page.
  var del12=req.body.backendPurpose;
  //if its home web page --->
  if(del12===day){
    //deleting the checked item
    Item.deleteOne({
      _id: del
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted successfully!!");
      }
      //redirecting back to the home route so that the get request can be called once again and the list gets updated once again after removing the item specified by the user
      res.redirect("/");
    })
  }else{
    //effiecient method which helps in deleting an item in the custom lists
    //$pull helps in pulling a particular documet from an array of documets by traversing through it.
    List.findOneAndUpdate({name:del12},{ $pull: {addedLists:{ _id:del } } },function(err,updatedList){
      if(err){
        console.log(err);
      }else{
        //redirecting back to custom web pg after updating and deleting the documenent.
        res.redirect("/"+del12);
      }
    })
  }
})


//listening to the  specified port--->
app.listen(3000, function() {
  console.log("the server is up and runnin");
})









//getting the work to-do list web page when the user tries to go to localhost:3000/work
//since the new page is similar to the old page and only the values in the list to be entered by the user and the heading of the list changes the same list.ejs template is applied to thsi also with some changes
// app.get("/work", function(req, res) {
//   //rendering and displaying the list.ejs file when user tries to access it with some parameters assed to it also...
//   res.render("list", {
//     title: "work",
//     newListItem: workItems
//   })
// })

//getting the about web-pg for the user
// app.get("/about", function(req, res) {
//   res.render("about");
// })

//refer post for "/" for more on this depreceated post method

// app.post("/work",function(req,res){
//   var work=req.body.text1;
//   workItems.push(work);
//   res.redirect("/work");
// })
