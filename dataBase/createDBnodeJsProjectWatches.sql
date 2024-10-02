USE master
GO

-- Создание базы данных Watches
IF DB_ID('watches') IS NULL
BEGIN
CREATE DATABASE Watches;
END
GO


-- Использование базы данных Watches
BEGIN
USE Watches;
END
GO


-- Таблица Users
BEGIN
CREATE TABLE Users (
    ID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    login NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(100) NOT NULL
);
END

-- Вставка данных в таблицу Users
INSERT INTO Users (login, email, password)
VALUES 
('user1', 'user1@example.com', 'password123'),
('user2', 'user2@example.com', 'password123');


-- Таблица Admins
BEGIN
CREATE TABLE Admins (
    ID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    login NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(100) NOT NULL
);
END

-- Вставка данных в таблицу Admins
INSERT INTO Admins (login, email, password)
VALUES 
('admin1', 'admin1@example.com', 'adminpass'),
('admin2', 'admin2@example.com', 'adminpass');



-- Таблица Brands
BEGIN
CREATE TABLE Brands (
    ID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    name NVARCHAR(100) NOT NULL UNIQUE
);
END

-- Вставка данных в таблицу Brands
INSERT INTO Brands (name)
VALUES 
('Samsung'),
('Lenovo'),
('Apple'),
('Alfex');



-- Таблица Products
BEGIN
CREATE TABLE Products (
    ID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    name NVARCHAR(100) NOT NULL,
    price INT NOT NULL,
    description TEXT,
    discount INT CHECK (discount >= 0 AND discount <= 100),
    brandID INT FOREIGN KEY REFERENCES Brands(ID) 
);
END

-- Вставка данных для бренда Samsung
INSERT INTO Products (name, price, description, discount, brandID)
VALUES 
('Samsung Galaxy Watch 4', 200, 'Умные часы с AMOLED-дисплеем и мониторингом сна', 0, (SELECT ID FROM Brands WHERE name = 'Samsung')),
('Samsung Galaxy Watch 3', 180, 'Часы с поддержкой LTE и встроенным пульсометром', 0, (SELECT ID FROM Brands WHERE name = 'Samsung')),
('Samsung Gear S3 Frontier', 250, 'Часы с поддержкой GPS и водонепроницаемостью', 0, (SELECT ID FROM Brands WHERE name = 'Samsung')),
('Samsung Galaxy Fit 2', 80, 'Фитнес-браслет с мониторингом активности и пульса', 0, (SELECT ID FROM Brands WHERE name = 'Samsung')),
('Samsung Galaxy Watch Active 2', 220, 'Легкие и стильные умные часы для фитнеса', 0, (SELECT ID FROM Brands WHERE name = 'Samsung'));

-- Вставка данных для бренда Lenovo
INSERT INTO Products (name, price, description, discount, brandID)
VALUES 
('Lenovo Watch 9', 90, 'Гибридные часы с аналоговым дисплеем и шагомером', 0, (SELECT ID FROM Brands WHERE name = 'Lenovo')),
('Lenovo Watch X', 130, 'Умные часы с водонепроницаемостью и мониторингом пульса', 0, (SELECT ID FROM Brands WHERE name = 'Lenovo')),
('Lenovo Watch S', 100, 'Гибридные часы с кожаным ремешком и 15-дневной автономностью', 0, (SELECT ID FROM Brands WHERE name = 'Lenovo')),
('Lenovo Carme HW25P', 50, 'Фитнес-трекер с сенсорным экраном и уведомлениями' , 0, (SELECT ID FROM Brands WHERE name = 'Lenovo')),
('Lenovo E1', 60, 'Фитнес-часы с цветным дисплеем и контролем пульса', 0, (SELECT ID FROM Brands WHERE name = 'Lenovo'));

-- Вставка данных для бренда Apple
INSERT INTO Products (name, price, description, discount, brandId)
VALUES 
('Apple Watch SE', 300, 'Доступные умные часы с функциями фитнеса и уведомлениями', 0, (SELECT ID FROM Brands WHERE name = 'Apple')),
('Apple Watch Series 7', 550, 'Умные часы с большим экраном и функцией электрокардиограммы', 0, (SELECT ID FROM Brands WHERE name = 'Apple')),
('Apple Watch Series 6', 450, 'Часы с мониторингом кислорода в крови и водонепроницаемостью', 0, (SELECT ID FROM Brands WHERE name = 'Apple')),
('Apple Watch Series 5', 400, 'Умные часы с Always-On дисплеем и функцией экстренных вызовов', 0, (SELECT ID FROM Brands WHERE name = 'Apple')),
('Apple Watch Nike', 350, 'Часы для любителей бега с уникальным дизайном и ремешком', 0, (SELECT ID FROM Brands WHERE name = 'Apple'));

-- Вставка данных для бренда Alfex
INSERT INTO Products (name, price, description, discount, brandId)
VALUES 
('Alfex 5708', 400, 'Швейцарские часы с лаконичным дизайном и сапфировым стеклом', 0, (SELECT ID FROM Brands WHERE name = 'Alfex')),
('Alfex 5622', 350, 'Стильные часы с кожаным ремешком и водозащитой 50 метров', 0, (SELECT ID FROM Brands WHERE name = 'Alfex')),
('Alfex 5532', 500, 'Швейцарские наручные часы с механизмом кварца и стальным корпусом', 0, (SELECT ID FROM Brands WHERE name = 'Alfex')),
('Alfex 5710', 450, 'Часы премиум-класса с классическим циферблатом и механизмом Swiss Quartz', 0, (SELECT ID FROM Brands WHERE name = 'Alfex')),
('Alfex 5723', 420, 'Элегантные швейцарские часы с минималистичным дизайном и точным механизмом', 0, (SELECT ID FROM Brands WHERE name = 'Alfex'));



-- Таблица Basket
BEGIN
CREATE TABLE Basket (
    ID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    quantity INT NOT NULL DEFAULT 1,
    userID INT FOREIGN KEY REFERENCES Users(ID),
    productID INT FOREIGN KEY REFERENCES Products(ID)
);
END
