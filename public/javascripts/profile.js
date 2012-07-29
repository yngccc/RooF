$(function() {
    $("button#logout").click(function() {
	window.location.replace("http://localhost:3000/logout");
    });
    $("button#edit").click(function() {
	$.ajax({
	    url : '/settings/profile',
	    dataType : 'json'
	}).done(function (result) {
	    $("div.span10").text(result.userinfo);
	});
    });
});


$(function($) {
    window.Profile = Backbone.Model.extend({
	url : '/settings/profile'
	
    });

    window.Profile = Backbone.View.extend({
	model : Profile,
	template : _.template($("#profile").html())

    });
	



}(jQuery));		



 