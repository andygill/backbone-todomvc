/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	app.Todo = Backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			do_on:  '',			// The date the task will be undertaken
			do_by:  '',					    // The date the task needs done by
			completed: false
		},

	  urlRoot: '/todos',

		// Toggle the `completed` state of this todo item.
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		},

	  // bump by a day. A currently empty date always bumps to *today*.
		// Days in the past also *always* bump today.
		bump: function () {
			var date = new app.Date(this.get("do_on"));
			if (date.isEmpty() || date.isPast()) {
				this.do_on(new app.Date("today").toString());
			} else {
				this.do_on(date.bumpDate(1).toString());
			}
	    this.collection.sort()
		},

    do_on: function(date) {
			this.save('do_on',date)
	  }

	});
})();
