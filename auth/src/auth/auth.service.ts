import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.model';
import { sign } from 'src/utils/SignAndVerify';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<any> {
    try {
      const user = await this.usersService.getUser({ username });

      if (!user) {
        return { message: "Couldn't found any matching user!", data: null };
      }

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return { message: 'Success!', data: user };
      }
      {
        return { message: 'Invalid Credentials!', data: null };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loginWithCredentials(user: User) {
    try {
      const payload = { username: user.username };

      return {
        username: user.username,
        userId: user._id,
        sigature: sign(this.jwtService.sign(payload), user.privateKey),
        expiredAt: Date.now() + 60000,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
