import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { MapControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js";
import { MTLLoader } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/loaders/OBJLoader.js";
import { Sky } from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/objects/Sky.js';

let camera, scene, renderer, controls;
let sky, sun;
scene = new THREE.Scene();
scene.background = new THREE.Color( 0x8cc7de );

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild( renderer.domElement );

camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
camera.position.set( 250, 150, - 150 );

controls = new MapControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 300;
controls.maxDistance = 650;
controls.maxPolarAngle = (Math.PI / 2) - 0.001;

const simGeometry = new THREE.ConeGeometry( 5, 10, 6 );
const simMaterial = new THREE.MeshStandardMaterial( { color: 0x17DD25, flatShading: true } );
const sim = new THREE.Mesh( simGeometry, simMaterial );
const sim2 = new THREE.Mesh( simGeometry, simMaterial );

sim.position.set(0, 0, 0);
scene.add(sim);

const geomCalle = new THREE.BoxGeometry(50, 2, 100);
const materialCalle = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

var randomX, randomZ, lastNodo = 0;
const nodos = [], calles = [], vincFamily = [];
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

mtlLoader.load('./res/models/house_type01.mtl', function() {null});

houses();
buildings();
cars();
mapa();
//genCalles();

function houses() {
    let n = 5;
    for (let index = 1; index <= n; index++) {
        mtlLoader.load('./res/models/house_type0' + index + '.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('./res/models/house_type0' + index + '.obj', (root) => {
                root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
                randomX = - (Math.random() * 800), randomZ = Math.random() * 1000; // necesita alg spacing
                root.position.set(randomX, 0, randomZ);
                root.rotation.y = Math.PI / - 2;
                root.castShadow = true;
                root.receiveShadow = true;
                root.name = 'house' + index + '';
                scene.add(root);
                genGrafo("house");
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
                randomX = - (Math.random() * 800), randomZ = Math.random() * 1400; // necesita alg spacing
                root.position.set(randomX, 0, randomZ);
                root.rotation.y = Math.PI / - 2;
                root.castShadow = true;
                root.receiveShadow = true;
                root.name = buildingsArray[index - 1];
                scene.add(root);
                genGrafo(buildingsArray[index - 1]);
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
                        break;
                    case 2:
                        randomX = nodos[1].x + 10, randomZ = nodos[1].z - 20;
                        break;
                    case 3:
                        randomX = nodos[2].x, randomZ = nodos[2].z - 50;
                        break;
                    case 4:
                        randomX = nodos[3].x + 15, randomZ = nodos[3].z - 52.5;
                        break;
                    case 5:
                        randomX = nodos[4].x, randomZ = nodos[4].z - 20;
                        break;
                    case 7:
                        randomX = nodos[9].x + 20, randomZ = nodos[9].z - 55; // ambulance
                        break;
                    case 8:
                        randomX = nodos[5].x, randomZ = nodos[5].z - 20; // firetruck
                        break;
                    default:
                        randomX = Math.random() * 1000 - 500, randomZ = Math.random() * 1000 - 500; // necesita relative coords
                        break;
                }
                root.position.set(randomX, 0, randomZ);
                root.rotation.y = Math.PI / 2;
                root.castShadow = true;
                root.receiveShadow = true;
                root.name = carsArray[index - 1];
                scene.add(root);
            });
        });
    }
}

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
    new THREE.BoxGeometry( 1750, 2000, 1000, 1 ),
    new THREE.MeshStandardMaterial( { color: 0x233426  } )
);
ground.rotation.x = - Math.PI / 2;
ground.position.set( - 500, - 500, 500)
ground.receiveShadow = true;
scene.add( ground );

window.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'mousedown', onMouseDown, false );
window.requestAnimationFrame(render);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function genGrafo(type) {
    nodos.push({ id: ++lastNodo, type: type, weight: parseInt(Math.random() * 100 + 1), x: randomX, z: randomZ })
    globalThis.nodos = nodos;
   //if ( lastNodo > 9 ) genCalles();
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


function genCalles() {
    var sortedNodos = [];
    sortedNodos =  JSON.parse(JSON.stringify(nodos));
    sortedNodos.sort(function(a, b){return a.z - b.z});
    globalThis.sortedNodos = sortedNodos;
    var lastSort = sortedNodos.length - 1;
    var leastZ = sortedNodos[0].z
    var leastX = sortedNodos[0].x
    var mostZ = sortedNodos[lastSort].z
    var lastRoad = 0;
    var diffX = Math.abs(sortedNodos[lastSort].x) - Math.abs(sortedNodos[0].x);
    globalThis.diffX = diffX;
    
    for (let index = 0; index < 2 * (Math.round( mostZ / 100 ) ); index++) {
        
        mtlLoader.load('./res/models/road_straight.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('./res/models/road_straight.obj', (root) => {
                root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
                root.position.z = leastZ;
                root.position.x = leastX + 70;
                root.rotation.y = Math.PI / 2;

                root.matrixAutoUpdate = false;
                root.updateMatrix();
                
                scene.add(root);
                
                leastZ += 50;
            })
        })
    }

    leastZ -= 50;
    lastRoad = sortedNodos[0].x + 70;

    mtlLoader.load('./res/models/road_bend.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('./res/models/road_bend.obj', (root) => {
            root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
            root.position.z = leastZ;
            root.position.x = leastX + 70;

            if ( Math.sign(diffX) > 0 ) root.rotation.y = Math.PI / - 2;
            else if ( Math.abs(diffX) < 100 ) return;
            else root.rotation.y = Math.PI ;

            root.matrixAutoUpdate = false;
            root.updateMatrix();
            
            scene.add(root);
        })
    })
    
    if ( Math.sign(diffX) > 0 ) leastX += 50;
    else leastX -= 50;

    for (let index = 0; index < 2 * (Math.ceil( Math.abs(diffX) / 100 )); index++) {

        mtlLoader.load('./res/models/road_straight.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('./res/models/road_straight.obj', (root) => {
                root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
                root.position.z = leastZ;
                root.position.x = lastRoad;

                root.matrixAutoUpdate = false;
                root.updateMatrix();
                
                scene.add(root);
                
                if ( Math.sign(diffX) > 0 ) lastRoad -= 50;
                if ( Math.sign(diffX) < 0 ) {
                    lastRoad += 50;
                    console.log("AAA");
                } 
            })
        })
    }
    /*
    sortedNodos.pop();
    sortedNodos.shift();
    genCalles();
    */
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame( animate );

    sim.rotation.y += 0.02;
    sim2.rotation.y += 0.02;
    
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
    render();
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

function mapa() {

    mtlLoader.load('./res/models/mapa.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('./res/models/mapa.obj', (root) => {
            root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
            randomX = - (Math.random() * 800), randomZ = Math.random() * 1400; // necesita alg spacing
            root.position.set(randomX, 0, randomZ);
            root.rotation.y = Math.PI / - 2;
            root.castShadow = true;
            root.receiveShadow = true;
            scene.add(root);
        });
    });

}


animate();