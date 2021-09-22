const mysql = require('mysql');
const mysqlConfig = require('../config/mysql.config');

class Users {
  constructor() {
    this.db = mysql.createConnection(mysqlConfig);
  }
  // 根据手机号、密码查询用户
  findUser(phone, password) {
    const sql = 'select * from users WHERE phone = ? and pass_word = ?';
    return new Promise((resolve, reject) => {
      this.db.query(sql, [phone, password], (err, result) => {
        if (err) reject(err);
        if (result.length > 0) {
          const userData = result[0];
          resolve(userData);
        } else {
          reject('用户不存在');
        }
      });
    });
  }
  // 注册
  register(params) {
    const sql =
      'insert into users(phone,nick_name,pass_word,email,gender) values(?,?,?,?,?)';
    return new Promise((resolve, reject) => {
      // 去重，密码和确认密码相同
      this.db.query(sql, [params.phone,params.nickname,params.password,params.email,params.gender], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
  // 查询列表
  getList() {
    const sql = 'select * from users';
    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
  // 删除用户
  deleteUser(id) {
    const sql = 'delete from users where user_id = ?';
    return new Promise((resolve, reject) => {
      this.db.query(sql, id, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
  // 修改用户信息
  modifyUser(id,params) {
    const sql =
      'update users set phone = ?, email = ?, gender = ?, nick_name = ? where user_id = ?';
    const sqlParams = [
      params.phone,
      params.email,
      params.gender,
      params.nickname,
      id,
    ];
    return new Promise((resolve, reject) => {
      this.db.query(sql, sqlParams, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}
const users = new Users();
module.exports = users;
