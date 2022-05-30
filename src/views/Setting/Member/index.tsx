import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useMemo } from 'react';
import MemberForm from './MemberForm';

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
        title="Hội viên"
        breadcrumbs={breadcrumbs}
      />
      <MemberForm />
    </PageWrapper>
  );
};

export default EditCompany;
