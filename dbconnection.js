const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/todoListdb");


const itemsSchema = new mongoose.Schema({
  name: String
})
const Item = mongoose.model("Item", itemsSchema);  // collection name will automatically be converted to plural form


const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);


module.exports = {
  Item: Item,
  List: List
};






//when checkbox is changed from check to uncheck and vice versa then we are going to run this line of JS code (onChane="this.form.submit()") which will take the current form that the input is inside then its going to submit it to make that post request to the delete route