import {
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	SphereGeometry,
	Vector3,
	Sphere,
	CanvasTexture,
	ClampToEdgeWrapping,
} from 'three';
import { ImprovedNoise } from './scripts/jsm/math/ImprovedNoise.js';

class WorldMaterialGenerator {

	//constructor( i = 0, parent = null, worldScale=20 ) {
	constructor( OBJ ) {
		this.worldWidth = 32; 
		this.worldDepth = 32;
		const self = this;
		const data = self.generateHeight( this.worldWidth, this.worldDepth );
		this.texture = new CanvasTexture( self.generateTexture( data, this.worldWidth, this.worldDepth ) );
		this.texture.wrapS = ClampToEdgeWrapping;
		this.texture.wrapT = ClampToEdgeWrapping;

	}

	update(){
			
		
	}

	generateHeight( width, height ) {

		const size = width * height, data = new Uint8Array( size ),
			perlin = new ImprovedNoise(), z = Math.random() * 100;

		let quality = 1;

		for ( let j = 0; j < 4; j ++ ) {

			for ( let i = 0; i < size; i ++ ) {

				const x = i % width; 
				const y = ~ ~ ( i / width );
				data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

			}

			quality *= 5;

		}

		return data;
	}

	generateTexture( data, width, height ) {

		let context, image, imageData, shade;

		const vector3 = new Vector3( 0, 0, 0 );

		const sun = new Vector3( 0, 1, 1 );
		sun.normalize();

		const canvas = document.createElement( 'canvas' );
		canvas.width = width;
		canvas.height = height;

		context = canvas.getContext( '2d' );
		context.fillStyle = '#000';
		context.fillRect( 0, 0, width, height );

		image = context.getImageData( 0, 0, canvas.width, canvas.height );
		imageData = image.data;

		for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

			vector3.x = data[ j - 2 ] - data[ j + 2 ];
			vector3.y = 2;
			vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
			vector3.normalize();

			shade = vector3.dot( sun );

			imageData[ i ] =       ( 0.5 + data[ j ] * 3 );
			imageData[ i+1 ] =     ( 0.5 + data[ j ] * 3 );
			imageData[ i+2 ] =     ( 0.5 + data[ j ] * 3 );
			//imageData[ i+2 ] =     ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.09 );
			// imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
			// imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

		}

		context.putImageData( image, 0, 0 );

		// Scaled 4x

		const canvasScaled = document.createElement( 'canvas' );
		canvasScaled.width = width * 4;
		canvasScaled.height = height * 4;

		context = canvasScaled.getContext( '2d' );
		context.scale( 4, 4 );
		context.drawImage( canvas, 0, 0 );

		image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
		imageData = image.data;

		for ( let i = 0, l = imageData.length; i < l; i += 4 ) {

			const v = ~ ~ ( Math.random() * 5 );

			imageData[ i ] += v;
			imageData[ i + 1 ] += v;
			imageData[ i + 2 ] += v;

		}

		context.putImageData( image, 0, 0 );

		return canvasScaled;

	}



}

export { WorldMaterialGenerator };
