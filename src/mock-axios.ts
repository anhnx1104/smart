export const randomIntFromInterval = () => {
  const max = 2000;
  const min = 1;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const mockCRUDList = {
  data: [
    {
      id: randomIntFromInterval(),
      textField: `John`,
      selectField: 1,
      mutipleSelectField: [42, 12],
      radioField: 1,
      switchField: true,
      date: new Date(
        'Wed Mar 16 2022 16:20:00 GMT+0700 (Indochina Time)'
      ).toISOString(),
      time: new Date(
        'Wed Mar 16 2022 05:20:00 GMT+0700 (Indochina Time)'
      ).toISOString(),
      image: '',
    },

    {
      id: randomIntFromInterval(),
      textField: `Bentley`,
      selectField: 2,
      mutipleSelectField: [72],
      radioField: 1,
      switchField: false,
      date: null,
      time: null,
      image: '',
    },

    {
      id: randomIntFromInterval(),
      textField: `Hello`,
      selectField: 1,
      mutipleSelectField: [44],
      radioField: 1,
      switchField: true,
      date: null,
      time: null,
      image: '',
    },
  ],
  total: 3,
};

export const mockSelectFieldOptions = [
  {
    id: 1,
    name: 'Field 1',
  },
  {
    id: 2,
    name: 'Field 2',
  },
];

export const emailTemplateOptions = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: 'Email 1',
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    name: 'Email 2',
  },
];

export const timeUnitOptions = [
  {
    id: 1,
    name: 'Tháng',
  },
  {
    id: 2,
    name: 'Năm',
  },
];

export const transactionTypeOptions = [
  {
    id: 1,
    name: 'Giao dịch Loyalty',
  },
  {
    id: 2,
    name: 'Giao dịch thương mại',
  },
];

export const pointGiftPeriodOptions = [
  {
    id: 1,
    name: 'Cuốn chiếu',
  },
  {
    id: 2,
    name: 'Cố định',
  },
];

export const pointRatingPeriod = [
  {
    id: 1,
    name: 'Cuốn chiếu',
  },
  {
    id: 2,
    name: 'Cố định',
  },
];

export const pointRatingTimeUnitOptions = [
  {
    id: 1,
    name: 'Tháng',
  },
  {
    id: 2,
    name: 'Năm',
  },
];

export const pointGiftTimeUnitOptions = [
  {
    id: 1,
    name: 'Tháng',
  },
  {
    id: 2,
    name: 'Năm',
  },
];

export const unitOptions = [
  {
    id: 1,
    name: 'Điểm',
  },
  {
    id: 2,
    name: '%',
  },
];

export const pointTypeOptions = [
  {
    id: 1,
    name: 'Điểm xếp hạng',
  },
  {
    id: 2,
    name: 'Điểm thưởng',
  },
];

export const memberCodeOptions = [
  {
    id: 1,
    name: 'Hệ thống tự tạo',
  },
  {
    id: 2,
    name: 'Số điện thoại',
  },
  {
    id: 3,
    name: 'Nhập từ CRM',
  },
];

export const supspendedTypeOptions = [
  {
    id: 1,
    name: 'Giao dịch bất thường',
    value: 1,
  },
  {
    id: 2,
    name: 'Khác tên hội viên',
    value: 2,
  },
  {
    id: 3,
    name: 'Khác ngày sinh',
    value: 3,
  },
  {
    id: 4,
    name: 'Khác số điện thoại',
    value: 4,
  },
  {
    id: 5,
    name: 'Trùng giao dịch',
    value: 5,
  },
];

export const mockRoleOptions = [
  {
    id: 1,
    name: 'Admin',
  },
  {
    id: 2,
    name: 'User',
  },
];

export const mockMutipleSelectOptions = [
  {
    id: 1,
    name: 'Nam',
  },
  {
    id: 12,
    name: 'Nữ',
  },
 
];

export const mockRadioOptions = [
  { value: 1, label: 'Nam' },
  { value: 2, label: 'Nữ' },
  // { value: 2, label: 'Reason 2' },
];

export const statusOptions = [
  { value: 1, label: 'Kích hoạt' },
  { value: 2, label: 'Chưa kích hoạt' },
];

export const searchColumnOptions = [
  {
    id: 1,
    name: 'Tất cả',
  },
  {
    id: 2,
    name: 'Tên hạng',
  },
  {
    id: 3,
    name: 'Ngày tạo',
  },
  {
    id: 4,
    name: 'Trạng thái',
  },
];
