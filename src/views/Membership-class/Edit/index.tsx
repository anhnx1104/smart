import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useMemo } from 'react';
import EditMembershipClassForm from './EditMembershipClassForm';

const getBreadcrums = () => [
  {
    text: 'Hạng hội viên',
    link: '/crm/accounts/',
  },
];

const EditCRUD = () => {
  const breadcrumbs = useMemo(() => getBreadcrums(), []);

  return (
    <PageWrapper title="Hạng hội viên | Chỉnh sửa">
      <PageBreadcrumbs
        category="Quản trị hạng hội viên"
        title="Chỉnh sửa"
        breadcrumbs={breadcrumbs}
      />
      <EditMembershipClassForm />
    </PageWrapper>
  );
};

export default EditCRUD;
