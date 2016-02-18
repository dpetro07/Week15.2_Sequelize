var express = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('rcb_sequelize', 'root');

var PORT = process.env.NODE_ENV || 3000;

var app = express();

var Note = sequelize.define('Note', {
  title: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: {
        args: [1, 10],
        msg: "Please enter a title that isn't TOO long"
      }
    }
  },
  body: {
    type: Sequelize.TEXT,
    validate: {
      check: function(bodyVal) {
        if(bodyVal === "jimmy") {
          throw new Error("Nobody likes jimmy");
        }
      }
    }
  }
});

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));


app.get('/', function(req, res) {
  Note.findAll().then(function(notes) {
    res.render('home', {
      notes: notes
    });
  });
});
//
// app.post('/register', function(req, res) {
//   User.create(req.body).then(function(user) {
//     req.session.authenticated = user;
//     res.redirect('/success');
//   }).catch(function(err) {
//     res.redirect('/?msg=' + err.message);
//   });
// });
//
// app.post('/login', function(req, res) {
//   var email = req.body.email;
//   var password = req.body.password;
//
//   User.findOne({
//     where: {
//       email: email,
//       password: password
//     }
//   }).then(function(user) {
//     if(user) {
//       req.session.authenticated = user;
//       res.redirect('/success');
//     } else {
//       res.redirect('/?msg=You failed at life');
//     }
//   }).catch(function(err) {
//     throw err;
//   });
// });
//
// app.get('/success', function(req, res, next) {
//   if(req.session.authenticated) {
//     next();
//   } else {
//     res.redirect("/?msg=Must be authed");
//   }
// }, function(req, res) {
//   res.send('YOU GOT IT! ' + req.session.authenticated.firstname);
// });
//
// app.get('/persons', function(req, res) {
//   Person.findAll({
//     include: [{
//       model: AlterEgo
//     }]
//   }).then(function(people) {
//     res.render('person', {
//       people: people
//     })
//   });
// });
//
// app.post('/persons', function(req, res) {
//   Person.create(req.body).then(function() {
//     res.redirect('/persons');
//   });
// });
//
// app.post('/alteregos/:PersonId', function(req, res) {
//   AlterEgo.create({
//     superhero: req.body.superhero,
//     PersonId: req.params.PersonId
//   }).then(function() {
//     res.redirect('/persons');
//   });
// });
sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("LISTNEING!");
  });
});