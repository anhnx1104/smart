import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid } from '@mui/material';
import LinkButton from 'components/common/LinkButton';
import LoadingScreen from 'components/common/LoadingScreen';
import ControllerTextField from 'components/Form/ControllerTextField';
import FormContent from 'components/Form/FormContent';
import FormFooter from 'components/Form/FormFooter';
import FormGroup from 'components/Form/FormGroup';
import FormHeader from 'components/Form/FormHeader';
import FormLabel from 'components/Form/FormLabel';
import FormPaperGrid from 'components/Form/FormPaperGrid';
import useMounted from 'hooks/useMounted';
import useNotification from 'hooks/useNotification';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Member, getMemberSetting, editMemberSetting } from 'services/setting';
import TypedObject from 'utils/TypedObject';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import {
  emailTemplateOptions,
  memberCodeOptions,
  timeUnitOptions,
  transactionTypeOptions,
} from '../../../mock-axios';
import EntitySelecter from '../../../components/Form/EntitySelecter';
import Typography from '@mui/material/Typography';
import ControllerCheckbox from '../../../components/Form/ControllerCheckbox';
import Collapse from '@mui/material/Collapse';
import type { ChangeEvent } from 'types/react';

interface FormData {
  ageCHD: number;
  chdAccount: boolean;
  emailId: string;
  inActiveAccount: boolean;
  inActiveTime: number;
  memberCode: number;
  supspendedAccount: boolean;
  tenantId: string;
  timeUnit: number;
  transactionType: number;
  abnormalTransaction: boolean;
  differentMemberName: boolean;
  conflictTransaction: boolean;
  differentDob: boolean;
  differentPhoneNumber: boolean;
}

const validationSchema = yup.object().shape({
  memberCode: yup.mixed().required('Kh??ng ???????c ????? tr???ng'),
  chdAccount: yup.boolean(),
  ageCHD: yup
    .number()
    .typeError('Ch??? ???????c nh???p s???')
    .when('chdAccount', {
      is: true,
      then: yup
        .number()
        .typeError('Ch??? ???????c nh???p s???')
        .max(999999999, 'Ch??? ???????c nh???p t???i ??a 10 k?? t???')
        .required('Kh??ng ???????c ????? tr???ng')
        .positive('Ch??? ???????c nh???p s??? d????ng'),
    }),
  inActiveAccount: yup.boolean(),
  inActiveTime: yup.mixed().when('inActiveAccount', {
    is: true,
    then: yup
      .number()
      .typeError('Ch??? ???????c nh???p s???')
      .required('Kh??ng ???????c ????? tr???ng')
      .max(999999999, 'Ch??? ???????c nh???p t???i ??a 10 k?? t???')
      .positive('ch??? ???????c nh???p s??? d????ng'),
  }),
  timeUnit: yup.mixed().when('inActiveAccount', {
    is: true,
    then: yup.mixed().required('Kh??ng ???????c ????? tr???ng'),
  }),
  transactionType: yup.mixed().when('inActiveAccount', {
    is: true,
    then: yup.mixed().required('Kh??ng ???????c ????? tr???ng'),
  }),

  supspendedAccount: yup.boolean(),
});

const MemberForm = () => {
  const { id: tenantId } = useParams();
  const mounted = useMounted();
  const setNotification = useNotification();
  const [memberSettingDetails, setMemberSettingDetails] =
    useState<Member | null>(null);
  const [taskQueue, setTaskQueue] = useState<number>(0); //to render loading
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [expandedInactive, setExpandedInactive] = useState<boolean>(false);
  const [checkedInactive, setCheckedInactive] = useState<boolean>(false);
  const [expandedSuspend, setExpandedSuspend] = useState<boolean>(false);
  const [checkedSuspend, setCheckedSuspend] = useState<boolean>(false);
  const [checkedAbnormalTransaction, setCheckedAbnormalTransaction] =
    useState<boolean>(false);
  const [checkedDifferentMemberName, setCheckedDifferentMemberName] =
    useState<boolean>(false);
  const [checkedConflictTransaction, setCheckedConflictTransaction] =
    useState<boolean>(false);
  const [checkedDifferentDob, setCheckedDifferentDob] =
    useState<boolean>(false);
  const [checkedDifferentPhoneNumber, setCheckedDifferentPhoneNumber] =
    useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const onSubmit = async (data: FormData) => {
    if (!tenantId) return;

    setLoading(true);
    const crudData = {
      ...data,
      id: tenantId,
      chdAccount: checked,
      inActiveAccount: checkedInactive,
      supspendedAccount: checkedSuspend,
      abnormalTransaction: checkedAbnormalTransaction,
      differentMemberName: checkedDifferentMemberName,
      conflictTransaction: checkedConflictTransaction,
      differentDob: checkedDifferentDob,
      differentPhoneNumber: checkedDifferentPhoneNumber,
    };

    if (
      checkedSuspend &&
      (checkedAbnormalTransaction ||
        checkedDifferentMemberName ||
        checkedConflictTransaction ||
        checkedDifferentDob ||
        checkedDifferentPhoneNumber)
    ) {
      editMemberSetting(crudData)
        .then((res) => {
          if (res.success) {
            // navigate('/settings/company');
            setNotification({
              message: 'C???p nh???t th??nh c??ng.',
              severity: 'success',
            });
          }
        })
        .catch((err) => {
          setNotification({
            error: err || 'C???p nh???t th???t b???i.',
          });
        })
        .finally(() => {
          if (mounted.current) {
            setLoading(false);
          }
        });
    } else if (!checkedSuspend) {
      editMemberSetting(crudData)
        .then((res) => {
          if (res.success) {
            // navigate('/settings/company');
            setNotification({
              message: 'C???p nh???t th??nh c??ng.',
              severity: 'success',
            });
          }
        })
        .catch((err) => {
          setNotification({
            error: err || 'C???p nh???t th???t b???i.',
          });
        })
        .finally(() => {
          if (mounted.current) {
            setLoading(false);
          }
        });
    } else {
      setNotification({
        error: 'Ch???n 1 l?? do suspend',
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!checkedInactive) {
      setValue('transactionType', 1);
      setValue('timeUnit', 1);
    }
  }, [checkedInactive]);

  //call api to get data details
  useEffect(() => {
    if (!tenantId) return;

    setTaskQueue((task) => task + 1);
    getMemberSetting(tenantId)
      .then((res: any | null) => {
        setMemberSettingDetails(res.data);
        if (res.data?.chdAccount === true) {
          setChecked(true);
          setExpanded((expanded) => !expanded);
        } else {
          setChecked(false);
          setExpanded(false);
        }

        if (res.data?.inActiveAccount === true) {
          setCheckedInactive(true);
          setExpandedInactive((expanded) => !expanded);
        } else {
          setCheckedInactive(false);
          setExpandedInactive(false);
        }

        if (res.data?.supspendedAccount === true) {
          setCheckedSuspend(true);
          setExpandedSuspend((expanded) => !expanded);
        } else {
          setCheckedSuspend(false);
          setExpandedSuspend(false);
        }

        if (res.data?.abnormalTransaction === true) {
          setCheckedAbnormalTransaction(true);
        }
        if (res.data?.conflictTransaction === true) {
          setCheckedConflictTransaction(true);
        }
        if (res.data?.differentMemberName === true) {
          setCheckedDifferentMemberName(true);
        }
        if (res.data?.differentDob === true) {
          setCheckedDifferentDob(true);
        }
        if (res.data?.differentPhoneNumber === true) {
          setCheckedDifferentPhoneNumber(true);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (mounted.current) {
          setTaskQueue((task) => task - 1);
        }
      });
  }, [tenantId, mounted]);

  //reset form value form data details
  useEffect(() => {
    if (!memberSettingDetails) return;

    const {
      ageCHD,
      chdAccount,
      emailId,
      inActiveAccount,
      inActiveTime,
      memberCode,
      supspendedAccount,
      abnormalTransaction,
      differentMemberName,
      conflictTransaction,
      differentDob,
      differentPhoneNumber,
      tenantId,
      timeUnit,
      transactionType,
    } = memberSettingDetails;

    reset({
      ageCHD,
      chdAccount,
      emailId,
      inActiveAccount,
      inActiveTime,
      memberCode,
      supspendedAccount,
      abnormalTransaction,
      differentMemberName,
      conflictTransaction,
      differentDob,
      differentPhoneNumber,
      tenantId,
      timeUnit,
      transactionType,
    });
  }, [memberSettingDetails, reset]);

  if (taskQueue > 0) {
    return <LoadingScreen />;
  }

  const onHandleChange: ChangeEvent = (event) => {
    setChecked(event.target.checked);
    if (!checked) {
      setExpanded((expanded) => !expanded);
    } else {
      setExpanded(false);
    }
  };

  const onHandleChangeInactive: ChangeEvent = (event) => {
    setCheckedInactive(event.target.checked);
    if (!checkedInactive) {
      setExpandedInactive((expanded) => !expanded);
    } else {
      setExpandedInactive(false);
    }
  };

  const onHandleChangeSuspend: ChangeEvent = (event) => {
    setCheckedSuspend(event.target.checked);
    if (!checkedSuspend) {
      setExpandedSuspend((expanded) => !expanded);
    } else {
      setExpandedSuspend(false);
      setCheckedConflictTransaction(false);
      setCheckedDifferentPhoneNumber(false);
      setCheckedDifferentDob(false);
      setCheckedDifferentMemberName(false);
      setCheckedAbnormalTransaction(false);
    }
  };

  return (
    <FormPaperGrid noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="H???i vi??n" />
      <FormContent>
        <Box>
          <Typography>M?? h???i vi??n</Typography>
        </Box>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="M?? h???i vi??n" name="memberCode" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <EntitySelecter
                name="memberCode"
                control={control}
                options={memberCodeOptions}
                renderLabel={(field) => field.name}
                placeholder="Ch???n m?? h???i vi??n"
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Box>
          <Typography>T??i kho???n CHD</Typography>
        </Box>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <ControllerCheckbox
                control={control}
                name="chdAccount"
                label="T??i kho???n CHD"
                checked={checked}
                value={memberSettingDetails?.chdAccount}
                onChange={onHandleChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Collapse in={expanded}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel title="Tu???i t??i kho???n CHD" name="ageCHD" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <ControllerTextField
                      name="ageCHD"
                      control={control}
                      placeholder="Nh???p tu???i t??i kho???n CHD"
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
        </FormGroup>
        <Box>
          <Typography>T??i kho???n inactive</Typography>
        </Box>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <ControllerCheckbox
                control={control}
                name="inActiveAccount"
                label="T??i kho???n inactive"
                checked={checkedInactive}
                onChange={onHandleChangeInactive}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Collapse in={expandedInactive}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel title="Th???i gian inactive" name="inActiveTime" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <ControllerTextField
                      name="inActiveTime"
                      control={control}
                      placeholder="Nh???p th???i gian inactive"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel title="????n v???" name="timeUnit" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <EntitySelecter
                      name="timeUnit"
                      control={control}
                      options={timeUnitOptions}
                      renderLabel={(field) => field.name}
                      placeholder="Ch???n ????n v???"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel title="Lo???i giao d???ch" name="transactionType" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <EntitySelecter
                      name="transactionType"
                      control={control}
                      options={transactionTypeOptions}
                      renderLabel={(field) => field.name}
                      placeholder="Ch???n lo???i giao d???ch"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel title="M???u email" name="emailId" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <EntitySelecter
                      name="emailId"
                      control={control}
                      options={emailTemplateOptions}
                      renderLabel={(field) => field.name}
                      placeholder="Ch???n m???u email"
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
        </FormGroup>

        <Box>
          <Typography>T??i kho???n suspended</Typography>
        </Box>
        <FormGroup>
          <Grid
            container
            alignItems="center"
            spacing={3}
            style={{ padding: 20 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <ControllerCheckbox
                control={control}
                name="supspendedAccount"
                label="T??i kho???n suspended"
                checked={checkedSuspend}
                onChange={onHandleChangeSuspend}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Collapse in={expandedSuspend}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs={12} sm={12} md={12}>
                    <ControllerCheckbox
                      control={control}
                      name="abnormalTransaction"
                      label="Giao d???ch b???t th?????ng"
                      checked={checkedAbnormalTransaction}
                      onChange={(e) =>
                        setCheckedAbnormalTransaction(e.target.checked)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={4}>
                    <ControllerCheckbox
                      control={control}
                      name="differentMemberName"
                      label="Kh??c t??n h???i vi??n"
                      checked={checkedDifferentMemberName}
                      onChange={(e) =>
                        setCheckedDifferentMemberName(e.target.checked)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <ControllerCheckbox
                      control={control}
                      name="differentDob"
                      label="Kh??c ng??y sinh"
                      checked={checkedDifferentDob}
                      onChange={(e) => setCheckedDifferentDob(e.target.checked)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <ControllerCheckbox
                      control={control}
                      name="differentPhoneNumber"
                      label="Kh??c s??? ??i???n tho???i"
                      checked={checkedDifferentPhoneNumber}
                      onChange={(e) =>
                        setCheckedDifferentPhoneNumber(e.target.checked)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>
                    <ControllerCheckbox
                      control={control}
                      name="conflictTransaction"
                      label="Tr??ng giao d???ch"
                      checked={checkedConflictTransaction}
                      onChange={(e) =>
                        setCheckedConflictTransaction(e.target.checked)
                      }
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
        </FormGroup>
      </FormContent>
      <FormFooter>
        <LinkButton startIcon={<ArrowBackIcon />} to="/settings/company">
          H???y
        </LinkButton>
        <LoadingButton
          startIcon={<SaveIcon />}
          loading={loading}
          loadingPosition="start"
          type="submit"
          disabled={!TypedObject.isEmpty(errors)}
        >
          L??u
        </LoadingButton>
      </FormFooter>
    </FormPaperGrid>
  );
};

export default MemberForm;
