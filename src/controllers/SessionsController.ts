import { Request, Response } from "express";

import UserService from "../services/UserService";

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const userService = new UserService();

    const auth = await userService.authenticateUser({
      email,
      password,
    });

    delete auth.user.password

    return response.json(auth);
  }
}
