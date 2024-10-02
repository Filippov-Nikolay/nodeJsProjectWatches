var express  = require('express');
var mssql = require('mssql'); 
var Cookies = require('cookies');
var app = express();

var path = require('path');
var bodyParser = require('body-parser'); 

var port = 8080;

// Указываем Express, что файлы из папки public должны быть доступны как статические
// Для Css
app.use(express.static(path.join(__dirname, '../public')));

// ejs
app.set('views', path.join(__dirname, '../pages'));
app.set('view engine', 'ejs');

// connection
// var connection = require('./js/config');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "../index.html"));
});


app.get('/samsung', function(req, res) {
    /*
        Создать заголовок
        создать запрос и получить данные
        Создать массив объектов (карточки: {
            srcImg: '',
            name: '',
            price: '',
            description: '',
            discount: '' (if discount = 0, ничего не выводит, а иначе: выводит скидку)
        })
        заполнить карточки и вывести
    */


    res.render('products', { 
        title: 'Samsung',
        dataTHead: null, dataTBody: null,
        inputAdd: null, inputEdit: null, inputDelete: null
    });
});
app.get('/apple', function(req, res) {
    res.sendFile(path.join(__dirname, "../index-apple.html"));
});
app.get('/alfex', function(req, res) {
    res.sendFile(path.join(__dirname, "../index-alfex.html"));
});


app.get('/discounts', function(req, res) {
    res.sendFile(path.join(__dirname, "../discounts.html"));
});



app.listen(port, function() { 
    console.log('app listening on port ' + port); 
});