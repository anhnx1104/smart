import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import type { DropzoneOptions } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { Grid } from '@mui/material';

interface FileDropzoneProps extends DropzoneOptions {
  onRemove?: (file: File) => void;
  onRemoveAll?: () => void;
  onUpload?: () => void;
}

const ImageButton: FC<FileDropzoneProps> = (props) => {
  const { accept, maxFiles, maxSize, minSize, onDrop } = props;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onDrop,
    multiple: false,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        border: 1.5,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        // borderStyle: 'dashed',
        borderColor: 'divider',
        justifyContent: 'center',
        alignItems: 'center',
        // ml: 1.5,
        ...(isDragActive && {
          backgroundColor: 'action.active',
          opacity: 0.5,
        }),
        '&:hover': {
          backgroundColor: 'action.hover',
          cursor: 'pointer',
          opacity: 0.5,
        },
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} sm={4} md={4}>
            <AddPhotoAlternateIcon fontSize="medium" color="action" />
          </Grid>
          <Grid item xs={12} sm={4} md={8}>
            <Typography variant="caption" sx={{ mt: 1 }} color="text.secondary">
              Browse
            </Typography>
          </Grid>

        </Grid>

      </Box>
    </Box>
  );
};

export default ImageButton;
