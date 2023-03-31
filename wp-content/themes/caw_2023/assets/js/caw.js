let map = '';
const generateMapbox = () => {
	mapboxgl.accessToken = 'pk.eyJ1IjoibWV1cm8iLCJhIjoiY2xmcjA2ZDczMDEwYTQzcWZwZXk4dmpvdSJ9.YHkGCdl-D6YkWDJbNGOBEQ';
	map = new mapboxgl.Map({
		container: 'caw-mapbox', // container ID
		style: 'mapbox://styles/meuro/clftwthuu002b01ogx6r445s7', // style URL
		center: [10.015,45.135], // starting position [lng, lat]
		zoom: 12.5, // starting zoom
		// cooperativeGestures: true,
	});

	map.addControl(new mapboxgl.NavigationControl());

}
document.addEventListener('DOMContentLoaded', () => {
	generateMapbox()
	map.on('click', (event) => {
	// If the user clicked on one of your markers, get its information.
	const features = map.queryRenderedFeatures(event.point, {
		layers: ['caw-2023-locations'] // replace with your layer name
	});
	if (!features.length) {
		return;
	}
	const feature = features[0];
	console.debug({feature})

	/* 
	Create a popup, specify its options 
	and properties, and add it to the map.
	*/
	const popup = new mapboxgl.Popup({ offset: [0, -15] })
		.setLngLat(feature.geometry.coordinates)
		.setHTML(
			`<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
		)
		.addTo(map);
	});
	// Change the cursor to a pointer when the mouse is over the places layer.
	map.on('mouseenter', 'places', () => {
	map.getCanvas().style.cursor = 'pointer';
	});
	 
	// Change it back to a pointer when it leaves.
	map.on('mouseleave', 'places', () => {
	map.getCanvas().style.cursor = '';
	});
});
