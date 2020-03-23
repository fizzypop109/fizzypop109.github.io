// VARIABLE SETUP //

var bugs = JSON.parse(JSON.stringify(bugs_json));
var container = document.getElementsByClassName("bugs__container")[0];
var hemisphere = "Southern";
var hemButton = document.getElementsByClassName("button__hemisphere")[0];

// INITIALISE BUG DISPLAY //

function initBugs() {
  // Empty the bugs__container
  var child = container.lastElementChild;  
  while (child) { 
    container.removeChild(child); 
    child = container.lastElementChild; 
  } 
  
  for (var bug of bugs) {
    createBug(bug);
  }
}

function createBug(bug) {
  var bugBox = document.createElement("div");
  bugBox.classList.add("bug__container");
  
  var bugImage = document.createElement("img");
  bugImage.classList.add("bug__image");
  bugImage.src = bug.image;
  
  var bugName = document.createElement("h2");
  bugName.innerText = bug.name;
  bugName.classList.add("bug__name");
  
  var bugPrice = document.createElement("p");
  bugPrice.innerText = bug.price;
  bugPrice.classList.add("bug__price");

  var bugLocation = document.createElement("p");
  bugLocation.innerText = bug.location != "" ? bug.location : "none";
  bugLocation.classList.add("bug__location");

  var bugTime = document.createElement("p");
  bugTime.innerText = bug.time != "" ? bug.time : "none";
  bugTime.classList.add("bug__time");

  var bugMonths = document.createElement("p");
  bugMonths.innerText = hemisphere == "Southern" ? bug.season.southern : bug.season.northern;
  if (bugMonths.innerText == "") { bugMonths.innerText = "none" };
  bugMonths.classList.add("bug__months");

  var bugTrackers = document.createElement("div");
  bugTrackers.classList.add("bug__trackers");

  var bugTrackersItems = document.createElement("div");
  bugTrackersItems.classList.add("bug__trackers__items");

  var bugCaught = document.createElement("input");
  bugCaught.classList.add("bug__caught");
  bugCaught.type = "checkbox";
  bugCaught.name = "Caught";
  bugCaught.id = "bugCaught";
  var bugCaught_label = document.createElement("label");
  bugCaught_label.innerText = "Caught?";
  bugCaught_label.htmlFor = "bugCaught";

  var bugDonated = document.createElement("input");
  bugDonated.type = "checkbox";
  bugDonated.name = "Caught";
  bugDonated.id = "bugDonated";
  var bugDonated_label = document.createElement("label");
  bugDonated_label.innerText = "Donated?";
  bugDonated_label.htmlFor = "bugDonated";

  bugTrackersItems.appendChild(bugCaught_label);
  bugTrackersItems.appendChild(bugCaught);

  bugTrackersItems.appendChild(bugDonated_label);
  bugTrackersItems.appendChild(bugDonated);

  bugTrackers.appendChild(bugTrackersItems);

  bugBox.appendChild(bugImage);
  bugBox.appendChild(bugName);
  bugBox.appendChild(bugPrice);
  bugBox.appendChild(bugLocation);
  bugBox.appendChild(bugTime);
  bugBox.appendChild(bugMonths);
  bugBox.appendChild(bugTrackers);

  container.appendChild(bugBox);
}

// SWITCH HEMISPHERE BUTTON //

function switchHem() {
  hemisphere = hemisphere == "Southern" ? "Northern" : "Southern";
  hemButton.innerText = hemisphere;

  // Specifically only replace the bugMonths of each bug
  for (var i = 0; i < bugs.length; i++) {
    container.children[i].children[5].innerText = hemisphere == "Southern" ? bugs[i].season.southern : bugs[i].season.northern;
  }
}

initBugs();