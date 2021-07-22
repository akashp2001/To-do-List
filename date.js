//module.exports is an object...
//thus multiple functions can be passed in this manner
//module.exports.getDate is made to have the value of getDate function
//rather than just exporting just one function

module.exports.getDate = getDate;

function getDate() {

  // to get the date of the present day:-
  var currentDate = new Date;

  //toLocaleDateString function helps in giving the date in the user specified language
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  //storing the value of the present date as words in US english
  var day = currentDate.toLocaleDateString("en-US", options);

  return day;
}

//similar to above way a new function can also be exported in this way.
//and in the app.js file whichever function the user wishes can be called by either using getDay or using getDate
//the --x-- below is like a key...and helps in identifying which function the user is gonna pass.
module.exports.getDay = getDay;

function getDay() {

  // to get the date of the present day:-
  var currentDate = new Date;

  //toLocaleDateString function helps in giving the date in the user specified language
  var options = {
    weekday: "long"
  };

  //storing the value of the present date as words in US english
  var day = currentDate.toLocaleDateString("en-US", options);

  return day;
}


//the starting few lines have the code to find present day before it was moved to the new custom node module date.ejs
//the moving of date finding method was done to refactor the code.Its not a NECESSITY.



// to get the date of the present day:-
// var currentDate = new Date;


// to get the day of the present week in the form of an integer from o to 6:-
// var today = currentDate.getDay();

//a better way to get the day and date of today is below...
//toLocaleDateString function helps in giving the date in the user specified language
// var options={
//   weekday:"long",
//   day:"numeric",
//   month:"long"
// };

//storing the value of the present date as words in US english
// var day=currentDate.toLocaleDateString("en-US",options);

//initialising the day to an empty string
// var day = "";

//opening a switch statement which contains the integer value of present day
// switch (today) {
//   case 0:
//     day = "sunday!!!";
//     break;
//   case 1:
//     day = "monday!!!";
//     break;
//   case 2:
//     day = "tuesday!!!";
//     break;
//   case 3:
//     day = "wednesday!!!";
//     break;
//   case 4:
//     day = "thursday!!!";
//     break;
//   case 5:
//     day = "friday!!!";
//     break;
//   case 6:
//     day = "saturday!!!";
//     break;
//   default:
//     console.log("day not available");
// }

//------end of date finding code------
