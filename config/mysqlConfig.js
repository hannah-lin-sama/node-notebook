// 引入MySQL
let mysql = require('mysql');

// 数据库配置信息
const config = {
  host:'localhost',
  user:'root',
  password:'',
  database:'notebook'
}

// 创建数据库连接池
const connection = mysql.createConnection(config);

// 连接
function sqlConnect(){
  connection.connect(function (err) {
    if (err) {
      console.log('error')
    } else {
      console.log('connect success!');
    }
  });
}

exports.config = config;
exports.connection = connection;
exports.sqlConnect = sqlConnect;
