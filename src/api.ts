// tslint:disable:no-console
import * as express from 'express';
import { Express, Request, Response } from 'express-serve-static-core';
import * as expressSession from 'express-session';

const app: Express = express();
const port = 8000;

app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

app.get('/api', (req: Request, res: Response) => {
    const session: Express.Session = req.session as Express.Session;
    res.send({ value: session.string });
});

app.post('/api/:string?', (req: Request, res: Response) => {
    (req.session as Express.Session).string = req.params.string;
    res.sendStatus(200);
});

app.listen(port, (err: NodeJS.ErrnoException) => {
    if (err) {
        throw err;
    }
    console.info(`API server listening on ${port}`);
});
