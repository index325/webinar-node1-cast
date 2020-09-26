import { getRepository, Not } from "typeorm";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import User from "../database/entities/Users";
import UserDrinks from "../database/entities/UserDrinks";

import AppError from "../errors/AppError";
import authConfig from "../config/auth";

interface ICreateUserProps {
  name: string;
  email: string;
  password: string;
  kilograms: number;
}

interface IUpdateUserProps {
  user_id: string;
  name: string;
  email: string;
  password: string;
  kilograms: number;
}

interface IAuthenticationProps {
  email: string;
  password: string;
}

interface IAuthenticationResponse {
  user: User;
  token: string;
}

interface IDetailUser {
  user: User;
  quantityThatYouNeedToDrink: number;
  quantityThatYouDrinked: number;
  needToDrinkMore: boolean;
}

export default class UserService {
  public async createUser({
    name,
    email,
    password,
    kilograms,
  }: ICreateUserProps): Promise<User> {
    const userRepository = getRepository(User);
    const emailAlreadyExists = await userRepository.findOne({
      where: { email },
    });

    if (emailAlreadyExists) {
      throw new AppError("Este e-mail já está sendo utilizado.");
    }

    const user = new User();

    user.name = name;
    user.email = email;
    user.password = await hash(password, 8);
    user.kilograms = kilograms;

    userRepository.create(user);
    await userRepository.save(user);

    return user;
  }

  public async updateUser({
    user_id,
    name,
    email,
    kilograms,
  }: IUpdateUserProps): Promise<User> {
    const userRepository = getRepository(User);

    const emailAlreadyExists = await userRepository.findOne({
      where: { email, id: Not(user_id) },
    });

    if (emailAlreadyExists) {
      throw new AppError("Este e-mail já está sendo utilizado.");
    }

    let user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    user.name = name;
    user.email = email;
    user.kilograms = kilograms;

    user = await userRepository.save(user);

    return user;
  }

  public async detailUser(user_id: string): Promise<IDetailUser> {
    const userRepository = getRepository(User);
    const drinksRepository = getRepository(UserDrinks);
    const user = await userRepository.findOne(user_id);

    let { sum } = await drinksRepository
      .createQueryBuilder("user_drinks")
      .select("SUM(user_drinks.quantity)", "sum")
      .where("user_drinks.user_id = :id", { id: user_id })
      .andWhere(
        "to_char(user_drinks.created_at, 'yyyy-MM-dd') = to_char(current_date, 'yyyy-MM-dd')"
      )
      .getRawOne();

    sum = sum || 0;

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const quantityThatYouNeedToDrink = user.kilograms * 35;

    const detailFormated: IDetailUser = {
      user: user,
      quantityThatYouDrinked: sum,
      quantityThatYouNeedToDrink,
      needToDrinkMore: quantityThatYouNeedToDrink >= sum ? true : false,
    };

    return detailFormated;
  }

  public async authenticateUser({
    password,
    email,
  }: IAuthenticationProps): Promise<IAuthenticationResponse> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError("Senha ou email incorreto(s)");
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Senha ou email incorreto(s)");
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}
