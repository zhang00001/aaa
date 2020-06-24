import http from '@/utils/httpRequest'
import qs from 'qs'

export default {

    /** 新增图片组  **/
    imagegroupSave(param) {
        return http.post(http.adornUrl("/componet/imagegroup/save"), param);
    },
    /** 图片组  修改 **/
    imagegroupUpdate(param) {
        return http.put(http.adornUrl("/componet/imagegroup/update"), param);
    },
    /**图片分组列表 */
    imagegroupList(param) {
        return http.get(http.adornUrl("/componet/imagegroup/list/all"), { params: param });

    },
    /**删除图片组*/
    imagegroupDel(param) {
        return http.delete(http.adornUrl(`/componet/imagegroup/delete/${param}`));
    },
    /**加载分组下的图片 */
    imagedepositoryList(param) {
        return http.get(http.adornUrl(`/componet/imagedepository/list/all/${param}`));

    },
    imagedepositoryUpdate(param1, param2) {
        return http.put(http.adornUrl(`/componet/imagedepository/update/${param1}`), param2);

    },
    /**删除图片*/
    imagedepositoryDel(param) {
        return http.delete(http.adornUrl(`/componet/imagedepository/delete`), { data: param });
    },

    /**修改图片名称*/
    imagedepositoryUpdateOne(param) {
        return http.put(http.adornUrl("/componet/imagedepository/update/one"), param);
    },

    /**获取菜单 */
    menuSelect(param) {
        return http.get(http.adornUrl(`/sly/column/select`), param);

    },
    /**获取部门树 */
    policedept(param) {
        return http.get(http.adornUrl(`/sly/policedept/list`), param);

    },



}