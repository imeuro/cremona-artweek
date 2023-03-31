const generateMapbox = () => {
	mapboxgl.accessToken = 'pk.eyJ1IjoibWV1cm8iLCJhIjoiY2xmcjA2ZDczMDEwYTQzcWZwZXk4dmpvdSJ9.YHkGCdl-D6YkWDJbNGOBEQ';
	const map = new mapboxgl.Map({
		container: 'caw-mapbox', // container ID
		style: 'mapbox://styles/meuro/clftwthuu002b01ogx6r445s7', // style URL
		center: [10.02768,45.13642], // starting position [lng, lat]
		zoom: 13, // starting zoom
	});
}
document.addEventListener('DOMContentLoaded', generateMapbox)
