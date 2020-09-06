import { Router } from "express";

import DrinkController from "../controllers/DrinkController";
import JWT from "../middlewares/JWT";

const drinksRouter = Router();
const drinkController = new DrinkController();

drinksRouter.get("/:drink_id", JWT, drinkController.detail);
drinksRouter.post("/", JWT, drinkController.create);
drinksRouter.put("/:drink_id", JWT, drinkController.update);
drinksRouter.delete("/:drink_id", JWT, drinkController.delete);

export default drinksRouter;
