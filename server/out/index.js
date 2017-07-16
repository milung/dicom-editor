"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));
app.get("/", (req, res) => {
    res.send("Hello worldy!");
});
app.get('/hello/:who', (req, res) => {
    res.render('hello', {
        title: 'Hey',
        message: `Hello ${req.params.who}, my friendly friend!`
    });
});
app.get('/calc/add', (req, res) => {
    let sum = Number.parseInt(req.query.left) + Number.parseInt(req.query.right);
    res.send(`${req.query.left} + ${req.query.right} = ${sum}`);
});
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
//# sourceMappingURL=index.js.map