# Timeline

This project can serve as a backend for visualizing a timeline of the world

The idea is to have a visual representation of the world since as early as we can. I am trying to get data from wikiPedia and parsing it to get specific events that happened in a particular month of an year. Then I try to fetch the most relevant image for that event from Google. I am using the [https://github.com/vdemedes/google-images](Google-images) Node module in this regard and it works fine except the number of API calls is restricted to 100 in one day! :confounded:

Wikipedia provides a tremendous amount of information for every year that represents what was happening at the time. Just take a look at https://en.wikipedia.org/wiki/1943 for instance. Events are categorized and dated month wise. This serves as a starting point for gathering data for events at a month level (We can dig deeper but for now let's assume month is an appreciable atomic level).

# Getting Started

Just clone the repository, do `npm install` and set up a project granting necessary permissions to use google image search for the node module. You will get your **ProjectID** and **ProjectSecret** that you need to plugin in `timeline.js` file.

# Usage and API response

A call to `/timeline/:Month/:Year` for instance `/timeline/January/1884` might return a result in this format:

    [
      {
      	day: "1"
        news: ' The Fabian Society is founded in London',
        thumb: 'http://artscape.us/f/fabian-society.jpg' 
      },
      {
    	day: "21",
    	news: "Foo Bar",
    	thumb: "<RelevantImageURLfromGoogle>"
      },...
    ]

There are ofcourse some errors when trying out really old data like for the Year 1884 and that's because of lack of any structure in the way data is saved in wikipedia.

# Going forward

I want to collaborate on:

* Creating a robust and more complete parser for wikipedia entries
* Looking at alternative sources for events and more importantly images given the API call limit for Google image search
* Other data points that can represent a specific time. For example, I was thinking of playing the Billboard top song of that month in the background. It just gives a feel of the times and taste of people. In recent years, we have Youtube Rewind videos and social networks with trends that can represent what the masses are thinking.

Any inputs on these points or more features are appreciated. Please, feel free to suggest features/bugs in the issues area.
