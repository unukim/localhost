var express = require('express');
var router = express.Router();


var pgp = require('pg-promise')();


var conn = {
host: 'bronto.ewi.utwente.nl',
port: 5432,
database: 'dab_dda23242b_30',
user: 'dab_dda23242b_30',
password: 'KdAVM3nwN8bfNOzy'
};


/* make the connection */
var db = pgp(conn);

var outputData = {
  selfEsteemData: [],
  UnhappinessData: [],
};

router.get('/', function(req, res, next) {
res.render('index', { title: 'Project Avengers', selfEsteemData:[], UnhappinessData:[]});
});

router.post('/getselfesteem/', function(req, res, next) {
  var time = req.body.screen_time;

  db.manyOrNone('SELECT self_esteem FROM hybrid_worlds.self_esteem WHERE screen_time=$1', [time])
      .then(self_esteem_data => {
          outputData.selfEsteemData = self_esteem_data; 
          res.render('index', { 
              title: 'Self Esteem by screen time',
              selfEsteemData: outputData.selfEsteemData, 
              UnhappinessData:  outputData.UnhappinessData
          });
      })
      .catch(error => {
          console.log(error);
          res.render('index', { 
              title: 'Self Esteem by screen time -> Error',
              selfEsteemData: [], 
              UnhappinessData: [] 
          });
      });
});

router.post('/getunhappiness/', function(req, res, next) {
  var time = req.body.screen_time;
  var cat = req.body.category;

  db.manyOrNone('SELECT unhappiness FROM hybrid_worlds.unhappiness WHERE category=${category} AND screen_time = ${screen_time}', {category: cat,screen_time:time})
      .then(unhappiness_data => {
        outputData.UnhappinessData = unhappiness_data;
          res.render('index', {
              title: 'Unhappiness by screentime and category',
              selfEsteemData: outputData.selfEsteemData, 
              UnhappinessData:  outputData.UnhappinessData
          });
      })
      .catch(error => {
          console.log(error);
          res.render('index', { 
              title: 'Unhappiness by screentime and category',
              selfEsteemData: [], 
              UnhappinessData: []  
          });
      });
});
module.exports = router;
