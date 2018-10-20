var GAME =
{
	g_renderer: null,
	g_camera: null,
	g_scene: null,
	g_controls: null,
	g_ocean: null,
	
	g_meshes : new Map(),
	g_blackPearls: new Map(),
	g_groupShips: new Map(),
	g_blackPearlShips: new Map(),
	g_commands: new Map(),
	g_captains: new Map(),
	
	g_events: null,
	
	Initialize: function() {
	    this.g_events = io.connect('https://sealord-dshybeka.c9users.io');
	    
	    this.g_renderer = new THREE.WebGLRenderer();
		this.g_renderer.context.getExtension( 'OES_texture_float' );
		this.g_renderer.context.getExtension( 'OES_texture_float_linear' );
		this.g_renderer.setClearColor( 0x000000 );
		
		document.body.appendChild( this.g_renderer.domElement );

		this.g_scene = new Physijs.Scene;
		this.g_scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
		
		this.g_camera = new THREE.PerspectiveCamera( 55.0, WINDOW.ms_Width / WINDOW.ms_Height, 0.5, 1000000 );
		this.g_camera.position.set( 0, 350, 800 );
		this.g_camera.lookAt( new THREE.Vector3() );
		this.g_scene.add( this.g_camera );
		
		this.g_controls = new THREE.OrbitControls( this.g_camera, this.g_renderer.domElement );
		this.g_controls.userPan = false;
		this.g_controls.target.set( 0, 100.0, 0 );
		this.g_controls.noKeys = true;
		this.g_controls.userPanSpeed = 0;
		this.g_controls.minDistance = 0;
		this.g_controls.maxDistance = 20000.0;
		this.g_controls.minPolarAngle = 0;
		this.g_controls.maxPolarAngle = Math.PI * 0.75;
		
		this.InitializeLoader();
		this.InitializeScene();
		
		this.g_events.on("login", GAME.NewUserLogin);
		
		GAME.NewUserLogin({username: "test"});
		
		this.g_events.on("logout", function(data) {
			
			console.log("user left the game:" + data.username);
			
			GAME.g_groupShips.delete(data.username);
		});

        	Physijs.scripts.worker = 'third-party/physijs_worker.js';
			Physijs.scripts.ammo = 'third-party/ammo.js';
		
		this.InitCommands();
	},
	
	NewUserLogin: function(data) {
			console.log("new user joined:" + data.username);
			
			var geometry = new THREE.BoxGeometry( 100, 100, 100 );
			var material = Physijs.createMaterial(
					new THREE.MeshLambertMaterial(
						//{ map: loader.load( 'images/plywood.jpg' ) }
						),
					.6, // medium friction
					.3 // low restitution
				);
				material.wrapS = material.wrapT = THREE.RepeatWrapping;
				// material.set( .5, .5 );
			var mesh	= new Physijs.BoxMesh( geometry, new THREE.MeshBasicMaterial() );
			var mesh2	= new Physijs.BoxMesh( geometry, new THREE.MeshBasicMaterial() );
			
			mesh.collisions = 0;
			mesh.setCcdMotionThreshold(1);
			mesh.setCcdSweptSphereRadius(0.2);
			
			mesh2.collisions = 0;
			mesh2.setCcdMotionThreshold(1);
			mesh2.setCcdSweptSphereRadius(0.2);
			
			GAME.g_meshes.set(data.username, mesh);
				
			GAME.g_scene.add(mesh);
			GAME.g_scene.add(mesh2);
				
			mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			    console.log("COLL");
			});
			
			mesh2.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			    console.log("COLL");
			});
					
					
			var g_groupShip = new THREE.Object3D();
			var g_blackPearlShip = new THREE.Object3D();
			
			GAME.g_scene.add(g_groupShip );
			g_groupShip.add(g_blackPearlShip );
		
			GAME.g_groupShips.set(data.username, g_groupShip);
			GAME.g_blackPearlShips.set(data.username, g_blackPearlShip);
			GAME.g_commands.set(data.username, {
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
			});
		
			var loader = new THREE.OBJMTLLoader( GAME.g_loader );
			var g_blackPearl = null;
			loader.load( '../server/third-party/models/BlackPearl/BlackPearl.obj', '../server/third-party/models/BlackPearl/BlackPearl.mtl', function ( object ) {
				object.position.y = 20.0;
				if( object.children ) {
					for( child in object.children ) {
						object.children[child].material.side = THREE.DoubleSide;
					}
				}

			GAME.g_blackPearlShips.get(data.username).add( object );
			GAME.g_blackPearls.set(data.username, object);
			GAME.g_captains.set(data.username, "health");
		 });
		},
	
	InitializeLoader: function() {
		this.g_loader = new THREE.LoadingManager();
		
		var log = function( message, type, timeout ) {
			console.log( message );
			messg( message, type, timeout );
		}
		
		var delay = 1500;
		this.g_loader.onProgress = function( item, loaded, total ) {
			log( 'Loaded ' + loaded + '/' + total + ':' + item, 'info', delay );
		};
		this.g_loader.onLoad = function () {
			log( 'Loaded.', 'success', delay );
		};
		this.g_loader.onError = function () {
			log( 'Loading error.', 'error', delay );
		};
		
		
		this.g_imageLoader = new THREE.ImageLoader( this.g_loader );
	},
	
	InitializeScene: function() {

		this.g_mainDirectionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
		this.g_mainDirectionalLight.position.set( -0.2, 0.5, 1 );
		this.g_scene.add( this.g_mainDirectionalLight );
		
		this.g_cloudShader = new CloudShader( this.ms_Renderer, 512 );
		this.g_cloudShader.cloudMesh.scale.multiplyScalar( 4.0 );
		this.g_scene.add( this.g_cloudShader.cloudMesh );

		var gsize = 512;
		var res = 512;
		var gres = 256;
		var origx = -gsize / 2;
		var origz = -gsize / 2;
		this.g_ocean = new THREE.Ocean( this.g_renderer, this.g_camera, this.g_scene,
		{
			INITIAL_SIZE : 200.0,
			INITIAL_WIND : [ 10.0, 10.0 ],
			INITIAL_CHOPPINESS : 3.6,
			CLEAR_COLOR : [ 1.0, 1.0, 1.0, 0.0 ],
			SUN_DIRECTION : this.g_mainDirectionalLight.position.clone(),
			OCEAN_COLOR: new THREE.Vector3( 0.35, 0.4, 0.45 ),
			SKY_COLOR: new THREE.Vector3( 10.0, 13.0, 15.0 ),
			EXPOSURE : 0.15,
			GEOMETRY_RESOLUTION: gres,
			GEOMETRY_SIZE : gsize,
			RESOLUTION : res
		} );
		
		this.LoadSkyBox();
		this.LoadMountains();
	},
	
		LoadSkyBox : function LoadSkyBox() {

		var cubeShader = THREE.ShaderLib['cube'];

		var skyBoxMaterial = new THREE.ShaderMaterial( {
			fragmentShader: cubeShader.fragmentShader,
			vertexShader: cubeShader.vertexShader,
			uniforms: cubeShader.uniforms,
			side: THREE.BackSide
		} );

		this.g_skyBox = new THREE.Mesh(
			new THREE.BoxGeometry( 450000, 450000, 450000 ),
			skyBoxMaterial
		);

		this.g_scene.add( this.g_skyBox );

		// https://stackoverflow.com/questions/3552944/how-to-get-the-anchor-from-the-url-using-jquery
		var url = window.location.href, idx = url.indexOf("#");
		var anchor = idx != -1 ? url.substring(idx+1) : null;
		var environmentParameter = anchor;

		if( environmentParameter !== null ) {
			this.g_environment = environmentParameter;
		}

		this.UpdateEnvironment( this.g_Environment );

	},
	
	
	LoadMountains : function LoadSkyBox() {

		var demo = this;

		var mountainTexture = new THREE.Texture();
		mountainTexture.generateMipmaps = false;
		mountainTexture.magFilter = THREE.LinearFilter;
		mountainTexture.minFilter = THREE.LinearFilter;
		this.g_imageLoader.load( '../server/third-party/img/mountains.png', function ( image ) {
				mountainTexture.image = image;
				mountainTexture.needsUpdate = true;
		} );


		var mountainsMaterial = new THREE.MeshBasicMaterial( {
			map: mountainTexture,
			transparent: true,
			side: THREE.BackSide,
			depthWrite: false
		} );

		var addMountain = function addMountain( size ) {

			var moutains = new THREE.Mesh(
				new THREE.CylinderGeometry( size, size, 35000, 32, 1, true ),
				mountainsMaterial
			);
			moutains.position.y = 10000;
			demo.g_scene.add( moutains );

		} ;

		// Add twice with different size in order to avoid some artifacts on the reflection
		addMountain( 120000 );
		addMountain( 150000 );

		// Add a black cylinder to hide the skybox under the water
		var cylinder = new THREE.Mesh(
			new THREE.CylinderGeometry( 150000, 150000, 150000, 32, 1, true ),
			new THREE.MeshBasicMaterial( { color: new THREE.Color( 1, 1, 1 ), side: THREE.BackSide } )
		);
		cylinder.position.y = -80000;
		demo.g_scene.add( cylinder );

	},
	
		UpdateEnvironment : function UpdateEnvironment( key ) {

		var textureName = '';
		var textureExt = ".jpg";
		var directionalLightPosition = null;
		var directionalLightColor = null;
		var raining = false;


	   textureName = 'sky';
	   directionalLightPosition = new THREE.Vector3( -0.5, 0.5, -0.6 );
	   directionalLightColor = new THREE.Color( 1, 0.95, 0.9 );

		
		this.g_environment = key;
		this.g_mainDirectionalLight.position.copy( directionalLightPosition );
		this.g_mainDirectionalLight.color.copy( directionalLightColor );
		this.g_ocean.materialOcean.uniforms.u_sunDirection.value.copy( this.g_mainDirectionalLight.position );
		
		var sources = [
			'../server/third-party/img/' + textureName + '_west' + textureExt,
			'../server/third-party/img/' + textureName + '_east' + textureExt,
			'../server/third-party/img/' + textureName + '_up' + textureExt,
			'../server/third-party/img/' + textureName + '_down' + textureExt,
			'../server/third-party/img/' + textureName + '_south' + textureExt,
			'../server/third-party/img/' + textureName + '_north' + textureExt
		];
		var images = [];

		var cubeMap = new THREE.CubeTexture( images );
		cubeMap.flipY = false;

		var imageLoader = this.g_imageLoader;
		var loaded = 0;
		var loadTexture = function ( i ) {
			imageLoader.load( sources[ i ], function ( image ) {
				cubeMap.images[ i ] = image;
				loaded ++;
				if ( loaded === 6 ) {
					cubeMap.needsUpdate = true;
				}
			} );

		}

		for ( var i = 0, il = sources.length; i < il; ++ i ) {
			loadTexture( i );
		}
		
		cubeMap.format = THREE.RGBFormat;
		cubeMap.generateMipmaps = false;
		cubeMap.magFilter = THREE.LinearFilter;
		cubeMap.minFilter = THREE.LinearFilter;

		this.g_skyBox.material.uniforms['tCube'].value = cubeMap;
	},
	
	Update : function () {

		// Update camera position
		if( this.g_camera.position.y < 0.0 ) {
			this.g_camera.position.y = 2.0;
		}
		
		if (GAME.yards != undefined) {
			
			for (var [username, yards] of GAME.yards) {
			
			var mesh1 = yards[0];
			var mesh2 = yards[2];
			
			// if (GAME.delta == undefined) {
				
			// 	GAME.delta = mesh2.position.x - mesh1.position.x;
			// }
			
			// if (GAME.delta2 == undefined) {
				
			// 	GAME.delta2 = mesh2.position.z - mesh1.position.z;
			// }
			
			// console.log("GAME.delta " + GAME.delta);
			
			// console.log("GAME.delta " + GAME.delta);
			// console.log("GAME.delta2 " + GAME.delta2);
			
			// mesh1.position.x += 2;
			
			
			
				for (var i = 0; i < yards.length; i+=1) {
					
					var mesh1 = yards[i]
					
					if (mesh1.round > 130) {
						
						console.log("remove");
						GAME.g_scene.remove(mesh1);
						continue;
					}
					mesh1.round = mesh1.round + 1;
		// 			var mesh2 = yards[i + 1]
		
					
		// 			 var vect1 = new THREE.Vector3(mesh1.position.x, mesh1.position.y, mesh1.position.z);
		// 			 var vect2 = new THREE.Vector3(mesh2.position.x, mesh2.position.y, mesh2.position.z);
		// 			 var direction = new THREE.Vector3();
		// 			 direction.subVectors(vect1, vect2);
		// 			 //var meshDisplacement = ()

// console.log("delta1 " + mesh1.delta1);
// console.log("delta2 " + mesh1.delta2);

			//mesh1.position.x = mesh1.position.x + mesh1.delta1;
			//mesh1.position.z = mesh1.position.z + mesh1.delta2;
			mesh1.rotation.y = mesh1.delta2;
			mesh1.rotation.x = 0;
			mesh1.rotation.z = 0;
			
			var shipDisplacement = (new THREE.Vector3(0, 0, -1)).applyEuler(mesh1.rotation).multiplyScalar( 10.0 );
			mesh1.position.add(shipDisplacement);


		// var shipDisplacement = (direction).multiplyScalar( 2 );
		// mesh1.position.add( shipDisplacement.normalize() );	
		// mesh2.position.add( shipDisplacement.normalize()  );	
					// this.g_groupShips.get(username).rotation.y += this.g_commands.get(username).movements.angle;
					// this.g_blackPearlShips.get(username).rotation.z = -this.g_commands.get(username).movements.angle * 10.0;
					if (i % 2 == 0) {
						
						//mesh.position.x += -2;
						// mesh.position.z += -2;
					} else {
						
						//mesh.position.x += 2;
					}
				}
			}
		}


		var currentTime = new Date().getTime();
		
		for (var [username, value] of this.g_groupShips) {
			this.UpdateCommands(username);
			this.g_groupShips.get(username).rotation.y += this.g_commands.get(username).movements.angle;
			// console.log(this.g_commands.get(username).movements.angle);
			this.g_blackPearlShips.get(username).rotation.z = -this.g_commands.get(username).movements.angle * 10.0;
			this.g_blackPearlShips.get(username).rotation.x = this.g_commands.get(username).movements.speed * 0.1;
			var shipDisplacement = (new THREE.Vector3(0, 0, -1)).applyEuler(this.g_groupShips.get(username).rotation).multiplyScalar( 10.0 * this.g_commands.get(username).movements.speed );
			this.g_groupShips.get(username).position.add( shipDisplacement );
			this.g_meshes.get(username).position.add( shipDisplacement );
			
			if( this.g_blackPearls.get(username))
				{
				var animationRatio = 1.0 + this.g_commands.get(username).movements.speed * 1.0;
				this.g_blackPearls.get(username).rotation.y = Math.cos( currentTime * 0.0008 ) * 0.05 - 0.025;
				this.g_blackPearls.get(username).rotation.x = Math.sin( currentTime * 0.001154 + 0.78 ) * 0.1 + 0.05;
			}
			
			this.g_controls.update();
			
			if (yards != undefined){
				for (var i = 0; i < yards.length; i+=1) {
					
					// var collis = this.g_groupShips.get(username).intersectObjects(yards[i]);
					
					// if (collis) {
					// 	console.log("COLLIS");
					// }
				}
			}
		}



		this.g_ocean.deltaTime = ( currentTime - lastTime ) / 1000 || 0.0;
		lastTime = currentTime;



		// Render ocean reflection
		this.g_ocean.render();

		// Updade clouds
		this.g_cloudShader.update();

		// Update ocean data
		this.g_ocean.update();
		

		this.Display();

	},
	
		Display : function () {

		this.g_renderer.render( this.g_scene, this.g_camera );

	},
	
		Resize : function ( inWidth, inHeight ) {

		this.g_camera.aspect = inWidth / inHeight;
		this.g_camera.updateProjectionMatrix();
		this.g_renderer.setSize( inWidth, inHeight );
		this.Display();

	},
	
		UpdateCommands : function UpdateCommands(username) {

		var states = this.g_commands.get(username).states;

		// Update speed
		var targetSpeed = 0.0;
		if( states.up ) {
			targetSpeed = 1.0;
		}
		else if( states.down ) {
			targetSpeed = -0.5;
		}
		var curSpeed = this.g_commands.get(username).movements.speed ;
		this.g_commands.get(username).movements.speed = curSpeed + ( targetSpeed - curSpeed ) * 0.02;

		// Update angle
		var targetAngle = 0.0;
		if( states.left ) {
			targetAngle = Math.PI * 0.005;
		}
		else if( states.right ) {
			targetAngle = -Math.PI * 0.005;
		}
		if( states.down ) {
			targetAngle *= -1.0;
		}
		
		var curAngle = this.g_commands.get(username).movements.angle ;
		this.g_commands.get(username).movements.angle = curAngle + ( targetAngle - curAngle ) * 0.02;

	},
		InitCommands : function InitCommands() {

		var LEFT = 37,
			UP = 38,
			RIGHT = 39,
			DOWN = 40;

		var keyHandler = function keyHandler( action, data ) {
			return function( event ) {
				var key = event.which;
				if( key >= LEFT && key <= DOWN ) {
					switch( key ) {
						case UP : GAME.g_commands.get("test").states.up = action ; break ;
						case RIGHT : GAME.g_commands.get("test").states.right = action ; break ;
						case DOWN : handleFire({username: "test"}) ; break ;
						case LEFT : GAME.g_commands.get("test").states.left = action ; break ;
					}
				}
			}
		}
		
		var eventHandler = function eventHandler( action, data ) {
					switch( action ) {
						case 'speed up' : GAME.g_commands.get(data.username).states.up = true ; break ;
						case 'right' : {
							GAME.g_commands.get(data.username).states.right = true;
							GAME.g_commands.get(data.username).states.left = false;
							break ;
						}
						case 'speed down' : GAME.g_commands.get(data.username).states.up = false ; break ;
						case 'left' : {
							GAME.g_commands.get(data.username).states.left = true;
							GAME.g_commands.get(data.username).states.right = false;
							break;
						}
						case 'center': {
							GAME.g_commands.get(data.username).states.left = false;
							GAME.g_commands.get(data.username).states.right = false;
							break;
						}
							
					}
		}
		
		var handleFire = function (data) {
						
			if (GAME.yards == undefined) {
				GAME.yards = new Map();
			}
			
			var yards = GAME.yards.get(data.username);
			if (yards == undefined) {
				yards = [];
			}
			
			var demo = GAME;
	
			var geometry = new THREE.SphereGeometry( 5, 32, 32 );
			var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
	
			for (var i = 1; i <= 4; i++) {
	
				var sphere = new Physijs.BoxMesh(
							geometry,
							material
						);
				sphere.collisions = 1;
				var shipPosition = GAME.g_groupShips.get(data.username).position;
				var shipRotation = GAME.g_groupShips.get(data.username).rotation;
				console.log("shipPosition ", GAME.g_groupShips.get(data.username));
				sphere.position.set(shipPosition.x -35, shipPosition.y + 25, shipPosition.z -i*20);
				sphere.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				    console.log("COLLITION");
				});
	
				var sphere2 = new Physijs.BoxMesh(
							geometry,
							material
						);
				sphere2.collisions = 1;
				sphere2.position.set(shipPosition.x + 35, shipPosition.y + 25, shipPosition.z -i*20);
				sphere2.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				    console.log("COLLITION");
				});
	
		
		// console.log("sphere1.position.x " + sphere2.position.x + " | " +sphere2.position.z);
	
		// console.log("sphere2.position.x " + sphere.position.x + " | " +sphere.position.z);

				var delta = 2;
				
				var delta2 = shipRotation.y;
				
				sphere.delta1 = delta;
				sphere.delta2 = delta2 + 1.57;
				sphere.round = 0;
				
				sphere2.delta1 = delta;
				if (sphere.delta2 < 0) {
					sphere2.delta2 = sphere.delta2+3.14;
				} else {
				    sphere2.delta2 = sphere.delta2-3.14;	
				}
				
				sphere2.round = 0;
	
				yards.push(sphere);
				yards.push(sphere2);
				
				demo.g_scene.add(sphere);
				demo.g_scene.add(sphere2);
			}
			
			GAME.yards.set(data.username, yards);
			
        }
		
		this.g_events.on('fire', function (data) {
           handleFire(data);
        });
		
		this.g_events.on('speed up', function (data) {
           eventHandler('speed up', data);
        });
        
        this.g_events.on('speed down', function (data) {
           eventHandler('speed down', data);
        });
        
        this.g_events.on('right', function (data) {
           eventHandler('right', data);
        });
        
        this.g_events.on('left', function (data) {
           eventHandler('left', data);
        });
        this.g_events.on('center', function (data) {
           eventHandler('center', data);
        });

		$( document ).keydown( keyHandler( true ) );
		$( document ).keyup( keyHandler( false ) );
		
	}
}