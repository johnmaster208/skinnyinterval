/*
* skinnyinterval.js
* description: tiny worker script. Functions entirely off setInterval calls.
* author: John Richardson
*
*/

var SI = {

	url: window.location.href, // url: stores the content URL
	timerStatus: 0,			   // timerStatus: on/off switch for the timer (1 == On, 0 == Off)
	currentTime: 0,		   	   // currentTime: holds the current time on the timer in seconds
	userStatus: null,   	   // userStatus holds 'unsecured' or 'secured' based upon the security check
	runtime: null,			   // runtime is unique value for setInterval variable. Used to clear timeouts and nothing else.
	totalTime: null,
    event: {},			   	   // event array Allows for building of custom event automated actions.
	logging: 0,                // verbose logging in console; Defaults to 0, Set to 1 if you want to see output
	timeline: '',			   // based on what's in the event obj, a dynamic casing statement that includes timing/execution of scripts on the page load.
	hashid: null,

	// TODO: 
	// EventList(): public method to see the events loaded on the current timeline
	// triggerEvery: handler for event callbacks; need to find a way to push repeating events to the timeline (w/o having to re-init)
	// timeUntil(Event): shows seconds until X event triggers on the timeline (based on currentTime)
	// timeUntilNext(): shows seconds until next event on the timeline (based on currentTime)

	startTimer: function(){
		this.timerStatus = 1;
		if(this.logging == 1) {
		console.log("The timer was started at " + this.currentTime + " seconds.");
		}
		if(this.runtime !== null) {
		clearTimeout(this.runtime);
		}
		this.incrementTimer();
		//return this.timerStatus;
	},
	incrementTimer: function(){
		var x = this;
		if(this.timerStatus != 0){
		  runtime = setInterval(function(){
		  x.currentTime++;
		  x.checkTimer();
		  if(this.logging == 1) {
		  console.log(x.currentTime);
		  }  
		},1000);
		  return x.runtime = runtime;
		} else {
		  this.stopTimer();
		}
	},	
	stopTimer: function(){
		//alert('Stopping the timer...');		
		var z = clearInterval(this.runtime);
		if(z){
			if(this.logging == 1) {
			console.log('Timer was stopped at ' + this.currentTime);
			} 
		}
		if(this.logging == 1) {
		console.log('Timer status was set to 0');
		}
		return this.timerStatus = 0;
		//return this.timerStatus;
	},
	resumeTimer: function(int) {
		this.currentTime = typeof int !== 'undefined' ? int : this.currentTime;
		this.setTimer(this.currentTime);
		this.startTimer();
	},
	setTimer: function(int) {
		if(this.logging == 1) {
		console.log('Timer value was manually set to ' + int);
		}
		return this.currentTime = int;
	},
	setUserStatus: function(s){
		if(this.logging == 1) {
		console.log('User status was set to ' + s);
		}
		return this.userStatus = s;
	},
	getUserStatus: function(){
		return this.userStatus;
	},
	toggleOutput: function(bool){
		var str = (bool === 1) ? 'true' : 'false';
		console.log("Logging has been set to " + str);
		return this.logging = bool;
	},
	buildTimeline: function(eventsArray) {
	//constructs a dynamic 'case' statement based on the items
	//in the event object.
	//var evts = this.sortEvents(this.event);
	var switchOut = ''; 
	switchOut += 'switch(this.currentTime){';
	for(var i = 0; i < eventsArray.length; i++) {
		//contains the event Object - minus the callback
		var thisEventObj = eventsArray[i];
		console.log(thisEventObj);
		switchOut += 'case ' + thisEventObj.value + ':';
		switchOut += '(function(){ ';
		switchOut += this.event[thisEventObj.key]['eventCallback'];
		switchOut += '})();';
		switchOut += 'break;'
	}
		//build default case
		switchOut += 'default:';
		switchOut += 'if(this.logging == 1) {';
		switchOut += 'console.log("Ping.")';
		switchOut += '}';
	//end the switch
	switchOut += '}';
	//return to be eval'ed
	return this.timeline = switchOut;
	},
	checkTimer: function(){	
		eval(this.timeline);
		//if(this.logging == 1) {
		//console.log('time was checked, it is ' + this.currentTime);	
		//}
		return this.currentTime;
	},
	sortEvents: function(obj) {
		var eventList = [];
		for(key in obj) {
			if(obj.hasOwnProperty(key)) {
				eventList.push({ 'key': key, 'value' : obj[key]['triggerOn'] });
			}
		}
		eventList.sort( function(a, b) {
			return a.value - b.value;
		});
		return eventList;
	},
	request: function(type,url,data) {
		var xhr = new XMLHttpRequest();
		xhr.open(type,url);
		if(typeof data === 'undefined' || data === null) {
		xhr.send(null);	
		} else {
		xhr.send(data);
		}
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4){
				if(xhr.status === 200) {
					console.log(xhr.responseText);
					return xhr.responseText;
				} else {
					console.log('Error: ' + xhr.status);
				}
			}
		}
	},
	bakeCookie: function() {
		var name = "SI";
		var value = { url: this.url, currentTime: this.currentTime, status: this.timerStatus };
		var cookie = name + '=' + JSON.stringify(value);
		document.cookie = cookie;
		console.log('Data saved to document.cookie!');
	},
	readCookie: function(cookie) {
		//cookie = typeof document.cookie !== 'undefined' ? document.cookie;
	},
	listenOutbound: function() {
		console.log('SI is listening for outbound requests...');
		window.addEventListener('beforeunload', function (e) {
			console.log('User is leaving the web page...');
			this.request('POST','/',{url: this.url, totaltime: this.currentTime});
		});
	},
	init: function() {
		//start it up
		this.startTimer();
		//watch for exits.
		this.listenOutbound();
		//some test events...
		//this.event.hidelogo = {eventCallback: '(function($){$("p.digium-logo").hide();})(jQuery);',triggerOn: 15};
		//this.event.explodefonts = {eventCallback: '(function($){$("body").css({"font-size":"300%"})})(jQuery);',triggerOn: 10};
		//this.event.sayhi = { eventCallback: 'alert("Just wanted to say HI!");', triggerOn: 65 };
		//this.event.editable = { eventCallback: 'javascript:document.body.contentEditable="true"; document.designMode="on"; alert("content is now editable!");', triggerOn: 75 };
		this.toggleOutput(1);
		this.event.welcome = {eventCallback: 'console.log("Welcome to Skinnyinterval! This is a tiny script that does things for you (even when you forget it is there!)");',triggerOn: 10};
		this.event.welcome2 = {eventCallback: 'console.log("Notice there is a ping message every second?");',triggerOn: 15};
		this.event.welcome3 = {eventCallback: 'console.log("You can toggle this message on/off from the console by using its own public method, toggleOutput().");',triggerOn: 20};
		this.event.welcome4 = {eventCallback: 'console.log("Try using %cSI.toggleOutput(0);","color: blue; font-size:large;");',triggerOn: 25};
		this.event.welcome5 = {eventCallback: '(SI.logging === 0) ? console.log("See how easy that was? Skinnyinterval is excellent at counting, but not so good at keeping the actual time.") : console.log("^Try using the above command.") ;',triggerOn:40};
		var evts = this.sortEvents(this.event);
		this.buildTimeline(evts);
	}
};
var m = SI.init();