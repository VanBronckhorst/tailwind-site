
function pickerResize(){
var ratio = 290/25;
var ratio2 = 196/147
var globH = parseInt(d3.select("body").style("height"));
var globW = parseInt(d3.select("body").style("width"));
var percW = 0.1;

var relativeH = 0.65;
var relativeW = 0.01;

var w = globW * percW;
var h= w/ratio
var border=10
var fontOrig = 12
var increment = w/290;
var newFont = parseInt(fontOrig * increment*1.5)
var wSpace=10;

log(w, globW)


d3.selectAll("#widgetField").style("width",w).style("height",h).style("font-size", newFont).style("line-height",h+"px")
d3.selectAll("#widgetCalendar").style("width",w).style("font-size", newFont).style("top",h)
d3.selectAll(".datePicker").style("width",w).style("height",w/ratio2).style("font-size", newFont)
d3.selectAll(".datepickerSpace").style("width",wSpace)
d3.selectAll(".datePickerContainer").style("width",w-2*border).style("height",w/ratio2-2*border).style("font-size", newFont)
d3.selectAll("td").style("font-size", newFont)
d3.selectAll('td').selectAll('a').selectAll('span').style('font-size', newFont)

d3.selectAll("th").style("font-size", newFont*1.1)
}

