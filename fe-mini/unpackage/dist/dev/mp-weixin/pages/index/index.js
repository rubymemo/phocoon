"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_g_loading2 = common_vendor.resolveComponent("g-loading");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_g_loading2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_g_loading = () => "../../components/g-loading/index.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_g_loading + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.ref("");
    const hasUser = common_vendor.ref(false);
    const firstLoading = common_vendor.ref(true);
    const judgeHasCurUser = async (code) => {
      const data = await common_utils.httpsRequest("/api/wx/login", {
        code
      }, true, true);
      if (data) {
        common_vendor.index.setStorageSync("token", data);
        common_vendor.index.switchTab({
          url: "/pages/home/home"
        });
        hasUser.value = true;
      } else {
        hasUser.value = false;
        firstLoading.value = false;
      }
    };
    common_vendor.onMounted(async () => {
      firstLoading.value = true;
      const loginRes = await common_vendor.index.login({});
      const codeTemp = loginRes.code;
      await judgeHasCurUser(codeTemp);
    });
    const dynamicFormRef = common_vendor.ref();
    const FormItemConfigs = common_vendor.ref([
      {
        label: "渠道名称",
        name: "channelName"
      },
      {
        label: "推广方式",
        name: "promotionWay",
        placeholder: "如: 社区论坛，短视频、QQ微信群，公众号，朋友圈，直播等",
        type: "textarea"
      },
      {
        label: "联系微信",
        name: "userWechat"
      },
      {
        label: "邀请码",
        name: "shareCode"
      }
    ]);
    const dynamicRules = common_vendor.ref({
      channelName: {
        rules: [{
          required: true
        }]
      },
      promotionWay: {
        rules: [{
          required: true
        }]
      },
      userWechat: {
        rules: [{
          required: true
        }]
      },
      shareCode: {
        rules: [{
          required: true
        }]
      }
    });
    const dynamicFormData = common_vendor.ref({});
    const handleLogin = () => {
      console.log(dynamicFormRef.value);
      dynamicFormRef.value.validate(async (err, formData) => {
        if (!err) {
          const loginRes = await common_vendor.index.login({});
          const codeTemp = loginRes.code;
          const data = await common_utils.httpsRequest("/api/wx/login", {
            ...formData,
            code: codeTemp
          }, void 0);
          if (data) {
            common_vendor.index.setStorageSync("token", data);
            common_vendor.index.showToast({
              icon: "none",
              title: "注册成功"
            });
            common_vendor.index.switchTab({
              url: "/pages/home/home"
            });
            hasUser.value = true;
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: firstLoading.value
      }, firstLoading.value ? {} : !firstLoading.value && !hasUser.value ? {
        d: common_vendor.f(FormItemConfigs.value, (item, k0, i0) => {
          return {
            a: "1cf27b2a-3-" + i0 + "," + ("1cf27b2a-2-" + i0),
            b: common_vendor.o(common_vendor.m(($event) => dynamicFormData.value[item.name] = $event, {
              trim: true
            }, true), item.name),
            c: common_vendor.p({
              type: item.type || void 0,
              placeholder: item.placeholder || `请输入${item.label}`,
              modelValue: dynamicFormData.value[item.name]
            }),
            d: item.name,
            e: "1cf27b2a-2-" + i0 + ",1cf27b2a-1",
            f: common_vendor.p({
              ["label-align"]: "right",
              ["label-width"]: "180rpx",
              required: true,
              name: item.name,
              label: item.label
            })
          };
        }),
        e: common_vendor.o(handleLogin),
        f: common_vendor.sr(dynamicFormRef, "1cf27b2a-1", {
          "k": "dynamicFormRef"
        }),
        g: common_vendor.p({
          rules: dynamicRules.value,
          model: dynamicFormData.value
        })
      } : {}, {
        c: !firstLoading.value && !hasUser.value,
        h: common_vendor.n(`container ${firstLoading.value ? "first-loading" : ""}`)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "/Users/huyi/Desktop/own-project/uni-apps/huang1/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
