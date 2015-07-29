
//Get output value from dimension slider
function outputUpdate(value, dim) {
    switch (dim){
        case H:
            document.querySelector('#H').value = value;
            break;
        case Len:
            document.querySelector('#Len').value = value;
            break;
        case l:
            document.querySelector('#l').value = value;
            break;
        case Height_table:
            document.querySelector('#Height_table').value = value;
            break;
        case Length_table:
            document.querySelector('#Length_table').value = value;
            break;
        case Width_table:
            document.querySelector('#Width_table').value = value;
            break;
        case Height_banc:
            document.querySelector('#Height_banc').value = value;
            break;
        case Length_banc:
            document.querySelector('#Length_banc').value = value;
            break;
        case Width_banc:
            document.querySelector('#Width_banc').value = value;
            break;
    }
}
//Toggle dimension div depending on selected design
function toggleDiv(design) {
    if (design == 0) {
        document.getElementById('dim_stool').style.display = 'block';
        document.getElementById('dim_table').style.display = 'none';
        document.getElementById('dim_banc').style.display = 'none';
    }
    if (design == 1) {
        document.getElementById('dim_stool').style.display = 'none';
        document.getElementById('dim_table').style.display = 'block';
        document.getElementById('dim_banc').style.display = 'none';
    }
    if (design == 2) {
        document.getElementById('dim_stool').style.display = 'none';
        document.getElementById('dim_table').style.display = 'none';
        document.getElementById('dim_banc').style.display = 'block';
    }
}

//Reset camera to initial position
function resetView() {
    controls.reset();
    if (design == 0){
        tmp_rotation = 0;
    }
    else {
        tmp_rotation = 1.15;
    }
    scene.traverse( function( node ) {
        if (  node instanceof THREE.Line || node instanceof THREE.Mesh) {
            node.rotation.z =tmp_rotation;
        }
    });
}


//Build surface mesh from model
function setupMesh(geometry, material){
    for (i = 0; i < geometry[0].length; i++){
        var m = new THREE.Mesh(geometry[0][i], material);
        scene.add (m);
    }
}

//Build wireframe from model
function setupWire(wires){
    for (i = 0; i < wires[0].length; i++){
        var w = new THREE.Line(wires[0][i], new THREE.LineBasicMaterial( {color :0x000000, linewidth : 1}));
        scene.add (w);
    }
}

//Toggle materials/textures
function textureDef(str, basic, texture1, texture2, texture3){
    switch(str){
        case 'none':
            return basic;
        case 'bois1':
            return texture1;
        case 'bois2':
            return texture2;
        case 'bois3':
            return texture3;
    }
}

