import Scene from './classes/scene';
import Helpers from './classes/helpers';
import ShaderMaterial from './classes/ShaderMaterial';

const world = new Scene();
const helpers = new Helpers();
const { scene, camera } = world;

let plane, cube;
const lava = new ShaderMaterial('lava');

const draw = (timestamp) => {
  /* Add stuff to the draw function here */
  plane.rotation.x += 0.01;
  plane.rotation.y += 0.01;

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  lava.draw(timestamp, helpers.vec);


  /* Call draw functions for classes when needed to keep all stuff together but only have 1 RAF */
  world.draw();
  helpers.draw(camera);
  requestAnimationFrame(draw);
  //
}

const setup = () => {
  const geometry = new THREE.BoxGeometry( 2, 2, 2 );

  plane = new THREE.Mesh( geometry, lava.material );
  plane.name = 'plane';
  plane.position.z = -10;
  plane.position.x = -2;
  scene.add( plane );


  const geom = new THREE.BoxGeometry( 2, 2, 2 );
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
  cube = new THREE.Mesh( geom, material );
  cube.name = 'cube';
  cube.receiveShadow = true;
  cube.position.z = -10;
  cube.position.x = 2;
  scene.add( cube );
}

const init = () => {
  setup();
  draw();
  window.addEventListener('resize', () => world.onWindowResize(), false);
}

init();
