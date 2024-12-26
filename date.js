
// ****** This code in date.js is completely reusable , we can require and reuse it anywhere we like in the project

// In each module , the module free variable is the reference to the object representing the current  module
// If i were to use this module , then i can require this module to run all the code in here

// (module.exports = "Hello WOrld";  // I am exporting from this module just a little string and its now available in my app.js )

  // the reason why dont we put () here and instead put them in here console.log(date()) in app.js is becz we want it to run in app.js and not here  ,,,,   module.exports is a JS object  (module.exports is same as just exports)

exports.getDate =  function () {
const today = new Date(); // This line creates a new Date object named today. The Date object represents the current date and time based on the system's clock.

const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}; // specifies how you want the date to be formatted.

return today.toLocaleDateString("en-US", options);
// toLocaleDateString is a method of the Date object that converts the date into a localized string representation based on the provided options and locale.
};

exports.getDay = function () {
    const today = new Date(); 
    const options = {
        weekday: "long"
    }; 
    return today.toLocaleDateString("en-US", options);   
    
    };


    //Function expression : we could set an anonymous function equal to a variable