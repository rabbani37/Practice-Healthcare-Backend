import { Router } from "express";
import { AppoinmentController } from "./appoinment.controller";




const router = Router();


router.post("/book-appoinment", AppoinmentController.bookAppoinment)

router.get("/book-appoinment/payment/callback",AppoinmentController.bookAppoinmentCallback)





export const AppoinmentRoutes = router