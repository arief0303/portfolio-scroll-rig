import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { invalidate, useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import { GlobalCanvas, useCanvas, ScrollScene, HijackedScrollbar } from '@14islands/r3f-scroll-rig'
import './styles.css'

function SpinningBox({ scale, scrollState }) {
  const ref = useRef()

  useFrame(() => {
    /*
     * `scrollState` contains non-reactive info on the element's scroll progress
     */
    if (scrollState.inViewport) {
      ref.current.rotation.x = ref.current.rotation.y += 0.001
      invalidate() // resume the r3f frame loop (by default we only render when needed)
    }
  })

  /*
   * `scale` contains the size of the DOM element we are tracking
   *  By default, scroll-rig scales 1px = 1 unit in threejs to make calculations easier
   */
  const size = Math.min(scale.width, scale.height) * 0.5

  return (
    <Box scale={size} ref={ref}>
      <meshNormalMaterial attach="material" />
    </Box>
  )
}

function WebGLThingy() {
  const el = useRef()

  const set = useCanvas(
    <ScrollScene el={el} debug={false}>
      {(props) => <SpinningBox {...props} />}
    </ScrollScene>
  )

  return (
    <>
      <div ref={el} className="SomeDomContent" onPointerEnter={() => set({ debug: true })} onPointerLeave={() => set({ debug: false })}>
        This HTML element will be tracked during scroll and hidden by the ScrollScene
      </div>
    </>
  )
}

const Row = ({ children }) => <div className="row">{children}</div>

function App() {
  return (
    <>
      <HijackedScrollbar>
        {(bind) => (
          <article {...bind}>
            <Row>@14islands/r3f-scroll-rig</Row>
            <Row>Demo: Basic mix of HTML and WebGL</Row>
            <Row>
              <WebGLThingy />
            </Row>
            <Row>More HTML content</Row>
            <Row>More HTML content</Row>
            <Row>More HTML content</Row>
          </article>
        )}
      </HijackedScrollbar>
      <GlobalCanvas>
        {/* 
        By default this canvas will overlay the DOM content 
        with pointer-events: none;
        Defaults:
          - R3f aycaster is off by default: use noEvents={false} to turn on
          - antialias: true,
          - alpha: true,
          - Pixel ratio is scaled automatically
        */}
      </GlobalCanvas>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
