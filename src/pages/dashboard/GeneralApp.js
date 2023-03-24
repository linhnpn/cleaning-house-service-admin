import React, { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  AppWelcome,
  AppFeatured,
  AppAreaInstalled,
  AppWidgetSummary,
} from '../../sections/@dashboard/general/app';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const config = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  }
  useEffect(() => {
    getTotalUsers();
  }, []);

  useEffect(() => {
    getTotalEmployees();
  }, []);

  useEffect(() => {
    getTotalServices();
  }, []);
  const getTotalUsers = async () => {
    
    try {
      const url = `${process.env.REACT_APP_API_URL}/dashboard/get-total-user`;
      const { data } = (await axios.get(url, { withCredentials: true, headers: config.headers })).data;
      settotalUsers(data);

    } catch (err) {
      console.log(err);
    }
  }

  const getTotalEmployees = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/dashboard/get-total-employee`;
      const { data } = (await axios.get(url, { withCredentials: true, headers: config.headers })).data;
      setTotaEmployees(data);

    } catch (err) {
      console.log(err);
    }
  }

  const getTotalServices = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/dashboard/get-total-job`;
      const { data } = (await axios.get(url, { withCredentials: true, headers: config.headers })).data;
      setTotalServices(data);

    } catch (err) {
      console.log(err);
    }
  }

  const [totalUsers, settotalUsers] = useState(0);
  const [totalEmployees, setTotaEmployees] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={user?.displayName} />
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <AppFeatured />
          </Grid> */}

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Employees"
              total={totalEmployees}
              chartColor={theme.palette.primary.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Users"
              total={totalUsers}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Services"
              total={totalServices}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <AppAreaInstalled />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
