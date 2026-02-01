import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminControllerModule } from './admin-controller/admin-controller.module';
@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ".env", 
      }),
      JwtModule.registerAsync(
        {
        global:true,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>("jwtsecret"),
          signOptions: { expiresIn: "10h" },
        }),
      }),
    AuthModule,
    ProductsModule,
    AdminControllerModule],
})
export class AppModule {}
