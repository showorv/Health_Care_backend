import express, { Application, Request, Response} from 'express';
import { indexRouter } from './app/routes';

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