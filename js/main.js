const markerInactive = "/img/marker.jpg";
const markerActive = "/img/marker_g.jpg";
let select = -1;
let data = "";
let stopData = "";
let markerList = {};
let bus_counter = 0;
let tram_counter = 0;
let route = "";
let cacheRatelimit = 43200000;
let gpsRatelimit = 10000;

$("#line").val("");
$("#refresh").click(loadBusPoints);

function lonLat(lon, lat) {
	return new OpenLayers.LonLat(lon, lat ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
}
function loadBusPoints() {
	bus_counter = 0;
	$.ajax({
			url:"/api/vehiclePositions.php/?vehicle=1",
			dataType: "json",
			success: function(result) {
				data = result;
				$("#update").html("Last update: "+Date.now());
				busMarkers.clearMarkers();
				data["result"].forEach(setBusPoints);
			$("#bus_counter").html("Bus count: "+bus_counter);
			},
			fail: function() {
				console.log("AJAX machine broke");
			},
		})
		.always( function() {
			setTimeout(loadBusPoints, 10000); //10 seconds
		})
}
function setBusPoints(item, index) {
	let line = $("#line").val();
	if(line == "" || item.Lines == line) {
		bus_counter++;
		let bus = data["result"][index];
		markerList[item.VehicleNumber] = new OpenLayers.Marker(lonLat(item.Lon, item.Lat));
		busMarkers.addMarker(markerList[item.VehicleNumber]);
		if (select == bus["VehicleNumber"]) {
			markerList[item.VehicleNumber].setUrl(markerActive);
		}
		markerList[item.VehicleNumber].events.register('click', markerList[item.VehicleNumber], function(evt) { busInfo(bus); OpenLayers.Event.stop(evt); });
		markerList[item.VehicleNumber].events.register('touchstart', markerList[item.VehicleNumber], function(evt) { busInfo(bus); OpenLayers.Event.stop(evt); });
	}
}
function busInfo(bus) {
	if(select != -1) {
		markerList[select].setUrl(markerInactive);
	}
	select = bus["VehicleNumber"];
	$.ajax({url:"/api/trips.php?trip="+bus["Lines"], dataType: "json", success: function(result) {
		markerList[select].setUrl(markerActive);
		$("#vehicle").html("Line: "+bus["Lines"]+" Vehicle:"+"<br>Last heard: "+bus["Time"]);
	}});
}
//----------------------trams
function loadTramPoints() {
	tram_counter = 0;
	$.ajax({
			url:"/api/vehiclePositions.php/?vehicle=2",
			dataType: "json",
			success: function(result) {
				data = result;
			tramMarkers.clearMarkers();
				data["result"].forEach(setTramPoints);
			$("#tram_counter").html("Tram count: "+tram_counter);
			},
			fail: function() {
				console.log("AJAX machine broke");
			},
		})
		.always( function() {
			setTimeout(loadTramPoints, 10000); //10 seconds
		})
}
function setTramPoints(item, index) {
	let line = $("#line").val();
	if(line == "" || item.Lines == line) {
		tram_counter++;
		let tram = data["result"][index];
		markerList[item.VehicleNumber] = new OpenLayers.Marker(lonLat(item.Lon, item.Lat));
		tramMarkers.addMarker(markerList[item.VehicleNumber]);
		if (select == tram["VehicleNumber"]) {
			markerList[item.VehicleNumber].setUrl(markerActive);
		}
		markerList[item.VehicleNumber].events.register('click', markerList[item.VehicleNumber], function(evt) { tramInfo(tram); OpenLayers.Event.stop(evt); });
		markerList[item.VehicleNumber].events.register('touchstart', markerList[item.VehicleNumber], function(evt) { busInfo(tram); OpenLayers.Event.stop(evt); });
	}
}
function tramInfo(tram) {
	if(select != -1) {
		markerList[select].setUrl(markerInactive);
	}
	select = tram["VehicleNumber"];
	$.ajax({url:"/api/trips.php?trip="+tram["Lines"], dataType: "json", success: function(result) {
		markerList[select].setUrl(markerActive);
		$("#vehicle").html("Line: "+tram["Lines"]+" Vehicle:"+"<br>Last heard: "+tram["Time"]);
	}});
}


map = new OpenLayers.Map("mapdiv");
map.addLayer(new OpenLayers.Layer.OSM());
const busMarkers = new OpenLayers.Layer.Markers( "busMarkers" );
map.addLayer(busMarkers);
loadBusPoints();

map.addLayer(new OpenLayers.Layer.OSM());
const tramMarkers = new OpenLayers.Layer.Markers( "tramMarkers" );
map.addLayer(tramMarkers);
loadTramPoints();

map.setCenter(lonLat(21.017532, 52.237049), 12);