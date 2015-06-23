"use strict";
/*Model data*/
var initialPlaces = [
	{
		name: "The Omni Los Angeles Hotel at California Plaza",
		lat: 34.052582,
		lon: -118.250549
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

/*function initialize() {
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: new google.maps.LatLng(34.0432121, -118.2499534),
		zoom: 12,
	});
}*/

/*Set observables*/
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
};

var ViewModel = function() {
	var self = this;
	/*var map;*/
	this.placeList = ko.observableArray([]);

	/*Creates new Place objects for each item in initialPlaces*/
	initialPlaces.forEach(function(placeItem){
		self.placeList.push( new Place(placeItem) );
	});

	/*Creates a new infowindow object*/
	var infowindow = new google.maps.InfoWindow();
	/*Creates the map*/
	/*var map = new google.maps.Map(document.getElementById('map-canvas'), {
			center: new google.maps.LatLng(34.0432121, -118.2499534),
			zoom: 12,
	});*/

	/*For each placeItem, create a marker, look up FourSquare info, and add Listener to each marker*/
	var marker;
	/*initialize();*/
	self.placeList().forEach(function(placeItem){

		marker = new google.maps.Marker({
			position: new google.maps.LatLng(placeItem.lat(),placeItem.lon()),
			map: map,
			animation: google.maps.Animation.DROP,
			title: placeItem.name()
		});
		placeItem.marker = marker;

		/*Look up FourSquare info*/
		var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?limit=1&ll=' + placeItem.lat() + ',' + placeItem.lon() + '&intent=match&query=' + placeItem.name() + '&client_id=AOICOBBHGVYWPCIOEKTNF5CECB3RNMJWJWIQHEHJ1ZWDSAH1&client_secret=5HO3PIPDPY1DS50SLOUFNIAU1ZO2YBPPSWJQDCFGCBKE3HND&v=20140806';
		var results, name, url, rating, checkinCount, street, cityState;
		$.getJSON(foursquareUrl, function(data){
			results = data.response.groups[0].items[0].venue;
			placeItem.name = results.name;
			placeItem.url = results.url;
			placeItem.rating = results.rating;
			placeItem.checkinCount = results.stats.checkinsCount;
			placeItem.street = results.location.formattedAddress[0];
			placeItem.cityState = results.location.formattedAddress[1];
		}).error(function(e){
			$('span').text('Please close the Info Window and reopen!');
		});

		/*Toggles the bounce animation on the marker*/
		function toggleBounce() {
			if(placeItem.marker.getAnimation() !== null) {
				placeItem.marker.setAnimation(null);
			} else {
				placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
			}
		}

		/*When the marker is clicked, animate the marker and show infowindow*/
		google.maps.event.addListener(placeItem.marker, 'click', function(){
			toggleBounce();
			setTimeout(toggleBounce, 600);
			setTimeout(function(){
				infowindow.setContent('<h3>' + placeItem.name + '</h3>\n<p><b>Rating: </b>' + placeItem.rating + '</p>\n<p><b>Check Ins: </b>' + placeItem.checkinCount + '</p>\n<a href=' + placeItem.url + '>' + placeItem.url + '</a>\n<p><b>Address:</b></p>\n<p>' + placeItem.street + '</p>\n<p>' + placeItem.cityState + '</p>');
				infowindow.open(map, placeItem.marker);
			}, 200);
			map.panTo(placeItem.marker.position);
		});

	});
	/*When list item is clicked, the corresponding marker is clicked and the infowindow is shown*/
	self.show_info = function(placeItem){
		google.maps.event.trigger(placeItem.marker,'click');
	};
	
	/*Filter list locations and map markers*/
	self.filter = function() {
		var s = $('#filterTerm').val();
		console.log(s.toLowerCase().replace(/\b[a-z]/g,"KC"));
		s = s.toLowerCase().replace(/\b[a-z]/g, function(self) {
			console.log(self.toUpperCase());
			return self.toUpperCase();
		}), $(".locList > li").each(function() {
			console.log(this);	
			$(this).text().search(s) > -1 ? $(this).show() : $(this).hide();
		});
		for(var i = 0; i < self.placeList().length; i++) {
			console.log(self.map);
			self.placeList()[i].marker.setMap(self.placeList()[i].marker.title.search(s) > -1 ? map : null);
		}
	};
	/*google.maps.event.addDomListener(window,'load',initialize);*/
};
var map;
function initialize() {
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: new google.maps.LatLng(34.0432121, -118.2499534),
		zoom: 12,
	});
	google.maps.event.addDomListener(window,'resize', function(){
		map.setCenter(new google.maps.LatLng(34.0432121, -118.2499534));
		map.panTo(new google.maps.LatLng(34.0432121, -118.2499534));
	});
	ko.applyBindings(new ViewModel());
}

google.maps.event.addDomListener(window,'load',initialize);
/*ko.applyBindings(new ViewModel());*/
/*$(document).ready(function(){
	ko.applyBindings(new ViewModel());
});*/