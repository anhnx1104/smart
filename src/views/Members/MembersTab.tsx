import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import LinkIconButton from 'components//common/LinkIconButton';
import LinkButton from 'components/common/LinkButton';
import Scrollbar from 'components/common/Scrollbar';
import TableContent from 'components/Table/TableContent';
import type { Cells } from 'components/Table/TableHeader';
import TableHeader from 'components/Table/TableHeader';
import TablePagination from 'components/Table/TablePagination';
import TableMembershipClassSearchField from 'components/Table/TableMembershipClassSearchField';
import TableWrapper from 'components/Table/TableWrapper';
import useForceUpdate from 'hooks/useForceUpdate';
import useMounted from 'hooks/useMounted';
import { useEffect, useMemo, useState } from 'react';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import FormatFns from 'utils/DateFns';
import DeleteDialogMembers from './DeteleDialog';
import {
  getListMembershipClass,
  MembershipClass,
} from '../../services/membershipClass';
import SeverityBadge from '../../components/Table/SeverityBadge';
import { DatePicker } from '@mui/lab';
import RedeemIcon from '@mui/icons-material/Redeem';

interface Data {
  id: number;
  name: string;
  description: string;
  categories: number;
  condition: number;
  pointOfClass: string;
  image: string;
  fileUpload: string;
  endowPoint: string;
  value: number;
  unit: string;
  pointType: string;
  status: number;
  actions: string;
}

// table title cell
const getCells = (): Cells<Data> => [
  {
    id: 'id',
    label: 'Id',
  },
  {
    id: 'name',
    label: 'Tên hạng',
  },
  {
    id: 'description',
    label: 'Mô tả',
  },
  {
    id: 'status',
    label: 'Trạng thái',
  },
  {
    id: 'condition',
    label: 'Something',
  },
  {
    id: 'actions',
    label: 'Thao tác',
  },
];

const MembershipClassTable = () => {
  const mounted = useMounted(); // use to handle unmounting event: don't update when component unmounte
  const [rerender, onForceUpdate] = useForceUpdate(); // use force update when re-render list
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [membershipClassList, setMembershipClassList] = useState<
    MembershipClass[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false); // loading when data is fetching
  const [currentMembershipClassId, setCurrentMembershipClassId] = useState<
    number | null
  >(null); //use for dialog

  // #region Filters
  const [filters, setFilters] = useState<FilterParams>({
    pageIndex: 1,
    pageSize: 5,
    sortBy: '',
    sortDirection: '',
    searchText: '',
    searchColumn: '',
  });
  // #endregion

  // get table cell, Can use multi-language
  const cells = useMemo(() => getCells(), []);

  // call api to get list data
  useEffect(() => {
    setLoading(true);
    getListMembershipClass(filters)
      .then((res) => {
        setMembershipClassList(res.data ?? []);
        setTotalRows(res.total);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters, mounted, rerender]);

  // Table actions
  const handleOnSort = (field: string) => {
    const { sortBy, sortDirection } = filters;
    const isAsc = sortBy === field && sortDirection === 'asc';
    setFilters((state) => ({
      ...state,
      sortBy: field,
      sortDirection: isAsc ? 'desc' : 'asc',
    }));
  };

  const handleChangePage = (pageIndex: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex,
    }));
  };

  const handleChangeRowsPerPage = (rowsPerPage: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex: 1,
      pageSize: rowsPerPage,
    }));
  };

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const handleFilterColumn = (id: number | null) => {
    setFilters((state) => ({
      ...state,
      searchColumn:
        id === 1 ? '' : id === 2 ? 'name' : id === 4 ? 'status' : '',
      pageIndex: 1,
    }));
  };
  // End Table actions

  const handleCloseDeleteDialog = () => {
    setCurrentMembershipClassId(null);
    setOpenDeleteDialog(false);
  };

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentMembershipClassId(id);
    setOpenDeleteDialog(true);
  };

  //action of table
  const renderAction = (row: MembershipClass) => {
    return (
      <>
        {/* use LinkIconButton when want click a link */}

        <LinkIconButton to={`/members/memberId/edit`}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </LinkIconButton>

        {/* when open a dialog or something */}
        <IconButton onClick={handleOpenDeleteDialog(row.id)}>
          <DeleteIcon />
        </IconButton>
        <LinkIconButton to={``}>
          <IconButton>
            <RedeemIcon />
          </IconButton>
        </LinkIconButton>
      </>
    );
  };
  const [value, setValue] = useState(null);

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch', mr: '36px' },
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="standard-basic" label="Họ Tên" variant="standard" />
        <TextField
          id="standard-basic"
          label="Tên Đăng Nhập"
          variant="standard"
        />
        <TextField
          id="standard-basic"
          label="Số Điện Thoại"
          variant="standard"
        />
        <DatePicker
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params: JSX.IntrinsicAttributes) => (
            <TextField {...params} variant="standard" label="Ngày sinh" />
          )}
        />
      </Box>
      <TableContent total={membershipClassList.length} loading={loading}>
        <TableContainer sx={{ p: 1.5 }}>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              <TableHeader
                cells={cells}
                onSort={handleOnSort}
                sortDirection={filters.sortDirection}
                sortBy={filters.sortBy}
              />
              <TableBody>
                {membershipClassList.map((membershipClass) => {
                  const { id, name, description, status, condition } =
                    membershipClass;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{description}</TableCell>
                      <TableCell>
                        <SeverityBadge color={status ? 'success' : 'error'}>
                          {status ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                        </SeverityBadge>
                      </TableCell>
                      <TableCell>{condition}</TableCell>
                      {/*<TableCell>*/}
                      {/*  {FormatFns.formatDateTime(new Date(date), 'dd-MM-yyyy')}*/}
                      {/*</TableCell>*/}
                      <TableCell align="left">
                        {renderAction(membershipClass)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <TablePagination
          pageIndex={filters.pageIndex}
          totalPages={Math.ceil(totalRows / filters.pageSize)}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={filters.pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </TableContent>
      <DeleteDialogMembers
        id={currentMembershipClassId}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        onForceUpdate={onForceUpdate}
      />
    </TableWrapper>
  );
};

export default MembershipClassTable;
