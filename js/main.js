const markerInactive = "/img/marker.jpg";
const markerActive = "/img/marker_g.jpg";
let select = -1;
let data = "";
let markerList = {};
let counter = 0;
let route = "";
let cacheRatelimit = 43200000;
let gpsRatelimit = 10000;

$("#line").val("");
$("#refresh").click(loadPoints);

function lonLat(lon, lat) {
	return new OpenLayers.LonLat(lon, lat ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
}
function loadPoints() {
	counter = 0;
	$.ajax({
			url:"/api/gpsPositions.php",
			dataType: "json",
			success: function(result) {
				data = result;
				$("#update").html("Last update: "+Date.now());
				markers.clearMarkers();
				data["result"].forEach(setPoints);
			$("#counter").html("Bus count: "+counter);
			},
			fail: function() {
				console.log("AJAX machine broke");
			},
			always: function() {
				setTimeout(loadPoints, 10000); //10 seconds
			}
		});
}
function setPoints(item, index) {
	let line = $("#line").val();
	if(line == "" || item.Lines == line) {
		counter++;
		let bus = data["result"][index];
		markerList[item.VehicleNumber] = new OpenLayers.Marker(lonLat(item.Lon, item.Lat));
		markers.addMarker(markerList[item.VehicleNumber]);
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
		$("#vehicle").html("Line: "+bus["Lines"]+" Vehicle:"+/*"<br>Route: "+result["tripHeadsign"]+*/"<br>Last heard: "+bus["Time"]);
	}});
}

map = new OpenLayers.Map("mapdiv");
map.addLayer(new OpenLayers.Layer.OSM());
const markers = new OpenLayers.Layer.Markers( "Markers" );
map.addLayer(markers);
loadPoints();
map.setCenter(lonLat(21.017532, 52.237049), 12);