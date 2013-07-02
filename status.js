(function($) {
  function onDomReady() {
    var source = new EventSource('//status.kreativitaet-trifft-technik.de/api/statusStream?spaceOpen=1&spaceDevices=1');
    var lastkeepalive = +new Date();
    source.onopen = function() {
      $('div.statusblock-Status').removeClass("statusblock-statusclosed");
      $('div.statusblock-Status').removeClass("statusblock-statusinit");
      $('div.statusblock-Status').removeClass("statusblock-statuserror");
      $('div.statusblock-Status').addClass("statusblock-statusopen");
      $('div.statusblock-Status').html("<p>Hochgefahren</p>");
    }
/*	  source.onerror = function() {
	    $('div.statusblock-Status').removeClass("statusblock-statusclosed");
		  $('div.statusblock-Status').removeClass("statusblock-statusopen");
		  $('div.statusblock-Status').removeClass("statusblock-statusinit");
		  $('div.statusblock-Status').addClass("statusblock-statuserror");
		  $('div.statusblock-Status').html("<p>Crashed</p>");
	  } */
	  source.addEventListener('spaceOpen', function(e) {
	    var data = jQuery.parseJSON(e.data);
		  switch (data.state) {
		    case 'off':
        case 'closing' :
                $('div.statusblock-Status').addClass("statusblock-statusclosed");
		            $('div.statusblock-Status').removeClass("statusblock-statusopen");
		            $('div.statusblock-Status').removeClass("statusblock-statusinit");
		            $('div.statusblock-Status').removeClass("statusblock-statuserror");
                $('div.statusblock-Status').html("<p>Runtergefahren</p>");
			    break;
		    case 'on':
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
  }
  if (typeof(EventSource) === "function") {
    document.addEventListener('DOMContentLoaded', onDomReady, false);
  } else {  
    jQuery.getScript("eventsource.js", function() {
	    onDomReady();
	  });
  }
})(jQuery);  
