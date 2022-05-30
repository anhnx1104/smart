import PageWrapper from 'components/common/PageWrapper';
import PageBreadcrumbs from '../../components/common/PageBreadcrums';
import Paper from '@mui/material/Paper';

const Home = () => {
  return (
    <PageWrapper title="Dashboard">
      <PageBreadcrumbs
        title='Dashboard'
        breadcrumbs={[]}
      />
        <Paper sx={{ p: 2 }}>
          <h1>Hello</h1>
        </Paper>

    </PageWrapper>

  )
}

export default Home;