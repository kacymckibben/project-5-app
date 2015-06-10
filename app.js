/*var initialLocations = [
	{
		title: 'Sandpiper Cafe',
		content: 'test',
		lat: 58.300875,
		lng: -134.416252
	}
]
var Location = function(data) {
	this.title = ko.observable(data.title);
	this.content = ko.observable(data.content);
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(data.lat, data.long),
		title: data.title,
		map: map,
		animation: google.maps.Animation.DROP,
		content: content
	});
	this.addMapMarker = function() {
		this.marker.setMap(map);
	};
}*/
function Model() {
	this.generateLists = function(articles) {
		var Info_Content = '<ol>\n';

		for (var i = 0; i < articles.length; i++){
			var content = articles[i].content;
			var url = articles[i].url;

			Info_Content += '<li><a href="' + url + '">' + content + '</a></li>\n';
		}
		Info_Content += '<ol>';
		return Info_Content;
	};
}
var model = new Model();

var ViewModel = function() {
	var self = this;
	self.articleList = ko.observableArray();

	self.article = function (content, url) {
		this.content = content;
		this.url = url;
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: new google.maps.LatLng(34.0432121, -118.2499534),
		zoom: 12,
	});

	var infowindow = new google.maps.InfoWindow();



	self.mapPin = function(name, lat, lon, text) {
		this.name = ko.observable(name);
		this.lat = ko.observable(lat);
		this.lon = ko.observable(lon);
		this.text = ko.observable(text);

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
			self.apiData(name);

			toggleBounce();
			setTimeout(toggleBounce, 2000);
			window.setTimeout(function(){
				infowindow.setContent(model.generateLists(self.articleList()));
				infowindow.open(map, marker);
			}, 300);
		});
	};

	self.pins = ko.observableArray([
		new self.mapPin("The LA Hotel Downtown", 34.05497, -118.255428, "test"),
		new self.mapPin("Yard House", 34.044984, -118.265775, "test"),
		new self.mapPin("Walt Disney Concert Hall", 34.055345, -118.249845, "test"),
		new self.mapPin("Dodger Stadium", 34.072736, -118.240616, "test")
	]);

	self.apiData = function(name,lat,lon) {
		var foursquareUrl = 'http://api.foursquare.com/v2/venues/search?ll=' + lat + ',' + lon + '&query=' + name + '&client_id=AOICOBBHGVYWPCIOEKTNF5CECB3RNMJWJWIQHEHJ1ZWDSAH1&client_secret=5HO3PIPDPY1DS50SLOUFNIAU1ZO2YBPPSWJQDCFGCBKE3HND';
		var failText = 'Failed to get FOURSQUARE resources';

		$.getJSON(nytUrl, function(data){
			articles = data.venues;
			self.articleList.removeAll();
			var name = articles[0].name;
			var url = articles[0].url;
			self.articleList.push(new self.article(name, url));
		});
	}
	/*function initialize() {
		var mapOptions = {
			center: {lat: 34.0432121, lng: -118.2499534},
			zoom: 12
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(34.0432121, -118.2499534),
			map: map,
			animation: google.maps.Animation.DROP,
			title: 'Los Angeles, CA'
		});
		var nytUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + marker.title + '&fq=news_desk:("Sports" "U.S." "World" "Business")&sort=newest&api-key=57a19b2e7a7d77a1f0c942e487e7e70e:11:72202220';
		var contentString = "";
		var articleUrl;
		$.getJSON(nytUrl, function(data){
			articles = data.response.docs;
			articleUrl = articles[0].web_url;
			console.log(articleUrl);
			contentString = '<div>' + '<h3>Test</h3>' + '<a href="' + articles[0].web_url + '">' + articles[0].headline.main + '</a>' + '<p>' + articles[0].snippet + '</p>' + '</div>';
			console.log(contentString);
		});

		var infowindow = new google.maps.InfoWindow({
			content: '<p>' + articleUrl + 'test</p>'
		});

		function toggleBounce() {
			if(marker.getAnimation() != null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
			}
		}
		google.maps.event.addListener(marker, 'click', function(){
			toggleBounce();
			infowindow.open(map, marker);
			setTimeout(toggleBounce, 2000);
		});
	}
	google.maps.event.addDomListener(window,'load',initialize);*/
};
$(document).ready(function() {
	ko.applyBindings(new ViewModel());
});