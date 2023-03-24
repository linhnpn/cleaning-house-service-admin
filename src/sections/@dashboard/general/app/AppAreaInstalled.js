import React, { useEffect, useState } from 'react';
import axios from 'axios';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
// components
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------
const CHART_YEAR = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];
const CHART_DATA = [
  {
    year: 2019,
    data: [
      { name: 'Asia', data: [0, 41, 35, 510000, 49, 62, 69, 91, 148] },
      { name: 'America', data: [10, 34, 13, 56, 77, 88, 0, 77, 45] },
    ],
  },
  {
    year: 2020,
    data: [
      { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
      { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
    ],
  },
];

export default function AppAreaInstalled() {
  const [mapData, setMapData] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
  const [seriesData, setSeriesData] = useState(2023);
  const [dashboardIncomes, setDashboardIncomes] = useState([]);
  const config = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  }
  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
    getDashboardIncomes();
    console.log(seriesData);
    setMapData(dashboardIncomes.map(obj => obj.sumPrice));
  };
  useEffect(() => {
    getDashboardIncomes();
  }, []);
  const getDashboardIncomes = async () => {
    
    try {
      const newDate = `${seriesData}-01-01T00:00:00`; 
      const url = `${process.env.REACT_APP_API_URL}/dashboard?status=done&endDate=${newDate}`;
      const { data } = (await axios.get(url, { withCredentials: true, headers: config.headers })).data;
      console.log(data);
      setDashboardIncomes(data);

    } catch (err) {
      console.log(err);
      setDashboardIncomes([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
  }

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
  });

  return (
    <>
    {/* <Card>
      <CardHeader
        title="Total Incomes"
        subheader=""
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': {
                pl: 1,
                py: 0.5,
                pr: '24px !important',
                typography: 'subtitle2',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.75,
                bgcolor: 'background.neutral',
              },
              '& .MuiNativeSelect-icon': {
                top: 4,
                right: 0,
                width: 20,
                height: 20,
              },
            }}
          >
            {CHART_YEAR.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="line" series={mapData} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>

    <Card>
      <CardHeader
        title="Total Incomes"
        subheader=""
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': {
                pl: 1,
                py: 0.5,
                pr: '24px !important',
                typography: 'subtitle2',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.75,
                bgcolor: 'background.neutral',
              },
              '& .MuiNativeSelect-icon': {
                top: 4,
                right: 0,
                width: 20,
                height: 20,
              },
            }}
          >
            {CHART_YEAR.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart type="line" series={mapData} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card> */}
    </>
    
  );
}
