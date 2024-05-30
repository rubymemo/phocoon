<template>
	<!-- @onRefresh="onRefresh" -->
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
	:default-page-size="40"
	@query="queryList"
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
				<uni-notice-bar class="rule" :text="tabValue ===tabList[0].value ? '注释:每日更新昨天的推广数据' : '注释:每月1号更新上月的推广数据'" single />
				<view class="total">
					<text style="font-weight: bold;">合计</text>
					<view>
						<text style="margin-left: 20px;">活跃：{{ 
							(tabValue ===tabList[0].value ?
							dataDayTotal.activityUserNumTotal : dataMonthTotal.activityUserNumTotal)|| 0 }}</text>
						<text style="margin-left: 20px;">收益：¥{{ 
							(tabValue ===tabList[0].value ?
							dataDayTotal.profitTotal : dataMonthTotal.profitTotal)
							 || 0 }}</text>
					</view>
				</view>
			</view>
		</template>
		<view v-show="tabValue === tabList[0].value" class="page1container">
			<view class="scroll-box" >
				<uni-table border stripe emptyText="暂无更多数据">
						<uni-tr>
							<uni-th align="center" width="105px">日期</uni-th>
							<uni-th align="center" width="90px">推广游戏</uni-th>
							<uni-th align="center" width="70px">活跃</uni-th>
							<uni-th align="center" width="70px">收益</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in dataList" :key="index" class="cus-uni-tr">
							<uni-td align="center" :width="100">{{ item.promotionDate }}</uni-td>
							<uni-td align="center" :width="100">
								<g-collapse-text :text="item.gameName || '-'" :width="80"></g-collapse-text>
							</uni-td>
							<uni-td align="center" :width="70">{{ item.activityUserNum || 0}}</uni-td>
							<uni-td align="center" :width="70">¥{{ item.profit }}</uni-td>
						</uni-tr>
				</uni-table>
			</view>
			
			<!-- 	<view class="scroll-box" > 
					<uni-table border stripe emptyText="暂无更多数据">
						<view class="tableHead">
							<uni-tr>
								<uni-th align="center" width="25%">日期</uni-th>
								<uni-th width="25%">推广游戏</uni-th>
								<uni-th align="center" width="25%">活跃</uni-th>
								<uni-th align="center" width="25%">收益</uni-th>
							</uni-tr>
						</view>
						<view class="tableBody" style="margin-top: 60rpx;">
							<uni-tr v-for="(item, index) in dataDayList" :key="index" class="cus-uni-tr">
								<uni-td width="25%">{{ item.promotionDate }}</uni-td>
								<uni-td width="25%">{{ item.gameName || '-'}}</uni-td>
								<uni-td align="center" width="25%">{{ item.activityUserNum || 0}}</uni-td>
								<uni-td align="center" width="25%">¥{{ item.profit }}</uni-td>
							</uni-tr>
						</view>
					</uni-table>
				</view> -->
		</view>
		<view v-show="tabValue ===tabList[1].value" class="page1container">
	<!-- 		<view class="total">
				<text style="font-weight: bold;">合计</text>
				<view>
					<text style="margin-left: 20px;">活跃：{{ dataMonthTotal.activityUserNumTotal || 0 }}</text>
					<text style="margin-left: 20px;">收益：¥{{ dataMonthTotal.profitTotal || 0 }}</text>
				</view>
			</view> -->
			<view class="scroll-box">
			<uni-table border stripe emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center" width="100px">月度</uni-th>
					<uni-th align="center" width="100px">推广游戏</uni-th>
					<uni-th align="center" width="70px">活跃</uni-th>
					<uni-th align="center" width="70px">收益</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item, index) in dataList" :key="index" class="cus-uni-tr">
					<uni-td align="center">{{ item.promotionDate }}</uni-td>
					<uni-td align="center" :width="100">
						<g-collapse-text :text="item.gameName || '-'" :width="80"></g-collapse-text>
					</uni-td>
					<uni-td align="center">{{ item.activityUserNum || 0}}</uni-td>
					<uni-td align="center">¥{{ item.profit }}</uni-td>
				</uni-tr>
			</uni-table>
			</view>
		</view>
		<template #bottom>
			<g-tabbar :current="2"></g-tabbar>
		</template>
	</z-paging>
</template>

<script lang="ts" setup>
	import { ref, onBeforeMount } from 'vue';
	import { httpsRequest } from '@/common/utils';

	const TabList = [{
		value: 0,
		label: '每日数据'
	},
	{
		value: 1,
		label: '每月数据'
	},
	];
	const tabValue = ref(TabList[0].value);
	const tabList = ref(TabList);
	const paging = ref();
	
	const dataList = ref([]);

	const dataDayList = ref([]);
	const dataDayTotal = ref({
		activityUserNumTotal: 0,
		profitTotal: 0
	});
	const dataMonthList = ref([]);
	const dataMonthTotal = ref({
		activityUserNumTotal: 0,
		profitTotal: 0
	});
	onBeforeMount(() => {
		console.log('onBeforeMount')
	})
	
	const queryList = async (pageNo, pageSize) => {
		if(pageNo === 1) {
			const dayTotal = await httpsRequest('/api/promotionProfit/queryPromotionProfitDayTotal',{});
			if(dayTotal) {
				dataDayTotal.value = dayTotal
			}
			const monthTotal = await httpsRequest('/api/promotionProfit/queryPromotionProfitMonthTotal ',{});
			if(monthTotal) {
				dataMonthTotal.value = monthTotal
			}
		}
		if(tabValue.value == TabList[0].value) {
			const data = await httpsRequest('/api/promotionProfit/queryForPagePromotionProfitDay',{pageNo, pageSize})
			console.log(data);
			if(data) {
				// dataDayList.value = data.promotionProfitDayBoList || [];
				// dataDayTotal.value = {
				// 	activityUserNumTotal: data.activityUserNumTotal || 0,
				// 	profitTotal: data.profitTotal || 0
				// }
				paging.value.complete(data.rows);
			}
		} else {
			const data = await httpsRequest('/api/promotionProfit/queryForPagePromotionProfitMonth',{pageNo, pageSize})
			if(data) {
				// dataMonthList.value = data.promotionProfitMonthBoList || [];
				// dataMonthTotal.value = {
				// 	activityUserNumTotal: data.activityUserNumTotal || 0,
				// 	profitTotal: data.profitTotal || 0
				// }
				paging.value.complete(data.rows);
			}
		}
		
	}
	// 切换tab
	const handleTabClick = (item) => {
		tabValue.value = item.value;
		if((item.value === TabList[0].value && dataDayList.value.length === 0) || 
		(item.value === TabList[1].value && dataMonthList.value.length === 0)) {
			paging.value.reload();
		}
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
	
	.rule ::v-deep {
		.uni-noticebar {
			margin-bottom: 0px;
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
	.table-header-fixed {
		margin: 0 10px;
		::v-deep {
			.uni-table-tr:nth-child(even) {
				background-color: $light-green-bg;
			}
			.uni-table-tr:first-child {
				.uni-table-th {
					color: $letters-icon-color !important;
				}
			}
			.uni-table-loading {
				display: none;
			}
			.uni-table-th {
				border-bottom: none;
			}
			.table--border {
				border-bottom: none;
			}
		}
	}
	
		/* //表头固定样式 */
		.tableHead {
			font-weight: bold;
			color: #333333;
			background: #F4F6FF;
			z-index: 20;
			position: fixed;
		}
	
		.tableBody {
			height: 1800rpx;
			overflow: scroll;
			margin-top: 42px;
		}
</style>