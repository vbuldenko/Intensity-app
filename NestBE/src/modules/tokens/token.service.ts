import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async create(tokenData: Partial<Token>): Promise<Token> {
    const token = new this.tokenModel(tokenData);
    return token.save();
  }

  async findByUserId(userId: string): Promise<Token | null> {
    return this.tokenModel.findOne({ userId }).exec();
  }

  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    return this.tokenModel.findOne({ refreshToken }).exec();
  }

  async updateByUserId(
    userId: string,
    refreshToken: string,
  ): Promise<Token | null> {
    return this.tokenModel
      .findOneAndUpdate({ userId }, { refreshToken }, { new: true })
      .exec();
  }

  async deleteByUserId(userId: string): Promise<Token | null> {
    return this.tokenModel.findOneAndDelete({ userId }).exec();
  }

  async deleteByRefreshToken(refreshToken: string): Promise<Token | null> {
    return this.tokenModel.findOneAndDelete({ refreshToken }).exec();
  }
}
