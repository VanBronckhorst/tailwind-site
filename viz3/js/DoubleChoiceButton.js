/**
 * Created by Filippo on 21/11/15.
 */

function DoubleChoiceButton(where,c1,c2) {
    var that = this;
    this.container = d3.select(where);
    this.button = this.container.append("div").attr("class","double-button-div");
    var h = this.button.style("height");

    this.onFirstClick = function() {

        that.switchSelected(1);
        that.onClick_(1);
    }
    this.onSecondClick = function() {

        that.switchSelected(2);
        that.onClick_(2);
    }

    this.first = this.button.append("div").attr("class","double-button-inside-left-div")
                            .style("line-height",h).text(c1).on("click",this.onFirstClick);
    this.second = this.button.append("div").attr("class","double-button-inside-right-div")
                            .style("line-height",h).text(c2).on("click",this.onSecondClick);
    this.onClick_ = function () {

    }


    this.onFirstClick();
}

DoubleChoiceButton.prototype.onClick = function(fun) {
    this.onClick_ = fun;
}

DoubleChoiceButton.prototype.switchSelected = function(i) {
    if (i==1) {
        this.second.classed("double-button-selected",false);
        this.first.classed("double-button-selected",true);
    } else {
        this.second.classed("double-button-selected",true);
        this.first.classed("double-button-selected",false);
    }
}