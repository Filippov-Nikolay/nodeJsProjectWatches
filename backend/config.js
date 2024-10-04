var mssql = require('mssql');

// Параметры соединения с бд
var config = {
    user: 'admin',                      // пользователь базы данных
    password: 'admin',                  // пароль пользователя 
    server: 'MAINDANYA\\SQLEXPRESS',          // хост
    database: 'Watches',                // имя бд
    port: 1433,                         // порт, на котором запущен sql server
    options: {
        encrypt: true,                  // Использование SSL/TLS
        trustServerCertificate: true    // Отключение проверки самоподписанного сертификата
    },
}

// Connection
var connection = new mssql.ConnectionPool(config); 

var pool = connection.connect(function(err) {
	if (err) console.log(err)
}); 

module.exports = pool; 