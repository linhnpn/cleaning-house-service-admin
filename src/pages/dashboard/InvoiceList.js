import sumBy from 'lodash/sumBy';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import { fDate } from '../../utils/formatTime';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _invoices } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import InvoiceAnalytic from '../../sections/@dashboard/invoice/InvoiceAnalytic';
import { InvoiceTableRow, InvoiceTableToolbar } from '../../sections/@dashboard/invoice/list';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  'all'
];

const TABLE_HEAD = [
  { id: 'id', label: 'Booking ID', align: 'left' },
  { id: 'userName', label: 'Người dùng', align: 'left' },
  { id: 'empName', label: 'Nhân viên', align: 'left' },
  { id: 'timestamp', label: 'Ngày làm', align: 'center', width: 140 },
  { id: 'workTime', label: 'Số giờ làm', align: 'center', width: 140 },
  { id: 'jobName', label: 'Công việc', align: 'left' },
  { id: 'price', label: 'Tổng bill', align: 'left' },
  { id: 'status', label: 'Tình trạng', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function InvoiceList() {
  const theme = useTheme();

  useEffect(() => {
    getBooking();
  }, []);

  const getBooking = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/booking/get-bookings`;
      const { data } = await axios.post(url, { withCredentials: true });
          setTableData(data);


    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getService();
  }, []);

  const getService = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/job/get-jobs`;
      const { data } = await axios.post(url, { withCredentials: true });
      const LIST_SERVICE = data.map((item) => item.job_name);
      LIST_SERVICE.unshift('all');
      settableService(LIST_SERVICE);


    } catch (err) {
      console.log(err);
    }
  }

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'id' });

  // const [tableData, setTableData] = useState(_invoices);
  const [tableService, settableService] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterService, setFilterService] = useState('all');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterService = (event) => {
    setFilterService(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };
  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.invoice.edit(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.invoice.view(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const denseHeight = dense ? 56 : 76;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalPriceByStatus = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'price'
    );

  const getPercentByStatus = (status) => (getLengthByStatus(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'info', count: tableData.length },
    { value: 'done', label: 'Hoàn thành', color: 'success', count: getLengthByStatus('done') },
    { value: 'undone', label: 'Chưa hoàn thành', color: 'warning', count: getLengthByStatus('undone') },
    { value: 'unconfirm', label: 'Chưa xác nhận', color: 'error', count: getLengthByStatus('unconfirm') },
    { value: 'cancel', label: 'Hủy', color: 'default', count: getLengthByStatus('cancel') },
  ];

  return (
    <Page title="Hóa đơn: Danh sách">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách hóa đơn"
          links={[
            { name: 'Thống kê', href: PATH_DASHBOARD.root },
            { name: 'Hóa đơn', href: PATH_DASHBOARD.invoice.root },
            { name: 'Danh sách' },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     component={RouterLink}
          //     to={PATH_DASHBOARD.invoice.new}
          //     startIcon={<Iconify icon={'eva:plus-fill'} />}
          //   >
          //     New Invoice
          //   </Button>
          // }
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Tổng"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'price')}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
              <InvoiceAnalytic
                title="Hoàn thành"
                total={getLengthByStatus('done')}
                percent={getPercentByStatus('done')}
                price={getTotalPriceByStatus('done')}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />
              <InvoiceAnalytic
                title="Chưa hoàn thành"
                total={getLengthByStatus('undone')}
                percent={getPercentByStatus('undone')}
                price={getTotalPriceByStatus('undone')}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />
              <InvoiceAnalytic
                title="Chờ xác nhận"
                total={getLengthByStatus('unconfirm')}
                percent={getPercentByStatus('unconfirm')}
                price={getTotalPriceByStatus('unconfirm')}
                icon="eva:bell-fill"
                color={theme.palette.error.main}
              />
              <InvoiceAnalytic
                title="Hủy"
                total={getLengthByStatus('cancel')}
                percent={getPercentByStatus('cancel')}
                price={getTotalPriceByStatus('cancel')}
                icon="eva:file-fill"
                color={theme.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                label={
                  <Stack spacing={1} direction="row" alignItems="center">
                    <div>{tab.label}</div> <Label color={tab.color}> {tab.count} </Label>
                  </Stack>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <InvoiceTableToolbar
            filterName={filterName}
            filterService={filterService}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterName}
            onFilterService={handleFilterService}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
            optionsService={tableService}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      {/* <Tooltip title="Sent">
                        <IconButton color="primary">
                          <Iconify icon={'ic:round-send'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Download">
                        <IconButton color="primary">
                          <Iconify icon={'eva:download-outline'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Print">
                        <IconButton color="primary">
                          <Iconify icon={'eva:printer-fill'} />
                        </IconButton>
                      </Tooltip> */}

                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <InvoiceTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.userName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.empName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterService !== 'all') {
    tableData = tableData.filter((item) => item.jobName === filterService);
  }

  if (filterStartDate && filterEndDate) {
    tableData = tableData.filter(
      (item) => {
        const date = new Date(item.timestamp);
        return date.getTime() >= filterStartDate.getTime() && date.getTime() <= filterEndDate.getTime()
      }
    );
  }

  return tableData;
}
