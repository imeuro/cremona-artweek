const Edition = "";
// const Edition = "2024";
const Baseurl = ['localhost','meuro.dev'].includes(window.location.hostname) ? '/cremona-artweek' : 'https://www.cremona-artweek.com';
const WPREST_Base = Baseurl+'/'+Edition+'/wp-json/wp/v2';
const current_lang = document.body.dataset.lang;
// let locationsList = getPostsFromWp(WPREST_Base+'/locations?per_page=99');
var locationsList = getPostsFromWp(WPREST_Base+'/locations?_fields=acf,id,slug,title,content&orderby=location_id&order=asc&per_page=99');
var spotsList = getPostsFromWp(WPREST_Base+'/spots?_fields=acf,id,slug,title,content&per_page=99');
var artistList = getPostsFromWp(WPREST_Base+'/posts/?_fields=acf.location,slug,title&per_page=99');
var favilleList = getPostsFromWp(WPREST_Base+'/faville?_fields=acf,id,slug,title,content&per_page=99');
let GA4pageTitle = '';
var CAWgeoJSON_locations = [];
var CAWgeoJSON_spots = [];
let BaseCoords = window.innerWidth<600 ? [10.023,45.142] : [10.018, 45.137];
let BaseZoom = window.innerWidth<600 ? 13.25 : 14.60;
let map = '';
let ShiftMap = window.innerWidth<600 ? 0 : 0.0015;
let art_display = [];

// THE MAP BOX
const generateMapbox = () => {
	mapboxgl.accessToken = 'pk.eyJ1IjoibWV1cm8iLCJhIjoiY2xmcjA2ZDczMDEwYTQzcWZwZXk4dmpvdSJ9.YHkGCdl-D6YkWDJbNGOBEQ';
	
	map = new mapboxgl.Map({
		container: 'caw-mapbox', // container ID
		style: 'mapbox://styles/meuro/clg4t7v1e004p01mpehknvnkd?optimize=true', // style URL
		center: BaseCoords, // starting position [lng, lat]
		zoom: BaseZoom, // starting zoom
		glyphs: 'mapbox://fonts/meuro/OPS%20Placard%20Regular/0-255.pbf',
		// cooperativeGestures: true,
	});
	if (window.innerWidth>600) {
		map.addControl(new mapboxgl.NavigationControl(),'bottom-right');
	}
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
		console.debug('Locations: ',CAWgeoJSON_locations);

		const markers =[
		  {
		  	url: Baseurl+'/wp-content/themes/caw_2024/assets/graphics/caw-marker.png', 
		  	id: 'image_location'
		  },
		  {
		  	url: Baseurl+'/wp-content/themes/caw_2024/assets/graphics/caw-marker-spot.png', 
		  	id: 'image_spot'
		  },
		]

		Promise.all(
            markers.map(img => new Promise((resolve, reject) => {
                map.loadImage(img.url, function (error, res) {
                	if (error) throw error;
                    map.addImage(img.id, res)
                    resolve();
                })
            }))
        ).then(() => {

        	//console.debug('promise done');
        	
			map.addSource('locations', {
				'type': 'geojson',
				'data': CAWgeoJSON_locations
			}) 

			map.addLayer({
				'id': 'locations',
				'type': 'symbol',
				'source': 'locations',
				'minzoom': 10,
				'maxzoom': 20,
				'layout': {
					'icon-image': 'image_location',
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
				anchor: 'top-left',
				offset: [20, -30],
				className: 'caw-popup',
				closeButton: false,
				maxWidth: '400px',
			})

			let readmorelink;
			let coords = [];
			map.on('mouseenter', 'locations', (event) => {
				map.getCanvas().style.cursor = 'pointer';
				// If the user clicked on one of your markers, get its information.
				const features = map.queryRenderedFeatures(event.point, {
					layers: ['locations'] // replace with your layer name
				});
				if (!features.length) {
					return;
				}
				const feature = features[0];
				// console.debug({feature});
				readmorelink = feature.properties.post_id;

				coords = feature.geometry.coordinates;

				// Create a popup, specify its options 
				// and properties, and add it to the map.
				const setPopupContent = () => {
					console.debug('Artists for this location: ',art_display);
					let artists = '';
					if (window.innerWidth>600) {
						for (var i = 0; i < art_display.length; i++) {
							artists += art_display[i].title;
							if (i < art_display.length-1) {
								artists += '<br/>';
							}
						}
						popup.setLngLat(feature.geometry.coordinates)
						.setHTML(
							`<p>${feature.properties.title}<br><small style="line-height:8px; display:inline.block">${artists}</small></p>
							`
						)
						.addTo(map);
						//console.debug({artists})
					}
				}
				get_artists_for_location_id ( feature, readmorelink, setPopupContent );
			});

			map.on('mouseleave', 'locations', () => {
				map.getCanvas().style.cursor = '';
				popup.remove();
			});

			map.on('click', 'locations', () => {
			 	LoadItInTheDiv(readmorelink,'locations','HalfDiv',current_lang);
			 	map.flyTo({
					center: [(coords[0] - ShiftMap),coords[1]],
					essential: true,
					zoom:17,
					duration: 2000
				});

			});
			
		})
		.then(() => {
			// JSON EXAMPLE @
			// https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
			console.debug('Spots: ', CAWgeoJSON_spots);



			map.addSource('spots', {
				'type': 'geojson',
				'data': CAWgeoJSON_spots
			}) 

			map.addLayer({
				'id': 'spots',
				'type': 'symbol',
				'source': 'spots',
				'minzoom': 10,
				'maxzoom': 20,
				'layout': {
					'icon-image': 'image_spot',
					'icon-size': .85,
					'icon-allow-overlap': true,
					'icon-ignore-placement': true,
					'text-allow-overlap': true,
					'text-ignore-placement': true,
					'text-optional': true,
					//'text-field': ['get', 'location_id'],
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

			let readmorelink;
			let coords = [];
			map.on('mouseenter', 'spots', (event) => {
				map.getCanvas().style.cursor = 'pointer';
				// If the user clicked on one of your markers, get its information.
				const features = map.queryRenderedFeatures(event.point, {
					layers: ['spots'] // replace with your layer name
				});
				if (!features.length) {
					return;
				}
				const feature = features[0];
				//console.debug({feature});
				readmorelink = feature.properties.post_id;

				coords = feature.geometry.coordinates;

			});

			map.on('mouseleave', 'spots', () => {
				map.getCanvas().style.cursor = '';
			});

			map.on('click', 'spots', () => {
			 	LoadItInTheDiv(readmorelink,'spots','HalfDiv',current_lang);
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
				CAWgeoJSON_locations = geoJSON;
				// console.debug(CAWgeoJSON_locations)
			}
	);
	
	
	spotsList.then( 
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
				CAWgeoJSON_spots = geoJSON;
				console.debug(CAWgeoJSON_spots)
				
			}
	);
	
	

	let preflightcheck = setInterval(function () {
		if (typeof(mapboxgl) !== "undefined") {
			if (Object.keys(CAWgeoJSON_spots).length > 0 && Object.keys(CAWgeoJSON_locations).length > 0){
			//if ( Object.keys(CAWgeoJSON_locations).length > 0 ){ 
				generateMapbox();
				console.debug('now.')
				clearInterval(preflightcheck);
				return;
			}
			console.debug('not yet.')
		}
	}, 200);
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

function get_locations_for_artists_in_list ( CAWdata, callback ) {
	//recupera i dati delle location (ho solo l'ID del post type location in CAWdata)
	const EVPlace_data = getPostsFromWp(WPREST_Base+'/locations/?_fields=acf.location_id,acf.location,id,slug,title&per_page=99');
		EVPlace_data.then( EVPdata => {
			// console.debug('trovo listone locations (EVPdata): ',EVPdata);
			// console.debug('CAWdata: ',CAWdata);
			//for (let k = 0; k < CAWdata.length; k++) {
			for (let k = 0; k < CAWdata.length; k++) {
				const EVPlace_id = CAWdata[k].acf.location;
				if (EVPlace_id != null) {
					// console.debug('cerco locations for '+CAWdata[k].title.rendered+' con id: '+EVPlace_id);
					// per ogni EVPlace_id devo trovare in EVPdata i dati della location e poi li integro in CAWDATA[k]
					CAWdata[k].location_details=[];
					let f = 0;
					let ld = 0;
					Object.values(EVPlace_id).forEach(el => {
						//console.debug(el);
						for (var ld =0; ld < EVPdata.length; ld++) {
							//console.debug(e);
							if (EVPdata[ld].id === el) {
								// console.debug('trovato');
								let EVlocation = {
									'name' : EVPdata[ld].title.rendered,
									'post_id': EVPdata[ld].id,
									'id' : EVPdata[ld].acf.location_id,
									'lng' : EVPdata[ld].acf.location.lng,
									'lat' : EVPdata[ld].acf.location.lat
								}
								CAWdata[k].location_details[f] = EVlocation;
								f++;
								break;
							}
						}
					});
					// console.debug(CAWdata[k]);
				}
			}						
		}).then( callback );
}

function get_artists_for_location_id ( CAWdata, id, callback ) {
	// query all posts (Artists) with acf 'location_id' == CAWdata.acf.location_id
	// console.debug(id);
	art_display=[];
	fav_display=[];
	const ARThere_data = getPostsFromWp(WPREST_Base+'/posts/?_fields=id,acf.location,acf.testo_eng,slug,title,content&per_page=99');
	const FAVhere_data = getPostsFromWp(WPREST_Base+'/faville/?_fields=id,acf.location,acf.testo_eng,slug,title,content&per_page=99');
	let a = 0;
	let f = 0;
	ARThere_data.then( aheredata => {
		aheredata.forEach((el) => {
			if (el.acf.location.includes(id)) {
				art_display[a]={};
				// console.debug(CAWdata.id,el);
				art_display[a].id = el.id;
				art_display[a].slug = el.slug;
				art_display[a].title = el.title.rendered;
				art_display[a].content = current_lang == 'en' ? el.acf.testo_eng : el.content.rendered;
				a++;
			}
		});
	}).then(
		FAVhere_data.then( fheredata => {
			fheredata.forEach((el) => {
				if (el.acf.location.includes(id)) {
					fav_display[f]={};
					console.debug(CAWdata.id,el);
					fav_display[f].id = el.id;
					fav_display[f].slug = el.slug;
					fav_display[f].title = el.title.rendered;
					fav_display[f].content = current_lang == 'en' ? el.acf.testo_eng : el.content.rendered;
					f++;
				}
			});
		})
	).then( callback );
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

let found_location_data = null;
function QRcode2div( post_type, num ) {
	if (post_type == 'location' || post_type == 'luoghi') {
		const locations_data = getPostsFromWp(WPREST_Base+'/locations/?_fields=id,acf.location_id,acf.location.lat,acf.location.lng&per_page=99');
		locations_data.then( loc => {
			loc.forEach((el) => {
				if (el.acf.location_id == num) {
					found_location_data = {
						'id'  : el.id,
						'lat' : el.acf.location.lat,
						'lng' : el.acf.location.lng
					}
					//console.debug(num,found_location_id);
				}
			});
		}).then( () => {
			console.debug(num,found_location_data);
			if (found_location_data !== null) {
				LoadItInTheDiv(found_location_data.id,'locations','HalfDiv','en');
				setTimeout( () => {
					map.flyTo({
						center: [(found_location_data.lng - ShiftMap),found_location_data.lat],
						essential: true,
						zoom:17,
						duration: 2000
					})
				},2000)
			}
		})
	} else {
		LoadItInTheDiv(num,post_type,'HalfDiv','it');
	}
}

const evlist = ['hashchange','DOMContentLoaded'];
evlist.forEach((ev) => {
	document.addEventListener(ev, () => {
		let numlocation = location.hash.match(/^#([a-z]+)\/([0-9]+)$/);
		console.debug(numlocation,current_lang);
		if ( numlocation !== null ) {
			let post_type = numlocation[1];
			const hashnum = numlocation[2];
			post_type == 'artisti' ? post_type='posts' : post_type;
			const hashcallback = QRcode2div( post_type, hashnum );
		}
	});	
})


const formatACFText = (fieldName) => {
	let engtext = fieldName;
	let newengcontent = {};

	const engtitle = /<h3>(.*?)<\/h3>/g.exec(engtext);
	console.debug('engtitle -',engtitle);
	newengcontent.title = engtitle ? engtitle[1] : '';
	

	if (current_lang == 'en' && engtext) {
		newengcontent.text = engtext.replace(/(?:\n\n)/g, "</p><p>");
		newengcontent.text = newengcontent.text.replace(/(?:\r\n|\r|\n)/g, "<br>");
		if (newengcontent.title !== '') {
			newengcontent.text = '<p>'+newengcontent.text.replace("<h3>"+newengcontent.title+"</h3><br>",'')+'</p>';
			newengcontent.text = '<p>'+newengcontent.text.replace("<h3>"+newengcontent.title+"</h3>",'')+'</p>';
		} else {
			newengcontent.text = '<p>'+engtext+'</p>';
		}
	} else {
		newengcontent = engtext
	}

	//console.debug('engcontent: ', newengcontent);

	return newengcontent;
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

	if (TabDiv !== null && itemID !== 'external') {
		el.firstChild.addEventListener('click', (e) => {
			e.preventDefault();
			LoadItInTheDiv(itemID, '',divType,lang);
			el.firstChild.classList.add('current');
			// close menu
			document.getElementById('site-navigation').classList.remove('toggled');
			document.getElementById('masthead').classList = 'site-header compact';
		}, false)
	}


	//console.debug(itemID, divType);
	//el.firstChild.removeAttribute('href');
})



// THE PAGE TAB
let resultFromWP = [];
let TabContent = '';

const LoadItInTheDiv = (itemID, postType, divType, lang) => {
	GA4pageTitle = postType;
	TabDiv.classList = '';
	TabContainer.classList.remove('visible');
	Array.from(MenuDiv.children).forEach((el) => {
		el.firstChild.classList.remove('current');
	});

	if (itemID == 498 || itemID == 500) { // archivio artisti by nearest in time
		GA4pageTitle = 'artisti';
		urlRequest = WPREST_Base+'/posts?orderby=date&order=desc&per_page=99'
	} else if (itemID == 1492 || itemID == 1494) { // archivio faville
		GA4pageTitle = 'faville';
		urlRequest = WPREST_Base+'/faville?_fields=id,acf,slug,title,content,type&orderby=date&order=desc&per_page=99';
	} else if (itemID == 1043 || itemID == 1045) { // archivio luoghi
		GA4pageTitle = 'luoghi';
		urlRequest = WPREST_Base+'/locations?_fields=acf.location_id,acf.location,id,slug,title&orderby=location_id&order=asc&per_page=99';
		urlArtists = WPREST_Base+'/posts/?_fields=acf.location,slug,title&per_page=99';
	} else if (itemID == 12 || itemID == 76) { // archivio eventi by nearest in time
		GA4pageTitle = 'eventi'
		urlRequest = WPREST_Base+'/eventi?per_page=99'
	} else {
		postType = (postType == '') ? 'pages' : postType;
		GA4pageTitle = 'pages';
		urlRequest = WPREST_Base+'/'+postType+"/"+itemID;
	}
	console.debug('------');
	console.debug('data:',{urlRequest});

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
				let TabTitle = current_lang == 'en' ? 'Events' : 'Eventi';
				TabContent += ` <h2 class="title-tabcontent heading-line">${TabTitle}</h2><br><br>`;

				Object.values(CAWdata).forEach(el => {
					// event start
					let EVstart = new Date(el.acf.evento_date_start);
					let EVstart_date = el.acf.evento_date_start!='' ? EVstart.getDate() : 'TBA';
					let EVstart_Month = EVstart.getMonth() + 1;
					let EVstart_paddedMinutes = EVstart.getMinutes()<=9 ? ('0'+EVstart.getMinutes()).slice(-2) : EVstart.getMinutes();
					let EVstart_time = EVstart.getHours() + ':' + EVstart_paddedMinutes;
					let EVstart_paddedMonth = '';
					if (el.acf.evento_date_start!='') {
						EVstart_paddedMonth = EVstart_Month<=9 ? ('0'+EVstart_Month).slice(-2) : EVstart_Month;
					}	
					// event end
					let EVend_date = '';
					let EVend_time = '';
					let EVend = new Date(el.acf.evento_date_end);
					if (!isNaN(EVend)) {
						//console.debug(EVend);
						let EVend_day = el.acf.evento_date_end!='' ? EVend.getDate() : '';
						let EVend_Month = EVend.getMonth() + 1;
						let EVend_paddedMinutes = EVend.getMinutes()<=9 ? ('0'+EVend.getMinutes()).slice(-2) : EVend.getMinutes();
						EVend_time = EVend.getHours() + ':' + EVend_paddedMinutes;
						let EVend_paddedMonth = '';
						if (el.acf.evento_date_end!='') {
							EVend_paddedMonth = EVend_Month<=9 ? ('0'+EVend_Month).slice(-2) : EVend_Month;
						}
						EVend_date = EVstart_date!=EVend_day ? EVend_day + '.' + EVend_paddedMonth + ' ' : '';
					} else {
						// console.debug('evento: data fine evento vuota/non validah.');
					}


					let event_en = formatACFText(el.acf.testo_eng);
					// console.debug(event_en);

					let event_content = current_lang == 'en' ? event_en.text : el.content.rendered;
					let event_title = (current_lang == 'en' && event_en.title !== '') ? event_en.title : el.title.rendered;

					console.debug(el);
					if (el.acf.evento_location === null) {
						el.acf.evento_location = 'TBD';
						if (el.acf.evento_location.street_number === null) { 
							el.acf.evento_location.street_number = 's/n';
						}
					} else if (el.acf.evento_location.street_number === null) { 
							el.acf.evento_location.street_number = 's/n';
					} else { 
					 	el.acf.evento_location.street_number = el.acf.evento_location.street_number;
					}

					TabContent += `
						<div class="caw-listing-item caw listing-artisti" id="${el.slug}" data-position-lng="${el.acf.evento_location.lng}" data-position-lat="${el.acf.evento_location.lat}">
							<time class="time-tabcontent">${EVstart_date}.${EVstart_paddedMonth} ${EVstart_time}-${EVend_date}${EVend_time}</time>
							<h2 class="title-tabcontent">${event_title}</h2>
							<small class="info-tabcontent">${el.acf.evento_location.street_name}, ${el.acf.evento_location.street_number}</small>
							<div class="content-tabcontent">${event_content}</div>
						</div>
					`;
				});

				console.debug('All events processed.');
				TabContainer.innerHTML = TabContent;
			}
			else if (itemID == 498 || itemID == 500) {
				// 👉 LISTING "ARTISTI" ( manually ordered by surname alphabetically ):
				// TODO: LOCALSTORAGE w/ expiry date!!

				var Art_todo = 0;
				var Art_done = 0;

				// 📌 SAVE DATA TO LOCALSTORAGE:
				let CAWARTdata = '';
				CAWARTdata = localStorage.removeItem('CAWARTdata');
				// CAWARTdata = localStorage.getItem('CAWARTdata');
				// console.debug('CAWARTdata',CAWARTdata);

				// partendo da CAWDATA (o CAWlocalDATA), poi mi compongo TabContent
				const composeTabContent = () => {
					let TabTitle = current_lang == 'en' ? 'Artists' : 'Artisti';
					TabContent += ` <h2 class="title-tabcontent heading-line">${TabTitle}</h2><br><br>`;
					Object.values(CAWdata).forEach(el => {
						//console.debug('el=',el);
						// const content_tabcontent = (el.acf.testo_eng) ? formatACFText(el.acf.testo_eng) : el.content.rendered;

						TabContent += `
							<div class="caw-listing-item caw listing-artisti" id="${el.slug}">`;
						TabContent += `
							<h2 class="title-tabcontent">
								<a href="javascript:LoadItInTheDiv(${el.id},'posts','HalfDiv',current_lang);" title="info su ${el.title.rendered}">${el.title.rendered}</a>
							</h2>`;

						// lista locations per ogni artista:
						Array.from(el.location_details).forEach(e => {
							TabContent += `<span><a class="info-tabcontent" data-position-lng="${e.lng}" data-position-lat="${e.lat}" href="javascript:LoadItInTheDiv(${e.post_id},'locations','HalfDiv',current_lang);" onclick="map.flyTo({center: [(${e.lng} - ${ShiftMap}),${e.lat}],essential: true,zoom:17,duration: 2000});"><img src="${Baseurl}/wp-content/themes/caw_2024/assets/graphics/caw-marker-mini.png" width="10" height="10" valign="middle" /> ${e.id}. ${e.name}</a></span>`;
						})
						TabContent += `	</div>`;
						
						Art_done++;
						if (Art_done == CAWdata.length) {
							console.debug('All artists processed.');
							TabContainer.innerHTML = TabContent;
						}
					});
				}

				if (!CAWARTdata || CAWARTdata=='') {
					get_locations_for_artists_in_list(CAWdata, composeTabContent);
				} else {
					CAWdata = JSON.parse(CAWARTdata);
					console.debug(CAWdata);
					composeTabContent();
				}

			} 			
			else if (itemID == 1492 || itemID == 1494) {
				// 👉 LISTING "FAVILLE" ( manually ordered by surname alphabetically ):
				// TODO: LOCALSTORAGE w/ expiry date!!

				var Art_todo = 0;
				var Art_done = 0;

				// 📌 SAVE DATA TO LOCALSTORAGE:
				let CAWARTdata = '';
				CAWARTdata = localStorage.removeItem('CAWARTdata');
				// CAWARTdata = localStorage.getItem('CAWARTdata');
				// console.debug('CAWARTdata',CAWARTdata);

				// partendo da CAWDATA (o CAWlocalDATA), poi mi compongo TabContent
				const composeTabContent = () => {
					let TabTitle = current_lang == 'en' ? 'Faville' : 'Faville';
					TabContent += ` <h2 class="title-tabcontent heading-line">${TabTitle}</h2><br><br>`;
					Object.values(CAWdata).forEach(el => {
						// console.debug('el=',el);
						// const content_tabcontent = (el.acf.testo_eng) ? formatACFText(el.acf.testo_eng) : el.content.rendered;

						TabContent += `
							<div class="caw-listing-item caw listing-artisti" id="${el.slug}">`;
						TabContent += `
							<a class="info-tabcontent" href="javascript:LoadItInTheDiv(${el.id},'faville','HalfDiv',current_lang);">
								<h2 class="title-tabcontent">${el.title.rendered}</h2>
							</a>`;
						Array.from(el.location_details).forEach(e => {
							TabContent += `<span><a class="info-tabcontent" data-position-lng="${e.lng}" data-position-lat="${e.lat}" href="javascript:LoadItInTheDiv(${e.post_id},'locations','HalfDiv',current_lang);" onclick="map.flyTo({center: [(${e.lng} - ${ShiftMap}),${e.lat}],essential: true,zoom:17,duration: 2000});"><img src="${Baseurl}/wp-content/themes/caw_2024/assets/graphics/caw-marker-mini.png" width="10" height="10" valign="middle" /> ${e.id}. ${e.name}</a></span>`;
						})
						TabContent += `	</div>`;
						
						Art_done++;
						if (Art_done == CAWdata.length) {
							console.debug('All faville processed.');
							TabContainer.innerHTML = TabContent;
						}
					});
				}

				if (!CAWARTdata || CAWARTdata=='') {
					get_locations_for_artists_in_list(CAWdata, composeTabContent);
				} else {
					CAWdata = JSON.parse(CAWARTdata);
					console.debug(CAWdata);
					composeTabContent();
				}

			} 
			else if (itemID == 1043 || itemID == 1045) {
				// 👉 LISTING "LOCATIONS":
				const artistList = getPostsFromWp(WPREST_Base+'/posts/?_fields=acf.location,slug,title&per_page=99');
				const favilleList = getPostsFromWp(WPREST_Base+'/faville/?_fields=acf.location,slug,title&per_page=99');
				artistList.then( artistList => {
					
					// console.debug('artistList',artistList);

					favilleList.then( favilleList => {

					
						let TabTitle = current_lang == 'en' ? 'Locations' : 'Luoghi';
						TabContent += ` <h2 class="title-tabcontent heading-line">${TabTitle}</h2><br /><br />`;


						// mi passo tutte le location id, e cerco in artistList chi ce l'ha (chi partecipa, insomma)
						CAWdata.forEach((loc) => {
							loc.artists = [];
							loc.faville = [];
							let i = 0;

							TabContent += `
								<div class="caw-listing-item caw listing-locations" id="${loc.slug}">`;
							TabContent += `
								<a class="info-tabcontent" data-position-lng="${loc.acf.location.lng}" data-position-lat="${loc.acf.location.lat}" href="javascript:LoadItInTheDiv(${loc.id},'locations','HalfDiv',current_lang);" onclick="map.flyTo({center: [(${loc.acf.location.lng} - ${ShiftMap}),${loc.acf.location.lat}],essential: true,zoom:17,duration: 2000});">
										<h2 class="title-tabcontent">${loc.acf.location_id}. ${loc.title.rendered}</h2>
								</a>`;

							// lista artisti per questa location:
							artistList.forEach((el) => {
								if (el.acf.location.includes(loc.id)) {
									// console.debug('element',el);
									loc.artists[i]={};
									loc.artists[i].id = el.id;
									loc.artists[i].slug = el.slug;
									loc.artists[i].title = el.title.rendered;
									TabContent += `<span><a href="javascript:LoadItInTheDiv(${loc.artists[i].id},'locations','HalfDiv',current_lang);"><img src="/cremona-artweek/wp-content/themes/caw_2024/assets/graphics/caw-marker-mini.png" width="10" height="10" valign="middle">&nbsp;&nbsp;${loc.artists[i].title}</a></span>`;
									i++;
								}	
				
							});

							// lista faville per questa location:
							favilleList.forEach((el) => {
								if (el.acf.location.includes(loc.id)) {
									// console.debug('element',el);
									loc.faville[i]={};
									loc.faville[i].id = el.id;
									loc.faville[i].slug = el.slug;
									loc.faville[i].title = el.title.rendered;
									TabContent += `<span><a href="javascript:LoadItInTheDiv(${loc.faville[i].id},'locations','HalfDiv',current_lang);"><img src="/cremona-artweek/wp-content/themes/caw_2024/assets/graphics/caw-marker-mini.png" width="10" height="10" valign="middle">&nbsp;&nbsp;${loc.faville[i].title}</a></span>`;
									i++;
								}	
				
							});

							//console.debug('loc:',loc);

							TabContent += `</div>`;


						});

						spotsList.then( spotsList => {
							if (Object.keys(spotsList).length > 0) {
								let TabTitle = current_lang == 'en' ? 'Other Locations' : 'Altre Locations';
								TabContent += ` <br /><br /><h2 class="title-tabcontent heading-line">${TabTitle}</h2><br /><br />`;


								console.debug(spotsList);
								spotsList.forEach((spot) => {
									TabContent += `
										<div class="caw-listing-item caw listing-locations" id="${spot.slug}">`;
									TabContent += `
										<p><img src="/cremona-artweek/wp-content/themes/caw_2024/assets/graphics/caw-marker-mini.png" width="10" height="10" valign="middle">&nbsp;&nbsp;<a class="info-tabcontent" data-position-lng="${spot.acf.location.lng}" data-position-lat="${spot.acf.location.lat}" href="javascript:LoadItInTheDiv(${spot.id},'spots','HalfDiv',current_lang);" onclick="map.flyTo({center: [(${spot.acf.location.lng} - ${ShiftMap}),${spot.acf.location.lat}],essential: true,zoom:17,duration: 2000});">
											<span>${spot.title.rendered}</span>
										</a></p>`;
								});
							}
						});
					})

				}).then( () => { 
					TabContainer.innerHTML = TabContent;
					console.debug('All locations processed.');
				});


			}
			else { // LOCATIONS & SIMPLE POSTS/PAGES:

				// 16/05/2024 nuovo metodo: si usa il separatore <!--nextpage--> all'interno del block editor principale sia per testo ita che per testo eng
				const content_split = CAWdata.content.rendered.split("<!--nextpage-->");
				console.debug(content_split.length,content_split);
				let content_tabcontent = '';
				if (content_split.length > 1) {
					content_tabcontent = (current_lang == 'en') ? content_split[1] : content_split[0];
				} else {
					content_tabcontent = (current_lang == 'en' && CAWdata.acf.testo_eng) ? formatACFText(CAWdata.acf.testo_eng).text : CAWdata.content.rendered;
				}

				//console.debug(CAWdata);
				if (CAWdata.acf.location_id) {
					// 👉 LOCATIONS
					get_artists_for_location_id (CAWdata, CAWdata.id, printLocationsTab);
					GA4pageTitle = 'location/'+CAWdata.acf.location_id;
					let content_orari = (current_lang == 'en') ? CAWdata.acf.orari_evento_en : CAWdata.acf.orari_evento_it;
					if (typeof(content_orari) === 'undefined') { content_orari = '-' };

					function printLocationsTab () {
						let backpageId = current_lang == 'it' ? 1043 : 1045;

						console.debug(art_display.length+' artists displaying here', art_display);
						console.debug(fav_display.length+' faville displaying here', fav_display);

						TabContent += `
							<h2 class="title-tabcontent">${CAWdata.acf.location_id}. ${CAWdata.title.rendered}</h2>
							<p class="small-tabcontent">
								<span>${content_orari}</span>
								<span style="margin-bottom:12px;">${CAWdata.acf.location.street_name}, ${CAWdata.acf.location.street_number}</span>
							</p>
							<hr class="spacerbar" />
							<div class="content-tabcontent">${content_tabcontent}</div>
							<a href="javascript:LoadItInTheDiv(${backpageId},'', 'HalfDiv', '${current_lang}')" class="scheda-back-btn"><span></span></a>
							`;


							for (let i = 0; i < art_display.length; i++) {
								TabContent += `
									<a href="javascript:LoadItInTheDiv(${art_display[i].id},'posts','HalfDiv',current_lang);" title="info su ${art_display[i].title}"><img src="/cremona-artweek/wp-content/themes/caw_2024/assets/graphics/caw-marker-mini.png" width="10" height="10" valign="middle"> ${art_display[i].title}</a>`
								if (i < art_display.length-1) {
									TabContent += '<br/>';
								}
							}
							for (let k = 0; k < fav_display.length; k++) {
								if (k < fav_display.length) {
									TabContent += '<br/>';
								}
								TabContent += `
									<a href="javascript:LoadItInTheDiv(${fav_display[k].id},'posts','HalfDiv',current_lang);" title="info su ${fav_display[k].title}"><img src="/cremona-artweek/wp-content/themes/caw_2024/assets/graphics/caw-marker-mini.png" width="10" height="10" valign="middle"> ${fav_display[k].title}</a>`
							}

						setTimeout(() => {
							TabContainer.innerHTML = TabContent;
						},100);	

					}
				} else if (CAWdata.acf.location_id === '') {
					// 👉 SPOTS
					let content_orari = (current_lang == 'en') ? CAWdata.acf.orari_evento_en : CAWdata.acf.orari_evento_it;
					let backpageId = current_lang == 'it' ? 1043 : 1045;
					if (typeof(content_orari) === 'undefined') { content_orari = '-' };
					TabContent += `
						<h2 class="title-tabcontent
						">${CAWdata.title.rendered}</h2>
						<p class="small-tabcontent">
							<span>${content_orari}</span>
							<span style="margin-bottom:12px;">${CAWdata.acf.location.street_name}, ${CAWdata.acf.location.street_number}</span>
						</p>
						<hr class="spacerbar" />
						<div class="content-tabcontent">${content_tabcontent}</div>
						<a href="javascript:LoadItInTheDiv(${backpageId},'', 'HalfDiv', '${current_lang}')" class="scheda-back-btn"><span></span></a>
					`;
					TabContainer.innerHTML = TabContent;
				} else if (CAWdata.type === 'faville') {
					// 👉 FAVILLE
					GA4pageTitle += '/faville/'+CAWdata.slug;
					let backpageId = current_lang == 'it' ? 1492 : 1494;
					TabContent += `
						<h2 class="title-tabcontent">${CAWdata.title.rendered}</h2>
						<p class="small-tabcontent empty"></p>
						<hr class="spacerbar" />
						<div class="content-tabcontent">${content_tabcontent}</div>
						<a href="javascript:LoadItInTheDiv(${backpageId},'', 'HalfDiv', '${current_lang}')" class="scheda-back-btn"><span></span></a>
					`;
					setTimeout(() => {

						TabContainer.innerHTML = TabContent;

						let picToExplode = document.querySelectorAll('.wp-block-media-text');
						Array.from(picToExplode).forEach((el)=>{
							el.addEventListener('click',(e)=>{
								el.classList.toggle('explode');
							})
						})

					},100);	
				} else { 
					// 👉 SIMPLE POSTS/PAGES:
					GA4pageTitle += '/'+CAWdata.slug;
					let backpageId = current_lang == 'it' ? 498 : 500;
					TabContent += `
						<h2 class="title-tabcontent">${CAWdata.title.rendered}</h2>`;
					if (CAWdata.type == 'post') {
						TabContent += `
						<p class="small-tabcontent empty"></p>
						`;
					}
					TabContent += `
						<hr class="spacerbar" />
						<div class="content-tabcontent">${content_tabcontent}</div>
					`;
					if (CAWdata.type == 'post') {
						TabContent += `
						<a href="javascript:LoadItInTheDiv(${backpageId},'', 'HalfDiv', '${current_lang}')" class="scheda-back-btn"><span></span></a>
						`;
					}

					setTimeout(() => {
						TabContainer.innerHTML = TabContent;
					},100);	
				}
				
			}
			TabDiv.scrollTo(0,0);
			
		}
	).then( () => {
		gtag('event', 'page_view', {
			page_title: GA4pageTitle+' - Cremona Contemporanea | Art Week',
			page_location: 'https://www.cremona-artweek.com/'+current_lang+'/'+GA4pageTitle,
			sub_section: current_lang,
		});
	});
	setTimeout(() => {
		TabDiv.classList.add('open',divType);
		document.getElementById('masthead').classList.add('compact');
	},500);
	setTimeout(() => {
		TabContainer.classList.add('visible');
	},1000);

}

const closeTab = document.querySelector('.close-tabcontainer');
if (closeTab!== null) {
	closeTab.addEventListener('click', () => {
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
}
