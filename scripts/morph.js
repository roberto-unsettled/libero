"use strict";

/* global d3, document */
var playButton = {
    el: document.querySelector(".js-button"),

    iconEls: {
        playing: document.querySelector("#pause-icon"),
        paused:  document.querySelector("#play-icon")
    },

    nextState: {
        playing: "paused",
        paused:  "playing"
    },

    animationDuration: 350,

    init: function () {
        this.setInitialState();
        this.replaceUseEl();
        this.el.addEventListener("click", this.toggle.bind(this));
    },

    setInitialState: function () {
      var initialIconRef = this.el.querySelector("use").getAttribute("xlink:href");
      this.state = this.el.querySelector(initialIconRef).getAttribute("data-state");
    },

    replaceUseEl: function () {
        d3.select(this.el.querySelector("use")).remove();
        d3.select(this.el.querySelector("svg")).append("path")
            .attr("class", "js-icon")
            .attr("d", this.stateIconPath());
    },

    toggle: function () {
        this.goToNextState();

        d3.select(this.el.querySelector(".js-icon")).transition()
            .duration(this.animationDuration)
            .attr("d", this.stateIconPath());
    },

    goToNextState: function () {
        this.state = this.nextState[this.state];
    },

    stateIconPath: function () {
        return this.iconEls[this.state].getAttribute("d");
    }
};

playButton.init();