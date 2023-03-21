<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'caw' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'ricorda' );

/** Database hostname */
define( 'DB_HOST', 'database' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'Z_CD[yXE bT=yjm xC/N7 ^i=?:=2ZyVDIyk!lB8J-M_%I_AUMt!hlh&3<a{:Xxb' );
define( 'SECURE_AUTH_KEY',  '9^Q.?N<2}>W-oakWVfLgfi HQ[-xV5PG8D|n_uUfhC.$m&2Lpo%%NVCFUs1Sxj?8' );
define( 'LOGGED_IN_KEY',    '%U(P,)%)B,74qG#Bp/X.`!m{x1BXDp!WkN*PinlJ/~0Pu%lsUw];lZAoHk9{i;bs' );
define( 'NONCE_KEY',        'o%_OU;xHLZ#>m7FM!+ehPK>cz![;vh.VA$w]cyH 3uxTxf%zgndQh|S5Wd;Tx<D*' );
define( 'AUTH_SALT',        '_ gm{v5xb&YZ@bqHAOz>`Q_X> 3701c^48.uOQL]z@3 _$T!42a/HW<rGHRL$s@+' );
define( 'SECURE_AUTH_SALT', 'A8N[$^B9w3w7B,soG{5]touyuewe`2ni+},5yqiYVb2.7^M3$,NxR+N#A?*9%z!B' );
define( 'LOGGED_IN_SALT',   'F2[dm1}LS~U-q`@>8`Gi5k*&54 z> -[kR](W0NO.[PhNlx&[Zubu=/McafL(i h' );
define( 'NONCE_SALT',       '&f$</`Y*V9up,N}{Jp+&7Q# *|*.MrVVn+MUL(=$4<nS6M;xcesgn$.b5X4gEchq' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
