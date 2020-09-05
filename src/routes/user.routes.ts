import { Router } from "express";

import UsersController from "../controllers/UsersController";
import JWT from "../middlewares/JWT";

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post("/", usersController.create);

usersRouter.put("/", JWT, usersController.update);

export default usersRouter;