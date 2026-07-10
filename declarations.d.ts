declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

// 3D model assets, bundled by Metro (see metro.config.js assetExts) but
// previously untyped -- require() worked at runtime, tsc just had nothing
// to say about it. Declared here so editor/tsc stop flagging these imports.
// declare module "*.obj" {
//   const content: any;
//   export default content;
// }
// declare module "*.mtl" {
//   const content: any;
//   export default content;
// }
// declare module "*.glb" {
//   const content: any;
//   export default content;
// }
// declare module "*.gltf" {
//   const content: any;
//   export default content;
// }
