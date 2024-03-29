import { classToClass } from 'class-transformer';

import { User } from '../infra/typeorm/entities/User';
import { IUserResponseDTO } from '../dtos/IUserResponseDTO';

class UserMap {
  static toDTO({
    email,
    name,
    id,
    avatar,
    driver_license,
    getAvatarUrl,
  }: User): IUserResponseDTO {
    const user = classToClass({
      email,
      name,
      id,
      avatar,
      driver_license,
      avatar_url: getAvatarUrl(),
    });

    return user;
  }
}

export { UserMap };
