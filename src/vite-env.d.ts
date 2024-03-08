/// <reference types="vite/client" />

declare module "*.svg" {
  const content: unknown;
  export default content;
}

declare module "*.glb" {
  const content: string;
  export default content;
}
