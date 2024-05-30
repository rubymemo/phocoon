"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    text: {},
    width: {}
  },
  setup(__props) {
    const props = __props;
    const isShow = common_vendor.ref(false);
    const Style = common_vendor.computed(() => {
      if (isShow.value) {
        return {
          width: props.width + "px",
          "word-break": "break-all"
        };
      } else {
        return {
          width: props.width + "px",
          "white-space": "nowrap",
          "overflow": "hidden",
          "text-overflow": "ellipsis"
        };
      }
    });
    const swicthShow = () => {
      isShow.value = !isShow.value;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(props.text),
        b: common_vendor.s(Style.value),
        c: common_vendor.o(swicthShow)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d7050037"], ["__file", "/Users/huyi/Desktop/own-project/uni-apps/huang1/components/g-collapse-text/index.vue"]]);
wx.createComponent(Component);
