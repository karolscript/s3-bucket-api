import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: [true, 'Email is required'], unique: true})
  email: string;

  @Prop({ required: [true, 'Password is required'] })
  password: string;

  @Prop({default: ''})
  access_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
