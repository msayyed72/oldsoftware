import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { BookingsModule } from './bookings/bookings.module';
import { ManifestsModule } from './manifests/manifests.module';

@Controller()
class AppController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'Logistics Management System API',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/api/auth',
        bookings: '/api/bookings',
        shipments: '/api/shipments',
        manifests: '/api/manifests',
      }
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ShipmentsModule,
    BookingsModule,
    ManifestsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
