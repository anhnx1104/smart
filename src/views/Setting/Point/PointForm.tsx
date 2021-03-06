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
import { getPointDetails, Point, editPointSetting } from 'services/setting';
import TypedObject from 'utils/TypedObject';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import {
  pointGiftPeriodOptions, pointGiftTimeUnitOptions,
  pointRatingPeriod, pointRatingTimeUnitOptions,
} from '../../../mock-axios';
import EntitySelecter from '../../../components/Form/EntitySelecter';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ControllerDatePicker from '../../../components/Form/ControllerDatePicker';

interface FormData {
  pointRatingName : string;
  pointRatingPeriod : number;
  pointRatingTimeUnit : number;
  pointRatingTime : number;
  pointRatingExpiredDate :  Date | null;
  pointGiftName :  string ;
  pointGiftPeriod : number;
  pointGiftTimeUnit : number;
  pointGiftTime : number;
  gotIt : number;
  pointGiftExpiredDate :  Date | null;
}

const validationSchema = yup.object().shape({
  pointRatingName: yup
    .string()
    .required("Kh??ng ???????c ????? tr???ng")
    .max(255, "Kh??ng ???????c qu?? 255 k?? t???"),

  pointGiftName: yup
    .string()
    .required("Kh??ng ???????c ????? tr???ng")
    .max(255, "Kh??ng ???????c qu?? 255 k?? t???"),

  pointRatingPeriod: yup
    .number()
    .typeError("Ph???i ch???n k??? h???n ??i???m")
    .required("Kh??ng ???????c ????? tr???ng"),

  pointGiftPeriod: yup
    .number()
    .typeError("Ph???i ch???n k??? h???n ??i???m")
    .required("Kh??ng ???????c ????? tr???ng"),

  pointRatingTime: yup
    .number().typeError("Ph???i ??i???n th???i gian")
    .required("Kh??ng ???????c ????? tr???ng")
    .max(999999999, "Ch??? ???????c nh???p t???i ??a 10 k?? t???")
    .when("pointRatingPeriod" , {
      is: 1,
      then: yup
        .number()
        .positive("ch??? ???????c nh???p s??? d????ng"),
    }),

  pointGiftTime: yup
    .number().typeError("Ph???i ??i???n th???i gian")
    .required("Kh??ng ???????c ????? tr???ng")
    .max(999999999, "Ch??? ???????c nh???p t???i ??a 10 k?? t???")
    .when("pointGiftPeriod" , {
      is: 1,
      then: yup
        .number()
        .positive("ch??? ???????c nh???p s??? d????ng"),
    }),


  pointRatingTimeUnit: yup
    .number().typeError("Ph???i ??i???n ????n v???")
    .required("Kh??ng ???????c ????? tr???ng"),

  pointGiftTimeUnit: yup
    .number().typeError("Ph???i ??i???n ????n v???")
    .required("Kh??ng ???????c ????? tr???ng"),

  gotIt:yup
    .number()
    .typeError("??i???m ph???i l?? s???")
    .required("Kh??ng ???????c ????? tr???ng")
    .positive("ch??? ???????c nh???p s??? d????ng"),

  pointGiftExpiredDate:yup
    .date().typeError("Ph???i l?? ng??y th??ng")
    .required("ph???i ??i???n ng??y h???t h???n"),

  pointRatingExpiredDate:yup
    .date().typeError("Ph???i l?? ng??y th??ng")
    .required("ph???i ??i???n ng??y h???t h???n"),
});

const PointForm = () => {
  const { id: tenantId } = useParams();
  const mounted = useMounted();
  const setNotification = useNotification();
  const [pointDetails, setPointDetails] = useState<Point | null>(null);
  const [taskQueue, setTaskQueue] = useState<number>(0); //to render loading
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedGift, setExpandedGift] = useState<boolean>(true);
  const [expandedGiftExpirationDate, setExpandedGiftExpirationDate] = useState<boolean>(false);
  const [expandedRating, setExpandedRating] = useState<boolean>(true);
  const [expandedRatingExpirationDate, setExpandedRatingExpirationDate] = useState<boolean>(false);
  const currentDate = new Date()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const value = getValues('pointGiftPeriod');
  const value2 = getValues('pointRatingPeriod');


  const onSubmit = async (data: FormData) => {
    if (!tenantId) return;

    setLoading(true);
    const crudData = {
      ...data,
      id: tenantId,
      // pointGiftExpiredDate: data.pointGiftExpiredDate?.toISOString() ?? '',
      // pointRatingExpiredDate: data.pointRatingExpiredDate?.toISOString() ?? '',
    };

    editPointSetting(crudData)
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
  };

  useEffect(()=>{
    if(value === 1){
      setExpandedGift(true);
      setExpandedGiftExpirationDate(false);
      setValue('pointGiftExpiredDate',currentDate)
    }else if(value === 2) {
      setExpandedGiftExpirationDate(true);
      setExpandedGift(false);
      setValue('pointGiftTime',0)
      setValue('pointGiftTimeUnit',1)

    }else {
      setExpandedGift(true);
      setExpandedGiftExpirationDate(false)
      setValue('pointGiftExpiredDate',currentDate)
    }

  },[value])

  useEffect(()=>{
    if(value2 === 1){
      setExpandedRating(true);
      setExpandedRatingExpirationDate(false)
      setValue('pointRatingExpiredDate',currentDate)
    }else if(value2 === 2) {
      setExpandedRatingExpirationDate(true);
      setExpandedRating(false);
      setValue('pointRatingTime',0)
      setValue('pointRatingTimeUnit',1)
    }else{
      setExpandedRating(true);
      setExpandedRatingExpirationDate(false)
      setValue('pointRatingExpiredDate',currentDate)
    }

  },[value2])

  //call api to get data details
  useEffect(() => {
    if (!tenantId) return;

    setTaskQueue((task) => task + 1);
    getPointDetails(tenantId)
      .then((res: any | null) => {
        setPointDetails(res.data);
        if(res.data?.pointRatingPeriod === 1){
          setExpandedRating(true);
          setExpandedRatingExpirationDate(false)
        }else {
          setExpandedRatingExpirationDate(true);
          setExpandedRating(false);
        }

        if(res.data?.pointGiftPeriod === 1){
          setExpandedGift(true);
          setExpandedGiftExpirationDate(false)
        }else {
          setExpandedGiftExpirationDate(true);
          setExpandedGift(false);
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
    if (!pointDetails) return;

    const {
      pointRatingName,
      pointRatingPeriod,
      pointRatingTimeUnit,
      pointRatingTime,
      pointRatingExpiredDate,
      pointGiftName,
      pointGiftPeriod,
      pointGiftTimeUnit,
      pointGiftTime,
      gotIt,
      pointGiftExpiredDate,
    } = pointDetails;

    reset({
      pointRatingName,
      pointRatingPeriod,
      pointRatingTimeUnit,
      pointRatingTime,
      pointRatingExpiredDate,
      pointGiftName,
      pointGiftPeriod,
      pointGiftTimeUnit,
      pointGiftTime,
      gotIt,
      pointGiftExpiredDate,
    });
  }, [pointDetails, reset]);

  if (taskQueue > 0) {
    return <LoadingScreen />;
  }

  return (
    <FormPaperGrid noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="C??i ?????t ??i???m" />
      <FormContent>
        <Box>
          <Typography>??i???m x???p h???ng</Typography>
        </Box>
        <FormGroup>
          <Grid container alignItems="center" spacing={3} style={{padding: 20}}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="T??n ??i???m" name="pointRatingName" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="pointRatingName" control={control} placeholder="Nh???p t??n ??i???m" />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="K??? h???n ??i???m" name="pointRatingPeriod" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <EntitySelecter
                name="pointRatingPeriod"
                control={control}
                options={pointRatingPeriod}
                renderLabel={(field) => field.name}
                placeholder="Ch???n k??? h???n ??i???m"
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid container alignItems="center" spacing={3} style={{padding: 20}}>
            <Grid item xs={12} sm={12} md={12}>
              <Collapse in={expandedRating}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel required title="Th???i gian" name="pointRatingTime" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <ControllerTextField name="pointRatingTime" control={control} placeholder="Nh???p th???i gian" />
                  </Grid>

                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel required title="????n v???" name="pointRatingTimeUnit" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <EntitySelecter
                      name="pointRatingTimeUnit"
                      control={control}
                      options={pointRatingTimeUnitOptions}
                      renderLabel={(field) => field.name}
                      placeholder="Ch???n ????n v???"
                    />
                  </Grid>
                </Grid>
              </Collapse>
              <Collapse in={expandedRatingExpirationDate}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel required title="Ng??y h???t h???n" name="pointRatingExpiredDate" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <ControllerDatePicker
                      name="pointRatingExpiredDate"
                      control={control}
                      errors={errors}
                      minDate={new Date()}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <Box style={{paddingTop: 20}}>
          <Typography>??i???m th?????ng</Typography>
        </Box>
        <FormGroup>
          <Grid container alignItems="center" spacing={3} style={{padding: 20}}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="T??n ??i???m" name="pointGiftName" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="pointGiftName" control={control} placeholder="Nh???p t??n ??i???m" />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="K??? h???n ??i???m" name="pointGiftPeriod" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <EntitySelecter
                name="pointGiftPeriod"
                control={control}
                options={pointGiftPeriodOptions}
                renderLabel={(field) => field.name}
                placeholder="Ch???n k??? h???n ??i???m"

              />
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid container alignItems="center" spacing={3} style={{padding: 20}}>
            <Grid item xs={12} sm={12} md={12}>
              <Collapse in={expandedGift}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel required title="Th???i gian" name="pointGiftTime" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <ControllerTextField name="pointGiftTime" control={control} placeholder="Nh???p th???i gian" />
                  </Grid>

                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel required title="????n v???" name="pointGiftTimeUnit" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <EntitySelecter
                      name="pointGiftTimeUnit"
                      control={control}
                      options={pointGiftTimeUnitOptions}
                      renderLabel={(field) => field.name}
                      placeholder="Ch???n ????n v???"
                    />
                  </Grid>
                </Grid>
              </Collapse>
              <Collapse in={expandedGiftExpirationDate}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs={12} sm={4} md={2}>
                    <FormLabel required title="Ng??y h???t h???n" name="pointGiftExpiredDate" />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <ControllerDatePicker
                      name="pointGiftExpiredDate"
                      control={control}
                      errors={errors}
                      minDate={new Date()}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Grid container alignItems="center" spacing={3} style={{padding: 20}}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Gi?? tr??? quy ?????i ??i???m GotIt" name="gotIt" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField name="gotIt" control={control} placeholder="Nh???p gi?? tr???" />
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

export default PointForm;
