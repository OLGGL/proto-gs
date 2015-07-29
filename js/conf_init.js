/**
 * Created by Guillaume on 2015-07-29.
 */

function initializeScene(){
    if(Detector.webgl){
        renderer = new THREE.WebGLRenderer({antialias:true});
    } else {
        renderer = new THREE.CanvasRenderer();
        console.log('CANVAS')
    }

    renderer.setClearColor(0xFFFFFF, 1);
    canvasWidth =window.innerWidth-365;
    canvasHeight = window.innerHeight;
    renderer.setSize(canvasWidth, canvasHeight);

    document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 10000);
    scene.add(camera);

    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 2.5;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.9;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];
    controls.position0.set(2200,0,550);
    controls.target0.set(400, 0, 0);
    controls.up0.set(0,0,1);
    controls.reset();

    var material = new THREE.MeshBasicMaterial( { color: 0x888888 } );
    //var material = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture('./bois3.jpg')})

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0xbbbbbb);
    scene.add(ambientLight);

    // directional lighting
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 500, 500).normalize();
    scene.add(directionalLight);


//        setupGui();
}

function animateScene(){

    if (boolRotation){
        scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh || node instanceof THREE.Line) {
                node.rotation.z += 0.01;
                tmp_rotation = node.rotation.z;
            }
        } );
    }
    requestAnimationFrame(animateScene);
    renderScene();
    controls.update();
}

function renderScene(){

    if (document.querySelector('#H').value != H || document.querySelector('#Len').value != L || document.querySelector('#l').value != l || selectedMaterial != MAT || (window.innerWidth -365) != canvasWidth || tmp_wireframe != wireframe || tmp_design != design || document.querySelector('#Height_table').value != Ht || document.querySelector('#Length_table').value != Lt || document.querySelector('#Width_table').value != Wt || document.querySelector('#Height_banc').value != Hb || document.querySelector('#Length_banc').value != Lb || document.querySelector('#Width_banc').value != Wb){
        H = document.querySelector('#H').value;
        L = document.querySelector('#Len').value;
        l = document.querySelector('#l').value;
        Ht = document.querySelector('#Height_table').value;
        Lt = document.querySelector('#Length_table').value;
        Wt = document.querySelector('#Width_table').value;
        Hb = document.querySelector('#Height_banc').value;
        Lb = document.querySelector('#Length_banc').value;
        Wb = document.querySelector('#Width_banc').value;
        MAT = selectedMaterial;
        toggleDiv(design);
        tmp_design = design;
        canvasWidth = window.innerWidth - 365;
        wireframe = tmp_wireframe;
        // responsivness
        renderer.setSize(window.innerWidth -365, window.innerHeight);
        camera.aspect = (window.innerWidth-365) / window.innerHeight;
        camera.updateProjectionMatrix();
        if (design == 0){
            type= 'Stool';
            ModuleName = type+String(L)+String(l)+String(H)+String(115);
            controls.position0.set(1400,350,950);
            controls.target0.set(0, 20, 180);
            controls.up0.set(0,0,1);
            if (tmpModname != type) {
                controls.reset();
                tmp_rotation = 0;
            }
        }
        if (design == 1) {
            type= 'Table';
            ModuleName = type+String(Lt)+String(Wt)+String(Ht);
            controls.position0.set(1400,0,550);
            controls.target0.set(400, 0, 0);
            controls.up0.set(0,0,1);
            if (tmpModname != type) {
                controls.reset();
                tmp_rotation = 1.15;
            }
        }
        if (design == 2) {
            type= 'Banc';
            ModuleName = type+String(Lb)+String(Wb)+String(Hb);
            controls.position0.set(2200,0,550);
            controls.target0.set(400, 0, 0);
            controls.up0.set(0,0,1);
            if (tmpModname != type) {
                controls.reset();
                tmp_rotation = 1.15;
            }
        }
        tmpModname = type;
        jQuery.getScript('./new_model/'+ModuleName+'.js')
            .done(function() {
                console.log(ModuleName);
                remove = [];
                scene.traverse( function( node ) {
                    if ( node instanceof THREE.Mesh || node instanceof THREE.Line) {
                        remove.push(node);
                    }
                } );
                var codeToExecute_geom = "return "+ModuleName+'.geom()';
                var tmpFunc_geom = new Function(codeToExecute_geom);
                geometry = tmpFunc_geom();


                if (wireframe) {
                    var codeToExecute_wires = "return "+ModuleName+'.wireframe()';
                    var tmpFunc_wires = new Function(codeToExecute_wires);
                    wire = tmpFunc_wires();
                    setupWire(wire);
//                                        for (var i=0; i<remove.length; i++) {
//                                            scene.remove(remove[i]);
//                                        }
                    scene.traverse( function( node ) {
                        if (  node instanceof THREE.Line) {
                            node.rotation.z =tmp_rotation;
                        }
                    } );
                }

                setupMesh(geometry, textureDef(MAT, basematerial, texture1, texture2, texture3 ));
                for (var i=0; i<remove.length; i++) {
                    scene.remove(remove[i]);
                }
                scene.traverse( function( node ) {
                    if ( node instanceof THREE.Mesh ) {
                        node.rotation.z =tmp_rotation;
                    }
                } );
            })
            .fail(function() {
                /* boo, fall back to something else */
                console.log('Failed');
            });
    }
    renderer.render(scene, camera);
}