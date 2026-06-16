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
(1, 'Family ski trip', 2000, 500, '2027-1-25'),
(1, 'Christmas Goal', 800, 100, '2026-12-25');

INSERT INTO income (account_id, income_amount, income_name, payment_date, category, repeat_income, income_frequency, income_repeat_date)
 VALUES 
 (1, 3000, 'Homer Wages', '2026-07-21', 'Salary', TRUE, 'Monthly', '2026-08-21'),
 (3, 200, 'Bart Paperround', '2026-08-01', 'Salary', TRUE, 'Monthly', '2026-09-01');
 
INSERT INTO income (account_id, income_amount, income_name, payment_date, category, repeat_income)
 VALUES 
 (2, 100, 'Laundry for Flanders', '2026-07-24', 'Payment', FALSE),
 (4, 500, 'Lisa Scholarship', '2016-07-23', 'Other', FALSE);

 INSERT INTO bills (account_id, bill_amount, bill_name,     bill_due_date, category,    category_type,         repeat_bill, payment_frequency, bill_repeat_date, paid)
  VALUES 
                    ( 1,         200,    'Cable TV',        '2026-07-15', 'Luxury',     'Entertainment',        TRUE,       'Monthly',          '2026-08-15', FALSE),
                    ( 1,         50,    'Phone Bill',       '2026-07-20', 'Essential',  'Subscription',         TRUE,       'Monthly',          '2026-08-20', FALSE),
                    ( 1,         30,    'Duff Beer',        '2026-07-21', 'Luxury',     'Leisure',              TRUE,       'Monthly',          '2026-08-21', FALSE),
                    ( 1,         300,    'Insurance',       '2026-07-31', 'Essential',  'Subsription',          TRUE,       'Annually',         '2027-07-31', FALSE);

INSERT INTO bills (account_id, bill_amount, bill_name,     bill_due_date, category,    category_type,         repeat_bill, paid)
  VALUES 
                    ( 1,         50,'Bart Grafitti fine',   '2026-07-31', 'Other',      'Negative',             FALSE, FALSE),
                    ( 1,         25,    'Electricity',      '2026-07-18', 'Utilities',  'Home Utility',         FALSE, FALSE),
                    ( 1,         60,    'Shopping',         '2026-07-02', 'Essential',  'Consumable',           FALSE, FALSE),
                    ( 1,         80,    'Hairdressers',     '2026-07-12', 'Luxury',     'Beauty',               FALSE, FALSE);