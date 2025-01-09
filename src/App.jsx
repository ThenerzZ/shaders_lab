import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Box, AppBar, Toolbar, Typography, Paper } from '@mui/material';
import ShaderCanvas from './components/ShaderCanvas';
import ControlPanel from './components/ControlPanel';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  const [image, setImage] = useState(null);
  const [activeShaders, setActiveShaders] = useState(['default']);
  const defaultParams = {
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    hue: 0,
    pixelate: 1.0,
    blendMode: 'normal',
    intensity: 1.0,
    roundness: 1.0,
    radius: 5.0,
    amount: 0.5,
    offset: 0,
    axis: 0,
    segments: 8.0
  };

  const [shaderParams, setShaderParams] = useState({
    default: defaultParams
  });

  const handleImageUpload = (file) => {
    console.log('File received:', file.name, 'type:', file.type, 'size:', file.size);
    
    // Create object URL instead of data URL for better performance
    const objectUrl = URL.createObjectURL(file);
    console.log('Created object URL:', objectUrl);
    
    // Test the URL works
    const img = new Image();
    img.onload = () => {
      console.log('Test image loaded successfully:', img.width, 'x', img.height);
      setImage(objectUrl);
    };
    img.onerror = (error) => {
      console.error('Error loading test image:', error);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  // Cleanup object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (image && image.startsWith('blob:')) {
        console.log('Cleaning up object URL:', image);
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleAddShader = (shader) => {
    setActiveShaders(prev => [...prev, shader]);
    // Initialize parameters for the new shader
    setShaderParams(prev => ({
      ...prev,
      [shader]: {
        ...defaultParams,
        enabled: true
      }
    }));
  };

  const handleRemoveShader = (index) => {
    setActiveShaders(prev => prev.filter((_, i) => i !== index));
  };

  const handleReorderShaders = (startIndex, endIndex) => {
    setActiveShaders(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const handleShaderParamChange = (shader, param, value) => {
    setShaderParams(prev => ({
      ...prev,
      [shader]: {
        ...prev[shader],
        [param]: value
      }
    }));
  };

  const handleReset = () => {
    // Reset to initial state with default shader
    setShaderParams({
      default: { ...defaultParams }
    });
    setActiveShaders(['default']);
  };

  const handleParamChange = (shader, param, value) => {
    setShaderParams(prev => ({
      ...prev,
      [shader]: {
        ...(prev[shader] || defaultParams),
        [param]: value
      }
    }));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Shader Lab
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1,
          gap: 2,
          p: 2,
          height: 'calc(100vh - 64px)',
          overflow: 'hidden'
        }}>
          <Paper 
            elevation={3} 
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <ShaderCanvas
              image={image}
              shaders={activeShaders}
              params={shaderParams}
            />
          </Paper>
          
          <ControlPanel
            onImageUpload={handleImageUpload}
            onAddShader={handleAddShader}
            onRemoveShader={handleRemoveShader}
            onReorderShaders={handleReorderShaders}
            onParamChange={handleShaderParamChange}
            onReset={handleReset}
            activeShaders={activeShaders}
            params={shaderParams}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
