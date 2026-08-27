import{r as n,j as r}from"./react-vendor-B6TsqL3d.js";import{C as c,u as v,a as f}from"./three-react-DztnBpf1.js";import{e as m}from"./three-core-C4KM_C5L.js";import"./vendor-_gQwqmet.js";const x=a=>{const t=a.replace("#","");return[parseInt(t.slice(0,2),16)/255,parseInt(t.slice(2,4),16)/255,parseInt(t.slice(4,6),16)/255]},p=`
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,d=`
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`,l=n.forwardRef(function({uniforms:t},e){const{viewport:o}=v();return n.useLayoutEffect(()=>{e.current&&e.current.scale.set(o.width,o.height,1)},[e,o]),f((i,s)=>{e.current&&(e.current.material.uniforms.uTime.value+=.1*s)}),r.jsxs("mesh",{ref:e,children:[r.jsx("planeGeometry",{args:[1,1,1,1]}),r.jsx("shaderMaterial",{uniforms:t,vertexShader:p,fragmentShader:d})]})});l.displayName="SilkPlane";function C({speed:a=5,scale:t=1,color:e="#7B7481",noiseIntensity:o=1.5,rotation:i=0}){const s=n.useRef(),u=n.useMemo(()=>({uSpeed:{value:a},uScale:{value:t},uNoiseIntensity:{value:o},uColor:{value:new m(...x(e))},uRotation:{value:i},uTime:{value:0}}),[a,t,o,e,i]);return r.jsx(c,{dpr:[1,1.5],frameloop:"always",children:r.jsx(l,{ref:s,uniforms:u})})}export{C as default};
