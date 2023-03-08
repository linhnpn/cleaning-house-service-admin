import { useParams } from 'react-router-dom';

import React, { useEffect, useState } from 'react';

import axios from 'axios';
// @mui
import { Container, CircularProgress } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _invoices } from '../../_mock';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Invoice from '../../sections/@dashboard/invoice/details';

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const config = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  }
  const { themeStretch } = useSettings();
  const { id } = useParams();
  const [loading, setLoading] = useState(true); // Add loading state

  const [tableData, setTableData] = useState({});

  useEffect(() => {
    getBooking();
  }, []);

  const getBooking = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/booking/get-bookings?booking_id=${id}`;
      const { data } = (await axios.post(url, { withCredentials: true }, config)).data;
      setTableData(data[0]);
      setLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      console.log(err);
    }
  };

  const invoice = _invoices.find((invoice) => invoice.id === id);

  return (
    <Page title="Invoice: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Chi tiết hóa đơn"
          links={[
            { name: 'Thống kê', href: PATH_DASHBOARD.root },
            {
              name: 'Chi tiết hóa đơn',
              href: PATH_DASHBOARD.invoice.root,
            },
            { name: invoice?.id || '' },
          ]}
        />

        {loading ? (
          <CircularProgress /> // Show loading indicator while waiting for data
        ) : (
          <Invoice invoice={tableData} /> // Render Invoice component after data is fetched
        )}
      </Container>
    </Page>
  );
}
