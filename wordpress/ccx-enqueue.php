<?php
/**
 * CCX Charcoal Calculators — load the shared styles + scripts once.
 *
 * Two ways to use this (pick ONE):
 *
 *  A) Child theme (GeneratePress): put ccx.min.css and ccx.min.js in your child
 *     theme's /assets/ folder, then paste everything BELOW the opening <?php into
 *     the child theme's functions.php.
 *
 *  B) WPCode / Code Snippets plugin: create a new PHP snippet, set it to run
 *     "everywhere / site wide", and paste the code below (including the function
 *     and add_action lines). No file uploads needed if you instead paste the CSS
 *     and JS as separate CSS/JS snippets — but this PHP path keeps versioning and
 *     page-gating easy.
 *
 * When you regenerate the files, bump CCX_ASSET_VER so browsers fetch the new
 * version, then clear any caching plugin.
 */

if ( ! defined( 'CCX_ASSET_VER' ) ) {
	define( 'CCX_ASSET_VER', '2026-06' ); // bump on every rebuild (e.g. monthly figure refresh)
}

function ccx_enqueue_calculator_assets() {

	// OPTIONAL: only load on the calculator pages. Uncomment and list your slugs
	// to keep the assets off every other page. Site-wide is fine too (files are tiny).
	//
	// $slugs = array(
	//     'container-load', 'landed-cost', 'profit-margin', 'transit-time',
	//     'moq-pricing', 'incoterms', 'roi-payback', 'spec-comparison',
	// );
	// if ( ! is_page( $slugs ) ) { return; }

	wp_enqueue_style(
		'ccx-calculators',
		get_stylesheet_directory_uri() . '/assets/ccx.min.css',
		array(),
		CCX_ASSET_VER
	);

	wp_enqueue_script(
		'ccx-calculators',
		get_stylesheet_directory_uri() . '/assets/ccx.min.js',
		array(),        // no dependencies — vanilla JS
		CCX_ASSET_VER,
		true            // load in footer; widgets self-init on DOMContentLoaded
	);
}
add_action( 'wp_enqueue_scripts', 'ccx_enqueue_calculator_assets' );

/**
 * If you use WPCode/Code Snippets and paste the JS as a *separate* JS snippet
 * instead of uploading ccx.min.js, delete the wp_enqueue_script() call above so
 * the script isn't loaded twice.
 */
