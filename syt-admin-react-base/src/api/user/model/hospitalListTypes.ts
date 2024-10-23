/**
 * 省市区 返回数据 对象类型
 */
export interface IDistrictItem {
    id: number;
    createTime: string;
    updateTime: string;
    name: string;
    value: string;
    hasChildren: boolean;
}
/**
 * 省市区列表类型，也是获取省市区列表接口的返回值类型
 */
export type IDistrictList = IDistrictItem[]

