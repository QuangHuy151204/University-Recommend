"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MajorGroupsAndTags1760000000003 = void 0;
const MAJOR_GROUPS_SEED = [
    {
        group_id: 'cong-nghe-thong-tin',
        group_name: 'Công nghệ thông tin',
        description: 'Lập trình, phần mềm, khoa học máy tính, AI, dữ liệu, mạng máy tính, điện tử viễn thông số.',
    },
    {
        group_id: 'an-toan-thong-tin',
        group_name: 'An toàn thông tin',
        description: 'Cybersecurity, bảo mật hệ thống, an ninh mạng IT, kiểm thử bảo mật — không bao gồm cảnh sát/quân đội.',
    },
    {
        group_id: 'kinh-te-kinh-doanh',
        group_name: 'Kinh tế - Kinh doanh',
        description: 'Kinh tế, quản trị kinh doanh, tài chính, ngân hàng, kế toán, thương mại, logistics, bảo hiểm.',
    },
    {
        group_id: 'marketing-truyen-thong',
        group_name: 'Marketing - Truyền thông',
        description: 'Marketing, quảng cáo, báo chí, truyền thông, PR, nội dung số, xuất bản.',
    },
    {
        group_id: 'ky-thuat-cong-nghiep',
        group_name: 'Kỹ thuật - Công nghiệp',
        description: 'Kỹ thuật cơ khí, điện, điện tử, xây dựng, môi trường, thực phẩm, giao thông, công nghiệp.',
    },
    {
        group_id: 'kien-truc-thiet-ke',
        group_name: 'Kiến trúc - Thiết kế',
        description: 'Kiến trúc, thiết kế nội thất, mỹ thuật, đồ họa, thời trang, điện ảnh, nghệ thuật ứng dụng.',
    },
    {
        group_id: 'y-duoc-suc-khoe',
        group_name: 'Y dược - Sức khỏe',
        description: 'Y khoa, dược, điều dưỡng, nha khoa, y tế công cộng, dinh dưỡng, phục hồi chức năng.',
    },
    {
        group_id: 'hoa-hoc-sinh-hoc',
        group_name: 'Hóa học - Sinh học',
        description: 'Hóa học, sinh học, vật lý, toán học, khoa học tự nhiên, công nghệ sinh học, nano.',
    },
    {
        group_id: 'nong-nghiep',
        group_name: 'Nông nghiệp',
        description: 'Nông nghiệp, lâm nghiệp, thủy sản, chăn nuôi, thú y, bảo vệ thực vật, khoa học cây trồng.',
    },
    {
        group_id: 'ngon-ngu-xa-hoi',
        group_name: 'Ngôn ngữ - Xã hội',
        description: 'Ngôn ngữ, văn học, lịch sử, luật, tâm lý, xã hội học, nhân văn, quốc tế học, văn hóa.',
    },
    {
        group_id: 'giao-duc-su-pham',
        group_name: 'Giáo dục - Sư phạm',
        description: 'Sư phạm, giáo dục mầm non, tiểu học, giáo dục thể chất, thanh nhạc.',
    },
    {
        group_id: 'du-lich-dich-vu',
        group_name: 'Du lịch - Dịch vụ',
        description: 'Du lịch, khách sạn, nhà hàng, lữ hành, quản trị dịch vụ, tổ chức sự kiện.',
    },
    {
        group_id: 'the-duc-the-thao',
        group_name: 'Thể dục - Thể thao',
        description: 'Thể dục thể thao, huấn luyện viên, quản lý thể thao.',
    },
    {
        group_id: 'an-ninh-quoc-phong',
        group_name: 'An ninh - Quốc phòng',
        description: 'Cảnh sát, biên phòng, quân sự, nghiệp vụ an ninh nhà nước, phòng chống tội phạm — không bao gồm cybersecurity IT.',
    },
    {
        group_id: 'quan-ly-hanh-chinh',
        group_name: 'Quản lý - Hành chính',
        description: 'Quản lý nhà nước, hành chính công, chính trị học, quản lý dự án, quản trị công — không bao gồm quân đội/cảnh sát.',
    },
    {
        group_id: 'khoa-hoc-vu-tru-hang-khong',
        group_name: 'Khoa học vũ trụ - Hàng không',
        description: 'Khoa học vũ trụ, vệ tinh, hàng không vũ trụ, công nghệ vệ tinh.',
    },
];
class MajorGroupsAndTags1760000000003 {
    name = 'MajorGroupsAndTags1760000000003';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "major_groups" (
        "group_id" character varying(64) NOT NULL,
        "group_name" character varying(128) NOT NULL,
        "description" text NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_major_groups" PRIMARY KEY ("group_id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "major_group_assignments" (
        "id" SERIAL NOT NULL,
        "major_id" integer NOT NULL,
        "group_id" character varying(64) NOT NULL,
        "is_primary" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_major_group_assignments" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_major_group_assignments_major_group" UNIQUE ("major_id", "group_id"),
        CONSTRAINT "FK_major_group_assignments_major" FOREIGN KEY ("major_id")
          REFERENCES "majors"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_major_group_assignments_group" FOREIGN KEY ("group_id")
          REFERENCES "major_groups"("group_id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "majors"
      ADD COLUMN IF NOT EXISTS "tags" text[] NOT NULL DEFAULT '{}'
    `);
        for (const group of MAJOR_GROUPS_SEED) {
            await queryRunner.query(`INSERT INTO major_groups (group_id, group_name, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (group_id) DO UPDATE
           SET group_name = EXCLUDED.group_name,
               description = EXCLUDED.description,
               updated_at = now()`, [group.group_id, group.group_name, group.description]);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "major_group_assignments"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "major_groups"`);
        await queryRunner.query(`ALTER TABLE "majors" DROP COLUMN IF EXISTS "tags"`);
    }
}
exports.MajorGroupsAndTags1760000000003 = MajorGroupsAndTags1760000000003;
//# sourceMappingURL=1760000000003-MajorGroupsAndTags.js.map