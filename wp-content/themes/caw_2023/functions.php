<?php
/**
 * caw_2023 functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package caw_2023
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function caw_2023_setup() {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on caw_2023, use a find and replace
		* to change 'caw_2023' to the name of your theme in all the template files.
		*/
	load_theme_textdomain( 'caw_2023', get_template_directory() . '/languages' );

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
			'menu-1' => esc_html__( 'Primary', 'caw_2023' ),
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

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'caw_2023_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
}
add_action( 'after_setup_theme', 'caw_2023_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function caw_2023_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'caw_2023_content_width', 640 );
}
add_action( 'after_setup_theme', 'caw_2023_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function caw_2023_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'caw_2023' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'caw_2023' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'caw_2023_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function caw_2023_scripts() {
	wp_enqueue_style( 'caw_2023-style', get_stylesheet_uri(), array(), _S_VERSION );
	wp_style_add_data( 'caw_2023-style', 'rtl', 'replace' );
    wp_enqueue_style( 'caw_2023-style-custom', get_template_directory_uri() . '/assets/css/caw.css', array(), _S_VERSION );

	wp_enqueue_script( 'caw_2023-navigation', get_template_directory_uri() . '/assets/js/navigation.js', array(), _S_VERSION, true );
	wp_enqueue_script( 'caw_2023-general', get_template_directory_uri() . '/assets/js/caw.js', array(), _S_VERSION, true );

	// if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
	// 	// wp_enqueue_script( 'comment-reply' );
	// }
}
add_action( 'wp_enqueue_scripts', 'caw_2023_scripts' );


// mapbox libraries
function caw_mapbox_assets() {
	wp_enqueue_script( 'caw_2023-mapbox', 'https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.js', array(), _S_VERSION, true );
	wp_enqueue_style( 'caw_2023-mapbox', 'https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css', array(), _S_VERSION );
}
add_action( 'wp_enqueue_scripts', 'caw_mapbox_assets' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

