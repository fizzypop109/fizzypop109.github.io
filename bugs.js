// VARIABLE SETUP //

var bugs = JSON.parse(JSON.stringify(bugs_json));
var container = document.getElementsByClassName("bugs__container")[0];
var hemisphere = "Southern";
var hemButton = document.getElementsByClassName("button__hemisphere")[0];
var data = {};

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
  bugPrice.innerText = "Sell for: " + bug.price + " bells";
  bugPrice.classList.add("bug__price");

  var bugLocation = document.createElement("p");
  bugLocation.innerText = bug.location != "" ? "Location: " + bug.location : "none";
  bugLocation.classList.add("bug__location");

  var bugTime = document.createElement("p");
  bugTime.innerText = bug.time != "" ? "Time: " + bug.time : "none";
  bugTime.classList.add("bug__time");

  var bugMonths = document.createElement("p");
  if (hemisphere == "Southern" && bug.season.southern.length != 0) {
    bugMonths.innerText = "Months: " + bug.season.southern.join(", ");
  } else if (hemisphere == "Northern" && bug.season.northern.length != 0) {
    bugMonths.innerText = "Months: " + bug.season.northern.join(", ");
  } else {
    bugMonths.innerText = "none";
  }
  bugMonths.classList.add("bug__months");

  var bugTrackers = document.createElement("div");
  bugTrackers.classList.add("bug__trackers");

  var bugTrackersItems = document.createElement("div");
  bugTrackersItems.classList.add("bug__trackers__items");

  var bugCaught = document.createElement("input");
  bugCaught.classList.add("bug__caught");
  bugCaught.type = "checkbox";
  bugCaught.name = "Caught";
  bugCaught.id = bug.name + "_caught";

  var bugCaught_label = document.createElement("label");
  bugCaught_label.innerText = "Caught?";
  bugCaught_label.htmlFor = bug.name + "_caught";

  var bugDonated = document.createElement("input");
  bugDonated.classList.add("bug__donated");
  bugDonated.type = "checkbox";
  bugDonated.name = "Donated";
  bugDonated.id = bug.name + "_donated";
  bugDonated.disabled = true;

  var bugDonated_label = document.createElement("label");
  bugDonated_label.innerText = "Donated?";
  bugDonated_label.htmlFor = bug.name + "_donated";

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
    if (hemisphere == "Southern" && bugs[i].season.southern.length != 0) {
      container.children[i].children[5].innerText = "Months: " + bugs[i].season.southern.join(", ");
    } else if (hemisphere == "Northern" && bugs[i].season.northern.length != 0) {
      container.children[i].children[5].innerText = "Months: " + bugs[i].season.northern.join(", ");
    } else {
      container.children[i].children[5].innerText = "none";
    }
  }
}

initBugs();

// LOAD CHECKBOX DATA ON PAGE LOAD //

function loadData() {
  data = JSON.parse(localStorage.getItem('data')) || {};

  if (Object.keys(data).length !== 0) {
    var caughtValues = Object.entries(data['caughtValues']);
    var donatedValues = Object.entries(data['donatedValues']);

    for (const [name, value] of caughtValues) {
      document.getElementById(name).checked = value;
    }

    for (const [name, value] of donatedValues) {
      document.getElementById(name).checked = value;
    }
  }

  // Make sure data is set before we run through the checkboxes
  checkboxSetup();
}

// CHECKBOXES LOCAL STORAGE SETUP //

function checkboxSetup() {

  var caughtCheckboxes = document.getElementsByClassName('bug__caught');
  var caughtValues = data['caughtValues'] || {};

  for (let i = 0; i < caughtCheckboxes.length; i++) {
    // CANNOT UNTICK CAUGHT ATM
    caughtCheckboxes[i].addEventListener("change", function() {
      caughtValues[this.id] = this.checked;

      // Enable/disable Donated checkbox
      document.getElementById(this.id).nextSibling.nextSibling.disabled = !this.checked;

      // Remove donated tick if unchecking caught
      if (this.checked == false) {
        document.getElementById(this.id).nextSibling.nextSibling.checked = false;
      }

      data['caughtValues'] = caughtValues;

      localStorage.setItem('data', JSON.stringify(data));
    });
  }

  var donatedCheckboxes = document.getElementsByClassName('bug__donated');
  var donatedValues = data['donatedValues'] || {};

  for (let i = 0; i < donatedCheckboxes.length; i++) {
    donatedCheckboxes[i].addEventListener("change", function() {
      donatedValues[this.id] = this.checked;

      data['donatedValues'] = donatedValues;

      localStorage.setItem('data', JSON.stringify(data));
    });
  }
}