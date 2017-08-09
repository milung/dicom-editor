import * as express from 'express';

const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

var port = process.env.PORT || 8080;
app.listen(port);