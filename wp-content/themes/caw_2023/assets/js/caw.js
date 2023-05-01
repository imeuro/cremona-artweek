const Baseurl = ['localhost','meuro.dev'].includes(window.location.hostname) ? '/cremona-artweek' : '';
const WPREST_Base = Baseurl+'/wp-json/wp/v2';
let locationsList = getPostsFromWp(WPREST_Base+'/locations?per_page=99');
var CAWgeoJSON = [];
BaseCoords = window.innerWidth<600 ? [10.024,45.139] : [10.015,45.132]
let map = '';
let ShiftMap = window.innerWidth<600 ? 0 : 0.0015;

// THE MAP BOX
const generateMapbox = () => {
	mapboxgl.accessToken = 'pk.eyJ1IjoibWV1cm8iLCJhIjoiY2xmcjA2ZDczMDEwYTQzcWZwZXk4dmpvdSJ9.YHkGCdl-D6YkWDJbNGOBEQ';
	
	map = new mapboxgl.Map({
		container: 'caw-mapbox', // container ID
		style: 'mapbox://styles/meuro/clg4t7v1e004p01mpehknvnkd', // style URL
		center: BaseCoords, // starting position [lng, lat]
		zoom: 14, // starting zoom
		glyphs: 'mapbox://fonts/meuro/OPS%20Placard%20Regular/0-255.pbf',
		// cooperativeGestures: true,
	});
	map.addControl(new mapboxgl.NavigationControl(),'bottom-right');
	// Add geolocate control to the map.
	map.addControl(
		new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
			// When active the map will receive updates to the device's location as it changes.
			trackUserLocation: true,
			// Draw an arrow next to the location dot to indicate which direction the device is heading.
			showUserHeading: true
		}),'bottom-right'
	);

	map.on('load', () => {
		// JSON EXAMPLE @
		// https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
		// console.debug(CAWgeoJSON);
		map.loadImage(
		Baseurl+'/wp-content/themes/caw_2023/assets/graphics/caw-marker.png',
		(error, image) => {
			if (error) throw error;
			 
			// Add the image to the map style.
			map.addImage('cawpointer', image);


			map.addSource('places', {
				'type': 'geojson',
				'data': CAWgeoJSON
			}) 

			map.addLayer({
				'id': 'places',
				'type': 'symbol',
				'source': 'places',
				// 'glyphs': 'https://api.mapbox.com/fonts/v1/meuro/OPS%20Placard%20Regular/0-255.pbf',
				'layout': {
					'icon-image': 'cawpointer',
					'icon-size': .85,
					'icon-allow-overlap': true,
					'icon-ignore-placement': true,
					'text-allow-overlap': true,
					'text-ignore-placement': true,
					'text-optional': true,
					'text-field': ['get', 'location_id'],
					'text-variable-anchor': ['center'],
					'text-radial-offset': 0,
					'text-justify': 'auto',
					'text-size': 18,
					//'text-weight': 900,
					'text-font': ['OPS Placard Regular'],
				},

				'paint': {
					'text-color': '#ffffff',
				}
			})

			const popup = new mapboxgl.Popup({ 
				anchor: 'left',
				offset: [20, 13],
				className: 'caw-popup',
				closeButton: false,
				maxWidth: '400px',
			})

			let readmorelink;
			let coords = [];
			map.on('mouseenter', 'places', (event) => {
				map.getCanvas().style.cursor = 'pointer';
				// If the user clicked on one of your markers, get its information.
				const features = map.queryRenderedFeatures(event.point, {
					layers: ['places'] // replace with your layer name
				});
				if (!features.length) {
					return;
				}
				const feature = features[0];
				console.debug({feature})
				readmorelink = feature.properties.post_id;
				coords = feature.geometry.coordinates;
				// let EVPlace = feature.properties.location_name ? feature.properties.location_name : feature.properties.location_address;
				let EVPlace = feature.properties.location_address;
				// Create a popup, specify its options 
				// and properties, and add it to the map.
				
				popup.setLngLat(feature.geometry.coordinates)
				.setHTML(
					`<p>${feature.properties.title}<br><small>${EVPlace}</small></p>
					`
				)
				.addTo(map);
			});

			map.on('mouseleave', 'places', () => {
				map.getCanvas().style.cursor = '';
				popup.remove();
			});

			map.on('click', 'places', () => {
			 	LoadItInTheDiv(readmorelink,'locations','HalfDiv');
			 	map.flyTo({
					center: [(coords[0] - ShiftMap),coords[1]],
					essential: true,
					zoom:17,
					duration: 2000
				});

			});

		});
		 
	});


}

document.addEventListener('DOMContentLoaded', () => {
/*
	artistList.then( 
			ARTdata => {
				var features = [];
				var geoJSON = {};
				geoJSON.type = 'FeatureCollection'
				Object.values(ARTdata).forEach(el => {
					console.debug( {el} );
					var art = {};
					art.type = "Feature";
					art.properties = {}
					art.properties.type = el.type;
					art.properties.title = el.title.rendered;
					art.properties.description = el.acf.evento_num;
					art.properties.post_id = el.id;
					art.properties.location_ids = el.acf.location;
					// art.properties.location_name = el.acf.evento_location.name;
					// art.properties.location_address = el.acf.evento_location.street_name+', '+el.acf.evento_location.street_number;
					// art.properties.location_number = el.acf.evento_num;
					art.geometry = {};
					art.geometry.type = "Point"
					// art.geometry.coordinates = [el.acf.evento_location.lng,el.acf.evento_location.lat];

					features.push(art);
				});

				geoJSON.features = features;
				CAWgeoJSON = geoJSON;
				console.debug(CAWgeoJSON)
				//generateMapbox();
			}
	);
*/
	locationsList.then( 
			ARTdata => {
				var features = [];
				var geoJSON = {};
				let i = 1;
				geoJSON.type = 'FeatureCollection';
				Object.values(ARTdata).forEach(el => {
					console.debug( {el} );
					var art = {};
					art.type = "Feature";
					art.properties = {}
					art.properties.type = el.type;
					art.properties.title = el.title.rendered;
					art.properties.description = el.content.rendered;
					art.properties.post_id = el.id;
					art.properties.location_id = el.acf.location_id;
					art.properties.location_name = el.acf.location.name;
					art.properties.location_address = el.acf.location.street_name+', '+el.acf.location.street_number;
					art.properties.location_number = el.acf.evento_num;
					art.geometry = {};
					art.geometry.type = "Point"
					art.geometry.coordinates = [el.acf.location.lng,el.acf.location.lat];
					i++;
					features.push(art);
				});

				geoJSON.features = features;
				CAWgeoJSON = geoJSON;
				console.debug(CAWgeoJSON)
				generateMapbox();
			}
	);

});
// THE MAP BOX ENDS HERE
// __________________________



// THE PAGES
// __________________________

const menuDivName = 'primary-menu';
const MenuDiv = document.getElementById(menuDivName);
const TabDivName = 'caw-content';
const TabDiv = document.getElementById(TabDivName);
const TabContainerName = 'caw-tabcontainer';
const TabContainer = document.getElementById(TabContainerName);

// THE MENU

// hide header, close caw-content and reset map if menu is open
document.querySelector('.menu-toggle').addEventListener('click',()=>{
	TabContainer.innerHTML = '<div class="loading-div"><div class="loading-anim"></div></div>';
	document.getElementById('masthead').classList.toggle('hidden')
	document.getElementById('masthead').classList.remove('compact');
	TabDiv.classList = '';
	map.flyTo({
		center: BaseCoords,
		essential: true,
		zoom:14,
		duration: 1000
	});
})
// move language switcher inside main menu
let langswitch = document.getElementById('lang-switcher');
var fragment = document.createDocumentFragment();
fragment.appendChild(langswitch);
MenuDiv.parentNode.appendChild(fragment);

Array.from(MenuDiv.children).forEach((el) => {
	let itemID = el.firstChild.dataset.postid;
	let lang = el.firstChild.dataset.lang;
	let divType = el.classList.contains('fullDiv')?'full':'normal';
	el.firstChild.addEventListener('click', (e) => {
		e.preventDefault();
		LoadItInTheDiv(itemID, '',divType,lang);
		el.firstChild.classList.add('current');
		// close menu
		document.getElementById('site-navigation').classList.remove('toggled');
		document.getElementById('masthead').classList = 'site-header compact';
	}, false)


	//console.debug(itemID, divType);
	//el.firstChild.removeAttribute('href');
})


// THE PAGE TAB
document.querySelector('.close-tabcontainer').addEventListener('click', () => {
	TabDiv.classList = '';
	TabContainer.classList.remove('visible');
	document.getElementById('masthead').classList.remove('compact');
	map.flyTo({
		center: BaseCoords,
		essential: true,
		zoom:14,
		duration: 1000
	});
})


async function getPostsFromWp(urlRequest) {
	try {
		const response = await fetch( urlRequest )
		const data = await response.json()
		return data
	} catch ( e ) {
		console.error( e )
	}
}


let resultFromWP = [];
const LoadItInTheDiv = (itemID, postType, divType, lang) => {
	TabDiv.classList = '';
	TabContainer.classList.remove('visible');
	Array.from(MenuDiv.children).forEach((el) => {
		el.firstChild.classList.remove('current');
	});

	if (itemID == 0) { // archivio artisti by nearest in time
		urlRequest = WPREST_Base+'/posts?per_page=99'
	} else if (itemID == 12) { // archivio eventi by nearest in time
		urlRequest = WPREST_Base+'/eventi?lang=23&per_page=99'
	} else if (itemID == 76) { // [eng] archivio eventi by nearest in time
		urlRequest = WPREST_Base+'/eventi?lang=24&per_page=99'
	} else {
		postType = (postType == '') ? 'pages' : postType;
		urlRequest = WPREST_Base+'/'+postType+"/"+itemID;
	}
	console.debug(urlRequest);

	setTimeout(() => {
		TabContainer.innerHTML = '<div class="loading-div"><div class="loading-anim"></div></div>';
	},100)

	let TabContent = '';
	
	
	const resultFromWP = getPostsFromWp(urlRequest);
	resultFromWP.then( 
		CAWdata => {
			console.debug( typeof( CAWdata ) , CAWdata );

			if (itemID == 12 || itemID == 76) { 
				// LISTING "EVENTI" (by nearest start date):
				// sort by the acf.evento_date_start field
				CAWdata.sort((x, y) => {
				     x = new Date(x.acf.evento_date_start),
				      y = new Date(y.acf.evento_date_start);
				    return x - y;
				});
				// testatina x listing eventi extra:
				if (itemID == 12) {
					TabContent += ` <h2 class="title-tabcontent heading-line">Eventi</h2>`;
				}
				if (itemID == 76) {
					TabContent += ` <h2 class="title-tabcontent heading-line">Events</h2>`;
				}
				Object.values(CAWdata).forEach(el => {
					let EVdate = el.acf.evento_date_start!='' ? new Date(el.acf.evento_date_start).getDate() : 'TBA';
					let EVMonth = new Date(el.acf.evento_date_start).getMonth() + 1;
					let paddedMonth = '';
					if (el.acf.evento_date_start!='') {
						paddedMonth = EVMonth<=9 ? ('0'+EVMonth).slice(-2) : EVMonth;
					}
					TabContent += `
						<div class="caw-listing-item caw listing-artisti" id="${el.slug}" data-position-lng="${el.acf.evento_location.lng}" data-position-lat="${el.acf.evento_location.lat}">
							<time class="time-tabcontent">${EVdate}.${paddedMonth}</time>
							<h2 class="title-tabcontent">${el.title.rendered}</h2>
							<small class="info-tabcontent">${el.acf.evento_location.name} - ${el.acf.evento_location.street_name}, ${el.acf.evento_location.street_number}</small>
							<div class="content-tabcontent">${el.content.rendered}</div>
						</div>
					`;
				});

			}
			else if (itemID == 0) {
			// LISTING "ARTISTI" (totally random :D ):
			// TODO: ENG VERSION!!!
				Object.values(CAWdata).forEach(el => {
					// console.debug(el);
					const EVPlace_id = el.acf.location;
					const EVPlace_data = getPostsFromWp(WPREST_Base+'/locations/?include='+EVPlace_id);
					EVPlace_data.then( EVPdata => {
						console.debug({EVPdata});
						TabContent += `
							<div class="caw-listing-item caw listing-artisti" id="${el.slug}" data-position-lng="${EVPdata[0].acf.location.lng}" data-position-lat="${EVPdata[0].acf.location.lat}">`;
						TabContent += `
							<h2 class="title-tabcontent">${el.title.rendered}</h2>`;
						EVPdata.forEach((el) => {
							TabContent += `<a class="info-tabcontent" href="javascript:map.flyTo({center: [(${el.acf.location.lng} - ${ShiftMap}),${el.acf.location.lat}],essential: true,zoom:17,duration: 2000});"><small>${el.acf.location_id}. ${el.title.rendered} »</small></a>`;
						});
						TabContent += `
								<div class="content-tabcontent">${el.content.rendered}</div>
							</div>
						`;
						TabContainer.innerHTML = TabContent;
					});
				})
			} 
			else { // SIMPLE POSTS/PAGES:
					TabContent += `
						<h2 class="title-tabcontent heading-line">`+CAWdata.title.rendered+`</h2>
						<div class="content-tabcontent">`+CAWdata.content.rendered+`</div>
					`;
			}
			//console.info(TabContent, divType);
			TabContainer.innerHTML = TabContent;
		}
	);
	setTimeout(() => {
		TabDiv.classList.add('open',divType);
		document.getElementById('masthead').classList.add('compact');
	},500);
	setTimeout(() => {
		TabContainer.classList.add('visible');
	},1000);
}