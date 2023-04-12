const Baseurl = ['localhost','meuro.dev'].includes(window.location.hostname) ? '/cremona-artweek' : '/';
let artistList = getPostsFromWp(Baseurl+'wp-json/wp/v2/artisti');
var CAWgeoJSON = [];
let map = '';

// THE MAP BOX
const generateMapbox = () => {
	mapboxgl.accessToken = 'pk.eyJ1IjoibWV1cm8iLCJhIjoiY2xmcjA2ZDczMDEwYTQzcWZwZXk4dmpvdSJ9.YHkGCdl-D6YkWDJbNGOBEQ';
	map = new mapboxgl.Map({
		container: 'caw-mapbox', // container ID
		style: 'mapbox://styles/meuro/clg4t7v1e004p01mpehknvnkd', // style URL
		center: [10.015,45.135], // starting position [lng, lat]
		zoom: 12.5, // starting zoom
		// cooperativeGestures: true,
	});

	map.addControl(new mapboxgl.NavigationControl());

}





document.addEventListener('DOMContentLoaded', () => {
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
				art.properties.description = el.acf.evento_note;
				art.properties.post_id = el.id;
				art.geometry = {};
				art.geometry.type = "Point"
				art.geometry.coordinates = [el.acf.evento_location.lng,el.acf.evento_location.lat];

				features.push(art);
			});

			geoJSON.features = features;
			CAWgeoJSON = geoJSON;
			// console.debug(CAWgeoJSON)

		}
).then(generateMapbox());


	map.on('load', () => {
		// JSON EXAMPLE @
		// https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
		// console.debug(CAWgeoJSON);

		map.addSource('places', {
			'type': 'geojson',
			'data': CAWgeoJSON
		}) 

		map.addLayer({
			'id': 'places',
			'type': 'circle',
			'source': 'places',
			'paint': {
				'circle-color': '#fff',
				'circle-radius': 10,
				'circle-stroke-width': 2,
				'circle-stroke-color': '#f00'
			}
		})

		const popup = new mapboxgl.Popup({ 
			anchor: 'left', 
			offset: [20, 10], 
			className: 'caw-popup' ,
			closeButton: false,
			maxWidth: '400px'
		})

		let readmorelink;
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
			/* 
			Create a popup, specify its options 
			and properties, and add it to the map.
			*/
			popup.setLngLat(feature.geometry.coordinates)
			.setHTML(
				`<p><a onclick="LoadItInTheDiv(${feature.properties.post_id},'${feature.properties.type}','HalfDiv');">${feature.properties.title}, ${feature.properties.description}<br><small>more info</a></small></p>`
			)
			.addTo(map);
		});

		map.on('mouseleave', 'places', () => {
			map.getCanvas().style.cursor = '';
			//popup.remove();
		});

		map.on('click', 'places', () => {
			LoadItInTheDiv(readmorelink,'artisti','HalfDiv');
		});
		 
	})

});



// THE PAGE TAB
const menuDivName = 'primary-menu';
const MenuDiv = document.getElementById(menuDivName);
const TabDivName = 'caw-content';
const TabDiv = document.getElementById(TabDivName);
const TabContainerName = 'caw-tabcontainer';
const TabContainer = document.getElementById(TabContainerName);

Array.from(MenuDiv.children).forEach((el) => {
	let itemID = el.firstChild.dataset.postid;
	let divType = el.classList.contains('fullDiv')?'full':'normal';
	el.firstChild.addEventListener('click', (e) => {
		e.preventDefault();
		LoadItInTheDiv(itemID, '',divType);
		el.firstChild.classList.add('current');
	}, false)


	//console.debug(itemID, divType);
	//el.firstChild.removeAttribute('href');
})

document.querySelector('.close-tabcontainer').addEventListener('click', () => {
	TabDiv.classList = '';
	TabContainer.classList.remove('visible');
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
const LoadItInTheDiv = (itemID, postType, divType) => {
	TabDiv.classList = ''
	TabContainer.classList.remove('visible');
	Array.from(MenuDiv.children).forEach((el) => {
		el.firstChild.classList.remove('current');
	});

	if (itemID == 0) { // archivio artisti by nearest in time
		urlRequest = Baseurl+'/wp-json/wp/v2/artisti'
	} else if (itemID == 12) { // archivio eventi by nearest in time
		urlRequest = Baseurl+'/wp-json/wp/v2/eventi'
	} else {
		postType = (postType == '') ? 'pages' : postType;
		urlRequest = Baseurl+'/wp-json/wp/v2/'+postType+"/"+itemID;
	}
	// let TabContent = '<div class="close-tabcontent"></div>';
	// TabDiv.innerHTML = TabContent;
	let TabContent = '';
	
	
	const resultFromWP = getPostsFromWp(urlRequest);
	resultFromWP.then( 
		CAWdata => {
			console.debug( typeof( CAWdata ) , CAWdata );

			if (postType == 'artisti') {
				let EVPlace = CAWdata.acf.evento_location.name ? CAWdata.acf.evento_location.name : CAWdata.acf.evento_location.street_name+', '+CAWdata.acf.evento_location.street_number;
				let EVdate = new Date(CAWdata.acf.evento_date_start);
				let EVMonth = new Date(CAWdata.acf.evento_date_start).getMonth() + 1;
				let paddedMonth = EVMonth<=9 ? ('0'+EVMonth).slice(-2) : EVMonth;
				TabContent += `
					<div class="caw-listing-item">
						<time class="time-tabcontent">`+EVdate.getDate()+`.`+paddedMonth+`</time>
						<h2 class="title-tabcontent">`+CAWdata.title.rendered+`</h2>
						<span class="info-tabcontent">`+EVPlace+`</span>
						<div class="content-tabcontent">`+CAWdata.content.rendered+`</div>
					</div>
				`;
			}

			else if (itemID == 12 || itemID == 0) { // LISTING "EVENTI" (by nearest start date):
				// sort by the acf.evento_date_start field
				CAWdata.sort((x, y) => {
				     x = new Date(x.acf.evento_date_start),
				      y = new Date(y.acf.evento_date_start);
				    return x - y;
				});

				Object.values(CAWdata).forEach(el => {
					//console.debug(el);
					let EVPlace = el.acf.evento_location.name ? el.acf.evento_location.name : el.acf.evento_location.street_name+', '+el.acf.evento_location.street_number;
					let EVdate = new Date(el.acf.evento_date_start);
					let EVMonth = new Date(el.acf.evento_date_start).getMonth() + 1;
					let paddedMonth = EVMonth<=9 ? ('0'+EVMonth).slice(-2) : EVMonth;
					TabContent += `
						<div class="caw-listing-item">
							<time class="time-tabcontent">`+EVdate.getDate()+`.`+paddedMonth+`</time>
							<h2 class="title-tabcontent">`+el.title.rendered+`</h2>
							<span class="info-tabcontent">`+EVPlace+`</span>
							<div class="content-tabcontent">`+el.content.rendered+`</div>
						</div>
					`;
				})
			} else { // SIMPLE POSTS/PAGES:
					TabContent += `
						<h2 class="title-tabcontent">`+CAWdata.title.rendered+`</h2>
						<div class="content-tabcontent">`+CAWdata.content.rendered+`</div>
					`;
			}
			//console.info(TabContent, divType);
			TabContainer.innerHTML = TabContent;
		}
	);
	setTimeout(() => {
		TabDiv.classList.add('open',divType);
	},500);
	setTimeout(() => {
		TabContainer.classList.add('visible');
	},1000);
}