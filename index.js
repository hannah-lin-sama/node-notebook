// 引入需要的模块
const http = require('http');
const mysql = require('mysql');
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
  }else{
    console.log('connect success!');
  }
});

// 创建一个web服务器
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  // res.setHeader('Content-Type', "text/html;charset=utf-8");
  res.setHeader('Content-Type','text/plain');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
})

server.on('request', (request, response) => {
  let initurl = request.url;
  let body="";
  // 获取post请求的参数
  if(request.method == 'POST'){
    request.on('data', (chunk) => {
      body += chunk;
      console.log('CHECKK....',JSON.parse(chunk.toString()));
    });
  }
  let urlObj = url.parse(initurl);
  let query = urlObj.query;
  let queryObj = querystring.parse(query)
  if(urlObj.pathname == '/favicon.ico' || urlObj.pathname == ''){
    return;
  }else{
    console.log('请求体',request.method);

  }

  if (urlObj.pathname === '/getnoteevent') {
    // 查询数据
    connection.query('select * from t_note_event',  (err, row) => {
      if (err) {
        console.log(err);
      }else{
        let data = JSON.stringify(row); //将数据转换为json格式
        response.end(data);
      }
    })
  }
  if(urlObj.pathname == '/getalluser'){

    connection.query('select * from t_note_user', (err, row) => {
      if (err) {
        console.log(err);
      }else{
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