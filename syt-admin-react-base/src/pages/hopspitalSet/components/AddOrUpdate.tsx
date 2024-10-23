import { reqAddHospital, reqGetHospitalById, reqUpdateHospital } from '@/api/user/hospitalSet';
import { Button, Card, Form, Input, message, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';


export default function AddOrUpdate() {
  let { id } = useParams();// 获取路径参数id
  const [form] = useForm();
  const navigate = useNavigate();
  const onFinish = () => {
    let data = form.getFieldsValue();
    try {

      if (id) {
        data.id = id;
        reqUpdateHospital(data)
        message.success('修改成功');
      } else {

        reqAddHospital(data);
        message.success('添加成功');
      }


      navigate('/syt/hospital/hospitalSet');
    } catch (e) {
      message.error('添加失败');
    }
  };

  const _getHospitalSetById = async () => {
    const resp = await reqGetHospitalById(Number(id));
    form.setFieldsValue(resp);
  }





  useEffect(() => {
    // id 存在 说明是编辑操作，发请求获取数据
    // id 不存在 说明是添加操作，不发请求
    id && _getHospitalSetById();

  }, [])

  return (
    <Card>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 10 }}
        onFinish={onFinish}

      >
        <Form.Item
          label="医院名称"
          name="hosname"
          rules={[{ required: true, message: '请输入医院名称!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="医院编号"
          name="hoscode"
          rules={[{ required: true, message: '请输入医院编号!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="api基础路径"
          name="apiUrl"
          rules={[{ required: true, message: '请输入api基础路径!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="联系人姓名"
          name="contactsName"
          rules={[{ required: true, message: '请输入联系人姓名!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="联系人手机"
          name="contactsPhone"
          rules={[{ required: true, message: '请输入联系人手机!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button>返回</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}
