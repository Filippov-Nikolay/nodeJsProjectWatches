var express  = require('express');
var mssql = require('mssql'); 
var Cookies = require('cookies');
var app = express();

var path = require('path');
var bodyParser = require('body-parser'); 

var port = 8080;

// connection
var connection = require('./config');

// Указываем Express, что файлы из папки public должны быть доступны как статические
// Для Css
app.use(express.static(path.join(__dirname, '../public')));

// URL
app.use(express.urlencoded({ extended: true }));

// ejs
app.set('views', path.join(__dirname, '../pages'));
app.set('view engine', 'ejs');



app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "../index.html"));
});


app.get('/signIn', function(req, res) {
    res.sendFile(path.join(__dirname, "../signIn.html"));
});

app.post('/authentication', function(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    console.log(`${login}, ${password}`);

    var ps = new mssql.PreparedStatement(connection);
    ps.input('login', mssql.NVarChar);
    ps.input('password', mssql.NVarChar);

    let query = `
        SELECT login, 'admin' AS userType
        FROM Admins
        WHERE Admins.login = @login AND Admins.password = @password

        UNION

        SELECT login, 'user' AS userType
        FROM Users 
        WHERE Users.login = @login AND Users.password = @password
    `;

    let insert = {
        login: login,
        password: password
    }

    ps.prepare(query, (err) => {
        if (err) { console.error('Error preparing statement:', err); }

        ps.execute(insert, (err, data) => {
            if (err) { console.error('Error executing prepared statement:', err); }

            console.log(data.recordset[0]);

            if (data.recordset.length != 0) {
                const user = data.recordset[0];

                if (user.userType == 'admin') {
                    res.send('admin');
                } else if (user.userType == 'user') {
                    res.send('user');
                }
            } else {
                res.status(401).json({ error: 'Invalid login or password' });
            }
            ps.unprepare();
        });
    });
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