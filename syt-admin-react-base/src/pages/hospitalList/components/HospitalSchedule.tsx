import { Button, Card, Col, Pagination, Row, Table, Tag, Tree, TreeDataNode } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import type { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Id } from '@reduxjs/toolkit/dist/tsHelpers';
import { getDepartmentList, getDoctorList, getScheduleList } from '@/api/user/hospitalList';
import { IBookingScheduleList, IDepartmentList, IDoctorList } from '@/api/user/model/hospitalListTypes';


let height = document.documentElement.clientHeight - 180; // 根据可视区高度计算 div高度
export default function HospitalSchedule() {

    const columns: ColumnsType<any> = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render(value: any, row: any, index: number) {
                return (index + 1);
            }
        },
        {
            title: '职称',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: '号源时间',
            dataIndex: 'workDate',
            key: 'workDate'
        },
        {
            title: '总预约数',
            dataIndex: 'reservedNumber',
            key: 'reservedNumber'
        },
        {
            title: '剩余预约数',
            dataIndex: 'availableNumber',
            key: 'availableNumber'
        },
        {
            title: '挂号费(元)',
            dataIndex: 'amount',
            key: 'amount'
        },
        {
            title: '擅长技能',
            dataIndex: 'skill',
            key: 'skill'
        }
    ];
    const { hoscode } = useParams();
    const navigate = useNavigate();
    let [departmentList, setDepartmentList] = useState<IDepartmentList>([]);
    let [expandedKeys, setExpandedKeys] = useState<string[]>([]);// 一级科室depcode组成的数组
    let [depname, setDepname] = useState<string>();
    let [depcode, setDepcode] = useState<string>();

    let [current, setCurrent] = useState<number>(1);
    let [pageSize, setPageSize] = useState<number>(3);
    let [total, setTotal] = useState<number>(10);
    let [bookingScheduleList, setBookingScheduleList] = useState<IBookingScheduleList>([]);

    let [hosname, setHosname] = useState<string>();
    let [workDate, setWorkDate] = useState<string>();
    // 医生列表
    let [doctorList, setDoctorList] = useState<IDoctorList>([]);

    const _getDepartmentList = async () => {


        const resp = await getDepartmentList(String(hoscode))
        console.log(resp)
        // 禁用一级科室树节点，就是给所有的一级科室对象，添加一个disabled:true
        const processedList = resp.map(item => {
            item.disabled = true; // 禁用一级科室树节点
            return item;
        })
        // 展开所有的一级科室
        // 1. 获取所有一级科室 depcode组成的数组
        let expandedKeys = resp.map(item => item.depcode)
        console.log('expandedKeys', expandedKeys);
        setExpandedKeys(expandedKeys);
        setDepartmentList(processedList);// 设置科室列表状态数据

        // 处理默认选中科室
        let depname = (resp[0].children as IDepartmentList)[0].depname;
        let depcode = (resp[0].children as IDepartmentList)[0].depcode;
        // console.log(depname);
        // console.log(depcode);
        // 设置科室名和科室code状态
        setDepname(depname);
        setDepcode(depcode);


        setDepartmentList(resp)
    }


    // 添加 onSelect 处理函数
    const onSelect = (selectedKeys: React.Key[], info: any) => {
        // 获取选中节点的信息
        const { node } = info;

        // 如果点击的是非禁用节点（二级科室）
        if (!node.disabled) {
            setDepcode(node.key as string);
            setDepname(node.depname);
        }



    };
    //获取医院科室 排班日期数据
    const _getScheduleList = async () => {
        let { total, bookingScheduleList, baseMap: { hosname } } = await getScheduleList(current, pageSize, hoscode as string, depcode as string);
        setTotal(total);
        setBookingScheduleList(bookingScheduleList);
        setHosname(hosname);
        // 设置排班日期状态
        setWorkDate(bookingScheduleList[0].workDate);
    }
    // 获取排班医生列表数据
    const _getDoctorList = async () => {
        let doctorList = await getDoctorList(hoscode as string, depcode as string, workDate as string);
        // console.log('doctorList: ', doctorList);
        setDoctorList(doctorList);
    }


    useEffect(() => {
        hoscode && _getDepartmentList();
    }, [])

    useEffect(() => {
        depcode && _getScheduleList();
    }, [depcode, current, pageSize])


    useEffect(()=>{// 组件挂载完成之后执行 + workDate变化后执行
        workDate && _getDoctorList();
    }, [workDate]);
    

    return (
        <Card>
            <div>选择：{hosname} / {depname} / {workDate}</div>
            <Row className='mt' gutter={30}>
                <Col span={5} >
                    <div style={{ border: '1px soild #ddd', height, overflowY: 'scroll' }}>
                        <Tree
                            checkable={false}
                            // onSelect={onSelect}
                            // onCheck={onCheck}
                            treeData={departmentList as []}
                            //字段和数据的映射
                            fieldNames={{
                                title: 'depname',
                                key: 'depcode'
                            }}
                            //设置展开节点的数组
                            expandedKeys={expandedKeys}
                            //当前选中的菜单项 key 数组
                            selectedKeys={[depcode as string]}
                            onSelect={onSelect}  /* 添加 onSelect 处理函数 */

                        />
                    </div>

                </Col>
                <Col span={19}>
                    {bookingScheduleList.map((item, index) => (
                        <Tag color={workDate === item.workDate ? 'green' : ''} key={item.workDate} onClick={() => {
                            setWorkDate(item.workDate);
                        }}>
                            <div>{item.workDate} {item.dayOfWeek}</div>
                            <div>{item.availableNumber} / {item.reservedNumber}</div>
                        </Tag>
                    ))}
                    <Pagination
                        className='mt'
                        current={current}
                        total={total}
                        pageSize={pageSize}
                        onChange={(page: number, pageSize) => {
                            setCurrent(page);
                            setPageSize(pageSize);
                        }}
                    />
                    <Table
                        className='mt'
                        pagination={false}
                        columns={columns}
                        rowKey={'id'}
                        dataSource={doctorList}
                    />
                     <Button className='mt' onClick={()=>navigate(-1)}>返回</Button>
                </Col>

            </Row>
        </Card>
    )
}
