/**
 * Vehicle picker jQuery plugin for ABMS TireSites
 * Copyright 2013 ABMS (http://www.tireguru.net)
 * $Id$
 */

(function($){
	$.VehiclePicker = function(el, options) {
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var base = this;
		
		// Access to jQuery and DOM versions of element
		base.$el = $(el);
		base.el = el;
		
		// Add a reverse reference to the DOM object
		base.$el.data('VehiclePicker', base);
		
		base.init = function() {
			base.options = $.extend({}, $.VehiclePicker.defaultOptions, options);
			
			// ajax post URL
			base.url = '/search/ajax_vehicle/' + base.options.layout;
			
			// attach the value-changed handler to every <select> that is created in ajax responses
			base.$el.delegate('select', 'change', base.valueChanged);
			
			// load the form
			base.$el.load(base.url, {
					type: base.options.type,
					is_home_page: (base.options.home ? 1 : 0),
					hide_previous: (base.options.hidePrevious ? 1 : 0),
					preselect: base.options.preselect.join(',')
				},
				base.checkPackages
			);
		}; // end function base.init()
		
		base.checkPackages = function() {
			var package = base.$el.find('.vehicle-package').get(0);
			
			if ($(package).val() > 0)
			{
				// package selected
				// submit the search form
				if (base.options.home)
				{
					base.options.button.hide();
					$('#ymmt_hold').show();
				}
				else
				{
					base.options.button.show();
				}
				
				base.options.form.submit();
			}
			else if (package.options.length > 1)
			{
				// no package selected
				// package has options
				// search for the 'Standard' package and select it if it is found
				$(package).find('option').each(function(idx) {
					if ($(this).val() != 0)
					{
						if (this.text.substring(0, 8).toUpperCase() == 'STANDARD')
						{
							// auto-select the 'Standard' package
							package.selectedIndex = idx;
							base.valueChanged('vehicle-package');
							return false;
						}
					}
				});
			}
			else if (base.options.showButton)
			{
				base.options.button.show();
			}
			else if (!base.options.home)
			{
				base.options.button.hide();
			}
		}; // end function base.checkPackages
		
		/**
		 * <select> onchange handler
		 * Submits and updates the vehicle form when a value is changed
		 */
		base.valueChanged = function(/*string*/ force_name)
		{
			// submit the IDs and update the form
			var field_name = (force_name.length ? force_name : this.name);
			
			base.$el.load(base.url, {
					type: base.options.type,
					is_home_page: (base.options.home ? 1 : 0),
					hide_previous: (base.options.hidePrevious ? 1 : 0),
					field: field_name.split('-')[1],
					yearID: base.$el.find('.vehicle-year').val(),
					makeID: base.$el.find('.vehicle-make').val(),
					modelID: base.$el.find('.vehicle-model').val(),
					trimID: base.$el.find('.vehicle-trim').val(),
					packageID: base.$el.find('.vehicle-package').val()
				},
				base.checkPackages
			);
		}; // end function base.valueChanged()
		
		// initialize the vehicle search object
		base.init();
	}; // end function $.VehiclePicker()
	
	$.VehiclePicker.defaultOptions = {
		type: 'tires',
		layout: 'vertical',
		home: false,
		form: null,
		button: null,
		showButton: false,
		hidePrevious: false,
		preselect: []
	};
	
	$.fn.vehiclePicker = function(options) {
		return this.each(function() {
			(new $.VehiclePicker(this, options));
		});
	};
})(jQuery);

/* END OF FILE */
/* Location: /js/jquery.vehiclepicker.js */
