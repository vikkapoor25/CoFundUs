DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS income;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS household;

CREATE TABLE household (
    household_id INT GENERATED ALWAYS AS IDENTITY,
    household_username VARCHAR(50) NOT NULL UNIQUE,
    household_password VARCHAR(100) NOT NULL,
    name_1 VARCHAR(30) NOT NULL,
    name_2 VARCHAR(30) NOT NULL,
    email_1 VARCHAR(50) NOT NULL,
    email_2 VARCHAR(50) NOT NULL,
    PRIMARY KEY (household_id)
);

CREATE TABLE accounts (
    account_id INT GENERATED ALWAYS AS IDENTITY,
    household_id INT NOT NULL,
    account_name VARCHAR(50) NOT NULL,
    account_balance INT NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    allocated_to_goal INT,
    PRIMARY KEY (account_id),
    FOREIGN KEY (household_id) REFERENCES household(household_id)
);

CREATE TABLE goals (
    goal_id INT GENERATED ALWAYS AS IDENTITY,
    household_id INT NOT NULL,
    goal_name VARCHAR(50) NOT NULL,
    goal_amount INT NOT NULL,
    current_value INT NOT NULL,
    target_date DATE,
    PRIMARY KEY (goal_id),
    FOREIGN KEY (household_id) REFERENCES household(household_id)
);

CREATE TABLE income (
    income_id INT GENERATED ALWAYS AS IDENTITY,
    income_name VARCHAR(50) NOT NULL,
    account_id INT NOT NULL,
    income_amount INT NOT NULL,
    payment_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    repeat_income BOOLEAN NOT NULL,
    payment_frequency VARCHAR(50) NOT NULL,
    income_repeat_date DATE NOT NULL,
    PRIMARY KEY (income_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

CREATE TABLE bills (
    bill_id INT GENERATED ALWAYS AS IDENTITY,
    bill_name VARCHAR(50) NOT NULL,
    account_id INT NOT NULL,
    bill_amount INT NOT NULL,
    bill_due_date DATE DEFAULT CURRENT_DATE,
    category VARCHAR(50) NOT NULL,
    category_type VARCHAR(50),
    repeat_bill BOOLEAN NOT NULL,
    payment_frequency VARCHAR(50),
    bill_repeat_date DATE,
    paid BOOLEAN DEFAULT false,
    PRIMARY KEY (bill_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

INSERT INTO household (
    household_username,
    household_password,
    name_1,
    name_2,
    email_1,
    email_2
) VALUES (
    'test',
    'test123',
    'test1',
    'test2',
    'test1@mail.com',
    'test2@mail.com'
);

INSERT INTO accounts (
    household_id,
    account_name,
    account_balance,
    account_type,
    allocated_to_goal
) VALUES (
    1,
    'married',
    20000,
    'shared',
    200
), (
    1,
    'savings',
    5000,
    'personal',
    0
);

INSERT INTO goals (
    household_id,
    goal_name,
    goal_amount,
    current_value,
    target_date
) VALUES (
    1,
    'iphone',
    500,
    200,
    '2026-08-09'
);

INSERT INTO income (
    account_id,
    income_amount,
    income_name,
    payment_date,
    category,
    repeat_income,
    payment_frequency,
    income_repeat_date
) VALUES (
    1,
    3000,
    'Salary',
    '2026-07-09',
    'Salary',
    TRUE,
    'Monthly',
    '2026-08-09'
);

INSERT INTO bills (
    account_id,
    bill_amount,
    bill_name,
    bill_due_date,
    category,
    category_type,
    repeat_bill,
    payment_frequency,
    bill_repeat_date,
    paid
) VALUES (
    1,
    200,
    'Purchased iPhone',
    '2026-07-09',
    'Commercial',
    'Retail',
    TRUE,
    'Immediate',
    '2026-06-09',
    FALSE
);