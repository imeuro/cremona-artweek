<?php /* Template Name: Opening Page */ 

get_header();
?>

	<main id="primary" class="site-main site-main-home">

		<?php
		while ( have_posts() ) :
			the_post();
		?>
			<div id='caw-mapbox'></div>

			<!-- <iframe width='100%' height='400px' src="https://api.mapbox.com/styles/v1/meuro/clftwthuu002b01ogx6r445s7.html?title=false&access_token=pk.eyJ1IjoibWV1cm8iLCJhIjoiY2xmcjA2ZDczMDEwYTQzcWZwZXk4dmpvdSJ9.YHkGCdl-D6YkWDJbNGOBEQ&zoomwheel=false#13.64/45.13642/10.02768" title="CAW-2023" style="border:none;"></iframe> -->
		
		<?php
			// get_template_part( 'template-parts/content', 'page-eventi' );
		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_sidebar();
get_footer();
