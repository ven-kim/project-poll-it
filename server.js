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
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/layouts'}));
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user){
    res.clearCookie('user_sid');
  }
  next();
});

const hbsContent = {userName: '', loggedin: false, title: "You are not logged in today", body: "Hello world"};

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
  
      res.redirect('/dashboard');
  } else {
      next();
  }    
};

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
  res.redirect('/login');
});


// route for user signup
app.route('/signup')
  //.get(sessionChecker, (req, res) => {
  .get((req, res) => {
      //res.sendFile(__dirname + '/public/signup.html');
      res.render('signup', hbsContent);
  })
  .post((req, res) => {
      User.create({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
      })
      .then(user => {
          req.session.user = user.dataValues;
          res.redirect('/dashboard');
      })
      .catch(error => {
          res.redirect('/signup');
      });
  });


// route for user Login
app.route('/login')
  .get(sessionChecker, (req, res) => {
      //res.sendFile(__dirname + '/public/login.html');
      res.render('login', hbsContent);
  })
  .post((req, res) => {
      var username = req.body.username,
          password = req.body.password;

      User.findOne({ where: { username: username } }).then(function (user) {
          if (!user) {
              res.redirect('/login');
          } else if (!user.validPassword(password)) {
              res.redirect('/login');
          } else {
              req.session.user = user.dataValues;
              res.redirect('/dashboard');
          }
      });
  });


// route for user's dashboard
app.get('/dashboard', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
  hbsContent.loggedin = true; 
  hbsContent.userName = req.session.user.username; 
  //console.log(JSON.stringify(req.session.user)); 
  console.log(req.session.user.username); 
  hbsContent.title = "You are logged in"; 
      //res.sendFile(__dirname + '/public/dashboard.html');
      res.render('index', hbsContent);
  } else {
      res.redirect('/login');
  }
});


// route for user logout
app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
  hbsContent.loggedin = false; 
  hbsContent.title = "You are logged out!"; 
      res.clearCookie('user_sid');
  console.log(JSON.stringify(hbsContent)); 
      res.redirect('/');
  } else {
      res.redirect('/login');
  }
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));


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