import { Square } from "chess.js";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import bb from "../../assets/bb.glb";
import bk from "../../assets/bk.glb";
import bn from "../../assets/bn.glb";
import bp from "../../assets/bp.glb";
import bq from "../../assets/bq.glb";
import br from "../../assets/br.glb";
import chesstable from "../../assets/chesstable.glb";
import wb from "../../assets/wb.glb";
import wk from "../../assets/wk.glb";
import wn from "../../assets/wn.glb";
import wp from "../../assets/wp.glb";
import wq from "../../assets/wq.glb";
import wr from "../../assets/wr.glb";
import { EventMessenger, Events } from "../events/EventMessenger.class";
import { BoardType } from "../types/Board";
import { Renderer } from "../types/Renderer";

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

export interface RendererEvents extends Events {
  click: {
    payload: Square;
  };
  onMouseEnter: {
    payload: Square;
  };
  onMouseLeave: {
    payload: Square;
  };
}

type RendererContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  pointer: THREE.Vector2;
  curSquare: Square | null;
  raycaster: THREE.Raycaster;
  events: EventMessenger<RendererEvents>;
  board: Record<string, THREE.Group<THREE.Object3DEventMap>>;
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

    const x = Math.floor((intersection.x + 24) / 6);
    const z = Math.floor((intersection.z + 24) / 6);

    if (x < 0 || x > 7 || z < 0 || z > 7) return;

    const file = String.fromCharCode(97 + x);
    const rank = 8 - z;

    const square = (file + rank) as Square;

    if (
      context.current.curSquare !== square &&
      context.current.curSquare !== null
    ) {
      context.current.events.emit("onMouseLeave", context.current.curSquare);
      context.current.curSquare = null;
    }

    if (context.current.curSquare !== square) {
      context.current.events.emit("onMouseEnter", square);
      context.current.curSquare = square;
    }
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

    const events = new EventMessenger<RendererEvents>();

    context.current = {
      scene,
      camera,
      renderer,
      pointer,
      raycaster,
      events,
      curSquare: null,
      board: {},
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

      const square = (file + rank) as Square;

      context.current?.events.emit("click", square);
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

          const file = String.fromCharCode(97 + j);
          const rank = 8 - i;

          const square = (file + rank) as Square;

          if (!context.current) throw new Error("Renderer not initialized");

          context.current.board[square] = glb.scene;
        });
      }
    }
  };

  const movePiece = ({ from, to }: { from: Square; to: Square }) => {
    if (!context.current) throw new Error("Renderer not initialized");

    const pieceFrom = context.current?.board[from] ?? null;

    if (!pieceFrom) return;

    const x = to.charCodeAt(0) - 97;
    const z = 8 - parseInt(to[1]);

    pieceFrom.position.x = x * 6 - 21;
    pieceFrom.position.z = z * 6 - 21;

    const pieceTo = context.current?.board[to] ?? null;

    if (pieceTo) {
      context.current.scene.remove(pieceTo);
    }

    delete context.current?.board[from];
    context.current.board[to] = pieceFrom;
  };

  function on<K extends keyof RendererEvents>(
    event: K,
    callback: (event: RendererEvents[K]["payload"]) => void
  ) {
    if (!context.current) throw new Error("Renderer not initialized");

    return context.current.events.on(event, callback);
  }

  function off<K extends keyof RendererEvents>(event: K, id: string) {
    if (!context.current) throw new Error("Renderer not initialized");

    context.current.events.off(event, id);
  }

  function highlightSquare(square: Square) {
    if (!context.current) throw new Error("Renderer not initialized");
    const { scene } = context.current;
    const geometry = new THREE.BoxGeometry(6, 0.1, 6);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    const x = square.charCodeAt(0) - 97;
    const z = 8 - parseInt(square[1]);

    cube.position.x = x * 6 - 21;
    cube.position.z = z * 6 - 21;
    cube.name = square;

    scene.add(cube);
  }

  function removeHighlight(square: Square) {
    if (!context.current) throw new Error("Renderer not initialized");
    const { scene } = context.current;
    const object = scene.getObjectByName(square);
    object && scene.remove(object);
  }

  return {
    ref,
    initializeBoard,
    loadBoardState,
    on,
    off,
    movePiece,
    highlightSquare,
    removeHighlight,
  };
};
