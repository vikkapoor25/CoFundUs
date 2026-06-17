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
    twofa_code VARCHAR(10),
    twofa_expires_at TIMESTAMP,
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
    current_value INT DEFAULT 0,
    target_date DATE,
    PRIMARY KEY (goal_id),
    FOREIGN KEY (household_id) REFERENCES household(household_id)
);

CREATE TABLE income (
    income_id INT GENERATED ALWAYS AS IDENTITY,
    account_id INT NOT NULL,
    income_name VARCHAR(50) NOT NULL, 
    income_amount INT NOT NULL,
    payment_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    repeat_income BOOLEAN NOT NULL,
    payment_frequency VARCHAR(50),
    income_repeat_date DATE,
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

INSERT INTO household ( household_username, household_password, name_1, name_2, email_1, email_2) 
VALUES 
( 'Simpsons', '$2a$12$iXa/5RG5GY5pvOrXGXcC3eRANRQYJF7NXkSGDEAMJdRXVTwk1Axba', 'Marge', 'Homer', 'm.simpson@hotmail.com', 'homer.s@burns.us');

INSERT INTO accounts (household_id, account_name, account_balance, account_type, allocated_to_goal)
VALUES 
(1, 'First Bank of Springfield', 20000, 'Joint', 400), 
(1, 'Burns Banking', 5000, 'Marge Investment', 0),
(1, 'Sideshow Bob Building Society', 10000, 'Homer Personal', 300),
(1, 'Snowball Securities', 2000, 'Marge Personal', 100);

INSERT INTO goals (household_id, goal_name, goal_amount, current_value, target_date) 
VALUES 
(1, 'New Saxophone', 500, 200, '2026-08-21'),
(1, 'Family Ski Trip', 2000, 500, '2027-01-25'),
(1, 'Christmas Goal', 800, 100, '2026-12-25');

INSERT INTO income (account_id, income_amount, income_name, payment_date, category, repeat_income, payment_frequency, income_repeat_date)
 VALUES
 (1, 3000, 'Homer Wages', '2026-06-21', 'Salary', TRUE, 'Monthly', '2026-08-21'),
 (3, 200, 'Bart Paperound', '2026-06-01', 'Salary', TRUE, 'Monthly', '2026-07-01');
 
INSERT INTO income (account_id, income_amount, income_name, payment_date, category, repeat_income)
 VALUES 
 (2, 100, 'Laundry for Flanders', '2026-06-24', 'Payment', FALSE),
 (4, 500, 'Lisa Scholarship', '2026-06-23', 'Other', FALSE);

 INSERT INTO bills (account_id, bill_amount, bill_name,     bill_due_date, category,    category_type,         repeat_bill, payment_frequency, bill_repeat_date, paid)
  VALUES
                    ( 1,         200,    'Cable TV',        '2026-06-15', 'Luxury',     'Entertainment',        TRUE,       'Monthly',          '2026-07-15', TRUE),
                    ( 1,         50,    'Phone Bill',       '2026-06-20', 'Essential',  'Subscription',         TRUE,       'Monthly',          '2026-07-20', FALSE),
                    ( 1,         30,    'Duff Beer',        '2026-06-21', 'Luxury',     'Leisure',              TRUE,       'Monthly',          '2026-07-21', FALSE),
                    ( 1,         300,    'Insurance',       '2026-06-30', 'Essential',  'Subscription',         TRUE,       'Annually',         '2027-07-31', FALSE),
                    ( 1,         2000,    'Mortgage',        '2026-06-16', 'Essential',  'Debts',               TRUE,       'Monthly',          '2026-07-15', TRUE),
                    ( 1,         40,    'Water Bill',       '2026-06-20', 'Utilities',  'Home Utility',         TRUE,       'Monthly',          '2026-07-20', FALSE),
                    ( 1,         200,    'Electricity',        '2026-06-21', 'Utilities',   'Home Utility',      TRUE,       'Monthly',          '2026-07-21', FALSE),
                    ( 1,         300,    'Medical Insurance', '2026-06-28', 'Essential',  'Subscription',       TRUE,       'Monthly',         '2027-07-31', FALSE);


INSERT INTO bills (account_id, bill_amount, bill_name,     bill_due_date, category,    category_type,         repeat_bill, paid)
  VALUES
                    ( 1,         50,'Bart Grafitti fine',   '2026-06-29', 'Other',      'Negative',             FALSE, FALSE),
                    ( 1,         25,    'Car Repairs',      '2026-06-22', 'Other',      'Negative',             FALSE, FALSE),
                    ( 1,         60,    'Kwik-E-Mart',         '2026-06-02', 'Essential',  'Consumable',           FALSE, TRUE),
                    ( 1,         80,    'Hairdressers',     '2026-06-12', 'Luxury',     'Beauty',               FALSE, TRUE),
                    ( 1,         50,'School Fundraiser',    '2026-06-30', 'Other',      'Education',            FALSE, FALSE),
                    ( 1,         25,    'Legal Fees',       '2026-06-20', 'Essential',  'Other',                FALSE, FALSE),
                    ( 1,         60,    'Kwik-E-Mart',         '2026-06-21', 'Essential',  'Consumable',           FALSE, FALSE),
                    ( 1,         80,    'Hairdressers',     '2026-06-12', 'Luxury',     'Beauty',               FALSE, TRUE);