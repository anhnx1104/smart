import Box from '@mui/material/Box';

interface ImagePlaceHolderProps {
  src?: string;
  error?: string | null;
  height?: number;
  width?: number;
}

const ImagePlaceHolder = (props: ImagePlaceHolderProps) => {
  const { src, error, height, width } = props;
  return (
    <Box
      sx={{
        border: 3,
        borderRadius: 1,
        borderStyle: 'dashed',
        borderColor: 'divider',
        height: height,
        width: width,
        position: 'relative',
        ...(src && {
          backgroundImage: `url(${src})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          cursor: 'pointer',
        }),
        ...(error && {
          borderColor: 'error.main',
        }),
      }}
    />
  );
};

export default ImagePlaceHolder;
