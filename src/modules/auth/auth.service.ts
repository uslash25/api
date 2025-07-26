import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DynamicDto } from '@/common/dto/dynamic.dto';
import { LogService } from '@/common/modules/log';
import { comparePassword } from '@/common/utils/bcrypt';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { AuthRepository } from './repositories/auth.repository';

const ACCESS_TOKEN_EXPIRES_IN = '7d';

export type JwtPayload = {
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly logger: LogService) {
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findUserByUsername(dto.username);

    if (!user || !await comparePassword(dto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id);

    this.logger.log('Auth', `Login success (User ID: ${user.id})`);

    return DynamicDto(LoginResponseDto, tokens);
  }

  async generateTokens(userId: string) {
    const accessTokenPayload: JwtPayload = { sub: userId };
    const accessToken = this.jwtService.sign(accessTokenPayload, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

    return { accessToken };
  }

  async validateAccessToken(accessToken: string) {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(accessToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    const user = await this.authRepository.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
