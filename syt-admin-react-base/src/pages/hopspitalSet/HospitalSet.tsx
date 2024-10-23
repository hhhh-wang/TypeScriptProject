import { reqGetHospitalSetList, reqRemoveHospital,reqBatchRemoveHospitals} from '@/api/user/hospitalSet'
import { HospitalSetList } from '@/api/user/model/hospitalSetTypes'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { Button, Card, Form, Input, Modal, Space, message } from 'antd'

import Table, { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { confirm } = Modal;
export default function HospitalSet() {


    const navigate = useNavigate()
    let [current, setCurrent] = useState<number>(1)
    let [pageSize, setPageSize] = useState<number>(3)
    let [total, setTotal] = useState<number>(10)
    let [hospitalSetList, setHospitalSetList] = useState<HospitalSetList>([])

    let [hosname, setHosname] = useState<string>()
    let [hoscode, setHoscode] = useState<string>()
    let [loading, setLoading] = useState<boolean>(false)
    let [selectedRowKeys,setSelectedRowKeys] = useState<React.Key[]>([])

    const [form] = Form.useForm();

    async function _getHospitalSetList() {
        // const param = { page: current, limit: pageSize };
        setLoading(true)
        const param = { page: current, limit: pageSize, hosname: hosname, hoscode: hoscode };
        let { records, total } = await reqGetHospitalSetList(param);

        setHospitalSetList(records);
        setTotal(total);
        setLoading(false);
        console.log(records);
    }
    useEffect(() => {

        _getHospitalSetList();

    }, [current, pageSize, hoscode, hosname])


    const deleteById = (id: number) => {
        // 1. 弹框
        confirm({
            title: '确定删除么?',
            icon: <ExclamationCircleFilled />,
            content: '删除当前记录',
            async onOk() {
                await reqRemoveHospital(id)
                message.success('删除成功');
                // 刷新列表
                _getHospitalSetList();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const search = () => {
        console.log('条件搜索')
        const { hoscode, hosname } = form.getFieldsValue();
        setHosname(hosname);
        setHoscode(hoscode);
        current !== 1 && setCurrent(1);

    }
    const clear = () => {
        form.resetFields();
        setHosname(undefined);
        setHoscode(undefined);
        setCurrent(1);
    }

    const columns: ColumnsType<any> = [
        {
            title: '序号',
            render(value: any, row: any, index: number) {
                return (current - 1) * pageSize + (index + 1)
            }
        },
        {
            title: '医院名称',
            dataIndex: 'hosname'
        },
        {
            title: '医院编号',
            dataIndex: 'hoscode'
        },
        {
            title: 'api基础路径',
            dataIndex: 'apiUrl'
        },
        {
            title: '签名',
            dataIndex: 'signKey'
        },
        {
            title: '联系人姓名',
            dataIndex: 'contactsName'
        },
        {
            title: '联系人手机',
            dataIndex: 'contactsPhone'
        },
        {
            title: '操作',
            width: 120,
            fixed: 'right',
            render(row: any) {
                return (
                    <Space>
                        <Space>
                            <Button type='primary' icon={<EditOutlined />} onClick={() => { navigate('/syt/hospital/hospitalSet/components/edit/' + row.id)   }} ></Button>
                            <Button type='primary' icon={<DeleteOutlined />} onClick={() => { deleteById(row.id) }} danger></Button>
                        </Space>
                    </Space>
                )
            }
        }
    ]

    return (
        <Card>
            {/* 1. Form */}
            <Form
                layout='inline'
                onFinish={search}
                form={form}
            >
                <Form.Item name='hosname'>
                    <Input placeholder='医院名称' />
                </Form.Item>

                <Form.Item name='hoscode'>
                    <Input placeholder='医院编号' />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type='primary' htmlType='submit'>查询</Button>
                        <Button onClick={clear} >清空</Button>

                    </Space>
                </Form.Item>
            </Form>

            {/* 2. button */}

            <Space className='mt'>
                <Button type='primary' onClick={() => { navigate('/syt/hospital/hospitalSet/components/add') }}>添加</Button>
                <Button disabled={selectedRowKeys.length === 0} onClick={() => {
                    confirm({
                        title: '确定批量删除么?',
                        icon: <ExclamationCircleFilled />,
                        content: '批量删除记录',
                        async onOk() {
                            await reqBatchRemoveHospitals(selectedRowKeys);
                            // 将selectedKeys状态清空成空数组
                            setSelectedRowKeys([]);
                            message.success('批量删除成功');
                            // 刷新列表
                            _getHospitalSetList();
                        },
                        onCancel() {
                            console.log('Cancel');
                        },
                    });
                }}>批量删除</Button>
            </Space>
            { /* 3. Table */}
            <Table
                loading={loading}
                className='mt'
                rowKey={'id'}
                columns={columns}
                scroll={{ x: 1300 }}
                dataSource={hospitalSetList}
                rowSelection={{
                    onChange(selectedRowKeys:React.Key[]){
                        console.log('selectedKeys: ', selectedRowKeys);
                        setSelectedRowKeys(selectedRowKeys);
                    }
                }}


                pagination={{
                    current,
                    pageSize,
                    total,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: [3, 5, 10, 20],
                    onChange: (page: number, pageSize: number) => {
                        setCurrent(page);
                        setPageSize(pageSize)
                    }
                }}
            />
        </Card>

    )
}
