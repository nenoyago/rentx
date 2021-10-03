import dayjs from 'dayjs';

import { CreateRentalUseCase } from './CreateRentalUseCase';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      carsRepositoryInMemory,
      dayjsDateProvider
    );
  });

  it('should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car test',
      description: 'Car test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      brand: 'brand',
      category_id: '1234',
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: '12345',
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if is another open to the same user', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: '121212',
      user_id: '12345',
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: '141414',
        user_id: '12345',
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError('There is a rental in progress for user'));
  });

  it('should not be able to create a new rental if is another open to the same car', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: 'test',
      user_id: '123',
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: 'test',
        user_id: '321',
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError('Car is unavailable'));
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: 'test',
        user_id: '123',
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError('Invalid return time'));
  });
});
