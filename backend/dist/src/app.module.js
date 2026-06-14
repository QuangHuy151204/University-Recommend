"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const universities_module_1 = require("./universities/universities.module");
const majors_module_1 = require("./majors/majors.module");
const university_majors_module_1 = require("./university-majors/university-majors.module");
const cutoff_scores_module_1 = require("./cutoff-scores/cutoff-scores.module");
const users_module_1 = require("./users/users.module");
const recommendations_module_1 = require("./recommendations/recommendations.module");
const chatbot_module_1 = require("./chatbot/chatbot.module");
const admission_methods_module_1 = require("./admission-methods/admission-methods.module");
const admin_module_1 = require("./admin/admin.module");
const favorites_module_1 = require("./favorites/favorites.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => [
                    {
                        ttl: parseInt(configService.get('THROTTLE_TTL_MS', '60000'), 10),
                        limit: parseInt(configService.get('THROTTLE_LIMIT', '120'), 10),
                    },
                ],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: parseInt(configService.get('DB_PORT', '5432')),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME', 'university_recommend'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                    synchronize: configService.get('DB_SYNCHRONIZE', 'false') === 'true',
                    migrationsRun: configService.get('DB_MIGRATIONS_RUN', 'true') === 'true',
                    logging: false,
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            universities_module_1.UniversitiesModule,
            majors_module_1.MajorsModule,
            university_majors_module_1.UniversityMajorsModule,
            cutoff_scores_module_1.CutoffScoresModule,
            users_module_1.UsersModule,
            recommendations_module_1.RecommendationsModule,
            chatbot_module_1.ChatbotModule,
            admission_methods_module_1.AdmissionMethodsModule,
            admin_module_1.AdminModule,
            favorites_module_1.FavoritesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map