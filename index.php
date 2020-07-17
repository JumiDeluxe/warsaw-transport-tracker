<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0">
	<title>Bus Search</title>
	<link rel="stylesheet" type="text/css" href="/css/style.css"/>
</head>
<body>
	<div id="data">
		<div id="update"></div>
		<div id="vehicle"></div>
		<div id="search">
			<label for="line">Line</label><br>
			<input type="text" id="line"><br>
			<label for="stop">Stop</label><br>
			<input type="text" id="stop"></br>
			<button type="button" id="refresh">Refresh</button>
	</div>
	<div id="counter"></div>
	</div>
	<div id="mapdiv"></div>
	<script src="http://www.openlayers.org/api/OpenLayers.js"></script>
	<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
	<script src="/js/main.js"></script>
</body>
</html>
