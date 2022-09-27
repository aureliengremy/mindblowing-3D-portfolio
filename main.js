import './style.css'

import * as THREE from 'three';

// make the scene interactive by move from the mouse
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(5);


// create the geometry element
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// from THREE.MeshBasicMaterial to THREE.MeshStandardMaterial to make the light reflect on your element
// const material = new THREE.MeshStandardMaterial({ color: 0xf6521e });
const material = new THREE.MeshToonMaterial({ color: 0x222222 });
const torus = new THREE.Mesh(geometry, material);
torus.position.z = 60;
scene.add(torus);

// add some light
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5, 5, 5)
const ambientLight = new THREE.AmbientLight(0xffffff)

scene.add(pointLight, ambientLight)

// you can see where the light is coming from
// const lightHelper = new THREE.PointLightHelper(pointLight)

// you can see the orbit level
// const gridHelper = new THREE.GridHelper(200, 50)
// scene.add(lightHelper, gridHelper)

const controlsCamera = new OrbitControls(camera, renderer.domElement);

const addStar = () => {
  //create sphere
  const geometry = new THREE.SphereGeometry(0.1, 20, 20);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sphere = new THREE.Mesh(geometry, material);

  // generate random coordonne
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  sphere.position.set(x, y, z)
  scene.add(sphere)
}

// call addStar function 200 times
Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('cosmos.jpg')
scene.background = spaceTexture

// Plane with myself on it
const mySelfTexture = new THREE.TextureLoader().load('myself-crop-in-the-dark.jpeg')

const myself = new THREE.Mesh( 
  new THREE.PlaneGeometry( 4, 4 ),
  new THREE.MeshBasicMaterial( {map: mySelfTexture, side: THREE.DoubleSide} )
 );
scene.add( myself );

const deathStarTexture = new THREE.TextureLoader().load('texture-death-star.jpeg')
const deathStar = new THREE.Mesh( 
  new THREE.SphereGeometry( 3, 30, 30 ),
  new THREE.MeshBasicMaterial( { map: deathStarTexture } )
 );
deathStar.position.set(10,2,20)
scene.add( deathStar );


function moveCameraStart() {

  const moveFromTop = document.body.getBoundingClientRect().top;
  // console.log(moveFromTop)
  deathStar.rotation.x += 0.001;
  deathStar.rotation.y += 0.05;
  deathStar.rotation.z += 0.0001;

  myself.rotation.x += 0.01;
  myself.rotation.y += 0.01;

  camera.position.z += moveFromTop * -0.0001;
  camera.position.x += moveFromTop * -0.0000002;
  camera.position.y += moveFromTop * -0.0000002;
  // console.log("Start: " + moveFromTop)
  // if(moveFromTop > 1){
  //   console.log('moveFromTop = 0' )
  // }
  // console.log(camera.position)

}
function moveCameraBack() {

  const moveFromTop = document.body.getBoundingClientRect().top;
  // console.log(moveFromTop)
  deathStar.rotation.x -= 0.001;
  deathStar.rotation.y -= 0.05;
  deathStar.rotation.z -= 0.0001;

  myself.rotation.x -= 0.01;
  myself.rotation.y -= 0.01;

  camera.position.z += moveFromTop * 0.0001;
  camera.position.x += moveFromTop * 0.0000001;
  camera.position.y += moveFromTop * 0.0000001;
  // console.log("back: "+ moveFromTop)
  // if(moveFromTop > 1){
  //   console.log('moveFromTop = 0' )
  // }
  // console.log(camera.position)

}
var lastScrollTop = 0;
const scrollFrom = () => { // or window.addEventListener("scroll"....
  var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
  if (st > lastScrollTop){
    // console.log(lastScrollTop)
    // console.log(document.documentElement.scrollTop)
     moveCameraStart()
  } else {
     moveCameraBack()
  }
  lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
};

document.body.onscroll = scrollFrom;



function animate() {
  requestAnimationFrame(animate)
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controlsCamera.update();

  renderer.render(scene, camera)
}
animate()