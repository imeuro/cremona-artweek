<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package caw_2023
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">


	<link rel="icon" href="/favicon.ico">
	<link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/assets/graphics/favicons/apple-touch-icon.png?v=1.0">
	<link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri(); ?>/assets/graphics/favicons/favicon-32x32.png?v=1.0">
	<link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri(); ?>/assets/graphics/favicons/favicon-16x16.png?v=1.0">
	<link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/assets/graphics/favicons/site.webmanifest?v=1.0">
	<link rel="mask-icon" href="<?php echo get_template_directory_uri(); ?>/assets/graphics/favicons/safari-pinned-tab.svg?v=1.0" color="#ff0000">
	<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/assets/graphics/favicons/favicon.ico?v=1.0">
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="theme-color" content="#ffffff">



	<link rel="preload" href="<?php echo get_template_directory_uri(); ?>/assets/fonts/OPSPlacard-Regular.woff2" as="font" type="font/woff2" crossorigin>
	<link rel="preconnect" href="https://api.mapbox.com" />

	<?php wp_head(); ?>

	<link rel="preload" fetchpriority="high" as="image" href="<?php echo get_template_directory_uri(); ?>/assets/graphics/CRC_Final.svg" type="image/svg+xml">

	<style>
		.mapboxgl-control-container .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl.mapboxgl-ctrl-group { margin-right: 40px; box-shadow: none; }
		.mapboxgl-ctrl.mapboxgl-ctrl-attrib { height:20px; display:none; }
/*		.mapboxgl-control-container .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl.mapboxgl-ctrl-group:nth-child(2) {display: none}*/
	</style>
</head>

<body <?php body_class(); ?> data-lang="<?php echo pll_current_language(); ?>">
<?php wp_body_open(); ?>
<div id="page" class="site home">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'caw_2023' ); ?></a>

	<header id="masthead" class="site-header">
		<div class="site-branding">
			<?php
			the_custom_logo();
			if ( is_front_page() && is_home() ) :
				?>
				<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" title="<?php bloginfo( 'name' ); ?>"></a></h1>
				<?php
			else :
				?>
				<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" title="<?php bloginfo( 'name' ); ?>"></a></p>
				<?php
			endif;
			?>
		</div><!-- .site-branding -->

		<nav id="site-navigation" class="main-navigation">
			<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Primary Menu', 'caw_2023' ); ?></button>
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'menu-1',
					'menu_id'        => 'primary-menu',
				)
			);
			?>

			<ul id="lang-switcher" class="menu">
				<?php pll_the_languages(array(
					'display_names_as' 	=> 'slug',
					'hide_current'		=> 1
				)); ?>
				<li class="social social-FB">
					<a href="https://www.facebook.com/Cremona-Contemporanea-Art-Week-109247388808156" target="_blank">
						<img src="<?php echo get_template_directory_uri(); ?>/assets/graphics/ico-social-fb.svg" width="25" height="25" alt="cremona_artweek - Facebook" />
					</a>
				</li>
				<li class="social social-IG">
					<a href="https://www.instagram.com/cremona_artweek/" target="_blank">
						<img src="<?php echo get_template_directory_uri(); ?>/assets/graphics/ico-social-iggg.svg" width="25" height="25" alt="@cremona_artweek - Instagram" />
					</a>
				</li>
			</ul>
		</nav><!-- #site-navigation -->

		<div class="lettering lettering-left">
			<span data-letter="A"></span>
			<span data-letter="B"></span>
			<span data-letter="C"></span>
			<span data-letter="D"></span>
		</div>
		<div class="lettering lettering-right">
			<span data-letter="A"></span>
			<span data-letter="B"></span>
			<span data-letter="C"></span>
			<span data-letter="D"></span>
		</div>
	</header><!-- #masthead -->
