const Baseurl = ['localhost','meuro.dev'].includes(window.location.hostname) ? '/cremona-artweek' : '';
const WPREST_Base = Baseurl+'/wp-json/wp/v2';
const current_lang = document.body.dataset.lang;
let locationsList = getPostsFromWp(WPREST_Base+'/locations?per_page=99');
var CAWgeoJSON = [];
let BaseCoords = window.innerWidth<600 ? [10.021,45.139] : [10.020, 45.134];
let BaseZoom = window.innerWidth<600 ? 12.85 : 14.15;
let map = '';
let ShiftMap = window.innerWidth<600 ? 0 : 0.0015;

// THE MAP BOX
const generateMapbox = () => {
	mapboxgl.accessToken = 'pk.eyJ1IjoibWV1cm8iLCJhIjoiY2xmcjA2ZDczMDEwYTQzcWZwZXk4dmpvdSJ9.YHkGCdl-D6YkWDJbNGOBEQ';
	
	map = new mapboxgl.Map({
		container: 'caw-mapbox', // container ID
		style: 'mapbox://styles/meuro/clg4t7v1e004p01mpehknvnkd', // style URL
		center: BaseCoords, // starting position [lng, lat]
		zoom: BaseZoom, // starting zoom
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
				//console.debug({feature})
				readmorelink = feature.properties.post_id;
				coords = feature.geometry.coordinates;
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
			 	LoadItInTheDiv(readmorelink,'locations','HalfDiv',current_lang);
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

	locationsList.then( 
			ARTdata => {
				var features = [];
				var geoJSON = {};
				let i = 1;
				geoJSON.type = 'FeatureCollection';
				Object.values(ARTdata).forEach(el => {
					// console.debug( {el} );
					var art = {};
					art.type = "Feature";
					art.properties = {}
					art.properties.type = el.type;
					art.properties.title = el.title.rendered;
					art.properties.description = el.content.rendered;
					art.properties.post_id = el.id;
					art.properties.testo_eng = el.acf.testo_eng;
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



// HELPER FUNCTIONS 
// __________________________

async function getPostsFromWp( urlRequest ) {
	try {
		const response = await fetch( urlRequest )
		const data = await response.json()
		return data
	} catch ( e ) {
		console.error( e )
	}
}

function setLocalStorageWithExpiry( key, value, ttl ) {
	const now = new Date()

	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	}
	localStorage.setItem(key, JSON.stringify(item))
}

function location_public2private( id ) {
	
}



// HELPER FUNCTIONS ENDS HERE
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
		zoom:BaseZoom,
		duration: 1000
	});
})
// move language switcher inside main menu
let langswitch = document.getElementById('lang-switcher');
var fragment = document.createDocumentFragment();
fragment.appendChild(langswitch);
MenuDiv.parentNode.appendChild(fragment);

MenuDiv.addEventListener('contextmenu', event => event.preventDefault());

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
let resultFromWP = [];
let TabContent = '';

const LoadItInTheDiv = (itemID, postType, divType, lang) => {
	TabDiv.classList = '';
	TabContainer.classList.remove('visible');
	Array.from(MenuDiv.children).forEach((el) => {
		el.firstChild.classList.remove('current');
	});

	if (itemID == 498 || itemID == 500) { // archivio artisti by nearest in time
		urlRequest = WPREST_Base+'/posts?orderby=date&order=desc&per_page=99'
	} else if (itemID == 12 || itemID == 76) { // [eng] archivio eventi by nearest in time
		urlRequest = WPREST_Base+'/eventi?per_page=99'
	} else {
		postType = (postType == '') ? 'pages' : postType;
		urlRequest = WPREST_Base+'/'+postType+"/"+itemID;
	}
	console.debug(urlRequest);

	setTimeout(() => {
		TabContainer.innerHTML = '<div class="loading-div"><div class="loading-anim"></div></div>';
	},100)

	
	
	// GET THE CONTENT FROM WP
	const resultFromWP = getPostsFromWp(urlRequest);
	resultFromWP.then( 
		CAWdata => {
			console.debug( 'CAWdata:' , CAWdata );
			TabContent = '';

			if (itemID == 12 || itemID == 76) { 
				// 👉 LISTING "EVENTI" (by nearest start date):
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
				TabContainer.innerHTML = TabContent;
			}
			else if (itemID == 498 || itemID == 500) {
				// 👉 LISTING "ARTISTI" ( ordered by name alphabetically ):
				// TODO: LOCALSTORAGE w/ expiry date!!

				var Art_todo = 0;
				var Art_done = 0;

				// 📌 SAVE DATA TO LOCALSTORAGE:
				let CAWARTdata = '';
				// CAWARTdata = localStorage.getItem('CAWARTdata');
				// console.debug('CAWARTdata',CAWARTdata);

				// partendo da CAWDATA (o CAWlocalDATA), poi mi compongo TabContent
				const composeTabContent = () => {
					Object.values(CAWdata).forEach(el => {
						const content_tabcontent = (itemID == 500 && el.acf.testo_eng) ? '<p>'+el.acf.testo_eng+'</p>' : el.content.rendered;

						TabContent += `
							<div class="caw-listing-item caw listing-artisti" id="${el.slug}">`;
						TabContent += `
							<h2 class="title-tabcontent">${el.title.rendered}</h2>`;
						Array.from(el.location).forEach(e => {
							TabContent += `<a class="info-tabcontent" data-position-lng="${e.lng}" data-position-lat="${e.lat}" href="javascript:LoadItInTheDiv(${e.post_id},'locations','HalfDiv',current_lang);" onclick="map.flyTo({center: [(${e.lng} - ${ShiftMap}),${e.lat}],essential: true,zoom:17,duration: 2000});"><small>${e.id}. ${e.name} »</small></a>`;
						})
						//TabContent += `<div class="content-tabcontent">${content_tabcontent}</div>`;
						TabContent += `	</div>`;
						
						Art_done++;
						if (Art_done == CAWdata.length) {
							console.debug('All artists processed.');
							TabContainer.innerHTML = TabContent;
							// localStorage.setItem('CAWARTdata', JSON.stringify(CAWdata));
							localStorage.setItem('CAWARTdata', '');
						}
					});
				}



				if (!CAWARTdata || CAWARTdata=='') {
					//recupero dati mancanti con una serie di fetch posts
					Object.values(CAWdata).forEach(el => {

						const EVPlace_id = el.acf.location;
						const EVPlace_data = getPostsFromWp(WPREST_Base+'/locations/?include='+EVPlace_id);
						EVPlace_data.then( EVPdata => {
							// console.debug({EVPdata});
							let i = 0;
							//console.debug(Art_todo,CAWdata[Art_todo]);
							CAWdata[Art_todo]['location'] = [];
							EVPdata.forEach((el) => {
								EVlocation = {
									'name' : el.title.rendered,
									'post_id': el.id,
									'id' : el.acf.location_id,
									'lng' : el.acf.location.lng,
									'lat' : el.acf.location.lat
								}
								CAWdata[Art_todo]['location'][i] = EVlocation;
								i++;
							});
							// console.debug(Art_todo,CAWdata[Art_todo]);
							Art_todo++;
							if (Art_todo == CAWdata.length) {
								console.debug('All data rescued.');
								composeTabContent();
							}
							
						});
						
					});
				} else {
					CAWdata = JSON.parse(CAWARTdata);
					console.debug(CAWdata);
					composeTabContent();
				}

			} 
			else { // LOCATIONS & SIMPLE POSTS/PAGES:
				const content_tabcontent = (current_lang == 'en' && CAWdata.acf.testo_eng) ? CAWdata.acf.testo_eng : CAWdata.content.rendered;
				//console.debug(CAWdata);
				if (CAWdata.acf.location_id) {
					// 👉 LOCATIONS
					// query all posts with acf 'location_id' == CAWdata.acf.location_id
					const ARThere_data = getPostsFromWp(WPREST_Base+'/posts/?_fields=acf.location,acf.testo_eng,title,content&per_page=99');
					let i = 0;
					let art_display=[];
					ARThere_data.then( heredata => {
						heredata.forEach((el) => {
							if (el.acf.location.includes(CAWdata.id)) {
								art_display[i]={};
								// console.debug(CAWdata.id,el);
								art_display[i].title = el.title.rendered;
								art_display[i].content = current_lang == 'en' ? el.acf.testo_eng : el.content.rendered;
								i++;
							}
						});
					}).then(() => {
						console.debug(art_display.length+' artists displaying here', art_display);
						TabContent += `
							<h2 class="title-tabcontent heading-line">${CAWdata.acf.location_id}. ${CAWdata.title.rendered}</h2>
							<p class="small-tabcontent">
								<small>${CAWdata.acf.location.street_name}, ${CAWdata.acf.location.street_number}</small>
								<small>9:00 / 21:00</small>
								<small>`;
						for (let i = 0; i < art_display.length; i++) {
							TabContent += art_display[i].title;
							if (i < art_display.length-1) {
								TabContent += ', ';
							}
						}
						TabContent += `</small>
							</p>
							<div class="content-tabcontent">${content_tabcontent}</div>`;
							for (let i = 0; i < art_display.length; i++) {
							TabContent += `
								<div class="content-tabcontent content-artdisplay">
									<h3>${art_display[i].title}</h3>
									<div>${art_display[i].content}</div>
								</div>`;
							}
							`<div class="content-tabcontent content-artdisplay">
								${content_tabcontent}
							</div>
						`;
						TabContainer.innerHTML = TabContent;
					});
					
				} else { 
					// 👉 SIMPLE POSTS/PAGES:
					TabContent += `
						<h2 class="title-tabcontent heading-line">${CAWdata.title.rendered}</h2>
						<div class="content-tabcontent">${content_tabcontent}</div>
					`;
					TabContainer.innerHTML = TabContent;

				}
				
			}
			
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

document.querySelector('.close-tabcontainer').addEventListener('click', () => {
	TabDiv.classList = '';
	TabContainer.classList.remove('visible');
	document.getElementById('masthead').classList.remove('compact');
	map.flyTo({
		center: BaseCoords,
		essential: true,
		zoom:BaseZoom,
		duration: 1000
	});
})