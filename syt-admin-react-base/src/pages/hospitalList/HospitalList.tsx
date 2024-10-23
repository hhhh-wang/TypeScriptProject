import { getDistrictList } from '@/api/user/hospitalList';
import { IDistrictList } from '@/api/user/model/hospitalListTypes';
import { Button, Card, Form, Input, Select, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react'

const { Option } = Select;
export default function HospitalList() {
    const columns: ColumnsType<any> = [
        {
            title: '序号'
        },
        {
            title: '医院logo'
        },
        {
            title: '医院名称'
        },
        {
            title: '等级'
        },
        {
            title: '详细地址'
        },
        {
            title: '状态'
        },
        {
            title: '创建时间'
        },
        {
            title: '操作'
        }
    ]




    let [provinceList, setProvinceList] = useState<IDistrictList>([])
    let [cityList, setCityList] = useState<IDistrictList>([])
    let [dictList, setDictList] = useState<IDistrictList>([])

    let [cityId, setCityId] = useState<number>()
    let [dictId, setDictId] = useState<number>()

    // 获取省列表

    //获取省列表
    const getProvinceList = async () => {
        const provinceList = await getDistrictList(86);
        setProvinceList(provinceList);
        console.log('省数据：' + provinceList)
    }
    const getCityList = async (id: number) => {
        console.log('id: ', id);
        const cityList = await getDistrictList(id);
        setCityList(cityList);
    }
    // 根据市id 获取区列表并渲染
    const getDictList = async (id: number) => {
        console.log('city id: ', id);
        const dictList = await getDistrictList(id);
        setDictList(dictList);
    }

    // 当选择省份时触发
    const handleProvinceChange = async (value: number) => {
        // value 就是选中的省份的 id
        console.log('选中的省份id:', value);
        // 清空之前的城市和地区列表
        setCityList([]);
        setDictList([]);
        // 获取该省份下的城市列表
        const cityList = await getDistrictList(value);
        setCityList(cityList);
    }

    // 当选择城市时触发
    const handleCityChange = async (value: number) => {
        // 清空之前的地区列表
        setDictList([]);
        // 获取该城市下的地区列表
        const dictList = await getDistrictList(value);
        setDictList(dictList);
    }




    useEffect(() => {
        getProvinceList();
    }, [])
    return (
        <Card>
            <Form layout='inline'>
                <Form.Item >
                    <Select onChange={handleProvinceChange} className='mb' placeholder='请选择省' style={{ width: 180 }}>
                        {
                            provinceList?.map((province) => {
                                return (<Option key={province.id} value={province.value}>{province.name}</Option>)
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Select onChange={handleCityChange} placeholder='请选择市' style={{ width: 180 }}>
                        {
                            cityList?.map((city) => {
                                return  (<Option key={city.id} value={city.value}>{city.name}</Option>)
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
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
                <Form.Item>
                    <Input placeholder='医院名称' />
                </Form.Item>
                <Form.Item>
                    <Input placeholder='医院编号' />
                </Form.Item>
                <Form.Item>
                    <Select placeholder='医院类型' style={{ width: 180 }}>
                        <Option value="beijing">北京</Option>
                        <Option value="beijing">北京</Option>
                        <Option value="beijing">北京</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Select placeholder='医院状态' style={{ width: 180 }}>
                        <Option value="beijing">北京</Option>
                        <Option value="beijing">北京</Option>
                        <Option value="beijing">北京</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type='primary' htmlType='submit'>查询</Button>
                        <Button disabled>清空</Button>
                    </Space>
                </Form.Item>
            </Form>

            <Table
                className='mt'
                columns={columns}
            />
        </Card>
    )
}
