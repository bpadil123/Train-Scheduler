 // Initialize Firebase
 var config = {
     apiKey: "AIzaSyDWoD49ZRigEVVL_ttRN8TBK1YcJtzuKus",
     authDomain: "train-planner-ccdda.firebaseapp.com",
     databaseURL: "https://train-planner-ccdda.firebaseio.com",
     projectId: "train-planner-ccdda",
     storageBucket: "",
     messagingSenderId: "690512433138"
 };
 firebase.initializeApp(config);

 var database = firebase.database();

 //Initial Values
 var trainName = "";
 var destination = "";
 var firstTT = "";
 var frequency = 0;

 //On click function

 $("#addButton").on("click", function (event) {
     event.preventDefault();
     console.log("clicked");


     //grab inputs
     trainName = $("#tname-input").val().trim();
     destination = $("#dest-input").val().trim();
     firstTT = $("#ftraintime-input").val().trim();
     frequency = $("#freq-input").val().trim();

     console.log(trainName);
     console.log(destination);
     console.log(firstTT);
     console.log(frequency);
     // Code for "setting values in the database"

     database.ref().push({
         trainName: trainName,
         destination: destination,
         firstTT: firstTT,
         frequency: frequency,
         dateAdded: firebase.database.ServerValue.TIMESTAMP
     });






 })

 //adding child to firebase to create an train list

 database.ref().on("child_added", function (childSnapshot) {
     console.log(childSnapshot.val().trainName);
     console.log(childSnapshot.val().destination);
     console.log(childSnapshot.val().firstTT);
     console.log(childSnapshot.val().frequency);

     //train converter to last year

     var convertedTrainTime = moment(childSnapshot.val().firstTT, "hh:mm").subtract(1, "years");

     //calculating difference between  train start and current time

     var timeDiff = moment().diff(moment(convertedTrainTime), "minutes");

     //how long until 

     var timeAppart = timeDiff % childSnapshot.val().frequency;

     //minutes until train arrives

     var minsNextTrain = childSnapshot.val().frequency - timeAppart;

     var nextArrival = moment().add(minsNextTrain, "m").format("LT");
     //update the rows on the html



     $(".trainList").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + nextArrival + "</td><td>" + minsNextTrain + "</td>" );
 })