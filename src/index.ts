import express from 'express';
import { bookRoute } from "./routes";
import logger from 'morgan';

const app = express();

// Middleware to create logs STDOUT
app.use(logger('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/books', bookRoute);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})
