<template>
	<z-paging ref="paging" refresher-only auto-show-back-to-top @onRefresh="onRefresh" use-virtual-list>
		<template #top>
			<view class="header">
				<view class="header-tab">
					<view class="tab-box">
						<view :class="`tab-item ${tabValue === item.value ? 'active' : ''}`"
							v-for="(item, index) in tabList" @tap="handleTabClick(item)" wx:key="value">
							{{ item.label }}
						</view>
					</view>
				</view>
				<uni-notice-bar class="rule" text="注释:每个合作商可以获取子渠道推广收益的10%" single />
				<view class="total" v-if="tabValue === '0'">
					<text style="font-weight: bold;">合计</text>
					<view>
						<text style="margin-left: 0px;">子渠道收益：¥{{ profitsTotal || 0 }}</text>
						<text style="margin-left: 10rpx;">我的提成：¥{{ sonChannelProfitsTotal || 0 }}</text>
					</view>
				</view>
			</view>
		</template>
		<view v-if="tabValue === '0'" class="page1container">
			<!-- 		<view class="total">
			<text style="font-weight: bold;">合计</text>
			<view>
			<text style="margin-left: 20px;">子渠道收益：¥{{ profitsTotal || 0 }}</text>
			<text style="margin-left: 20px;">我的提成：¥{{ sonChannelProfitsTotal || 0 }}</text>
			</view>
		</view> -->
			<view class="scroll-box">
				<uni-table border stripe emptyText="暂无更多数据">
					<!-- 表头行 -->
						<uni-tr>
							<uni-th align="center" width="80px">子渠道</uni-th>
							<uni-th align="center" width="90px">推广游戏</uni-th>
							<uni-th align="center" width="70px">子收益</uni-th>
							<uni-th align="center" width="90px">我的提成</uni-th>
						</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr v-for="(item, index) in dataList" :key="index" class="cus-uni-tr">
						<uni-td align="center">
							<g-collapse-text :text="item.channelName " :width="70"></g-collapse-text>
						</uni-td>
						<uni-td align="center">
							<g-collapse-text :text="item.gameName" :width="84"></g-collapse-text>
						</uni-td>
						<uni-td align="center">¥{{ item.sonProfits || 0 }}</uni-td>
						<uni-td align="center">¥{{ item.channelProfitSplit || 0 }}</uni-td>
					</uni-tr>
				</uni-table>

			</view>

		</view>
		<view v-else-if="tabValue === '1'" class="page2container" style="margin-top: 10px;">
			<view class="card-item first">
				<view class="tit">累计发展子渠道</view>
				<view class="count">{{ channelCount }}个</view>
			</view>
	<!-- 		<uni-row :gutter="20">
				<uni-col :span="12">
				<view class="card-item first">
					<view class="tit">累计发展线下渠道</view>
					<view class="count">{{ channelCount }}个</view>
				</view>
				</uni-col>
				<uni-col :span="12">
					<view class="card-item first">
						<view class="tit">我的渠道名称</view>
						<view class="count">{{ channelName }}</view>
					</view>
				</uni-col>
			</uni-row> -->
			<view class="card-item code" @click="hanldeCopyCode" style="margin-bottom: 10px;">
				<view class="tit">推广邀请码</view>
				<view class="count">{{ shareCode || '-' }}</view>
				<view class="copy" v-if="shareCode">点击复制</view>
			</view>
			<view class="card-item first">
				<view class="tit">我的渠道名称</view>
				<view class="count">{{ channelName }}</view>
			</view>
		</view>
		<template #bottom>
			<g-tabbar :current="1"></g-tabbar>
		</template>
	</z-paging>
</template>

<script lang="ts" setup>
	import { ref, onBeforeMount } from 'vue';
	import { httpsRequest } from '@/common/utils';

	const TabList = [
		{
			value: '1',
			label: '推广邀请码'
		},
		{
			value: '0',
			label: '子渠道列表'
		},
	];
	const tabValue = ref(TabList[0].value);
	const tabList = ref(TabList);
	const paging = ref();

	const channelCount = ref('0'); // 
	const channelName = ref('');
	const shareCode = ref(''); // 复制二维码
	const header = ref([
		{ title: "子渠道" , prop: "channelName" ,align : "left" }, 
		{ title : "推广游戏" , prop: "gameName" , align : "center" },
	])

	const sonChannelProfitsTotal = ref(null); 
	const profitsTotal = ref(null);

	const hanldeCopyCode = () => {
		if (!shareCode.value) return;
		uni.setClipboardData({
			data: shareCode.value,//要被复制的内容
			success: () => {//复制成功的回调函数
				uni.showToast({//提示
					title: '复制成功'
				})
			}
		});
	}

	const dataList = ref([]);
	onBeforeMount(() => {
		getData();
		console.log('onBeforeMount')
	})

	// 切换tab
	const handleTabClick = (item) => {
		console.log(item);
		tabValue.value = item.value;
	}
	const getCode = () => {
		httpsRequest('/api/invitation/getShareCode', {}).then(sharecodeRes => {
			if (sharecodeRes) {
				shareCode.value = sharecodeRes.shareCode || '';
				channelCount.value = sharecodeRes.channelCount || '0';
				channelName.value = sharecodeRes.channelName || '-'
			}
		})
	}

	const getData = async () => {
		getCode();
		const res = await httpsRequest('/api/channel/querySonChannels', {});
		sonChannelProfitsTotal.value = res.channelProfitsSplitTotal;
		profitsTotal.value = res.profitsTotal;
		dataList.value = res.sonChannels;
		paging.value.complete(res.sonChannels || []);
	};
	const onRefresh = () => {
		console.log('下拉刷新')
		getData();
	}
</script>

<style lang="scss" scoped>
	.header {
		// margin-bottom: 10px;

		.header-tab {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 3px;
		}
	}

	// 标签
	.tab-box {
		width: 220px;
		height: 37px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: $light-green;
		border-radius: 12px;

		.tab-item {
			text-align: center;
			height: 30px;
			line-height: 30px;
			border-radius: 10px;
			font-size: 15px;
			padding: 0 10px;

			&.active {
				background: $main-green;
			}

			&:not(:last-child) {
				margin-right: 10px;
			}
		}
	}

	.page1container {
		position: relative;
		padding: 0 0 160rpx;

		.scroll-box {
			margin: 0 10px;
		}

		.table-td {
			display: inline-block;
		}

		::v-deep {
			.uni-table-tr:nth-child(even) {
				background-color: $light-green-bg;
			}

			.uni-table-tr:first-child {
				.uni-table-th {
					color: $letters-icon-color !important;
				}
			}

		}


	}

	.page2container {
		padding: 10px 20px 0;

		.card-item {
			display: flex;
			flex-direction: column;
			padding: 10px 0;
			width: 100%;
			border-radius: 10px;
			text-align: center;
		}

		.first {
			background: $main-green;
			margin-bottom: 10px;
		}

		.code {
			background: $light-blue;

			&:active {
				background: $vivid-blue;
			}
		}

		.card-item {
			.tit {
				font-size: 14px;
				margin-bottom: 5px;
			}

			.count {
				font-weight: bold;
				font-size: 24px;
			}

			.copy {
				font-size: 12px;
			}
		}
	}


	.total {
		display: flex;
		justify-content: space-between;
		margin: 0 9px 0 10px;
		border: 1px solid #EBEEF5;
		border-bottom: none;
		background: #DFF7E2;
		padding: 5px 10px;
		font-size: 14px;
		margin-top: 10px;
	}

	.rule ::v-deep {
		.uni-noticebar {
			margin-bottom: 0px;
		}
	}
</style>