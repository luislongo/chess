import { useEffect, useRef } from "react";
import { Renderer } from "../types/Renderer";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import chesstable from "../../assets/chesstable.glb";
import bp from "../../assets/bp.glb";
import wp from "../../assets/wp.glb";
import wb from "../../assets/wb.glb";
import bb from "../../assets/bb.glb";
import br from "../../assets/br.glb";
import wr from "../../assets/wr.glb";
import bn from "../../assets/bn.glb";
import wn from "../../assets/wn.glb";
import bk from "../../assets/bk.glb";
import wk from "../../assets/wk.glb";
import bq from "../../assets/bq.glb";
import wq from "../../assets/wq.glb";
import { BoardType } from "../types/Board";
import { Square } from "chess.js";

const pieces = {
  w: {
    p: wp,
    r: wr,
    n: wn,
    b: wb,
    q: wq,
    k: wk,
  },
  b: {
    p: bp,
    r: br,
    n: bn,
    b: bb,
    q: bq,
    k: bk,
  },
};

type RendererContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  pointer: THREE.Vector2;
  raycaster: THREE.Raycaster;
  events: Record<string, (event: Square) => void>;
};

export const useRenderer = (): Renderer => {
  const ref = useRef<HTMLDivElement>(null);
  const context = useRef<RendererContext>();

  const initializeBoard = () => {
    if (!context.current) throw new Error("Renderer not initialized");
    const { scene, camera, renderer } = context.current;

    camera.position.z = 40;
    camera.position.x = 40;
    camera.position.y = 40;
    camera.lookAt(0, 0, 0);
    new OrbitControls(camera, renderer.domElement);

    const loader = new GLTFLoader();
    loader.load(chesstable, (glb) => {
      scene.add(glb.scene);
    });
  };

  const animate = () => {
    if (!context.current) throw new Error("Renderer not initialized");

    const { scene, camera, renderer, pointer, raycaster } = context.current;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    camera.lookAt(scene.position);

    raycaster.setFromCamera(pointer, camera);

    //Calculate ray intersection with z=0 plane
    const plane = new THREE.Plane(new THREE.Vector3(0, 0.1, 0), 0);

    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
  };

  const onClick = (callback: (sq: Square) => void) => {
    if (!context.current) throw new Error("Renderer not initialized");
    context.current.events.click = callback;
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const light = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    const pointer = new THREE.Vector2(10000, 10000);
    scene.add(light);
    scene.add(directionalLight);
    const renderer = new THREE.WebGLRenderer();
    const raycaster = new THREE.Raycaster();

    renderer.setSize(window.innerWidth, window.innerHeight);
    ref.current?.appendChild(renderer.domElement);

    context.current = {
      scene,
      camera,
      renderer,
      pointer,
      raycaster,
      events: {},
    };

    const movePointer = (event: MouseEvent) => {
      context.current?.pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
    };

    const click = () => {
      const plane = new THREE.Plane(new THREE.Vector3(0, 0.1, 0), 0);

      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      const x = Math.floor((intersection.x + 24) / 6);
      const z = Math.floor((intersection.z + 24) / 6);

      const file = String.fromCharCode(97 + x);
      const rank = 8 - z;

      const square = file + rank;

      context.current?.events.click?.(square as Square);
    };

    animate();
    window.addEventListener("mousemove", movePointer);
    window.addEventListener("click", click);

    return () => {
      ref.current?.removeChild(renderer.domElement);
      window.removeEventListener("mousemove", movePointer);
      window.removeEventListener("click", click);
    };
  }, []);

  const loadBoardState = (board: BoardType) => {
    if (!context.current) throw new Error("Renderer not initialized");
    const { scene } = context.current;
    const loader = new GLTFLoader();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const piece = board[i][j];

        if (piece === null) continue;

        const file = pieces[piece.color][piece.type];

        loader.load(file, (glb) => {
          glb.scene.position.x = j * 6 - 21;
          glb.scene.position.z = i * 6 - 21;
          scene.add(glb.scene);
        });
      }
    }
  };

  return {
    ref,
    initializeBoard,
    loadBoardState,
    onClick,
  };
};
