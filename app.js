const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const models= require("./dbconnection");
const Item = models.Item;
const List = models.List;
const date = require (__dirname + "/date.js") // becz our module is local and is not installed with npm   ,,,, whenever I say require this module , it will go into that module (date.js) and try to run all of the code inside it ,, whenever we require  module it will bound to const date

// ( console.log(date);  // this will be equal to whatever we exported out of this module )
// console.log(date());


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//Express can only use views folder and app.js by default but we have to tell express explicitly to serve up the css file , inside public you can have your JS, images , css folder
  



// database code here


  const item1 = new Item({
    name : "Welcome to your todo-list!"
  });
  const item2 = new Item({
    name : "Hit the + button to add a new item!"
  });
  const item3 = new Item({
    name : "<-- Hit this to delete an item!"
  });
  const defaultItems = [item1 , item2 , item3];
  // console.log(defaultItems);



const day = date.getDate();  // call the function that is bound to const date

app.get("/" , async (req , res)=> {
   const findData=  await Item.find({});
   if(findData.length === 0) {
    await Item.insertMany(defaultItems);
    res.redirect("/"); // at first it will execute if block and redirected to / route ,, but for the second time,it will not fall into the if block
   }
   else{
res.render("list", {listTitle: day , newListItem: findData});  // * when we write list ,express will look into the views folder and look for a file list with extension .ejs     * we are creating a response by rendering a file list which has to exist inside views folder and has to have extension .ejs and then into that list file we are passing a single variable           * Everytime you try to render list , we have to provide both variables that we want to render
   }

});


// _.capitalize : converts the first character of the string to upper case and the remaining to lowercase
app.get("/:customList" , async (req,res) => {
  const customList =  _.capitalize(req.params.customList);

  const foundList = await List.findOne({name: customList});
  //console.log(foundList)  ... > its output is null ,,, falsy value in JS
  if (!foundList) {
 //create a new list
    const list = new List({
      name: customList,
      items: defaultItems
    });
    list.save();  // await is missed 
  res.redirect("/" + customList);

  } else {
    //show an existing list
    res.render("list", {listTitle: foundList.name , newListItem: foundList.items})
  }

  
});

app.post("/", async (req,res)=> {

const itemName= req.body.newItem;
const listName = req.body.list;
const item = new Item({
  name: itemName
});

if(listName === day) {
  item.save();  // you can say ,,, same as insert
  res.redirect("/");
} else {
  const foundList = await List.findOne({name: listName})
  foundList.items.push(item);
  foundList.save();
  res.redirect("/" + listName);
}

  
});

app.post("/delete" , async(req,res) => {
const checkedItemId = req.body.checkbox;
const listName = req.body.listName;
if(listName === day) {
  await Item.deleteOne({_id: checkedItemId});
  res.redirect("/");
}  else {


  // Assuming you are in an async function or using async/await

try {
  const foundList = await List.findOneAndUpdate(
    { name: listName }, //where list name is this , find it and perform the following operation
    { $pull: { items: { _id: checkedItemId } } }  //the $pull operator to remove an element from the items array within a MongoDB document. The specific element being removed has an _id value that matches the value of checkedItemId
  );
  if (foundList) {
    res.redirect("/" + listName);
  } else {
    // Handle the case where the list wasn't found
    // You can send an error response or redirect as needed
  }
} catch (err) {
  // Handle any errors that occurred during the update
  console.error(err);
  // You can send an error response or redirect to an error page
}

}
//pull from the items array , an item that has an id: checkedItemId
 

});



app.get("/about" , (req,res) => {
    res.render("about");   //way of sending ejs file
})





app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});

/* 
 res.write() to send multiple pieces of data ,,,,, becz there can be only one res.send()

 write res.write(.......) as many times as you want and then atlast write res.send() simply (do not write anything in ()), it will send all the res.writes which you have written ,It allows you to send multiple pieces of html and only once you have done you call res.send() 


******** W3 schools *******
The Date object works with current dates and times based on the system clock.
Date objects are created with new Date().

The getDate() method returns the day of the month (1 to 31) of a date. (PARAMETERS :NONE)
const d = new Date();
let day = d.getDate();

The getDay() method returns the day of the week (0 to 6) of a date. Sunday = 0, Monday = 1, ..(Parameters : none      Return value : number)

const d = new Date();
let day = d.getDay();



******TEMPLATES********
(are used to avoid repetition EXAMPLE : creating too many html pages , even though the content of each is approximately similar)
* We need to create an html template where we can change certain parts of html depending on the logic in our servers
 ******* CREATING FIRST EJS TEMPLATE ********
    EJS : embedded javaScript templating
* EJS allows you to embed JavaScript code within your HTML to dynamically generate content based on conditions. 
*  EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. 
* In order to use ejs , we will create a new folder (views), this is where the view engine will go by default and look for the files that you are trying to render.
* the html valid for .html is valid for .ejs file

*****ABILITY TO RUN CODE INSIDE THE html FILE*****OR*******RUNNING CODE INSIDE THE EJS TEMPLATE*********
*  <% 'Scriptlet' tag, for control-flow, no output     (you can add it around any part of the code that is not html) , (REMEMBER : Every single bit of your code that is javaScript , you need to add this scriplet tag) , (These scriplet tags work on a line by line basis , even if you have two lines of JS that are next to eachother , you still have to add open and close tag on each line , EXAMPLE :  <% if (kindOfDay === "Saturday" || kindOfDay === "Sunday"){ %>
                                                                    <%  } %>)  
*  <%= Outputs the value into the template (HTML escaped)  (things written in this tag are something dynamic) (They are changing based on the logic)  (if something is written in app.js and you want it to appear/output in .ejs file , then these tags are used.....)

********** COMMENTS FOR .ejs FILE ***********
 *  we are going to add a marker(<%= variable-name%>) that is going to tell the file that this is where you should place the value of  a particular variable  
 
* In an EJS (Embedded JavaScript) file, the JavaScript code embedded within the <% %> tags runs on the server side

*  the reason why you don't use <%= %> tags around kindOfDay in the line <% if (kindOfDay === "Saturday" || kindOfDay === "Sunday"){ %> is because that line is part of a control flow statement, and the purpose is not to directly output content to the HTML. 

<!-- <% if (kindOfDay === "Saturday" || kindOfDay === "Sunday"){ %>
        <h1 style="color: purple"><%= kindOfDay %> ToDo List</h1>
   <% } else { %>
    <h1 style="color: orange"><%= kindOfDay %> ToDo List</h1>
  <% } %> -->

  <!-- index = (index + 1) % array.length;  Increment index and reset when it reaches array length -->


// <% for (let i=0 ; i< newListItem.length ; i++) { %>
//     <li> <%= newListItem[i] %></li>
//  <% } %>

  **********LAYOUTS*********
EJS (Embedded JavaScript) layouts are a way to create a consistent structure for your web application's views by allowing you to define a common template that surrounds the content of individual pages. Layouts help you avoid duplicating the same HTML structure across multiple views and make it easier to maintain a unified look and feel throughout your application.Consistency: The common structure and design elements are maintained across all pages, ensuring a consistent user experience.




 EJS does not specifically support blocks, but layouts can be implemented by including headers and footers, like so:


<%- include('header'); -%>
<h1>
  Title
</h1>
<p>
  My page
</p>
<%- include('footer'); -%>

{The top and bottom part are going to stay consistent acroos the website}



*************** Understanding Node Module Exports How to Pass Functions and Data between Files ****************
This is how we can create our own modules and require them and get their functionality exported out of the module to be used anywhere in our  project .     (date.js)
*/


/* IMPORTANT CONCEPTS 

1)
const MY_OBJECT = {'key': 'value'};

//attempting to overwrite the object throws an error
MY_OBJECT = {'OTHER_KEY': 'value'};

//However object keys are not protected , so the following statement is executed without error
MY_OBJECT.key = 'othervalue';

2)
const arr = [];

//it is possible to push items into the array
arr.push('A');

//however , assigning a new array to the variable throws an error
arr = ['B'];




*/







