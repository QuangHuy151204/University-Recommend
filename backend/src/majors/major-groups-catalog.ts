/** Nhóm ngành chuẩn — chỉ dùng cho UI/filter, không dùng làm logic phân loại AI. */
export type MajorGroupDef = {
  group_id: string;
  group_name: string;
  description: string;
};

export const MAJOR_GROUPS: MajorGroupDef[] = [
  {
    group_id: 'cong-nghe-thong-tin',
    group_name: 'Công nghệ thông tin',
    description:
      'Lập trình, phần mềm, khoa học máy tính, AI, dữ liệu, mạng máy tính, an toàn thông tin, cybersecurity, điện tử viễn thông số.',
  },
  {
    group_id: 'kinh-te-kinh-doanh',
    group_name: 'Kinh tế - Kinh doanh',
    description:
      'Kinh tế, quản trị kinh doanh, tài chính, ngân hàng, kế toán, thương mại, logistics, bảo hiểm.',
  },
  {
    group_id: 'marketing-truyen-thong',
    group_name: 'Marketing - Truyền thông',
    description:
      'Marketing, quảng cáo, báo chí, truyền thông, PR, nội dung số, xuất bản.',
  },
  {
    group_id: 'ky-thuat-cong-nghiep',
    group_name: 'Kỹ thuật - Công nghiệp',
    description:
      'Kỹ thuật cơ khí, điện, điện tử, xây dựng, môi trường, thực phẩm, giao thông, công nghiệp.',
  },
  {
    group_id: 'kien-truc-thiet-ke',
    group_name: 'Kiến trúc - Thiết kế',
    description:
      'Kiến trúc, thiết kế nội thất, mỹ thuật, đồ họa, thời trang, điện ảnh, nghệ thuật ứng dụng.',
  },
  {
    group_id: 'y-duoc-suc-khoe',
    group_name: 'Y dược - Sức khỏe',
    description:
      'Y khoa, dược, điều dưỡng, nha khoa, y tế công cộng, dinh dưỡng, phục hồi chức năng.',
  },
  {
    group_id: 'hoa-hoc-sinh-hoc',
    group_name: 'Hóa học - Sinh học',
    description:
      'Hóa học, sinh học, vật lý, toán học, khoa học tự nhiên, công nghệ sinh học, nano.',
  },
  {
    group_id: 'nong-nghiep',
    group_name: 'Nông nghiệp',
    description:
      'Nông nghiệp, lâm nghiệp, thủy sản, chăn nuôi, thú y, bảo vệ thực vật, khoa học cây trồng.',
  },
  {
    group_id: 'ngon-ngu-xa-hoi',
    group_name: 'Ngôn ngữ - Xã hội',
    description:
      'Ngôn ngữ, văn học, lịch sử, luật, tâm lý, xã hội học, nhân văn, quốc tế học, văn hóa.',
  },
  {
    group_id: 'giao-duc-su-pham',
    group_name: 'Giáo dục - Sư phạm',
    description:
      'Sư phạm, giáo dục mầm non, tiểu học, giáo dục thể chất, thanh nhạc.',
  },
  {
    group_id: 'du-lich-dich-vu',
    group_name: 'Du lịch - Dịch vụ',
    description:
      'Du lịch, khách sạn, nhà hàng, lữ hành, quản trị dịch vụ, tổ chức sự kiện.',
  },
  {
    group_id: 'the-duc-the-thao',
    group_name: 'Thể dục - Thể thao',
    description: 'Thể dục thể thao, huấn luyện viên, quản lý thể thao.',
  },
  {
    group_id: 'an-ninh-quoc-phong',
    group_name: 'An ninh - Quốc phòng',
    description:
      'Cảnh sát, biên phòng, quân sự, nghiệp vụ an ninh nhà nước, phòng chống tội phạm — không bao gồm cybersecurity IT.',
  },
  {
    group_id: 'quan-ly-hanh-chinh',
    group_name: 'Quản lý - Hành chính',
    description:
      'Quản lý nhà nước, hành chính công, chính trị học, quản lý dự án, quản trị công — không bao gồm quân đội/cảnh sát.',
  },
  {
    group_id: 'khoa-hoc-vu-tru-hang-khong',
    group_name: 'Khoa học vũ trụ - Hàng không',
    description:
      'Khoa học vũ trụ, vệ tinh, hàng không vũ trụ, công nghệ vệ tinh.',
  },
];

export const MAJOR_GROUP_BY_ID = new Map(
  MAJOR_GROUPS.map((g) => [g.group_id, g]),
);

export const MAJOR_GROUP_BY_NAME = new Map(
  MAJOR_GROUPS.map((g) => [g.group_name, g]),
);

export const KHAC_GROUP_ID = 'khac';
export const KHAC_GROUP_NAME = 'Khác';
