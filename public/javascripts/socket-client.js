$(function() {
    window.client = io.connect("http://localhost/chat1");
    client.on('news', function(data) {
	console.log(data);
    });
});