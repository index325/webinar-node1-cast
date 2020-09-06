import { Request, Response } from "express";

import UserService from "../services/UserService";

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, kilograms } = request.body;

    const userService = new UserService();

    const user = await userService.createUser({
      name,
      email,
      password,
      kilograms,
    });

    delete user.password;

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name, email, password, kilograms } = request.body;

    const userService = new UserService();

    const user = await userService.updateUser({
      user_id: id,
      name,
      email,
      password,
      kilograms,
    });

    delete user.password;

    return response.json(user);
  }

  public async detail(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const userService = new UserService();

    const detail = await userService.detailUser(id);

    delete detail.user.password;

    return response.json(detail);
  }
}
