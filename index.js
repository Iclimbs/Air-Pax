const starttime= "06:30";
const endtime= "07:30";

// const userInput = '05:20';
const starthours = starttime.slice(0, 2);
const startminutes = starttime.slice(3);
const startimetotal = Number(starttime.slice(0, 2))*60 + Number(starttime.slice(3))
const  endhours = endtime.slice(0, 2);
const  endminutes = endtime.slice(3);
const endimetotal =  Number(endtime.slice(0, 2))*60 + Number(endtime.slice(3))

console.log("Difference time ", endimetotal-startimetotal);


// const date = new Date();
// date.setHours(hours, minutes);
// console.log(date);
