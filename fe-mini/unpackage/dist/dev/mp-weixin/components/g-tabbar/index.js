"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    current: { default: 0 }
  },
  setup(__props) {
    const props = __props;
    common_vendor.onMounted(() => {
      console.log(props.current);
    });
    const TabBarList = [
      {
        icon: "/static/png/home.png",
        selectIcon: "/static/png/home-active.png",
        url: "/pages/home/home",
        text: "合作游戏"
      },
      {
        icon: "/static/png/order.png",
        selectIcon: "/static/png/order-active.png",
        url: "/pages/channel/channel",
        text: "渠道管理"
      },
      {
        icon: "/static/png/add-services.png",
        selectIcon: "/static/png/add-services-active.png",
        url: "/pages/promotion/promotion",
        text: "推广数据"
      },
      {
        icon: "/static/png/user.png",
        selectIcon: "/static/png/user-active.png",
        url: "/pages/myearnings/myearnings",
        text: "我的收益"
      }
    ];
    const navigatorTo = (e) => {
      common_vendor.index.switchTab({
        url: e
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(TabBarList, (item, index, i0) => {
          return {
            a: props.current == index ? item.selectIcon : item.icon,
            b: common_vendor.t(item.text),
            c: index,
            d: common_vendor.o(($event) => navigatorTo(item.url), index)
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9f83b3d2"], ["__file", "/Users/huyi/Desktop/own-project/uni-apps/huang1/components/g-tabbar/index.vue"]]);
wx.createComponent(Component);
