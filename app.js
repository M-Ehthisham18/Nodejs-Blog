require('dotenv').config();

const express = require('express');
const app = express();

const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const port = process.env.PORT || 3000;

const connectDB = require('./server/config/db')

connectDB();  
app.use(express.static('public'));

//this two middleware for searching term .
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.use(expressLayout)
app.set('layout','./layouts/main')
app.set('view engine', 'ejs')

app.use('/',require('./server/routes/main'))
app.use('/admin',require('./server/routes/admin'))

app.listen(port, ()=>{
  console.log(`app listening on http://127.0.0.1:${port}`);
  
})
