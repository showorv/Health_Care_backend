import express, { Application, Request, Response} from 'express';
import { indexRouter } from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { notFound } from './app/middleware/notFound';

export const app: Application = express();


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());


app.use("/api/v1", indexRouter);
// Basic route

app.get('/', async(req: Request, res: Response) => {

  res.send('Hello, TypeScript + Express!');
});


app.use(globalErrorHandler);
app.use(notFound);