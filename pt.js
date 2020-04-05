// VARIABLE SETUP //

var MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
var HOURS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]

var items;
var itemType;

// Holds successfully filtered items - needed to be able to search already filtered items
var filterResults = [];

// Holds donated items to hide/show while showing All ONLY
var donatedItems = [];

// Set items and itemType based on the open page
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

// Get the Hemisphere value from localStorage, else set to Southern
var hemisphere = localStorage.getItem('hemisphere') || "Southern";

// Get the value of donatedHidden from localStorage, else set to false
var donatedHidden = localStorage.getItem('donatedHidden') || 'false';

// Check if the user already has had their fossil data cleared, else set to false
var oldFossilsCleared = localStorage.getItem('oldFossilsCleared') || "false";

// Get and store the main container (holds all the item containers) and the hemipshere button and toggleDonated button
var container = document.getElementsByClassName("main-container")[0];
var hemButton = document.getElementsByClassName("button__hemisphere")[0];
var toggleDonatedButton = document.getElementsByClassName("button__toggleDonated")[0];

// Get and store all containers on the page
var containers = document.getElementsByClassName("container");

// Check required as `hemButton` doesn't exist on fossil page
if (hemButton) { hemButton.innerText = hemisphere };

if (donatedHidden == 'false') {
  toggleDonatedButton.innerText = "Hide Donated";
} else {
  toggleDonatedButton.innerText = "Show Donated";
  container.classList.add('hide-donated');
}

// Setup localStorage object
var data = {};

// Get and store the current month and hour
var currentMonthIndex = new Date().getMonth();
var currentHourIndex = new Date().getHours();

// INITIALISATION FUNCTIONS //

/**
 * Create the main container and run a function to create each item container
 */
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

/**
 * Create a container and necessary elements for each given item
 * @param  {Object} item A single object within the itemType JSON
 */
function createItem(item) {
  // The main card
  var itemBox = document.createElement("div");
  itemBox.classList.add(itemType + "__container", "container");

  // For Bugs and Fish items
  if (itemType !== "fossil") {
    // Item info
    var infoDiv = document.createElement("div");
    infoDiv.classList.add(itemType + "__container__info", "info");

    // Item image
    var itemImage = document.createElement("img");
    itemImage.classList.add(itemType + "__image", "image");
    itemImage.src = item.image;

    // Item info text (name, price, location)
    var infoTextDiv = document.createElement("div");
    infoTextDiv.classList.add(itemType + "__container__info__text", "container__info__text");

    // Item name
    var itemName = document.createElement("h2");
    itemName.innerText = item.name;
    itemName.classList.add(itemType + "__name", "name");
      
    // Item price
    var itemPrice = document.createElement("p");
    itemPrice.innerText = item.price != 0 ? "Sell for: " + item.price + " bells" : "Sell for: Unknown bells";
    itemPrice.classList.add(itemType + "__price", "price");

    // Item location
    var itemLocation = document.createElement("p");
    itemLocation.innerText = item.location != "" ? "Location: " + item.location : "Location: Unknown";
    itemLocation.classList.add(itemType + "__location", "location");

    // Item time availability
    var itemTime = createClock(item);

    // Item month availability
    var itemMonths = createCalendar(item);

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

    var itemDonated_label = document.createElement("label");
    itemDonated_label.innerText = "Donated?";
    itemDonated_label.htmlFor = item.name + "_donated";

    infoTextDiv.appendChild(itemName);
    infoTextDiv.appendChild(itemPrice);
    infoTextDiv.appendChild(itemLocation);

    if (itemType == "fish") {
      // Fish shadow size
      var itemSize = document.createElement("p");
      itemSize.innerText = item.shadowSize != "" ? "Shadow Size: " + item.shadowSize : "Shadow Size: Unknown";
      itemSize.classList.add(itemType + "__size", "size");

      infoTextDiv.appendChild(itemSize);
    }

    infoDiv.appendChild(itemImage);
    infoDiv.appendChild(infoTextDiv);

    itemBox.appendChild(infoDiv);
    itemBox.appendChild(itemTime);
    itemBox.appendChild(itemMonths);

    itemCaught_label.innerText = "Caught?";

    // Append all the universal elements

    itemTrackersItems.appendChild(itemCaught_label);
    itemTrackersItems.appendChild(itemCaught);

    itemTrackersItems.appendChild(itemDonated_label);
    itemTrackersItems.appendChild(itemDonated);

    itemTrackers.appendChild(itemTrackersItems);

    itemBox.appendChild(itemTrackers);

    container.appendChild(itemBox);
  } else {
    // If the fossil has multiple parts, create those elements, otherwise, just add a name and price
    if (item.parts) {
      // Item name
      var itemName = document.createElement("h2");
      itemName.innerText = item.name;
      itemName.classList.add(itemType + "__name", "name");

      // Item parts
      var partsDiv = document.createElement("div");
      partsDiv.classList.add(itemType + "__container__parts", "parts");

      // For each part in one fossil
      for (var i = 0; i < item.parts.length; i++) {
        // Fossil/Part container
        var partContainer = document.createElement("div");
        partContainer.classList.add("fossil__container__part", "part");

        createFossil(item.name, item.parts[i], partContainer)

        partsDiv.appendChild(partContainer);
      }

      itemBox.appendChild(itemName);
      itemBox.appendChild(partsDiv);

      container.appendChild(itemBox);
    } else {
      createFossil(item.name, item, itemBox);

      container.appendChild(itemBox);
    }
  }
}

/**
 * Create and populate a name, price, and trackers for a given fossil or part
 */
function createFossil(fossil, part, container) {
  // Item name
  var partName = document.createElement("h2");
  partName.innerText = part.name;
  partName.classList.add("fossil__part__name", "part__name");
       
  // Item price
  var partPrice = document.createElement("p");
  partPrice.innerText = part.price != 0 ? "Sell for: " + part.price + " bells" : "Sell for: Unknown bells";
  partPrice.classList.add("fossil__part__price", "price");

  // Checkbox container and items
  var partTrackers = document.createElement("div");
  partTrackers.classList.add("fossil__trackers", "trackers");

  var partTrackersItems = document.createElement("div");
  partTrackersItems.classList.add("fossil__trackers__items", "trackers__items");

  // Caught checkbox
  var partFound = document.createElement("input");
  partFound.classList.add("fossil__caught", "caught");
  partFound.type = "checkbox";
  partFound.name = "Caught";
  partFound.id = "";
  part.name == fossil ? partFound.id = part.name + "_caught" : partFound.id = fossil + "__" + part.name + "_caught";

  var partFound_label = document.createElement("label");
  partFound_label.htmlFor = part.name + "_caught";
  partFound_label.innerText = "Found?";

  // Donated checkbox
  var partDonated = document.createElement("input");
  partDonated.classList.add("fossil__donated", "donated");
  partDonated.type = "checkbox";
  partDonated.name = "Donated";
  partDonated.id = "";
  part.name == fossil ? partDonated.id = part.name + "_donated" : partDonated.id = fossil + "__" + part.name + "_donated";

  var partDonated_label = document.createElement("label");
  partDonated_label.innerText = "Donated?";
  partDonated_label.htmlFor = part.name + "_donated";

  // Append all the universal elements

  partTrackersItems.appendChild(partFound_label);
  partTrackersItems.appendChild(partFound);

  partTrackersItems.appendChild(partDonated_label);
  partTrackersItems.appendChild(partDonated);

  partTrackers.appendChild(partTrackersItems);

  container.appendChild(partName);
  container.appendChild(partPrice);
  container.appendChild(partTrackers);
}

/**
 * Create and populate a 24-hour bar to display the time availability for a given item
 * @param  {Object} item A single object within the itemType JSON
 */
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

/**
 * Create and populate a 12-month bar to display the month availability for a given item
 * @param  {Object} item A single object within the itemType JSON
 */
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

/**
 * Get the checkbox data from localStorage and set the necessary on-page elements
 */
function loadData() {
  data = JSON.parse(localStorage.getItem('data')) || {};

  // Clear out the old fossil data if it hasn't already been done
  if (oldFossilsCleared == "false") {
    // Make sure data actually HAS fossil data first
    if (data['fossil']) {
      data['fossil'] = {};
      localStorage.setItem('data', JSON.stringify(data));
      localStorage.setItem('oldFossilsCleared', "true");
    }
  }

  // If data isn't empty, separate it out into caughtValues and donatedValues, and set the checkboxes that were stored
  if (Object.keys(data).length !== 0) {
      if (typeof data[itemType] != 'undefined') {
      var itemTypeValues = Object.entries(data[itemType]);

      // Iterate through caughtValues
      if (typeof data[itemType]['caughtValues'] != "undefined") {
        var caughtValues = Object.entries(data[itemType]['caughtValues']);

        for (const [name, value] of caughtValues) {
          document.getElementById(name).checked = value;
        }
      }

      // Iterate through donatedValues
      if (typeof data[itemType]['donatedValues'] != "undefined") {
        var donatedValues = Object.entries(data[itemType]['donatedValues']);

        for (const [name, value] of donatedValues) {
          document.getElementById(name).checked = value;
          // If the checkbox is ticked, add `is-donated` class to the item container
          if (value) {
            if (itemType !== 'fossil') {
              document.getElementById(name).parentElement.parentElement.parentElement.classList.add('is-donated')
            } else {
              const itemContainer = getFossilContainer(document.getElementById(name));

              if (checkFossilCompletion(itemContainer)) {
                itemContainer.classList.add('is-donated');
              }
            }
          }
        }
      }
    }
  }

  // Ensures data has been loaded before we setup the checkboxes and search bar
  checkboxSetup();
}

/**
 * Setup the caught and donated checkboxes with eventListeners and localStorage saving
 */
function checkboxSetup() {
  var itemTypeValues = data[itemType] || {};

  var caughtCheckboxes = document.getElementsByClassName(itemType + '__caught');
  var caughtValues = itemTypeValues['caughtValues'] || {};

  var donatedCheckboxes = document.getElementsByClassName(itemType + '__donated');
  var donatedValues = itemTypeValues['donatedValues'] || {};

  // Temporary separation of fossil and non-fossil setup until I clean it up
  if (itemType !== "fossil") {
    // Add a change listener to each caughtCheckbox
    for (let i = 0; i < caughtCheckboxes.length; i++) {
      caughtCheckboxes[i].addEventListener("change", function() {
        // Store the checked values in caughtValues
        caughtValues[this.id] = this.checked;

        // add caughtValues to itemTypeValues, add itemTypeValues to data, then set data in localStorage
        itemTypeValues['caughtValues'] = caughtValues;
        data[itemType] = itemTypeValues;
        localStorage.setItem('data', JSON.stringify(data));
      });
    }

    // Add a change listener to each donatedCheckbox
    for (let i = 0; i < donatedCheckboxes.length; i++) {
      donatedCheckboxes[i].addEventListener("change", function() {
        // Store the checked values in donatedValues
        donatedValues[this.id] = this.checked;

        const itemContainer = this.parentElement.parentElement.parentElement;

        // If donated box is ticked, check the caught box too
        if (this.checked) {
          document.getElementById(this.id).previousSibling.previousSibling.checked = true;
          caughtValues[document.getElementById(this.id).previousSibling.previousSibling.id] = true;

          itemTypeValues['caughtValues'] = caughtValues;
          data[itemType] = itemTypeValues;
          localStorage.setItem('data', JSON.stringify(data));

          // add is-donated class to the container for filtering purposes
          itemContainer.classList.add('is-donated')
        } else {
          // remove is-donated class from the container for filtering purposes
          itemContainer.classList.remove('is-donated')
        }

        // add donatedValues to itemTypeValues, add itemTypeValues to data, then set data in localStorage
        itemTypeValues['donatedValues'] = donatedValues;
        data[itemType] = itemTypeValues;
        localStorage.setItem('data', JSON.stringify(data));

        // run search to ensure
        search()
      });
    }
  } else {
    // Add a change listener to each caughtCheckbox
    for (let i = 0; i < caughtCheckboxes.length; i++) {
      caughtCheckboxes[i].addEventListener("change", function() {
        // Store the checked values in caughtValues
        caughtValues[this.id] = this.checked;

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
      const itemContainer = getFossilContainer(donatedCheckboxes[i])
      
      donatedCheckboxes[i].addEventListener("change", function() {
        // Store the checked values in donatedValues
        donatedValues[this.id] = this.checked;

        // If donated box is ticked, check the caught box too
        if (this.checked == true) {
          document.getElementById(this.id).previousSibling.previousSibling.checked = true;
          caughtValues[document.getElementById(this.id).previousSibling.previousSibling.id] = true;

          itemTypeValues['caughtValues'] = caughtValues;
          data[itemType] = itemTypeValues;
          localStorage.setItem('data', JSON.stringify(data));

          // add is-donated class to the container for filtering purposes
          if (itemContainer.classList.contains('parts')) {
            itemContainer.classList.add('is-donated');
          } else if (checkFossilCompletion(itemContainer)) {
            itemContainer.classList.add('is-donated');
          }
        } else {
          // remove is-donated class from the container for filtering purposes
          itemContainer.classList.remove('is-donated')
        }

        // add donatedValues to itemTypeValues, add itemTypeValues to data, then set data in localStorage
        itemTypeValues['donatedValues'] = donatedValues;
        data[itemType] = itemTypeValues;
        localStorage.setItem('data', JSON.stringify(data));
      });
    }
  }
}

/**
 * Checks fossil collection container for complete donated set
 * @param fossilCollectionContainer Container of the fossil being checked
 * @returns boolean
 */
function checkFossilCompletion(fossilCollectionContainer) {
  const collectionDonatedCheckboxes = fossilCollectionContainer.querySelectorAll('.donated');
  for (var i=0; i < collectionDonatedCheckboxes.length; i++) {
    if (!collectionDonatedCheckboxes[i].checked) {
      return false;
    }
  }
  return true;
}

/**
 * Returns the appropriate container for either a fossil item or collection
 * @param fossilDonatedCheckbox HTML node of the checkbox for the fossil
 * @returns HTML element
 */
function getFossilContainer(fossilDonatedCheckbox) {
  // Check to see if checked item is part of a collection
  const threeParentsUp = fossilDonatedCheckbox.parentElement.parentElement.parentElement;
  const isInCollection = threeParentsUp.classList.contains('part');
  // Target container of overall collection/single item
  const fossilContainer = isInCollection ? threeParentsUp.parentElement.parentElement : threeParentsUp;

  return fossilContainer;
}

// FILTER FUNCTIONS //

/**
 * Filter the list of items based on the search input value
 */
function search() {
  // Loop through all containers, and if the title doesn't include the search query, set display to none
  var query = document.getElementsByClassName("filters__search")[0].value;
  var filter = query.toUpperCase();
  
  for (i = 0; i < containers.length; i++) {
    var name = containers[i].getElementsByTagName("h2")[0].innerText;
    if (name.toUpperCase().indexOf(filter) > -1) {
      containers[i].style.display = "flex";
    } else {
      containers[i].style.display = "none";
    }
  }
}

/**
 * Run a filter function depending on the dropdown selection
 * @param  {Event} e The triggering element
 */
function handleFilterChange(e) {
  // Allows select element to be passed in js without mocking event object
  var selectElement = e.target || e;
  var filterType = selectElement.value;
  
  // Reset display of each container first
  filterAll();

  switch (filterType) {
    case "all":
      // this is done above, before all filters are ran
      break;
    case "now":
      filterNow();
      break;
    case "month":
      filterMonth();
      break;
    case "leaving":
      filterLeaving();
      break;
    case "new":
      filterNew();
      break;
  }
}

/**
 * Show all of the items by removing the is-filtered class from all item containers
 */
function filterAll() {
  const filteredContainers = document.querySelectorAll('.is-filtered');
  for (i = 0; i < filteredContainers.length; i++) {
    filteredContainers[i].classList.remove('is-filtered');
  }
}

/**
 * Show items which are available in the current month AND hour, and hide the others
 */
function filterNow() {
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
      containers[i].classList.add('is-filtered');
    }
  }
}

/**
 * Show items which are available in the current month, and hide the others
 * @param  {HTMLCollection} containers A HTMLCollection containing all of the item containers
 */
function filterMonth() {
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
      containers[i].classList.add('is-filtered');
    }
  }
}

/**
 * Show items which are available in the current month AND NOT available in the next month
 */
function filterLeaving() {
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

    if (!(currentMonthDiv.classList.contains("available") && !nextMonthDiv.classList.contains("available"))) {
      containers[i].classList.add('is-filtered');
    }
  }
}

/**
 * Show items which are available in the current month AND NOT available in the last month
 */
function filterNew() {
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

    if (!(currentMonthDiv.classList.contains("available") && !lastMonthDiv.classList.contains("available"))) {
      containers[i].classList.add('is-filtered');
    }
  }
}

/**
 * Toggle (hide/show) the donated items ONLY if the ALL filter is selected and the searchbox is empty
 */
function toggleDonated() {
  // Change the donatedHidden variable and set the text of the button
  donatedHidden == 'false' ? donatedHidden = 'true' : donatedHidden = 'false';
  donatedHidden == 'false' ? toggleDonatedButton.innerText = "Hide Donated" : toggleDonatedButton.innerText = "Show Donated";

  // Save the donatedHidden selection to localStorage
  localStorage.setItem('donatedHidden', donatedHidden);

  if (donatedHidden == 'true') {
    document.querySelector('.main-container').classList.add('hide-donated');
  } else {
    document.querySelector('.main-container').classList.remove('hide-donated');
  }
}

/**
 * Switch the global hemisphere setting
 */
function switchHem() {
  // Change the hemisphere variable and set the text of the button
  hemisphere = hemisphere == "Southern" ? "Northern" : "Southern";
  hemButton.innerText = hemisphere;

  // Save the hemisphere selection to localStorage
  localStorage.setItem('hemisphere', hemisphere);

  // Go through the calendar month divs and remove the "available" classes
  for (var i = 0; i < containers.length; i++) {
    var calendarDiv = containers[i].children[2].children[0];
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

  // Perform filtering again with the new hemisphere based on current selection
  const filterSelect = document.getElementById('filters');
  handleFilterChange(filterSelect);
}

// INITIALISE THE PAGE DISPLAY OF ITEMS //

initItems();