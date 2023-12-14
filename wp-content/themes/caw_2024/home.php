<?php /* Template Name: Opening Page */ 

get_header();
?>

	<main id="primary" class="site-main site-main-home">

		<?php
		while ( have_posts() ) :
			the_post();
		?>
			
			<div id='caw-mapbox'></div>
			<div id="caw-content">
				<div class="close-tabcontainer"></div>
				<div id="caw-tabcontainer">
					<div class="loading-div"><div class="loading-anim"></div></div>
				</div>
			</div>

		<?php
		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();
