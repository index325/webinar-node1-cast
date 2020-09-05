import { Request, Response } from "express";

import UserService from "../services/UserService";

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const userService = new UserService();

    const user = await userService.createUser({
      name,
      email,
      password,
    });

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name, email, password } = request.body;

    const userService = new UserService();

    const user = await userService.updateUser({
      user_id: id,
      name,
      email,
      password,
    });

    return response.json(user);
  }
}
