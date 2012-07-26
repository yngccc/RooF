$(function() {
    $("button#log_in").toggle(
	function() {$("div.pop-up").show();},
	function() {$("div.pop-up").hide();}
    );


});