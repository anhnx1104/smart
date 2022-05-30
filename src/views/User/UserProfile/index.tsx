import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import UserProfileTab from './UserProfileTab';

const UserProfile = () => {
  return (
    <PageWrapper title="Người dùng">
      <PageBreadcrumbs
        category="Người dùng"
        title="Thông tin người dùng"
        breadcrumbs={[]}
      />
      <UserProfileTab />
    </PageWrapper>
  );
};

export default UserProfile;
