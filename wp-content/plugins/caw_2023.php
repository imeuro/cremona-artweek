<?php
/*
Plugin Name: Cremona Art Week 2023
Plugin URI: http://wordpress.org/plugins/hello-dolly/
Description: Cremona Art Week specific functions/capabilities.
Author: Mauro Fioravanzi
Version: 1.1.3
Author URI: http://meuro.dev/
*/


// Change dashboard Posts to Location
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
/*
function add_custom_taxonomies() {
  // Add new "Languages" taxonomy to Posts
  register_taxonomy('lang', '', array(
    // Hierarchical taxonomy (like categories)
    'hierarchical' => true,
    'show_in_rest' => true,
    // This array of options controls the labels displayed in the WordPress Admin UI
    'labels' => array(
      'name' => _x( 'Languages', 'taxonomy general name' ),
      'singular_name' => _x( 'Language', 'taxonomy singular name' ),
      'search_items' =>  __( 'Search Languages' ),
      'all_items' => __( 'All Languages' ),
      'parent_item' => __( 'Parent Language' ),
      'parent_item_colon' => __( 'Parent Language:' ),
      'edit_item' => __( 'Edit Language' ),
      'update_item' => __( 'Update Language' ),
      'add_new_item' => __( 'Add New Language' ),
      'new_item_name' => __( 'New Language Name' ),
      'menu_name' => __( 'Languages' ),
    ),
    // Control the slugs used for this taxonomy
    'rewrite' => array(
      'slug' => 'lang', // This controls the base slug that will display before each term
      'with_front' => false, // Don't display the category base before "/locations/"
      'hierarchical' => false // This will allow URL's like "/locations/boston/cambridge/"
    ),
  ));
}
//add_action( 'init', 'add_custom_taxonomies', 0 );
*/

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
 $postid = url_to_postid( $val['href'] );
 $lang = strpos($val['href'], '/en/') ? 'en' : 'it';
 if ( $postid === 0 && strpos($val['href'], '/en/') ) { 
 // facciamolo andare a calci..
 	$firstpart = pll_home_url('it').'en/';
 	$cleanpath = str_replace($firstpart,'',$val['href']);
 	$postidARR = get_page_by_path($cleanpath);
 	$postid = $postidARR->ID;
 }
 $val['data-postid'] = $postid;
 $val['data-lang'] = $lang;
 return $val;
}

// add_filter('nav_menu_css_class' , 'special_nav_class' , 10 , 2);
// function special_nav_class ($classes, $item) {
//   if (in_array('current-menu-item', $classes) ){
//     $classes[] = 'activeee ';
//   }
//   return $classes;
// }
