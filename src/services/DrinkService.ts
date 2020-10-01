import { getRepository, Not } from "typeorm";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import User from "../database/entities/Users";
import UserDrinks from "../database/entities/UserDrinks";
import AppError from "../errors/AppError";

interface ICreateDrinkProps {
  quantity: number;
  user_id: string;
}

interface IUpdateDrinkProps {
  quantity: number;
  user_id: string;
  drink_id: string;
}

interface IDetailDrinkProps {
  user_id: string;
  drink_id: string;
}

interface IDeleteDrinkProps {
  user_id: string;
  drink_id: string;
}

export default class DrinkService {
  public async createDrink({
    quantity,
    user_id,
  }: ICreateDrinkProps): Promise<UserDrinks> {
    const drinkRepository = getRepository(UserDrinks);
    const userRepository = getRepository(User);

    const userExists = await userRepository.findOne(user_id);

    if (!userExists) {
      throw new AppError("Usuário não encontrado");
    }

    const userDrinks = new UserDrinks();

    userDrinks.quantity = quantity;
    userDrinks.user_id = user_id;

    drinkRepository.create(userDrinks);

    return await drinkRepository.save(userDrinks);
  }

  public async updateDrink({
    quantity,
    user_id,
    drink_id,
  }: IUpdateDrinkProps): Promise<UserDrinks> {
    const drinkRepository = getRepository(UserDrinks);
    const userRepository = getRepository(User);

    const userExists = await userRepository.findOne(user_id);

    if (!userExists) {
      throw new AppError("Usuário não encontrado");
    }

    const userDrinks = await drinkRepository.findOne(drink_id);

    if (!userDrinks) {
      throw new AppError("Registro não encontrado");
    }

    if (userDrinks.user_id !== user_id) {
      throw new AppError("Alteração não permitida", 403);
    }

    userDrinks.quantity = quantity;

    return await drinkRepository.save(userDrinks);
  }

  public async detailDrink({
    user_id,
    drink_id,
  }: IDetailDrinkProps): Promise<UserDrinks> {
    const drinkRepository = getRepository(UserDrinks);
    const userRepository = getRepository(User);

    const userExists = await userRepository.findOne(user_id);

    if (!userExists) {
      throw new AppError("Usuário não encontrado");
    }

    const userDrinks = await drinkRepository.findOne(drink_id);

    if (!userDrinks) {
      throw new AppError("Registro não encontrado");
    }

    if (userDrinks.user_id !== user_id) {
      throw new AppError("Alteração não permitida", 403);
    }

    return userDrinks;
  }

  public async deleteDrink({
    user_id,
    drink_id,
  }: IDeleteDrinkProps): Promise<void> {
    const drinkRepository = getRepository(UserDrinks);
    const userRepository = getRepository(User);

    const userExists = await userRepository.findOne(user_id);

    if (!userExists) {
      throw new AppError("Usuário não encontrado");
    }

    const userDrinks = await drinkRepository.findOne(drink_id);

    if (!userDrinks) {
      throw new AppError("Registro não encontrado");
    }

    if (userDrinks.user_id !== user_id) {
      throw new AppError("Alteração não permitida", 403);
    }

    await drinkRepository.delete(drink_id);
  }
}
