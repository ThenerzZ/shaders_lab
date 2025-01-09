import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Paper, 
  Typography, 
  Slider, 
  Select, 
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
  Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const shaderOptions = [
  { value: 'default', label: 'Default' },
  { value: 'pixelate', label: 'Pixelate' },
  { value: 'wave', label: 'Wave' },
  { value: 'rgb-shift', label: 'RGB Shift' },
  { value: 'kaleidoscope', label: 'Kaleidoscope' },
  { value: 'vignette', label: 'Vignette' },
  { value: 'blur', label: 'Blur' },
  { value: 'glitch', label: 'Glitch' },
  { value: 'noise', label: 'Noise' },
  { value: 'mirror', label: 'Mirror' }
];

const blendModes = [
  { value: 'normal', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' }
];

const ControlPanel = ({ 
  onImageUpload, 
  onAddShader, 
  onRemoveShader, 
  onReorderShaders,
  onParamChange, 
  onReset, 
  activeShaders, 
  params 
}) => {
  const onDrop = useCallback(acceptedFiles => {
    console.log('Files dropped:', acceptedFiles);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log('Uploading file:', file.name, 'type:', file.type, 'size:', file.size);
      if (!file.type.startsWith('image/')) {
        console.error('File is not an image:', file.type);
        return;
      }
      onImageUpload(file);
    } else {
      console.log('No accepted files');
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    onDropRejected: (rejectedFiles) => {
      console.error('Files rejected:', rejectedFiles);
      rejectedFiles.forEach(rejection => {
        console.error('Rejection errors:', rejection.errors);
      });
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: 300,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflow: 'auto'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Controls
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.500',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover'
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography>
          {isDragActive ? 'Drop image here' : 'Drag & drop image or click to select'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Add Shader Effect</InputLabel>
          <Select
            value=""
            label="Add Shader Effect"
            onChange={(e) => {
              if (e.target.value) {
                onAddShader(e.target.value);
                e.target.value = "";
              }
            }}
          >
            {shaderOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;
          onReorderShaders(result.source.index, result.destination.index);
        }}
      >
        <Droppable droppableId="shader-list">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ mb: 2 }}
            >
              {activeShaders.map((shader, index) => (
                <Draggable
                  key={`${shader}-${index}`}
                  draggableId={`${shader}-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 1,
                        borderRadius: 1,
                        flexDirection: 'column',
                        alignItems: 'stretch'
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        width: '100%'
                      }}>
                        <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                          <DragHandleIcon />
                        </Box>
                        <ListItemText 
                          primary={shaderOptions.find(opt => opt.value === shader)?.label || shader}
                        />
                        <IconButton
                          edge="end"
                          onClick={() => onRemoveShader(index)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      <Collapse in={true}>
                        <Box sx={{ p: 2 }}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Blend Mode</InputLabel>
                            <Select
                              value={params[shader]?.blendMode || 'normal'}
                              label="Blend Mode"
                              onChange={(e) => onParamChange(shader, 'blendMode', e.target.value)}
                              size="small"
                            >
                              {blendModes.map(mode => (
                                <MenuItem key={mode.value} value={mode.value}>
                                  {mode.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          {/* Shader-specific controls */}
                          {shader === 'default' && (
                            <Stack spacing={2}>
                              <Box>
                                <Typography gutterBottom variant="caption">Brightness</Typography>
                                <Slider
                                  value={params[shader]?.brightness || 1}
                                  onChange={(e, value) => onParamChange(shader, 'brightness', value)}
                                  min={0}
                                  max={2}
                                  step={0.1}
                                  valueLabelDisplay="auto"
                                  size="small"
                                />
                              </Box>

                              <Box>
                                <Typography gutterBottom variant="caption">Contrast</Typography>
                                <Slider
                                  value={params[shader]?.contrast || 1}
                                  onChange={(e, value) => onParamChange(shader, 'contrast', value)}
                                  min={0}
                                  max={2}
                                  step={0.1}
                                  valueLabelDisplay="auto"
                                  size="small"
                                />
                              </Box>

                              <Box>
                                <Typography gutterBottom variant="caption">Saturation</Typography>
                                <Slider
                                  value={params[shader]?.saturation || 1}
                                  onChange={(e, value) => onParamChange(shader, 'saturation', value)}
                                  min={0}
                                  max={2}
                                  step={0.1}
                                  valueLabelDisplay="auto"
                                  size="small"
                                />
                              </Box>

                              <Box>
                                <Typography gutterBottom variant="caption">Hue Rotation</Typography>
                                <Slider
                                  value={params[shader]?.hue || 0}
                                  onChange={(e, value) => onParamChange(shader, 'hue', value)}
                                  min={0}
                                  max={360}
                                  step={1}
                                  valueLabelDisplay="auto"
                                  size="small"
                                />
                              </Box>
                            </Stack>
                          )}

                          {shader === 'pixelate' && (
                            <Box>
                              <Typography gutterBottom variant="caption">Pixelate</Typography>
                              <Slider
                                value={params[shader]?.pixelate || 1}
                                onChange={(e, value) => onParamChange(shader, 'pixelate', value)}
                                min={1}
                                max={100}
                                step={1}
                                valueLabelDisplay="auto"
                                size="small"
                              />
                            </Box>
                          )}

                          {shader === 'vignette' && (
                            <>
                              <Box>
                                <Typography gutterBottom variant="caption">Intensity</Typography>
                                <Slider
                                  value={params[shader]?.intensity || 1}
                                  onChange={(e, value) => onParamChange(shader, 'intensity', value)}
                                  min={0}
                                  max={2}
                                  step={0.1}
                                  valueLabelDisplay="auto"
                                  size="small"
                                />
                              </Box>
                              <Box>
                                <Typography gutterBottom variant="caption">Roundness</Typography>
                                <Slider
                                  value={params[shader]?.roundness || 1}
                                  onChange={(e, value) => onParamChange(shader, 'roundness', value)}
                                  min={0}
                                  max={2}
                                  step={0.1}
                                  valueLabelDisplay="auto"
                                  size="small"
                                />
                              </Box>
                            </>
                          )}

                          {shader === 'blur' && (
                            <Box>
                              <Typography gutterBottom variant="caption">Radius</Typography>
                              <Slider
                                value={params[shader]?.radius || 5}
                                onChange={(e, value) => onParamChange(shader, 'radius', value)}
                                min={0}
                                max={20}
                                step={0.5}
                                valueLabelDisplay="auto"
                                size="small"
                              />
                            </Box>
                          )}

                          {shader === 'glitch' && (
                            <Box>
                              <Typography gutterBottom variant="caption">Intensity</Typography>
                              <Slider
                                value={params[shader]?.intensity || 0.5}
                                onChange={(e, value) => onParamChange(shader, 'intensity', value)}
                                min={0}
                                max={1}
                                step={0.01}
                                valueLabelDisplay="auto"
                                size="small"
                              />
                            </Box>
                          )}

                          {shader === 'noise' && (
                            <Box>
                              <Typography gutterBottom variant="caption">Amount</Typography>
                              <Slider
                                value={params[shader]?.amount || 0.5}
                                onChange={(e, value) => onParamChange(shader, 'amount', value)}
                                min={0}
                                max={1}
                                step={0.01}
                                valueLabelDisplay="auto"
                                size="small"
                              />
                            </Box>
                          )}

                          {shader === 'mirror' && (
                            <>
                              <Box>
                                <Typography gutterBottom variant="caption">Offset</Typography>
                                <Slider
                                  value={params[shader]?.offset || 0}
                                  onChange={(e, value) => onParamChange(shader, 'offset', value)}
                                  min={-0.5}
                                  max={0.5}
                                  step={0.01}
                                  valueLabelDisplay="auto"
                                  size="small"
                                />
                              </Box>
                              <FormControl fullWidth size="small">
                                <InputLabel>Axis</InputLabel>
                                <Select
                                  value={params[shader]?.axis || 0}
                                  label="Axis"
                                  onChange={(e) => onParamChange(shader, 'axis', e.target.value)}
                                >
                                  <MenuItem value={0}>Horizontal</MenuItem>
                                  <MenuItem value={1}>Vertical</MenuItem>
                                </Select>
                              </FormControl>
                            </>
                          )}
                        </Box>
                      </Collapse>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={onReset}
        >
          Reset All Parameters
        </Button>
      </Box>
    </Paper>
  );
};

export default ControlPanel;
