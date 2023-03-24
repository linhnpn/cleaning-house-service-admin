import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

InvoiceTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function InvoiceTableRow({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const {
    id,
    userId,
    userName,
    empId,
    empName,
    status,
    workTime,
    timestamp,
    price,
    location,
    jobId,
    jobName,
    description,
  } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{id}</TableCell>
      <TableCell align="left">{userName}</TableCell>
      <TableCell align="left">{empName}</TableCell>
      <TableCell align="left">{fDate(timestamp)}</TableCell>
      <TableCell align="center">{workTime}</TableCell>
      <TableCell align="center">{jobName}</TableCell>
      <TableCell align="center">{price}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === 'done' && 'success') ||
            (status === 'undone' && 'warning') ||
            (status === 'unconfirm' && 'warning') ||
            (status === 'cancel' && 'default') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onViewRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                View
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
