import { Router } from "express";

import usersRouter from "./user.routes";
import drinksRouter from "./userDrinks.routes";
import sessionsRouter from "./sessions.routes";

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/drinks", drinksRouter);
routes.use("/users/sessions", sessionsRouter);

export default routes;
