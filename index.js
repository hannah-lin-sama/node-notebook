// 引入需要的模块
const http = require('http');
const querystring = require('querystring');
const url = require("url");
const {
  sqlConnect,
  connection
} = require('./config/mysqlConfig');

sqlConnect();

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
  // 访问的地址
  let initurl = request.url;
  // get请求的参数
  let queryObj;
  // post请求的参数
  var body = "";
  // 访问的地址,不包含主机地址,URL对象
  let urlObj;

  urlObj = url.parse(initurl);

  function searchEvent(value) {

    let params = value;

    let middleParam = params && JSON.parse(params.toString());

    // console.log(middleParam,middleParam['v_event_noteClassify']);
    let normalSQL = `select * from t_note_event`;
    let paramsSQL = `select * from t_note_event where v_event_noteClassify = '${middleParam['v_event_noteClassify']}'`;
    // console.log(middleParam,'参数...',middleParam['v_event_noteClassify']);
    let lastSQL = middleParam ? paramsSQL: normalSQL;
    // console.log('last....',lastSQL);
    connection.query( lastSQL, (err, row) => {
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
    process.nextTick(() =>{
      console.log('process',body);
      searchEvent(body);

    })

    request.on('end', () => {

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