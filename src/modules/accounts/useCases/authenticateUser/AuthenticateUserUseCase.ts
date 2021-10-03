import { inject, injectable } from 'tsyringe';
import { compare } from 'bcrypt';

import auth from '@config/auth';
import { AppError } from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import {
  generateJwtRefreshToken,
  generateJwtToken,
} from '@utils/generateAndVerifyToken';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  refresh_token: string;
  user: {
    name: string;
    email: string;
  };
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect');
    }

    const token = generateJwtToken(user.id);

    const refresh_token = generateJwtRefreshToken(user.id, { email });

    const expires_date = this.dateProvider.addDays(
      auth.expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date,
    });

    return {
      token,
      refresh_token,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }
}

export { AuthenticateUserUseCase };
