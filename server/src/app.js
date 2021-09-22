const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const cors = require('cors');

const { SECRET_KEY, getToken, setToken } = require('./token');

const users = require('./user');

const app = express();
const port = 4000;
// 设置跨域
app.use(cors());
// application/x-www-form-urlencoded 参数解析
app.use(bodyParser.urlencoded({ extended: false }));
// application/json 参数解析
app.use(bodyParser.json());

// 获取token
app.use((req, res, next) => {
  const token = req.headers('token');
  if (!token) return next();
  getToken(token)
    .then((data) => {
      req.data = data;
      return next();
    })
    .catch((err) => {
      console.log(err);
      return next();
    });
});

// 接口拦截，没有token不放行 unless代表不需要token的接口
app.use(
  jwt({ secret: SECRET_KEY, algorithms: ['HS256'] }).unless({
    path: ['/login', '/register'],
  }),
);

// token失效处理
app.use((err, req, res, next) => {
  if (err.status === 401) {
    return res.status(401).json({ success: false, msg: '登录失效' });
  }
  next();
});

// 登录接口
app.post('/login', (req, res) => {
  const { phone, password } = req.body;
  users
    .findUser(phone, password)
    .then((row) => {
      setToken(row.phone, row.user_id).then((token) => {
        res.json({
          code: 200,
          success: true,
          data: token,
          msg: null,
        });
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        data: null,
        msg: '用户名或密码不正确',
      });
    });
});
// 注册接口
app.post('/register', (req, res) => {
  users
    .register(req.body)
    .then((row) => {
      const { phone } = req.body;
      setToken(phone, row.insertId).then((token) => {
        res.json({
          code: 200,
          success: true,
          data: token,
          msg: '注册成功',
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        success: false,
        data: null,
        msg: '注册失败',
      });
    });
});

// 获取列表
app.get('/userList', (req, res) => {
  users
    .getList()
    .then((result) => {
      res.json({
        code: 200,
        success: true,
        data: result,
        msg: '',
      });
    })
    .catch((err) => {
      res.json({
        code: 200,
        success: false,
        data: [],
        msg: err,
      });
    });
});

// 删除用户
app.post('/deleteUser', (req, res) => {
  const { userId } = req.body;
  users
    .deleteUser(userId)
    .then((result) => {
      res.json({
        code: 200,
        success: true,
        data: null,
        msg: '删除成功',
      });
    })
    .catch((err) => {
      res.json({
        code: 200,
        success: false,
        data: null,
        msg: '删除失败',
      });
    });
});

// 修改用户信息
app.post('/modifyUser/:id', (req, res) => {
  users
    .modifyUser(req.params.id,req.body)
    .then((result) => {
      res.json({
        code: 200,
        success: true,
        data: null,
        msg: '修改成功',
      });
    })
    .catch((err) => {
      res.json({
        code: 200,
        success: false,
        data: null,
        msg: '修改失败',
      });
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
