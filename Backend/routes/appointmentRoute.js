import express from "express"; 

import {getSlots, bookAppointment} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/slots", getSlots);

router.post("/book", bookAppointment);

export default router;