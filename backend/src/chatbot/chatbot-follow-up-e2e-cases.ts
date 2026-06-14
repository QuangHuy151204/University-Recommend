import type { ChatEntities, ChatIntent } from './chatbot.types';

/** Turn 2 trong kịch bản multi-turn — session từ turn 1 qua context_note. */

export type ChatbotFollowUpE2eCase = {
  id: string;

  q: string;

  intent: ChatIntent;

  /** Entity sau mergeEntitiesWithSession (explicit trong câu ghi đè session). */

  entities: Partial<ChatEntities>;

  context_note: string;

  handler: string;
};

/**

 * Regression E2E: follow-up đổi trường/ngành — intent + entity + handler matrix.

 * Khớp các dòng session_switch_* trong intent.txt (416–425).

 */

export const CHATBOT_FOLLOW_UP_E2E_CASES: ChatbotFollowUpE2eCase[] = [
  {
    id: 'switch-hust-usth-hang-khong',

    q: 'điểm chuẩn ngành hàng không của USTH thì sao',

    intent: 'ask_cutoff_score',

    entities: { university_name: 'USTH', major: 'Hàng không' },

    context_note:
      'Turn trước người dùng hỏi điểm chuẩn HUST ngành Trí tuệ nhân tạo năm 2024.',

    handler: 'handleCutoffQuery',
  },

  {
    id: 'switch-neu-ftu-tuition',

    q: 'thế còn FTU thì học phí bao nhiêu',

    intent: 'ask_tuition_fee',

    entities: { university_name: 'FTU' },

    context_note: 'Turn trước người dùng hỏi học phí NEU.',

    handler: 'handleTuitionQuery',
  },

  {
    id: 'switch-hust-ptit-majors',

    q: 'PTIT có những ngành gì',

    intent: 'search_university',

    entities: { university_name: 'PTIT' },

    context_note: 'Turn trước người dùng hỏi HUST có những ngành gì.',

    handler: 'handleUniversityQuery',
  },

  {
    id: 'switch-bk-phenikaa-cutoff',

    q: 'thế còn Phenikaa ngành CNTT năm 2024',

    intent: 'ask_cutoff_score',

    entities: {
      university_name: 'Phenikaa',
      major: 'Công nghệ thông tin',
      year: 2024,
    },

    context_note:
      'Turn trước người dùng hỏi điểm chuẩn Bách Khoa ngành CNTT năm 2024.',

    handler: 'handleCutoffQuery',
  },

  {
    id: 'switch-usth-neu-marketing-tuition',

    q: 'học phí NEU ngành Marketing thì sao',

    intent: 'ask_tuition_fee',

    entities: { university_name: 'NEU', major: 'Marketing' },

    context_note: 'Turn trước người dùng hỏi học phí chung của USTH.',

    handler: 'handleTuitionQuery',
  },

  {
    id: 'switch-compare-usth-hust',

    q: 'so sánh USTH với HUST về điểm chuẩn CNTT',

    intent: 'compare_universities',

    entities: { major: 'Công nghệ thông tin' },

    context_note: 'Turn trước người dùng so sánh NEU và FTU.',

    handler: 'handleCompareQuery',
  },

  {
    id: 'switch-compare-neu-ftu-tuition',

    q: 'Còn học phí thì trường nào rẻ hơn?',

    intent: 'compare_universities',

    entities: {},

    context_note:
      'Turn trước người dùng so sánh NEU và FTU về điểm chuẩn ngành Logistics.',

    handler: 'handleCompareQuery',
  },

  {
    id: 'switch-hust-haui-dien-tu',

    q: 'HAUI ngành Điện tử năm 2025 lấy bao nhiêu điểm',

    intent: 'ask_cutoff_score',

    entities: { university_name: 'HAUI', major: 'Điện tử', year: 2025 },

    context_note:
      'Turn trước người dùng hỏi điểm chuẩn HUST ngành Điện tử năm 2025.',

    handler: 'handleCutoffQuery',
  },

  {
    id: 'switch-recommend-usth-ai',

    q: 'nếu em muốn học AI ở USTH thì sao',

    intent: 'recommendation_by_score',

    entities: { university_name: 'USTH', major: 'Trí tuệ nhân tạo' },

    context_note:
      'User vừa hỏi gợi ý trường với 24 điểm A00 học CNTT ở Hà Nội.',

    handler: 'handleScoreQuery',
  },

  {
    id: 'switch-neu-usth-facilities',

    q: 'USTH có KTX không',

    intent: 'ask_facilities',

    entities: { university_name: 'USTH' },

    context_note: 'Turn trước người dùng hỏi NEU có ký túc xá không.',

    handler: 'handleFacilitiesQuery',
  },

  {
    id: 'switch-neu-hust-admission',

    q: 'HUST xét tuyển bằng học bạ không',

    intent: 'ask_admission_method',

    entities: { university_name: 'HUST' },

    context_note:
      'Turn trước người dùng hỏi NEU xét tuyển những phương thức nào.',

    handler: 'handleAdmissionMethodQuery',
  },
];
