import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  HemisphereLight,
  Vector3,
  ArrowHelper,
  Quaternion
} from "three";
import { Van } from "./Model/Van";
import { loop, renderLoop } from "./Game";
import { Map } from "./Model/Junction";

var scene = new Scene();
var camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const light = new HemisphereLight();
scene.add(light);

var renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// var geometry = new BoxGeometry( 1, 1, 1 );
// var material = new MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new Mesh( geometry, material );

camera.position.z = 10;
camera.position.y = 3;

async function main() {
  const van = new Van();
  const map = new Map();
  await map.init();
  await van.init();
  scene.add(van.object);
  scene.add(map.object);

  let vanAngle = 0;
  let vanSpeed = 0;

  renderLoop(() => {
    camera.lookAt(van.position);

    camera.position.x = van.object.position.x;
    camera.position.y = van.object.position.y;
    camera.position.z = van.object.position.z;

    van.object.setRotationFromAxisAngle(new Vector3(0, 1, 0), vanAngle);
    van.object.translateOnAxis(new Vector3(0, 0, 1), vanSpeed);

    renderer.render(scene, camera);
  });
  document.addEventListener("keydown", e => {
    switch (e.key) {
      case "ArrowUp":
        vanSpeed += 0.1;
        break;
      case "ArrowDown":
        vanSpeed -= 0.1;
        break;
      case "ArrowLeft":
        vanAngle += 0.1;
        break;
      case "ArrowRight":
        vanAngle -= 0.1;
        break;
    }
  });
}

main();
