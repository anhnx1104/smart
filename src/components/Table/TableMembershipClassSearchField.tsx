import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import SearchField from './SearchField';
import Typography from '@mui/material/Typography';
import ControllerFilter from './ControllerFilter';
import { searchColumnOptions } from '../../mock-axios';
import { FilterParams } from '../../types';
import { Grid } from '@mui/material';

interface Props extends BoxProps {
  placeHolder: string;
  onSearch: (searchTerm: string) => void;
  searchText: string;
  title?: string;
  headerTitle?: string;
  filters: FilterParams;
  handleFilterColumn: (id: number | null) => void;
}

const TableMembershipClassSearchField = (props: Props) => {
  const {
    title,
    placeHolder,
    searchText,
    onSearch,
    children,
    handleFilterColumn,
    headerTitle,
    filters,
    ...rest
  } = props;
  return (
    <Wrapper {...rest}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Stack direction="row" spacing={1}>
          {children}
        </Stack>
      </Box>
      {headerTitle && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 1.5, fontWeight: 'regular' }}
        >
          {headerTitle}
        </Typography>
      )}
      <Grid container alignItems="center" spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <SearchField
            title={title}
            placeHolder={placeHolder}
            onSearch={onSearch}
            searchText={searchText}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <ControllerFilter
            options={searchColumnOptions}
            selector={(option) => option.name}
            placeholder="Please select a status"
            title="Điều kiện tìm kiếm"
            onChangeSelect={handleFilterColumn}
            value={filters.searchColumn}
          />
        </Grid>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));

export default TableMembershipClassSearchField;
