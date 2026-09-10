import { Router } from "express";
import { AppoinmentController } from "./appoinment.controller";




const router = Router();


router.post("/book-appoinment", AppoinmentController.bookAppoinment)







export const AppoinmentRoutes = router