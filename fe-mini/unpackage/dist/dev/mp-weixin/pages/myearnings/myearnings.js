"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_uni_col2 = common_vendor.resolveComponent("uni-col");
  const _easycom_uni_row2 = common_vendor.resolveComponent("uni-row");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_g_collapse_text2 = common_vendor.resolveComponent("g-collapse-text");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_g_tabbar2 = common_vendor.resolveComponent("g-tabbar");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_uni_col2 + _easycom_uni_row2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_g_collapse_text2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_g_tabbar2 + _easycom_z_paging2)();
}
const _easycom_uni_col = () => "../../uni_modules/uni-row/components/uni-col/uni-col.js";
const _easycom_uni_row = () => "../../uni_modules/uni-row/components/uni-row/uni-row.js";
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_g_collapse_text = () => "../../components/g-collapse-text/index.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_g_tabbar = () => "../../components/g-tabbar/index.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_uni_col + _easycom_uni_row + _easycom_uni_th + _easycom_uni_tr + _easycom_g_collapse_text + _easycom_uni_td + _easycom_uni_table + _easycom_g_tabbar + _easycom_z_paging)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "myearnings",
  setup(__props) {
    const TabList = [
      {
        value: "1",
        label: "推广链接"
      },
      {
        value: "0",
        label: "我的收益"
      }
    ];
    const tabValue = common_vendor.ref("1");
    const tabList = common_vendor.ref(TabList);
    const paging = common_vendor.ref();
    const incomeCardList = common_vendor.ref([
      { tit: "上周总收入", value: "", name: "lastWeekProfitTotal" },
      { tit: "累计总收入", value: "", name: "totalProfitTotal" },
      { tit: "累计已提现收入", value: "", color: "#6DB6FE", name: "totalWithdrawalTotal" },
      { tit: "累计未结算收入", value: "", color: "#6DB6FE", name: "withdrawalTotal" }
    ]);
    const incomeValues = common_vendor.ref({
      lastWeekProfitTotal: 0,
      totalProfitTotal: 0,
      totalWithdrawalTotal: 0,
      withdrawalTotal: 0,
      isActive: false
    });
    const dataList = common_vendor.ref([]);
    common_vendor.onBeforeMount(() => {
      console.log("onBeforeMount");
    });
    const handleTabClick = (item) => {
      console.log(item);
      tabValue.value = item.value;
    };
    const getCardList = async () => {
      const data = await common_utils.httpsRequest("/api/promotionProfit/queryMyPromotionProfit", {});
      if (data) {
        incomeValues.value = data;
      }
    };
    const queryList = async (pageNo, pageSize) => {
      if (pageNo === 1) {
        getCardList();
      }
      const data = await common_utils.httpsRequest("/api/channelGameRelation/queryForPagePromotionUrls", {
        pageNo,
        pageSize
      });
      if (data) {
        paging.value.complete(data.rows);
      }
    };
    const handleCopyClick = (copystr) => {
      if (!copystr)
        return;
      common_vendor.index.setClipboardData({
        data: copystr,
        //要被复制的内容
        success: () => {
          common_vendor.index.showToast({
            //提示
            title: "复制成功"
          });
        }
      });
    };
    const withdrawal = async () => {
      if (incomeValues.value.withdrawalTotal < 1e3) {
        common_vendor.index.showModal({
          title: "提示",
          content: "对不起，您的提现金额暂时达不到可提现标准，请您继续努力",
          confirmText: "确定",
          showCancel: false,
          success: (res) => {
          }
        });
      } else if (!incomeValues.value.isActive) {
        common_vendor.index.showModal({
          title: "提示",
          content: "您已经有正在提现单的单子，暂时无法再次提现，请联系客户",
          confirmText: "确定",
          showCancel: false,
          success: (res) => {
          }
        });
      } else {
        const data = await common_utils.httpsRequest("/api/settlementRecord/applySettlement", {
          applySettlementAmount: incomeValues.value.withdrawalTotal
        });
        if (data) {
          common_vendor.index.showModal({
            title: "提示",
            content: "恭喜您已经申请提现，请关注公众号：微小游推广助手，回复“结算”，官方将主动联系您打款结算。",
            confirmText: "确定",
            showCancel: false,
            success: (res) => {
            }
          });
          paging.value && paging.value.reload();
        }
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.n(`tab-item ${tabValue.value === item.value ? "active" : ""}`),
            c: common_vendor.o(($event) => handleTabClick(item))
          };
        }),
        b: tabValue.value === "0"
      }, tabValue.value === "0" ? {
        c: common_vendor.f(incomeCardList.value, (carditem, index, i0) => {
          return {
            a: common_vendor.t(carditem.tit),
            b: common_vendor.t(incomeValues.value[carditem.name] || 0),
            c: carditem.color || void 0,
            d: index,
            e: "076cbd96-2-" + i0 + ",076cbd96-1"
          };
        }),
        d: common_vendor.p({
          span: 12
        }),
        e: common_vendor.p({
          gutter: 20
        }),
        f: common_vendor.o(withdrawal)
      } : tabValue.value === "1" ? {
        h: common_vendor.p({
          align: "center",
          width: "95px"
        }),
        i: common_vendor.p({
          align: "center",
          width: "80px"
        }),
        j: common_vendor.p({
          align: "center",
          width: "100px"
        }),
        k: common_vendor.f(dataList.value, (item, index, i0) => {
          return {
            a: "076cbd96-10-" + i0 + "," + ("076cbd96-9-" + i0),
            b: common_vendor.p({
              text: item.gameName || "-",
              width: 80
            }),
            c: "076cbd96-9-" + i0 + "," + ("076cbd96-8-" + i0),
            d: common_vendor.t(item.profitModel),
            e: "076cbd96-11-" + i0 + "," + ("076cbd96-8-" + i0),
            f: common_vendor.t(item.promotionUrl),
            g: common_vendor.o(($event) => handleCopyClick(item.promotionUrl), index),
            h: "076cbd96-12-" + i0 + "," + ("076cbd96-8-" + i0),
            i: index,
            j: "076cbd96-8-" + i0 + ",076cbd96-3"
          };
        }),
        l: common_vendor.p({
          border: true,
          stripe: true,
          emptyText: "暂无更多数据"
        })
      } : {}, {
        g: tabValue.value === "1",
        m: common_vendor.p({
          current: 3
        }),
        n: common_vendor.sr(paging, "076cbd96-0", {
          "k": "paging"
        }),
        o: common_vendor.o(queryList),
        p: common_vendor.o(($event) => dataList.value = $event),
        q: common_vendor.p({
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
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-076cbd96"], ["__file", "/Users/huyi/Desktop/own-project/uni-apps/huang1/pages/myearnings/myearnings.vue"]]);
wx.createPage(MiniProgramPage);
