import Helper from "./helpers";

export default class Scene {
  constructor() {
    /* Create scene */
    this.scene = new THREE.Scene();
    this.raycaster = new THREE.Raycaster();
    this.helper = new Helper();

    /* Create camera */
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 5;
    this.camera.name = 'camera';


    /* Create renderer */
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.scene.background = new THREE.Color( 0x000000 );
    // this.renderer.setClearColor( 0x000000, 0 ); // the default


    /* Show threejs in html */
    document.querySelector('.wrapper').appendChild(this.renderer.domElement);
    window.scene = this.scene;
    window.THREE = THREE;
    this.lights();
  }

  draw() {
    this.raycaster.setFromCamera(this.helper.vec, this.camera)

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects( this.scene.children );

    for ( let i = 0; i < intersects.length; i++ ) {
      if (intersects[i].object.name === 'lava') {

      }
    }

    const isLava = intersects.find(e => e.object.name === 'lava');
    if (!isLava) {
      // this.scene.getObjectByName('lava').scale.set(this.hovertime, this.hovertime, this.hovertime);
    }

    this.helper.draw();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    /* Handle window resize */
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  lights() {
    /* Add lightning to the scene */
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4);
    const shadowLight = new THREE.DirectionalLight(0xffffff, .5);
    shadowLight.position.set(0, 0, 10);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -500;
    shadowLight.shadow.camera.right = 500;
    shadowLight.shadow.camera.top = 500;
    shadowLight.shadow.camera.bottom = -500;
    shadowLight.shadow.camera.near = -.5;
    shadowLight.shadow.camera.far = 5000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    hemisphereLight.position.z = 10;
    shadowLight.name = 'shadowLight';
    hemisphereLight.name = 'hemisphereLight';

    const light = new THREE.PointLight(0xffffff, 1.0);
    light.position.set(0.0, 0.0, 0.1);

    this.scene.add(light);
    this.scene.add(shadowLight);
    this.scene.add(hemisphereLight);

    $('#point').on('click', (e) => {
      $(e.currentTarget).toggleClass('on');
      if ($(e.currentTarget).hasClass('on')) this.scene.add(light);
      else this.scene.remove(light);
    })

    $('#directional').on('click', (e) => {
      $(e.currentTarget).toggleClass('on');
      if ($(e.currentTarget).hasClass('on')) this.scene.add(shadowLight);
      else this.scene.remove(shadowLight);
    })

    $('#hemisphere').on('click', (e) => {
      $(e.currentTarget).toggleClass('on');
      if ($(e.currentTarget).hasClass('on')) this.scene.add(hemisphereLight);
      else this.scene.remove(hemisphereLight);
    })
  }
}