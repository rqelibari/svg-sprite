'use strict';

/**
 * svg-sprite is a Node.js module for creating SVG sprites
 *
 * @see https://github.com/jkphl/svg-sprite
 *
 * @author Joschi Kuphal <joschi@kuphal.net> (https://github.com/jkphl)
 * @copyright © 2015 Joschi Kuphal
 * @license MIT https://raw.github.com/jkphl/svg-sprite/master/LICENSE
 */

var _								= require('lodash'),
File								= require('vinyl');

/**
 * SVGSprite
 * 
 * @param {String} xmlDeclaration		XML declaration
 * @param {String} doctypeDeclaration	Doctype declaration
 * @param {Object} rootAttributes		Root attributes
 * @param {Boolean} addSVGNamespaces	Add default SVG namespaces
 */
function SVGSprite(xmlDeclaration, doctypeDeclaration, rootAttributes, addSVGNamespaces) {
	this.xmlDeclaration				= xmlDeclaration || '';
	this.doctypeDeclaration			= doctypeDeclaration || '';
	this.rootAttributes				= _.extend({}, rootAttributes);
	this.content					= [];
	
	if (!!addSVGNamespaces) {
		this.rootAttributes['xmlns']		= this.DEFAULT_SVG_NAMESPACE;
		this.rootAttributes['xmlns:xlink']	= this.XLINK_NAMESPACE;
	}
}

/**
 * Prototype properties
 * 
 * @type {Object} 
 */
SVGSprite.prototype = {};

/**
 * Default SVG namespace
 * 
 * @type {String}
 */
SVGSprite.prototype.DEFAULT_SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * Xlink namespace
 * 
 * @type {String}
 */
SVGSprite.prototype.XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';

/**
 * Add a content string
 * 
 * @param {String} content			Content string
 * @return {SVGSprite}				Self reference
 */
SVGSprite.prototype.add = function(content) {
	_.isArray(content) ? this.content.push.apply(this.content, content) : this.content.push(content);
}

/**
 * Serialize the SVG sprite
 * 
 * @return {String}					SVG sprite
 */
SVGSprite.prototype.toString = function() {
	var svg							= this.xmlDeclaration + this.doctypeDeclaration;
	svg								+= '<svg';
	for (var attr in this.rootAttributes) {
		svg							+= ' ' + attr + '="' + _.escape(this.rootAttributes[attr]) + '"';
	}
	svg								+= '>';
	svg								+= this.content.join('');
	svg								+= '</svg>';
	return svg;
}

/**
 * Return as vinyl file
 * 
 * @param {String} base				Base path
 * @param {String} path				Path
 * @return {File}					Vinyl file
 */
SVGSprite.prototype.toFile = function(base, path) {
	return new File({
		base						: base,
		path						: path,
		contents					: new Buffer(this.toString())
	});
}
	
/**
 * Module export
 */
module.exports = SVGSprite;