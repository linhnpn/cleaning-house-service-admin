import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container, CircularProgress } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
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
  const dispatch = useDispatch();
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

  return (
    <Page title="Ecommerce: Create a new Job">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new Job' : 'Edit Job'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: !isEdit ? 'New job' : name },
          ]}
        />
        {loading ? (
          <CircularProgress />
        ) : (
          <ProductNewEditForm isEdit={isEdit} currentProduct={currentProduct} />
        )}

      </Container>
    </Page>
  );
}
