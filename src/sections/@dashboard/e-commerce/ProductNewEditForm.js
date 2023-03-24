import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import React, { useEffect, useCallback, useMemo } from 'react';
import FormData from 'form-data';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { fData } from '../../../utils/formatNumber';
// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    jobName: Yup.string().required('Job Name is required'),
    avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
  });

  const defaultValues = useMemo(
    () => ({
      jobName: currentProduct?.jobName || '',
      avatarUrl: currentProduct?.thumbnailImage || '',
      measureUnit: currentProduct?.measureUnit || '',
      price: currentProduct?.price || 0,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const config = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
      'Content-Type': 'multipart/form-data',
      accept: '*/*',
    },
  };

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentProduct]);

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', getValues('jobName'));
      formData.append('measure_unit', getValues('measureUnit'));
      formData.append('price', getValues('price'));
      formData.append('file', getValues('avatarUrl'));
      let url ='';
      if(isEdit) {
        url = `${process.env.REACT_APP_API_URL}/job/${currentProduct.id}`;
        formData.append('job_id', currentProduct.id);
        await axios.put(url, formData, config);
      } else {
        url = `${process.env.REACT_APP_API_URL}/job/create-job`;
        await axios.post(url, formData, config);
      }    
      
     

      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="jobName" label="Service Name" />

              <div>
                <LabelStyle>Images</LabelStyle>
                <Box sx={{ mb: 5 }}>
                  <RHFUploadAvatar
                    name="avatarUrl"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    defaultValue={values.avatarUrl}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                </Box>
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <RHFTextField name="measureUnit" label="Service measure Unit" />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="price"
                  label="Regular Price"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Service' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
