<?php
/*
Plugin Name: Cremona Art Week 2024
Plugin URI: http://wordpress.org/plugins/hello-dolly/
Description: Cremona Art Week specific functions/capabilities.
Author: Mauro Fioravanzi
Version: 1.2024.1
Author URI: http://meuro.dev/
*/


// SIAMO NEL 2024!
function wpdocs_register_current_year() {
	add_menu_page(
		__( 'Ed. 2024', 'textdomain' ),
		'Ed. 2024',
		'edit_posts',
		'#',
		'',
		get_template_directory_uri() . '/assets/graphics/caw-marker-mini.svg"' ,
		1
	);
}
add_action( 'admin_menu', 'wpdocs_register_current_year' );

// CSS per area admin
function admin_style() {
	wp_enqueue_style('admin-styles', get_template_directory_uri().'/assets/css/admin.css');
}
add_action('admin_enqueue_scripts', 'admin_style');



// Change dashboard Posts to Artists
add_action( 'init', 'cp_change_post_object' );
function cp_change_post_object() {
    $get_post_type = get_post_type_object('post');
    $labels = $get_post_type->labels;
        $labels->name = 'Artisti';
        $labels->singular_name = 'Artista';
        $labels->add_new = 'Aggiungi Artista';
        $labels->add_new_item = 'Aggiungi Artista';
        $labels->edit_item = 'Modifica Artista';
        $labels->new_item = 'Artista';
        $labels->view_item = 'Visualizza Artista';
        $labels->search_items = 'Cerca Artisti';
        $labels->not_found = 'No Artisti found';
        $labels->not_found_in_trash = 'No Artisti found in Trash';
        $labels->all_items = 'Tutti gli Artisti';
        $labels->menu_name = 'Artisti';
        $labels->name_admin_bar = 'Artisti';
}



/**
 * Add custom taxonomies
 *
 * Additional custom taxonomies can be defined here
 * https://codex.wordpress.org/Function_Reference/register_taxonomy
 */




// Register Custom Post Type
function faville_post_type() {

	$labels = array(
		'name'                  => _x( 'Faville', 'Post Type General Name', 'text_domain' ),
		'singular_name'         => _x( 'Faville', 'Post Type Singular Name', 'text_domain' ),
		'menu_name'             => __( 'Faville', 'text_domain' ),
		'name_admin_bar'        => __( 'Faville', 'text_domain' ),
		'archives'              => __( 'Archivio Faville', 'text_domain' ),
		'attributes'            => __( 'Attributi Faville', 'text_domain' ),
		'parent_item_colon'     => __( 'Parent Item:', 'text_domain' ),
		'all_items'             => __( 'Tutte le Faville', 'text_domain' ),
		'add_new_item'          => __( 'Aggiungi Faville', 'text_domain' ),
		'add_new'               => __( 'Aggiungi Faville', 'text_domain' ),
		'new_item'              => __( 'Nuova Faville', 'text_domain' ),
		'edit_item'             => __( 'Edit Faville', 'text_domain' ),
		'update_item'           => __( 'Aggiorna Faville', 'text_domain' ),
		'view_item'             => __( 'Visualizza Faville', 'text_domain' ),
		'view_items'            => __( 'Visualizza Faville', 'text_domain' ),
		'search_items'          => __( 'Cerca Faville', 'text_domain' ),
		'not_found'             => __( 'Non trovato', 'text_domain' ),
		'not_found_in_trash'    => __( 'Non trovato in Trash', 'text_domain' ),
		'featured_image'        => __( 'Featured Image', 'text_domain' ),
		'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
		'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
		'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
		'insert_into_item'      => __( 'Insert into item', 'text_domain' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
		'items_list'            => __( 'Items list', 'text_domain' ),
		'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
		'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
	);
	$args = array(
		'label'                 => __( 'Faville', 'text_domain' ),
		'description'           => __( 'Post Type Faville Description', 'text_domain' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'custom-fields' ),
		'taxonomies'            => array( 'lang' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'page',
		'show_in_rest'          => true,
	);
	register_post_type( 'Faville', $args );

}
add_action( 'init', 'faville_post_type', 0 );


// Register Custom Post Type
function locations_post_type() {

	$labels = array(
		'name'                  => _x( 'Locations', 'Post Type General Name', 'text_domain' ),
		'singular_name'         => _x( 'Location', 'Post Type Singular Name', 'text_domain' ),
		'menu_name'             => __( 'Locations', 'text_domain' ),
		'name_admin_bar'        => __( 'Location', 'text_domain' ),
		'archives'              => __( 'Archivio Locations', 'text_domain' ),
		'attributes'            => __( 'Attributi Location', 'text_domain' ),
		'parent_item_colon'     => __( 'Parent Item:', 'text_domain' ),
		'all_items'             => __( 'Tutte le Locations', 'text_domain' ),
		'add_new_item'          => __( 'Aggiungi Location', 'text_domain' ),
		'add_new'               => __( 'Aggiungi Location', 'text_domain' ),
		'new_item'              => __( 'Nuova Location', 'text_domain' ),
		'edit_item'             => __( 'Edit Location', 'text_domain' ),
		'update_item'           => __( 'Aggiorna Location', 'text_domain' ),
		'view_item'             => __( 'Visualizza Location', 'text_domain' ),
		'view_items'            => __( 'Visualizza Location', 'text_domain' ),
		'search_items'          => __( 'Cerca Location', 'text_domain' ),
		'not_found'             => __( 'Non trovato', 'text_domain' ),
		'not_found_in_trash'    => __( 'Non trovato in Trash', 'text_domain' ),
		'featured_image'        => __( 'Featured Image', 'text_domain' ),
		'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
		'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
		'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
		'insert_into_item'      => __( 'Insert into item', 'text_domain' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
		'items_list'            => __( 'Items list', 'text_domain' ),
		'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
		'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
	);
	$args = array(
		'label'                 => __( 'Location', 'text_domain' ),
		'description'           => __( 'Post Type Location Description', 'text_domain' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'custom-fields' ),
		'taxonomies'            => array( 'lang' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'page',
		'show_in_rest'          => true,
	);
	register_post_type( 'Locations', $args );

}
add_action( 'init', 'locations_post_type', 0 );

// Register Custom Post Type
function spots_post_type() {

	$labels = array(
		'name'                  => _x( 'Spots', 'Post Type General Name', 'text_domain' ),
		'singular_name'         => _x( 'Spot', 'Post Type Singular Name', 'text_domain' ),
		'menu_name'             => __( 'Spots', 'text_domain' ),
		'name_admin_bar'        => __( 'Spot', 'text_domain' ),
		'archives'              => __( 'Archivio Spots', 'text_domain' ),
		'attributes'            => __( 'Attributi Spot', 'text_domain' ),
		'parent_item_colon'     => __( 'Parent Item:', 'text_domain' ),
		'all_items'             => __( 'Tutti gli Spots', 'text_domain' ),
		'add_new_item'          => __( 'Aggiungi Spot', 'text_domain' ),
		'add_new'               => __( 'Aggiungi Spot', 'text_domain' ),
		'new_item'              => __( 'Nuovo Spot', 'text_domain' ),
		'edit_item'             => __( 'Edit Spot', 'text_domain' ),
		'update_item'           => __( 'Update Spot', 'text_domain' ),
		'view_item'             => __( 'Visualizza Spot', 'text_domain' ),
		'view_items'            => __( 'Visualizza Spot', 'text_domain' ),
		'search_items'          => __( 'Cerca Spot', 'text_domain' ),
		'not_found'             => __( 'Non trovato', 'text_domain' ),
		'not_found_in_trash'    => __( 'Non trovato in Trash', 'text_domain' ),
		'featured_image'        => __( 'Featured Image', 'text_domain' ),
		'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
		'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
		'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
		'insert_into_item'      => __( 'Insert into item', 'text_domain' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
		'items_list'            => __( 'Items list', 'text_domain' ),
		'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
		'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
	);
	$args = array(
		'label'                 => __( 'Spot', 'text_domain' ),
		'description'           => __( 'Post Type Spot Description', 'text_domain' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'custom-fields' ),
		'taxonomies'            => array( 'lang' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'page',
		'show_in_rest'          => true,
	);
	register_post_type( 'spots', $args );

}
add_action( 'init', 'spots_post_type', 0 );


// Register Custom Post Type
function events_post_type() {

	$labels = array(
		'name'                  => _x( 'Eventi', 'Post Type General Name', 'text_domain' ),
		'singular_name'         => _x( 'Evento', 'Post Type Singular Name', 'text_domain' ),
		'menu_name'             => __( 'Eventi', 'text_domain' ),
		'name_admin_bar'        => __( 'Evento', 'text_domain' ),
		'archives'              => __( 'Archivio Eventi', 'text_domain' ),
		'attributes'            => __( 'Attributi evento', 'text_domain' ),
		'parent_item_colon'     => __( 'Parent Item:', 'text_domain' ),
		'all_items'             => __( 'Tutti gli Eventi', 'text_domain' ),
		'add_new_item'          => __( 'Aggiungi Evento', 'text_domain' ),
		'add_new'               => __( 'Aggiungi Evento', 'text_domain' ),
		'new_item'              => __( 'Nuovo Evento', 'text_domain' ),
		'edit_item'             => __( 'Edit Evento', 'text_domain' ),
		'update_item'           => __( 'Update Evento', 'text_domain' ),
		'view_item'             => __( 'Visualizza Evento', 'text_domain' ),
		'view_items'            => __( 'Visualizza Evento', 'text_domain' ),
		'search_items'          => __( 'Search Evento', 'text_domain' ),
		'not_found'             => __( 'Non trovato', 'text_domain' ),
		'not_found_in_trash'    => __( 'Non trovato in Trash', 'text_domain' ),
		'featured_image'        => __( 'Featured Image', 'text_domain' ),
		'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
		'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
		'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
		'insert_into_item'      => __( 'Insert into item', 'text_domain' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
		'items_list'            => __( 'Items list', 'text_domain' ),
		'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
		'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
	);
	$args = array(
		'label'                 => __( 'Evento', 'text_domain' ),
		'description'           => __( 'Post Type Eventi Description', 'text_domain' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'custom-fields' ),
		'taxonomies'            => array( 'lang' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 6,
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'page',
		'show_in_rest'          => true,
	);
	register_post_type( 'eventi', $args );

}
add_action( 'init', 'events_post_type', 0 );


function my_acf_init() {
	acf_update_setting('google_api_key', 'AIzaSyAntKVh1XNkFwRhPm8xzDVT3EuHseeo94E');
}
add_action('acf/init', 'my_acf_init');

// NAVIGATION
function register_my_menu() {
register_nav_menu('lang-switcher', 'Lang Switcher' );
}
add_action( 'init', 'register_my_menu' );


add_filter('nav_menu_link_attributes', 'menu_post_ids', 90000, 1);
function menu_post_ids($val){
	//print_r($val);
	$postid = url_to_postid( $val['href'] );
	$lang = strpos($val['href'], '/en/') ? 'en' : 'it';
	//print_r("<br>".$postid);
	if ($val['target'] !== '_blank') {
		if ( $postid === 0) {
		// facciamolo andare a calci..
			$firstpart = get_site_url(get_current_blog_id()).'/'.$lang.'/';
			$cleanpath = str_replace($firstpart,'',$val['href']);
			$postidARR = get_page_by_path($cleanpath);
			//print_r(get_current_site());
			//echo "<br>".$firstpart." ____ ".$cleanpath;
			$postid = $postidARR->ID;
		}
		$val['data-postid'] = $postid;
		$val['data-lang'] = $lang;
	} else {
		$val['data-postid'] = 'external';
	}

	return $val;
}

// add_filter('nav_menu_css_class' , 'special_nav_class' , 10 , 2);
// function special_nav_class ($classes, $item) {
//   if (in_array('current-menu-item', $classes) ){
//     $classes[] = 'activeee ';
//   }
//   return $classes;
// }



$post_types =['locations', 'spots'];
foreach ($post_types as $post_type) {
	// Add meta your meta field to the allowed values of the REST API orderby parameter
	add_filter(
	    'rest_' . $post_type . '_collection_params',
	    function( $params ) {
			 $fields = ["location_id"];
			foreach ($fields as $key => $value) {
				$params['orderby']['enum'][] = $value;
			}
	        return $params;
	    },
	    10,
	    1
	);

	add_filter(
	    'rest_' . $post_type . '_query',
	    function ( $args, $request ) {
			 $fields = ["location_id"];
	        $order_by = $request->get_param( 'orderby' );
	        if ( isset( $order_by ) && in_array($order_by, $fields)) {
	            $args['meta_key'] = $order_by;
	            $args['orderby']  = 'meta_value_num'; // user 'meta_value_num' for numerical fields
	        }
	        return $args;
	    },
	    10,
	    2
	);
}