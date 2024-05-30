"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_g_collapse_text2 = common_vendor.resolveComponent("g-collapse-text");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_g_tabbar2 = common_vendor.resolveComponent("g-tabbar");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_uni_notice_bar2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_g_collapse_text2 + _easycom_uni_table2 + _easycom_g_tabbar2 + _easycom_z_paging2)();
}
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_g_collapse_text = () => "../../components/g-collapse-text/index.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_g_tabbar = () => "../../components/g-tabbar/index.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_uni_notice_bar + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_g_collapse_text + _easycom_uni_table + _easycom_g_tabbar + _easycom_z_paging)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "promotion",
  setup(__props) {
    const TabList = [
      {
        value: 0,
        label: "每日数据"
      },
      {
        value: 1,
        label: "每月数据"
      }
    ];
    const tabValue = common_vendor.ref(TabList[0].value);
    const tabList = common_vendor.ref(TabList);
    const paging = common_vendor.ref();
    const dataList = common_vendor.ref([]);
    const dataDayList = common_vendor.ref([]);
    const dataDayTotal = common_vendor.ref({
      activityUserNumTotal: 0,
      profitTotal: 0
    });
    const dataMonthList = common_vendor.ref([]);
    const dataMonthTotal = common_vendor.ref({
      activityUserNumTotal: 0,
      profitTotal: 0
    });
    common_vendor.onBeforeMount(() => {
      console.log("onBeforeMount");
    });
    const queryList = async (pageNo, pageSize) => {
      if (pageNo === 1) {
        const dayTotal = await common_utils.httpsRequest("/api/promotionProfit/queryPromotionProfitDayTotal", {});
        if (dayTotal) {
          dataDayTotal.value = dayTotal;
        }
        const monthTotal = await common_utils.httpsRequest("/api/promotionProfit/queryPromotionProfitMonthTotal ", {});
        if (monthTotal) {
          dataMonthTotal.value = monthTotal;
        }
      }
      if (tabValue.value == TabList[0].value) {
        const data = await common_utils.httpsRequest("/api/promotionProfit/queryForPagePromotionProfitDay", { pageNo, pageSize });
        console.log(data);
        if (data) {
          paging.value.complete(data.rows);
        }
      } else {
        const data = await common_utils.httpsRequest("/api/promotionProfit/queryForPagePromotionProfitMonth", { pageNo, pageSize });
        if (data) {
          paging.value.complete(data.rows);
        }
      }
    };
    const handleTabClick = (item) => {
      tabValue.value = item.value;
      if (item.value === TabList[0].value && dataDayList.value.length === 0 || item.value === TabList[1].value && dataMonthList.value.length === 0) {
        paging.value.reload();
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.n(`tab-item ${tabValue.value === item.value ? "active" : ""}`),
            c: common_vendor.o(($event) => handleTabClick(item))
          };
        }),
        b: common_vendor.p({
          text: tabValue.value === tabList.value[0].value ? "注释:每日更新昨天的推广数据" : "注释:每月1号更新上月的推广数据",
          single: true
        }),
        c: common_vendor.t((tabValue.value === tabList.value[0].value ? dataDayTotal.value.activityUserNumTotal : dataMonthTotal.value.activityUserNumTotal) || 0),
        d: common_vendor.t((tabValue.value === tabList.value[0].value ? dataDayTotal.value.profitTotal : dataMonthTotal.value.profitTotal) || 0),
        e: common_vendor.p({
          align: "center",
          width: "105px"
        }),
        f: common_vendor.p({
          align: "center",
          width: "90px"
        }),
        g: common_vendor.p({
          align: "center",
          width: "70px"
        }),
        h: common_vendor.p({
          align: "center",
          width: "70px"
        }),
        i: common_vendor.f(dataList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.promotionDate),
            b: "aa33071c-9-" + i0 + "," + ("aa33071c-8-" + i0),
            c: "aa33071c-11-" + i0 + "," + ("aa33071c-10-" + i0),
            d: common_vendor.p({
              text: item.gameName || "-",
              width: 80
            }),
            e: "aa33071c-10-" + i0 + "," + ("aa33071c-8-" + i0),
            f: common_vendor.t(item.activityUserNum || 0),
            g: "aa33071c-12-" + i0 + "," + ("aa33071c-8-" + i0),
            h: common_vendor.t(item.profit),
            i: "aa33071c-13-" + i0 + "," + ("aa33071c-8-" + i0),
            j: index,
            k: "aa33071c-8-" + i0 + ",aa33071c-2"
          };
        }),
        j: common_vendor.p({
          align: "center",
          width: 100
        }),
        k: common_vendor.p({
          align: "center",
          width: 100
        }),
        l: common_vendor.p({
          align: "center",
          width: 70
        }),
        m: common_vendor.p({
          align: "center",
          width: 70
        }),
        n: common_vendor.p({
          border: true,
          stripe: true,
          emptyText: "暂无更多数据"
        }),
        o: tabValue.value === tabList.value[0].value,
        p: common_vendor.p({
          align: "center",
          width: "100px"
        }),
        q: common_vendor.p({
          align: "center",
          width: "100px"
        }),
        r: common_vendor.p({
          align: "center",
          width: "70px"
        }),
        s: common_vendor.p({
          align: "center",
          width: "70px"
        }),
        t: common_vendor.f(dataList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.promotionDate),
            b: "aa33071c-21-" + i0 + "," + ("aa33071c-20-" + i0),
            c: "aa33071c-23-" + i0 + "," + ("aa33071c-22-" + i0),
            d: common_vendor.p({
              text: item.gameName || "-",
              width: 80
            }),
            e: "aa33071c-22-" + i0 + "," + ("aa33071c-20-" + i0),
            f: common_vendor.t(item.activityUserNum || 0),
            g: "aa33071c-24-" + i0 + "," + ("aa33071c-20-" + i0),
            h: common_vendor.t(item.profit),
            i: "aa33071c-25-" + i0 + "," + ("aa33071c-20-" + i0),
            j: index,
            k: "aa33071c-20-" + i0 + ",aa33071c-14"
          };
        }),
        v: common_vendor.p({
          align: "center"
        }),
        w: common_vendor.p({
          align: "center",
          width: 100
        }),
        x: common_vendor.p({
          align: "center"
        }),
        y: common_vendor.p({
          align: "center"
        }),
        z: common_vendor.p({
          border: true,
          stripe: true,
          emptyText: "暂无更多数据"
        }),
        A: tabValue.value === tabList.value[1].value,
        B: common_vendor.p({
          current: 2
        }),
        C: common_vendor.sr(paging, "aa33071c-0", {
          "k": "paging"
        }),
        D: common_vendor.o(queryList),
        E: common_vendor.o(($event) => dataList.value = $event),
        F: common_vendor.p({
          ["use-virtual-list"]: true,
          ["auto-show-back-to-top"]: true,
          ["refresher-enabled"]: true,
          ["loading-more-title-custom-style"]: "",
          ["show-loading-more-no-more-view"]: false,
          ["show-default-loading-more-text"]: false,
          ["show-loading-more-no-more-line"]: false,
          ["hide-empty-view"]: true,
          ["default-page-size"]: 40,
          modelValue: dataList.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-aa33071c"], ["__file", "/Users/huyi/Desktop/own-project/uni-apps/huang1/pages/promotion/promotion.vue"]]);
wx.createPage(MiniProgramPage);
