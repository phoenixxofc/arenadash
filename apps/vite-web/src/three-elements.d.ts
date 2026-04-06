import { ThreeElements } from '@react-three/fiber'

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: ThreeElements['mesh']
    tetrahedronGeometry: ThreeElements['tetrahedronGeometry']
    boxGeometry: ThreeElements['boxGeometry']
    ambientLight: ThreeElements['ambientLight']
    pointLight: ThreeElements['pointLight']
  }
}

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}
