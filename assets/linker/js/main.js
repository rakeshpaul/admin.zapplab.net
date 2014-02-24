$(document).ready(function() {
	if ($("#users")) {
		$('#users').dynatable();
	}
	if ($("#projects")) {
		$('#projects').dynatable();
	}
	$("[data-toggle=tooltip").tooltip();
});

// validate signup form on keyup and submit
$("#dW-login-form").validate({
	rules: {
		email: {
			required: true,
			email: true
		},
		password: {
			required: true,
			minlength: 5
		}
	},
	messages: {
		email: "Please enter a valid email address",
		password: {
			required: "Please provide a password",
			minlength: "Your password must be at least 5 characters long"
		}		
	}
});

// $(function() {
// 	$("table")
// 		.tablesorter({widthFixed: true})
// 		.tablesorterPager({container: $("#pager")});
// });