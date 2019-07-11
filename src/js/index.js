import Scene from './classes/scene';
import Helpers from './classes/helpers';
import ShaderMaterial from './classes/ShaderMaterial';

const world = new Scene();
const helpers = new Helpers();
const { scene, camera } = world;

let lava, cube, wireframe, lavaGroup = new THREE.Group();
const lavaMaterial = new ShaderMaterial('lava');

const draw = (timestamp) => {
  /* Add stuff to the draw function here */

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  wireframe.rotation.x += 0.01;
  wireframe.rotation.y += 0.01;

  lavaMaterial.draw(timestamp, helpers.vec);

  // lookAtMouse(helpers.vec.x, helpers.vec.y);


  /* Call draw functions for classes when needed to keep all stuff together but only have 1 RAF */
  world.draw(timestamp);
  helpers.draw(camera);
  requestAnimationFrame(draw);
  //
}


const normalize = (v, vmin, vmax, tmin, tmax) => {
  const nv = Math.max(Math.min(v, vmax), vmin);
  const dv = vmax - vmin;
  const pc = (nv - vmin) / dv;
  const dt = tmax - tmin;
  const tv = tmin + (pc * dt);
  return tv;
}

const lookAtMouse = (xTarget, yTarget) => {

  const speed = 20;
  const xPos = normalize(xTarget, - 10, 10, - 0.6, 0.6);
  const yPos = normalize(yTarget, - 10, 10, 0.6, - 0.6);

  lavaGroup.rotation.y += (xPos - lavaGroup.rotation.y) / speed;
  lavaGroup.rotation.x += (yPos - lavaGroup.rotation.x) / speed;
}

const setup = () => {
  const lavaGeom = new THREE.PlaneBufferGeometry( 20, 20, 32 );

  lava = new THREE.Mesh( lavaGeom, lavaMaterial.material );
  lava.name = 'lava';
  lava.scale.set(.3, .3, .3);
  lavaGroup.position.z = -10;
  lavaGroup.position.x = -2;
  lavaGroup.add(lava)
  scene.add( lavaGroup );


  const box = new THREE.BoxGeometry( 2, 2, 2 );
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
  cube = new THREE.Mesh( box, material );
  cube.name = 'cube';
  cube.receiveShadow = true;
  cube.position.z = -10;
  cube.position.x = 2;
  // scene.add( cube );




  wireframe = new THREE.Mesh(
    new THREE.BoxGeometry( 2, 2, 2 ),
    new THREE.MeshBasicMaterial( {
      color: 0xb7ff00,
      wireframe: true
    })
  );

  wireframe.position.z = -10;
  wireframe.position.x = -6;
  // scene.add( wireframe );
}

const init = () => {
  setup();
  draw();
  window.addEventListener('resize', () => world.onWindowResize(), false);
}

init();
