// 引入需要的模块
let http = require('http');
let mysql = require('mysql');
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
const server = http.createServer(function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
})

server.on('request', function (request, response) {
  let url = request.url;
  if (url === '/getnoteevent') {
    // 查询数据
    connection.query('select * from t_note_event', function (err, row) {
      if (err) {
        console.log(err);
      }else{
        let data = JSON.stringify(row); //将数据转换为json格式
        response.end(data);
      }
    })
  }
  if(url === '/getalluser'){
    connection.query('select * from t_note_user', function (err, row) {
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

server.listen(9000, function () {
  console.log('服务器启动了。。。')
})