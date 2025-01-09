# Shader Lab 🎨

A powerful real-time image shader application built with React and Three.js. Apply and combine various shader effects to your images with an intuitive user interface.


## Features

### 🎯 Core Features
- Real-time shader processing
- Multiple shader effects
- Drag & drop image upload
- Adjustable shader parameters
- Stackable effects with blend modes
- Reorderable shader stack

### 🌈 Available Shaders
1. **Basic Adjustments**
   - Brightness
   - Contrast
   - Saturation
   - Hue Rotation

2. **Pixelate**
   - Square pixels
   - Hexagonal pixels
   - Circle pixels

3. **Glitch**
   - Classic glitch
   - Vertical glitch
   - Block glitch

4. **ASCII Art**
   - Classic ASCII
   - Colored ASCII
   - Matrix style

5. **Other Effects**
   - Wave distortion
   - RGB shift
   - Kaleidoscope
   - Vignette
   - Blur
   - Noise
   - Mirror

### 🎨 Blend Modes
- Normal
- Multiply
- Screen
- Overlay
- Darken
- Lighten

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ThenerzZ/shaders_lab.git

# Navigate to project directory
cd shaders_lab

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

## 💻 Usage

1. **Upload an Image**
   - Drag & drop an image into the upload area
   - Or click to select from your files

2. **Add Shaders**
   - Click the "Add Shader Effect" dropdown
   - Select desired shader from the list

3. **Adjust Parameters**
   - Use sliders to fine-tune shader parameters
   - Experiment with different blend modes
   - Try different shader modes for varied effects

4. **Manage Shader Stack**
   - Drag shaders to reorder them
   - Remove unwanted shaders
   - Reset all parameters if needed

## 🛠️ Built With
- [React](https://reactjs.org/) - UI Framework
- [Three.js](https://threejs.org/) - 3D Graphics Library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [Material-UI](https://mui.com/) - UI Components
- [GLSL](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)) - Shader Language

## 📝 Technical Details

### Shader Implementation
Each shader is implemented using GLSL and supports:
- Custom uniforms for parameter control
- Multiple rendering modes
- Blend mode support
- Real-time parameter updates

### Performance
- Efficient texture handling
- GPU-accelerated processing
- Optimized render pipeline
- Automatic resource cleanup

## 🤝 Contributing

Contributions are welcome! Here are some ways you can contribute:

1. **Add New Shaders**
   - Implement new shader effects
   - Add new blend modes
   - Create new shader modes

2. **Improve Performance**
   - Optimize render pipeline
   - Enhance memory management
   - Improve resource utilization

3. **Bug Fixes**
   - Report issues
   - Submit pull requests
   - Improve error handling

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- Three.js community for shader examples and inspiration
- React Three Fiber team for the amazing React integration
- Material-UI team for the beautiful components

## 🔮 Future Plans
- Export processed images
- Shader preset system
- More shader effects
- Batch processing
- WebGL 2.0 features
- Mobile optimization
