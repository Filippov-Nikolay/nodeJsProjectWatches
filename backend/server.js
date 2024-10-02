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

// JSON
app.use(express.json());


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "../index.html"));
});


app.get('/signIn', function(req, res) {
    res.sendFile(path.join(__dirname, "../signIn.html"));
});




function GetThead(tableName, callback) {
    let ps = new mssql.Request(connection);

    let self = this;
    self.tableRows = ``;

    let query = `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = '${tableName}';
    `;

    ps.query(query, (err, data) => {
        self.tableRows += '<tr>';
        self.tableRows += `<td>Function</td>`;
        data.recordset.forEach((row, index) => {
            self.tableRows += `<td>${row.COLUMN_NAME}</td>`;
        });
        self.tableRows += '</tr>';

        callback(null, self.tableRows);
    });
}
function GetTbody(tableName, callback) {
    let ps = new mssql.Request(connection);

    let self = this;
    self.tableRows = ``;

    let query = `
        SELECT *
        FROM ${tableName}
    `;

    ps.query(query, (err, data) => {
        data.recordset.forEach(row => {
            self.tableRows += `<tr>`;
            self.tableRows += `
                <td>
                    <span class="function edit" id="${row.ID}" onclick="editRow(this)"> edit </span> 
                    <span class="function delete" id="${row.ID}" onclick="deleteRow(this)"> delete </span>
                </td>
            `
            Object.values(row).forEach(value => {
                self.tableRows += `<td>${value}</td>`;
            });
            self.tableRows += `</tr>`;
        });

        callback(null, self.tableRows);
    })
}
function GetInputsType(tableName, callback) {
    let ps = new mssql.Request(connection);

    let self = this;
    self.inputAdd = ``;

    let inputTableName = `<input type="hidden" name="tableName" value="${tableName}"></input>`;

    let query = `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = '${tableName}';
    `;

    ps.query(query, (err, data) => {
        data.recordset.forEach((row, index) => {
            index != 0 ?
            self.inputAdd += `<input class="add" type="text" name="add-${row.COLUMN_NAME}" placeholder="${row.COLUMN_NAME}" required /><br/>`
            : self.inputAdd += inputTableName;
        });

        callback(null, self.inputAdd);
    });
}


function render(req, res, tableName) {
    let data = 'hello world';
    tableName = 'Products'

    GetThead(tableName, (err, tableThead) => {
        GetTbody(tableName, (err, tableTbody) => {
            let prefix = 'add'; 

            GetInputsType(tableName, (err, inputAdd) => {
                res.render('adminPanel', {
                    thead: tableThead, tbody: tableTbody, data: data,
                    inputAdd: inputAdd
                });
            });
        });
    });
}


// ADD
app.post('/add', (req, res) => {
    const data = req.body;

    console.log(data);
});

// EDIT
app.post('/edit', (req, res) => {
    const data = req.body;

    console.log(data.name);
    console.log(data.price);
    console.log(data.description);
});

// DEL
app.post('/del', (req, res) => {
    const data = req.body;

    console.log(data.ID);
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
                    render(req, res);
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