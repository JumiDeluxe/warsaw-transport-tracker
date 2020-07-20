<?php
//	bus data
$url = "https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id=f2e5503e-927d-4ad3-9500-4ab9e55deb59&apikey=b9e90f44-5cb5-4374-8960-5e9476cf8247&type=2";
$cache = "cache/tramPositions.json";

$json = file_get_contents($url);
$data = json_decode($json, 1);
file_put_contents($cache, $json);

if(isset($data)) {

	$vehicles = ["result" => []];
    foreach($data["result"] as $vehicle) {
    	$array = [
    		"Lines" => $vehicle["Lines"],
				"VehicleNumber" => $vehicle["VehicleNumber"],
				"Time" => $vehicle["Time"],
    		"Lat" => $vehicle["Lat"],
        "Lon" => $vehicle["Lon"],
        "Brigade" => $vehicle["Brigade"]
		];
    	array_push($vehicles["result"],$array);
    }
    echo json_encode($vehicles);
}
