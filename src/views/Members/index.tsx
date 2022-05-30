import PageWrapper from 'components/common/PageWrapper';
import MembersTab from './MembersTab';
import HeaderMembers from './components/HeaderMembers';

const Setting = () => {
  return (
    <PageWrapper title="Hội Viên">
      <HeaderMembers title="Danh Sách Hội Viên" breadcrumbs={[]} />
      <MembersTab />
    </PageWrapper>
  );
};

export default Setting;
