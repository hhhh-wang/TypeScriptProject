import { Button, Card, Col, Pagination, Row, Table, Tag, Tree, TreeDataNode } from 'antd'
import { ColumnsType } from 'antd/lib/table';
import type { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Id } from '@reduxjs/toolkit/dist/tsHelpers';
import { getDepartmentList } from '@/api/user/hospitalList';
import { IDepartmentList } from '@/api/user/model/hospitalListTypes';


let height = document.documentElement.clientHeight - 180; // 根据可视区高度计算 div高度
export default function HospitalSchedule() {
    const treeData: TreeDataNode[] = [
        {
            title: 'parent 1',
            key: '0-0',
            children: [
                {
                    title: 'parent 1-0',
                    key: '0-0-0',
                    disabled: true,
                    children: [
                        {
                            title: 'leaf',
                            key: '0-0-0-0',
                            disableCheckbox: true,
                        },
                        {
                            title: 'leaf2',
                            key: '0-0-0-1',
                        },
                        {
                            title: 'leaf3',
                            key: '0-0-0-2',
                        },
                        {
                            title: 'leaf4',
                            key: '0-0-0-3',
                        },
                        {
                            title: 'leaf5',
                            key: '0-0-0-4',
                        },
                        {
                            title: 'leaf6',
                            key: '0-0-0-5',
                        },

                    ],
                },
                {
                    title: 'parent 1-1',
                    key: '0-0-1',
                    children: [{ title: <span style={{ color: '#1677ff' }}>sss</span>, key: '0-0-1-0' }],
                },
            ],
        },
    ];


    const { hoscode } = useParams();

    let [departmentList, setDepartmentList] = useState<IDepartmentList>([]);
    let [expandedKeys, setExpandedKeys] = useState<string[]>([]);// 一级科室depcode组成的数组
    let [depname, setDepname] = useState<string>();
    let [depcode, setDepcode] = useState<string>();
    const _getDepartmentList = async () => {
        const resp = await getDepartmentList(String(hoscode))
        console.log(resp)
        // 禁用一级科室树节点，就是给所有的一级科室对象，添加一个disabled:true
        departmentList = departmentList.map(item => {
            item.disabled = true;
            return item;
        })
        // 展开所有的一级科室
        // 1. 获取所有一级科室 depcode组成的数组
        let expandedKeys = departmentList.map(item=>item.depcode)
        console.log('expandedKeys', expandedKeys);
        setExpandedKeys(expandedKeys);
        setDepartmentList(departmentList);// 设置科室列表状态数据

        // 处理默认选中科室
        let depname = (departmentList[0].children as IDepartmentList)[0].depname;
        let depcode = (departmentList[0].children as IDepartmentList)[0].depcode;
        // console.log(depname);
        // console.log(depcode);
        // 设置科室名和科室code状态
        setDepname(depname);
        setDepcode(depcode);


        setDepartmentList(resp)
    }

    useEffect(() => {
        hoscode && _getDepartmentList();
    }, [])


    return (
        <Card>
            <div>选择：北京人民医院 / 多发性硬化专科门诊 / 2024-10-28</div>
            <Row className='mt' gutter={30}>
                <Col span={5} >
                    <div style={{ border: '1px soild #ddd', height, overflowY: 'scroll' }}>
                        <Tree
                            checkable
                            // defaultExpandedKeys={['0-0-0', '0-0-1']}
                            // defaultSelectedKeys={['0-0-0', '0-0-1']}
                            // defaultCheckedKeys={['0-0-0', '0-0-1']}
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
                        />
                    </div>

                </Col>



                <Col span={19}>
                    <Tag color="green">
                        <div>2023-07-28 周五</div>
                        <div>38 / 100</div>
                    </Tag>
                    <Tag>
                        <div>2023-07-28 周五</div>
                        <div>38 / 100</div>
                    </Tag>
                    <Tag>
                        <div>2023-07-28 周五</div>
                        <div>38 / 100</div>
                    </Tag>
                    <Pagination
                        //分页
                        defaultCurrent={6}
                        total={500}
                        className='mt'
                    />

                    <Table
                        className='mt'
                        pagination={false}
                    // columns={columns}
                    />
                    <Button className='mt'>返回</Button>
                </Col>

            </Row>



        </Card>
    )
}
