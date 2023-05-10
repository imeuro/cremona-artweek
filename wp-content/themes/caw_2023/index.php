<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package caw_2023
 */

get_header();
?>

    <main id="single-page-primary" class="single-page site-main">
        <div id="caw-tabcontainer" class="visible">
            <?php
            while ( have_posts() ) :
                the_post();

                get_template_part( 'template-parts/content', 'page' );

            endwhile; // End of the loop.
            ?>
        </div>
    </main><!-- #main -->

<?php
// get_sidebar();
get_footer();
