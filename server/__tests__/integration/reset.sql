TRUNCATE TABLE bills, income, goals, accounts, household RESTART IDENTITY;

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
    payment_date,
    category,
    repeat_income,
    income_frequency,
    income_repeat_date
) VALUES (
    1,
    3000,
    '2026-07-09',
    'Salary',
    TRUE,
    'Monthly',
    '2026-08-09'
);

INSERT INTO bills (
    account_id,
    bill_amount,
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
    '2026-07-09',
    'purchase iphone',
    'retail',
    TRUE,
    'Immediate',
    '2026-06-09',
    FALSE
);