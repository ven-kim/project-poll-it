const express = require('express');
const mysql = require('mysql2');
const db = require('./db/connection');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
var User = require('./user');
const path = require('path');




const PORT = process.env.PORT || 3010;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//adding in peice from video
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
qpp.use(cookieParser());
app.use(session({
  key: 'user_sid',
  secret: 'somesecret',
  resave: false,
  saveUninitialized:
  cookie: {
    expires: 600000
  }

}));

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/layouts'}));
app.set('view engine', 'hbs');

app.use((req, res, next)) => {
  if (req)
}

app.get('/', (req, res) => {
    res.send({message: 'Hello World!'});
});

// Not Found response for unmatched routes
app.use((req, res) => {
    res.status(404).end();
  });

  // Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }); 