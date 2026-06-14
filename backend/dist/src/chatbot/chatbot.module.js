"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chatbot_controller_1 = require("./chatbot.controller");
const chatbot_service_1 = require("./chatbot.service");
const chat_session_entity_1 = require("./chat-session.entity");
const chat_message_entity_1 = require("./chat-message.entity");
const university_entity_1 = require("../universities/university.entity");
const major_entity_1 = require("../majors/major.entity");
const university_major_entity_1 = require("../majors/university-major.entity");
const cutoff_score_entity_1 = require("../cutoff-scores/cutoff-score.entity");
const ollama_module_1 = require("../ollama/ollama.module");
const recommendations_module_1 = require("../recommendations/recommendations.module");
const admission_methods_module_1 = require("../admission-methods/admission-methods.module");
const auth_module_1 = require("../auth/auth.module");
let ChatbotModule = class ChatbotModule {
};
exports.ChatbotModule = ChatbotModule;
exports.ChatbotModule = ChatbotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([
                chat_session_entity_1.ChatSession,
                chat_message_entity_1.ChatMessage,
                university_entity_1.University,
                major_entity_1.Major,
                university_major_entity_1.UniversityMajor,
                cutoff_score_entity_1.CutoffScore,
            ]),
            ollama_module_1.OllamaModule,
            recommendations_module_1.RecommendationsModule,
            admission_methods_module_1.AdmissionMethodsModule,
        ],
        controllers: [chatbot_controller_1.ChatbotController],
        providers: [chatbot_service_1.ChatbotService],
        exports: [chatbot_service_1.ChatbotService],
    })
], ChatbotModule);
//# sourceMappingURL=chatbot.module.js.map