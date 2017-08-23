import * as express from 'express';

const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

var port = process.env.PORT || 8080;
app.listen(port);