(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var stereoComponent = require('index.js').stereo_component;
var stereocamComponent = require('index.js').stereocam_component;

AFRAME.registerComponent('stereo', stereoComponent);
AFRAME.registerComponent('stereocam', stereocamComponent);

},{"index.js":2}],2:[function(require,module,exports){
module.exports = {

   // Put an object into left, right or both eyes.
   // If it's a video sphere, take care of correct stereo mapping for both eyes (if full dome)
   // or half the sphere (if half dome)

  'stereo_component' : {
      schema: {
        eye: { type: 'string', default: "left"},
        mode: { type: 'string', default: "full"},
        split: { type: 'string', default: "horizontal"},
		hfov: { type: 'number', default: 180},
		vfov: { type: 'number', default: 141},
		circleRadius: { type: 'number', default: 0.2},
        playOnClick: { type: 'boolean', default: true },
      },
       init: function(){


          // Flag to acknowledge if 'click' on video has been attached to canvas
          // Keep in mind that canvas is the last thing initialized on a scene so have to wait for the event
          // or just check in every tick if is not undefined

          this.video_click_event_added = false;

          this.material_is_a_video = false;

          // Check if material is a video from html tag (object3D.material.map instanceof THREE.VideoTexture does not
          // always work
		  
		  //var scene = this.el.parentElement.sceneEl;
		  //console.log("Scene "+Object.getOwnPropertyNames(scene));

          if(this.el.getAttribute("material")!==null && 'src' in this.el.getAttribute("material") && this.el.getAttribute("material").src !== "") {
            var src = this.el.getAttribute("material").src;

            // If src is an object and its tagName is video...

            if (typeof src === 'object' && ('tagName' in src && src.tagName === "VIDEO")) {
              this.material_is_a_video = true;
            }
          }

          var object3D = this.el.object3D.children[0];

          // In A-Frame 0.2.0, objects are all groups so sphere is the first children
          // Check if it's a sphere w/ video material, and if so
          // Note that in A-Frame 0.2.0, sphere entities are THREE.SphereBufferGeometry, while in A-Frame 0.3.0,
          // sphere entities are THREE.BufferGeometry.

          var validGeometries = [THREE.SphereGeometry, THREE.SphereBufferGeometry, THREE.BufferGeometry];
          var isValidGeometry = validGeometries.some(function(geometry) {
            return object3D.geometry instanceof geometry;
          });
		  
		  var circleRadius = this.data.circleRadius;
		  var hFOV = this.data.hfov;//113;
		  var vFOV = this.data.vfov; //61;
		  hFOV = hFOV*Math.PI/180.0;
		  vFOV = vFOV*Math.PI/180.0;

		  
          if (isValidGeometry && this.material_is_a_video) {

              // if half-dome mode, rebuild geometry (with default 100, radius, 64 width segments and 64 height segments)

              if (this.data.mode === "half") {

                  var geo_def = this.el.getAttribute("geometry");
                  var geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64, Math.PI / 2, Math.PI, 0, Math.PI);
              }
              else if (this.data.mode === "full"){
                  var geo_def = this.el.getAttribute("geometry");
                  var geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 64, geo_def.segmentsHeight || 64);
              }
			  else if (this.data.mode === "curvedRect") {
                  var geo_def = this.el.getAttribute("geometry");
                  var geometry = new THREE.SphereGeometry(geo_def.radius || 100, geo_def.segmentsWidth || 2, geo_def.segmentsHeight || 2, Math.PI / 2, Math.PI, 0, Math.PI);
			  }else if (this.data.mode === "toLens") { //Custom canvas - Ravimal
                  var geo_def = this.el.getAttribute("geometry");
                  var geometry = new THREE.SphereGeometry(geo_def.radius || 100, 
				geo_def.segmentsWidth || 64, 
				geo_def.segmentsHeight || 64, Math.PI / 2 + (Math.PI-hFOV)/2, hFOV,
				(Math.PI-vFOV)/2, 
				vFOV);
				
				//Add more geometry if needed - Ravimal
				/*const wireframe = new THREE.WireframeGeometry(geometry);
				const line = new THREE.LineSegments( wireframe );
				line.material.depthTest = false;
				line.material.opacity = 0.25;
				line.material.transparent = true;
				//object3D.add(line);*/
/*				const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
				const topCover = new THREE.SphereGeometry(geo_def.radius-1, 
				geo_def.segmentsWidth || 64, 
				geo_def.segmentsHeight || 64, Math.PI / 2 + (Math.PI-hFOV)/2, hFOV,
				(Math.PI-vFOV)/2, 
				vFOV*0.1);
				
				const topMesh = new THREE.Mesh( topCover,  material);
				topMesh.material.depthTest = false;
				topMesh.material.side = THREE.BackSide;
				object3D.add(topMesh);
				
				const bottomCover = new THREE.SphereGeometry(geo_def.radius-18, 
				geo_def.segmentsWidth || 64, 
				geo_def.segmentsHeight || 64, Math.PI / 2 + (Math.PI-hFOV*1.1)/2, hFOV*1.1,
				(Math.PI-vFOV)/2+vFOV*0.98, 
				Math.PI-((Math.PI-vFOV)/2+vFOV*0.98));
				
				const bottomMesh = new THREE.Mesh( bottomCover,  material);
				bottomMesh.scale.set(0.9, 1, 2);
				bottomMesh.material.depthTest = true;
				bottomMesh.material.side = THREE.BackSide;
				object3D.add(bottomMesh);
*/
			  }else
			  {
				  var geo_def = this.el.getAttribute("geometry");
                  var geometry = new THREE.PlaneGeometry(geo_def.width || 100, geo_def.height || 100);
				  geometry.rotation.y = Math.PI / 2;
				  //geometry.translate ( x : Float, y : Float, z : Float ) 
			  }

              // Panorama in front

              object3D.rotation.y = Math.PI / 2;


            // Calculate texture offset and repeat and modify UV's
            // (cannot use in AFrame material params, since mappings are shared when pointing to the same texture,
            // thus, one eye overrides the other) -> https://stackoverflow.com/questions/16976365/two-meshes-same-texture-different-offset
			
			if(this.data.split === 'horizontal' || this.data.split === 'vertical') //Enable monoscopic - Ravimal
			{
				var axis = this.data.split === 'horizontal' ? 'y' : 'x';
				// !!! NOTE THAT UV texture coordinates, start at the bottom left point of the texture, so y axis coordinates for left eye on horizontal split
				// are 0.5 - 1.0, and for the right eye are 0.0 - 0.5 (they are swapped from THREE.js 'y' axis logic)
				var offset = this.data.eye === 'right' ? (axis === 'y' ? {x: 0, y: 0} : {x: 0, y: 0.5}) : (axis === 'y' ? {x: 0.5, y: 0} : {x: 0, y: 0});
				var repeat = axis === 'y' ? {x: 0.5, y: 1} : {x: 1, y: 0.5};
				//Canvas Stencil - Ravimal
				
				if(object3D.material!=null){
					console.log("Eye  xxxxxxx" + this.data.eye);
					//console.log(Object.getOwnPropertyNames(object3D.material.map));
					
					const w = 1920;
					const h = 1080;
					//const padRate = 0.2;
					var matCanvas = document.createElement('canvas');
					matCanvas.width = w;
					matCanvas.height = h;
					var matContext = matCanvas.getContext('2d');

					var texture = new THREE.Texture(matCanvas);
					matContext.fillStyle = "#000000";
					matContext.fillRect(0, 0, w, h);
					matContext.fillStyle = "#FFFFFF";
					matContext.fillRect(w*0.25-(w*circleRadius), 2, w*circleRadius*2, h-4);
					matContext.fillRect(w*0.75-(w*circleRadius), 2, w*circleRadius*2, h-4);
					//object3D.material.alphaMap=texture;
					//object3D.material.map = texture;
					object3D.material.alphaTest=0.5;
					texture.needsUpdate = true;
					if(object3D.material.map!=null){
						object3D.material.map.magfilter = THREE.LinearFilter;
						object3D.material.map.minfilter = THREE.LinearFilter;
						object3D.material.map.anisotropy = 16;
						object3D.material.map.wrapT = THREE.ClampToEdgeWrapping;
						object3D.material.map.wrapS = THREE.ClampToEdgeWrapping;
					}
				}
			}
			else{ //Monoscopic
				
				var offset = {x: 0, y: 0};
				var repeat = {x: 1, y: 1};
				
				//Canvas Stencil - Ravimal
				if(object3D.material!=null){
					//console.log(Object.getOwnPropertyNames(object3D.material.map));
					const w = 1920;
					const h = 1080;
					//const padRate = 0.9;
					var matCanvas = document.createElement('canvas');
					matCanvas.width = w;
					matCanvas.height = h;
					var matContext = matCanvas.getContext('2d');

					var texture = new THREE.Texture(matCanvas);
					matContext.fillStyle = "#000000";
					matContext.fillRect(0, 0, w, h);
					matContext.fillStyle = "#FFFFFF";
					matContext.fillRect(w*0.5-(w*circleRadius), 2, w*circleRadius*2, h-4);
					//object3D.material.alphaMap=texture;
					//object3D.material.map = texture;
					object3D.material.alphaTest=0.5;
					texture.needsUpdate = true;
					if(object3D.material.map!=null){
						object3D.material.map.magfilter = THREE.LinearFilter;
						object3D.material.map.minfilter = THREE.LinearFilter;
						object3D.material.map.anisotropy = 16;
						object3D.material.map.wrapT = THREE.ClampToEdgeWrapping;
						object3D.material.map.wrapS = THREE.ClampToEdgeWrapping;
					}
				}
			}
			var uvAttribute = geometry.attributes.uv;
			
				
			
			/*//console.log(Object.getOwnPropertyNames(THREE.WebGLRenderer));
			console.log(Object.getOwnPropertyNames(uvAttribute));
			var maxu = -1000;
			var minu = 1000000;
			var maxv = -10000;
			var minv = 1000000;	
            for (var i = 0; i < uvAttribute.count; i++ ) {
                var u = uvAttribute.getX(i)*repeat.x + offset.x;
                var v = uvAttribute.getY(i)*repeat.y + offset.y;
				
				if(u>maxu)maxu=u;
				if(u<minu)minu=u;
				if(v>maxv)maxv=v;
				if(v<minv)minv=v;	
		
                uvAttribute.setXY(i, u, v);
            }
			
			console.log("offset "+ offset.x + " MaxU: "+ maxu+" minU: "+ minu + "| MaxV: "+ maxv+" minV: "+ minv  );
*/
            // Fisheye to equirectangular projection: Ravimal 12/02/2023
			
			 function getInputPoint(x, y, srcwidth, srcheight)
			 {
				
				var pfish = {x: 0, y: 0};
				var psph = {x: 0, y: 0, z:0};
				var FOV =hFOV; //H/D
				var FOV2 = vFOV; //V
				var width = srcwidth;
				var height = srcheight;
				var theta = hFOV * (x / width - 0.5);
				var phi = vFOV * (y / height - 0.5);
				psph.x = Math.cos(phi) * Math.sin(theta);
				psph.y = Math.cos(phi) * Math.cos(theta);
				psph.z = Math.sin(phi);
				theta = Math.atan2(psph.z,psph.x);
				phi = Math.atan2(Math.sqrt(psph.x*psph.x+psph.z*psph.z),psph.y);
				r = width * phi / FOV;
				var r2 = height * phi / FOV2;
				pfish.x = 0.5 * width + r * Math.cos(theta);
				pfish.y = 0.5 * height + r2 * Math.sin(theta);
				return pfish;
			}
			var stereoFactor = this.data.split === 'none' ? 1 : 0.5;
			for (var i = 0; i < uvAttribute.count; i++ ) {
				/*var map = getInputPoint(uvAttribute.getX(i)*repeat.x, uvAttribute.getY(i)*repeat.y, stereoFactor, 1);
				var u = map.x + offset.x;
				var v = map.y + offset.y;*/
				var u = uvAttribute.getX(i)*repeat.x + offset.x;
                var v = uvAttribute.getY(i)*repeat.y + offset.y;
				uvAttribute.setXY(i, u, v);
            }

            uvAttribute.needsUpdate = true

            object3D.geometry = geometry

          }
          else{

              // No need to attach video click if not a sphere and not a video, set this to true

              this.video_click_event_added = true;

          }


       },

       // On element update, put in the right layer, 0:both, 1:left, 2:right (spheres or not)

       update: function(oldData){

            var object3D = this.el.object3D.children[0];
            var data = this.data;

            if(data.eye === "both"){
              object3D.layers.set(0);
            }
            else{
              object3D.layers.set(data.eye === 'left' ? 1:2);
            }

       },

       tick: function(time){

           // If this value is false, it means that (a) this is a video on a sphere [see init method]
           // and (b) of course, tick is not added

           if(!this.video_click_event_added && this.data.playOnClick){
                if(typeof(this.el.sceneEl.canvas) !== 'undefined'){

                   // Get video DOM

                   this.videoEl = this.el.object3D.children[0].material.map.image;

                   // On canvas click, play video element. Use self to not lose track of object into event handler

                   var self = this;

                   this.el.sceneEl.canvas.onclick = function () {
                      self.videoEl.play();
                   };

                   // Signal that click event is added
                   this.video_click_event_added = true;

                }
           }

       }
     },

  // Sets the 'default' eye viewed by camera in non-VR mode

  'stereocam_component':{

      schema: {
        eye: { type: 'string', default: "left"}
      },

       // Cam is not attached on init, so use a flag to do this once at 'tick'

       // Use update every tick if flagged as 'not changed yet'

       init: function(){
            // Flag to register if cam layer has already changed
            this.layer_changed = false;
       },

       tick: function(time){

            var originalData = this.data;

            // If layer never changed

            if(!this.layer_changed){

            // because stereocam component should be attached to an a-camera element
            // need to get down to the root PerspectiveCamera before addressing layers

            // Gather the children of this a-camera and identify types

            var childrenTypes = [];

            this.el.object3D.children.forEach( function (item, index, array) {
                childrenTypes[index] = item.type;
            });

            // Retrieve the PerspectiveCamera
            var rootIndex = childrenTypes.indexOf("PerspectiveCamera");
            var rootCam = this.el.object3D.children[rootIndex];

            if(originalData.eye === "both"){
                rootCam.layers.enable( 1 );
                rootCam.layers.enable( 2 );
              }
              else{
                rootCam.layers.enable(originalData.eye === 'left' ? 1:2);
              }
            }
       }

  }
};

},{}]},{},[1]);
