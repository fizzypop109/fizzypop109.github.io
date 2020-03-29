// VARIABLE SETUP //

var MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
var HOURS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]

var items;
var itemType;

// Set items and itemType based on the open
switch(document.getElementsByClassName('title')[0].innerText) {
  case "Fish":
    items = JSON.parse(JSON.stringify(fish_json));
    itemType = 'fish';
    break;
  case "Bugs":
    items = JSON.parse(JSON.stringify(bugs_json));
    itemType = 'bug';
    break;
  case "Fossils":
    items = JSON.parse(JSON.stringify(fossils_json));
    itemType = 'fossil';
    break;
}

var hemisphere = "Southern";

var container = document.getElementsByClassName("main-container")[0];
var hemButton = document.getElementsByClassName("button__hemisphere")[0];

var data = {};

var currentMonthIndex = new Date().getMonth();
var currentHourIndex = new Date().getHours();

// INITIALISE DISPLAY OF ITEMS //

function initItems() {
  // Empty the container
  var child = container.lastElementChild;  
  while (child) { 
    container.removeChild(child); 
    child = container.lastElementChild; 
  }
  
  // For each item, create a "card"
  for (var item of items) {
    createItem(item);
  }
}

// CREATES A CARD FOR A GIVEN ITEM //

function createItem(item) {
  // The main card
  var itemBox = document.createElement("div");
  itemBox.classList.add(itemType + "__container", "container");

  var infoDiv = document.createElement("div");
  infoDiv.classList.add(itemType + "__container__info", "info");

  // Item name
  var itemName = document.createElement("h2");
  itemName.innerText = item.name;
  itemName.classList.add(itemType + "__name", "name");
    
  // Item price
  var itemPrice = document.createElement("p");
  itemPrice.innerText = item.price != 0 ? "Sell for: " + item.price + " bells" : "Sell for: Unknown bells";
  itemPrice.classList.add(itemType + "__price", "price");

  // Checkbox container and items
  var itemTrackers = document.createElement("div");
  itemTrackers.classList.add(itemType + "__trackers", "trackers");

  var itemTrackersItems = document.createElement("div");
  itemTrackersItems.classList.add(itemType + "__trackers__items", "trackers__items");

  // Caught checkbox
  var itemCaught = document.createElement("input");
  itemCaught.classList.add(itemType + "__caught", "caught");
  itemCaught.type = "checkbox";
  itemCaught.name = "Caught";
  itemCaught.id = item.name + "_caught";

  var itemCaught_label = document.createElement("label");
  itemCaught_label.htmlFor = item.name + "_caught";

  // Donated checkbox
  var itemDonated = document.createElement("input");
  itemDonated.classList.add(itemType + "__donated", "donated");
  itemDonated.type = "checkbox";
  itemDonated.name = "Donated";
  itemDonated.id = item.name + "_donated";
  itemDonated.disabled = true;

  var itemDonated_label = document.createElement("label");
  itemDonated_label.innerText = "Donated?";
  itemDonated_label.htmlFor = item.name + "_donated";

  // Bug and Fish cards need a separate infoDiv to hold image, name, and price, as well as time and month data
  if (itemType !== "fossil") {
    // Item image
    var itemImage = document.createElement("img");
    itemImage.classList.add(itemType + "__image", "image");
    itemImage.src = item.image;

    var infoTextDiv = document.createElement("div");
    infoTextDiv.classList.add(itemType + "__container__info__text", "container__info__text");

    // Item location
    var itemLocation = document.createElement("p");
    itemLocation.innerText = item.location != "" ? "Location: " + item.location : "Location: Unknown";
    itemLocation.classList.add(itemType + "__location", "location");

    // Item time availability
    var itemTime = createClock(item);

    // Item month availability
    var itemMonths = createCalendar(item);

    infoDiv.appendChild(itemImage);

    infoTextDiv.appendChild(itemName);
    infoTextDiv.appendChild(itemPrice);
    infoTextDiv.appendChild(itemLocation);

    // Fish have an extra piece of info - shadow size
    if (itemType == "fish") {
      // Fish shadow size
      var itemSize = document.createElement("p");
      itemSize.innerText = item.shadowSize != "" ? "Shadow Size: " + item.shadowSize : "Shadow Size: Unknown";
      itemSize.classList.add(itemType + "__size", "size");

      infoTextDiv.appendChild(itemSize);
    }

    infoDiv.appendChild(infoTextDiv);

    itemBox.appendChild(infoDiv);
    itemBox.appendChild(itemTime);
    itemBox.appendChild(itemMonths);

    itemCaught_label.innerText = "Caught?";
  } else {
    // Fossil cards only need to have a name and price
    itemBox.appendChild(itemName);
    itemBox.appendChild(itemPrice);

    itemCaught_label.innerText = "Found?";
  }

  // Append all the universal elements

  itemTrackersItems.appendChild(itemCaught_label);
  itemTrackersItems.appendChild(itemCaught);

  itemTrackersItems.appendChild(itemDonated_label);
  itemTrackersItems.appendChild(itemDonated);

  itemTrackers.appendChild(itemTrackersItems);

  itemBox.appendChild(itemTrackers);

  container.appendChild(itemBox);
}

// FILTER LIST OF ITEMS BASED ON WHAT'S IN THE SEARCH BAR //

function search() {
  // Loop through all containers, and if the title doesn't include the search query, set display to none
  var query = document.getElementsByClassName("filters__search")[0].value;
  var filter = query.toUpperCase();
  var containers = document.getElementsByClassName("container");

  for (i = 0; i < containers.length; i++) {
    var name = containers[i].getElementsByTagName("h2")[0].innerText;
    if (name.toUpperCase().indexOf(filter) > -1) {
      containers[i].style.display = "";
    } else {
      containers[i].style.display = "none";
    }
  }
}

// FILTER LIST OF ITEMS BASED ON THE DROPDOWN SELECTION //

function handleFilterChange(e) {
  var filterType = e.target.value;

  var containers = document.getElementsByClassName("container");

  switch (filterType) {
    case "all":
      filterAll(containers);
      break;
    case "now":
      filterNow(containers);
      break;
    case "month":
      filterMonth(containers);
      break;
    case "leaving":
      filterLeaving(containers);
      break;
    case "new":
      filterNew(containers);
      break;
  }
}

// SHOW ALL ITEMS //

function filterAll(containers) {
  for (i = 0; i < containers.length; i++) {
    containers[i].style.display = "flex";
  }
}

// SHOW ONLY ITEMS AVAILABLE RIGHT NOW (HOUR AND MONTH) //

function filterNow(containers) {
  // Reset display of each container first
  filterAll(containers);

  // For each item container
  for (i = 0; i < containers.length; i++) {
    var availableHours = containers[i].getElementsByClassName("clock")[0].getElementsByClassName("available");
    var hoursArray = [].slice.call(availableHours);

    var availableMonths = containers[i].getElementsByClassName("calendar")[0].getElementsByClassName("available");
    var monthsArray = [].slice.call(availableMonths);

    var month = MONTHS[currentMonthIndex];

    var hourAvailable = false;
    var monthAvailable = false;

    // Search through hoursArray
    for (var j = 0; j < hoursArray.length; j++) {
      var hourDiv = hoursArray[j];
      if (hourDiv.classList.contains(currentHourIndex)) {
        // The currently looping container is available in the current hour
        hourAvailable = true;
        break;
      }
    }

    // Search through monthsArray
    for (var j = 0; j < monthsArray.length; j++) {
      var monthDiv = monthsArray[j];
      if (monthDiv.classList.contains(month)) {
        // The currently looping container is available in the current month
        monthAvailable = true;
        break;
      }
    }

    // If either hourAvailable or monthAvailable are false, the item is NOT available now, so hide it
    if (!hourAvailable || !monthAvailable) {
      containers[i].style.display = "none";
    }
  }
}

// SHOW ONLY ITEMS AVAILABLE THIS MONTH (HOUR NOT CONSIDERED)

function filterMonth(containers) {
  // Reset display of each container first
  filterAll(containers);

  // For each item container
  for (i = 0; i < containers.length; i++) {
    var availableMonths = containers[i].getElementsByClassName("calendar")[0].getElementsByClassName("available");
    var monthsArray = [].slice.call(availableMonths);

    var month = MONTHS[currentMonthIndex];

    var monthAvailable = false;

    // Search through monthsArray
    for (var j = 0; j < monthsArray.length; j++) {
      var monthDiv = monthsArray[j];
      if (monthDiv.classList.contains(month)) {
        // The current item IS available this month, so set the flag and leave the loop
        monthAvailable = true;
        break;
      }
    }

    // If after looping through each available month, the flag has not been set, hide the item
    if (!monthAvailable) {
      containers[i].style.display = "none";
    }
  }
}

// SHOW ONLY ITEMS NOT AVAILABLE NEXT MONTH AND AVAILABLE THIS MONTH

function filterLeaving(containers) {
  // Reset display of each container first
  filterAll(containers);

  // For each item container
  for (i = 0; i < containers.length; i++) {
    var months = containers[i].getElementsByClassName("calendar")[0].getElementsByClassName("month");
    var monthsArray = [].slice.call(months);

    var currentMonth = MONTHS[currentMonthIndex];
    var nextMonth = "";
    currentMonth == "december" ? nextMonth = "january" : nextMonth = MONTHS[currentMonth + 1];

    currentMonthDiv = containers[i].getElementsByClassName("calendar")[0].getElementsByClassName(currentMonth)[0];
    var nextMonthDiv = "";
    currentMonthDiv.classList.contains("december") ? nextMonthDiv = months[0] : nextMonthDiv = currentMonthDiv.nextSibling;

    if (currentMonthDiv.classList.contains("available") && !nextMonthDiv.classList.contains("available")) {
      // Do nothing, we only care if this specific combination ISN'T the case
    } else {
      containers[i].style.display = "none";
    }
  }
}

// SHOW ONLY ITEMS NOT AVAILABLE LAST MONTH AND AVAILABLE THIS MONTH

function filterNew(containers) {
  // Reset display of each container first
  filterAll(containers);

  // For each item container
  for (i = 0; i < containers.length; i++) {
    var months = containers[i].getElementsByClassName("calendar")[0].getElementsByClassName("month");
    var monthsArray = [].slice.call(months);

    var currentMonth = MONTHS[currentMonthIndex];
    var lastMonth = "";
    currentMonth == "january" ? lastMonth = "december" : lastMonth = MONTHS[currentMonth - 1];

    currentMonthDiv = containers[i].getElementsByClassName("calendar")[0].getElementsByClassName(currentMonth)[0];
    var lastMonthDiv = "";
    currentMonthDiv.classList.contains("january") ? lastMonthDiv = months[11] : lastMonthDiv = currentMonthDiv.previousSibling;

    if (currentMonthDiv.classList.contains("available") && !lastMonthDiv.classList.contains("available")) {
      // Do nothing, we only care if this specific combination ISN'T the case
    } else {
      containers[i].style.display = "none";
    }
  }
}

// SWITCH HEMISPHERE BUTTON //

function switchHem() {
  // Change the hemisphere variable and set the text of the button
  hemisphere = hemisphere == "Southern" ? "Northern" : "Southern";
  hemButton.innerText = hemisphere;

  var itemContainers = document.getElementsByClassName("container");

  // Go through the calendar month divs and remove the "available" classes
  for (var i = 0; i < itemContainers.length; i++) {
    var calendarDiv = itemContainers[i].children[2].children[0];
    var months = calendarDiv.getElementsByTagName('div');

    for (var j = 0; j < months.length; j++) {
      months[j].classList.remove("available");
    }

    var itemMonths = [];

    // Set itemMonths to be the new hemisphere's month availability data
    if (hemisphere == "Southern" && items[i].season.southern.length != 0) {
      itemMonths = items[i].season.southern;
    } else if (hemisphere == "Northern" && items[i].season.northern.length != 0) {
      itemMonths = items[i].season.northern;
    }

    // Add the "available" class to the divs of the new available months
    for (let k = 0; k < itemMonths.length; k++) {
      if (itemMonths[k] == MONTHS[k]) { months[k].classList.add("available"); };
    }
  }
}

// CREATE AND POPULATE A 24-HOUR BAR TO DISPLAY THE TIME AVAILABILITY FOR A GIVEN ITEM //

function createClock(item) {
  var clockContainer = document.createElement("div");
  clockContainer.classList.add(itemType + "__time", "time");

  var clock = document.createElement("div");
  clock.classList.add(itemType + "__time__clock", "clock");

  var hourDivs = [];

  // Create a div for each hour
  for (let i = 0; i < HOURS.length; i++) {
    var hourDiv = document.createElement("div");
    hourDiv.classList.add(itemType + "__hour__" + HOURS[i], "hour", HOURS[i]);
    if (i == 11) { hourDiv.classList.add("eleven-am") };
    clock.appendChild(hourDiv);
    hourDivs.push(hourDiv);
  }

  // Add the "available" class to all of the relevant hour divs
  for (let i = 0; i < item.time.length; i++) {
    if (item.time[i] == HOURS[i]) { hourDivs[i].classList.add("available"); };
  }

  // Add a small white dot to the current hour
  var currentTimeIcon = document.createElement("img");
  currentTimeIcon.classList.add("current__time");
  currentTimeIcon.src = "white-circle.png";
  hourDivs[currentHourIndex].appendChild(currentTimeIcon);
  
  clockContainer.appendChild(clock);

  // Create a line of text to label 12AM and 12PM on the bar
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

// CREATE AND POPULATE A 12-MONTH BAR TO DISPLAY THE MONTH AVAILABILITY FOR A GIVEN ITEM //

function createCalendar(item) {
  var calendarContainer = document.createElement("div");
  calendarContainer.classList.add(itemType + "__months", "months");

  var calendar = document.createElement("div");
  calendar.classList.add(itemType + "__time__calendar", "calendar");

  var monthDivs = [];

  // Create a div for each month
  for (let i = 0; i < MONTHS.length; i++) {
    var monthDiv = document.createElement("div");
    monthDiv.classList.add(itemType + "__month__" + MONTHS[i], "month", MONTHS[i]);
    calendar.appendChild(monthDiv);
    monthDivs.push(monthDiv);
  }

  var itemMonths = [];

  // Set itemMonths depending on the selected hemisphere
  if (hemisphere == "Southern" && item.season.southern.length != 0) {
    itemMonths = item.season.southern;
  } else if (hemisphere == "Northern" && item.season.northern.length != 0) {
    itemMonths = item.season.northern;
  }

  // Add the "available" class to the relevant month divs
  for (let i = 0; i < itemMonths.length; i++) {
    if (itemMonths[i] == MONTHS[i]) { monthDivs[i].classList.add("available"); };
  }

  // Add a small white dot to the current month
  var currentTimeIcon = document.createElement("img");
  currentTimeIcon.classList.add("current__time");
  currentTimeIcon.src = "white-circle.png";
  monthDivs[currentMonthIndex].appendChild(currentTimeIcon);

  calendarContainer.appendChild(calendar);

  // Add a line of text to label January and December for easier reading
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

// LOAD CHECKBOX DATA ON PAGE LOAD //

function loadData() {
  data = JSON.parse(localStorage.getItem('data')) || {};

  // If data isn't empty, separate it out into caughtValues and donatedValues, and set the checkboxes that were stored
  if (Object.keys(data).length !== 0) {
      if (typeof data[itemType] != 'undefined') {
      var itemTypeValues = Object.entries(data[itemType]);

      // Iterate through caughtValues
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

      // Iterate through donatedValues
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

  // Ensures data has been loaded before we setup the checkboxes and search bar
  checkboxSetup();
}

// SETUP LOCAL STORAGE AND GENERAL USABILITY FOR THE CHECKBOXES //

function checkboxSetup() {

  var itemTypeValues = data[itemType] || {};

  var caughtCheckboxes = document.getElementsByClassName(itemType + '__caught');
  var caughtValues = itemTypeValues['caughtValues'] || {};

  // Add a change listener to each caughtCheckbox
  for (let i = 0; i < caughtCheckboxes.length; i++) {
    caughtCheckboxes[i].addEventListener("change", function() {
      // Store the checked values in caughtValues
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

      // add caughtValues to itemTypeValues, add itemTypeValues to data, then set data in localStorage
      itemTypeValues['caughtValues'] = caughtValues;
      data[itemType] = itemTypeValues;
      localStorage.setItem('data', JSON.stringify(data));
    });
  }

  var donatedCheckboxes = document.getElementsByClassName(itemType + '__donated');
  var donatedValues = itemTypeValues['donatedValues'] || {};

  // Add a change listener to each donatedCheckbox
  for (let i = 0; i < donatedCheckboxes.length; i++) {
    donatedCheckboxes[i].addEventListener("change", function() {
      // Store the checked values in donatedValues
      donatedValues[this.id] = this.checked;

      // add donatedValues to itemTypeValues, add itemTypeValues to data, then set data in localStorage
      itemTypeValues['donatedValues'] = donatedValues;
      data[itemType] = itemTypeValues;
      localStorage.setItem('data', JSON.stringify(data));
    });
  }
}

// Initialise the display
initItems();