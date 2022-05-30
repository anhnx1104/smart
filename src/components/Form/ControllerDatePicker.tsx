import DatePicker from '@mui/lab/DatePicker';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import type {
  Control,
  FieldErrors,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface Props<T> extends Omit<TextFieldProps, 'name'> {
  errors: FieldErrors<T>;
  control: Control<T>;
  name: FieldPath<T>;
  mask?: string;
  onChangeSelect?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

const ControllerDatePicker = <T extends FieldValues>(props: Props<T>) => {
  const {
    errors,
    control,
    name,
    disabled,
    mask,
    onChangeSelect,
    minDate,
    maxDate,
    ...rest
  } = props;

  return (
    <Controller
      render={({ field: { ref, ...others } }) => (
        <DatePicker
          renderInput={(props) => (
            <TextField
              {...props}
              {...rest}
              fullWidth
              error={Boolean(errors[name])}
              helperText={errors[name]?.message}
              id={name}
            />
          )}
          mask={mask}
          InputAdornmentProps={{
            position: 'start',
          }}
          {...others}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          onChange={(value: Date | null) => {
            others.onChange(value);
            if (onChangeSelect) {
              onChangeSelect(value);
            }
          }}
        />
      )}
      name={name}
      control={control}
    />
  );
};

export default ControllerDatePicker;
