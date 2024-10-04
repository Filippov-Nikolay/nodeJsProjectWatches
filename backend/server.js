var express  = require('express');
var mssql = require('mssql'); 
var Cookies = require('cookies');
var app = express();

var path = require('path');
var bodyParser = require('body-parser'); 

var port = 8080;

// connection
var connection = require('./config');
const { title } = require('process');

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


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});


function executeReq(ps, query, inserts, message, callback) {
    var transaction = new mssql.Transaction(connection);

    transaction.begin(function (err) {
        ps.prepare(query, function (err) {
            if (err) {
                console.log(err);
                transaction.rollback(function(err) {
                    console.log('rollback successful');
                });
            } else {
                transaction.commit(function(err, data) {
                    ps.execute(inserts, function (err, result) {
                        if (err) console.log(err);

                        console.log(`${message}`);
                        ps.unprepare();

                        // Возвращаем успешный результат
                        callback(null, result);
                    });
                });
            }
        });
    });
}


function render(req, res, tableName) {
    if (tableName == undefined || tableName == null)
        tableName = 'Products';

    GetThead(tableName, (err, tableThead) => {
        GetTbody(tableName, (err, tableTbody) => {
            GetInputsType(tableName, (err, inputAdd) => {
                res.render('adminPanel', {
                    title: tableName,
                    thead: tableThead, tbody: tableTbody,
                    inputAdd: inputAdd
                });
            });
        });
    });
}



app.get('/signIn', (req, res) => {
    res.sendFile(path.join(__dirname, "../signIn.html"));
});
app.post('/authentication', (req, res) => {
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
                    res.redirect('/adminPanel');
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
app.get('/adminPanel', (req, res) => {
    render(req, res);
});
app.post('/adminPanel/update', (req, res) => {
    const tableName = req.body.selectedTable;
    
    GetThead(tableName, (err, tableThead) => {
        GetTbody(tableName, (err, tableTbody) => {
            res.json({
                title: tableName,
                thead: tableThead, tbody: tableTbody
            });
        });
    });
});






app.get('/signUp', (req, res) => {
    res.sendFile(path.join(__dirname, "../signUp.html"));
});
app.post('/registration', (req, res) => {
    const login = req.body.login;
    const email = req.body.email;
    const password = req.body.password;

    console.log(`${login}, ${email}, ${password}`);

    var ps = new mssql.PreparedStatement(connection);
    ps.input('login', mssql.NVarChar);
    ps.input('email', mssql.NVarChar);
    ps.input('password', mssql.NVarChar);

    let query = `
        INSERT INTO Users (login, email, password)
        VALUES (@login, @email, @password)
    `;

    let insert = {
        login: login,
        email: email,
        password: password
    }

    ps.prepare(query, (err) => {
        if (err) { console.error('Error preparing statement:', err); }

        ps.execute(insert, (err) => {
            if (err) { console.error('Error executing prepared statement:', err); }

            console.log('add item');
            res.send('User add');

            ps.unprepare();
        });
    });
});



function GetThead(tableName, callback) {
    let ps = new mssql.Request(connection);
    let tableNameAndButton = `<td><button type="btn" name="tableName" value="${tableName}" onclick="addData()">Add</button></td><td></td>`;

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

        self.tableRows += '<tr>';
        data.recordset.forEach((row, index) => {
            index != 0 ?
            self.tableRows += `<td><input class="add" type="text" name="add-${row.COLUMN_NAME}" placeholder="${row.COLUMN_NAME}" required /></td>`
            : self.tableRows += tableNameAndButton;
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
        data.recordset.forEach((row, index) => {
            self.tableRows += `<tr>`;
            self.tableRows += `
                <td>
                    <button class="function edit" id="${row.ID}" onclick="editRow(this)"> edit </button> 
                    <button class="function delete" id="${row.ID}" onclick="deleteRow(this)"> delete </button>
                </td>
            `;
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



function GetFields(tableName, callback) {
    let ps = new mssql.Request(connection);

    let self = this;
    self.tableRows = ``;

    let query = `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = '${tableName}';
    `;

    ps.query(query, (err, data) => {
        const fieldsObject = {};
        data.recordset.forEach((row, index) => {
            fieldsObject[index] = row.COLUMN_NAME;
        });

        callback(null, fieldsObject);
    });
}


function GetLastID(tableName, callback) {
    const ps = new mssql.PreparedStatement(connection);

    // Формируем запрос для получения последнего ID
    const query = `
        SELECT MAX(ID) as lastID 
        FROM ${tableName};
    `;

    ps.prepare(query, function(err) {
        if (err) {
            console.error('Ошибка при подготовке запроса:', err);
            return callback(err, null);
        }

        ps.execute({}, function(err, data) {
            if (err) {
                console.error('Ошибка при выполнении запроса:', err);
                return callback(err, null);
            }

            // Получаем последний ID из результата
            const lastID = data.recordset[0].lastID;

            // Освобождаем ресурсы
            ps.unprepare();

            // Возвращаем последний ID через callback
            callback(null, lastID);
        });
    });
}



// ADD
app.post('/add', (req, res) => {
    const data = req.body;

    GetFields(data.tableName, (err, rows) => {
        const ps = new mssql.PreparedStatement(connection);
        const inserts = {};

        console.log(rows);

        // Добавляем параметры для каждой колонки
        Object.keys(rows).forEach((index) => {
            const fieldName = rows[index]; 
            const fieldValue = req.body[fieldName];

            console.log(`${fieldName}: ${fieldValue}`);

            // Определяем тип параметра
            const paramType = typeof fieldValue === 'number' ? mssql.Int : mssql.NVarChar;

            ps.input(fieldName, paramType);

            inserts[fieldName] = fieldValue;
        });

        // Формируем динамический запрос на добавление
        let query = `
    INSERT INTO ${data.tableName} (${Object.keys(rows).slice(1).map(item => rows[item]).join(', ')})
    VALUES (${Object.keys(rows).slice(1).map(item => `@${rows[item]}`).join(', ')});
`;
        console.log(query);
        console.log(inserts);

        executeReq(ps, query, inserts, 'Add item', function(err, result) {
            if (err) { return res.status(500).json({ error: 'Error while adding data', details: err }); }

            GetLastID(data.tableName, (err, lastID) => {
                data.ID = lastID;
                console.log(data.ID);
                res.json(data);
            });
        });
    });
});

// EDIT
app.post('/edit', (req, res) => {
    const data = req.body;

    console.log(data.tableName);

    GetFields(data.tableName, (err, rows) => {
        const ps = new mssql.PreparedStatement(connection);
        const inserts = {};
        
        console.log(rows)

        Object.keys(rows).forEach((index) => {
            const fieldName = rows[index]; 
            const fieldValue = req.body[fieldName];

            console.log(`${fieldName}: ${fieldValue}`);

            // Определяем тип параметра
            const paramType = typeof fieldValue === 'number' ? mssql.Int : mssql.NVarChar;

            ps.input(fieldName, paramType);

            inserts[fieldName] = fieldValue;
        });

        let query = `
            UPDATE ${data.tableName}
            SET ${Object.keys(rows).slice(1).map(item => `${rows[item]}=@${rows[item]}`).join(', ')}
            WHERE ${rows[0]}=@${rows[0]};
        `;
        console.log(query);

        console.log(inserts);

        executeReq(ps, query, inserts, 'Edit item', function(err, result) {
            if (err) { return res.status(500).json({ error: 'Error while adding data', details: err }); }
        });
    });
});

// DEL
app.post('/del', (req, res) => {
    const data = req.body;

    console.log('Received data for deletion:', data);

    if (!data.ID) {
        return res.status(400).json({ error: 'ID not specified' });
    }

    const ps = new mssql.PreparedStatement(connection);
    ps.input('ID', mssql.Int);

    GetFields(data.tableName, (err, rows) => {
        const inserts = { ID: req.body[rows[0]] };
        console.log(inserts);

        let query = `
            DELETE FROM ${data.tableName} WHERE ID = @ID;
        `;

        executeReq(ps, query, inserts, 'Delete item', function(err, result) {
            if (err) { return res.status(500).json({ error: 'Error while adding data', details: err }); }
        });
    });
});


app.get('/products/:brand', function(req, res) {
    const brand = req.params.brand;


    const request = new mssql.Request(connection);
    const query = `
        SELECT Products.* FROM Products JOIN Brands ON Products.brandID = Brands.ID WHERE Brands.name = @brand
    `;
    
    request.input('brand', mssql.VarChar, brand);
    request.query(query, (err, result) => {
        if (err) {
            console.log("Request execution error: ", err);
            return res.send("Error loading data");
        }

        if (result.recordset.length > 0) {
            res.render('products', { brand: brand, products: result.recordset });
        } else {
            res.send("No products found for this brand");
        }
    });
});



app.get('/products/:category', function(req, res) {
    const brand = req.params.brand;


    const request = new mssql.Request(connection);
    const query = `
        SELECT Products.* FROM Products JOIN Gender ON Products.genderID = Gender.ID WHERE Gender.name = @category
    `;
    
    request.input('category', mssql.VarChar, brand);
    request.query(query, (err, result) => {
        if (err) {
            console.log("Request execution error: ", err);
            return res.send("Error loading data");
        }

        if (result.recordset.length > 0) {
            res.render('products', { brand: brand, products: result.recordset });
        } else {
            res.send("No products found for this brand");
        }
    });
});


app.listen(port, function() { 
    console.log('app listening on port ' + port);
});