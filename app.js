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
var ViewModel = function() {
	/*var nytUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + this.title + '&sort=newest&api-key=57a19b2e7a7d77a1f0c942e487e7e70e:11:72202220';
    $.getJSON(nytUrl, function(data){ // data is what is returned

        $nytHeaderElem.text('New York Times Articles About ' + this.title);
        articles = data.response.docs; // look at preview tab > response > docs > articles returned
        for (var i = 0; i < articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        }; // web_url and snippet are properties of each article returned

    }).error(function(e){
        $nytHeaderElem.text('New York Times articles could not be loaded.');
    });*/
	/*var self = this;
	this.locationList = ko.observableArray([]);

	initialLocations.forEach(function(locationItem){
		self.locationList.push( new Location(locationItem) );
	});
	this.currentLocation = ko.observable( this.locationList()[0]);*/

	/*self.show_marker = function(location){
		google.maps.event.trigger(location.marker,'click', function(){
			infowindow.open(map, marker);
		});
	}*/
	function initialize() {
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
	google.maps.event.addDomListener(window,'load',initialize);
}
ViewModel();
/*ko.applyBindings(new ViewModel());*/