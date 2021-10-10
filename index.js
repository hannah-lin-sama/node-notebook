// 引入需要的模块
const http = require('http');
const mysql = require('mysql');
const {
  resolve
} = require('path');
const querystring = require('querystring');
const url = require("url");
const {
  config
} = require('./config/mysqlConfig.js');

// 创建数据库连接池
let connection = mysql.createConnection(config);

// 连接
connection.connect(function (err) {
  if (err) {
    console.log('error')
  } else {
    console.log('connect success!');
  }
});

// 创建一个web服务器
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  // res.setHeader('Content-Type', "text/html;charset=utf-8");
  // res.setHeader('Content-Type', 'text/plain');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
})

server.on('request', (request, response) => {
  let initurl = request.url;
  var body = "";
  let urlObj;
  let queryObj;
  urlObj = url.parse(initurl);

  function searchEvent(value) {
    console.log('value222', value, typeof (value));

    let params = value;

    let middleParam = params && JSON.parse(params.toString());

    let sqlParams = middleParam ? `v_event_noteClassify = ${middleParam['v_event_noteClassify']}` : '';

    console.log(middleParam['v_event_noteClassify']);

    connection.query(`select * from t_note_event where v_event_noteClassify = '笔记'`, (err, row) => {
      if (err) {
        console.log('错误信息', err);
      } else {
        let data = JSON.stringify(row); //将数据转换为json格式
        response.end(data)
      }
    })


  }


  if (urlObj.pathname == '/getnoteevent') {
    // 获取post请求的参数

    request.on('data', (chunk) => {
      body += chunk.toString();
      console.log('chunk', body);


    });


    request.on('end', () => {
      searchEvent(body);

    })
  }






  if (urlObj.pathname == '/getalluser' && request.method.toUpperCase() == 'GET') {
    queryObj = querystring.parse(urlObj.query)
    // console.log('get请求体参数',queryObj);
    connection.query('select * from t_note_user', (err, row) => {
      if (err) {
        console.log(err);
      } else {
        let data = JSON.stringify(row); //将数据转换为json格式
        response.end(data);
      }
    })
  }


})





// 监听9000端口
server.listen(9000, () => {
  console.log('服务器启动了。。。')
})