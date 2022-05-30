import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useMemo } from 'react';
import EditCompanyForm from './EditCompanyForm';

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
        title="Thông tin doanh nghiệp"
        breadcrumbs={breadcrumbs}
      />
      <EditCompanyForm />
    </PageWrapper>
  );
};

export default EditCompany;
