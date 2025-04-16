import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Upload as UploadIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { dropZoneStyles, fileInfoStyles, emptyDropZoneStyles } from '../../styles/textAnalyzerStyles';

/**
 * Componente DropZone riutilizzabile per il caricamento di file tramite drag & drop o click
 */
const DropZone = ({ 
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  file,
  onRemoveFile,
  isDragActive = false,
  acceptedFormats = "File supportati"
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={dropZoneStyles(isDragActive, !!file, theme)}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      {file ? (
        <Box sx={fileInfoStyles.container}>
          <DescriptionIcon color="success" sx={fileInfoStyles.icon} />
          <Typography variant="body1" gutterBottom sx={fileInfoStyles.fileName}>
            {file.name}
          </Typography>
          <Typography variant="body2" sx={fileInfoStyles.fileSize}>
            {(file.size / 1024).toFixed(2)} KB
          </Typography>
          
          <Box sx={fileInfoStyles.actionsContainer}>
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFile();
              }}
              color="error"
              variant="outlined"
              sx={fileInfoStyles.removeButton}
            >
              Rimuovi
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <UploadIcon sx={emptyDropZoneStyles.icon} />
          <Typography variant="body1" gutterBottom sx={emptyDropZoneStyles.title}>
            Trascina qui un file o fai click per selezionarlo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {acceptedFormats}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DropZone; 