import { request } from "@utils/http"
import { IDepartmentList, IDistrictList, IHospitalDetail, IHospitalListParams, IHospitalListResponse } from "./model/hospitalListTypes"
/**
 * 根据id 获取省市区列表
 * @param id  86 省  
 * @returns 
 */
export const getDistrictList = (id: number) => {
    return request.get<any, IDistrictList>('/admin/cmn/dict/findByParentId/' + id)
}

/**
 * 获取医院列表分页数据api方法
 * @param param0 
 * @returns 
 */
export const getHospitalList = ({page,limit,hoscode,hosname,hostype,provinceCode,cityCode,districtCode,status}:IHospitalListParams)=>{
    return request.get<any, IHospitalListResponse>(`/admin/hosp/hospital/${page}/${limit}`, {
        params:{
            hoscode,
            hosname,
            hostype,
            provinceCode,
            cityCode,
            districtCode,
            status
        }
    })
}
/**
 * 通过id 获取医院详情数据
 * @param id 
 * @returns Promise<IHospitalDetail>
 */
export const getHospitalDetail = (id:string)=>{
    return request.get<any, IHospitalDetail>(`/admin/hosp/hospital/show/${id}`)
}
/**
 * 修改医院上下线状态
 * @param id 
 * @param status 
 * @returns 
 */
export const changeStatus = (id:string, status:number)=>{
    return request.get<any,null>(`/admin/hosp/hospital/updateStatus/${id}/${status}`);
}
/**
 * 根据医院编号 hoscode 获取医院科室列表
 * @param hoscode 
 * @returns 
 */
export const getDepartmentList = (hoscode:string)=>{
    return request.get<any, IDepartmentList>(`/admin/hosp/department/${hoscode}`)
}