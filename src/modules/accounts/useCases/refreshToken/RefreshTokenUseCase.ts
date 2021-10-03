import { inject, injectable } from 'tsyringe';
import { sign, verify } from 'jsonwebtoken';

import auth from '@config/auth';
import { AppError } from '@shared/errors/AppError';

import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import {
  generateJwtRefreshToken,
  generateJwtToken,
  verifyToken,
} from '@utils/generateAndVerifyToken';

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const { sub: user_id, email } = verifyToken(token, 'refresh_token');

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        token
      );

    if (!userToken) {
      throw new AppError('Refresh token does not exists');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = generateJwtRefreshToken(user_id, { email });

    const expires_date = this.dateProvider.addDays(
      auth.expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      user_id,
      refresh_token,
      expires_date,
    });

    const newToken = generateJwtToken(user_id);

    return { token: newToken, refresh_token };
  }
}

export { RefreshTokenUseCase };
