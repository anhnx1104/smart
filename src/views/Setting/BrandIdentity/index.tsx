import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useMemo } from 'react';
import BrandIdentityForm from './BrandIdentityForm';

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
        title="Nhận diện thương hiệu"
        breadcrumbs={breadcrumbs}
      />
      <BrandIdentityForm />
    </PageWrapper>
  );
};

export default EditCompany;
