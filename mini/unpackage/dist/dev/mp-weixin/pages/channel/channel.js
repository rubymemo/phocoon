"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_g_collapse_text2 = common_vendor.resolveComponent("g-collapse-text");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_g_tabbar2 = common_vendor.resolveComponent("g-tabbar");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_uni_notice_bar2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_g_collapse_text2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_g_tabbar2 + _easycom_z_paging2)();
}
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_g_collapse_text = () => "../../components/g-collapse-text/index.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_g_tabbar = () => "../../components/g-tabbar/index.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_uni_notice_bar + _easycom_uni_th + _easycom_uni_tr + _easycom_g_collapse_text + _easycom_uni_td + _easycom_uni_table + _easycom_g_tabbar + _easycom_z_paging)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "channel",
  setup(__props) {
    const TabList = [
      {
        value: "1",
        label: "推广邀请码"
      },
      {
        value: "0",
        label: "子渠道列表"
      }
    ];
    const tabValue = common_vendor.ref(TabList[0].value);
    const tabList = common_vendor.ref(TabList);
    const paging = common_vendor.ref();
    const channelCount = common_vendor.ref("0");
    const channelName = common_vendor.ref("");
    const shareCode = common_vendor.ref("");
    common_vendor.ref([
      { title: "子渠道", prop: "channelName", align: "left" },
      { title: "推广游戏", prop: "gameName", align: "center" }
    ]);
    const sonChannelProfitsTotal = common_vendor.ref(null);
    const profitsTotal = common_vendor.ref(null);
    const hanldeCopyCode = () => {
      if (!shareCode.value)
        return;
      common_vendor.index.setClipboardData({
        data: shareCode.value,
        //要被复制的内容
        success: () => {
          common_vendor.index.showToast({
            //提示
            title: "复制成功"
          });
        }
      });
    };
    const dataList = common_vendor.ref([]);
    common_vendor.onBeforeMount(() => {
      getData();
      console.log("onBeforeMount");
    });
    const handleTabClick = (item) => {
      console.log(item);
      tabValue.value = item.value;
    };
    const getCode = () => {
      common_utils.httpsRequest("/api/invitation/getShareCode", {}).then((sharecodeRes) => {
        if (sharecodeRes) {
          shareCode.value = sharecodeRes.shareCode || "";
          channelCount.value = sharecodeRes.channelCount || "0";
          channelName.value = sharecodeRes.channelName || "-";
        }
      });
    };
    const getData = async () => {
      getCode();
      const res = await common_utils.httpsRequest("/api/channel/querySonChannels", {});
      sonChannelProfitsTotal.value = res.channelProfitsSplitTotal;
      profitsTotal.value = res.profitsTotal;
      dataList.value = res.sonChannels;
      paging.value.complete(res.sonChannels || []);
    };
    const onRefresh = () => {
      console.log("下拉刷新");
      getData();
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
        b: common_vendor.p({
          text: "注释:每个合作商可以获取子渠道推广收益的10%",
          single: true
        }),
        c: tabValue.value === "0"
      }, tabValue.value === "0" ? {
        d: common_vendor.t(profitsTotal.value || 0),
        e: common_vendor.t(sonChannelProfitsTotal.value || 0)
      } : {}, {
        f: tabValue.value === "0"
      }, tabValue.value === "0" ? {
        g: common_vendor.p({
          align: "center",
          width: "80px"
        }),
        h: common_vendor.p({
          align: "center",
          width: "90px"
        }),
        i: common_vendor.p({
          align: "center",
          width: "70px"
        }),
        j: common_vendor.p({
          align: "center",
          width: "90px"
        }),
        k: common_vendor.f(dataList.value, (item, index, i0) => {
          return {
            a: "b6f1e1b5-10-" + i0 + "," + ("b6f1e1b5-9-" + i0),
            b: common_vendor.p({
              text: item.channelName,
              width: 70
            }),
            c: "b6f1e1b5-9-" + i0 + "," + ("b6f1e1b5-8-" + i0),
            d: "b6f1e1b5-12-" + i0 + "," + ("b6f1e1b5-11-" + i0),
            e: common_vendor.p({
              text: item.gameName,
              width: 84
            }),
            f: "b6f1e1b5-11-" + i0 + "," + ("b6f1e1b5-8-" + i0),
            g: common_vendor.t(item.sonProfits || 0),
            h: "b6f1e1b5-13-" + i0 + "," + ("b6f1e1b5-8-" + i0),
            i: common_vendor.t(item.channelProfitSplit || 0),
            j: "b6f1e1b5-14-" + i0 + "," + ("b6f1e1b5-8-" + i0),
            k: index,
            l: "b6f1e1b5-8-" + i0 + ",b6f1e1b5-2"
          };
        }),
        l: common_vendor.p({
          align: "center"
        }),
        m: common_vendor.p({
          align: "center"
        }),
        n: common_vendor.p({
          align: "center"
        }),
        o: common_vendor.p({
          align: "center"
        }),
        p: common_vendor.p({
          border: true,
          stripe: true,
          emptyText: "暂无更多数据"
        })
      } : tabValue.value === "1" ? common_vendor.e({
        r: common_vendor.t(channelCount.value),
        s: common_vendor.t(shareCode.value || "-"),
        t: shareCode.value
      }, shareCode.value ? {} : {}, {
        v: common_vendor.o(hanldeCopyCode),
        w: common_vendor.t(channelName.value)
      }) : {}, {
        q: tabValue.value === "1",
        x: common_vendor.p({
          current: 1
        }),
        y: common_vendor.sr(paging, "b6f1e1b5-0", {
          "k": "paging"
        }),
        z: common_vendor.o(onRefresh),
        A: common_vendor.p({
          ["refresher-only"]: true,
          ["auto-show-back-to-top"]: true,
          ["use-virtual-list"]: true
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b6f1e1b5"], ["__file", "/Users/huyi/Desktop/own-project/uni-apps/huang1/pages/channel/channel.vue"]]);
wx.createPage(MiniProgramPage);
