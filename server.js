const express = require('express')
const bodyParser= require('body-parser')
const assert = require('assert');
const app = express()
const url = 'mongodb://localhost:27017';
const dbName = 'terr';

const MongoClient = require('mongodb').MongoClient

var db

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
  
    db = client.db(dbName);
    app.listen(3000, () => {
        console.log('listening on 3000')
      })
  });

// app.get('/', (req, res) => {
//       res.render('MongoDB.ejs')
//   })
app.get('/', (req, res) => {
    db.collection('terrorism').aggregate([
        {
           $group:
             {
               _id: "$country_txt",
               num_terrorist_attacks: { $sum: 1 }
             }
        },
        {
            $sort:{ num_terrorist_attacks : -1}
        },
        {
            $limit : 1
        }
     ]).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('index.ejs', {quotes: result})
      })
  })

  app.get('/a', (req, res) => {
    res.render('MongoDB.ejs')
  })

  app.post('/quotes', (req, res) => {
    var country = req.body.name;
    db.collection('terrorism').aggregate([
        {
           $match: {suicide : 1}
        },
        {
           $group:
             {
               _id: "$country_txt",
               num_suicide_attack: { $sum: 1 }
             }
        },
        {
            $sort:{ num_suicide_attack : -1}
        },
        {
            $match: {_id : req.body.name}
        }
     ]).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('index.ejs', {quotes: result})
        console.log(result)
      })
  })

  app.post('/quotes2', (req, res) => {
    var country = req.body.name;
    db.collection('terrorism').aggregate([
        {
           $match: {suicide : 1}
        },
        {
           $group:
             {
               _id: "$country_txt",
               num_suicide_attack: { $sum: 1 }
             }
        },
        {
            $sort:{ num_suicide_attack : -1}
        },
        {
            $match: {_id : req.body.name}
        }
     ]).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('index.ejs', {quotes: result})
        console.log(result)
      })
  })

