import React, { useEffect, useState } from 'react';
import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Radio,
  Input,
} from 'antd';
import http from '../../http';

const Home: React.FC = () => {
  const [records, setRecords] = useState<any>([]);
  // 保存修改时的id
  const [updUserId, setUpdUserId] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  // 删除用户数据
  const deleteRecordItem = (record: any) => {
    http
      .Post({
        url: '/deleteUser',
        params: { userId: record.user_id },
      })
      .then((res) => {
        message.success('删除成功');
        setRecords(
          records.filter((row: any) => row.user_id !== record.user_id),
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const modifyRecordItem = () => {
    http
      .Post({
        url: `/modifyUser/${updUserId}`,
        params: form.getFieldsValue(),
      })
      .then((res) => {
        message.success('修改成功')
        setRecords(records.map((record:any)=>{
          if (record.user_id === updUserId){
            return {...record,...form.getFieldsValue()}
          }
          return record
        }))
        setUpdUserId('')
        setVisible(false)
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = [
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '性别',
      key: 'gender',
      dataIndex: 'gender',
    },
    {
      title: '昵称',
      key: 'nick_name',
      dataIndex: 'nick_name',
    },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setVisible(true);
              const { phone, email, gender, nick_name: nickname,user_id } = record;
              setUpdUserId(user_id)
              form.setFieldsValue({
                phone,
                email,
                gender,
                nickname,
              });
            }}
          >
            修改
          </Button>
          <Popconfirm
            title="确认删除该条数据吗？"
            onConfirm={() => deleteRecordItem(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    // 获取用户列表
    const request = async () => {
      const result = await http.Get({
        url: '/userList',
        params: {},
      });
      setRecords(
        (result?.data || []).map((item: any) => ({
          ...item,
          key: item.user_id,
        })),
      );
    };
    try {
      request();
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <>
      <Table columns={columns} dataSource={records} />
      <Modal
        title="修改数据"
        visible={visible}
        onOk={modifyRecordItem}
        onCancel={() => setVisible(false)}
      >
        <Form
          labelCol={{ span: 5 }}
          style={{ width: 400, margin: '0 auto' }}
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
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Home;
