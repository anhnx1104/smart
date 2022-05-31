import Box from '@mui/material/Box';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LinkButton from 'components/common/LinkButton';
import { ChangeEvent } from 'types/react';
import { addMemberExel } from '../../../services/membershipClass';

interface Breadcrumb {
  text: string;
  link: string;
}

interface Props {
  category?: string;
  breadcrumbs: Breadcrumb[];
  title: string;
}

const Input = styled('input')({
  display: 'none',
});

const HeaderMembers = (props: Props) => {
  const { title } = props;

  const handleUploadfiles: ChangeEvent = async (e) => {
    console.log(e.target.files);
    const { files }:any = e.target;
    await addMemberExel(files[0]).then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  };

  // useEffect(() => {
  //   getMemberTable({
  //     SearchText: '',
  //     SearchColumn: '',
  //     PageSize: 1,
  //     PageIndex: 10,
  //     SortBy: '',
  //     SortDirection: '',
  //   })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <Box>
      <Breadcrumbs
        separator="›"
        sx={{
          [`& > .${breadcrumbsClasses.ol}`]: {
            alignItems: 'baseline',
            justifyContent: 'space-between',
          },
        }}
      >
        <Typography color="text.primary" variant="subtitle2">
          {title}
        </Typography>
        <Stack spacing={2} direction="row">
          <LinkButton size="medium" variant="contained" to="/members/create">
            Thêm Hội Viên
          </LinkButton>
          <label htmlFor="contained-button-file">
            <Input
              onChange={handleUploadfiles}
              accept=".xls, application/vnd.ms-excel"
              id="contained-button-file"
              multiple
              type="file"
            />
            <Button size="medium" variant="contained" component="span">
              Tải lên từ Excel
            </Button>
          </label>
        </Stack>
      </Breadcrumbs>
    </Box>
  );
};

export default HeaderMembers;
