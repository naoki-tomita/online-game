import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { Object3D } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export class Model {
  fileName: string;
  path: string;
  scale: number = 1;
  object: Object3D;

  async init() {
    const material = await new Promise<MTLLoader.MaterialCreator>(ok =>
      new MTLLoader()
        .setPath(this.path)
        .load(`${this.fileName}.mtl`, mtl => (mtl.preload(), ok(mtl)))
    );
    this.object = await new Promise<Object3D>(ok =>
      new OBJLoader()
        .setMaterials(material)
        .setPath(this.path)
        .load(`${this.fileName}.obj`, obj => ok(obj))
    );
    this.object.scale.multiplyScalar(this.scale);
  }

  move(dx: number, dy: number, dz: number) {
    this.object.position.x += dx;
    this.object.position.y += dy;
    this.object.position.z += dz;
  }

  rotate(dx: number, dy: number, dz: number) {
    this.object.rotation.x += dx;
    this.object.rotation.y += dy;
    this.object.rotation.z += dz;
  }

  get position() {
    return this.object.position;
  }
}
