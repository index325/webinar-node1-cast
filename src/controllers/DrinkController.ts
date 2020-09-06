import { Request, Response } from "express";

import DrinkService from "../services/DrinkService";

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { quantity } = request.body;

    const drinkService = new DrinkService();

    const drink = await drinkService.createDrink({
      quantity,
      user_id: id,
    });

    return response.json(drink);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { quantity } = request.body;
    const { drink_id } = request.params;

    const drinkService = new DrinkService();

    const drink = await drinkService.updateDrink({
      user_id: id,
      quantity,
      drink_id,
    });

    return response.json(drink);
  }

  public async detail(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { drink_id } = request.params;

    const drinkService = new DrinkService();

    const detail = await drinkService.detailDrink({ user_id: id, drink_id });

    return response.json(detail);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { drink_id } = request.params;

    const drinkService = new DrinkService();

    await drinkService.deleteDrink({ user_id: id, drink_id });

    return response.json();
  }
}
