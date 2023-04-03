<?php
/*
Plugin Name: Cremona Art Week 2023
Plugin URI: http://wordpress.org/plugins/hello-dolly/
Description: Cremona Art Week specific functions/capabilities.
Author: Mauro Fioravanzi
Version: 0
Author URI: http://meuro.dev/
*/

// Register Custom Post Type
function events_post_type() {

	$labels = array(
		'name'                  => _x( 'Eventi', 'Post Type General Name', 'text_domain' ),
		'singular_name'         => _x( 'Evento', 'Post Type Singular Name', 'text_domain' ),
		'menu_name'             => __( 'Eventi', 'text_domain' ),
		'name_admin_bar'        => __( 'Event0', 'text_domain' ),
		'archives'              => __( 'Archivio Eventi', 'text_domain' ),
		'attributes'            => __( 'Attributi evento', 'text_domain' ),
		'parent_item_colon'     => __( 'Parent Item:', 'text_domain' ),
		'all_items'             => __( 'All Eventi', 'text_domain' ),
		'add_new_item'          => __( 'Add New Evento', 'text_domain' ),
		'add_new'               => __( 'Aggiungi Evento', 'text_domain' ),
		'new_item'              => __( 'Nuovo Evento', 'text_domain' ),
		'edit_item'             => __( 'Edit Evento', 'text_domain' ),
		'update_item'           => __( 'Update Evento', 'text_domain' ),
		'view_item'             => __( 'View Evento', 'text_domain' ),
		'view_items'            => __( 'View Evento', 'text_domain' ),
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
		'description'           => __( 'Post Type EventiDescription', 'text_domain' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
		'taxonomies'            => array( 'category', 'post_tag' ),
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
	register_post_type( 'eventi', $args );

}
add_action( 'init', 'events_post_type', 0 );


// function my_acf_init() {
//     acf_update_setting('google_api_key', 'AIzaSyAntKVh1XNkFwRhPm8xzDVT3EuHseeo94E');
// }
// add_action('acf/init', 'my_acf_init');

add_filter('nav_menu_link_attributes', 'menu_post_ids');
function menu_post_ids($val){
 $postid = url_to_postid( $val['href'] );
 $val['data-postid'] = $postid;
 return $val;
}