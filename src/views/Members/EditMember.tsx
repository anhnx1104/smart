import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { Collapse, Grid, Input, TextField } from '@mui/material';
import LinkButton from 'components/common/LinkButton';
import LoadingScreen from 'components/common/LoadingScreen';
import * as React from 'react';
import FormControlUnstyled, {
  useFormControlUnstyledContext,
} from '@mui/base/FormControlUnstyled';
import InputUnstyled, { inputUnstyledClasses } from '@mui/base/InputUnstyled';
import { styled } from '@mui/system';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormContent from 'components/Form/FormContent';
import FormFooter from 'components/Form/FormFooter';
import FormGroup from 'components/Form/FormGroup';
import FormHeader from 'components/Form/FormHeader';
import FormLabel from 'components/Form/FormLabel';
import FormPaperGrid from 'components/Form/FormPaperGrid';
import useMounted from 'hooks/useMounted';
import {
  emailTemplateOptions,
  mockMutipleSelectOptions,
  mockRadioOptions,
  mockSelectFieldOptions,
  pointTypeOptions,
  randomIntFromInterval,
  unitOptions,
} from 'mock-axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { createExampleCRUD, ExampleCRUD, getCRUDDetails } from 'services/crud';
import * as yup from 'yup';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import {
  editMembers,
  getMemberDetails,
  getMembershipClassDetails,
  MembershipClass,
} from 'services/membershipClass';
import ControllerCheckbox from 'components/Form/ControllerCheckbox';
import { Label } from '@mui/icons-material';
import ControllerTextField from '../../components/Form/ControllerTextField';
import EntityMultipleSelecter from '../../components/Form/EntityMultipleSelecter';
import ControllerRadio from '../../components/Form/ControllerRadio';
import ControllerSwitch from '../../components/Form/ControllerSwitch';
import ControllerDatePicker from '../../components/Form/ControllerDatePicker';
import ControllerTimePicker from '../../components/Form/ControllerTimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import TypedObject from '../../utils/TypedObject';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';

interface FormData {
  name: string;
  description: string;
  categories: number;
  condition: string;
  pointOfClass: string;
  image: File | null;
  fileUpload: File | null;
  endowPoint: boolean;
  value: number;
  unit: number;
  pointType: number;
  status: number;
  sendMail: boolean;
  sendMail50: boolean;
  sendMail75: boolean;
  sendMail90: boolean;
  otherDiscount: boolean;
  discount: boolean;
  emailId: string;
}

interface FormData {
  textField: string;
  selectField: number | null;
  mutipleSelectField: number[];
  radioField: number | null;
  switchField: boolean;
  date: Date | null;
  time: Date | null;
}

const validationSchema = yup.object().shape({});

const DetailsMembershipClassForm = () => {
  const { id: membershipClassId } = useParams();
  const mounted = useMounted();
  const [membershipClassDetails, setMembershipClassDetails] =
    useState<MembershipClass | null>(null);
  const [taskQueue, setTaskQueue] = useState<number>(0); //to render loading
  const [expanded, setExpanded] = useState<boolean>(false);
  const [expandedDiscount, setExpandedDiscount] = useState<boolean>(false);
  const [expandedOtherDiscount, setExpandedOtherDiscount] =
    useState<boolean>(false);
  const [checkedEndowPoint, setCheckedEndowPoint] = useState<boolean>(false);
  const [checkedDiscount, setCheckedDiscount] = useState<boolean>(false);
  const [checkedOtherDiscount, setCheckedOtherDiscount] =
    useState<boolean>(false);
  const [checkedSendMail, setCheckedSendMail] = useState<boolean>(false);
  const [checkedSendMail50, setCheckedSendMail50] = useState<boolean>(false);
  const [checkedSendMail75, setCheckedSendMail75] = useState<boolean>(false);
  const [checkedSendMail90, setCheckedSendMail90] = useState<boolean>(false);
  const [expandedSendMail, setExpandedSendMail] = useState<boolean>(false);
  const [expandedSendMail50, setExpandedSendMail50] = useState<boolean>(false);
  const [expandedSendMail75, setExpandedSendMail75] = useState<boolean>(false);
  const [expandedSendMail90, setExpandedSendMail90] = useState<boolean>(false);
  const [date, setDate] = useState();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(0);
  const [point, setPoint] = useState(0);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  //call api to get data details
  useEffect(() => {
    if (!membershipClassId) return;

    setTaskQueue((task) => task + 1);
    getMemberDetails(membershipClassId)
      .then((res) => {
        setMembershipClassDetails(res.data);
        if (res.data?.endowPoint === true) {
          setCheckedEndowPoint(true);
          setExpanded(true);
        }
        if (res.data?.discount === true) {
          setCheckedDiscount(true);
          setExpandedDiscount(true);
        }
        if (res.data?.otherDiscount === true) {
          setCheckedOtherDiscount(true);
          setExpandedOtherDiscount(true);
        }
        if (res.data?.sendMail === true) {
          setCheckedSendMail(true);
          setExpandedSendMail(true);
        }
        if (res.data?.sendMail50 === true) {
          setCheckedSendMail50(true);
          setExpandedSendMail50(true);
        }
        if (res.data?.sendMail75 === true) {
          setCheckedSendMail75(true);
          setExpandedSendMail75(true);
        }
        if (res.data?.sendMail90 === true) {
          setCheckedSendMail90(true);
          setExpandedSendMail90(true);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (mounted.current) {
          setTaskQueue((task) => task - 1);
        }
      });
  }, [membershipClassId, mounted]);
  console.log('rrrrrrrrrrr', membershipClassDetails);
  //reset form value form data details
  useEffect(() => {
    if (!membershipClassDetails) return;

    const {
      name,
      description,
      categories,
      condition,
      pointOfClass,
      image,
      fileUpload,
      endowPoint,
      value,
      unit,
      pointType,
      status,
      sendMail,
      sendMail50,
      sendMail75,
      sendMail90,
      otherDiscount,
      discount,
      emailId,
    } = membershipClassDetails;

    reset({
      name,
      description,
      categories,
      condition,
      pointOfClass,
      image,
      fileUpload,
      endowPoint,
      value,
      unit,
      pointType,
      status,
      sendMail,
      sendMail50,
      sendMail75,
      sendMail90,
      otherDiscount,
      discount,
      emailId,
    });
  }, [membershipClassDetails, reset]);

  if (taskQueue > 0) {
    return <LoadingScreen />;
  }
  const handleEdit = async () => {
    const data = {
      numberPhone: phone,
      name: name,
      email: email,
      dod: moment(date).format(),
      gender: gender,
    };
    console.log(data);
    await editMembers(data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (event: SelectChangeEvent) => {};
  return (
    <FormPaperGrid noValidate>
      <FormHeader title="Members View" />
      <FormContent>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            style={{ display: 'flex', justifyContent: 'center' }}
            spacing={2}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="H??? t??n" name="name" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <TextField
                id="outlined-basic"
                style={{ width: '100%' }}
                defaultValue={membershipClassDetails?.name}
                onChange={(e) => setName(e.target.value)}
                size={'medium'}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            style={{ display: 'flex', justifyContent: 'center' }}
            spacing={2}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Gi???i t??nh" name="gender" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <Select
                style={{ width: '100%' }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={membershipClassDetails?.gender}
                onChange={handleChange}
              >
                <MenuItem value={'true'}>Nam</MenuItem>
                <MenuItem value={'false'}>N???</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            style={{ display: 'flex', justifyContent: 'center' }}
            spacing={2}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="S??? ??i???n tho???i" name="phone" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <TextField
                id="outlined-basic"
                defaultValue={membershipClassDetails?.numberPhone}
                style={{ width: '100%' }}
                size={'medium'}
                variant="outlined"
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            style={{ display: 'flex', justifyContent: 'center' }}
            spacing={2}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Email" name="email" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <TextField
                defaultValue={membershipClassDetails?.email}
                id="outlined-basic"
                style={{ width: '100%' }}
                size={'medium'}
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
          </Grid>
        </FormGroup>

        <FormGroup>
          <Grid
            container
            alignItems="center"
            style={{ display: 'flex', justifyContent: 'center' }}
            spacing={2}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Date" name="date" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <DatePicker
                value={membershipClassDetails?.dob}
                onChange={(newValue: any) => {
                  setDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField style={{ width: '100%' }} {...params} />
                )}
              />
            </Grid>
          </Grid>
        </FormGroup>
      </FormContent>
      <FormFooter>
        <LinkButton startIcon={<ArrowBackIcon />} to="/example/crud">
          Back to list
        </LinkButton>
        <LoadingButton
          startIcon={<SaveIcon />}
          loadingPosition="start"
          type="submit"
          disabled={!TypedObject.isEmpty(errors)}
          onClick={handleEdit}
        >
          C???p nh???t
        </LoadingButton>
      </FormFooter>
    </FormPaperGrid>
  );
};

export default DetailsMembershipClassForm;
