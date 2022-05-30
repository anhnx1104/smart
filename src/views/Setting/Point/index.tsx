import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useMemo } from 'react';
import PointForm from './PointForm';

const getBreadcrums = () => [
  {
    text: 'Doanh nghiệp',
    link: '/crm/accounts/',
  },
];

const EditCompany = () => {
  const breadcrumbs = useMemo(() => getBreadcrums(), []);

  return (
    <PageWrapper title="Company | Edit">
      <PageBreadcrumbs
        category="Cài đặt"
        title="Cài đặt điểm"
        breadcrumbs={breadcrumbs}
      />
      <PointForm />
    </PageWrapper>
  );
};

export default EditCompany;
