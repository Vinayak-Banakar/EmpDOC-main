import * as React from "react";
// Ensure React is available as a global for older code that references React.*
// This is a safe shim for development and build where automatic JSX runtime is used
(globalThis as any).React = React;
export default React;
