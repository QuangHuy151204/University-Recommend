export interface FeaturedMajorGroupCopy {
    title: string;
    majors: string;
    highlight: string;
}

export interface FeaturedMajorGroup {
    id: string;
    searchTerm: string;
    accent: 'primary' | 'secondary' | 'tertiary';
    vi: FeaturedMajorGroupCopy;
    en: FeaturedMajorGroupCopy;
}

/** 12 nhóm ngành nổi bật — nguồn tư vấn định hướng nghề (WEF, thị trường VN). */
export const FEATURED_MAJOR_GROUPS: FeaturedMajorGroup[] = [
    {
        id: 'it',
        searchTerm: 'Công nghệ thông tin',
        accent: 'tertiary',
        vi: {
            title: 'Công nghệ thông tin',
            majors:
                'Khoa học máy tính, Công nghệ phần mềm, Hệ thống thông tin, An toàn thông tin, AI, Data Science',
            highlight:
                'AI, dữ liệu, cloud và cybersecurity là nhóm kỹ năng tăng mạnh toàn cầu; WEF xếp Big Data, AI/ML, Software Developer và Security Management vào nhóm nghề tăng trưởng nhanh đến 2030.',
        },
        en: {
            title: 'Information technology',
            majors:
                'Computer science, software engineering, information systems, cybersecurity, AI, data science',
            highlight:
                'AI, data, cloud, and cybersecurity skills are surging globally; the WEF ranks big data, AI/ML, software development, and security among the fastest-growing roles through 2030.',
        },
    },
    {
        id: 'ai-data',
        searchTerm: 'Trí tuệ nhân tạo',
        accent: 'secondary',
        vi: {
            title: 'Trí tuệ nhân tạo & Khoa học dữ liệu',
            majors: 'AI, Machine Learning, Data Analytics, Big Data',
            highlight:
                'Nhu cầu rất mạnh nhưng yêu cầu nền tảng toán, lập trình và tư duy phân tích cao — nên tách riêng khi tư vấn định hướng.',
        },
        en: {
            title: 'AI & data science',
            majors: 'AI, machine learning, data analytics, big data',
            highlight:
                'Demand is strong, but solid math, programming, and analytical thinking are essential — worth highlighting as its own path in advising.',
        },
    },
    {
        id: 'semiconductor',
        searchTerm: 'Kỹ thuật điện tử',
        accent: 'primary',
        vi: {
            title: 'Vi mạch bán dẫn – Điện tử',
            majors:
                'Thiết kế vi mạch, Kỹ thuật điện tử, Kỹ thuật máy tính, Tự động hóa, IoT',
            highlight:
                'Việt Nam có chương trình phát triển nhân lực bán dẫn đến 2030, mục tiêu đào tạo ít nhất 50.000 nhân lực đại học trở lên cho ngành bán dẫn.',
        },
        en: {
            title: 'Semiconductors & electronics',
            majors:
                'Chip design, electronics engineering, computer engineering, automation, IoT',
            highlight:
                'Vietnam’s semiconductor workforce plan targets 50,000+ university-level professionals by 2030, making this a strategic growth field.',
        },
    },
    {
        id: 'engineering',
        searchTerm: 'Kỹ thuật cơ khí',
        accent: 'primary',
        vi: {
            title: 'Kỹ thuật – Công nghệ sản xuất',
            majors:
                'Cơ điện tử, Robot, Tự động hóa, Kỹ thuật cơ khí, Kỹ thuật ô tô, Kỹ thuật điện',
            highlight:
                'Phù hợp xu hướng sản xuất thông minh, FDI, nhà máy tự động hóa và chuỗi cung ứng công nghiệp.',
        },
        en: {
            title: 'Engineering & smart manufacturing',
            majors:
                'Mechatronics, robotics, automation, mechanical, automotive, and electrical engineering',
            highlight:
                'Aligned with smart factories, FDI in manufacturing, automation, and industrial supply chains.',
        },
    },
    {
        id: 'logistics',
        searchTerm: 'Logistics',
        accent: 'secondary',
        vi: {
            title: 'Logistics & Quản lý chuỗi cung ứng',
            majors: 'Logistics, Supply Chain, Kinh doanh quốc tế, Xuất nhập khẩu',
            highlight:
                'Việt Nam hưởng lợi từ thương mại, sản xuất và thương mại điện tử; logistics là lĩnh vực tăng trưởng nhanh trên thị trường lao động.',
        },
        en: {
            title: 'Logistics & supply chain',
            majors: 'Logistics, supply chain, international business, import–export',
            highlight:
                'Trade, manufacturing, and e-commerce keep driving demand; logistics is among Vietnam’s fast-growing labor segments.',
        },
    },
    {
        id: 'digital-economy',
        searchTerm: 'Marketing',
        accent: 'tertiary',
        vi: {
            title: 'Kinh tế số – Thương mại điện tử – Marketing số',
            majors:
                'Digital Marketing, E-commerce, Business Analytics, Quản trị kinh doanh số',
            highlight:
                'Doanh nghiệp chuyển mạnh sang bán hàng online, vận hành bằng dữ liệu, CRM, quảng cáo số và tự động hóa marketing.',
        },
        en: {
            title: 'Digital economy & e-commerce',
            majors: 'Digital marketing, e-commerce, business analytics, digital business',
            highlight:
                'Companies are shifting to online sales, data-driven operations, CRM, digital ads, and marketing automation.',
        },
    },
    {
        id: 'finance',
        searchTerm: 'Tài chính',
        accent: 'primary',
        vi: {
            title: 'Tài chính – Ngân hàng – Fintech',
            majors:
                'Tài chính, Ngân hàng, Kế toán, Kiểm toán, Fintech, Phân tích tài chính',
            highlight:
                'Nhóm ngành ổn định; nên ưu tiên chương trình có dữ liệu, công nghệ tài chính, phân tích rủi ro và kiểm toán số.',
        },
        en: {
            title: 'Finance, banking & fintech',
            majors:
                'Finance, banking, accounting, auditing, fintech, financial analysis',
            highlight:
                'A stable field — programs with data skills, fintech, risk analytics, and digital auditing stand out.',
        },
    },
    {
        id: 'healthcare',
        searchTerm: 'Y khoa',
        accent: 'secondary',
        vi: {
            title: 'Y dược & Chăm sóc sức khỏe',
            majors:
                'Y khoa, Dược, Điều dưỡng, Kỹ thuật xét nghiệm, Công nghệ sinh học',
            highlight:
                'Nhu cầu chăm sóc sức khỏe tăng theo già hóa dân số, chất lượng sống và hệ thống y tế mở rộng.',
        },
        en: {
            title: 'Healthcare & pharmacy',
            majors:
                'Medicine, pharmacy, nursing, laboratory technology, biotechnology',
            highlight:
                'Healthcare demand rises with an aging population, higher living standards, and expanding medical systems.',
        },
    },
    {
        id: 'green-energy',
        searchTerm: 'Môi trường',
        accent: 'secondary',
        vi: {
            title: 'Năng lượng tái tạo – Môi trường – ESG',
            majors:
                'Kỹ thuật năng lượng, Môi trường, Quản lý tài nguyên, Kinh tế xanh',
            highlight:
                'Công nghệ xanh, năng lượng tái tạo và phát triển bền vững là xu hướng nghề toàn cầu; WEF nhấn mạnh chuyển đổi xanh là động lực thay đổi việc làm.',
        },
        en: {
            title: 'Renewable energy, environment & ESG',
            majors:
                'Energy engineering, environmental science, resource management, green economy',
            highlight:
                'Green tech, renewables, and sustainability are global career trends; the green transition is reshaping jobs worldwide.',
        },
    },
    {
        id: 'languages',
        searchTerm: 'Ngôn ngữ Anh',
        accent: 'tertiary',
        vi: {
            title: 'Ngôn ngữ – Quan hệ quốc tế – Truyền thông',
            majors:
                'Ngôn ngữ Anh, Nhật, Hàn, Trung; Truyền thông đa phương tiện; Quan hệ quốc tế',
            highlight:
                'Nổi bật khi kết hợp kỹ năng nghề cụ thể: thương mại, công nghệ, marketing, nhân sự, du lịch hoặc biên phiên dịch chuyên ngành.',
        },
        en: {
            title: 'Languages, IR & media',
            majors:
                'English, Japanese, Korean, Chinese; multimedia communication; international relations',
            highlight:
                'Strongest when paired with a concrete skill: trade, tech, marketing, HR, tourism, or specialized translation.',
        },
    },
    {
        id: 'tourism',
        searchTerm: 'Du lịch',
        accent: 'tertiary',
        vi: {
            title: 'Du lịch – Khách sạn – Dịch vụ',
            majors: 'Quản trị khách sạn, Du lịch, Lữ hành, Nhà hàng',
            highlight:
                'Phù hợp phục hồi du lịch và nhu cầu dịch vụ chất lượng cao; nên chọn trường có thực tập và doanh nghiệp liên kết tốt.',
        },
        en: {
            title: 'Tourism, hospitality & services',
            majors: 'Hotel management, tourism, tour operations, restaurant management',
            highlight:
                'Fits tourism recovery and premium service demand — pick schools with strong internships and industry partners.',
        },
    },
    {
        id: 'education',
        searchTerm: 'Sư phạm',
        accent: 'primary',
        vi: {
            title: 'Giáo dục – Sư phạm',
            majors:
                'Sư phạm Toán, Tin, Anh, Mầm non, Tiểu học, Giáo dục đặc biệt',
            highlight:
                'Nhu cầu giáo viên chất lượng cao vẫn có, đặc biệt các môn STEM, ngoại ngữ và giáo dục sớm.',
        },
        en: {
            title: 'Education & pedagogy',
            majors:
                'Math, IT, English pedagogy; preschool, primary, and special education',
            highlight:
                'Quality teachers remain in demand, especially for STEM subjects, foreign languages, and early childhood education.',
        },
    },
];

export function getFeaturedMajorGroupCopy(
    group: FeaturedMajorGroup,
    locale: 'vi' | 'en',
): FeaturedMajorGroupCopy {
    return locale === 'en' ? group.en : group.vi;
}
