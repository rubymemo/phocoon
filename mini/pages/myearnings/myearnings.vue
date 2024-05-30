<template>
	<z-paging ref="paging" 
		v-model="dataList" 
		use-virtual-list
		auto-show-back-to-top 
		refresher-enabled 
		loading-more-title-custom-style=""
		:show-loading-more-no-more-view="false"
		:show-default-loading-more-text="false"
		:show-loading-more-no-more-line="false"
		:hide-empty-view="true"
		@query="queryList"
		:default-page-size="40"
	>
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
			</view>
		</template>
		<view v-if="tabValue === '0'" class="page1container">
			<uni-row :gutter="20">
				<uni-col :span="12" v-for="(carditem, index) in incomeCardList" :key="index">
					<view class="card-item" :style="{
						background: carditem.color || undefined
					}">
						<view class="tit">{{ carditem.tit}}</view>
						<view class="count">¥{{incomeValues[carditem.name] || 0}}</view>
					</view>
				</uni-col>
			</uni-row>
			<button class="primary out-money-btn" @click="withdrawal">提现</button>
			<view class="tips">*当您的“累计未结算收入”大于¥1000时，可以提现</view>
		</view>
		<view v-else-if="tabValue === '1'" class="page2container">
			<view class="scroll-box">
				<uni-table border stripe emptyText="暂无更多数据">
					<!-- 表头行 -->
					<uni-tr>
						<uni-th align="center" width="95px">游戏名称</uni-th>
						<uni-th align="center" width="80px">变现类型</uni-th>
						<uni-th align="center" width="100px">推广链接</uni-th>
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr v-for="(item, index) in dataList" :key="index" class="cus-uni-tr">
						<uni-td><g-collapse-text :text="item.gameName || '-'" :width="80"></g-collapse-text></uni-td>
						<uni-td>{{ item.profitModel }}</uni-td>
						<uni-td>
							<view class="text-overflow">{{ item.promotionUrl}}</view>
							<view class="copy-right">
								<button class="primary copy" @click="handleCopyClick(item.promotionUrl)">点击复制</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</view>
		<template #bottom>
			<g-tabbar :current="3"></g-tabbar>
		</template>
	</z-paging>
</template>

<script lang="ts" setup>
	import { ref, onBeforeMount } from 'vue';
	import { httpsRequest } from '@/common/utils';

	const TabList = [
	{
		value: '1',
		label: '推广链接'
	},
	{
		value: '0',
		label: '我的收益'
	}
	];
	const tabValue = ref('1');
	const tabList = ref(TabList);
	const paging = ref();
	const incomeCardList = ref([
		{ tit: '上周总收入', value: '', name: 'lastWeekProfitTotal' },
		{ tit: '累计总收入', value: '', name: 'totalProfitTotal' },
		{ tit: '累计已提现收入', value: '', color: '#6DB6FE', name: 'totalWithdrawalTotal' },
		{ tit: '累计未结算收入', value: '', color: '#6DB6FE', name: 'withdrawalTotal' },
	])
	const incomeValues = ref({
		lastWeekProfitTotal: 0,
		totalProfitTotal: 0,
		totalWithdrawalTotal: 0,
		withdrawalTotal: 0,
		isActive: false
	})

	const dataList = ref([]);
	onBeforeMount(() => {
		console.log('onBeforeMount')
	})

	// 切换tab
	const handleTabClick = (item) => {
		console.log(item);
		tabValue.value = item.value;
	}
	
	const getCardList = async () =>  {
		// const link = await httpsRequest('/admin/shortLink/createShortLink', {
		// 	longUrl: 'http://www.baidu.com'
		// })
		const data = await httpsRequest('/api/promotionProfit/queryMyPromotionProfit', {});
		if(data) {
			incomeValues.value = data;
		}
	}
	const queryList = async (pageNo, pageSize) => {
		if(pageNo === 1) {
			getCardList();
		}
		const data = await httpsRequest('/api/channelGameRelation/queryForPagePromotionUrls', {
			pageNo, 
			pageSize
		});
		if(data) {
			paging.value.complete(data.rows);
		}
	}
	const handleCopyClick = (copystr: string) => {
		if(!copystr) return;
		uni.setClipboardData({
			data: copystr,//要被复制的内容
			success: () => {//复制成功的回调函数
				uni.showToast({//提示
					title: '复制成功'
				})
			}
		});
	}
	const withdrawal = async () => {
		if(incomeValues.value.withdrawalTotal < 1000) {
			// uni.showToast({
			// 	icon: 'none',
			// 	title: '对不起，您的提现金额暂时达不到可提现标准，请您继续努力',
			// 	duration: 3000,
			// })
			uni.showModal({
				title: "提示",
				content: '对不起，您的提现金额暂时达不到可提现标准，请您继续努力',
				confirmText: "确定",
				showCancel: false,
				success: (res) => {
					
				}
			})

		} else if(!incomeValues.value.isActive) {
			// uni.showToast({
			// 	icon: 'none',
			// 	title: '您已经有正在提现单的单子，暂时无法再次提现，请联系客户',
			// 	duration: 3000,
			// })
			uni.showModal({
				title: "提示",
				content: '您已经有正在提现单的单子，暂时无法再次提现，请联系客户',
				confirmText: "确定",
				showCancel: false,
				success: (res) => {
					
				}
			})
		} else {
			const data = await httpsRequest('/api/settlementRecord/applySettlement', {
				applySettlementAmount: incomeValues.value.withdrawalTotal
			})
			if(data) {
				// uni.showToast({
				// 	icon: 'none',
				// 	title: '恭喜您已经申请提现，请关注公众号：微小游推广助手，回复“结算”，官方将主动联系您打款结算。',
				// 	duration: 3000,
				// })
				uni.showModal({
					title: "提示",
					content: '恭喜您已经申请提现，请关注公众号：微小游推广助手，回复“结算”，官方将主动联系您打款结算。',
					confirmText: "确定",
					showCancel: false,
					success: (res) => {
						
					}
				})
				paging.value && paging.value.reload()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		margin-bottom: 10px;

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
		padding: 10px 36px 0;
	}

	.card-item {
		width: 50%;
		display: flex;
		flex-direction: column;
		padding: 10px 0;
		width: 100%;
		border-radius: 10px;
		text-align: center;
		background: $main-green;
		margin-bottom: 10px;
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
	}

	.out-money-btn {
		margin-top: 40px;
		height: 40px;
		line-height: 40px;
	}

	.page2container {
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
		.total {
			display: flex;
			justify-content: space-between;
			margin: 0 9px 0 10px;
			border: 1px solid #EBEEF5;
			border-bottom: none;
			background: #DFF7E2;
			padding: 5px 10px;
			font-size: 14px;
		}
	
	}

	.text-overflow {
		width: 100px;
		/* text-overflow: ellipsis; */
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	button.primary.copy {
		width: fit-content;
		font-size: 14px;
		height: 25px;
		line-height: 25px;
		padding: 0 10px;
		margin: 0;
	}
	.tips {
		font-size: 12px;
		text-align: center;
		margin-top: 10px;
		color: $main-green;
	}
	.copy-right {
		display: flex;
		justify-content: flex-end;
	}
</style>