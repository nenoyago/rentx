import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';

import { AppError } from '@shared/errors/AppError';

import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const usersToken = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (!usersToken) {
      throw new AppError('Invalid token');
    }

    if (
      this.dateProvider.compareIsBefore(
        usersToken.expires_date,
        this.dateProvider.dateNow()
      )
    ) {
      throw new AppError('Expired token');
    }

    const user = await this.usersRepository.findById(usersToken.user_id);

    user.password = await hash(password, 8);

    await this.usersRepository.create(user);

    await this.usersTokensRepository.deleteById(usersToken.id);
  }
}

export { ResetPasswordUserUseCase };
