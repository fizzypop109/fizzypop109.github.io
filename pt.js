// VARIABLE SETUP //

var items;
var itemType = '';

switch(document.getElementsByClassName('title')[0].innerText) {
  case "Fish":
    items = JSON.parse(JSON.stringify(fish_json));
    itemType = 'fish';
    break;
  case "Bugs":
    items = JSON.parse(JSON.stringify(bugs_json));
    itemType = 'bug';
    break;
}

var container = document.getElementsByClassName("main-container")[0];
var hemisphere = "Southern";
var hemButton = document.getElementsByClassName("button__hemisphere")[0];
var data = {};
var MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

// INITIALISE BUG DISPLAY //

function initItems() {
  // Empty the container
  var child = container.lastElementChild;  
  while (child) { 
    container.removeChild(child); 
    child = container.lastElementChild; 
  } 
  
  for (var item of items) {
    createItem(item);
  }
}

function createItem(item) {
  var itemBox = document.createElement("div");
  itemBox.classList.add(itemType + "__container", "container");
  
  var itemImage = document.createElement("img");
  itemImage.classList.add(itemType + "__image", "image");
  itemImage.src = item.image;
  
  var itemName = document.createElement("h2");
  itemName.innerText = item.name;
  itemName.classList.add(itemType + "__name", "name");
  
  var itemPrice = document.createElement("p");
  itemPrice.innerText = item.price != 0 ? "Sell for: " + item.price + " bells" : "Sell for: Unknown bells";
  itemPrice.classList.add(itemType + "__price", "price");

  var itemLocation = document.createElement("p");
  itemLocation.innerText = item.location != "" ? "Location: " + item.location : "Location: Unknown";
  itemLocation.classList.add(itemType + "__location", "location");

  // var itemTime = document.createElement("p");
  // itemTime.innerText = item.time != "" ? "Time: " + item.time : "Time: Unknown";
  // itemTime.classList.add(itemType + "__time", "time");

  // Create and populate a 24-hour clock bar to display the time
  var itemTime = createClock(item);

  // var itemMonths = document.createElement("p");
  // if (hemisphere == "Southern" && item.season.southern.length != 0) {
  //   itemMonths.innerText = "Months: " + item.season.southern.join(", ");
  // } else if (hemisphere == "Northern" && item.season.northern.length != 0) {
  //   itemMonths.innerText = "Months: " + item.season.northern.join(", ");
  // } else {
  //   itemMonths.innerText = "Months: Unknown";
  // }
  // itemMonths.classList.add(itemType + "__months", "months");

  var itemMonths = createCalendar(item);

  var itemTrackers = document.createElement("div");
  itemTrackers.classList.add(itemType + "__trackers", "trackers");

  var itemTrackersItems = document.createElement("div");
  itemTrackersItems.classList.add(itemType + "__trackers__items", "trackers__items");

  var itemCaught = document.createElement("input");
  itemCaught.classList.add(itemType + "__caught", "caught");
  itemCaught.type = "checkbox";
  itemCaught.name = "Caught";
  itemCaught.id = item.name + "_caught";

  var itemCaught_label = document.createElement("label");
  itemCaught_label.innerText = "Caught?";
  itemCaught_label.htmlFor = item.name + "_caught";

  var itemDonated = document.createElement("input");
  itemDonated.classList.add(itemType + "__donated", "donated");
  itemDonated.type = "checkbox";
  itemDonated.name = "Donated";
  itemDonated.id = item.name + "_donated";
  itemDonated.disabled = true;

  var itemDonated_label = document.createElement("label");
  itemDonated_label.innerText = "Donated?";
  itemDonated_label.htmlFor = item.name + "_donated";

  itemTrackersItems.appendChild(itemCaught_label);
  itemTrackersItems.appendChild(itemCaught);

  itemTrackersItems.appendChild(itemDonated_label);
  itemTrackersItems.appendChild(itemDonated);

  itemTrackers.appendChild(itemTrackersItems);

  itemBox.appendChild(itemImage);
  itemBox.appendChild(itemName);
  itemBox.appendChild(itemPrice);
  itemBox.appendChild(itemLocation);
  itemBox.appendChild(itemTime);
  itemBox.appendChild(itemMonths);
  itemBox.appendChild(itemTrackers);

  container.appendChild(itemBox);
}

// SWITCH HEMISPHERE BUTTON //

function switchHem() {
  hemisphere = hemisphere == "Southern" ? "Northern" : "Southern";
  hemButton.innerText = hemisphere;

  var itemContainers = document.getElementsByClassName("container");

  for (var i = 0; i < itemContainers.length; i++) {
    var calendarDiv = itemContainers[i].children[5].children[0];
    var months = calendarDiv.getElementsByTagName('*');

    for (var j = 0; j < months.length; j++) {
      months[j].classList.remove("available");
    }

    var itemMonths = [];

    if (hemisphere == "Southern" && items[i].season.southern.length != 0) {
      itemMonths = items[i].season.southern;
    } else if (hemisphere == "Northern" && items[i].season.northern.length != 0) {
      itemMonths = items[i].season.northern;
    }

    for (let k = 0; k < itemMonths.length; k++) {
      if (itemMonths[k] == MONTHS[k]) { months[k].classList.add("available") };
    }
  }
}

function createClock(item) {
  var clockContainer = document.createElement("div");
  clockContainer.classList.add(itemType + "__time", "time");

  var clock = document.createElement("div");
  clock.classList.add(itemType + "__time__clock", "clock");

  var hourDivs = [];

  for (let i = 0; i < 24; i++) {
    var hourDiv = document.createElement("div");
    hourDiv.classList.add(itemType + "__time__" + i, "hour");
    if (i == 11) { hourDiv.classList.add("eleven-am") }
    clock.appendChild(hourDiv);
    hourDivs.push(hourDiv);
  }

  var times = item.time.split(" - ");
  var start = parseInt(times[0]);
  var end = parseInt(times[1]);

  for (let i = start; i < end; i++) {
    hourDivs[i].classList.add("available");
  }

  clockContainer.appendChild(clock);

  var clockTextContainer = document.createElement("div");
  clockTextContainer.classList.add(itemType + "__time__text", "time__text");

  var twelveAMl = document.createElement("p");
  twelveAMl.classList.add(itemType + "__time__12am-l", "12am-l");
  twelveAMl.innerText = "12am";

  var twelvePM = document.createElement("p");
  twelvePM.classList.add(itemType + "__time__12pm", "12pm");
  twelvePM.innerText = "12pm";

  var twelveAMr = document.createElement("p");
  twelveAMr.classList.add(itemType + "__time__12am-r", "12am-r");
  twelveAMr.innerText = "12am";

  clockTextContainer.appendChild(twelveAMl);
  clockTextContainer.appendChild(twelvePM);
  clockTextContainer.appendChild(twelveAMr);

  clockContainer.appendChild(clockTextContainer);

  return clockContainer;
}

function createCalendar(item) {
  var calendarContainer = document.createElement("div");
  calendarContainer.classList.add(itemType + "__months", "months");

  var calendar = document.createElement("div");
  calendar.classList.add(itemType + "__time__calendar", "calendar");

  var monthDivs = [];

  for (let i = 0; i < MONTHS.length; i++) {
    var monthDiv = document.createElement("div");
    monthDiv.classList.add(itemType + "__month__" + MONTHS[i], "month");
    calendar.appendChild(monthDiv);
    monthDivs.push(monthDiv);
  }

  var itemMonths = [];

  if (hemisphere == "Southern" && item.season.southern.length != 0) {
    itemMonths = item.season.southern;
  } else if (hemisphere == "Northern" && item.season.northern.length != 0) {
    itemMonths = item.season.northern;
  }

  for (let i = 0; i < itemMonths.length; i++) {
    if (itemMonths[i] == MONTHS[i]) { monthDivs[i].classList.add("available"); };
  }

  calendarContainer.appendChild(calendar);

  var calendarTextContainer = document.createElement("div");
  calendarTextContainer.classList.add(itemType + "__months__text", "months__text");

  var jan = document.createElement("p");
  jan.classList.add(itemType + "__months__jan", "jan");
  jan.innerText = "Jan";

  var dec = document.createElement("p");
  dec.classList.add(itemType + "__months__dec", "dec");
  dec.innerText = "Dec";

  calendarTextContainer.appendChild(jan);
  calendarTextContainer.appendChild(dec);

  calendarContainer.appendChild(calendarTextContainer);

  return calendarContainer;
}

initItems();

// LOAD CHECKBOX DATA ON PAGE LOAD //

function loadData() {
  data = JSON.parse(localStorage.getItem('data')) || {};

  if (Object.keys(data).length !== 0) {
      if (typeof data[itemType] != 'undefined') {
      var itemTypeValues = Object.entries(data[itemType]);

      if (typeof data[itemType]['caughtValues'] != "undefined") {
        var caughtValues = Object.entries(data[itemType]['caughtValues']);

        for (const [name, value] of caughtValues) {
          document.getElementById(name).checked = value;
          // If the caught box is checked, enable the donated box
          if (value == true) {
            document.getElementById(name).nextSibling.nextSibling.disabled = false;
          }
        }
      }

      if (typeof data[itemType]['donatedValues'] != "undefined") {
        var donatedValues = Object.entries(data[itemType]['donatedValues']);

        for (const [name, value] of donatedValues) {
          document.getElementById(name).checked = value;
          // If the donated box is checked, enable it
          if (value == true) {
            document.getElementById(name).disabled = false;
          }
        }
      }
    }
  }

  // Make sure data is set before we run through the checkboxes
  checkboxSetup();
}

// CHECKBOXES LOCAL STORAGE SETUP //

function checkboxSetup() {

  var itemTypeValues = data[itemType] || {};

  var caughtCheckboxes = document.getElementsByClassName(itemType + '__caught');
  var caughtValues = itemTypeValues['caughtValues'] || {};

  for (let i = 0; i < caughtCheckboxes.length; i++) {
    caughtCheckboxes[i].addEventListener("change", function() {
      caughtValues[this.id] = this.checked;

      // Enable/disable Donated checkbox
      document.getElementById(this.id).nextSibling.nextSibling.disabled = !this.checked;

      // Remove donated tick if unchecking caught
      if (this.checked == false) {
        document.getElementById(this.id).nextSibling.nextSibling.checked = false;
        donatedValues[document.getElementById(this.id).nextSibling.nextSibling.id] = false;

        itemTypeValues['donatedValues'] = donatedValues;
        data[itemType] = itemTypeValues;
        localStorage.setItem('data', JSON.stringify(data));
      }

      itemTypeValues['caughtValues'] = caughtValues;
      data[itemType] = itemTypeValues;
      localStorage.setItem('data', JSON.stringify(data));
    });
  }

  var donatedCheckboxes = document.getElementsByClassName(itemType + '__donated');
  var donatedValues = itemTypeValues['donatedValues'] || {};

  for (let i = 0; i < donatedCheckboxes.length; i++) {
    donatedCheckboxes[i].addEventListener("change", function() {
      donatedValues[this.id] = this.checked;

      itemTypeValues['donatedValues'] = donatedValues;
      data[itemType] = itemTypeValues;
      localStorage.setItem('data', JSON.stringify(data));
    });
  }
}