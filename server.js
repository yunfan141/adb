const express = require('express')
const bodyParser= require('body-parser')
const assert = require('assert');
const app = express()
const url = 'mongodb://localhost:27017';
const dbName = 'adbm';

const MongoClient = require('mongodb').MongoClient

var db

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

let tabledata = [];
let country = [];
let year = [];
let motive = [];
let attack = [];
let weapon = [];
let nation = [];
let query0 = [];
let query1 = [];
let query2 = [];
let query3 = [];
let query4 = [];
let query5 = [];
let query6 = [];
let query7 = [];
let query8 = [];
let query9 = [];
let query10 = [];
let query11 = [];
let query01 = [];
let over = [];

MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
  
    db = client.db(dbName);
    db.collection('Terrorism').aggregate([
        {
           $group:
             {
               _id: "$iyear",
             }
        },
        {
            $sort:{ _id : 1}
        }]).toArray((err, result) => {
        if (err) return console.log(err)
        year = result;
    });
    
    db.collection('Terrorism').aggregate([
        {
            $group:
                {
                _id: "$country_txt",
                }
        },
        {
            $sort:{ _id : 1}
        }]).toArray((err, result) => {
        if (err) return console.log(err)
        country = result;
    });

    db.collection('Terrorism').aggregate([
        {
            $group:
                {
                _id: "$attacktype1_txt",
                }
        },
        {
            $sort:{ _id : 1}
        }]).toArray((err, result) => {
        if (err) return console.log(err)
        attack = result;
    });

    db.collection('Terrorism').aggregate([
        {
            $group:
                {
                _id: "$weaptype1_txt",
                }
        },
        {
            $sort:{ _id : 1}
        }]).toArray((err, result) => {
        if (err) return console.log(err)
        weapon = result;
    });

    db.collection('Terrorism').aggregate([
        {
           $group:
             {
               _id: "$natlty1_txt",
             }
        },
        {
            $sort:{ _id : -1}
        },
     ]).toArray((err, result) => {
        if (err) return console.log(err)
        nation = result;
     });

     db.collection('Terrorism').aggregate([
      {
          $group:
              {
              _id: "$country_txt",
              nattack: {$sum : 1}
              }
      },
      {
          $sort:{ _id : 1}
      },
      {
        $limit : 10
      }
    ]).toArray((err, result) => {
      if (err) return console.log(err)
      over = result;
  });

    // db.collection('Terrorism').aggregate([
    //     { 
    //         $match: {nperpcap : {$gt: 10} }
    //     },
    //     {
    //        $group:
    //          {
    //            _id: "$motive",
    //            num_perpetrators_captured: { $sum: "$nperpcap" }
    //          }
    //     }
    //  ]).toArray((err, result) => {
    //     if (err) return console.log(err)
    //     motive = result;
    //     console.log(motive);
    // });
    
  });

// for the table displayed
app.get('/', (req, res) => {
    db.collection('Terrorism').aggregate([
        {
           $group:
             {
               _id: "total_num_perpetrators_captured",
               total_num: { $sum: "$nperpcap" },
               count: { $sum: 1 }
             }
        }
    
     ]).toArray((err, result) => {
        if (err) return console.log(err)
        tabledata = result;
        res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11,over})
      },
    )
  })

  app.get('/overview', (req, res) => {
    db.collection('Terrorism').aggregate([
        {
           $group:
             {
               _id: "$country_txt",
               nkill: { $sum: "$nkill" },
               nattack: { $sum: 1 },
               nwound: { $sum: "$nwound"},
               nperpcap: {$sum: "$nperpcap"}
             }
        }
    
     ]).toArray((err, result) => {
        if (err) return console.log(err)
        query0 = result;
        res.render('overview.ejs', {country,query0,over})
      },
    )
  })

  app.get('/overview2', (req, res) => {
    db.collection('Terrorism').aggregate([
        {
           $group:
             {
               _id: "$iyear",
               nkill: { $sum: "$nkill" },
               nattack: { $sum: 1 },
               nwound: { $sum: "$nwound"},
               nperpcap: {$sum: "$nperpcap"}
             }
        }
    
     ]).toArray((err, result) => {
        if (err) return console.log(err)
        query01 = result;
        res.render('overview2.ejs', {country,query01})
      },
    )
  })

// form post for query 1
  app.post('/query1', (req, res) => {
      let yearpicked = parseInt(req.body.yearpicker);

    db.collection('Terrorism').aggregate([
        {
           $group:
             {
               _id: "$iyear",
               total_num: { $sum: "$nperpcap" },
             }},
        {
            $match: {_id : yearpicked}
        }
     ]).toArray((err, result) => {
        if (err) return console.log(err)
        query1 = result;
        res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
      })
  })

//form post for query 2
  app.post('/query2', (req, res) => {
    let countrypicked = req.body.countrypicker;

  db.collection('Terrorism').aggregate([
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
    {$match: {_id: countrypicked}}
    ]).toArray((err, result) => {
      if (err) return console.log(err)
      query2 = result;
      res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
    })
})

//form post for query 3 ***** test using Italy ******
app.post('/query3', (req, res) => {
    let countrypicked = req.body.countrypicker;

  db.collection('Terrorism').aggregate([
	{
       $group:
         {
           _id: "$country_txt",
           num_ransom_paid: { $sum: "$ransompaid" }
         }
    },
    { 
		$match: { _id: countrypicked }
	}

 ]).toArray((err, result) => {
      if (err) return console.log(err)
      query3 = result;
      res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
    })
})

//form post for query 4 **** test using Yemen *****
app.post('/query4', (req, res) => {
    let countrypicked = req.body.countrypicker;

  db.collection('Terrorism').aggregate([
	{
       $group:
         {
           _id: "$country_txt",
           num_ransom_demanded: { $sum: "$ransomamt" }
         }
    },
    { 
		$match: { _id: countrypicked }
	}

 ]).toArray((err, result) => {
      if (err) return console.log(err)
      query4 = result;
      res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
    })
})

//form post for query 5 ****  *****
app.post('/query5', (req, res) => {
    let attackpicked = req.body.attackpicker;

  db.collection('Terrorism').aggregate([
    { 
      $match: {success : 1}
  },
  {
     $group:
       {
         _id: "$attacktype1_txt",
         num_wound: { $sum: "$nwound" }
       }
  },
    { 
		$match: { _id: attackpicked }
	}

 ]).toArray((err, result) => {
      if (err) return console.log(err)
      query5 = result;
      res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
    })
})

//form post for query 6 ****test using Irap *****
app.post('/query6', (req, res) => {
    let countrypicked = req.body.countrypicker;

  db.collection('Terrorism').aggregate([
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
		$match: { _id: countrypicked }
	}

 ]).toArray((err, result) => {
      if (err) return console.log(err)
      query6 = result;
      res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
      console.log(countrypicked);
    })
})

//form post for query 7 ****just show the table *****
app.post('/query7', (req, res) => {
    let motivepicked = req.body.motivepicker;

  db.collection('Terrorism').aggregate([
    {
       $group:
         {
           _id: "$motive",
           num_perpetrators_captured: { $sum: "$nperpcap" }
         }
    },

 ]).toArray((err, result) => {
      if (err) return console.log(err)
      query7 = result;
      res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
      console.log(query7);
      console.log(motivepicked);
    })
})

app.post('/query8', (req, res) => {
    let typepicked= req.body.typepicker;

  db.collection('Terrorism').aggregate([
	{
       $group:
         {
           _id: "$attacktype1_txt",
           num_attack: { $sum: 1 }
         }
    },
    { 
		$match: { _id: typepicked }
  },
  {
    limit: 10
  }

 ]).toArray((err, result) => {
      if (err) return console.log(err)
      query8 = result;
      res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
      console.log(query8)
      console.log(typepicked);
    })
})


app.post('/query9', (req, res) => {
    let wtypepicked= req.body.wtypepicker;

  db.collection('Terrorism').aggregate([
	{
       $group:
         {
           _id: "$weaptype1_txt",
           num_attack: { $sum: 1 }
         }
    },
    { 
		$match: { _id: wtypepicked }
	}
 ]).toArray((err, result) => {
      if (err) return console.log(err)
      query9 = result;
      res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
      console.log(query9)
      console.log(wtypepicked);
    })
})

app.post('/query10', (req, res) => {
    let nationpicked= req.body.nationpicker;

  db.collection('Terrorism').aggregate([
	{
        $group:
          {
            _id: "$natlty1_txt",
            num_terrorist_attacks: { $sum: 1 }
          }
     },
    { 
		$match: { _id: nationpicked }
	}
 ]).toArray((err, result) => {
      if (err) return console.log(err)
      query10 = result;
      res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
      console.log(query10)
      console.log(nationpicked);
    })
})

app.post('/query11', (req, res) => {
  let countrypicked= req.body.countrypicker;

db.collection('Terrorism').aggregate([
  {
    $group:
      {
        _id: {country: "$country_txt", weapontype: "$weaptype1_txt"},
      }
 },
 {
    $match: { "_id.country" : countrypicked}
 }
]).toArray((err, result) => {
    if (err) return console.log(err)
    query11 = result;
    res.render('mongodb.ejs', {tabledata,year,attack,country,motive,weapon,nation,query1,query2,query3,query4,query5,query6,query7,query8,query9,query10,query11})
    console.log(query11[0].weapontype)
    console.log(countrypicked);
  })
})

    


var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Express server listening on port %s.', port);
})
