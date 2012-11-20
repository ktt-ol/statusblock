(function($) {
    $(document).ready(function () {
	var source = new EventSource('http://status.kreativitaet-trifft-technik.de/status-stream?ff=1&w=1&listeners=1');
	var lastkeepalive = +new Date();
	source.onopen = function() {
	    $('div.statusblock-Status').removeClass("statusblock-statusclosed");
	    $('div.statusblock-Status').removeClass("statusblock-statusinit");
	    $('div.statusblock-Status').removeClass("statusblock-statuserror");
	    $('div.statusblock-Status').addClass("open");
	    $('div.statusblock-Status').html("<p>Hochgefahren</p>");
	}
	/*	  source.onerror = function() {
	 $('div.statusblock-Status').removeClass("statusblock-statusclosed");
	 $('div.statusblock-Status').removeClass("statusblock-statusopen");
	 $('div.statusblock-Status').removeClass("statusblock-statusinit");
	 $('div.statusblock-Status').addClass("statusblock-statuserror");
	 $('div.statusblock-Status').html("<p>Crashed</p>");
	 } */
	source.addEventListener('status', function(e) {
	    var state = jQuery.parseJSON(e.data);
	    switch (state.open) {
	    case false:
                $('div.statusblock-Status').addClass("statusblock-statusclosed");
		$('div.statusblock-Status').removeClass("statusblock-statusopen");
		$('div.statusblock-Status').removeClass("statusblock-statusinit");
		$('div.statusblock-Status').removeClass("statusblock-statuserror");
                $('div.statusblock-Status').html("<p>Runtergefahren</p>");
		break;
	    case true:
		$('div.statusblock-Status').addClass("statusblock-statusopen");
		$('div.statusblock-Status').removeClass("statusblock-statusinit");
		$('div.statusblock-Status').removeClass("statusblock-statuserror");
		$('div.statusblock-Status').removeClass("statusblock-statusclosed");
		$('div.statusblock-Status').html("<p>Hochgefahren</p>");
 		break;
	    }
	}, false);
	
	source.addEventListener('keepalive', function(e) {
	    lastkeepalive = +new Date();
	}, false);
	// check whether we have seen a keepalive event within the last 70 minutes or are disconnected; reconnect if necessary
	var checkinterval =
		setInterval(function() {
		    if ((new Date() - lastkeepalive > 65 * 60 * 1000) || source.readyState == 2) {
			source.close();
			clearInterval(checkinterval);
			setTimeout(onDomReady, 1000);
		    }
		}, 5 * 60 * 1000);
    });
})(vjQuery);  
