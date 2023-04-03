// THE MAP BOX
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
	const popup = new mapboxgl.Popup({ 
			anchor: 'left', 
			offset: [20, 0], 
			className: 'caw-popup' ,
			closeButton: false,
			maxWidth: '400px'
		})
		.setLngLat(feature.geometry.coordinates)
		.setHTML(
			`<h3>${feature.properties.title}, ${feature.properties.description}</h3>`
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

// THE PAGE TAB
const Baseurl = document.location.hostname.includes('localhost','meuro.dev') ? '/cremona-artweek' : '/';
const menuDivName = 'primary-menu';
const MenuDiv = document.getElementById(menuDivName);
const TabDivName = 'caw-content';
const TabDiv = document.getElementById(TabDivName);

Array.from(MenuDiv.children).forEach((el) => {
	let itemID = el.firstChild.dataset.postid;
	let divType = el.firstChild.classList.contains('fullDiv')?'full':'normal';
	el.firstChild.addEventListener('click', (e) => {
		e.preventDefault();
		LoadItInTheDiv(itemID, divType);
	}, false)


	//console.debug(itemID, divType);
	//el.firstChild.removeAttribute('href');
})

async function getPostsFromWp() {
	try {
		const response = await fetch( urlRequest )
		const data = await response.json()
		return data
	} catch ( e ) {
		console.error( e )
	}
}

const LoadItInTheDiv = (itemID, divType) => {
	TabDiv.classList.remove('open',divType);
	urlRequest = Baseurl+'/wp-json/wp/v2/pages/'+itemID;
	let TabContent = '<div class="close-tabcontent"></div>';
	TabDiv.innerHTML = TabContent;
	
	
	const resultFromWP = getPostsFromWp();
	resultFromWP.then( 
		data => {
			// console.log( data ) 
			TabContent += `
			<div class="tabcontent">
				<h2 class="title-tabcontent">`+data.title.rendered+`</h2>
				<div class="content-tabcontent">`+data.content.rendered+`</div>
			</div>
			`;
			console.debug(TabContent, divType);
			TabDiv.innerHTML = TabContent;
		}
	);
	setTimeout(() => {
		TabDiv.classList.add('open',divType);
		document.querySelector('.close-tabcontent').addEventListener('click', () => {
		TabDiv.classList.remove('open',divType);
	})
	},500);
	//console.debug(TabContent, divType);
}