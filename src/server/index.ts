import * as express from 'express';
// import { redirectToHTTPS } from 'express-http-to-https';

const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));
// app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/]));

var port = process.env.PORT || 8080;
app.listen(port);