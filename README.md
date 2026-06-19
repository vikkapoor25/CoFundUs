# CoFundUs (Group 3 - Library Labs)

# Project Description

## Problem Statement

### What is the Problem?

It can be difficult to manage & understand shared finances across multiple bank accounts.

Many partners use a combination of individual and shared accounts, making it challenging to gain a clear view of their overall financial position.

### Evidence

* Only 23% of Britons passed a financial literacy assessment in 2025 ([The Intermediary](https://theintermediary.co.uk/2026/01/less-than-a-quarter-of-adults-can-pass-a-financial-literacy-test-shepherds-friendly-finds/?utm_source=chatgpt.com)).
* Around 39% of UK adults do not feel confident managing their money ([Financial Capability](https://www.fincap.org.uk/en/articles/key-statistics-on-uk-financial-capability?utm_source=chatgpt.com)).
* 26% of people in relationships manage their finances separately from their partner, equivalent to approximately 8.7 million people across the UK ([Legal & General](https://group.legalandgeneral.com/en/newsroom/press-releases/one-in-four-couples-are-in-a-financial-situationship-sharing-their-lives-but-not-their-bank-balances)).
* Over half of UK couples living together fully combine their finances (55%), meaning a substantial proportion use either separate accounts or a hybrid approach to managing money ([Aegon](https://www.aegon.co.uk/media-centre/news/uk-couples-admit-differing-financial-priorities)).


### Why does it Matter?

Without a clear view of their finances, partners may find it harder to:
* Budget effectively
* Identify savings opportunities
* Achieve shared financial goals

---

## Proposed Solution

### How does the Solution Address the Problem?

We propose developing CoFundUs, an accessable application that would enable couples to share and manage financial information in a way that's easy to understand.

By providing a shared view of financial circumstances and objectives, the application aims to centralise household accounts and transactions in one place, making it easier for users to understand and manage their finances.

### What Value does it Provide?

* All of a couple's individual and shared bank accounts are located and accessable in one location.
* Simplifies the management of household finances, enabling partners to make more informed financial decisions.
* Provides an intuitive and easy-to-use interface, reducing mental load and financial stress.

### How is Success Measured?

The success of the application will be measured through user adoption and evidence of improved financial outcomes:

* Higher reported savings levels among users would suggest that the application is helping users achieve their financial goals.
* Increased adoption of the application indicates that partners are actively using it to manage their finances.

---

## Unique Selling Point

Unlike traditional personal finance applications that focus primarily on individual money management, CoFundUs is designed specifically for partners.

CoFundUs places shared financial management at the centre of the user experience, bringing together individual and shared accounts into a single view.

This provides a clear picture of household finances, enabling users to track spending, monitor progress towards shared goals, and make informed financial decisions together.

# Installation & Usage

## Git Branching Strategy

```text
main
 |__dev
     |__dev-login
     |__frontend
            |__ frontend-login
            |__ frontend-login-test
     |__backend
            |__ backend-login
            |__ backend-login-test
```

## File Structure Diagram **FONTEND ADJUST CLIENT**

```text
assets
    |__ images
client
    |__ __tests__
    |__ api
    |__ app
         |__ (auth)
         |__ (tabs)
    |__ assets
    |__ components
    |__ constants
    |__ app.json
    |__ package.json
server
    |__ __tests__
    |       |__ integration
    |       |__ unit
    |             |__ controllers
    |             |__ models
    |__ controllers
    |__ database
    |__ middleware
    |__ models
    |__ routes
    |__ app.js
    |__ index.js
    |__ package.json
.gitignore
.git 
README    
```

## Git Setup

The Git repository should be initialised from the project's root directory, which contains both the `client` and `server` folders.

All commits for the project would be executed from this location.

### Initialise Git Repositiory

```Bash
git init
```

### Create `.gitignore` File

The `.gitignore` file should be created in the same location as where the git repositiory was initilised (the same location as the `.git` folder). In our case, this would be the project's root directory.

The `.gitignore` should contain the following:

```
node_modules
package-lock.json
.env
coverage
```

This prevents:
- dependencies
- environment variables
- passwords
- database credentials
from being uploaded publically

---

## Frontend Setup (**FONRTEND FILL IN**)

## Backend Setup

### Create and Configure `package.json` File

---

This `package.json` file must be initialised in the server folder so that the packages outlined below could be utilised.

### 1. Initialise Node Project 

Create the `package.json` file:

```Bash
npm init -y
```

### 2. Install Development Dependencies 

```Bash
npm install -D nodemon jest@29.7.0 supertest@6.3.3
```



| Package | Purpose |
| --- | --- |
| `nodemon` | Automatically restarts the server during development.
| `jest` | Runs automated tests |
| `supertest` | Tests API endpoints and HTTP responses |

### 3. Install Main Dependencies

```Bash
npm install express cors pg dotenv jsonwebtoken bcrypt uuid node-fetch
```

| Package | Purpose |
|----------|---------|
| `express` | Creates and manages the API server and routes |
| `cors` | Enables communication between the frontend and backend across different origins |
| `pg` | Connects the Node.js application to a PostgreSQL database |
| `dotenv` | Loads environment variables from a `.env` file |
| `jsonwebtoken` | Creates and verifies JSON Web Tokens (JWTs) for authentication |
| `bcrypt` | Hashes and verifies user passwords securely |
| `uuid` | Generates unique identifiers |
| `node-fetch` | Makes HTTP requests to external APIs |
| `groq-sdk` | Integrates with the Groq API to provide AI-powered features |


### 4. Add Scripts to `package.json`

```JSON
"scripts": {
"test": "jest --testMatch \"**/*.test.js\" --watchAll --detectOpenHandles --runInBand --verbose",
"test-client": "jest client --watchAll --collectCoverage",
"unitTests": "jest --testMatch \"**/*.test.js\" --testPathPattern=/unit/ --watchAll --verbose",
"integrationTests": "jest --testMatch \"**/*.test.js\" --testPathPattern=/integration/ --watchAll --detectOpenHandles --runInBand --verbose",
"coverage": "jest --coverage --testPathPattern=/unit/",
"dev": "nodemon -L ./index.js",
"start": "node ./index.js",
"setup-test-db": "NODE_ENV=test node ./database/setup.js",
"setup-db": "node ./database/setup.js"
}
``` 

Key add-ons include:
* `\"**/*.test.js\"` for all testing scripts means when running `npm run test`, only the files ending in `.test` are run.
* `NODE_ENV=test` is in `setup-test-db` script so that the testing database is used when in `connect.js`, rather the the main database during integration testing.

---

### AWS RDS Database Setup

---

### Phase 1 - Create AWS RDS Database

---

### 1. Create PostgreSQL Database

Login into AWS as an IAM user and navigate to:

```text
AWS Console
↓
RDS
↓
Databases
↓
Create Database
```

### 2. Database Settings

Choose:

```text
Creation Method: Standard Create

Engine: PostgreSQL

Version: PostgreSQL 16

Template: Free Tier
```

### 3. Database Configuration

Configure:

```text
DB Instance Identifier: cofundus-postgres-rds

Master Username: CoFundUser

Master Password: ********
```

### 4. Instance Configuration

Choose:

```text
Instance Type: db.t3.micro

Storage: 20 GB SSD
```

### 5. Initial Database

Set:

```text
Database Name: cofundus_db
```

### 6. Public Access

For development:

```text
Public Access: Yes
```

### Step 6 - Create Database

Click:

```text
Create Database
```

Wait until:

```text
Status:
Available
```

### Phase 2 - Configure Security

### 1. Create a security group:

```text
cofundus-rds-sg
```

### 2. Set Inbound Rules

Your IP address must be added to the inbound security group so that you can access the database.

Inbound Rules:

| Type | Port | Source |
|--------|--------|--------|
| PostgreSQL | 5432 | My IP |

### 3. Set Outbound Rules

Outbound Rules:

```text
Allow All
```
---

### Phase 3 - Connect API

---

### 1. Obtain Connection Details

Navigate to:

```text
RDS
↓
Databases
↓
cofundus-postgres-rds
```

Copy:

```text
Endpoint
```

Example:

```text
cofundus-postgres-rds.xxxxxx.eu-west-2.rds.amazonaws.com
```

Port:

```text
5432
```

**Note:** Before progressing, you can check the database is working as expected by connecting to pgAdmin4.

### 2. Configure Environment Variables

```env
DB_URL=postgresql://cofundus_user:password@cofundus-postgres-rds.xxxxxx.eu-west-2.rds.amazonaws.com:5432/cofundus_db
```

**Note:** The `DB_URL` contains all the information required to connect to the PostgreSQL database, including:

* Username (`cofundus_user`)
* Password (`password`)
* Endpoint (`cofundus-postgres-rds.xxxxxx.eu-west-2.rds.amazonaws.com`)
* Port (`5432`)
* Database name (`cofundus_db`)

Storing these values in a single connection string simplifies database configuration and keeps connection details centralised within the `.env` file.


### 3. Database Connection

in `connect.js`, the database connection must be SSL encrypted

```javascript
require("dotenv").config();
const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.DB_URL,  
  ssl:{
        rejectUnauthorized: false,
      },
});

module.exports = db;
```

From here you can create table structures and insert data.

---

# Technologies **FRONTEND FILL IN**

| Area | Technology / Packages |
|---------|----------------------|
| Database | AWS RDS, PostgreSQL, pgAdmin 4, `pg` |
| Backend API | JavaScript, `express` |
| Authentication | `jsonwebtoken`, `bcrypt` |
| AI Integration | Groq, `groq-sdk` |
| Data Visualisation | Metabase |
| Frontend | React Native, ExpoGo |
| Testing | `jest`, `supertest` |
| Deployment | AWS EC2, Docker |
| Configuration | `dotenv` |
| File Management | `fs` |

---

# Process 

## Page 1 - Register

Purpose: Allows you to create an account 

Register Contains:
Partner 1 Name 
Partner 1 Email (For 2FA)
Partner 2 Name 
Partner 2 Email (For 2FA)
Household Username (needs to be unique)
Household Password

Links to Pages:
Login (on successful account creation)
---

## Page 2 - Login

Purpose: Allows you to login to the application

Login Contains:
Shared Username
Shared Password
Login Button

Links to Pages:
Register (if account isn't yet created)
Home/Dashboard (on successful login)

---

## Page 3 - Home / Dashboard

Purpose: Summarises the overall state of all bank accounts combined (for the month)

Home Contains:
Overall Account Balance
Bar Chart Comparing Overall Income & Bills
Overall Net Gain/Loss (e.g. +£500 is coloured green, -£500 is coloured red)
Overall Upcoming Bills (Anything due within the week e.g. Annual, Monthly, One-Time Bill)
Overall Financial Goals (closest to target date)
NOTE: Dashboard calculated by the month

Links to Pages:
Login (to logout)
Account List (to view specific accounts in more detail)
Upcoming Bills (to view full detail of upcoming bills)
Goals AI1
---

## Page 4 - Bank Accounts List

Purpose: Summarises the state of each bank account (for the month)

Home Contains:
Account Balance
Bar Chart Comparing Income & Bills
Net Gain/Loss (e.g. +£500 is coloured green, -£500 is coloured red)
Add Bank Account Button
Add Income Button

Links to Pages:
Login (to logout)
Home
Add Bank Account (embed in accounts list or a new page)
Add income transaction (embed in accounts list or a new page)

---

## Page 5 - Upcoming Bills List

Purpose: List of all upcoming bills (due within the month)

Upcoming Bills Contains:
Upcoming Bills (Total Amount)
Subscriptions (should all be visible to see)
Annual
Monthly
One-Time Bills 

Links to Pages:
Login (to logout)
Home/Dashboard
Add Bill (embed in bills list or a new page)

---

## Sub-Page 6 - Add Bank Account (or Embed in Account List - Page 4)

Purpose: Adds a bank account to the application in which you can view summaries and add income transactions to.

Add Bank Account Contains:
Account Name: Input
Account Type: Dropdown (e.g. personal, shared)
Starting Balance: Input (account_balance)
Add Account Button

Links to Pages:
Account List (redirected after clicking add account button)

---

## Sub-Page 7 - Add Income (or Embed in Account List - Page 4)

Purpose: To log incomes in specific accounts

Add Income Contains:
Select Account: Dropdown (e.g. Partner 1, Partner 2, Shared etc.)
Payment Frequency: Dropdown (e.g. Immediate, One-Time, Monthly, Annually)
Amount: Input
Category: Dropdown (Stretch Goal)
Date: YYYY/MM/DD
Add Income Button

NOTE: Income categories would be Earned Income, Profit Income, Passive Income etc.
NOTE: repeat to be used in conjunction with payment_frequency in backend

Links to Pages:
Account List (redirected after clicking add income button)

---

## Sub-Page 8 - Add Bill (or Embed in Bills List - Page 5)

Purpose: To log bills in specific accounts

Add Bill Contains:
Select Account: Dropdown (e.g. Partner 1, Partner 2, Shared etc.)
Payment Frequency: Dropdown (e.g. Immediate, One-Time, Monthly, Annually)
Amount: Input
Category: Dropdown (Stretch Goal)
Date: YYYY/MM/DD
Add Bill Button

NOTE: For Bills it would be Essential (e.g. Housing, utilities etc.), Discretionary(e.g. Clothes shopping, eating out etc.), Transport, Health/Fitness etc.

NOTE: The term Bills = Expenditure (anything coming out of your account)

Links to Pages:
Bills List (redirected after clicking add bill button)

---

## Page 9 - Goals AI

Purpose: To get AI generated advice regarding reaching added goal

AI Goals Contains:
Show Created Goal / Progress Bar (see Tooba wireframe)
AI comment regarding reaching your goal (advice)
Recommendations on cost cutting for various bills
Cheaper subscriptions / questions if subscription is being used
Update Goal (Allows you to contribute from account balances to goal)

Links to Pages:
Login (to logout)
Home/Dashboard
Add Goal (embed in bills list or a new page)

NOTE: Try one goal for MVP, if easy, do for multiple
NOTE: Goals are to save for a specific thing / item e.g. an iPhone
NOTE: All financial goals are shared goals

---
## Sub-Page 10 - Add Goal (or Embed in AI - Page 9)

Purpose: Add a goal for a specific account

Add Goal Contains:
Goal Name: Input (e.g. iPhone)
Amount: Input
Target Date: YYYY/MM/DD
Add Goal Button

NOTE: Goals are to save for a specific thing / item e.g. an iPhone
NOTE: All financial goals are shared goals

Links to Pages:
AI Page (after clicking add goal button)


Navbar Contains: Home | Account | Bills | Goals

---

# Deployment (**Thomas Fill in**)

# Successes & Challenges (**Everyone Contribute**)

## Challenges

### AWS Security Groups for RDS Database

Challenge: To access an AWS RDS database from a specific device, the associated security group must contain an inbound rule that allows traffic from the device's public IP address. Initially, the RDS instance was configured as publicly accessible, and we assumed this would allow connections from any device. However, access was still blocked because the security group's inbound rules had not been configured to permit traffic from our IP address.

Resolution: The issue was resolved by adding an inbound rule to the security group, allowing PostgreSQL traffic from the required IP address.

### Finding New Software (**Thomas & Frontend Expand**)

### AI-Generated Incoherent Responses

Challenge: When creating prompts for the `GoalInsight.js` model, responses received from Groq AI were inconsistent. Extra text was sometimes added, breaking the requested response format. Some outputs also repeated information unnecessarily or produced incorrect calculations.

Resolution: To resolve this, the following steps were taken:
* Prompt engineering was used to make the instructions clearer and more restrictive. This included:
  * Defining the role of the AI as a financial advisor.
  * Clearly stating what the AI should and should not include in its responses.
  * Performing calculations before sending data to the AI, so the AI only needed to provide analysis rather than calculate values itself.
* The temperature was set to `0` to reduce randomness and make responses more consistent.

### Frontend Shifting Requriements e.g. Bills (**Tooba & Zehra Expand**)

---

## Successes

### Frontend Delivered a Professional User Experience

The frontend was successfully developed with a clean, intuitive, and visually appealing user interface. The application presents complex financial information in a way that is easy for users to understand and navigate.

### All Backend Routes Successfully Implemented

All planned backend API routes were successfully implemented and tested. This enabled full CRUD functionality across the application and ensured reliable communication between the frontend, backend, and database.

### AI Goal Insights Successfully Integrated

The application successfully integrated Groq AI to generate personalised financial insights and recommendations. Through prompt engineering and response standardisation, consistent and useful outputs were achieved.

### End-to-End Architecture Successfully Delivered

The project successfully integrated React Native, Express, PostgreSQL, AWS RDS, Groq, and Metabase into a single working solution, demonstrating the team's ability to deliver a full-stack application.

### Automated Testing Implemented

Unit and integration tests were implemented using Jest and Supertest, increasing confidence in the reliability and stability of the backend.

### Application Successfully Deployed to AWS

The application was successfully containerised using Docker and deployed to an AWS EC2 instance. This provided a consistent deployment environment and demonstrated the team's ability to move a solution from development into a live hosted environment.

---

# Future Features (**Everyone Contribute**)

### Connect With Banking Account in Real-Time

Track income, bills, goals, individual and shared bank account information in real time.

Alternatively, could scrape info from banking statements

### Adding Differing Numbers of People to a Household

### AI Research into Credit Cards, Bank Accounts etc. GoCompare esque service

### Supplementary functonality e.g. Profile Phtot of couple, background etc. forgot password

### Which bills associated with which person in household

### Take into account dependents (e.g. children ) in some way 

### Financial literacy lessons ?


