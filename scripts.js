import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js";
import { MTLLoader } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/loaders/OBJLoader.js";
import { Sky } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/objects/Sky.js';
import { OutlinePass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/OutlinePass.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/EffectComposer.js';
import { FXAAShader } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/shaders/FXAAShader.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/ShaderPass.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/RenderPass.js';

let camera, scene, renderer, controls;
let sky, sun;
scene = new THREE.Scene();
scene.background = new THREE.Color( 0x8cc7de );

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
camera.position.set( 250, 150, - 150 );

controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 300;
controls.maxDistance = 650;
controls.maxPolarAngle = (Math.PI / 2) - 0.001;
controls.rotateSpeed = 0.5;
controls.mouseButtons = { 
    LEFT : null,
    MIDDLE : THREE.MOUSE.PAN,
    RIGHT : THREE.MOUSE.ROTATE
}
var minPan = new THREE.Vector3( -800 , 0 , 0 );
    var maxPan = new THREE.Vector3( 100, 0 , 900 );
    var _v = new THREE.Vector3();
    
controls.addEventListener("change", function() {
    _v.copy(controls.target);
     controls.target.clamp(minPan, maxPan);
    _v.sub(controls.target);
    camera.position.sub(_v);
})

// controls.addEventListener('change', (event) => {
//     controls.target.x = -320;
//     controls.target.z = 450;
// });

const simGeometry = new THREE.ConeGeometry( 5, 10, 6 );
const simMaterial = new THREE.MeshStandardMaterial( { color: 0x17DD25, flatShading: true } );
const sim = new THREE.Mesh( simGeometry, simMaterial );
const sim2 = new THREE.Mesh( simGeometry, simMaterial );

sim.position.set(0, 0, 0);
scene.add(sim);
sim.castShadow = true;
sim2.castShadow = true;
sim.position.set(0, 15, 0);
sim2.position.set(0, 5, 0);
sim2.scale.y = -1;
scene.add(sim);
scene.add(sim2);

var randomX, randomZ, lastNodo = 0;
const nodos = [], calles = [], vincFamily = [];
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

Models();
houses();
buildings();
cars();
mapa();
mountains();

let coord = [
    {x:-50, y:0, z:240}, 
    {x:-60, y:0, z:340}, 
    {x:-210, y:0, z:340}, 
    {x:-210, y:0, z:650}, 
    {x:-210, y:0, z:210}, 
    {x:-580, y:0, z:230}, 
    {x:-580, y:0, z:700}, 
    {x:-60, y:0, z:690}, 
    {x:-60, y:0, z:550}, 
    {x:-580, y:0, z:350}, 
    {x:-580, y:0, z:550}, 
    {x:-210, y:0, z:570},
    {x:-580, y:0, z:450}
];

let newcar = null;
let newcar2 = null;

function houses() {
    let n = 7;
    for (let index = 1; index <= n; index++) {
        mtlLoader.load('./res/models/house_type0' + index + '.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('./res/models/house_type0' + index + '.obj', (root) => {
                root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
                    root.position.set( coord[index - 1].x , coord[index - 1].y , coord[index - 1].z );
                    if(coord[index - 1].x == -210)  root.rotation.y= 3 * (Math.PI) /  -2;
                    else if (coord[index-1].x == -580)  root.rotation.y= 3 * (Math.PI) /  -2;
                    else root.rotation.y = Math.PI / - 2;
                    root.name = 'house' + index + '';
                    scene.add(root);
                    genGrafo("house", index - 1);
            });
        });
    }
}


function buildings() {
    let buildingsArray = ["school", "agua", "luz", "hospital", "bomberos"];
    for (let index = 1; index <= buildingsArray.length; index++) {
        mtlLoader.load('./res/models/large_building0' + index + '.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('./res/models/large_building0' + index + '.obj', (root) => {
                root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
                root.position.set( coord[index + 6].x , coord[index + 6].y , coord[index + 6].z );
                if(coord[index-1].x == -210)  root.rotation.y= 3*(Math.PI) /  -2;
                else root.rotation.y = Math.PI / - 2;
                root.name = buildingsArray[index - 1];
                scene.add(root);
                genGrafo(buildingsArray[index - 1], index + 6);
            });
        });
    }
}

function cars() {
    let carsArray = ["suv", "sedan", "sedanSports", "truckFlat", "van", "police", "ambulance", "firetruck"];
    for (let index = 1; index <= carsArray.length; index++) {
        mtlLoader.load('./res/models/' + carsArray[index - 1] + '.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('./res/models/' + carsArray[index - 1] + '.obj', (root) => {
                root.scale.x = 15, root.scale.z = 15, root.scale.y = 15;
                switch (index) {
                    case 1:
                        randomX = nodos[0].x - 20, randomZ = nodos[0].z + 10;
                        root.rotation.y = Math.PI / 2;
                        break;
                    case 2:
                        randomX = nodos[1].x + 10, randomZ = nodos[1].z - 20;
                        root.rotation.y = Math.PI / 2;
                        break;
                    case 3:
                        randomX = nodos[2].x, randomZ = nodos[2].z - 50;
                        root.rotation.y = Math.PI / -2;
                        break;
                    case 4:
                        randomX = nodos[3].x + 15, randomZ = nodos[3].z - 10;
                        root.rotation.y = Math.PI / -2;
                        break;
                    case 5:
                        randomX = nodos[4].x - 10, randomZ = nodos[4].z + 20;
                        root.rotation.y = Math.PI / -2;
                        break;
                    case 7:
                        randomX = nodos[11].x - 20, randomZ = nodos[11].z + 55; // ambulance
                        root.rotation.y = Math.PI / -2;
                        break;
                    case 8:
                        randomX = nodos[7].x - 10, randomZ = nodos[7].z + 20; // firetruck
                        root.rotation.y = Math.PI / -2;
                        break;
                    default:
                        randomX = -330, randomZ = 100;
                        root.rotation.y = Math.PI / -2;
                        break;
                }
                root.position.set(randomX, 0, randomZ);
                root.castShadow = true;
                root.receiveShadow = true;
                root.name = carsArray[index - 1];
                scene.add(root);
            });
        });
    }
}

function Models(){
    mtlLoader.load('./res/models/police.mtl', (mtl) => {
        mtl.preload();
        mtl.materials.carTire.color = {r: 1, g: 0.227451, b: 0.3019608};
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('./res/models/police.obj', (root) => {
            newcar = root;
            newcar.position.set(40,0,110);
            newcar.scale.set(15,15,15);
            scene.add(newcar);
        });
    });

    mtlLoader.load('./res/models/firetruck.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('./res/models/firetruck.obj', (root) => {
            newcar2 = root;
            newcar2.position.set(20,0,110);
            newcar2.scale.set(15,15,15);
            scene.add(newcar2);
        });
    });
}

function mapa() {

    mtlLoader.load('./res/models/mapa.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        Object.keys(mtl.materials).forEach( function(key) { 
            mtl.materials[key].flatShading = true;
            mtl.materials[key].side = 2;
        });
        objLoader.setMaterials(mtl);
        objLoader.load('./res/models/mapa.obj', (root) => {
            root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
            root.position.set(-320, 0, 450);
            root.rotation.y = 0;
            root.castShadow = true;
            root.receiveShadow = true;
            scene.add(root);
        });
    });

}

function mountains() {
    for (let jndex = 0; jndex < 4; jndex++) {
        for (let index = 0; index < 10; index++) {
            mtlLoader.load('./res/models/mountain.mtl', (mtl) => {
                mtl.preload();
                mtl.materials.ground.color =  {r: 0.20784313725490197, g: 0.40784313725490196, b: 0.17647058823529413};
                const objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load('./res/models/mountain.obj', (root) => {
                    switch (jndex) {
                        case 0:
                            root.position.set( -1100 , -0.5 , -400 + ( index * 220 ));
                            break;
                        case 1:
                            root.position.set( 400 , -0.5 , -400 + ( index * 220 ));
                            root.rotation.y = 3 * Math.PI / 3;
                            break;
                        case 2:
                            root.position.set( -1100 , -0.5 , -400 + ( index * 220 ));
                            root.position.set( 500 - (index*220) , -0.5 , -300 );
                            root.rotation.y = 3 * Math.PI / 2;
                            break;
                        case 3:
                            root.position.set( -1100 , -0.5 , -400 + ( index * 220 ))
                            root.position.set( 500 - ( index * 220 ), -0.5 , 1200);
                            root.rotation.y = Math.PI / 2;
                            break;
                        default:
                            break;
                    }
                    root.scale.set(50, 50, 50);
                    scene.add(root);
                });
            });
        }
    }
}


let controlPoints= [
    {x:35, y:0, z:90}, 
    {x:15, y:0, z:110}, 
    {x:35, y:0, z:440}, 
    {x:35, y:0, z:460}, 
    {x:20, y:0, z:440}, 
    {x:20, y:0, z:460}, 
    {x:35, y:0, z:800}, 
    {x:15, y:0, z:780}, 
    
    {x:-330, y:0, z:90}, 
    {x:-310, y:0, z:90}, 
    {x:-330, y:0, z:110}, 
    {x:-310, y:0, z:110},
    {x:-330, y:0, z:440}, 
    {x:-310, y:0, z:440}, 
    {x:-330, y:0, z:460}, 
    {x:-310, y:0, z:460},
    {x:-310, y:0, z:800}, 
    {x:-330, y:0, z:800}, 
    {x:-310, y:0, z:780}, 
    {x:-330, y:0, z:780},

    {x:-680, y:0, z:90}, 
    {x:-660, y:0, z:110}, 
    {x:-680, y:0, z:800}, 
    {x:-660, y:0, z:780}
];

// sky

sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );

sun = new THREE.Vector3();

var elevation = -20;

var uniforms = sky.material.uniforms;
uniforms[ 'turbidity' ].value = 20;
uniforms[ 'rayleigh' ].value = 0.425;
uniforms[ 'mieCoefficient' ].value = 0.002;
uniforms[ 'mieDirectionalG' ].value = 0.99;


// lights

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff , 0.2 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 200, 0 );
scene.add( hemiLight );

const hemiHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
scene.add( hemiHelper );

const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( 1, 1.75, -1 );
dirLight.position.multiplyScalar( 300 );
scene.add( dirLight );

dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

const d = 50;

dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;
dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = - 0.0001;

const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
scene.add( dirLightHelper );

const ground = new THREE.Mesh(
    new THREE.BoxGeometry( 1750, 2000, 10, 1 ),
    new THREE.MeshStandardMaterial( { color: 0x35682d  } )
);
ground.rotation.x = - Math.PI / 2;
ground.position.set( - 500, - 5, 500);
ground.receiveShadow = true;
scene.add( ground );

window.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'pointerdown', onPointerDown );
window.requestAnimationFrame(render);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function genGrafo(type , index) {
    nodos.push({ id: ++lastNodo, type: type, weight: parseInt(Math.random() * 100 + 1), x: coord[index].x , z: coord[index].z })
    globalThis.nodos = nodos;
    if ( type !== "house" ) return;
    let nRandom = Math.floor(Math.random() * 5);
    let l = nodos[lastNodo - 1];
    let family = [];
    switch (nRandom) { // Necesita condición (nRandom debe ser >= 2 al menos 1 vez)
        case 0:
            family.push({ type: "adult"});
            break;
        case 1:
            family.push({ type: "adult"});
            family.push({ type: "adult"});
            break;
        case 2:
            family.push({ type: "adult"});
            family.push({ type: "adult"});
            family.push({ type: "child"});
            break;
        case 3:
            family.push({ type: "adult"});
            family.push({ type: "adult"});
            family.push({ type: "child"});
            family.push({ type: "child"});
            break;
        case 4:
            family.push({ type: "adult"});
            family.push({ type: "adult"});
            family.push({ type: "child"});
            family.push({ type: "child"});
            family.push({ type: "child"});
            break;
        default:
            break;
    }
    vincFamily.push({ house: l, family: family});
    globalThis.family = family;
    globalThis.vincFamily = vincFamily;  
}


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObjects = [], composer, outlinePass, effectFXAA;
composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

effectFXAA = new ShaderPass( FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
composer.addPass( effectFXAA );

outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
composer.addPass( outlinePass );

outlinePass.edgeStrength = 3;
outlinePass.edgeGlow = 0;
outlinePass.edgeThickness = 1;
outlinePass.pulsePeriod = 0;
outlinePass.rotate = false;
outlinePass.usePatternTexture = false;
outlinePass.visibleEdgeColor.set( '#ffffff' );
outlinePass.hiddenEdgeColor.set( '#190a05' );

renderer.domElement.addEventListener( 'pointermove', onPointerMove );

function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    checkIntersection();

}

function addSelectedObject( object ) {

    selectedObjects = [];
    selectedObjects.push( object );

}

function checkIntersection() {

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObject( scene, true );

    if ( intersects[0].object.name.startsWith('house')  ) {

        const selectedObject = intersects[ 0 ].object;
        addSelectedObject( selectedObject );
        outlinePass.selectedObjects = selectedObjects;

    } else outlinePass.selectedObjects = [];

}

function onPointerDown(event) {

    if (event.button != 0) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( scene.children, true );
    if ( intersects[0].object.name.startsWith('house') ) {

        const object = intersects[0].object;
        console.log(object)

        let familyModal = new WinBox(object.name, {
            border: 0,
            width: 400,
            height: 600,
            x: "70%",
            y: "bottom",
            class: [
                "no-min",
                "no-max",
                "no-full",
                "no-resize",
            ],
        });
        
        let houseSelected = object.name[object.name.length - 1] - 1;
        let stringHTML = '<div class="family">';
        //console.log(houseSelected , vincFamily[houseSelected].family.length);
        if (vincFamily[houseSelected].family.length > 2 ) {
            for (let index = 0; index < 2; index++) {
                stringHTML += '<img src="./res/img/' + familyInfo('genderAdult') + familyInfo('nRNG')  + '.png" style="height: 70px; width: 70px; margin: 25px;" >';
            }
            for (let index = 0; index < vincFamily[houseSelected].family.length - 2; index++) {
                stringHTML += '<img src="./res/img/' + familyInfo('genderChild') + familyInfo('nRNG')  + '.png" style="height: 70px; width: 70px; margin: 25px;" >';
            }
        }
        else {
            for (let index = 0; index < vincFamily[houseSelected].family.length; index++) {
                stringHTML += '<img src="./res/img/' + familyInfo('genderAdult') + familyInfo('nRNG') + '.png" style="height: 70px; width: 70px; margin: 25px;" >';
            }
        }
        stringHTML += '</div>';
        familyModal.body.innerHTML = stringHTML;
    }
}

function familyInfo(type) {

    let genderAdult, genderChild, nRNG;

    switch (type) {
        case 'genderAdult':
            if ( (Math.floor(Math.random() * 2)) ) genderAdult = "man0";
            else  genderAdult = "woman0";
            return genderAdult;
        case 'genderChild':
            if ( (Math.floor(Math.random() * 2)) ) genderChild = "boy0";
            else  genderChild = "girl0";
            return genderChild;
        case 'nRNG':
            return nRNG = Math.floor(Math.random() * 2 + 1)
    }
}

function animate() {
    requestAnimationFrame( animate );

    sim.rotation.y += 0.02;
    sim2.rotation.y += 0.02;


    if(newcar){
        if (newcar.position.z >= 807){
            newcar.position.x -= 0.6;
            newcar.rotation.y = Math.PI / -2;
        }
        else 
        newcar.position.z += 0.6;
        
        newcar2.position.z += 0.8;
    }
    

    
    elevation += 0.05553
    const phi = THREE.MathUtils.degToRad( 90 - elevation );
    const theta = THREE.MathUtils.degToRad( 180 );
    sun.setFromSphericalCoords( 1, phi, theta );
    uniforms[ 'sunPosition' ].value.copy( sun );

    if ( elevation > 90 ) {
        hemiLight.intensity -= 0.000203;
        dirLight.intensity -= 0.000203;
        hemiLight.color.setHSL( 28, 95, 46 ); 
        dirLight.color.setHSL( 28, 95, 46 );
    }

    if ( elevation > 180 ) {
        hemiLight.intensity = 0;
        dirLight.intensity = 0.04;
    }
    if ( elevation > 240 ) {
        elevation = 0;
        hemiLight.intensity += 0.25555;
        dirLight.intensity += 0.55555;

       /*  uniforms[ 'turbidity' ].value += 0.988;
        uniforms[ 'rayleigh' ].value += 0.43157;
        uniforms[ 'mieCoefficient' ].value += 0.0011;
        uniforms[ 'mieDirectionalG' ].value += 0.11; 
        */
       
    }
    if ( elevation > 360) {
        hemiLight.color.setHSL( 34, 100, 50 );
        dirLight.color.setHSL( 34, 100, 50 );
        hemiLight.intensity += 0.4199;
        dirLight.intensity += 0.5199; 
    }

    controls.update();
    //render();
    composer.render();
}

function render() {
    raycaster.setFromCamera(mouse, camera);

    //const intersects = raycaster.intersectObjects(scene.children);

    /*
    for (let i = 0; i < intersects.length; i++) {
        console.log(intersects[i]);
    }
    */
    renderer.render( scene, camera );

}

animate();