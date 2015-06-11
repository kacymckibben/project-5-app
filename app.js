function Model() {
	this.generateLists = function(articles) {
		var Info_Content = '<ul style="list-style-type:none">\n';

		for (var i = 0; i < articles.length; i++){
			var name = articles[i].name;
			var url = articles[i].url;
			var rating = articles[i].rating;
			var checkinCount = articles[i].checkinCount;
			var street = articles[i].street;
			var cityState = articles[i].cityState;

			Info_Content += '<li><a href="' + url + '">' + name + '</a></li>\n<li>FourSquare Rating: ' + rating + '</li>\n<li>Check Ins: ' + checkinCount + '</li>\n<li>' + street + '</li>\n<li>' + cityState + '</li>';
		}
		Info_Content += '<ul>';
		return Info_Content;
	};
}
var model = new Model();

var ViewModel = function() {
	var self = this;
	self.articleList = ko.observableArray();

	self.article = function (name, url, rating, checkinCount, street, cityState) {
		this.name = name;
		this.url = url;
		this.rating = rating;
		this.checkinCount = checkinCount;
		this.street = street;
		this.cityState = cityState;
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: new google.maps.LatLng(34.0432121, -118.2499534),
		zoom: 12,
	});

	var infowindow = new google.maps.InfoWindow();

	self.mapPin = function(name, lat, lon) {
		this.name = ko.observable(name);
		this.lat = ko.observable(lat);
		this.lon = ko.observable(lon);

		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lon),
			map: map,
			animation: google.maps.Animation.DROP,
		});

		function toggleBounce() {
			if(marker.getAnimation() != null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
			}
		}

		google.maps.event.addListener(marker, 'click', function(){
			self.apiData(name,lat,lon);

			toggleBounce();
			setTimeout(toggleBounce, 2000);
			setTimeout(function(){
				infowindow.setContent(model.generateLists(self.articleList()));
				infowindow.open(map, marker);
			}, 1000);
		});
	};

	self.pins = ko.observableArray([
		new self.mapPin("The LA Hotel Downtown", 34.05497, -118.255428),
		new self.mapPin("Yard House", 34.044984, -118.265775),
		new self.mapPin("Walt Disney Concert Hall", 34.055345, -118.249845),
		new self.mapPin("Dodger Stadium", 34.072736, -118.240616),
		new self.mapPin("Metro Plaza Hotel",34.058834,-118.237616),
		new self.mapPin("Historic Mayfair Hotel",34.052108,-118.26764),
		new self.mapPin("Wokcano",34.0511124,-118.2669319),
		new self.mapPin("Bottega Louie",34.0475211,-118.2640137),
		new self.mapPin("The Original Pantry Cafe",34.0464657,-118.262997),
		new self.mapPin("Hotel Figueroa",34.0464665,-118.2629968),
		new self.mapPin("Natural History Museum of Los Angeles",34.017089,-118.28876)
	]);

	self.apiData = function(name,lat,lon) {
		var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?limit=1&ll=' + lat + ',' + lon + '&intent=match&query=' + name + '&client_id=AOICOBBHGVYWPCIOEKTNF5CECB3RNMJWJWIQHEHJ1ZWDSAH1&client_secret=5HO3PIPDPY1DS50SLOUFNIAU1ZO2YBPPSWJQDCFGCBKE3HND&v=20140806';
		var failText = 'Failed to get FOURSQUARE resources';

		$.getJSON(foursquareUrl, function(data){
			articles = data.response.groups[0].items[0].venue;
			self.articleList.removeAll();
			var name = articles.name;
			var url = articles.url;
			var rating = articles.rating;
			var checkinCount = articles.stats.checkinsCount;
			var street = articles.location.formattedAddress[0];
			var cityState = articles.location.formattedAddress[1];
			self.articleList.push(new self.article(name, url, rating, checkinCount, street, cityState));
		});
	}

	self.show_info = function(pins){
		google.maps.event.trigger(pins.marker,'click');
	}
};
$(document).ready(function(){
	ko.applyBindings(new ViewModel());
});
