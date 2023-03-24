import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container, CircularProgress } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductNewEditForm from '../../sections/@dashboard/e-commerce/ProductNewEditForm';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name } = useParams();
  const [loading, setLoading] = useState(true);
  const isEdit = pathname.includes('edit');
  const [currentProduct, setCurrentProduct] = useState({});

  const config = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json',
    },
  };
  useEffect(() => {
    getJob();
  }, []);

  const getJob = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/job/get-job/${name}`;
      const { data } = (await axios.post(url, { withCredentials: true }, config)).data;
      setCurrentProduct(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  let content;
  if (!isEdit) {
    content = <ProductNewEditForm isEdit={isEdit} currentProduct={currentProduct} />;
  } else if (loading) {
    content = <CircularProgress />;
  } else {
    content = <ProductNewEditForm isEdit={isEdit} currentProduct={currentProduct} />;
  }

  return (
    <Page title="Service: Create a new Service">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new Service' : 'Edit Service'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Service',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: !isEdit ? 'New Service' : name },
          ]}
        />
        {content}
      </Container>
    </Page>
  );
}
