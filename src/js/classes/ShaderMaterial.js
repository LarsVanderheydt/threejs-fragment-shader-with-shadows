import Vertex from '../lib/vertexShaders';
import Fragment from '../lib/fragmentShaders';

export default class ShaderMaterial {
  constructor(mat) {
    this.uniforms = {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_hover: { value: 1.0 },
    };

    this.material = new THREE.ShaderMaterial( {
      uniforms: THREE.UniformsUtils.merge( [
        THREE.UniformsLib.common,
        THREE.UniformsLib.lights,
        this.uniforms,
      ]),
      fragmentShader: Fragment[ mat ],
      vertexShader: Vertex.distort,
      lights: true,
      side: THREE.DoubleSide,
      transparent: true,
    });
  }

  draw(timestamp, pos) {
    if (this.material) {
      this.material.uniforms.u_time.value = timestamp / 1000;
      this.material.uniforms.u_mouse.value.x = pos.x / 5;
      this.material.uniforms.u_mouse.value.y = pos.y / 5;
    }
  }
}