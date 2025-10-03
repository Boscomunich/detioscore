import express from "express";
import { fetchUser, updateUsername } from "./controller";

const router = express.Router();

router.post("/get-user", fetchUser);
router.get("/update-username", updateUsername);

export const userRouter = router;
