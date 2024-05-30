"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_g_tabbar2 = common_vendor.resolveComponent("g-tabbar");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_notice_bar2 + _easycom_uni_search_bar2 + _easycom_uni_tag2 + _easycom_uni_list_item2 + _easycom_g_tabbar2 + _easycom_z_paging2 + _easycom_uni_popup2)();
}
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_g_tabbar = () => "../../components/g-tabbar/index.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_notice_bar + _easycom_uni_search_bar + _easycom_uni_tag + _easycom_uni_list_item + _easycom_g_tabbar + _easycom_z_paging + _easycom_uni_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "home",
  setup(__props) {
    const textColorMap = {
      "动作": {
        // color: '#007357',
        color: "#000",
        backgroundColor: "#DFF7E2"
      },
      "角色": {
        // color: '#900060',
        color: "#000",
        backgroundColor: "#ffe1f5"
      },
      "竞技": {
        // color: '#1a64e6',
        color: "#000",
        backgroundColor: "#d6e2f7"
      },
      "休闲": {
        // color: '#065861',
        color: "#000",
        backgroundColor: "#bfeef3"
      },
      "棋牌": {
        // color: '#4c2500',
        color: "#000",
        backgroundColor: "#ffd2a8"
      },
      "其他": {
        // color: '#67080d',
        color: "#000",
        backgroundColor: "#ffcacd"
      }
    };
    const popup = common_vendor.ref();
    const popupInfo = common_vendor.ref({
      title: "",
      context: ""
    });
    const noticeList = common_vendor.ref([]);
    const getMore = (info) => {
      console.log(info.context);
      const str = JSON.stringify(info.context);
      console.log(str);
      const list = str.split(">>");
      console.log(list);
      popupInfo.value = info;
      popup.value.open();
    };
    const dataList = common_vendor.ref([]);
    const paging = common_vendor.ref(null);
    const searchValue = common_vendor.ref("");
    const upTime = common_vendor.computed(() => {
      const time = popupInfo.value.createDate || popupInfo.value.modifyDate;
      if (time)
        return time.split(" ")[0];
      return "";
    });
    common_vendor.onBeforeMount(() => {
    });
    const search = () => {
      paging.value.reload();
    };
    const getNoticeList = async () => {
      const data = await common_utils.httpsRequest("/api/notice/queryNoticeList", {});
      noticeList.value = data;
    };
    const queryList = async (pageNo, pageSize) => {
      console.log(pageNo, pageSize);
      if (pageNo === 1) {
        getNoticeList();
      }
      const data = await common_utils.httpsRequest("/api/channelGameRelation/queryForPageChannelGameRelations", {
        pageNo,
        pageSize,
        gameName: searchValue.value
      });
      paging.value.complete(data.rows);
    };
    const handleApply = async (item, index) => {
      const data = await common_utils.httpsRequest("/api/channelGameRelation/bindChannelGame", {
        gameId: item.id
      });
      if (data) {
        common_vendor.index.showToast({
          icon: "none",
          title: "申请成功"
        });
        paging.value && paging.value.refresh();
      }
    };
    const cancel = () => {
      search();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(noticeList.value, (item, index, i0) => {
          return {
            a: common_vendor.o(getMore, index),
            b: common_vendor.o(($event) => getMore(item), index),
            c: "07e72d3c-1-" + i0 + ",07e72d3c-0",
            d: common_vendor.p({
              ["show-icon"]: true,
              single: true,
              text: item.title,
              ["show-get-more"]: true,
              ["more-text"]: "查看",
              ["background-color"]: index % 2 === 1 ? "#EAF2FF" : void 0,
              moreColor: index % 2 === 1 ? "#2979FF" : void 0,
              color: index % 2 === 1 ? "#2979FF" : void 0
            }),
            e: index
          };
        }),
        b: common_vendor.o(search),
        c: common_vendor.o(cancel),
        d: common_vendor.o(common_vendor.m(($event) => searchValue.value = $event, {
          trim: true
        }, true)),
        e: common_vendor.p({
          focus: false,
          modelValue: searchValue.value
        }),
        f: common_vendor.w(({
          item,
          index
        }, s0, i0) => {
          return common_vendor.e({
            a: "07e72d3c-4-" + i0 + "," + ("07e72d3c-3-" + i0),
            b: common_vendor.p({
              size: "small",
              text: item.gameType,
              ["custom-style"]: `background-color:${textColorMap[item.gameType] ? textColorMap[item.gameType].backgroundColor : "#EAF2FF"}; color: ${textColorMap[item.gameType] ? textColorMap[item.gameType].color : "#2979FF"};border-radius: 4px;border:none;`
            }),
            c: common_vendor.t(item.gameName),
            d: common_vendor.t(item.commisionRate),
            e: common_vendor.t(item.channelLimit),
            f: item.status === null
          }, item.status === null ? {
            g: common_vendor.o(($event) => handleApply(item))
          } : item.status == 0 ? {} : item.status == 1 ? {} : {}, {
            h: item.status == 0,
            i: item.status == 1,
            j: "07e72d3c-3-" + i0 + ",07e72d3c-0",
            k: i0,
            l: s0
          });
        }, {
          name: "cell",
          path: "f",
          vueId: "07e72d3c-0"
        }),
        g: common_assets._imports_0$1,
        h: common_vendor.sr(paging, "07e72d3c-0", {
          "k": "paging"
        }),
        i: common_vendor.o(queryList),
        j: common_vendor.o(($event) => dataList.value = $event),
        k: common_vendor.p({
          ["use-virtual-list"]: true,
          ["auto-show-back-to-top"]: true,
          ["refresher-enabled"]: true,
          modelValue: dataList.value
        }),
        l: common_vendor.t(popupInfo.value.title),
        m: common_vendor.t(popupInfo.value.context),
        n: common_vendor.t(upTime.value),
        o: common_vendor.sr(popup, "07e72d3c-6", {
          "k": "popup"
        }),
        p: common_vendor.p({
          ["background-color"]: "#fff"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-07e72d3c"], ["__file", "/Users/huyi/Desktop/own-project/uni-apps/huang1/pages/home/home.vue"]]);
wx.createPage(MiniProgramPage);
