import Easing from './easings';
import Lights from './lights';
import Helpers from './shaderHelpers';

export default {
  fill: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    uniform vec2 u_mouse;

    void main() {
      gl_FragColor = vec4(abs(u_mouse.x), abs(u_mouse.y), 100.0, 1.0);
    }`,

  gradient: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec2 u_resolution;
    varying vec2 vUv;

    void main() {
      // vec2 st = gl_FragCoord.xy / u_resolution;
      vec2 position = vUv;
      vec2 st = position;

      gl_FragColor = vec4(st.x - u_mouse.x, st.y - u_mouse.y, u_mouse.x + u_mouse.y, 1.0);
    }`,

  graph: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    #define PI 3.14159265359

    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec2 u_resolution;
    varying vec2 vUv;

    float plot(vec2 st, float pct) {
      return  smoothstep( pct-0.02, pct, st.y) - smoothstep( pct, pct+0.02, st.y);
    }

    void main() {
      // vec2 st = gl_FragCoord.xy / u_resolution;
      vec2 position = vUv;
      vec2 st = position;

      float x = (st.x + u_time);
      float y = sin(x);
      vec3 color = vec3(y);
      float pct = plot(st, y);
      color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0);

      gl_FragColor = vec4(color, 1.0);
    }`,

  mix: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    #define PI 3.14159265359
    #define HALF_PI 1.5707963267948966

    uniform float u_time;
    uniform vec2 u_resolution;
    varying vec2 vUv;

    vec3 colorA = vec3(0.149,0.141,0.912);
    vec3 colorB = vec3(1.000,0.833,0.224);

    float rand(float n){return fract(sin(n) * 43758.5453123);}

    float noise(float p){
      float fl = floor(p);
      float fc = fract(p);
      return mix(rand(fl), rand(fl + 1.0), fc);
    }

    ${ Easing.easing }
    void main() {
      vec2 position = vUv;
      vec2 st = position;
      vec3 color = vec3(0.0);

      float pct = noise(u_time);
      color = mix(colorA, colorB, pct);

      gl_FragColor = vec4(color, 1.0);
    }`,

  gradient2: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    #define PI 3.14159265359
    #define HALF_PI 1.5707963267948966

    uniform float u_time;
    uniform vec2 u_resolution;
    varying vec2 vUv;

    vec3 colorA = vec3(0.149,0.141,0.912);
    vec3 colorB = vec3(1.000,0.833,0.224);

    float plot (vec2 st, float pct){
      return  smoothstep( pct-0.01, pct, st.y) - smoothstep( pct, pct+0.01, st.y);
    }

    ${ Easing.easing }
    void main() {
      vec2 position = vUv;
      vec2 st = position;
      vec3 color = vec3(0.0);

      vec3 pct = vec3(st.y);

      //pct.r = smoothstep(0.0,1.0, st.y);
      pct.r = sineIn(st.y + u_time);
      // pct.b = cos(st.y*2.0 * sin(u_time));
      //pct.b = pow(st.y,0.5);

      color = mix(colorA, colorB, pct);

      // Plot transition lines for each channel
      //color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
      //color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
      //color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

      gl_FragColor = vec4(color,1.0);
    }`,


  colors: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    #define TWO_PI 6.28318530718
    #define PI 3.14159265359
    #define HALF_PI 1.5707963267948966

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 vUv;

    vec3 hsb2rgb( in vec3 c ){
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0 );
      rgb = rgb*rgb*(3.0-2.0*rgb);
      return c.z * mix( vec3(1.0), rgb, c.y);
    }

    ${ Easing.easing }
    void main() {
      vec2 position = vUv;
      vec2 st = position;
      st *= 3.0;
      st = fract(st);

      vec3 color = vec3(0.0);
      vec2 toCenter = vec2(0.5) - st;
      float angle = atan(toCenter.y, toCenter.x);
      float radius = length(toCenter) * 2.0;

      color = hsb2rgb(vec3(angle / TWO_PI, radius, 1.0));

      gl_FragColor = vec4(color,1.0);
    }`,

  rect: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    #define TWO_PI 6.28318530718
    #define PI 3.14159265359
    #define HALF_PI 1.5707963267948966

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 vUv;

    ${ Easing.easing }

    float rect(vec2 st, float size, float x) {
      vec2 borders = step(vec2(size), st);
      float pct = borders.x * borders.y;

      vec2 tr = step(vec2(size), 1.0 - st + x);
      pct *= tr.x * tr.y;

      return pct;
    }

    void main() {
      vec2 position = vUv;
      vec2 st = position;
      vec3 color = vec3(0.0);



      float rect1 = rect(st, 0.5, 0.1);
      float rect2 = rect(st, 0.6, 0.5);
      float rect3 = rect(st, 0.3, -0.3);

      vec3 print =  vec3(rect1, 0.0, 0.0) +
                    vec3(rect2, rect2, 0.0) +
                    vec3(rect3, rect3, rect3);
      gl_FragColor = vec4(print,1.0);
    }`,

  circle: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    #define TWO_PI 6.28318530718
    #define PI 3.14159265359
    #define HALF_PI 1.5707963267948966

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 vUv;

    ${ Easing.easing }

    float circle(in vec2 _st, in float _radius){
      vec2 dist = _st-vec2(0.5);
      return 1.-smoothstep(_radius-(_radius*0.01), _radius+(_radius*0.01), dot(dist,dist)*4.0);
    }

    void main() {
      vec2 position = vUv;
      vec2 st = position;

      vec3 color = vec3(circle(vec2(st / 2.0),0.1)) + vec3(circle(vec2(st),0.1));
      gl_FragColor = vec4(color, 1.0);
    }`,

  noise: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    #define TWO_PI 6.28318530718
    #define PI 3.14159265359
    #define HALF_PI 1.5707963267948966

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    ${ Easing.easing }

    float rand (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      // Four corners in 2D of a tile
      float a = rand(i);
      float b = rand(i + vec2(1.0, 0.0));
      float c = rand(i + vec2(0.0, 1.0));
      float d = rand(i + vec2(1.0, 1.0));

      // Smooth Interpolation

      // Cubic Hermine Curve.  Same as SmoothStep()
      vec2 u = f*f*(3.0-2.0*f);
      // u = smoothstep(0.,1.,f);

      // Mix 4 coorners percentages
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float circle(in vec2 _st, in float _radius){
      vec2 dist = _st-vec2(0.5);
      return 1.-smoothstep(_radius-(_radius*0.01), _radius+(_radius*0.01), dot(dist,dist)*4.0);
    }

    vec2 rotate2d(vec2 _st, float _angle){
      _st -= 0.5;
      _st =  mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle)) * _st;
      _st += 0.5;
      return _st;
    }
    varying vec2 vUv;

    void main() {
      vec2 position = vUv;
      vec2 st = position;

      vec2 pos = vec2(st* 50.0);
      pos = rotate2d( st, noise(pos) ) * pos; // rotate the space
      pos += u_time;
      float n = noise(pos);



      vec3 color = vec3(n, 0.0, n * 10.0);

      // color += smoothstep(.15,.2,noise(st*20.) * sin(u_time)); // Black splatter
      // color -= smoothstep(.35,.4,noise(st*20.) * sin(u_time)); // Holes on splatter
      color += toneMapping(color);
      gl_FragColor = vec4(color, 1.0);
    }`,


















  lights: `
    #include <common>
    ${ Helpers }

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    varying vec2 vUv;
    varying vec3 vecPos;
    varying vec3 vecNormal;

    ${ Easing.easing }
    ${ Lights.setup }

    void main() {
      vec2 position = vUv;
      vec2 st = position;


      vec2 pos = vec2(st * 30.0);
      pos = rotate2d( st, noise(pos) ) * pos; // rotate the space
      pos -= linear(u_time);
      float n = noise(pos);

      vec3 color = vec3(n);
      vec4 mat = vec4(color, 1.0);


      // make sure this is the last import + color needs to be named mat and has to be a vec4
      ${ Lights.main }
    }`,













  lava: `
    #include <common>
    ${ Helpers }

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_hover;

    varying vec2 vUv;
    varying vec3 vecPos;
    varying vec3 vecNormal;
    varying float noise;

    ${ Easing.easing }
    ${ Lights.setup }


    void main() {
      vec2 position = vUv;
      vec2 st = position;

      vec2 pos = vec2(st * u_hover);
      pos = rotate2d(st, fnoise(pos)) * pos; // rotate the space
      pos -= linear(u_time);
      float n = fnoise(pos);

      vec3 color = vec3(n * 2.0, n * noise, 0.0);
      vec4 mat = vec4(color, 1.0);


      // make sure this is the last import + color needs to be named mat and has to be a vec4
      ${ Lights.main }
    }`,
}