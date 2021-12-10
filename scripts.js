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
import Stats from 'https://cdn.skypack.dev/three@0.133.1/examples/jsm/libs/stats.module.js';

let camera, scene, renderer, controls;
let sky, sun;
scene = new THREE.Scene();
scene.background = new THREE.Color( 0x8cc7de );

const loadingManager = new THREE.LoadingManager( () => {
	
    const loadingScreen = document.getElementById( 'loading-screen' );
    loadingScreen.classList.add( 'fade-out' );
    
    loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
    
} );

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
controls.maxDistance = 510;
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

const sirena = new Audio('./res/sirena.wav');
const bomberos = new Audio('./res/bomberos.wav');
const ambulancia = new Audio('./res/ambulance.wav');

let familyModal = new WinBox("House", {
    border: 0,
    width: 400,
    height: 600,
    x: window.innerWidth > 1100 ? "77.25%" : "center",
    y: "bottom",
    class: [
        "terminal",
        "houseModal",
        "hidden",
        "no-close",
        "no-max",
        "no-full",
        "no-resize",
    ],
});
familyModal.body.innerHTML = '<div class="move-select"><span class="goto">Go to: </span><select class="selector"><option value="" selected disabled hidden>Choose here</option><option value="luz">Luz</option><option value="agua">Agua</option><option value="school">Escuela</option><option value="market">Supermercado</option></select><button class="btn2">⮞</button></div>';
familyModal.body.innerHTML += '<div class="eventos"><button class="boton" name="incendio"><img style="height: 70px; width: 70px;" src="./res/img/firefighter.png"></button><button class="boton" name="robo"><img style="height: 70px; width: 70px;" src="./res/img/bad-person.png"></button><button class="boton" name="ambulancia"><img style="height: 70px; width: 70px;" src="./res/img/doctor.png"></button></div><div class="block"></div>';
globalThis.familyModal = familyModal;

var goto, axis, sign, rotation, distance, rIndex = 0, back = null, arrived = null;

var timer = document.querySelector(".time");

var gotoBtn = document.querySelector(".btn2");
gotoBtn.addEventListener("click", e => {
    goto = document.querySelector(".selector").value;
    logConsole.body.innerHTML += '<p>Selected location: ' + goto + '</p>';
    document.querySelector(".block").style.visibility = "visible";
    document.querySelector(".eventos").style.filter = "opacity(0.6) grayscale(1)";
    document.querySelector(".move-select").style.filter = "opacity(0.6) grayscale(1)";
    arrived = false;
    rIndex = 0;
    newcar = nodos[houseSelected].car;
    route(goto);
    turnCar();
})

var incendioBtn = document.querySelector('.boton[name="incendio"]');
incendioBtn.addEventListener("click", e => {
    if (muteBtn.value == "on") {
        bomberos.play();
    }
    bomberos.loop = true; 
    logConsole.body.innerHTML += "<p>firefighters were called at " + nodos[houseSelected].type + " x:" + nodos[houseSelected].x + " z:" +  nodos[houseSelected].z + "</p>";
    document.querySelector(".block").style.visibility = "visible";
    document.querySelector(".eventos").style.filter = "opacity(0.6) grayscale(1)";
    document.querySelector(".move-select").style.filter = "opacity(0.6) grayscale(1)";

    var goto = nodos[houseSelected].type
    arrived = false;
    rIndex = 0;
    for (let i of allNodes.slice(0, 12)) {
        if (i.type == "bomberos") {
           houseSelected = i.id - 1
        }
    }
    newcar = nodos[houseSelected].car;
    route(goto);
    turnCar();
})

var roboBtn = document.querySelector('.boton[name="robo"]');
roboBtn.addEventListener("click", e => {
    if (muteBtn.value == "on")  sirena.play();      
    else sirena.pause();
    sirena.loop = true;
    logConsole.body.innerHTML += "<p>the police was called at " + nodos[houseSelected].type + " x:" + nodos[houseSelected].x + " z:" +  nodos[houseSelected].z + "</p>";
    document.querySelector(".block").style.visibility = "visible";
    document.querySelector(".eventos").style.filter = "opacity(0.6) grayscale(1)";
    document.querySelector(".move-select").style.filter = "opacity(0.6) grayscale(1)";

    var goto = nodos[houseSelected].type
    arrived = false;
    rIndex = 0;
    for (let i of allNodes.slice(0, 12)) {
        if (i.type == "comisaria") {
           houseSelected = i.id - 1
        }
    }
    newcar = nodos[houseSelected].car;
    route(goto);
    turnCar();

})

var ambulanciaBtn = document.querySelector('.boton[name="ambulancia"]');
ambulanciaBtn.addEventListener("click", e => {
    if (muteBtn.value == "on") {
        ambulancia.play();
    }
    ambulancia.loop = true;
    logConsole.body.innerHTML += "<p>the ambulance was called at " + nodos[houseSelected].type + " x:" + nodos[houseSelected].x + " z:" +  nodos[houseSelected].z + "</p>";
    document.querySelector(".block").style.visibility = "visible";
    document.querySelector(".eventos").style.filter = "opacity(0.6) grayscale(1)";
    document.querySelector(".move-select").style.filter = "opacity(0.6) grayscale(1)";

    var goto = nodos[houseSelected].type
    arrived = false;
    rIndex = 0;
    for (let i of allNodes.slice(0, 12)) {
        if (i.type == "hospital") {
           houseSelected = i.id - 1
        }
    }
    newcar = nodos[houseSelected].car;
    route(goto);
    turnCar();
})

var muteBtn = document.querySelector('.boton[name="mute"]');
muteBtn.addEventListener("click", e => {   
    if (muteBtn.value == "on") {
        sirena.pause();
        ambulancia.pause();
        bomberos.pause();
        logConsole.body.innerHTML += '<p>audio muted</p>';
        muteBtn.value = "off";
        muteBtn.children[0].src = "./res/img/muted.png";
    }
    else {
        logConsole.body.innerHTML += '<p>audio unmuted</p>';
        muteBtn.value = "on";
        muteBtn.children[0].src = "./res/img/volume.png";
    }
})

let logConsole = new WinBox("user@simcity:~",{
    minimized: true,
    border: 0,
    width: "50%",
    height: "50%",
    x: "center",
    y: "center",
    class: [
        "terminal",
        "no-close",
        "no-full",
        "no-resize",
    ],
});

logConsole.minimize(true);
logConsole.body.innerHTML = '<p></p><a class="tcolor1">user</a><a>@</a><a class="tcolor1">simcity</a><a>:</a><a class="pwd">~</a><a class="cmd">$ ./simulation.sh</a><div id="performance"></div>';

const clock = new THREE.Clock();
const performance = document.getElementById( 'performance' );
const stats = new Stats();
performance.appendChild( stats.dom );

var randomX, randomZ, lastNodo = 0, houseSelected = null, objSelected = null, tempSelected = null;
const nodos = [], vincFamily = [];
const mtlLoader = new MTLLoader(loadingManager);

let coordBuildings = [
    {x:-80, y:0, z:110},  //casa inferior-centro-derecha
    {x:-80, y:0, z:240},  //casa inferior-cenrto-izquierda
    {x:-230, y:0, z:240}, //casa centro-izquierda
    {x:-230, y:0, z:580}, //casa centro-far-izquierda
    {x:-230, y:0, z:110}, //casa centro-derecha
    {x:-80, y:0, z:590},  //school
    {x:-80, y:0, z:450},  //agua
    {x:-600, y:0, z:270}, //luz
    {x:-600, y:0, z:450}, //hospital
    {x:-230, y:0, z:470}, //bomberos
    {x:-800, y:0, z:300}, //supermarket
    {x:-800, y:0, z:500}  //police
];

var streetNodes = [
    {id: 13, type:"corner", x:-10, z:5},           // 9 esquina inferior-derecha
    {id: 14, type:"intersection", x:-10, z:350},   // 8 interseccion inferior-centro
    {id: 15, type:"corner", x:-10, z:690},         // 7 esquina inferior-izquierda
    {id: 16, type:"intersection", x:-360, z:5},    // 6 interseccion centro-derecha
    {id: 17, type:"intersection", x:-360, z:350},  // 5 interseccion centro-centro
    {id: 18, type:"intersection", x:-360, z:690},  // 4 interseccion centro-izquierda
    {id: 19, type:"corner", x:-690, z:5},          // 3 esquina superior-derecha
    {id: 20, type:"corner", x:-690, z:690}          // 1 esquina superior-izquierda
];

var streetLinks = [
    {source: streetNodes[0], target: streetNodes[1], weight: Math.floor(Math.random() * 100)},{source: streetNodes[1], target: streetNodes[0], weight: Math.floor(Math.random() * 100)},
    {source: streetNodes[1], target: streetNodes[2], weight: Math.floor(Math.random() * 100)},{source: streetNodes[2], target: streetNodes[1], weight: Math.floor(Math.random() * 100)},
    {source: streetNodes[2], target: streetNodes[5], weight: Math.floor(Math.random() * 100)},{source: streetNodes[5], target: streetNodes[2], weight: Math.floor(Math.random() * 100)},
    {source: streetNodes[5], target: streetNodes[4], weight: Math.floor(Math.random() * 100)},{source: streetNodes[4], target: streetNodes[5], weight: Math.floor(Math.random() * 100)},
    {source: streetNodes[4], target: streetNodes[3], weight: Math.floor(Math.random() * 100)},{source: streetNodes[3], target: streetNodes[4], weight: Math.floor(Math.random() * 100)},
    {source: streetNodes[3], target: streetNodes[0], weight: Math.floor(Math.random() * 100)},{source: streetNodes[0], target: streetNodes[3], weight: Math.floor(Math.random() * 100)},
    {source: streetNodes[3], target: streetNodes[6], weight: Math.floor(Math.random() * 100)},{source: streetNodes[6], target: streetNodes[3], weight: Math.floor(Math.random() * 100)},
    {source: streetNodes[6], target: streetNodes[7], weight: Math.floor(Math.random() * 100)},{source: streetNodes[7], target: streetNodes[6], weight: Math.floor(Math.random() * 100)},
    {source: streetNodes[6], target: streetNodes[5], weight: Math.floor(Math.random() * 100)},{source: streetNodes[5], target: streetNodes[6], weight: Math.floor(Math.random() * 100)},
    {source: streetNodes[4], target: streetNodes[1], weight: Math.floor(Math.random() * 100)},{source: streetNodes[1], target: streetNodes[4], weight: Math.floor(Math.random() * 100)}
];

globalThis.streetLinks = streetLinks;

var routePoints =[];

houses();
buildings();
cars();
mapa();
mountains();

var newcar = null;

function houses() {
    let n = 5;
    logConsole.body.innerHTML += '<p>generating ' + n + ' houses... </p>';
    for (let index = 1; index <= n; index++) {
        mtlLoader.load('./res/models/house_type0' + index + '.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader(loadingManager);
            objLoader.setMaterials(mtl);
            objLoader.load('./res/models/house_type0' + index + '.obj', (root) => {
                let hCoords = parseInt(Math.random() * (coordBuildings.length));
                root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
                root.position.set( coordBuildings[hCoords].x , coordBuildings[hCoords].y , coordBuildings[hCoords].z );
                if (coordBuildings[hCoords].x == -230)  root.rotation.y = 3 * (Math.PI) /  -2;
                else if (coordBuildings[hCoords].x == -600)  root.rotation.y = 3 * (Math.PI) /  -2;
                else root.rotation.y = Math.PI / - 2;
                root.name = 'house' + index + '';
                scene.add(root);
                genGrafo("house", hCoords);
            });
        });
    }
}


function buildings() {
    let buildingsArray = ["school", "luz", "agua", "hospital", "bomberos", "market", "comisaria"];
    logConsole.body.innerHTML += '<p>generating ' + buildingsArray.length + ' buildings...</p>';
    for (let index = 1; index <= buildingsArray.length; index++) {
        mtlLoader.load('./res/models/large_building0' + index + '.mtl', (mtl) => {
            mtl.preload();
            Object.keys(mtl.materials).forEach( function(key) { 
                mtl.materials[key].flatShading = true;
                mtl.materials[key].side = 2;
            });
            const objLoader = new OBJLoader(loadingManager);
            objLoader.setMaterials(mtl);
            objLoader.load('./res/models/large_building0' + index + '.obj', (root) => {
                let bCoords = parseInt(Math.random() * (coordBuildings.length));
                root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
                root.position.set( coordBuildings[bCoords].x , coordBuildings[bCoords].y , coordBuildings[bCoords].z );
                if (coordBuildings[bCoords].x == -230)  root.rotation.y = 3 * (Math.PI) / - 2;
                else if (coordBuildings[bCoords].x == -600)  root.rotation.y = 3 * (Math.PI) / - 2;
                else root.rotation.y = Math.PI / - 2;
                root.name = buildingsArray[index - 1];
                // if(root.name == "comisaria") root.rotation.y = 2 * Math.PI;
                // if (root.name =="bomberos") root.rotation.y = Math.PI /  2;
                // if (root.name =="market") root.rotation.y = Math.PI /  - 2;
                scene.add(root);
                genGrafo(buildingsArray[index - 1], bCoords);
            });
        });
    }
}

function cars() {
    let carsArray = ["suv", "sedan", "sedanSports", "truckFlat", "van", "police", "ambulance", "firetruck"];
    logConsole.body.innerHTML += '<p>loading ' + carsArray.length + ' cars...</p>';
    for (let index = 1; index <= carsArray.length; index++) {
        mtlLoader.load('./res/models/' + carsArray[index - 1] + '.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader(loadingManager);
            objLoader.setMaterials(mtl);
            objLoader.load('./res/models/' + carsArray[index - 1] + '.obj', (root) => {
                root.scale.x = 15, root.scale.z = 15, root.scale.y = 15;
                switch (index) {
                    case 1:
                        if ( nodos[0].x == -230){
                            randomX = nodos[0].x - 20, randomZ = nodos[0].z + 10;
                            root.rotation.y = Math.PI / -2;
                        }
                        else{
                            randomX = nodos[0].x + 20, randomZ = nodos[0].z - 10;
                            root.rotation.y = Math.PI / 2;
                        }
                        nodos[0].car = root;
                        break;
                    case 2:
                        if ( nodos[1].x == -230){
                            randomX = nodos[1].x - 10, randomZ = nodos[1].z + 20;
                            root.rotation.y = Math.PI / -2;
                        }
                        else {
                            randomX = nodos[1].x + 10, randomZ = nodos[1].z - 20;
                            root.rotation.y = Math.PI / 2;
                        }
                        nodos[1].car = root;
                        break;
                    case 3:
                        if ( nodos[2].x == -230){
                            randomX = nodos[2].x, randomZ = nodos[2].z + 50;
                            root.rotation.y = Math.PI / -2;
                        }
                        else {
                            randomX = nodos[2].x, randomZ = nodos[2].z - 50;
                            root.rotation.y = Math.PI / 2;
                        }
                        nodos[2].car = root;
                        break;
                    case 4:
                        if ( nodos[3].x == -230){
                            randomX = nodos[3].x + 15, randomZ = nodos[3].z - 10;
                            root.rotation.y = Math.PI / -2;
                        }
                        else {
                            randomX = nodos[3].x - 15, randomZ = nodos[3].z + 10;
                            root.rotation.y = Math.PI / 2;
                        }
                        nodos[3].car = root;
                        break;
                    case 5:
                        if ( nodos[4].x == -230){
                            randomX = nodos[4].x - 10, randomZ = nodos[4].z + 20;
                            root.rotation.y = Math.PI / -2;
                        }
                        else {
                            randomX = nodos[4].x + 10, randomZ = nodos[4].z - 20;
                            root.rotation.y = Math.PI / 2;
                        }
                        nodos[4].car = root;
                        break;
                    case 6:
                        if ( nodos[7].x == -230 || nodos[7].x ==  - 600) {
                            randomX = nodos[7].x , randomZ = nodos[7].z + 60; // cops
                            root.rotation.y = Math.PI / -2;
                        }
                        else {
                            randomX = nodos[7].x , randomZ = nodos[7].z - 60; // cops
                            root.rotation.y = Math.PI / 2;
                        }
                        nodos[7].car = root;
                        break;
                    case 7:
                        if ( nodos[11].x == - 230 || nodos[11].x ==  - 600){ 
                            randomX = nodos[11].x , randomZ = nodos[11].z + 55; // ambulance
                            root.rotation.y = Math.PI / -2;
                        }
                        else {
                            randomX = nodos[11].x , randomZ = nodos[11].z - 55; // ambulance
                            root.rotation.y = Math.PI / 2;
                        }
                        nodos[11].car = root;
                        break;
                    case 8:
                        if ( nodos[5].x == -230 || nodos[5].x == - 600){
                            randomX = nodos[5].x , randomZ = nodos[5].z + 20; // firetruck
                            root.rotation.y = Math.PI / -2;
                        }
                        else {
                            randomX = nodos[5].x , randomZ = nodos[5].z - 20; // firetruck
                            root.rotation.y = Math.PI / 2;
                        }
                        nodos[5].car = root;
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

function mapa() {
    logConsole.body.innerHTML += '<p>loading city map... </p>';
    mtlLoader.load('./res/models/mapa.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader(loadingManager);
        Object.keys(mtl.materials).forEach( function(key) { 
            mtl.materials[key].flatShading = true;
            mtl.materials[key].side = 2;
        });
        objLoader.setMaterials(mtl);
        objLoader.load('./res/models/mapa.obj', (root) => {
            root.scale.x = 50, root.scale.z = 50, root.scale.y = 50;
            root.position.set(-350, 0, 350);
            root.rotation.y = 0;
            root.castShadow = true;
            root.receiveShadow = true;
            scene.add(root);
        });
    });
}

function mountains() {
    logConsole.body.innerHTML += '<p>loading terrain... </p>';
    for (let jndex = 0; jndex < 4; jndex++) {
        for (let index = 0; index < 10; index++) {
            mtlLoader.load('./res/models/mountain.mtl', (mtl) => {
                mtl.preload();
                mtl.materials.ground.color =  {r: 0.20784313725490197, g: 0.40784313725490196, b: 0.17647058823529413};
                const objLoader = new OBJLoader(loadingManager);
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
                            root.position.set( 500 - (index * 220) , -0.5 , -380 );
                            root.rotation.y = 3 * Math.PI / 2;
                            break;
                        case 3:
                            root.position.set( -1100 , -0.5 , -400 + ( index * 220 ))
                            root.position.set( 500 - ( index * 220 ), -0.5 , 1100);
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
    logConsole.body.innerHTML += '<p>done</p>';

}

// sky

sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );

sun = new THREE.Vector3();

var elevation = -10;

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

const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( 1, 1.75, -1 );
dirLight.position.multiplyScalar( 300 );
scene.add( dirLight );

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

function genGrafo(type , index) {
    globalThis.nodos = nodos;
    if ( type !== "house" ) {
        nodos.push({ id: ++lastNodo, type: type, x: coordBuildings[index].x , z: coordBuildings[index].z });
        coordBuildings.splice(index, 1);
        if (nodos.length >= 12) {
            var allNodesSort = nodos.concat(streetNodes);
            globalThis.allNodes = allNodesSort;
        }
        return;
    }
    else {
        nodos.push({ id: ++lastNodo, type: type + String(lastNodo), x: coordBuildings[index].x , z: coordBuildings[index].z })
    }
    let nRandom = Math.floor(Math.random() * 5);
    let l = nodos[lastNodo - 1];
    let family = [];
    switch (nRandom) {
        case 0:
            family.push({ type: "adult", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            break;
        case 1:
            family.push({ type: "adult", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            family.push({ type: "adult", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            break;
        case 2:
            family.push({ type: "adult", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            family.push({ type: "adult", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            family.push({ type: "child", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            break;
        case 3:
            family.push({ type: "adult", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            family.push({ type: "adult", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            family.push({ type: "child", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            family.push({ type: "child", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            break;
        case 4:
            family.push({ type: "adult", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            family.push({ type: "adult", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            family.push({ type: "child", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            family.push({ type: "child", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            family.push({ type: "child", gender: (Math.floor(Math.random() * 2)), avatar: Math.floor(Math.random() * 2 + 1) });
            break;
        default:
            break;
    }
    coordBuildings.splice(index, 1);
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
        document.querySelector("canvas").style.cursor = "pointer";

    } else {
        outlinePass.selectedObjects = [];
        document.querySelector("canvas").style.cursor = "initial";
    }

}

function onPointerDown(event) {

    if (event.button != 0) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( scene.children, true );

    if ( intersects[0].object.name.startsWith('house') ) {
    // if (intersects.length > 0) {

        const object = intersects[0].object;

        if ( document.querySelector(".winbox.houseModal > .wb-body > .family") ) {            
            document.querySelector(".winbox.houseModal > .wb-body > .family").remove();
            document.querySelector(".winbox.houseModal > .wb-body > .spacing.horizontal").remove();
        }
        
        houseSelected = object.name[object.name.length - 1] - 1;
        tempSelected = houseSelected;
        var stringHTML = '<div class="family">';
        if (vincFamily[houseSelected].family.length > 2 ) {
            for (let index = 0; index < 2; index++) {
                stringHTML += '<img src="./res/img/' + (vincFamily[houseSelected].family[index].gender > 0 ? 'man0' : 'woman0') + vincFamily[houseSelected].family[index].avatar  + '.png" style="height: 70px; width: 70px; margin: 25px;" >';}
            for (let index = 0; index < vincFamily[houseSelected].family.length - 2; index++) {
                stringHTML += '<img src="./res/img/' + (vincFamily[houseSelected].family[index].gender > 0 ? 'boy0' : 'girl0') + vincFamily[houseSelected].family[index].avatar  + '.png" style="height: 70px; width: 70px; margin: 25px;" >';}
        }
        else {
            for (let index = 0; index < vincFamily[houseSelected].family.length; index++) {
                stringHTML += '<img src="./res/img/' + (vincFamily[houseSelected].family[index].gender > 0 ? 'man0' : 'woman0') + vincFamily[houseSelected].family[index].avatar + '.png" style="height: 70px; width: 70px; margin: 25px;" >';}
        }
        stringHTML += '</div>';
        stringHTML += '<span class="spacing horizontal"></span>'

        document.querySelector(".winbox.houseModal > .wb-body").insertAdjacentHTML('beforeend', stringHTML);
        familyModal.removeClass("hidden");
        familyModal.minimize(false);
        objSelected = object;
        logConsole.body.innerHTML += '<p>selected ' + object.name + " position x:" + object.parent.position.x + " y:" + object.parent.position.y + " z:" + object.parent.position.z + '</p>';
        logConsole.body.innerHTML += '<p>car ' + nodos[houseSelected].car.name + " positon x:" + nodos[houseSelected].car.position.x + " y:" + nodos[houseSelected].car.position.y + " z:" + nodos[houseSelected].car.position.z + '</p>';
    }
}

function route(goto) {

    var destination, origin, nearRoad, nearRoad2;
    let aux = 9999, aux2 = 9999;

    routePoints = [];

    origin = allNodes[houseSelected].car.position;
    routePoints.push({x: origin.x, z: origin.z});                                    //routePoints[0] car initial position

    for (let closest of streetLinks) {
        if ( Math.abs(Math.abs(origin.x) - Math.abs(closest.source.x)) < aux ) {
            aux = Math.abs(Math.abs(origin.x) - Math.abs(closest.source.x));
            nearRoad = closest.source;
            if ( nearRoad.x === closest.target.x ) {
                nearRoad2 = closest.target;
            }
        }
    }
    routePoints.push({x: nearRoad.x, z: origin.z});                                                         //routePoint[1] closest street
    allNodes.push({id: allNodes.length, type: "temp", x: nearRoad.x, z: origin.z});                         //allNodes[20] temporal node needed for Dijkstra's algorithm
    streetLinks.push({source: allNodes[20], target: nearRoad, weight: Math.floor(Math.random() * 100)})     //streetLinks[20] temporal link needed for Dijkstra's algorithm
    streetLinks.push({source: allNodes[20], target: nearRoad2, weight: Math.floor(Math.random() * 100)})    //streetLinks[21] temporal link needed for Dijkstra's algorithm

    let current = allNodes[allNodes.length - 1];

    for (let next of streetLinks) {
        if (next.source === current ) {
            current = next.target;
            routePoints.push({x: current.x, z: current.z})
        }
    }

    for (let i of allNodes.slice(0, 12)) {
        if (goto == i.type) {
           destination = i;
           break;
        }
    }
    for (let finalpoint of streetLinks) {
        if ( Math.abs(Math.abs(destination.x) - Math.abs(finalpoint.source.x)) < aux2 ) {
            if ( finalpoint.source.z == 690 ) finalpoint.source.z = -690;
            aux2 = Math.abs(Math.abs(destination.x) - Math.abs(finalpoint.source.x));
            nearRoad = finalpoint.source;
        }
    }

    routePoints.push({x: nearRoad.x, z: nearRoad.z});                               //routePoint[] destination
    routePoints.push({x: nearRoad.x, z: destination.z});                            //routePoint[] destination relative

    allNodes.pop();                                                                 //removes the temporal node
    streetLinks.pop();
    streetLinks.pop();

}


function turnCar() {
    
    distance = 0
    if ( rIndex >= routePoints.length - 1) {
        arrived = true;
        houseSelected = tempSelected;
        sirena.pause();
        ambulancia.pause();
        bomberos.pause();
        document.querySelector(".block").style.visibility = "hidden";
        document.querySelector(".eventos").style.filter = "opacity(1) grayscale(0)";
        document.querySelector(".move-select").style.filter = "opacity(1) grayscale(0)";

        return;
    }
    
    if ( routePoints[rIndex].x == routePoints[rIndex + 1].x ) { 
        sign = Math.sign( Math.abs(routePoints[rIndex + 1].z) - Math.abs(routePoints[rIndex].z));
        axis = 'z';
        if (sign > 0) {
            rotation = 0;
            back = false;
        }
        else {
            rotation = 3 * Math.PI / 1;
            back = true;
        } 
    }
    else {
        sign = Math.sign( Math.abs(routePoints[rIndex].x) - Math.abs(routePoints[rIndex + 1].x));
        axis = 'x';
        if (sign > 0) {
            back = true;
            rotation = Math.PI / 2;
        }
        else {
            rotation = 3 * Math.PI / 2;
            back = false;
        }
    }
    rIndex++;
}

var tutorialBtn = document.querySelector(".btn");
tutorialBtn.addEventListener("click", e => {
    let TutorialModal = new WinBox("Tutorial",{
        modal: true,
        border: 0,
        width: "80%",
        height: "80%",
        x: "center",
        y: "center",
        class: [
            "no-min",
            "no-max",
            "no-full",
            "no-resize",
        ],
    });
    
    let stringHTML = '<div class="tutorial">';
        stringHTML += '<div class="tutorial-container"><img src="./res/img/click.png" style="height: 70px; width: 70px; margin: 25px; filter: invert(1);"><a class="texto"> Click en la rueda del mouse: arrastra la camara por la pantalla.</a></div>'
        stringHTML += '<div class="tutorial-container"><img src="./res/img/right-click.png" style="height: 70px; width: 70px; margin: 25px; filter: invert(1);"><a class="texto"> Click derecho del mouse: mueve la camara por la pantalla.</a></div>';
        stringHTML += '<div class="tutorial-container"><img src="./res/img/left-click.png" style="height: 70px; width: 70px; margin: 25px; filter: invert(1);"><a class="texto"> Click izquierdo del mouse: selecciona una casa para ver información.</a></div>';
        stringHTML += '<div class="tutorial-container"><img style="height: 70px; width: 70px; margin: 25px;" src="./res/img/firefighter.png"><a class="texto"> Click en el botón del bombero para generar un incendio en la casa indicada.</a></div>';
        stringHTML += '<div class="tutorial-container"><img style="height: 70px; width: 70px; margin: 25px;" src="./res/img/bad-person.png"><a class="texto"> Click en el botón del ladrón para generar un robo en la casa indicada.</a></div>';
        stringHTML += '<div class="tutorial-container"><img style="height: 70px; width: 70px; margin: 25px;" src="./res/img/doctor.png"><a class="texto"> Click en el botón del ladrón para generar una emergencia medica en la casa indicada.</a></div>';
        stringHTML += '<div class="tutorial-container"><img style="height: 70px; width: 70px; margin: 25px; filter: invert(1);" src="./res/img/volume.png"><a class="texto"> Click en el botón de mute para silenciar las alertas.</a></div>';
        stringHTML += '</div>';
        stringHTML += '<div class="examples">';
        stringHTML += '<img style="height: 200px; width: 200px; margin: 25px; border: 8px solid #0d1117; border-radius: 15px;" src="./res/img/modal.gif">';
        stringHTML += '<br>'
        stringHTML += '<a class="texto">Al hacer click en una casa se desplegarán los EVENTOS.</a>';
        stringHTML += '</div>';

        TutorialModal.body.innerHTML = stringHTML;    
})

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    if (!logConsole.min) {
        logConsole.x = window.innerWidth / 4;
        logConsole.y = window.innerHeight / 4;
        logConsole.move();
    }
    familyModal.x =  100;
    familyModal.move();
}

function animate() {

    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    if ( newcar && !arrived ) {

        distance = sign * 4;
        newcar.position[axis] += distance;
        newcar.rotation.y = rotation;
        if (Math.abs(newcar.position[axis]) > Math.abs(routePoints[rIndex][axis]) && !back) turnCar();
        else if (Math.abs(newcar.position[axis]) < Math.abs(routePoints[rIndex][axis]) && back) turnCar();
    }
    
    elevation += 0.05553
    const phi = THREE.MathUtils.degToRad( 90 - elevation );
    const theta = THREE.MathUtils.degToRad( -120 );
    sun.setFromSphericalCoords( 1, phi, theta );
    uniforms[ 'sunPosition' ].value.copy( sun );
    
    timer.innerHTML = "Time: " + Math.floor(elevation / 15 + 8) + '<span style="color:#4d2dff">' + ( (elevation / 15 + 8) > 12 ? 'PM🌙' : 'AM🌞') + '</span>';

    if ( elevation > 240 ) elevation = -10;

    controls.update();
    stats.update();
    composer.render();
}

function render() {

    raycaster.setFromCamera(mouse, camera);

    renderer.render( scene, camera );
}

animate();

function onTransitionEnd( event ) {

	event.target.remove();
	
}