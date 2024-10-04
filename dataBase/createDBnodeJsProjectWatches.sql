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
('Apple'),
('Alfex'),
('Carnival'),
('Curren'),
('Orkina'),
('CHEETAH'),
('Skmei'),
('Megalith'),
('WISHDOIT'),
('Womage'),
('Oxa'),
('SMAEL'),
('GT'),
('GA'),
('Sanda'),
('Casio'),
('GENEVA');

-- Таблица Gender
BEGIN
CREATE TABLE Gender (
    ID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    name NVARCHAR(100) NOT NULL UNIQUE
);
END

INSERT INTO Gender (name) 
VALUES 
('Men'),
('Women');

-- Таблица Types
CREATE TABLE Types (
    ID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    name NVARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO Types (name) 
VALUES 
('Classic'),
('Sports'),
('Elite');


-- Таблица Products
BEGIN
CREATE TABLE Products (
    ID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    name NVARCHAR(100) NOT NULL,
    price INT NOT NULL,
    description TEXT,
    discount INT CHECK (discount >= 0 AND discount <= 100),
    brandID INT FOREIGN KEY REFERENCES Brands(ID),
    genderID INT FOREIGN KEY REFERENCES Gender(ID),
    typesID INT FOREIGN KEY REFERENCES Types(ID),
    imagePath NVARCHAR(255)
);
END

-- Вставка данных для бренда Samsung
INSERT INTO Products (name, price, description, discount, brandID, genderID, typesID, imagePath)
VALUES 
('Samsung Galaxy Watch 4', 200, 'Умные часы с AMOLED-дисплеем и мониторингом сна', 0, (SELECT ID FROM Brands WHERE name = 'Samsung'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Sports'), '/img/Samsung/1.png'),
('Samsung Galaxy Watch 3', 180, 'Часы с поддержкой LTE и встроенным пульсометром', 0, (SELECT ID FROM Brands WHERE name = 'Samsung'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Sports'), '/img/Samsung/2.png'),
('Samsung Gear S3 Frontier', 250, 'Часы с поддержкой GPS и водонепроницаемостью', 0, (SELECT ID FROM Brands WHERE name = 'Samsung'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Sports'), '/img/Samsung/3.png'),
('Samsung Galaxy Fit 2', 80, 'Фитнес-браслет с мониторингом активности и пульса', 0, (SELECT ID FROM Brands WHERE name = 'Samsung'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Sports'), '/img/Samsung/4.png'),
('Samsung Galaxy Watch Active 2', 220, 'Легкие и стильные умные часы для фитнеса', 0, (SELECT ID FROM Brands WHERE name = 'Samsung'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Sports'), '/img/Samsung/5.png');


-- Вставка данных для бренда Apple
INSERT INTO Products (name, price, description, discount, brandId, genderID, typesID, imagePath)
VALUES 
('Apple Watch SE', 300, 'Доступные умные часы с функциями фитнеса и уведомлениями', 0, (SELECT ID FROM Brands WHERE name = 'Apple'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Elite'), '/img/Apple/1.png'),
('Apple Watch Series 7', 550, 'Умные часы с большим экраном и функцией электрокардиограммы', 0, (SELECT ID FROM Brands WHERE name = 'Apple'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/Apple/2.png'),
('Apple Watch Nike', 450, 'Часы с мониторингом кислорода в крови и водонепроницаемостью', 0, (SELECT ID FROM Brands WHERE name = 'Apple'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Sports'), '/img/Apple/3.png'),
('Apple Watch Series 5', 400, 'Умные часы с Always-On дисплеем и функцией экстренных вызовов', 0, (SELECT ID FROM Brands WHERE name = 'Apple'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Elite'), NULL),
('Apple Watch Series 6', 350, 'Часы для любителей бега с уникальным дизайном и ремешком', 0, (SELECT ID FROM Brands WHERE name = 'Apple'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Classic'), NULL);

-- Вставка данных для бренда Alfex
INSERT INTO Products (name, price, description, discount, brandId, genderID, typesID, imagePath)
VALUES 
('Alfex 5708', 400, 'Швейцарские часы с лаконичным дизайном и сапфировым стеклом', 0, (SELECT ID FROM Brands WHERE name = 'Alfex'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/Alfex/1.png'),
('Alfex 5622', 350, 'Стильные часы с кожаным ремешком и водозащитой 50 метров', 0, (SELECT ID FROM Brands WHERE name = 'Alfex'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/Alfex/2.png'),
('Alfex 5532', 500, 'Швейцарские наручные часы с механизмом кварца и стальным корпусом', 0, (SELECT ID FROM Brands WHERE name = 'Alfex'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/Alfex/3.png'),
('Alfex 5710', 450, 'Часы премиум-класса с классическим циферблатом и механизмом Swiss Quartz', 0, (SELECT ID FROM Brands WHERE name = 'Alfex'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/Alfex/4.png'),
('Alfex 5723', 420, 'Элегантные швейцарские часы с минималистичным дизайном и точным механизмом', 0, (SELECT ID FROM Brands WHERE name = 'Alfex'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/Alfex/5.png');

-- Вставка данных для other brand
INSERT INTO Products (name, price, description, discount, brandId, genderID, typesID, imagePath)
VALUES 
('Carnival 4543', 550, 'Элегантные часы с классическим дизайном, подчеркивающие ваш стиль на деловых встречах. Корпус из нержавеющей стали с отделкой под золото и изысканный циферблат делают их идеальными для вечерних мероприятий.', 0, (SELECT ID FROM Brands WHERE name = 'Carnival'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/ManWatches/7.png'),
('SANDA BOX', 370, 'Стильные часы с уникальным дизайном, объединяющие современный и классический стили. Идеальны для повседневной носки и выделения вашей индивидуальности на торжественных мероприятиях.', 0, (SELECT ID FROM Brands WHERE name = 'Curren'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/ManWatches/2.png'),
('Skmei 1617', 620, 'Часы с оригинальным дизайном и ярким циферблатом, которые делают вас центром внимания. Кожаный ремешок и точный механизм подчеркивают их высокое качество.', 0, (SELECT ID FROM Brands WHERE name = 'Skmei'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/ManWatches/6.png'),
('GT Sport', 490, 'Премиум-часы для истинных ценителей стиля. Их классический циферблат и механизм Swiss Quartz гарантируют точность и долговечность.', 0, (SELECT ID FROM Brands WHERE name = 'GT'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Sports'), '/img/ManWatches/4.png'),
('Casio G-Shock', 480, 'Невероятно прочные часы, которые подойдут как для офисного стиля, так и для активного отдыха. Они станут идеальным подарком для мужчин, ценящих качество и надежность.', 0, (SELECT ID FROM Brands WHERE name = 'Casio'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/EliteWatches/4.png'),
('Sanda 6008 Black', 520, 'Элегантные швейцарские часы с минималистичным дизайном, идеально подходящие для делового стиля. Точный механизм и стильный вид делают их незаменимыми в вашем гардеробе.', 0, (SELECT ID FROM Brands WHERE name = 'Alfex'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Sports'), '/img/EliteWatches/3.png'),
('Skmei Amigo', 510, 'Швейцарские часы с минималистичным дизайном, создающие элегантный образ. Идеальны как для работы, так и для вечерних встреч.', 0, (SELECT ID FROM Brands WHERE name = 'Skmei'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Sports'), '/img/index-SportsManWatches/1.png'),
('GA1100', 530, 'Уникальные швейцарские часы с выразительным дизайном, которые подчеркнут вашу индивидуальность и стиль. Качественные материалы обеспечивают долговечность и надежность.', 0, (SELECT ID FROM Brands WHERE name = 'Geneva'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/EliteWatches/5.png'),
('Geneva Business', 550, 'Элегантные швейцарские часы с минималистичным дизайном. Идеально подходят для деловых встреч и подчеркивают ваш профессионализм.', 0, (SELECT ID FROM Brands WHERE name = 'Geneva'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/EliteWatches/1.png'),
('Curren Panama', 490, 'Стильные часы с простым, но элегантным дизайном. Идеальны для любого случая, добавляют утонченности и стиля вашему образу.', 0, (SELECT ID FROM Brands WHERE name = 'Curren'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/EliteWatches/2.png'),
('Orkina Master', 500, 'Швейцарские часы с минималистичным дизайном и точным механизмом. Они станут вашим надежным спутником в любых жизненных ситуациях.', 0, (SELECT ID FROM Brands WHERE name = 'Orkina'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/index-ClassicWomenWatches/5.png'),
('CHEETAH MARS', 480, 'Элегантные часы с изысканным дизайном, идеально подходящие для вечерних мероприятий. Они добавят изысканности в любой ваш наряд.', 0, (SELECT ID FROM Brands WHERE name = 'Alfex'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Elite'), '/img/index-SportsManWatches/2.png'),
('WISHDOIT BAKS', 490, 'Уникальные часы с минималистичным дизайном, которые подойдут для повседневной носки и добавят стиля вашему образу.', 0, (SELECT ID FROM Brands WHERE name = 'WISHDOIT'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Classic'), '/img/index-SportsManWatches/3.png'),
('JARAGAR', 500, 'Элегантные часы с современным дизайном и качественным механизмом. Идеальны для активных людей, стремящихся к успеху.', 0, (SELECT ID FROM Brands WHERE name = 'Orkina'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Elite'), '/img/index-ClassicWomenWatches/2.png'),
('Skmei 6543', 510, 'Стильные швейцарские часы с уникальным дизайном. Они станут отличным дополнением к любому образу.', 0, (SELECT ID FROM Brands WHERE name = 'Skmei'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Elite'), '/img/index-ClassicWomenWatches/1.png'),
('Megalith', 530, 'Элегантные часы с высоким качеством исполнения. Их классический дизайн делает их подходящими для любого случая.', 0, (SELECT ID FROM Brands WHERE name = 'Megalith'), (SELECT ID FROM Gender WHERE name = 'Men'), (SELECT ID FROM Types WHERE name = 'Elite'), '/img/index-ClassicWomenWatches/6.png'),
('Carnival Grand', 540, 'Изысканные часы с современным дизайном, которые подчеркнут ваш статус и стиль. Идеально подходят для деловых встреч и торжественных мероприятий.', 0, (SELECT ID FROM Brands WHERE name = 'Carnival'), (SELECT ID FROM Gender WHERE name = 'Women'), (SELECT ID FROM Types WHERE name = 'Elite'), '/img/index-ClassicWomenWatches/1.png');



-- Таблица Basket
BEGIN
CREATE TABLE Basket (
    ID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    quantity INT NOT NULL DEFAULT 1,
    userID INT FOREIGN KEY REFERENCES Users(ID),
    productID INT FOREIGN KEY REFERENCES Products(ID)
);
END


