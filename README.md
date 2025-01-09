# Shader Lab 🎨 (Experimental)

A WebGL shader demonstration project built with React and Three.js. This is an experimental project showcasing various GLSL shader effects and their combinations. Please note that this is a work in progress and may have stability issues.

## ⚠️ Current Status
This project is in early development and serves primarily as a demonstration/learning tool for WebGL shaders. Known issues include:
- Rendering stability issues
- Performance limitations with multiple shaders
- Occasional visual glitches
- Limited browser compatibility

## 🎯 Purpose
The main goal of this project is to demonstrate:
- GLSL shader implementation in a React environment
- Real-time shader parameter manipulation
- Shader combination techniques
- WebGL texture handling

## 🌈 Available Shaders
Each shader is implemented as a GLSL fragment shader:

1. **Basic Image Adjustments**
   - Brightness/Contrast
   - Saturation/Hue
   - Basic color manipulation

2. **Effect Shaders**
   - Pixelation (with multiple modes)
   - Wave distortion
   - RGB shift
   - Kaleidoscope
   - Vignette
   - Blur
   - Glitch effects
   - Noise
   - Mirror
   - ASCII art

3. **Blend Modes (not working)**
   - Normal
   - Multiply
   - Screen
   - Overlay
   - Darken
   - Lighten

## 🚀 Getting Started

### Prerequisites
- Node.js
- Modern web browser with WebGL support

### Installation
```bash
git clone https://github.com/ThenerzZ/shaders_lab.git
cd shaders_lab
npm install
npm run dev
```

## 💻 Usage
1. Upload an image using drag & drop
2. Add shader effects from the dropdown
3. Adjust parameters using the sliders
4. Experiment with different combinations

## ⚙️ Technical Implementation
- Built with React and Three.js
- Uses React Three Fiber for Three.js integration
- GLSL shaders for all effects
- Material-UI for the interface

## 🐛 Known Issues
1. **Rendering Issues**
   - White screen on some browsers
   - Inconsistent shader behavior
   - Memory leaks with multiple effects

2. **Performance**
   - Slow with multiple shaders
   - High memory usage
   - Frame rate drops with complex effects

3. **Browser Support**
   - Limited mobile support
   - WebGL compatibility issues
   - Inconsistent behavior across browsers

## 📜 License
MIT License - Feel free to use this code for learning and experimentation.
