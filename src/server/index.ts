import * as express from 'express';

const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('*', function (req, res) {
    if (req.hostname !== 'localhost') {
        res.redirect(process.env.root + req.url)
    }
})

var port = process.env.PORT || 8080;
app.listen(port);