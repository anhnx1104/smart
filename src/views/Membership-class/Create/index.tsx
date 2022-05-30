import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useMemo } from 'react';
import CreateMembershipClassForm from './CreateMembershipClassForm';

const getBreadcrums = () => [
  {
    text: 'Hạng hội viên',
    link: '/crm/accounts/',
  },
];

const CreateMembershipClass = () => {
  const breadcrumbs = useMemo(() => getBreadcrums(), []);

  return (
    <PageWrapper title="Hạng hội viên | Tạo mới">
      <PageBreadcrumbs
        category="Quản trị hạng hội viên"
        title="Tạo mới"
        breadcrumbs={breadcrumbs}
      />
      <CreateMembershipClassForm />
    </PageWrapper>
  );
};

export default CreateMembershipClass;
