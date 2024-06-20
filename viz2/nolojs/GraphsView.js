var DEBUG = true;

function log(something) {
  if(DEBUG){
    console.log(something);
  }
}

//TILES CREATION
var GraphsView = function () {
  'use-strict';

  var graphsBoxWidth = 800;
  var graphsBoxHeight = 600;

  var panelWidth = 800;
  var panelHeight = 600;

  var graphsViewLayout = this;

  var panelOpened = 2;

  var activeArea = 'Atlantic';
  var activeGranularity = 'day';

  // Datasets
  var allDataset = hurricanes;
  //console.log(hurricanes);
  var visualizedDataset = hurricanes; //linkare modello
  var selectedDataset = hurricanes; //linkare modello

  //GRAB THE MAP
  var map = d3.select('#map');

  //var graphsViewDiv = map.append('div')
  //.attr('id','graphsView');

  var graphsDiv = map.append('div').attr('class', 'graphsView graphs container');

  var buttonsDiv = map.append('div').attr('class', 'graphsView buttons container');

  //code to close and open the panel
  var toggle = [true, true];

  // ALL GRAPHS
  var allDiv = graphsDiv
  .append("div")
  .attr('class', 'panel ' + 0);

  var allTitle = allDiv.append('svg')
  .attr('class', 'panelTitle')
  .style('width', '100%')
  .style('height', '7%')
  .attr('viewBox', '0 0 ' + 100 + ' ' + 100)
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('font-family', 'Arial')
  .attr('font-size', 60)
  .attr('x', '50%')
  .attr('y', '60%')
  .text('Overall');


  var allAtlanticHurricanes = AtlanticGenerator(allDataset);
  var allPacificHurricanes = PacificGenerator(allDataset);

  var allHPDdiv = allDiv.append('div').style('width', '100%').style('height', '31%').attr('class','graph day all number');
  var allMWDdiv = allDiv.append('div').style('width', '100%').style('height', '31%').attr('class','graph day all maxwind');
  var allMPDdiv = allDiv.append('div').style('width', '100%').style('height', '31%').attr('class','graph day all minpress');

  var allHPMdiv = allDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph month all number');
  var allMWMdiv = allDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph month all maxwind');
  var allMPMdiv = allDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph month all minpress');

  var allHPYdiv = allDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph year all number');
  var allMWYdiv = allDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph year all maxwind');
  var allMPYdiv = allDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph year all minpress');

  // Day
  var allHPD = new HurrPerDayChart(DayStatsGenerator(allAtlanticHurricanes), allHPDdiv, 1, false);
  var allMWD = new MaxWindDayChart(DayStatsGenerator(allAtlanticHurricanes), allMWDdiv, 2, false);
  var allMPD = new MinPressureDayChart(DayStatsGenerator(allAtlanticHurricanes), allMPDdiv, 3, false);
  // Month
  var allHPM = new HurrPerMonthChart(MonthStatsGenerator(allAtlanticHurricanes), allHPMdiv, 1, false);
  var allMWM = new MaxWindMonthChart(MonthStatsGenerator(allAtlanticHurricanes), allMWMdiv, 2, false);
  var allMPM = new MinPressureMonthChart(MonthStatsGenerator(allAtlanticHurricanes), allMPMdiv, 3, false);
  // Year
  var allHPY = new HurrPerYearChart(YearStatsGenerator(allAtlanticHurricanes), allHPYdiv, 1, false);
  var allMWY = new MaxWindChart(YearStatsGenerator(allAtlanticHurricanes), allMWYdiv, 2, false);
  var allMPY = new MinPressureChart(YearStatsGenerator(allAtlanticHurricanes), allMPYdiv, 3, false);


  // VISUALIZED GRAPHS
  var visAtlanticHurricanes = AtlanticGenerator(visualizedDataset);
  var visPacificHurricanes = PacificGenerator(visualizedDataset);

  var visDiv = graphsDiv
  .append("div")
  .attr('class', 'panel ' + 1);

  var visTitle = visDiv.append('svg')
  .attr('class', 'panelTitle')
  .style('width', '100%')
  .style('height', '7%')
  .attr('viewBox', '0 0 ' + 100 + ' ' + 100)
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('font-family', 'Arial')
  .attr('font-size', 60)
  .attr('x', '50%')
  .attr('y', '60%')
  .text('Visualized');

  var visHPDdiv = visDiv.append('div').style('width', '100%').style('height', '31%').attr('class','graph day vis number');
  var visMWDdiv = visDiv.append('div').style('width', '100%').style('height', '31%').attr('class','graph day vis maxwind');
  var visMPDdiv = visDiv.append('div').style('width', '100%').style('height', '31%').attr('class','graph day vis minpress');

  var visHPMdiv = visDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph month vis number');
  var visMWMdiv = visDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph month vis maxwind');
  var visMPMdiv = visDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph month vis minpress');

  var visHPYdiv = visDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph year vis number');
  var visMWYdiv = visDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph year vis maxwind');
  var visMPYdiv = visDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph year vis minpress');

  // Day
  var visHPD = new HurrPerDayChart(DayStatsGenerator(visAtlanticHurricanes), visHPDdiv, 1, false);
  var visMWD = new MaxWindDayChart(DayStatsGenerator(visAtlanticHurricanes), visMWDdiv, 2, false);
  var visMPD = new MinPressureDayChart(DayStatsGenerator(visAtlanticHurricanes), visMPDdiv, 3, false);
  // Month
  var visHPM = new HurrPerMonthChart(MonthStatsGenerator(visAtlanticHurricanes), visHPMdiv, 1, false);
  var visMWM = new MaxWindMonthChart(MonthStatsGenerator(visAtlanticHurricanes), visMWMdiv, 2, false);
  var visMPM = new MinPressureMonthChart(MonthStatsGenerator(visAtlanticHurricanes), visMPMdiv, 3, false);
  // Year
  var visHPY = new HurrPerYearChart(YearStatsGenerator(visAtlanticHurricanes), visHPYdiv, 1, false);
  var visMWY = new MaxWindChart(YearStatsGenerator(visAtlanticHurricanes), visMWYdiv, 2, false);
  var visMPY = new MinPressureChart(YearStatsGenerator(visAtlanticHurricanes), visMPYdiv, 3, false);


  /*
  // SELECTED GRAPHS
  var selAtlanticHurricanes = AtlanticGenerator(selectedDataset);
  var selPacificHurricanes = PacificGenerator(selectedDataset);

  var selDiv = graphsDiv
  .append("div")
  .attr('class', 'panel ' + 2);

  // Day
  var selHPDdiv = selDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph day sel number');
  var selMWDdiv = selDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph day sel maxwind');
  var selMPDdiv = selDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph day sel minpress');
  // Month
  var selHPMdiv = selDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph month sel number');
  var selMWMdiv = selDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph month sel maxwind');
  var selMPMdiv = selDiv.append('div').style('width', '0%').style('height', '0%').attr('class','graph month sel minpress');
  // Year
  var selHPYdiv = selDiv.append('div').style('width', '100%').style('height', '31%').attr('class','graph year sel number');
  var selMWYdiv = selDiv.append('div').style('width', '100%').style('height', '31%').attr('class','graph year sel maxwind');
  var selMPYdiv = selDiv.append('div').style('width', '100%').style('height', '31%').attr('class','graph year sel minpress');

   // Day
   var selHPD = new HurrPerDayChart(DayStatsGenerator(selectedDataset), selHPDdiv, 1, false);
   var selMWD = new MaxWindDayChart(DayStatsGenerator(selectedDataset), selMWDdiv, 2, false);
   var selMPD = new MinPressureDayChart(DayStatsGenerator(selectedDataset), selMPDdiv, 3, false);
  // Month
  var selHPM = new HurrPerMonthChart(MonthStatsGenerator(selectedDataset), selHPMdiv, 1, false);
  var selMWM = new MaxWindMonthChart(MonthStatsGenerator(selectedDataset), selMWMdiv, 2, false);
  var selMPM = new MinPressureMonthChart(MonthStatsGenerator(selectedDataset), selMPMdiv, 3, false);
  // Year
  var selHPY = new HurrPerYearChart(YearStatsGenerator(selectedDataset), selHPYdiv, 1, false);
  var selMWY = new MaxWindChart(YearStatsGenerator(selectedDataset), selMWYdiv, 2, false);
  var selMPY = new MinPressureChart(YearStatsGenerator(selectedDataset), selMPYdiv, 3, false);
  */

  //###BUTTON CONTROLS###

  //
  var areaControls = buttonsDiv.append('div').attr('class', 'area controls');

  var atlanticButton = areaControls.append('div')
  .attr('class', 'button Atlantic')
  .append('svg')
  .style('width', '100%')
  .style('height', '100%')
  .attr('viewBox', '0 0 ' + 100 + ' ' + 100)
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .on('click', function () {
    console.log('inAtl');
    if(activeArea!='Atlantic') {
      activeArea = updateGraphsArea('Atlantic');
    }
  })
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('font-family', 'Arial')
  .attr('font-size', 30)
  .attr('x', '50%')
  .attr('y', '50%')
  .text('ATL');

  var pacificButton = areaControls.append('div')
  .attr('class', 'button Pacific')
  .append('svg')
  .style('width', '100%')
  .style('height', '100%')
  .attr('viewBox', '0 0 ' + 100 + ' ' + 100)
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .on('click', function () {
    console.log('inPac');
    if(activeArea!='Pacific') {
      activeArea = updateGraphsArea('Pacific');
    }
  })
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('font-family', 'Arial')
  .attr('font-size', 30)
  .attr('x', '50%')
  .attr('y', '50%')
  .text('PAC');

  //
  var activationControls = buttonsDiv.append('div').attr('class', 'activation controls');

  /*var selectedButton = activationControls.append('svg').attr('class', 'button selected')
  .on('click', function () {
    panelOpened = resizePanels(2, panelOpened);
    resizeGraphsView(panelOpened);
  });*/
var visualizedButton = activationControls.append('div')
.attr('class', 'button visualized 1')
.append('svg')
.style('width', '100%')
.style('height', '100%')
.attr('viewBox', '0 0 ' + 100 + ' ' + 100)
.attr('preserveAspectRatio', 'xMidYMid meet')
.on('click', function () {
  if(activeGranularity!='year') {
    panelOpened = resizePanels(1, panelOpened);
    resizeGraphsView(panelOpened);
  }
})
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'Arial')
.attr('font-size', 30)
.attr('x', '50%')
.attr('y', '50%')
.text('VISUALIZED');

var allButton = activationControls.append('div')
.attr('class', 'button all 0')
.append('svg')
.style('width', '100%')
.style('height', '100%')
.attr('viewBox', '0 0 ' + 100 + ' ' + 100)
.attr('preserveAspectRatio', 'xMidYMid meet')
.on('click', function () {
  panelOpened = resizePanels(0, panelOpened);
  resizeGraphsView(panelOpened);
})
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'Arial')
.attr('font-size', 30)
.attr('x', '50%')
.attr('y', '50%')
.text('OVERALL');


  //
  var granularityControls = buttonsDiv.append('div').attr('class', 'granularity controls');

  var dayButton = granularityControls
  .append('div')
  .attr('class', 'button day')
  .append('svg')
  .style('width', '100%')
  .style('height', '100%')
  .attr('viewBox', '0 0 ' + 100 + ' ' + 100)
  .on('click', function () {
    activeGranularity = changeGranularity('day');
  })
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('font-family', 'Arial')
  .attr('font-size', 30)
  .attr('x', '50%')
  .attr('y', '50%')
  .text('DAY');

  var monthButton = granularityControls
  .append('div')
  .attr('class', 'button month')
  .append('svg')
  .style('width', '100%')
  .style('height', '100%')
  .attr('viewBox', '0 0 ' + 100 + ' ' + 100)
  .on('click', function () {
    activeGranularity = changeGranularity('month');
  })
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('font-family', 'Arial')
  .attr('font-size', 30)
  .attr('x', '50%')
  .attr('y', '50%')
  .text('MONTH');

  var yearButton = granularityControls
  .append('div')
  .attr('class', 'button year')
  .append('svg')
  .style('width', '100%')
  .style('height', '100%')
  .attr('viewBox', '0 0 ' + 100 + ' ' + 100)
  .on('click', function () {
    activeGranularity = changeGranularity('year');
    if(!toggle[0]) {
      panelOpened = resizePanels(0, panelOpened);
      resizeGraphsView(panelOpened);
    }
    if(toggle[1]) {
      panelOpened = resizePanels(1, panelOpened);
      resizeGraphsView(panelOpened);
    }
  })
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('font-family', 'Arial')
  .attr('font-size', 30)
  .attr('x', '50%')
  .attr('y', '50%')
  .text('YEAR');

  // Color start active buttons
  areaControls.select('.button.' + activeArea)
  .style('background-color', 'green');

  granularityControls.select('.button.' + activeGranularity)
  .style('background-color', 'green');

  activationControls.selectAll('.button')
  .style('background-color', 'green');


  //###FUNCTIONS###

  // Function that change the dimension of panels following a toggle logic
  function resizeGraphsView(numberOfPanels) {
    var widthVal;
    switch(numberOfPanels) {
      case 0: {
        widthVal = 0;
        break;
      }
      case 1: {
        widthVal = 25;
        break;
      }
      case 2: {
        widthVal = 50;
        break;
      }
      case 3: {
        widthVal = 50;
        break;
      }
    }
    $('.graphsView.graphs.container').animate({'width' : widthVal+'%'}, {
      //duration:750,
    });
  }

  function resizePanels(panelId, numberOfPanels) {
    //console.log(numberOfPanels);
    if(toggle[panelId]) {
      numberOfPanels--;
    } else {
      numberOfPanels++;
    }
    //console.log(numberOfPanels);

    toggle[panelId] = !toggle[panelId];

    var widthVal;

    switch(numberOfPanels) {
      case 0: {
        widthVal = 100;
        break;
      }
      case 1: {
        widthVal = 100;
        break;
      }
      case 2: {
        widthVal = 50;
        break;
      }
      case 3: {
        widthVal = 33.333;
        break;
      }
    }

    for(p = 0; p < toggle.length; p++) {
      var panelName;
      if(p == 0) {
        panelName = 'all';
      } else {
        panelName = 'visualized';
      }
      if(toggle[p]) {
        $('.panel.' + p).animate({'width' : widthVal+'%'}
      //,duration:750}
      );
        activationControls.select('.button.' + panelName)
        .style('background-color', 'green');
      } else {
        $('.panel.' + p).animate({'width' : 0+'%'});
        activationControls.select('.button.' + panelName)
        .style('background-color', 'gray');
      }

    }
    return numberOfPanels;
  }

  function changeGranularity(granularity) {
    var type =['day','month','year'];
    for (var i = 0; i < type.length; i++) {
      if(type[i] != granularity) {
        $('.graph.' + type[i]).animate({'width' : '0%', 'height' : '0%'});
        granularityControls.select('.button.' + type[i])
        .style('background-color', 'gray');
      } else {
        $('.graph.' + type[i]).animate({'width' : '100%', 'height' : '31%'});
        granularityControls.select('.button.' + type[i])
        .style('background-color', 'green');
      }
    }
    return granularity;
  }


  // Change the graphs where dataset is changed
  function updateGraphsArea(area) {
    var temp1;
    var temp2;
    if(area == 'Atlantic') {
      areaControls.select('.button.Atlantic')
      .style('background-color', 'green');
      areaControls.select('.button.Pacific')
      .style('background-color', 'gray');
      // Day
      temp1 = DayStatsGenerator(allAtlanticHurricanes);
      temp2 = DayStatsGenerator(visAtlanticHurricanes);
      allHPD.updateGraph(temp1);
      allMWD.updateGraph(temp1);
      allMPD.updateGraph(temp1);
      visHPD.updateGraph(temp2);
      visMWD.updateGraph(temp2);
      visMPD.updateGraph(temp2);
      // Month
      temp1 = MonthStatsGenerator(allAtlanticHurricanes);
      temp2 = MonthStatsGenerator(visAtlanticHurricanes);
      allHPM.updateGraph(temp1);
      allMWM.updateGraph(temp1);
      allMPM.updateGraph(temp1);
      visHPM.updateGraph(temp2);
      visMWM.updateGraph(temp2);
      visMPM.updateGraph(temp2);
      // Year
      temp1 = YearStatsGenerator(allAtlanticHurricanes);
      temp2 = YearStatsGenerator(visAtlanticHurricanes);
      allHPY.updateGraph(temp1);
      allMWY.updateGraph(temp1);
      allMPY.updateGraph(temp1);
      visHPY.updateGraph(temp2);
      visMWY.updateGraph(temp2);
      visMPY.updateGraph(temp2);
    } else {
      areaControls.select('.button.Atlantic')
      .style('background-color', 'gray');
      areaControls.select('.button.Pacific')
      .style('background-color', 'green');
      // Day
      temp1 = DayStatsGenerator(allPacificHurricanes);
      temp2 = DayStatsGenerator(visPacificHurricanes);
      allHPD.updateGraph(temp1);
      allMWD.updateGraph(temp1);
      allMPD.updateGraph(temp1);
      visHPD.updateGraph(temp2);
      visMWD.updateGraph(temp2);
      visMPD.updateGraph(temp2);
      // Month
      temp1 = MonthStatsGenerator(allPacificHurricanes);
      temp2 = MonthStatsGenerator(visPacificHurricanes);
      allHPM.updateGraph(temp1);
      allMWM.updateGraph(temp1);
      allMPM.updateGraph(temp1);
      visHPM.updateGraph(temp2);
      visMWM.updateGraph(temp2);
      visMPM.updateGraph(temp2);
      // Year
      temp1 = YearStatsGenerator(allPacificHurricanes);
      temp2 = YearStatsGenerator(visPacificHurricanes);
      allHPY.updateGraph(temp1);
      allMWY.updateGraph(temp1);
      allMPY.updateGraph(temp1);
      visHPY.updateGraph(temp2);
      visMWY.updateGraph(temp2);
      visMPY.updateGraph(temp2);
    }
    return area;
  }

  function updateVisGraphs() {
    console.log('innnVis');
    var tempVis;
    // IN BASE A AREA ATTIVA IF-ELSE
    if(activeArea == 'Atlantic') {
    // Day
    tempVis = DayStatsGenerator(visAtlanticHurricanes);
    visHPD.updateGraph(tempVis);
    visMWD.updateGraph(tempVis);
    visMPD.updateGraph(tempVis);
    // Month
    tempVis = MonthStatsGenerator(visAtlanticHurricanes);
    visHPM.updateGraph(tempVis);
    visMWM.updateGraph(tempVis);
    visMPM.updateGraph(tempVis);
    // Year;
    tempVis = YearStatsGenerator(visAtlanticHurricanes);
    visHPY.updateGraph(tempVis);
    visMWY.updateGraph(tempVis);
    visMPY.updateGraph(tempVis);
  } else {
     // Day
     tempVis = DayStatsGenerator(visPacificHurricanes);
     visHPD.updateGraph(tempVis);
     visMWD.updateGraph(tempVis);
     visMPD.updateGraph(tempVis);
     // Month
     tempVis = MonthStatsGenerator(visPacificHurricanes);
     visHPM.updateGraph(tempVis);
     visMWM.updateGraph(tempVis);
     visMPM.updateGraph(tempVis);
     // Year
     tempVis = YearStatsGenerator(visPacificHurricanes);
     visHPY.updateGraph(tempVis);
     visMWY.updateGraph(tempVis);
     visMPY.updateGraph(tempVis);
   }
 }

 function updateSelGraphs() {
  console.log(selectedDataset);
  console.log('innnSel');
  var tempSel;
    // Day
    tempSel = DayStatsGenerator(selectedDataset);
    selHPD.updateGraph(tempSel);
    selMWD.updateGraph(tempSel);
    selMPD.updateGraph(tempSel);
    // Month
    tempSel = MonthStatsGenerator(selectedDataset);
    selHPM.updateGraph(tempSel);
    selMWM.updateGraph(tempSel);
    selMPM.updateGraph(tempSel);
    // Year;
    tempSel = YearStatsGenerator(selectedDataset);
    selHPY.updateGraph(tempSel);
    selMWY.updateGraph(tempSel);
    selMPY.updateGraph(tempSel);
  }

  // Function to update Datasets when model is updated
  this.modelUpdated = function(visData) {
    //change data
    console.log(visData);
    visualizedDataset = {"hurricanes" : visData};
    visAtlanticHurricanes = AtlanticGenerator(visualizedDataset);
    visPacificHurricanes = PacificGenerator(visualizedDataset);
    updateVisGraphs();
  };

   // Function to update Datasets when model is updated
   this.hurricaneSelected = function(selData) {
    //change data
    console.log(selData);
    selectedDataset = {"hurricanes" : [selData]};
    console.log(selectedDataset);
    //selAtlanticHurricanes = AtlanticGenerator(selectedDataset);
    //selPacificHurricanes = PacificGenerator(selectedDataset);
    updateSelGraphs();
  };

};

GraphsView();

