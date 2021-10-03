import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { ListAvailableCarsUseCase } from './listAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it('should be able to list available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 1',
      description: 'Car description',
      daily_rate: 110.0,
      license_plate: 'DEF-1234',
      fine_amount: 40,
      brand: 'Car_brand',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 2',
      description: 'Car description',
      daily_rate: 140,
      license_plate: 'DEF-9872',
      fine_amount: 100,
      brand: 'Car_brand 2',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Car_brand 2',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 3',
      description: 'Car description',
      daily_rate: 120,
      license_plate: 'DEF-6543',
      fine_amount: 90,
      brand: 'Car_brand 3',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car 3',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by category', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 4',
      description: 'Car description',
      daily_rate: 180,
      license_plate: 'DEF-7890',
      fine_amount: 120,
      brand: 'Car_brand 4',
      category_id: '12345',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: '12345',
    });

    expect(cars).toEqual([car]);
  });
});
