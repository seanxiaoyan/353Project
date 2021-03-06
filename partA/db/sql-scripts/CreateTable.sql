CREATE TABLE menu (
    Item VARCHAR(50) NOT NULL, 
    Price FLOAT
);


CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(50) NOT NULL,
    items VARCHAR(255) NOT NULL,
    total FLOAT,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(50) DEFAULT 'in progress'
);


CREATE TABLE employees (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

