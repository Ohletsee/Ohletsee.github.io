var config;
var database;
var ref;
var scheduleHTML;

$(document).ready(function() {

	// Add an on-click event listener for the Add button
	$("#add-schedule").on("click", function() {
		updateDatabase();
	})
})

// Initialize Firebase
config = {
  apiKey: "AIzaSyAq1ll7RB0hMJdYkwWFGqYyTzAhiSB1Y0E",
  authDomain: "train-schedule-2801a.firebaseapp.com",
  databaseURL: "https://train-schedule-2801a.firebaseio.com",
  projectId: "train-schedule-2801a",
  storageBucket: "train-schedule-2801a.appspot.com",
  messagingSenderId: "585495357068"
};

firebase.initializeApp(config);

// Create a reference variable to the database
database = firebase.database();

var ref = database.ref('trains');

// This Firebase function runs when the page loads or a value changes in the database
ref.on('value', displaySchedule, displayError);

// Oops! Firebase had a problem
function displayError(error) {
	console.log('Firebase Error!! ', error);
}

// Display the train schedule on the web page
function displaySchedule(data) {

	// Don't display the train schedule when the database is empty
	if (data.val() != null) {

		$("#display-schedule").empty();

		var trains = data.val();
		var keys = Object.keys(trains);

		for (var i = 0; i < keys.length; i++) {
			var j = keys[i];

			// Convert from military time to 12 hour time
			var timeAMPM = moment(trains[j].arrivalTime, "hh:mm").format("hh:mm A");

			// Change the arrival time to the moment format
			var arrivalTime = moment(trains[j].arrivalTime, "hh:mm");

			// Calculate the minutes until arrival
			var minutesAway = arrivalTime.diff(moment(), "minutes");

			if (minutesAway < 0) {
				minutesAway = moment().diff(arrivalTime, "minutes");
				minutesAway =+ 1440 - minutesAway;
			}

			// Create the HTML and display the train schedule
	    scheduleHTML = "<tr>";
	    scheduleHTML += "<td>" + trains[j].name + "</td>";
	    scheduleHTML += "<td>" + trains[j].destination + "</td>";
	    scheduleHTML += "<td>" + trains[j].frequency + "</td>";
	    scheduleHTML += "<td>" + timeAMPM + "</td>";
	    scheduleHTML += "<td>" + minutesAway + "</td>";
	    scheduleHTML += "</tr>";

	    // Add the HTML to the web page  
	    $("#display-schedule").append(scheduleHTML);
   	}
	}
}

// Validate the user input and add the train schedule to the database
function updateDatabase() {
	var validData = true;
	var regExpResult;

	var myName = $("#input-name").val().trim();
	var myDestination = $("#input-destination").val().trim();
	var myArrivalTime = $("#input-arrival-time").val().trim();
	var myFrequency = $("#input-frequency").val().trim();

	// Validate the user input
	if (myName === "") {
		validData = false;
	}

	if (myDestination === "") {
		validData = false;
	}

   regExpResult = /^([01]\d|2[0-3]):?([0-5]\d)$/.test(myArrivalTime);
   if (!regExpResult) {
	  validData = false;
   }

	if (myFrequency === "") {
		validData = false;
	}

	// When the user input is valid, update the database	
	if (validData) {
		var schedule = {
			name: myName,
			destination: myDestination,
			arrivalTime: myArrivalTime,
			frequency: myFrequency
		}
		ref.push(schedule);
	}
}
