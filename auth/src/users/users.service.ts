import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { User } from './user.model';
import * as FormData from 'form-data';
import * as bcrypt from 'bcrypt';
import { generateKeyPair } from '../utils/SignAndVerify';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly httpService: HttpService,
  ) {}

  async createUser(username: string, password: string): Promise<any> {
    try {
      const { privateKey, publicKey } = generateKeyPair();

      const hexaPrivateKey = privateKey.toString('hex');
      const hexaPublicKey = publicKey.toString('hex');

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      const user = await this.userModel.create({
        username,
        password: hashPassword,
        privateKey: hexaPrivateKey,
        publicKey: hexaPublicKey,
      });

      return {
        username: user.username,
        publicKey: user.publicKey,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async getUsers(): Promise<User[]> {
    try {
      return this.userModel.find({}, { password: 0, privateKey: 0 }).exec();
    } catch (error) {
      console.log(error);
    }
  }

  async getUser({ username }): Promise<User | undefined> {
    try {
      return this.userModel.findOne({
        username,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getMe(userId): Promise<User | undefined> {
    try {
      const user = await this.userModel.findById(userId, {
        password: 0,
        privateKey: 0,
      });
      if (!user) {
        throw 'User not found';
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async uploadAvatar(
    avatar: Express.Multer.File,
    userId: string,
  ): Promise<any> {
    try {
      const user = await this.userModel.findById(userId, {
        password: 0,
        privateKey: 0,
      });
      if (!user) {
        throw 'User not found';
      }
      const formData = new FormData();
      formData.append('image', avatar.buffer.toString('base64'));
      const { data: imageData } = await firstValueFrom(
        this.httpService
          .post(
            `https://api.imgbb.com/1/upload?expiration=600&key=${process.env.IMG_API_KEY}`,
            formData,
          )
          .pipe(
            catchError((error: AxiosError) => {
              throw error;
            }),
          ),
      );
      user.updateOne({ avatar: imageData.data.url }).exec();
      return imageData;
    } catch (error) {
      console.log(error);
    }
  }
}
