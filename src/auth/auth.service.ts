import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, getSalt, hash } from 'bcryptjs';
import { userNotFoundError, wrongPasswordError } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: await hash(dto.password, 10),
    });

    return newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);

    if (!user) {
      throw new UnauthorizedException(userNotFoundError);
    }

    const isCorrectPassword = await compare(password, user.passwordHash);

    if (!isCorrectPassword) {
      throw new UnauthorizedException(wrongPasswordError);
    }

    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
