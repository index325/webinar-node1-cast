import { getRepository, Not } from "typeorm";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import User from "../database/entities/Users";
import AppError from "../errors/AppError";
import authConfig from "../config/auth";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserProps {
  user_id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthenticationProps {
  email: string;
  password: string;
}

interface IAuthenticationResponse {
  user: User;
  token: string;
}

export default class UserService {
  public async createUser({
    name,
    email,
    password,
  }: CreateUserProps): Promise<User> {
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

    userRepository.create(user);
    await userRepository.save(user);

    return user;
  }

  public async updateUser({
    user_id,
    name,
    email,
  }: UpdateUserProps): Promise<User> {
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

    user = await userRepository.save(user);

    return user;
  }

  public async authenticateUser({
    password,
    email,
  }: AuthenticationProps): Promise<IAuthenticationResponse> {
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
