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

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
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
					<a href="https://www.instagram.com/cremona_artweek/" target="_blank">
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
