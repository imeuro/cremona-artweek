<?php
/**
 * caw_2024 functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package caw_2024
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.2024.22' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function caw_2024_setup() {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on caw_2024, use a find and replace
		* to change 'caw_2024' to the name of your theme in all the template files.
		*/
	load_theme_textdomain( 'caw_2024', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support( 'title-tag' );

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Primary', 'caw_2024' ),
		)
	);

	/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);


}
add_action( 'after_setup_theme', 'caw_2024_setup' );


/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function caw_2024_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'caw_2024' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'caw_2024' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'caw_2024_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function add_async_forscript($url)
{
    if (strpos($url, '#asyncload')===false)
        return $url;
    else
        return str_replace('#asyncload', '', $url)."' async='async";
}
add_filter('clean_url', 'add_async_forscript', 11, 1);

function add_defer_forscript( $tag, $handle, $src ) {
  $defer = array( 
  	'caw_2024-navigation',
    'caw_2024-mapbox'
  );
  if ( in_array( $handle, $defer ) ) {
     return '<script src="' . $src . '" defer type="text/javascript"></script>' . "\n";
  }
    
    return $tag;
} 
add_filter( 'script_loader_tag', 'add_defer_forscript', 10, 3 );

function caw_2024_scripts() {
	wp_enqueue_style( 'caw_2024-style', get_stylesheet_uri(), array(), _S_VERSION );
	wp_style_add_data( 'caw_2024-style', 'rtl', 'replace' );
    wp_enqueue_style( 'caw_2024-style-custom', get_template_directory_uri() . '/assets/css/caw.css', array(), _S_VERSION );

	if (is_home() || is_front_page()) {
		wp_enqueue_script( 'caw_2024-mapbox', 'https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.js', array(), _S_VERSION, true );
		wp_enqueue_style( 'caw_2024-mapbox', 'https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css', array(), _S_VERSION );
	}

	wp_enqueue_script( 'caw_2024-general', get_template_directory_uri() . '/assets/js/caw.js', array(), _S_VERSION, true );
	wp_enqueue_script( 'caw_2024-navigation', get_template_directory_uri() . '/assets/js/navigation.js', array(), _S_VERSION, true );

}
add_action( 'wp_enqueue_scripts', 'caw_2024_scripts' );


// mapbox libraries
// function caw_mapbox_assets() {
// 	wp_enqueue_script( 'caw_2024-mapboxx', 'https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.js#deferload', array(), _S_VERSION, true );
// 	wp_enqueue_style( 'caw_2024-mapboxx', 'https://api.mapbox.com/mapbox-gl-js/v2.14.0/mapbox-gl.css', array(), _S_VERSION );
// }
// add_action( 'wp_enqueue_scripts', 'caw_mapbox_assets' );

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';



/**
 * Disable the emoji's
 */
function disable_emojis() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );	
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );	
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	
	// Remove from TinyMCE
	add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
}
add_action( 'init', 'disable_emojis' );

/**
 * Filter out the tinymce emoji plugin.
 */
function disable_emojis_tinymce( $plugins ) {
	if ( is_array( $plugins ) ) {
		return array_diff( $plugins, array( 'wpemoji' ) );
	} else {
		return array();
	}
}

function remove_wp_stupid_css(){
 wp_dequeue_style( 'wp-block-library' );
 wp_dequeue_style( 'wp-block-library-theme' );
 wp_dequeue_style( 'wc-blocks-style' ); // Remove WooCommerce block CSS
 wp_dequeue_style( 'classic-theme-styles' );
} 
add_action( 'wp_enqueue_scripts', 'remove_wp_stupid_css', 20 );

// Remove Global Styles and SVG Filters from WP 5.9.1 - 2022-02-27
function remove_global_styles_and_svg_filters() {
	remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
	remove_action( 'wp_body_open', 'wp_global_styles_render_svg_filters' );
}
add_action('init', 'remove_global_styles_and_svg_filters');
