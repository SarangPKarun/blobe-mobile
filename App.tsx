import * as React from 'react';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { Scene, PerspectiveCamera, BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight } from 'three';
import { PanResponder, View } from 'react-native';

export default function App() {
  const boxRef = React.useRef<Mesh | null>(null);
  const rotationState = React.useRef({ x: 0, y: 0 }); // Track rotation changes

  // Handle touch gestures with PanResponder for interactivity
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        rotationState.current.x += dx * 0.01; // Control X rotation based on horizontal swipe
        rotationState.current.y += dy * 0.01; // Control Y rotation based on vertical swipe
        if (boxRef.current) {
          boxRef.current.rotation.x = rotationState.current.y;
          boxRef.current.rotation.y = rotationState.current.x;
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={(gl: ExpoWebGLRenderingContext) => {
          // Create the WebGL renderer
          const renderer = new Renderer({ gl });
          renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

          // Create the scene
          const scene = new Scene();

          // Create the camera (looking straight at the center of the scene)
          const camera = new PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
          camera.position.z = 5; // Move the camera back a little to see the box

          // Create the green box (Cube)
          const geometry = new BoxGeometry(1, 1, 1); // 1x1x1 box
          const material = new MeshStandardMaterial({ color: 0x00ff00 }); // Green color
          const cube = new Mesh(geometry, material);
          scene.add(cube); // Add the cube to the scene
          boxRef.current = cube; // Reference to the cube

          // Add a light to illuminate the cube
          const light = new AmbientLight(0xffffff, 1); // White light
          scene.add(light);

          // Animation loop
          const animate = () => {
            requestAnimationFrame(animate);

            // Render the scene from the perspective of the camera
            renderer.render(scene, camera);

            // End the current WebGL frame
            gl.endFrameEXP();
          };

          animate(); // Start the animation loop
        }}
      />
    </View>
  );
}
