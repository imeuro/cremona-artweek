const Baseurl = ['localhost','meuro.dev'].includes(window.location.hostname) ? '/cremona-artweek' : '';
const WPREST_Base = Baseurl+'/wp-json/wp/v2';
const current_lang = document.body.dataset.lang;
let locationsList = getPostsFromWp(WPREST_Base+'/locations?per_page=99');
var CAWgeoJSON = [];
let BaseCoords = window.innerWidth<600 ? [10.021,45.139] : [10.020, 45.134];
let BaseZoom = window.innerWidth<600 ? 12.85 : 13.85;
let map = '';
let ShiftMap = window.innerWidth<600 ? 0 : 0.0015;
let art_display = [];

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
				anchor: 'top-left',
				offset: [20, -30],
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
				console.debug({feature});
				readmorelink = feature.properties.post_id;
				
				coords = feature.geometry.coordinates;
				// let EVPlace = feature.properties.location_address;

				// Create a popup, specify its options 
				// and properties, and add it to the map.
				const setPopupContent = () => {
					console.debug('art_display',art_display);
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
						console.debug({artists})
					}
				}
				get_artists_for_location_id ( feature, readmorelink, setPopupContent );
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

function get_locations_for_artists_in_list ( CAWdata, callback ) {
	//recupera i dati delle location (ho solo l'ID del post type location in CAWdata)
	const EVPlace_data = getPostsFromWp(WPREST_Base+'/locations/?_fields=acf.location_id,acf.location,id,slug,title&per_page=99');
		EVPlace_data.then( EVPdata => {
			console.debug('trovo listone locations (EVPdata): ',EVPdata);
			//for (let k = 0; k < CAWdata.length; k++) {
			for (let k = 0; k < CAWdata.length; k++) {
				const EVPlace_id = CAWdata[k].acf.location;
				console.debug('cerco locations for '+CAWdata[k].title.rendered+' con id: '+EVPlace_id);
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
				console.debug(CAWdata[k]);
			}						
		}).then( callback );
}

function get_artists_for_location_id ( CAWdata, id, callback ) {
	// query all posts (Artists) with acf 'location_id' == CAWdata.acf.location_id
	console.debug(id);
	art_display=[];
	const ARThere_data = getPostsFromWp(WPREST_Base+'/posts/?_fields=acf.location,acf.testo_eng,slug,title,content&per_page=99');
	let i = 0;
	ARThere_data.then( heredata => {
		heredata.forEach((el) => {
			if (el.acf.location.includes(id)) {
				art_display[i]={};
				// console.debug(CAWdata.id,el);
				art_display[i].slug = el.slug;
				art_display[i].title = el.title.rendered;
				art_display[i].content = current_lang == 'en' ? el.acf.testo_eng : el.content.rendered;
				i++;
			}
		});
	}).then( callback );
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

function getlocation_post_id_from_location_number( num ) {
	// ... servirà poi per i QRCODE
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
})


// METEO IN SIDEBAR
function printCurrentWeather( target ) {
	//load the icons css
	let OWiconsCSS = document.createElement('link');
	OWiconsCSS.id   = 'OWicons-css';
    OWiconsCSS.rel  = 'stylesheet';
    OWiconsCSS.type = 'text/css';
    OWiconsCSS.href = Baseurl+'/wp-content/themes/caw_2023/assets/css/open-weather-icons.css';
    OWiconsCSS.media = 'all';
    document.head.appendChild(OWiconsCSS);

    // read and compose infos
	CAWweather = localStorage.getItem("CAW-meteo-situa");
	const w = JSON.parse(CAWweather).value;
	console.debug(CAWweather);
	CAWsitua = `
		<span class="weather-loc">${w.name}</span>
		<span class="weather-ico"><i class="owi owi-${w.weather[0].icon}"></i></span>
		<span class="weather-temp">${Math.round( w.main.temp )}&deg;</span>
		<span class="weather-desc">${w.weather[0].description}</span>
	`;
	let wCont = document.createElement('div');
	wCont.id='weather-situa';
	wCont.innerHTML = CAWsitua;
	target.after(wCont);
}

const apiURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+BaseCoords[1]+'&lon='+BaseCoords[0]+'&lang='+current_lang+'&units=metric&appid=e32dcab669abc89d3e05052b0d643bab';
let CAWweather = localStorage.getItem("CAW-meteo-situa");
// al limite posso fare che da mobile gira solo se aprono il menu...
if ( CAWweather === null || Object.keys(CAWweather).length === 0 ) {
	CAWweather = getPostsFromWp( apiURL );
	CAWweather.then( gotCAWweather => {
		console.debug('scrivo LocalStorage');
		setLocalStorageWithExpiry( "CAW-meteo-situa", gotCAWweather, 21600000 ) // 6 hours
	}).then( () => { printCurrentWeather(langswitch); } );
} else {
	printCurrentWeather(langswitch)
}






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
				let TabTitle = current_lang == 'en' ? 'Events' : 'Eventi';
				TabContent += ` <h2 class="title-tabcontent heading-line">${TabTitle}</h2>`;

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
					let EVend = new Date(el.acf.evento_date_end);
					//console.debug(EVend);
					let EVend_day = el.acf.evento_date_end!='' ? EVend.getDate() : '';
					let EVend_Month = EVend.getMonth() + 1;
					let EVend_paddedMinutes = EVend.getMinutes()<=9 ? ('0'+EVend.getMinutes()).slice(-2) : EVend.getMinutes();
					let EVend_time = EVend.getHours() + ':' + EVend_paddedMinutes;
					let EVend_paddedMonth = '';
					if (el.acf.evento_date_end!='') {
						EVend_paddedMonth = EVend_Month<=9 ? ('0'+EVend_Month).slice(-2) : EVend_Month;
					}
					let EVend_date = EVstart_date!=EVend_day ? EVend_day + '.' + EVend_paddedMonth + ' ' : '';

					let engtitle = el.acf.testo_eng.substring(
					    el.acf.testo_eng.indexOf("<h3>") + 4, 
					    el.acf.testo_eng.lastIndexOf("</h3>")
					);
					let engtext = '<p>'+el.acf.testo_eng.replace(engtitle,'')+'</p>';

					let event_content = current_lang == 'en' ? engtext : el.content.rendered;
					let event_title = current_lang == 'en' ? engtitle : el.title.rendered;

					TabContent += `
						<div class="caw-listing-item caw listing-artisti" id="${el.slug}" data-position-lng="${el.acf.evento_location.lng}" data-position-lat="${el.acf.evento_location.lat}">
							<time class="time-tabcontent">${EVstart_date}.${EVstart_paddedMonth} ${EVstart_time}-${EVend_date}${EVend_time}</time>
							<h2 class="title-tabcontent">${event_title}</h2>
							<small class="info-tabcontent">${el.acf.evento_location.street_name}, ${el.acf.evento_location.street_number}</small>
							<div class="content-tabcontent">${event_content}</div>
						</div>
					`;
				});
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
					TabContent += ` <h2 class="title-tabcontent heading-line">${TabTitle}</h2>`;
					Object.values(CAWdata).forEach(el => {
						const content_tabcontent = (itemID == 500 && el.acf.testo_eng) ? '<p>'+el.acf.testo_eng+'</p>' : el.content.rendered;

						TabContent += `
							<div class="caw-listing-item caw listing-artisti" id="${el.slug}">`;
						TabContent += `
							<h2 class="title-tabcontent">${el.title.rendered}</h2>`;
						Array.from(el.location_details).forEach(e => {
							TabContent += `<span><a class="info-tabcontent" data-position-lng="${e.lng}" data-position-lat="${e.lat}" href="javascript:LoadItInTheDiv(${e.post_id},'locations','HalfDiv',current_lang);" onclick="map.flyTo({center: [(${e.lng} - ${ShiftMap}),${e.lat}],essential: true,zoom:17,duration: 2000});">🔴 ${e.id}. ${e.name}</a></span>`;
						})
						TabContent += `	</div>`;
						
						Art_done++;
						if (Art_done == CAWdata.length) {
							console.debug('All artists processed.');
							TabContainer.innerHTML = TabContent;
							// localStorage.setItem('CAWARTdata', JSON.stringify(CAWdata));
							// localStorage.setItem('CAWARTdata', '');
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
			else { // LOCATIONS & SIMPLE POSTS/PAGES:
				const content_tabcontent = (current_lang == 'en' && CAWdata.acf.testo_eng) ? CAWdata.acf.testo_eng : CAWdata.content.rendered;
				//console.debug(CAWdata);
				if (CAWdata.acf.location_id) {
					// 👉 LOCATIONS
					get_artists_for_location_id (CAWdata, CAWdata.id, printLocationsTab);

					function printLocationsTab () {
						console.debug(art_display.length+' artists displaying here', art_display);
						TabContent += `
							<h2 class="title-tabcontent heading-line">${CAWdata.acf.location_id}. ${CAWdata.title.rendered}</h2>
							<p class="small-tabcontent">
								<span style="margin-bottom:12px;">${CAWdata.acf.location.street_name}, ${CAWdata.acf.location.street_number}</span>
								<span>`;
						for (let i = 0; i < art_display.length; i++) {
							TabContent += `
								<a href="javascript:;" title="info su ${art_display[i].title}" onclick="document.getElementById('artist-${art_display[i].slug}').scrollIntoView({behavior: 'smooth'});">${art_display[i].title}</a>`
							if (i < art_display.length-1) {
								TabContent += '<br/>';
							}
						}
						TabContent += `</span>
							</p>
							<div class="content-tabcontent">${content_tabcontent}</div>`;
							for (let i = 0; i < art_display.length; i++) {
							TabContent += `
								<div class="content-tabcontent content-artdisplay" id="artist-${art_display[i].slug}">
									${art_display[i].content}
								</div>`;
							}
						TabContainer.innerHTML = TabContent;

					}
					
				} else { 
					// 👉 SIMPLE POSTS/PAGES:
					TabContent += `
						<h2 class="title-tabcontent heading-line">${CAWdata.title.rendered}</h2>
						<div class="content-tabcontent">${content_tabcontent}</div>
					`;
					TabContainer.innerHTML = TabContent;

				}
				
			}
			TabDiv.scrollTo(0,0);
			
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