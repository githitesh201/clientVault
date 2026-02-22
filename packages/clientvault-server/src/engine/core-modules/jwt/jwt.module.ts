import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';
import { ClientVaultConfigModule } from 'src/engine/core-modules/clientvault-config/clientvault-config.module';
import { ClientVaultConfigService } from 'src/engine/core-modules/clientvault-config/clientvault-config.service';

const InternalJwtModule = NestJwtModule.registerAsync({
  useFactory: async (clientvaultConfigService: ClientVaultConfigService) => {
    return {
      secret: clientvaultConfigService.get('APP_SECRET'),
      signOptions: {
        algorithm: 'HS256',
        expiresIn: clientvaultConfigService.get('ACCESS_TOKEN_EXPIRES_IN'),
      },
      verifyOptions: {
        algorithms: ['HS256'],
      },
    };
  },
  inject: [ClientVaultConfigService],
});

@Module({
  imports: [InternalJwtModule, ClientVaultConfigModule],
  controllers: [],
  providers: [JwtWrapperService],
  exports: [JwtWrapperService],
})
export class JwtModule {}
