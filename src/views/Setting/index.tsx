import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import SettingTabs from './SettingTabs';

const Setting = () => {
  return (
    <div>
      <PageWrapper>
        <PageBreadcrumbs
          category="Doanh nghiệp"
          title="Thông tin doanh nghiệp"
          breadcrumbs={[]}
        />
        <SettingTabs />
      </PageWrapper>
    </div>
  );
};

export default Setting;
