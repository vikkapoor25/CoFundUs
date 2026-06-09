NOTE: `.git`, `package.json` and `requirements.txt` will all be created in the project root (outside client and server folders)

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