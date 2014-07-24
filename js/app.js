/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

$(function () {
	'use strict';

 // This usage of Date is immutable
	app.Date = function (date_string) {
		var m = null;

		if (date_string == "today") {
			m = moment().startOf('day');
		} else if (date_string == null || date_string == undefined || date_string == "") {
			// do nothing
	  } else {
			m = moment(date_string, "YYYY-MM-DD");
	  }

	  // update the constructor
		this.m = m;
		this.toString = function() {
			if (m == null) { return ""; }
		 	return m.format("YYYY-MM-DD");
		}
	  this.toHumanString = function () {
			if (m == null) { return ""; }
			var now = moment().startOf('day');
			var d = m.startOf('day').diff(now.startOf('day'),'days');

			var f = "ddd MMM Do";
			if (m.year() != now.year()) {
				f += ", YYYY";
			}

			switch (d) {
				case -1: return "Yesterday";
				case 0: return "Today";
				case 1: return "Tomorrow";
				default: return m.format(f);
			}
		}

	  this.clone = function() {
				return new app.Date(this.toString());
		}

	  // *returns* Date with the date bumped
	  this.bumpDate = function(inc) {
			var that = this.clone();
			if (m != null) {
				that.m.add('days',inc);
			}
			return that;
	  }

	  this.isEmpty = function() {
			return m == null;
		}

		this.isToday = function() {
			if (m == null) { return false; }
			return m.startOf('day').diff(moment().startOf('day'),'days') == 0;
		}

		this.isPast = function() {
			if (m == null) { return true; }
			return m.startOf('day').diff(moment().startOf('day'),'days') < 0;
		}

  }

	$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        options.url = 'http://localhost:3000' + options.url;
  });

	// kick things off by creating the `App`
	new app.AppView();


});
