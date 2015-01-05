/*
* matlock.js
* description: polling mechanism for content gating
* author: John Richardson
*
*/

var matLock = {
	url: window.location.href, // url: stores the content URL
	timerStatus: 0,			   // timerStatus: on/off switch for the timer (1 == On, 0 == Off)
	currentTime: 0,		   	   // currentTime: holds the current time on the timer in seconds
	userStatus: null,   	   // userStatus holds 'unsecured' or 'secured' based upon the security check
	runtime: null,			   // todo: add variable to keep runtime clock on multiple users
	callback: null,			   // todo: add callback url to execute from Drupal configuration
	logging: 0,				   // verbose logging in console; Defaults to 0, Set to 1 if you want to see output
	startTimer: function(){
		this.timerStatus = 1;
		if(this.logging == 1) {
		console.log("The timer was started at " + this.currentTime + " seconds.");
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
	setUserStatus: function(s){
		if(this.logging == 1) {
		console.log('User status was set to ' + s);
		}
		return this.userStatus = s;
	},
	getUserStatus: function(){
		return this.userStatus;
	},
	setCallback: function(c){
		return this.callback = c;
	},
	getCallback: function(){
		return this.callback;
	},
	toggleOutput: function(bool){
		return this.logging = bool;
	},
	checkTimer: function(){
		switch(this.currentTime){
			case 2:
			  this.request('security');
			break;
			case 3: 
			  this.request('gatecheck');
			break;
			//Add additional runtime cases here
			// case x:
			//   this.request();
			// break;
			default:
			if(this.logging == 1) {
			console.log('Ping did not happen.');
			}
			  
		}//end switch
		if(this.logging == 1) {
		console.log('time was checked, it is ' + this.currentTime);	
		}
		return this.currentTime;
	},
	request: function(type) {
		xhr = (function($) {
		  $.ajax({
		    url: this.url,
		    success: function(data){
		   	//there are different types of requests in our polling mechanism.
		   	//1. Security--Checks the global visitor object and finds out whether or not they're secured
		   	//2. Gatecheck--This throws up a gate for the user to respond to. Timer stops while in session
		   	if(matLock.logging == 1) {
			console.log('ajax request sent');
			}
		   	
		    	if(type == 'security'){
		    		if(matLock.logging == 1) {
					console.log('This is a security check.');
					}
		    	
		    		//this is a security check, find out if they're secured/unsecured
		    		if(matLock.logging == 1) {
					console.log('Checking the status of the user...');
					}
		    		
     				if(Drupal.settings.content_gating.visitor == 'unsecured') {
	   					// check the polling application and show them the gate if their status is 'unsecured'
	   					if(matLock.logging == 1) {
						console.log('User is ' + Drupal.settings.content_gating.visitor);
						}	
	   					matLock.setUserStatus("unsecured");
     				} else {
		     			// the visitor's identity is secured, meaning we know either their uid or elqCookie
		     			// don't do anything...
		     			if(matLock.logging == 1) {
						console.log('User is ' + Drupal.settings.content_gating.visitor);
						}			
		     			matLock.setUserStatus("secured");
     				}
		    	}//end if type == 'security'
		  	  if(type == 'gatecheck'){
		  	  	if(matLock.logging == 1) {
				console.log('This is a gate check.');
				}
		    	
		    		//this is a security check, find out if they're secured/unsecured
		    		if(matLock.logging == 1) {
					console.log('This event will simulate a user having to fill out a form to proceed.');
					}
		    		
     				if(matLock.getUserStatus() == "unsecured"){
     				  $.colorbox({
          				href: matLock.getCallback(),
          				closeButton:true, //removes the colorbox close button
          				escKey:true,	   //prevents close on 'Esc' key
          				overlayClose:true,//prevents close from clicking on BG overlay
          				maxWidth: "500px",
          				maxHeight: "650px",
          				onLoad: function(){
          					//$('#cboxClose').hide(); //ensure the close button hides on load
          				}
        			  });
        			  matLock.stopTimer();
     				}
		      }//end if type == 'gatecheck'
		    },
		    complete: function(data){
		    	if(matLock.logging == 1) {
				 console.log('ajax request complete');
				}
		    }
		  });
		})(jQuery);
	},
	init: function(c) {
		//c: callback url to webform (or any other) action, triggered by Drupal configuration form.
		this.startTimer();
		return this.callback = this.setCallback(c);
	}
};