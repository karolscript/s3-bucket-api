import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User) {
    try {
      const hashedPassword = await bcrypt.hashSync(user.password, 10);
      user.password = hashedPassword;
      const newUser = new this.userModel(user);
      await newUser.save();
      return 'User created successfully';
    } catch (error) {
      return error.message;
    }
  }

  async findOne(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async update(user: User) {
    try {
      await this.userModel.updateOne({ email: user.email }, user);
      return 'User updated successfully';
    } catch (error) {
      return error.message;
    }
  }
}
