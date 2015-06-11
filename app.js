var initialPlaces = [
	{
		name: "The LA Hotel Downtown",
		lat: 34.05497,
		lon: -118.255428
	},
	{
		name: "Yard House",
		lat: 34.044984,
		lon: -118.265775
	},
	{
		name: "Walt Disney Concert Hall",
		lat: 34.055345,
		lon: -118.249845
	},
	{
		name: "Dodger Stadium",
		lat: 34.072736,
		lon: -118.240616
	},
	{
		name: "Metro Plaza Hotel",
		lat: 34.058834,
		lon: -118.237616
	},
	{
		name: "Historic Mayfair Hotel",
		lat: 34.052108,
		lon: -118.26764
	},
	{
		name: "Bottega Louie",
		lat: 34.0475211,
		lon: -118.2640137
	},
	{
		name: "The Original Pantry Cafe",
		lat: 34.0464657,
		lon: -118.262997
	},
	{
		name: "Hotel Figueroa",
		lat: 34.0464665,
		lon: -118.2629968
	},
	{
		name: "Natural History Museum of Los Angeles",
		lat: 34.017089,
		lon: -118.28876
	}
];
var Place = function(data){
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lon = ko.observable(data.lon);
	this.marker = ko.observable();
	this.rating = ko.observable();
	this.checkinCount = ko.observable();
	this.street = ko.observable();
	this.cityState = ko.observable();
	this.url = ko.observable();
}
var ViewModel = function() {
	var self = this;
	this.placeList = ko.observableArray([]);
	initialPlaces.forEach(function(placeItem){
		self.placeList.push( new Place(placeItem) );
	});
	var infowindow = new google.maps.InfoWindow();
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
			center: new google.maps.LatLng(34.0432121, -118.2499534),
			zoom: 12,
	});	
	var marker;
	for (var i = 0; i < this.placeList().length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(this.placeList()[i].lat(), this.placeList()[i].lon()),
			map: map,
			animation: google.maps.Animation.DROP,
		});
		var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?limit=1&ll=' + initialPlaces[i].lat + ',' + initialPlaces[i].lon + '&intent=match&query=' + initialPlaces[i].name + '&client_id=AOICOBBHGVYWPCIOEKTNF5CECB3RNMJWJWIQHEHJ1ZWDSAH1&client_secret=5HO3PIPDPY1DS50SLOUFNIAU1ZO2YBPPSWJQDCFGCBKE3HND&v=20140806';
		var failText = 'Failed to get FOURSQUARE resources';
		var name, url, rating, checkinCount, street, cityState;
		$.getJSON(foursquareUrl, function(data){
			results = data.response.groups[0].items[0].venue;
			name = results.name;
			url = results.url;
			rating = results.rating;
			checkinCount = results.stats.checkinsCount;
			street = results.location.formattedAddress[0];
			cityState = results.location.formattedAddress[1];
			self.placeList()[i] = new Place(name, url, rating, checkinCount, street, cityState);
			console.log(self.placeList()[i].street);
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
			setTimeout(toggleBounce, 2000);
			setTimeout(function(){
				infowindow.setContent('<p>test' + self.placeList()[i].street + '</p>');
				infowindow.open(map, marker);
			}, 1000);
		});
	}

	this.show_info = function(){
		google.maps.event.trigger(marker,'click');
	}
};
$(document).ready(function(){
	ko.applyBindings(new ViewModel());
});
