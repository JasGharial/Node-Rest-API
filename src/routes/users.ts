import router from "express";
import { getUsers } from "../responders/users";

const userRoute = router();

userRoute.get('/', getUsers);

export default userRoute;
