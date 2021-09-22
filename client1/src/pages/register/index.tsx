import React from 'react';
import { Form, Input, Button, Radio, message } from 'antd';

import { useDispatch } from 'react-redux';
import { setStorage } from '../../utils/storage';
import { setToken } from '../../store';
import http from '../../http';

const Register: React.FC = (props) => {
  const [form] = Form.useForm();
  const { history }: any = props;
  const dispatch = useDispatch();

  const initialValues = {
    gender: 'male',
  };
  const submit = (values: any) => {
    console.log('submit');
    http
      .Post({
        url: '/register',
        params: values,
      })
      .then((res) => {
        if (res.success) {
          setStorage('token', res.data);
          dispatch(setToken(res.data));
          message.success('注册成功');
          setTimeout(() => {
            history.push('/');
          }, 1000);
        } else {
          dispatch(setToken(''));
          setStorage('token', '');
        }
      });
  };
  return (
    <div className="login-form">
      <Form
        labelCol={{ span: 5 }}
        style={{ width: 400, margin: '0 auto' }}
        initialValues={initialValues}
        onFinish={submit}
        form={form}
      >
        <Form.Item
          label="手机号"
          name="phone"
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error('请输入手机号'));
                }
                if (!/^1[3-9]\d{9}$/.test(value)) {
                  return Promise.reject(new Error('手机号格式错误'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="昵称"
          name="nickname"
          rules={[
            {
              required: true,
              message: '请输入昵称',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error('请输入邮箱'));
                }
                if (
                  !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
                    value,
                  )
                ) {
                  return Promise.reject(new Error('邮箱格式错误'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="性别"
          name="gender"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Radio.Group>
            <Radio value="male">男</Radio>
            <Radio value="famale">女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="password2"
          rules={[
            {
              required: true,
              message: '请输入确认密码',
              validator: (_, value) => {
                const password = form.getFieldValue('password');
                if (!value) {
                  return Promise.reject(new Error('请输入确认密码'));
                }
                if (password !== value) {
                  return Promise.reject(
                    new Error('两次输入的密码不一致，请重新输入'),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button htmlType="submit" type="primary" style={{ marginTop: 20 }}>
              注册
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Register;
