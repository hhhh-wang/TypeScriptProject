import { changeStatus, getDistrictList, getHospitalList } from '@/api/user/hospitalList';
import { IDistrictList, IFormFields, IHospitalItem, IHospitalList } from '@/api/user/model/hospitalListTypes';
import { Button, Card, Form, Image, Input, Select, Space, Table } from 'antd'
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
export default function HospitalList() {

    const columns: ColumnsType<IHospitalItem> = [
        {
            title: '序号',
            render(value: any, row: any, index: number) {
                return (current - 1) * pageSize + (index + 1)
            }
        },
        {
            title: '医院logo',
            render(row: IHospitalItem) {
                return (
                    <Image width={100} src={'data:image/jpg;base64,' + row.logoData} />
                )
            }
        },
        {
            title: '医院名称',
            dataIndex: 'hosname'
        },
        {
            title: '等级',
            render(row: IHospitalItem) {
                return row.param.hostypeString
            }
        },
        {
            title: '详细地址',
            render(row: IHospitalItem) {
                return row.param.fullAddress
            }
        },
        {
            title: '状态',
            render(row: IHospitalItem) {
                return row.status ? '已上线' : '未上线'
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime'
        },
        {
            title: '操作',
            render(row: IHospitalItem) {
                return (
                    <Space>
                        <Button type='primary' onClick={()=>navigate('/syt/hospital/hospitalList/show/' + row.id)}  >查看</Button>
                        <Button type='primary'>排班</Button>
                        <Button type='primary' onClick={()=>updateStatus(row.id, row.status ? 0: 1)}>{row.status ? '下线' : '上线'}</Button>
                    </Space>
                )
            }
        }
    ];
    const navigate = useNavigate();

    let [provinceList, setProvinceList] = useState<IDistrictList>([])
    let [cityList, setCityList] = useState<IDistrictList>([])
    let [dictList, setDictList] = useState<IDistrictList>([])
    // 医院类型
    let [typeList, setTypeList] = useState<IDistrictList>([])


    let [form] = Form.useForm();
    let [cityId, setCityId] = useState<number>()
    let [dictId, setDictId] = useState<number>()

    // 医院列表分页数据
    let [hospitalList, setHospitalList] = useState<IHospitalList>([]);
    let [current, setCurrent] = useState<number>(1);
    let [pageSize, setPageSize] = useState<number>(3);
    let [total, setTotal] = useState<number>(10);

    let [loading, setLoading] = useState<boolean>(false);
    //表单数据
    let [formFields, setFormFields] = useState<IFormFields>({
        hoscode: undefined,
        hosname: undefined,
        provinceCode: undefined,
        cityCode: undefined,
        districtCode: undefined,
        status: undefined,
        hostype: undefined
    })
    // 获取省列表

    //获取省列表
    const getProvinceList = async () => {
        const provinceList = await getDistrictList(86);
        setProvinceList(provinceList);
        console.log('省数据：' + provinceList)
    }
    // const getCityList = async (id: number) => {
    //     console.log('id: ', id);
    //     const cityList = await getDistrictList(id);
    //     setCityList(cityList);
    // }
    // // 根据市id 获取区列表并渲染
    // const getDictList = async (id: number) => {
    //     console.log('city id: ', id);
    //     const dictList = await getDistrictList(id);
    //     setDictList(dictList);
    // }

    // 当选择省份时触发
    const handleProvinceChange = async (value: number) => {
        // value 就是选中的省份的 id
        console.log('选中的省份id:', value);
        // 清空之前的城市和地区列表
        form.setFieldsValue({
            cityCode: undefined,
            districtCode: undefined
        })
        // 获取该省份下的城市列表
        const cityList = await getDistrictList(value);
        setCityList(cityList);
    }

    // 当选择城市时触发
    const handleCityChange = async (value: number) => {
        // 清空之前的地区列表
        form.setFieldsValue({
            districtCode: undefined
        })
        // 获取该城市下的地区列表
        const dictList = await getDistrictList(value);
        setDictList(dictList);
    }

    /**
     * 获取医院等级
     */
    const getTypes = async () => {
        let types = await getDistrictList(10000)
        // console.log(types);..
        setTypeList(types);
    }


    /**
     * 搜索查询
     */
    const search = async () => {
        const fieldsValue = form.getFieldsValue()
        //让useEffect 监听字段的变化，发起请求s
        setFormFields(fieldsValue)
        //查询以后从第一页看起
        setCurrent(1)
    }
    const clear = () => {
        // 清空form表单的数据
        // 清空 formFields 状态的值都为 undefined
        // 当前页设置为 1
        form.resetFields();
        setFormFields({
            hoscode: undefined,
            hosname: undefined,
            provinceCode: undefined,
            cityCode: undefined,
            districtCode: undefined,
            status: undefined,
            hostype: undefined
        })
        setCurrent(1);
    }
    /**
     * 点击上下线 按钮，触发的事件回调
     * @param id 
     * @param status 
     */

    const updateStatus = async (id:string, status:number)=>{
        // console.log('id: ', id);
        // console.log('status: ', status);
        await changeStatus(id, status);
        // 重新获取列表
        _getHospitalList();
    }
    useEffect(() => {
        // 获取省数据
        getProvinceList();
        // 获取医院等级列表
        getTypes();

    }, [])

    //获取列表数据
    const _getHospitalList = async () => {
        setLoading(true);
        let { content, totalElements } = await getHospitalList({ page: current, limit: pageSize, ...formFields });
        console.log('content: ', content);
        console.log('total: ', totalElements);
        // 设置医院列表状态
        setHospitalList(content);
        setTotal(totalElements);
        setLoading(false);
    }

    useEffect(() => {
        _getHospitalList();
    }, [current, pageSize, formFields.hoscode, formFields.hosname, formFields.cityCode, formFields.provinceCode, formFields.districtCode, formFields.hostype, formFields.status])

    return (
        <Card>
            <Form layout='inline' form={form} onFinish={search}>
                <Form.Item name='provinceCode'>
                    <Select onChange={handleProvinceChange} className='mb' placeholder='请选择省' style={{ width: 180 }}>
                        {
                            provinceList?.map((province) => {
                                return (<Option key={province.id} value={province.value}>{province.name}</Option>)
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='cityCode'>
                    <Select onChange={handleCityChange} placeholder='请选择市' style={{ width: 180 }}>
                        {
                            cityList?.map((city) => {
                                return (<Option key={city.id} value={city.value}>{city.name}</Option>)
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='districtCode'>
                    <Select placeholder='请选择区' style={{ width: 180 }}>
                        {
                            dictList?.map((dict) => {
                                return (
                                    <Option key={dict.id} value={dict.id}>{dict.name}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='hosname'>
                    <Input placeholder='医院名称' />
                </Form.Item>
                <Form.Item name='hoscode'>
                    <Input placeholder='医院编号' />
                </Form.Item>
                <Form.Item name='hostype'>
                    <Select placeholder='医院类型' style={{ width: 180 }}>
                        {typeList?.map((type) => (
                            <Option key={type.id} value={type.value}>{type.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name='status'>
                    <Select placeholder='医院状态' style={{ width: 180 }}>
                        <Option value={0}>未上线</Option>
                        <Option value={1}>已上线</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type='primary' htmlType='submit' >查询</Button>
                        <Button disabled={Object.values(formFields).every(item => item === undefined)}  onClick={clear}>清空</Button>
                    </Space>
                </Form.Item>
            </Form>

            <Table
                className='mt'
                rowKey={'id'}
                columns={columns}
                dataSource={hospitalList}
                loading={loading}
                pagination={{
                    current,
                    pageSize,
                    total,
                    onChange(page: number, pageSize: number) {
                        setCurrent(page);
                        setPageSize(pageSize);
                    }
                }}
            />
        </Card>
    )
}
