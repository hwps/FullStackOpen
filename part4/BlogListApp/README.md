Express + MongoDB backend for blog list app

FullStackOpen MOOC assignment 4.1 - 4.23.

Uses Mongoose for MongoDB access + Jest and SuperTest for tests. 
(Work started before FullStackOpen part4 switched over to Node Testrunner)

Set environment variables in .env:
MONGODB_URI=<database>
TEST_MONGODB_URI=<test database>
PORT=<port>
SECRET=<<password string for OAuth token>

Run with
```
$ npm start````

or

``` 
$ npm run dev```

(dev uses nodemon for hot reloading)

Run tests with
```
$ npm test```
