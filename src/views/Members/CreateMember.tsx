import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid } from '@mui/material';
import LinkButton from 'components/common/LinkButton';
import moment from "moment"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import FormContent from 'components/Form/FormContent';
import FormFooter from 'components/Form/FormFooter';
import FormGroup from 'components/Form/FormGroup';
import FormHeader from 'components/Form/FormHeader';
import FormLabel from 'components/Form/FormLabel';
import FormPaperGrid from 'components/Form/FormPaperGrid';
import useMounted from 'hooks/useMounted';
import useNotification from 'hooks/useNotification';
import Alert from '@mui/material/Alert';
import {
  mockMutipleSelectOptions,
  mockRadioOptions,
  mockSelectFieldOptions,
  randomIntFromInterval,
} from 'mock-axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createExampleCRUD } from 'services/crud';
import TypedObject from 'utils/TypedObject';
import * as yup from 'yup';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { addMemberDetails } from '../../services/membershipClass';

interface FormData {
  textField: string;
  selectField: number | null;
  mutipleSelectField: number[];
  radioField: number | null;
  switchField: boolean;
  date: Date | null;
  time: Date | null;
}

const validationSchema = yup.object().shape({
  textField: yup
    .string()
    .required('Required')
    .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .default(''),
  selectField: yup.number().required('Required').nullable().default(null),
  mutipleSelectField: yup
    .array()
    .of(yup.number().required('Required').nullable().default(null))
    .min(1, 'Required')
    .default([]),
  radioField: yup.number().required('Required').nullable().default(null),
  switchField: yup.bool().default(false),
  date: yup
    .date()
    .required('Required')
    .nullable()
    .typeError('Invalid date')
    .default(null),
  time: yup
    .date()
    .required('Required')
    .nullable()
    .typeError('Invalid time')
    .default(null),
});

const CreateMember = () => {
  const mounted = useMounted();
  const setNotification = useNotification();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState();
  const [status,setStatus] = useState(0)
  const [point,setPoint] = useState(0)
  const [err,setErr] = useState("")
  const [loading, setLoading] = useState<boolean>(false);


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const crudData = {
      name: name,
      email: email,
      gender: true,
      dob: moment(date).format(),
      point:point,
      status:status,
      numberPhone:phone
    };
    await addMemberDetails(crudData).then(res => {
      if (res.success) {
        console.log(res);
        navigate('/members');
        setNotification({
          message: 'Create success.',
          severity: 'success',
        });
      }
    }).catch(err => {
      setErr(err.response.data.message);
    });
    // createExampleCRUD(crudData)
    //   .then((res) => {
    //     if (res.success) {
    //       navigate('/example/crud');
    //       setNotification({
    //         message: 'Create success.',
    //         severity: 'success',
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     setNotification({
    //       error: 'Create failure.',
    //     });
    //   })
    //   .finally(() => {
    //     if (mounted.current) {
    //       setLoading(false);
    //     }
    //   });
  };
  const handleChange = (event: SelectChangeEvent) => {
    setGender(event.target.value);
  };
  return (
    <FormPaperGrid noValidate>
      <FormHeader title='Create Members' />
      <FormContent>

        <FormGroup>
          {err && <Alert style={{marginBottom:"20px"}} severity="error">{err}</Alert>}
          <Grid container alignItems='center' style={{display:"flex" ,justifyContent:"center"}} spacing={2}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title='Họ tên' name='name' />
            </Grid>
            <Grid item xs={12} sm={8} md={4}  >
              <TextField id='outlined-basic' style={{ width: '100%' }}
                         onChange={(e) => setName(e.target.value)}
                         size={'medium'} variant='outlined' />
            </Grid>

          </Grid>
        </FormGroup>
        <FormGroup >
          <Grid container alignItems='center' style={{display:"flex" ,justifyContent:"center"}} spacing={2}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title='Giới tính' name='gender' />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <Select
                style={{ width: '100%' }}
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={gender}
                onChange={handleChange}
              >
                <MenuItem value={'true'}>Nam</MenuItem>
                <MenuItem value={'false'}>Nữ</MenuItem>
              </Select>
            </Grid>

          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container alignItems='center' style={{display:"flex" ,justifyContent:"center"}} spacing={2}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title='Số điện thoại' name='phone' />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <TextField id='outlined-basic' style={{ width: '100%' }} size={'medium'}
                         onChange={(e) => setPhone(e.target.value)}
                         variant='outlined' />
            </Grid>

          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container alignItems='center' style={{display:"flex" ,justifyContent:"center"}} spacing={2}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title='Email' name='email' />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <TextField id='outlined-basic' style={{ width: '100%' }}
                         onChange={(e) => setEmail(e.target.value)}
                         size={'medium'} variant='outlined' />
            </Grid>

          </Grid>
        </FormGroup>

        <FormGroup>
          <Grid container alignItems='center' style={{display:"flex" ,justifyContent:"center"}} spacing={2}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title='Date' name='date' />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <DatePicker
                value={date}
                onChange={(newValue: any) => {
                  setDate(newValue);
                }}
                renderInput={(params) => <TextField style={{width:"100%"}} {...params} />}
              />
            </Grid>

          </Grid>
        </FormGroup>
      </FormContent>
      <FormFooter>
        <LinkButton startIcon={<ArrowBackIcon />} to='/example/crud'>
          Back to list
        </LinkButton>
        <LoadingButton
          startIcon={<SaveIcon />}
          loadingPosition='start'
          type='submit'
          disabled={!TypedObject.isEmpty(errors)}
          onClick={onSubmit}
        >
          Lưu
        </LoadingButton>
      </FormFooter>
    </FormPaperGrid>
  );
};

export default CreateMember;
