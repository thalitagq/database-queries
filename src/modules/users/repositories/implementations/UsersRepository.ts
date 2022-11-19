import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    
    const user = await this.repository.findOne(
      { id: user_id },
      {
        relations: ["games"],
      }
    );

    if (!user) {
      throw new Error("User doesn't exist");
    }
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM users ORDER BY first_name"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`SELECT *
      FROM users 
       WHERE upper(first_name) = $1
       AND upper(last_name) = $2`,
      [first_name.toUpperCase(), last_name.toUpperCase()]); // Complete usando raw query
  }
}
