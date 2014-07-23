/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Our template for the smart targets
		timetableTemplate: _.template($('#timetable-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
//			'click #toggle-all': 'toggleAllComplete'
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-todo');
			this.$footer = this.$('#footer');
			this.$timetable = this.$('#timetable');
			this.$main = this.$('#main');
			this.$list = $('#todo-list');

			this.listenTo(app.todos, 'add', this.addOne);
			this.listenTo(app.todos, 'reset', this.addAll);
			this.listenTo(app.todos, 'change:completed', this.filterOne);
			this.listenTo(app.todos, 'filter', this.filterAll);
			this.listenTo(app.todos, 'all', this.render);


			// Suppresses 'add' events with {reset: true} and prevents the app view
			// from being re-rendered for every model. Only renders when the 'reset'
			// event is triggered at the end of the fetch.
			app.todos.fetch({reset: true});


		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			console.log('render')
			var completed = app.todos.completed().length;
			var remaining = app.todos.remaining().length;

			if (app.todos.length) {
				// We need to re-order the elements of the itemized list
				$('#todo-list li').sortElements(function(a, b){
					var a1 = $(a).attr("sort-by");
					var b1 = $(b).attr("sort-by");
					if (a1 == b1) {
						return parseInt($(a).attr("sort-by-2")) > parseInt($(b).attr("sort-by-2")) ? 1 : -1;
					}
				  return a1 > b1 ? 1 : -1;
				});

			  $(".new-day").removeClass("new-day");
			  var t = "";
				$('#todo-list li').each(function() {
					  var k = $(this).attr("sort-by");
						if (k != t && !$(this).hasClass("hidden")) {
							$(this).addClass("new-day");
							t = k;
						}
				})

				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));


				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.$timetable.html(this.timetableTemplate({
				today:    new app.Date("today").toString(),
				tomorrow: new app.Date("today").bumpDate(1).toString()
			}));

			// set up the dropable handle
			$('.droppable').droppable({
				drop: function (event, ui) {
					var date = $(event.target).attr("date");
					var parent = $(ui.draggable).trigger("droppable",date);
					console.log(event,ui)
				},
				hoverClass: "drop-hover"
			});

			this.allCheckbox.checked = !remaining;
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (todo) {
			var view = new app.TodoView({ model: todo });
			this.$list.prepend(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$list.html('');
			app.todos.each(this.addOne, this);
		},

		filterOne: function (todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			app.todos.each(this.filterOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.todos.nextOrder(),
				completed: false
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.todos.create(this.newAttributes());
				this.$input.val('');
			}
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(app.todos.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			app.todos.each(function (todo) {
				todo.save({
					completed: completed
				});
			});
		}
	});
})(jQuery);
