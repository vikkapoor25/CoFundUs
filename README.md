# CoFundUs (Group 3 - Library Labs)

# Background

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

___

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

___

## Unique Selling Point

Unlike traditional personal finance applications that focus primarily on individual money management, CoFundUs is designed specifically for partners.

While many personal finance applications offer limited features for couples, CoFundUs places shared financial management at the centre of the user experience rather than treating it as an additional feature.

By bringing together individual and shared accounts into a single view, CoFundUs provides a clear picture of household finances, enabling users to track spending, monitor progress towards shared goals, and make informed financial decisions together.

# Git Branching Strategy

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

Get remote repo
```Bash
git clone <git-URL>
```

Get specific branch 
```Bash
git pull origin <branch-name>
```

Push branch back into remote repo
```Bash
git push 
```

# Git Setup

1. git init
2. Create .gitignore

```
node_modules
package-lock.json
.env
coverage
```
# Javascript Setup

0. npm init -y

1. npm install -D nodemon 

2. npm install express cors pg dotenv

3. npm install jest@29.7.0 supertest@6.3.3

4. npm install jsonwebtoken bcrypt uuid node-fetch  

Breakdown:
- jsonwebtoken => Used to create and verify JWTs
- bcrypt => Used for hashing passwords before storing them in a database
- uuid => Used to generate universally unique identifiers
- node-fetch => Allows a Node.js application to make HTTP requests to other APIs.

5. package.json scripts

"scripts": {
    "test": "jest --watchAll --detectOpenHandles --runInBand --verbose",
    "test-client": "jest client --watchAll --collectCoverage",
    "unitTests": "jest --testPathPattern=/unit/ --watchAll --verbose",
    "integrationTests": "jest --testPathPattern=/integration/ --watchAll --detectOpenHandles --runInBand --verbose",
    "coverage": "jest --coverage --testPathPattern=/unit/",
    "dev": "nodemon -L server/index.js",
    "start": "node server/index.js",
    "setup-db": "node ./server/database/setup.js"
}

# Python Setup

1. Create .gitignore

```
__pycache__/
*.pyc
.env
.venv/
venv/
.coverage
htmlcov/
.pytest_cache/
```
where:
`__pycache__` → Python compiled files
`*.pyc` → Python bytecode
`.env` → Environment variables
`venv / .venv` → Virtual environment
`.coverage` → Coverage reports
`htmlcov` → Coverage HTML output
`.pytest_cache` → Pytest cache

2. Create Virtual Environment and activate

Create:

```Bash
python -m venv .venv
```

Activate (Linux/Mac)

```Bash
source .venv/bin/activate
```

3. Install Flask Dependencies

```Bash
pip install flask flask-cors python-dotenv
```

where:
`flask` → Web framework (similar to Express)
`flask-cors` → Allows requests from frontend applications
`python-dotenv` → Loads environment variables from .env

4. Install Testing Libraries

```Bash
pip install pytest pytest-cov
```

where:
`pytest` → Test framework (similar to Jest)
`pytest-cov` → Coverage reporting

5. Install Gemini SDK

```Bash
pip install google-genai
```

Allows our python application to communication with Google's Gemini AI without having to manually make HTTP requests

6. Save Dependencies

Equivalent of `package.json`

```Bash
pip freeze > requirements.txt
```

Anyone can install with:

```Bash
pip install -r requirements.txt
```

7. Run project with `python server/app.py`
