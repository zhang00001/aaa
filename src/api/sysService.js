import http from '@/utils/httpRequest'
export default {

    /** 字典表  列表 **/
    bizcatelog(param) {
        return http.get(http.adornUrl("/sys/bizcatelog/list"), { params: param });
    },
    /** 字典表  新增 **/
    bizcatelogSave(param) {
        return http.post(http.adornUrl("/sys/bizcatelog/save"), param);
    },
    /** 字典表 修改 **/
    bizcatelogUpdate(param) {
        return http.put(http.adornUrl("/sys/bizcatelog/update"), param);
    },
    /** 字典表  删除 **/
    bizcatelogDel(param) {
        return http.delete(http.adornUrl("/sys/bizcatelog/delete"), { data: param });

    },
    /** 字典表 -子选项  列表 **/
    bizlibraryList(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/list"), { params: param });
    },
    bizlibrarySave(param) {
        return http.post(http.adornUrl("/sys/bizlibrary/save"), param);
    },
    /** 字典表 修改 **/
    bizlibraryUpdate(param) {
        return http.put(http.adornUrl("/sys/bizlibrary/update"), param);
    },
    /** 字典表  删除 **/
    bizlibraryDel(param) {
        return http.delete(http.adornUrl("/sys/bizlibrary/delete"), { data: param });

    },



    /**获取网站设置 */
    configInfo(param) {
        return http.get(http.adornUrl("/componet/config/info"), { params: param });
    },
    configSave(param) {
        return http.post(http.adornUrl("/componet/config/save"), param);
    },
    configUpdate(param) {
        return http.put(http.adornUrl("/componet/config/update"), param);
    },
    getFonts(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/netFont"), param);
    },



    /**图片 */
    pictureList(param) {
        return http.get(http.adornUrl("/componet/picture/list"), { params: param });
    },
    pictureSave(param) {
        return http.post(http.adornUrl("/componet/picture/save"), param);
    },
    pictureUpdate(param) {
        return http.put(http.adornUrl("/componet/picture/update"), param);
    },
    pictureDel(param) {
        return http.delete(http.adornUrl("/componet/picture/delete"), { data: param });

    },
    /**产品 */

    /**级联选择 */



    columnProduct(param) {
        return http.get(http.adornUrl("/sly/column/product"), { params: param });
    },
    productList(param) {
        return http.get(http.adornUrl("/sly/product/list"), { params: param });
    },
    productInfo(param) {
        return http.get(http.adornUrl(`/sly/product/info/${param}`));
    },

    productSave(param) {
        return http.post(http.adornUrl("/sly/product/save"), param);
    },
    productUpdate(param) {
        return http.put(http.adornUrl("/sly/product/update"), param);
    },
    productDel(param) {
        return http.delete(http.adornUrl("/sly/product/delete"), { data: param });

    },

    /**热门关键字 */


    keysearchList(param) {
        return http.get(http.adornUrl("/sly/keysearch/list"), { params: param });
    },


    keysearchSave(param) {
        return http.post(http.adornUrl("/sly/keysearch/save"), param);
    },
    keysearchUpdate(param) {
        return http.put(http.adornUrl("/sly/keysearch/update"), param);
    },
    keysearchDel(param) {
        return http.delete(http.adornUrl("/sly/keysearch/delete"), { data: param });

    },

    /**合作伙伴 */

    phList(param) {
        return http.get(http.adornUrl("/sly/ph/list"), { params: param });
    },


    phSave(param) {
        return http.post(http.adornUrl("/sly/ph/save"), param);
    },
    phUpdate(param) {
        return http.put(http.adornUrl("/sly/ph/update"), param);
    },
    phDel(param) {
        return http.delete(http.adornUrl("/sly/ph/delete"), { data: param });

    },
    /**留言 */
    onlinemessageList(param) {
        return http.get(http.adornUrl("/sly/onlinemessage/list"), { params: param });

    },
    onlinemessageUpdate(param) {
        return http.put(http.adornUrl("/sly/onlinemessage/update"), param);
    },
    onlinemessageDel(param) {
        return http.delete(http.adornUrl("/sly/onlinemessage/delete"), { data: param });

    },

    /**首页 */
    blankList(param) {
        return http.post(http.adornUrl("/back/blank/list"), param);
    },

    /**栏目 */

    columnList(param) {
        return http.get(http.adornUrl("/sly/column/list"), { params: param });
    },


    columnSave(param) {
        return http.post(http.adornUrl("/sly/column/save"), param);
    },
    columnUpdate(param) {
        return http.put(http.adornUrl("/sly/column/update"), param);
    },
    columnDel(param) {
        return http.delete(http.adornUrl(`/sly/column/delete/${param}`));

    },
    columnInfo(param) {
        return http.get(http.adornUrl(`/sly/column/info/${param}`));
    },


    /**栏目中读字典表 */
    getColumnLocation(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/columnLocation"), param);
    },
    getColumnModel(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/columnModel"), param);
    },
    getYesno(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/yesno"), param);
    },
    getColumnType(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/columnType"), param);
    },
    getColumnTag(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/columnTag"), param);
    },
    getNetLogo(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/netLogo"), param);
    },
    getHomeColumn(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/homeColumn"), param);
    },



    getYearSelect(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/yearSelect"), param);
    },
    getMatchType(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/matchType"), param);
    },
    getUeditorType(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/ueditorType"), param);
    },
    getContentType(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/contentType"), param);
    },
    getProjectCase(param) {
        return http.get(http.adornUrl("/sys/bizlibrary/infoList/projectCase"), param);
    },



    /**内容 */
    contentList(param) {
        return http.get(http.adornUrl("/sly/content/list"), { params: param });
    },


    contentSave(param) {
        return http.post(http.adornUrl("/sly/content/save"), param);
    },
    contentUpdate(param) {
        return http.put(http.adornUrl("/sly/content/update"), param);
    },
    contentDel(param) {
        return http.delete(http.adornUrl(`/sly/content/delete`), { data: param });

    },
    contentInfo(param) {
        return http.get(http.adornUrl(`/sly/content/info/${param}`));
    },
    /**水印配置 */
    configPainter(param) {
        return http.get(http.adornUrl(`/sys/oss/config/painter`));
    },
    configPainterSave(param) {
        return http.post(http.adornUrl(`/sys/oss/saveConfig/painter`), param);
    },

    policenetworkSave(param) {
        return http.post(http.adornUrl(`/sly/policenetwork/save`), param);
    },
    policenetworkUpdate(param) {
        return http.put(http.adornUrl(`/sly/policenetwork/update`), param);
    },

    policenetworkList(param) {
        return http.get(http.adornUrl(`/sly/policenetwork/list`), { params: param });
    },
    policenetworkInfo(param) {
        return http.get(http.adornUrl(`/sly/policenetwork/info/${param}`));
    },
    policenetworkDel(param) {
        return http.post(http.adornUrl(`/sly/policenetwork/delete`), param);
    },
}