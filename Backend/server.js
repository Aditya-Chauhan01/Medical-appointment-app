import express from 'express'
import cors from "cors";
import 'dotenv/config.js'
import appointmentRoute from "./routes/appointmentRoute.js";

// app config
const app = express()
const PORT = process.env.PORT || 4000


//Middlewares
app.use(express.json())
app.use(cors())

// api entrypoints
app.use('/api/appointments', appointmentRoute)


app.listen(PORT, ()=>console.log('Server started', PORT))
