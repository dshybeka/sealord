var GAME =
{
	renderer : null,
	camera : null,
	scene : null,
	controls : null,
	ocean : null,

	commands : {
		states : {
			up : false,
			right : false,
			down : false,
			left : false
		},
		movements : {
			speed : 0.0,
			angle : 0.0
		}
	},
	
	Initialize: function() {
	    this.renderer = new THREE.WebGLRenderer();
		this.renderer.context.getExtension( 'OES_texture_float' );
		this.renderer.context.getExtension( 'OES_texture_float_linear' );
		this.renderer.setClearColor( 0x000000 );
		
		document.body.appendChild( this.renderer.domElement );

		this.scene = new THREE.Scene();
	}
}