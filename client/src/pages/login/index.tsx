import React from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch } from 'react-redux';
import http from '../../http';
import { setStorage } from '../../utils/storage';
import { setToken } from '../../store';

import styles from './index.scss';

const Login: React.FC = (props) => {
  const { history }: any = props;
  const dispatch = useDispatch();
  const submit = (values: any) => {
    const { phone, password } = values;
    http
      .Post({
        url: '/login',
        params: { phone, password },
      })
      .then((res) => {
        if (res.success) {
          setStorage('token', res.data);
          dispatch(setToken(res.data));
          history.push('/');
        } else {
          dispatch(setToken(''));
          setStorage('token', '');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div className={styles['login-form']}>
      <Form
        labelCol={{ span: 4 }}
        style={{ width: 400, margin: '0 auto' }}
        onFinish={submit}
      >
        <Form.Item
          label="手机号"
          name="phone"
          rules={[
            {
              required: true,
              validator: (_, value) =>{
                if (!value){
                  return Promise.reject(new Error('请输入手机号'))
                }
                if (!(/^1[3-9]\d{9}$/.test(value))){
                  return Promise.reject(new Error('手机号格式错误'))
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input maxLength={11} />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              onClick={() => history.push('/register')}
            >
              注册
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
