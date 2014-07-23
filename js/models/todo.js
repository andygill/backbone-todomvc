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
			due:    '',					    // The date the task needs done by
			completed: false
		},

		// Toggle the `completed` state of this todo item.
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		},

	  // Move to a specific time, or bump by a specific number of days.
		// A currently empty date is taken as today.
		bump: function (t) {
			if (_.isNumber(t)) {
				this.set('do_on',new app.Date(this.get("do_on")).bumpDate(t).toString());
			} else {
					alert('bad bump')
			}
	    this.collection.sort()
		}
	});
})();
