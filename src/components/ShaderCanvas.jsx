import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  defaultVertexShader,
  defaultFragmentShader,
  pixelateFragmentShader,
  waveFragmentShader,
  rgbShiftFragmentShader,
  kaleidoscopeFragmentShader,
  vignetteFragmentShader,
  blurFragmentShader,
  glitchFragmentShader,
  noiseFragmentShader,
  mirrorFragmentShader
} from '../shaders/shaderMaterials';

const ImagePlane = ({ image, shaders, params }) => {
  const meshRef = useRef();
  const textureRef = useRef();
  const renderTargetsRef = useRef([]);
  const materialsRef = useRef([]);
  const { size, gl, camera } = useThree();
  const timeRef = useRef(0);

  // Calculate plane dimensions to fit viewport while maintaining aspect ratio
  const calculatePlaneDimensions = (imageWidth, imageHeight) => {
    const imageAspect = imageWidth / imageHeight;
    const viewportAspect = size.width / size.height;
    let width, height;

    if (imageAspect > viewportAspect) {
      // Image is wider than viewport
      width = 1;
      height = 1 / imageAspect;
    } else {
      // Image is taller than viewport
      height = 1;
      width = imageAspect;
    }

    return { width, height };
  };

  // Load and setup texture
  useEffect(() => {
    if (!image) return;

    console.log('Loading image:', image.substring(0, 50) + '...');
    const loader = new THREE.TextureLoader();
    
    loader.load(
      image,
      (texture) => {
        console.log('Texture loaded successfully');
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        textureRef.current = texture;

        // Create initial material with the texture
        const material = new THREE.ShaderMaterial({
          uniforms: {
            tDiffuse: { value: texture },
            brightness: { value: 1.0 },
            contrast: { value: 1.0 },
            saturation: { value: 1.0 },
            hue: { value: 0 },
            blendMode: { value: 0 }
          },
          vertexShader: defaultVertexShader,
          fragmentShader: defaultFragmentShader,
          transparent: true
        });

        if (meshRef.current) {
          const { width, height } = calculatePlaneDimensions(
            texture.image.width,
            texture.image.height
          );
          meshRef.current.geometry.dispose();
          meshRef.current.geometry = new THREE.PlaneGeometry(width, height);
          meshRef.current.material = material;
          meshRef.current.material.needsUpdate = true;
        }

        // Initialize materials and render targets after texture is loaded
        setupMaterialsAndRenderTargets();
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading texture:', error);
      }
    );

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      renderTargetsRef.current.forEach(rt => rt.dispose());
      materialsRef.current.forEach(mat => mat.dispose());
      renderTargetsRef.current = [];
      materialsRef.current = [];
    };
  }, [image]);

  // Setup materials and render targets function
  const setupMaterialsAndRenderTargets = () => {
    if (!textureRef.current) return;

    // Cleanup old render targets and materials
    renderTargetsRef.current.forEach(rt => rt.dispose());
    materialsRef.current.forEach(mat => mat.dispose());
    renderTargetsRef.current = [];
    materialsRef.current = [];

    // Create render targets and materials for each shader
    shaders.forEach((shader, index) => {
      const renderTarget = new THREE.WebGLRenderTarget(
        textureRef.current.image.width,
        textureRef.current.image.height,
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          type: THREE.FloatType
        }
      );

      // Get fragment shader
      let fragmentShader = defaultFragmentShader;
      switch (shader) {
        case 'pixelate': fragmentShader = pixelateFragmentShader; break;
        case 'wave': fragmentShader = waveFragmentShader; break;
        case 'rgb-shift': fragmentShader = rgbShiftFragmentShader; break;
        case 'kaleidoscope': fragmentShader = kaleidoscopeFragmentShader; break;
        case 'vignette': fragmentShader = vignetteFragmentShader; break;
        case 'blur': fragmentShader = blurFragmentShader; break;
        case 'glitch': fragmentShader = glitchFragmentShader; break;
        case 'noise': fragmentShader = noiseFragmentShader; break;
        case 'mirror': fragmentShader = mirrorFragmentShader; break;
      }

      // Get blend mode
      const shaderParams = params[shader] || {};
      const blendMode = shaderParams.blendMode || 'normal';

      // Create material with blend mode support
      const material = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: index === 0 ? textureRef.current : renderTargetsRef.current[index - 1].texture },
          brightness: { value: 1.0 },
          contrast: { value: 1.0 },
          saturation: { value: 1.0 },
          hue: { value: 0 },
          pixelate: { value: 1.0 },
          time: { value: 0 },
          amount: { value: 0.01 },
          segments: { value: 8.0 },
          resolution: { value: new THREE.Vector2(textureRef.current.image.width, textureRef.current.image.height) },
          intensity: { value: 1.0 },
          roundness: { value: 1.0 },
          radius: { value: 5.0 },
          offset: { value: 0 },
          axis: { value: 0 },
          blendMode: { value: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten'].indexOf(blendMode) }
        },
        vertexShader: defaultVertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.SrcAlphaFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor
      });

      renderTargetsRef.current.push(renderTarget);
      materialsRef.current.push(material);
    });

    if (meshRef.current && materialsRef.current.length > 0) {
      meshRef.current.material = materialsRef.current[materialsRef.current.length - 1];
      meshRef.current.material.needsUpdate = true;
    }
  };

  // Update materials when shaders change
  useEffect(() => {
    if (textureRef.current) {
      setupMaterialsAndRenderTargets();
    }
  }, [shaders, size]);

  // Update shader parameters
  useEffect(() => {
    materialsRef.current.forEach((material, index) => {
      const shader = shaders[index];
      const shaderParams = params[shader] || {};

      Object.entries(shaderParams).forEach(([key, value]) => {
        if (material.uniforms[key]) {
          material.uniforms[key].value = value;
        }
      });
    });
  }, [shaders, params]);

  // Animation and render loop
  useFrame(({ clock, gl, scene, camera }) => {
    if (!textureRef.current || materialsRef.current.length === 0) return;

    timeRef.current = clock.getElapsedTime();

    // Update time uniform for all materials
    materialsRef.current.forEach(material => {
      if (material.uniforms.time) {
        material.uniforms.time.value = timeRef.current;
      }
    });

    // Render each shader pass
    materialsRef.current.forEach((material, index) => {
      if (index < materialsRef.current.length - 1) {
        meshRef.current.material = material;
        gl.setRenderTarget(renderTargetsRef.current[index]);
        gl.render(scene, camera);
      }
    });

    // Final render to screen
    meshRef.current.material = materialsRef.current[materialsRef.current.length - 1];
    gl.setRenderTarget(null);
    gl.render(scene, camera);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#666666" />
    </mesh>
  );
};

const ShaderCanvas = (props) => {
  return (
    <div style={{ width: '100%', height: '100%', background: '#2a2a2a' }}>
      <Canvas
        orthographic
        camera={{ 
          zoom: 1,
          position: [0, 0, 1],
          near: -1000,
          far: 1000,
          left: -0.5,
          right: 0.5,
          top: 0.5,
          bottom: -0.5
        }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={['#2a2a2a']} />
        <ImagePlane {...props} />
      </Canvas>
    </div>
  );
};

export default ShaderCanvas;
