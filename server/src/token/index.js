const jwt = require('jsonwebtoken');

const SECRET_KEY = 'token1526';
// 生成token
const setToken = (user_name, user_id) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign({ user_name, user_id }, SECRET_KEY, {
        expiresIn: '24h',
      });
      resolve(token);
    } catch (e) {
      reject(e);
    }
  });
};

const getToken = (token)=>{
  return new Promise((resolve,reject)=>{
    if (!token){
      reject({error:'token为空'})
    }
    const info = jwt.verify(token.split(' ')[1],SECRET_KEY)
    resolve(info)
  })
}

module.exports = {
  SECRET_KEY,
  setToken,
  getToken
};
