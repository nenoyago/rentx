import { inject, injectable } from 'tsyringe';

import { IRentalsRepository } from '@modules/rentals/repositories/IRentalUseRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

@injectable()
class ListRentalsByUserUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalRepository: IRentalsRepository
  ) {}

  async execute(user_id: string): Promise<Rental[]> {
    const rentalsByUser = await this.rentalRepository.findByUser(user_id);

    return rentalsByUser;
  }
}

export { ListRentalsByUserUseCase };
