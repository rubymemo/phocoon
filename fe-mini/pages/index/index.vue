<template>
	<view :class="`container ${firstLoading ? 'first-loading' : ''}`">
		<image src="@/static/png/home-logo.png"  mode="aspectFit"  class="logo"></image>
		<view class="title">
			<view>微信小游戏-CPS推广助手</view>
			<view class="en-name">Phoccon Networks</view>
			<!-- <image class="home-logo" mode="aspectFit" src="@/static/png/home-logo.png"></image> -->
		</view>
		<view v-if="firstLoading" class="loading-box">
			<g-loading></g-loading>
			载入中，请稍等...
		</view>
		<view v-else-if="!firstLoading && !hasUser" class="cus-uni-form">
			<uni-forms ref="dynamicFormRef" :rules="dynamicRules" :model="dynamicFormData">
				<uni-forms-item v-for="item in  FormItemConfigs" label-align="right" label-width="180rpx" required
					:name="item.name" :key="item.name" :label="item.label">
					<uni-easyinput v-model.trim="dynamicFormData[item.name]" :type="item.type || undefined"
						:placeholder="item.placeholder || `请输入${item.label}`" />
				</uni-forms-item>
				<button @click="handleLogin" class="primary">微信登陆</button>
			</uni-forms>
		</view>
	</view>
</template>

<script setup>
	import {
		httpsRequest
	} from '@/common/utils';
	import {
		ref,
		onMounted
	} from 'vue';
	const code = ref('');
	const hasUser = ref(false);
	const firstLoading = ref(true);


	const judgeHasCurUser = async (code) => {
		const data = await httpsRequest('/api/wx/login', {
			code
		}, true, true);
		if (data) {
			// 如果已经有用户
			uni.setStorageSync('token', data);
			uni.switchTab({
				url: '/pages/home/home',
			})
			hasUser.value = true;
		} else {
			// 如果没有用户
			hasUser.value = false;
			firstLoading.value = false;
		}
	}

	onMounted(async () => {
		firstLoading.value = true;
		const loginRes = await uni.login({});

		const codeTemp = loginRes.code;
		await judgeHasCurUser(codeTemp);

	})
	const dynamicFormRef = ref();

	const FormItemConfigs = ref([{
			label: '渠道名称',
			name: 'channelName'
		},
		{
			label: '推广方式',
			name: 'promotionWay',
			placeholder: '如: 社区论坛，短视频、QQ微信群，公众号，朋友圈，直播等',
			type: "textarea"
		},
		{
			label: '联系微信',
			name: 'userWechat'
		},
		{
			label: '邀请码',
			name: 'shareCode'
		}
	])
	const dynamicRules = ref({
		channelName: {
			rules: [{
				required: true,
			}]
		},
		promotionWay: {
			rules: [{
				required: true,
			}]
		},
		userWechat: {
			rules: [{
				required: true,
			}]
		},
		shareCode: {
			rules: [{
				required: true,
			}]
		},
	})
	const dynamicFormData = ref({})
	const handleLogin = () => {
		console.log(dynamicFormRef.value)
		dynamicFormRef.value.validate(async (err, formData) => {
			if (!err) {
				const loginRes = await uni.login({});
				const codeTemp = loginRes.code;
				const data = await httpsRequest('/api/wx/login', {
					...formData,
					code: codeTemp
				}, undefined);
				if (data) {
					uni.setStorageSync('token', data);
					uni.showToast({
						icon: 'none',
						title: '注册成功'
					})
					uni.switchTab({
						url: '/pages/home/home',
					})
					hasUser.value = true;
				}
			}
		})
	}
</script>

<style lang="scss" scoped>
	.logo {
		height: 60px;
	}

	.home-logo {
		height: 24px;
		display: block;
		margin-top: 6px;
	}

	.container {
		font-size: 14px;
		padding-top: calc(44px + 4vh);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		&.first-loading {
			height: 100vh;
			padding-top: 0px;
		}

		.title {
			color: $primary-color;
			text-align: center;
			font-size: 24px;
			font-weight: bold;
			margin: 20px 0 20px;

			.en-name {
				font-size: 16px;
				font-style: italic;
			}
		}
	}

	.loading-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: $main-green;
	}

	.cus-uni-form {
		width: 84vw;
	}

	.cus-uni-form ::v-deep {
		.uni-forms-item__error.msg--active {
			display: none;
		}

		.uni-forms-item {
			margin-bottom: 18px !important;
		}

		.uni-easyinput__content-textarea.input-padding {
			min-height: 50px;
			height: 50px;
		}
	}
</style>