var events = [];
var currentTime = moment().hour();
//Current date
$('#currentDay').text(moment().format('dddd,MMMM Do YYYY'));

//local storage
var saveEvents =function (){
    localStorage.setItem('events', JSON.stringify(events));
};

var loadEvents = function (){
    events=JSON.parse(localStorage.getItem(events));
    if (events)}