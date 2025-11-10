"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:5000', 'http://0.0.0.0:5000'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    const port = process.env.PORT || 3000;
    await app.listen(port, '127.0.0.1');
    console.log(`🚀 Backend server running on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map