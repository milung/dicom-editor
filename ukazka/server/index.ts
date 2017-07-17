import * as express from "express";

const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("Hello worldy!");
});

app.get('/hello/:who',  (req, res) => {
  res.render('hello', { 
      title: 'Hey', 
      message: `Hello ${req.params.who}, my friendly friend!` })
});

app.get('/calc/add',  (req, res) => { 
    let sum = parseInt(req.query.left) + parseInt(req.query.right);
    res.send(`${req.query.left} + ${req.query.right} = ${sum}` );
});

var port = process.env.PORT || 8080; 

app.listen( port, () => {
    console.log('Example app listening on port 3000!');
});