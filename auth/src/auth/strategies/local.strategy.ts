import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const res = await this.authService.validateUserCredentials(
      username,
      password,
    );
    if (res.data === null) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: res.message,
        },
        HttpStatus.UNAUTHORIZED,
        {
          cause: res.message,
        },
      );
    }
    return res.data;
  }
}
