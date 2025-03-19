import * as React from 'react';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { 
  Scene, 
  PerspectiveCamera, 
  SphereGeometry, 
  MeshStandardMaterial, 
  Mesh, 
  AmbientLight,
  TextureLoader,
} from 'three';
import { PanResponder, View } from 'react-native';

export default function ThreeScene() {
  // Use globeRef instead of boxRef.
  const globeRef = React.useRef<Mesh | null>(null);
  // Keep track of gesture rotation.
  const rotationState = React.useRef({ x: 0, y: 0 });

  // Handle touch gestures with PanResponder.
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        rotationState.current.x += dx * 0.01;
        rotationState.current.y += dy * 0.01;
        if (globeRef.current) {
          // Start with the initial rotation offsets (matching the reference):
          //   x: -Math.PI/2 and y: Math.PI, then add the gesture rotation.
          globeRef.current.rotation.x = -Math.PI / 2 + rotationState.current.y;
          globeRef.current.rotation.y = Math.PI + rotationState.current.x;
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={(gl: ExpoWebGLRenderingContext) => {
            // Create the WebGL renderer.
            const renderer = new Renderer({ gl });
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

            // Create the scene.
            const scene = new Scene();

            // Create the camera (looking straight at the scene center).
            const camera = new PerspectiveCamera(
                75,
                gl.drawingBufferWidth / gl.drawingBufferHeight,
                0.1,
                1000
            );
            camera.position.z = 5;

            // Create the globe geometry.
            const geometry = new SphereGeometry(1.5, 32, 32);
            const textureLoader = new TextureLoader();
            // Load the globe texture and create the material.
            // textureLoader.load('../assets/textures/globe_texture.jpeg', (texture) => {
            //     const material = new MeshStandardMaterial({ map: texture });
            //     const globe = new Mesh(geometry, material);
            //     // Set initial rotation to orient the globe correctly.
            //     globe.rotation.x = -Math.PI / 2;
            //     globe.rotation.y = Math.PI;
            //     scene.add(globe);
            //     globeRef.current = globe;
            // });

            const material = new MeshStandardMaterial({ color: 0x34ffff }); // Green color
            const globe = new Mesh(geometry, material);
            scene.add(globe); // Add the cube to the scene
            globeRef.current = globe; // Reference to the cube

            // Add ambient light.
            const light = new AmbientLight(0xffffff, 1);
            scene.add(light);

            // Animation loop.
            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
                gl.endFrameEXP();
          };

          animate();
        }}
      />
    </View>
  );
}





