var express = require('express');
var router = express.Router();
var request = require('request');
var Q = require('q');
var googleImages = require('google-images');
var client = googleImages('<yourID>','<yourSecret>');


var queryGoogle = function(items){
	    var deferred = Q.defer();
        var promises = items.map(function (item){
        	item = item.trim();
        	if(item.length > 4){
        		var pos = item.match(/[a-zA-Z]\./i);
	        	var c =  pos ? item.indexOf(pos[0]) : (item.length -2);
	        	var d = item.indexOf(' ');
	        	//API response formed here!
	        	var obj = {};
	        	obj.day = item.substring(0,d);
	        	obj.news = item.substring(d+1,c+1);
	        	obj.thumb = "";
	            return client.search(obj.news)
				    .then(function (images) {
				    	if(images.length > 1)
				    		obj.thumb = (images[0]).hasOwnProperty("url") ? images[0]["url"] : "";
				    	return obj;
				    });
			}
        });

        Q.all(promises).done(function (data) {
            deferred.resolve({
                results: data
            });
        });

       return deferred.promise;
};


var parseWiki = function(data,qmonth){
	var a = data.split(/\=\=\s*Births\s*\=\=/gi);
	var events = a[0].split(/\=\=\s*Events\s*\=\=/gi);
	//events = interim.length >= 2 ? interim : a[0].split("== Events ==");
	//Too much gibberish in wikipedia data
	var req = events[1].replace(/[\n\'\*]|\&ndash\;|\[\[File\:.*\]\]|\<ref.*\<\/ref\>/gi, "");
	eventsarr = req.split(/\=\=\=[\w\s]+\=\=\=/gi);
	//test.replace(/[\'\*\=\[\]\(\)]|\&ndash\;|\<ref\>.*\<\/ref\>/gi, "");

	//I should have the array of events here!
	var monthdata = "";
	eventsarr.forEach(function(month,ind){
		var pos = month.indexOf(qmonth);
		if(pos !== -1 && pos < 15)
			{
				monthdata = monthdata.length > 5 ? monthdata : eventsarr[ind];
			}
	});

	//Remove brackets here! We should be good to go.
	var regex = /\[{2}([^|]*?)(?:\|(.*?))?\]{2}/g;
	monthdata = monthdata.replace(regex, function(c, m1, m2) {
	  return m2 ? m2 : m1;
	});
	monthdata = monthdata.replace(/\=/gi, "");
	montheventsarr = monthdata.split(qmonth);
	return montheventsarr; //returns an array of events in that month
}

router.get('/:month/:year', function(req, res, next) {
  var qmonth = req.params.month; 
  request('https://en.wikipedia.org/w/api.php?format=json&action=query&titles='+req.params.year+'&prop=revisions&rvprop=content&callback=?', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	//Wikipedia's JSON response is fucked up
	    body = JSON.parse(body.slice(5,-1));
	    var pages = body.query.pages;

	    //Now I have the data
	    var data = pages[Object.keys(pages)[0]].revisions[0]["*"];
	    var montheventsarr = parseWiki(data,qmonth);
		//Finds relevant google images for the news articles and returns API response here
		queryGoogle(montheventsarr)
            .then(function(resp){
            	console.log(resp.results);
            	res.setHeader('Content-Type', 'application/json');
    			res.send(JSON.stringify(resp.results));
            });
	  }
  });
});


module.exports = router;
