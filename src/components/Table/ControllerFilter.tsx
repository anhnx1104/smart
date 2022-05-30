import {
  Autocomplete,
  Box,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import React from 'react';
import type { Dictionary } from 'types/common';

interface Option extends Dictionary {
  id: number;
}

interface Label extends Option {
  name: string;
}

type Props<O extends Option[]> = {
  options: O;
  selector: (option: O[number]) => string;
  placeholder: string;
  title: string;
  onChangeSelect: (id: number | null) => void;
  value: any | null;
} & Omit<TextFieldProps, 'name'>;

const ControllerFilter = <O extends Option[]>(props: Props<O>) => {
  const { options, placeholder, title, selector, onChangeSelect, value } =
    props;

  const labels = options.reduce((acc: Record<number, Label>, option) => {
    const { id } = option;
    acc[id] = { id, name: selector(option) };
    return acc;
  }, {});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <FormLabel htmlFor="search">
        <Typography variant="body2" gutterBottom sx={{ ml: 0.5 }}>
          {title}
        </Typography>
      </FormLabel>
      <Box sx={{ display: 'flex' }}>
        <Autocomplete
          disablePortal
          options={options.map((option) => option.id)}
          value={value}
          fullWidth
          getOptionLabel={(option) => labels[option]?.name ?? 'Not available1'}
          renderInput={(params) => (
            <TextField {...params} placeholder={placeholder} />
          )}
          onChange={(_event, newValue: number | null) => {
            onChangeSelect(newValue);
          }}
          renderOption={(props, option: number) => (
            <Box component="li" {...props} key={option}>
              <Box>{labels[option]?.name ?? 'Not available'}</Box>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};

export default ControllerFilter;
