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

## Step-By-Step: Dockerising Backend API 

### 1. Create `dockerfile` File and Populate

Create a `dockerfile` and populate it:

```dockerfile
# Uses official Node.js image
FROM node:20

# Sets working directory inside container
WORKDIR /app

# Copies package files first
COPY package*.json ./

# Installs dependencies
RUN npm install

# Copies the rest of the project files
COPY . .

# Exposes the port the app runs on
EXPOSE 3000

# Starts the application
CMD ["npm", "start"]
```

**NOTE:** Must be in the same level as `package.json` and `.env` files.

### 2. Create `.dockerignore` File 

Create `.dockerignore` and add:

```
node_modules
.env
.git
```

This prevents unnecessary/sensitive files being copied into the image.

### 3. Check `package.json` Scripts

We must have access to `npm start`

```JSON
"scripts": {
  "dev": "nodemon -L index.js",
  "start": "node index.js",
  "setup-db": "node ./database/setup.js"
}
```

### 4. Check `index.js` Uses Environment Port

Ensure we are using `process.env.PORT`.

```javascript
require("dotenv").config();

const api = require("./app");

const port = process.env.PORT;

api.listen(port, () => {
    console.log(`API listening on ${port}`);
})
```

### 4.5. Before Progressing (Project Specific)

We must ensure our `.env` has everything in it:
- DB_URL
- PORT
- GROQ_API_KEY
- SECRET_TOKEN
NOTE: Convene as group and decide
We must ensure AWS RDS Database is public
The one generating the container must have the ip address of their laptop in an AWS RDS security group

### 5. Build Docker Image

```Bash
docker build -t snacks-api .
```
where:
- `docker build` creates the Image
- `-t snacks-api` names the Image
- ` .` uses the current folder to create image

### 6. Run Docker Container

```Bash
docker run --env-file .env -p 3000:3000 snacks-api
```

where:
- `--env-file .env` passes environment variables into the container 
- `-p 3000:3000` connects local port 3000 to container port 3000
- `countries-api` references image name

### 7. Test API

In HTTPie:

```
http://localhost:3000/snacks
```

If it works, your containerised API is successfully talking to Supabase.

### 8. Stop Container

Find running containers:

```Bash
docker ps
```

Stop container from running:

```Bash
docker stop <container_id>
```
