import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statsRouter from "./stats";
import commandsRouter from "./commands";
import announcementsRouter from "./announcements";
import partnersRouter from "./partners";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(commandsRouter);
router.use(announcementsRouter);
router.use(partnersRouter);
router.use(adminRouter);

export default router;
