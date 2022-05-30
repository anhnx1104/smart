import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useMemo } from 'react';
import DetailsMembershipClassForm from './DetailsMembershipClassForm';

const getBreadcrums = () => [
  {
    text: 'Hạng hội viên',
    link: '/crm/accounts/',
  },
];

const DetailsMembershipClass = () => {
  const breadcrumbs = useMemo(() => getBreadcrums(), []);

  return (
    <PageWrapper title="Hạng hội viên | Chi tiết">
      <PageBreadcrumbs
        category="Quản trị hạng hội viên"
        title="Tạo mới"
        breadcrumbs={breadcrumbs}
      />
      <DetailsMembershipClassForm />
    </PageWrapper>
  );
};

export default DetailsMembershipClass;
