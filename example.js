function Model() {
  /**
   * Generates an HTML list
   * @param  {array} articles  array that contains Article objects defined in viewModel
   * @return {string}          returns a string of HTMl
   */
  this.generateLists = function(articles) {
    var Info_Content = '<ol>\n';

    for (var i = 0; i < articles.length; i++) {
      var content = articles[i].content;
      var url = articles[i].url;

      Info_Content += '<li><a href="' + url + '">' + content + '</a></li>\n';
    }

    Info_Content += '</ol>';

    return Info_Content;
  };

}

var model = new Model();

// This is where all of our data is pulled from using observables.
var viewModel = function() {

  var self = this;

  self.articleList = ko.observableArray();

  self.article = function (content, url) {
    this.content = content;
    this.url = url;
  };

  // This sets up the map. The mapPin function uses this.
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 12,
    center: new google.maps.LatLng(61.196148, -149.885577),
  });

  // Use one infowindow object to keep it simple
  var infowindow = new google.maps.InfoWindow();

  self.mapPin = function (name, lat, lon, text) {

    // Here we setup the observables.

    this.name = ko.observable(name);
    this.lat = ko.observable(lat);
    this.lon = ko.observable(lon);
    this.text = ko.observable(text);

    // This setups up the map markers at the specified coordinates in the viewModel.

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      map: map,
      animation: google.maps.Animation.DROP
    });

    // These are the functions that are called when the map markers are clicked.

    google.maps.event.addListener(marker, 'click', function () {
      // Send AJAX request first
      self.apiData(name);

      // Wait for the AJAX call to finish 300 milliseconds later
      window.setTimeout(function() {
        infowindow.setContent(model.generateLists(self.articleList()));
        infowindow.open(map, marker);
      }, 300);

    });
  };

  self.pins = ko.observableArray([
    new self.mapPin("Alaska Communications", 61.196148, -149.885577, "test11"),
    new self.mapPin("Anchorage Alaska", 61.190491, -149.868937, "test2")
  ]);

  self.apiData = function(name) {

    var wikipediaURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + name + '&format=json&callback=wikiCallback';
    var wikiFailText = 'Failed to get Wikipedia resources';

    parameters = {
      url: wikipediaURL,
      dataType: "jsonp",
      success: function (response) {
        self.articleList.removeAll();
        var articles = response[1];

        for (var i = 0; i < articles.length; i++) {
          var name = articles[i];
          var url = 'http://en.wikipedia.org/wiki/' + name;
          self.articleList.push(new self.article(name, url));
        }
      },
      error: function() {
        // Do fail request here
      }
    };

    $.ajax(parameters);
  };

};

// Initiates the viewModel bindings.
$(document).ready(function() {
  ko.applyBindings(new viewModel());
});