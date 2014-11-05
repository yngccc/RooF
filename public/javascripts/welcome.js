$(function() {
    $("button#login").click(function() {
	var signup = $("div.pop-up-signup");
	var login = $("div.pop-up-login");
	if (signup.is(":visible")) {
	    signup.hide();
	    login.show();
	    $("input.auto-focus").focus();
	    return;
	}
	if (login.is(":visible")) {
	    login.hide();
	    return
	}
	login.show();
	$("input.auto-focus").focus();
    });
	
    $("button#signup").click(function() {
	var signup = $("div.pop-up-signup");
	var login = $("div.pop-up-login");
	if (login.is(":visible")) {
	    login.hide();
	    signup.show();
	    $("input.auto-focus").focus();
	    return;
	}
	if (signup.is(":visible")) {
	    signup.hide();
	    return
	}
	signup.show();
	$("input.auto-focus").focus();
    });

    $("#login-form").submit(function(e) {
	e.preventDefault();
	var credential = $("#login-form").serialize();
	$.ajax({
	    url : '/login',	    
	    type : 'POST',
	    data : credential,
	    dataType : 'json'
	}).done(function(res) {
	    if (res.redirect) 
		window.location.replace(document.URL + res.redirect); 
	    else 
		$("#login-form p.error").html(res.error);
	});
    });

    $("#signup-form").submit(function(e) {
	e.preventDefault();
	var form = $("#signup-form");
	var username = $("input[name='username']", form).val();
	var email = $("input[name='email']", form).val();
	var password = $("input[name='password']", form).val();
	var password_c = $("input[name='password-c']", form).val();

	$("p.error", form).html("");
	
	var basicAuth = true; 
	if (username === "") {
	    $("p.username", form).html("Username Required");
	    basicAuth = false;
	}
	if (email === "") {
	    $("p.email", form).html("Email Required");
	    basicAuth = false;
	} else {
	    if ( !(/.+@.+/.test(email)) ) {
		$("p.email", form).html("Invalid Email");
		basicAuth = false;
	    }
	}		
	if (password === '' && password_c === '') {
	    $("p.password", form).html("Password Required");
	    basicAuth = false;
	} else {
	    if (password !== password_c) {
		$("p.password", form).html("Passwords Don't Match");
		basicAuth = false;
	    }
	}

	if (basicAuth === false)
	    return;

	var credential = $("#signup-form").serialize();
	$.ajax({
	    url : '/signup',	    
	    type : 'POST',
	    data : credential,
	    dataType : 'json'
	}).done(function(res) {
	    if (res.redirect) {
		window.location.replace(document.URL + res.redirect); return; }
	    if (res.error) {
		$("p.database", form).html(res.error); return; }
	    if (res.errors) {
		for(var i=0; i < res.errors.length; i++) {
		    switch(res.errors[i]) {
		    case "Username Already Taken":
			$("p.username", form).html(res.errors[i]);
			break;
		    case "Email Already Taken":
			$("p.email", form).html(res.errors[i]);
			break;
		    }
		}
	    }
	});
    });

});



