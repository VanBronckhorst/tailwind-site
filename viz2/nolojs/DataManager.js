// Data Manager script contains the function to extract some statistics from a given dataset

function AtlanticGenerator (dataset) {
  var mainDataset = dataset;
  var atlanticDataset = {"hurricanes" : []};

  for(i = 0; i < mainDataset.hurricanes.length; i++) {
    if(mainDataset.hurricanes[i].ocean == "A") {
      atlanticDataset.hurricanes.push(mainDataset.hurricanes[i]);
    }
  }

  return atlanticDataset;
}

//console.log("Atlantic Dataset: ");
//console.log(AtlanticGenerator(hurricanes));

function PacificGenerator (dataset) {
  var mainDataset = dataset;
  var pacificDataset = {"hurricanes" : []};

  for(i = 0; i < mainDataset.hurricanes.length; i++) {
    if(mainDataset.hurricanes[i].ocean == "P") {
      pacificDataset.hurricanes.push(mainDataset.hurricanes[i]);
    }
  }

  return pacificDataset;
}

function YearStatsGenerator(dataset) {
  var mainDataset = dataset;
  //console.log(mainDataset);


  //###Generates yearStats Dataset from mainDataset, includes maxWindSpeed and minPressure per Year###
  var yearStats = [];
  var hurrIndex = 0; //remember that variables lives inside the  function
  var numberOfHurricanes = 0;
  var changed = false;
  var maxWindSpeed = 0;
  var minPressure = 999999;
  var year;

  //console.log(mainDataset.hurricanes.length);

  while (hurrIndex < mainDataset.hurricanes.length) {
    year = mainDataset.hurricanes[hurrIndex].points[0].date.substring(0, 4);

    numberOfHurricanes++;
    for(pointIndex = 0; pointIndex < mainDataset.hurricanes[hurrIndex].points.length; pointIndex++) {
      //magari controllare che pressione prima di iffare
      if(mainDataset.hurricanes[hurrIndex].points[pointIndex].maxSpeed > maxWindSpeed) {
        maxWindSpeed = mainDataset.hurricanes[hurrIndex].points[pointIndex].maxSpeed;
      }
      if(mainDataset.hurricanes[hurrIndex].points[pointIndex].pressure < minPressure) {
        //console.log('in in year:' + year);
        minPressure = mainDataset.hurricanes[hurrIndex].points[pointIndex].pressure;
      }
    }

    hurrIndex++;
    if(hurrIndex < mainDataset.hurricanes.length) {
      //console.log(year);
      //console.log(mainDataset.hurricanes[hurrIndex].points[0].date.substring(0, 4));
      if(year != mainDataset.hurricanes[hurrIndex].points[0].date.substring(0, 4)) {
        changed = true;
      }
    }

    if(changed || (hurrIndex >= mainDataset.hurricanes.length)) {
      if(maxWindSpeed!=0 && minPressure != 999999) {
        json = '{' +'"YEAR" : "' + mainDataset.hurricanes[hurrIndex-1].points[0].date.substring(0, 4) + '",'
        + '"MAX_WIND_SPEED" : "' + maxWindSpeed + '",'
        + '"MIN_PRESSURE" : "' + minPressure + '",'
        + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes + '"}';
      } else if(maxWindSpeed!=0) {
        json = '{' +'"YEAR" : "' + mainDataset.hurricanes[hurrIndex-1].points[0].date.substring(0, 4) + '",'
        + '"MAX_WIND_SPEED" : "' + maxWindSpeed + '",'
        + '"MIN_PRESSURE" : "NA",'
        + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes + '"}';
      } else if(minPressure!=999999) {
        json = '{' +'"YEAR" : "' + mainDataset.hurricanes[hurrIndex-1].points[0].date.substring(0, 4) + '",'
        + '"MAX_WIND_SPEED" : "NA",'
        + '"MIN_PRESSURE" : "' + minPressure + '",'
        + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes + '"}';
      } else {
        json = '{' +'"YEAR" : "' + mainDataset.hurricanes[hurrIndex-1].points[0].date.substring(0, 4) + '",'
        + '"MAX_WIND_SPEED" : "NA",'
        + '"MIN_PRESSURE" : "NA",'
        + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes + '"}';
      }

      //console.log(json);
      yearStats.push(JSON.parse(json));
      numberOfHurricanes = 0;
      changed = false;
      maxWindSpeed = 0;
      minPressure = 999999;
    }

  }

  //console.log(yearStats);
  //####################################################

  return yearStats;
}

/*function MonthGrouper(dataset) {
  var mainDataset = dataset;
  var monthDataset = [];

  var hurrIndex = 0; //remember that variables lives inside the  function


  return monthDataset;
}*/

function MonthStatsGenerator(dataset) {
  var mainDataset = dataset;
  //console.log(mainDataset);

  //###Generates monthStats Dataset from mainDataset, includes maxWindSpeed and minPressure per Month###
  var monthStats = [];
  var hurrIndex = 0; //remember that variables lives inside the  function
  var changed = false;
  var numberOfHurricanes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var maxWindSpeed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var minPressure = [999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999];
  var month;
  var json;

  //console.log(mainDataset.hurricanes.length);

  while (hurrIndex < mainDataset.hurricanes.length) {
    //monthProva = mainDataset.hurricanes[hurrIndex].points[0].date.substring(4, 6);
    monthIndex = parseInt(mainDataset.hurricanes[hurrIndex].points[0].date.substring(4, 6)) - 1;
    //console.log(monthProva);
    //console.log(monthIndex);

    numberOfHurricanes[monthIndex]++;

    for(pointIndex = 0; pointIndex < mainDataset.hurricanes[hurrIndex].points.length; pointIndex++) {
      //magari controllare che pressione prima di iffare
      if(mainDataset.hurricanes[hurrIndex].points[pointIndex].maxSpeed > maxWindSpeed[monthIndex]) {
        maxWindSpeed[monthIndex] = mainDataset.hurricanes[hurrIndex].points[pointIndex].maxSpeed;
      }
      if(mainDataset.hurricanes[hurrIndex].points[pointIndex].pressure < minPressure[monthIndex]) {
        //console.log('in in year:' + year);
        minPressure[monthIndex] = mainDataset.hurricanes[hurrIndex].points[pointIndex].pressure;
      }
    }

    hurrIndex++;
  }

  for (var monthI = 0; monthI < numberOfHurricanes.length; monthI++) {
    if(maxWindSpeed[monthI] != 0 && minPressure[monthI] != 999999) {
      json = '{' +'"MONTH" : "' + monthToString(monthI+1) + '",'
      + '"MAX_WIND_SPEED" : "' + maxWindSpeed[monthI] + '",'
      + '"MIN_PRESSURE" : "' + minPressure[monthI] + '",'
      + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes[monthI] + '"}';
    } else if (maxWindSpeed[monthI] != 0) {
      json = '{' +'"MONTH" : "' + monthToString(monthI+1) + '",'
      + '"MAX_WIND_SPEED" : "' + maxWindSpeed[monthI] + '",'
      + '"MIN_PRESSURE" : "NA",'
      + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes[monthI] + '"}';
    } else if (minPressure[monthI] != 999999) {
      json = '{' +'"MONTH" : "' + monthToString(monthI+1) + '",'
      + '"MAX_WIND_SPEED" : "NA",'
      + '"MIN_PRESSURE" : "' + minPressure[monthI] + '",'
      + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes[monthI] + '"}';
    } else {
      json = '{' +'"MONTH" : "' + monthToString(monthI+1) + '",'
      + '"MAX_WIND_SPEED" : "NA",'
      + '"MIN_PRESSURE" : "NA",'
      + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes[monthI] + '"}';
    }

    monthStats.push(JSON.parse(json));
  }

  //console.log(monthStats);
  //####################################################

  //##Generates maxWindSpeed over Years Dataset##
  return monthStats;

}

function DayStatsGenerator(dataset) {
  var mainDataset = dataset;
  //console.log(mainDataset);

  //###Generates dayStats Dataset from mainDataset, includes maxWindSpeed and minPressure per Day###
  var dayStats = [];
  var hurrIndex = 0; //remember that variables lives inside the  function
  var changed = false;
  var numberOfHurricanes = [];
  var maxWindSpeed = [];
  var minPressure = [];
  var day;
  var json;

  // Set the initial vector values
  for(var iterator = 0; iterator <= 1250; iterator++) {
    numberOfHurricanes[iterator] = 0;
    maxWindSpeed[iterator] = 0;
    minPressure[iterator] = 999999;
  }

  while (hurrIndex < mainDataset.hurricanes.length) {
    //monthProva = mainDataset.hurricanes[hurrIndex].points[0].date.substring(4, 6);
    //dayIndex = parseInt(mainDataset.hurricanes[hurrIndex].points[0].date.substring(4, 8));
    //console.log(monthProva);
    //console.log(monthIndex);



    for(pointIndex = 0; pointIndex < mainDataset.hurricanes[hurrIndex].points.length; pointIndex++) {
      dayIndex = parseInt(mainDataset.hurricanes[hurrIndex].points[pointIndex].date.substring(4, 8));
      //magari controllare che pressione prima di iffare
      if(mainDataset.hurricanes[hurrIndex].points[pointIndex].maxSpeed > maxWindSpeed[dayIndex]) {
        maxWindSpeed[dayIndex] = mainDataset.hurricanes[hurrIndex].points[pointIndex].maxSpeed;
      }
      if(mainDataset.hurricanes[hurrIndex].points[pointIndex].pressure < minPressure[dayIndex]) {
        //console.log('in in year:' + year);
        minPressure[dayIndex] = mainDataset.hurricanes[hurrIndex].points[pointIndex].pressure;
      }
      numberOfHurricanes[dayIndex]++;
    }

    hurrIndex++;
  }

  for (var dayI = 0; dayI < numberOfHurricanes.length; dayI++) {
    if(dayExists(dayI)) {
      if(maxWindSpeed[dayI] != 0 && minPressure[dayI] != 999999) {
        json = '{' +'"DAY" : "' + dayToString(dayI) + '",'
        + '"MAX_WIND_SPEED" : "' + maxWindSpeed[dayI] + '",'
        + '"MIN_PRESSURE" : "' + minPressure[dayI] + '",'
        + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes[dayI] + '"}';
      } else if (maxWindSpeed[dayI] != 0) {
        json = '{' +'"DAY" : "' + dayToString(dayI) + '",'
        + '"MAX_WIND_SPEED" : "' + maxWindSpeed[dayI] + '",'
        + '"MIN_PRESSURE" : "NA",'
        + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes[dayI] + '"}';
      } else if (minPressure[dayI] != 999999) {
        json = '{' +'"DAY" : "' + dayToString(dayI) + '",'
        + '"MAX_WIND_SPEED" : "NA",'
        + '"MIN_PRESSURE" : "' + minPressure[dayI] + '",'
        + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes[dayI] + '"}';
      } else {
        json = '{' +'"DAY" : "' + dayToString(dayI) + '",'
        + '"MAX_WIND_SPEED" : "NA",'
        + '"MIN_PRESSURE" : "NA",'
        + '"NUMBER_OF_HURRICANES" : "' + numberOfHurricanes[dayI] + '"}';
      }


      dayStats.push(JSON.parse(json));
    }
  }

  //console.log('Day Stats: ');
  //console.log(dayStats);
  //####################################################

  //##Generates maxWindSpeed over Years Dataset##
  return dayStats;

}

function monthToString(month) {
  switch(month) {
    case 1:
    {
      return "January";
      break;
    }
    case 2:
    {
      return "February";
      break;
    }
    case 3:
    {
      return "March";
      break;
    }
    case 4:
    {
      return "April";
      break;
    }
    case 5:
    {
      return "May";
      break;
    }
    case 6:
    {
      return "June";
      break;
    }
    case 7:
    {
      return "July";
      break;
    }
    case 8:
    {
      return "August";
    }
    break;
    case 9:
    {
      return "September";
      break;
    }
    case 10:
    {
      return "October";
      break;
    }
    case 11:
    {
      return "November";
      break;
    }
    case 12:
    {
      return "December";
      break;
    }
  }
}

function dayToString (day) {
  var dayString = "" + day + "";
  while(dayString.length < 4) {
    dayString = "0" + dayString;
  }
  dayString = dayString.substring(0,2) + "/" + dayString.substring(2,4);
  return dayString;
}

function dayExists (day) {
  var dayStringTemp = "" + day + "";

  if(dayStringTemp.length < 3) {
    return false;
  }

  while(dayStringTemp.length < 4) {
    dayStringTemp = "0" + dayStringTemp;
  }

  var monthOnly = parseInt(dayStringTemp.substring(0, 2));
  var dayOnly = parseInt(dayStringTemp.substring(2, 4));

  if(dayOnly < 1) {
    return false;
  } else if(monthOnly < 1 || monthOnly > 12) {
    return false;
  } else if(monthOnly == 2 && dayOnly > 28) {
    return false;
  } else if ((monthOnly == 4 || monthOnly == 6 || monthOnly == 9 || monthOnly == 11) && dayOnly > 30) {
    return false;
  } else if ((monthOnly == 1 || monthOnly == 3 || monthOnly == 5 || monthOnly == 7 || monthOnly == 8 || monthOnly == 10 || monthOnly == 12) && dayOnly > 31) {
    return false;
  } else {
    return true;
  }
}

