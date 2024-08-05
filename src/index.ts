import express from 'express';
import { userRoutes } from "./routes";

const app = express();

app.use('/api/users', userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})
