<template>
	 <z-paging ref="paging" v-model="dataList" use-virtual-list auto-show-back-to-top refresher-enabled @query="queryList" class="cus-z-paging">
	 		<template #top>
	 		<view class="header">
	 			<view v-for="(item, index) in noticeList" class="bar-box" :key="index">
					<uni-notice-bar 
						class="rule" 
						show-icon single  
						:text="item.title" 
						show-get-more 
						more-text="查看"
						@getmore="getMore" 
						@click="getMore(item)" 
						:background-color="index % 2 === 1 ? '#EAF2FF' : undefined" 
						:moreColor="index % 2 === 1 ? '#2979FF' : undefined"
						:color="index % 2 === 1 ? '#2979FF' : undefined"
					/>
	 			</view>
				<uni-search-bar
					class="cus-uni-search-bar"
					@confirm="search" 
					:focus="false" 
					v-model.trim="searchValue" 
					@cancel="cancel"
				></uni-search-bar>
	 		</view>
	 		</template>
			<template v-slot:cell="{item,index}">
				<uni-list-item class="home-card">
					<template v-slot:body>
						<view class="list-item">
							<view class="left">
								<view class="header">
									<uni-tag class="tag" 
									size="small" :text="item.gameType"
									:custom-style="`background-color:${textColorMap[item.gameType] ? textColorMap[item.gameType].backgroundColor : '#EAF2FF'}; color: ${textColorMap[item.gameType] ? textColorMap[item.gameType].color : '#2979FF'};border-radius: 4px;border:none;`"
									></uni-tag>
									<image class="header-game-logo" src="@/static/png/game_logo.png"></image>
									<text class="title">{{item.gameName}}</text></view>
								<view>
									<view class="desc" style="margin-right: 6px;">子渠道收益比例：<text class="ratio">{{ item.commisionRate }}%</text>
									</view>
									<view class="desc">剩余名额：<text class="last">{{ item.channelLimit }}</text></view>
								</view>
							</view>
							<view class="right">
								<button class="primary" v-if="item.status === null" @click="handleApply(item, index)">申请</button>
								<button class="primary orange" v-else-if="item.status == 0" disabled>申请中</button>
								<button class="primary" v-else-if="item.status == 1" disabled>已接入</button>
							</view>
						</view>
					</template>
				</uni-list-item>
			</template> 
	 		<template #bottom>
	 			<g-tabbar></g-tabbar>
	 		</template>
	 	</z-paging>
	<uni-popup ref="popup" background-color="#fff" class="cus-pop">
		<view class="popup-content">
			<view class="title">{{ popupInfo.title}}</view>
			<!-- <textarea type="textarea" v-model="popupInfo.context" placeholder="请输入内容"></textarea> -->
			<view class="content" style="white-space: pre-wrap;">
				{{ popupInfo.context }}
			</view>
			<view class="footer">发布时间： {{ upTime }}</view>
		</view>
	</uni-popup>
</template>

<script lang="ts" setup>
	import { ref, onBeforeMount, computed } from 'vue';
	import { httpsRequest } from '@/common/utils';
	type NoticeItem = {
		context: string;
		createDate?: string;
		modifyDate?: string;
		title: string;
	}
	const textColorMap = {
		'动作': {
			// color: '#007357',
			color: '#000',
			backgroundColor: '#DFF7E2'
		},
		'角色': {
			// color: '#900060',
			color: '#000',
			backgroundColor: '#ffe1f5'
		},
		'竞技': {
			// color: '#1a64e6',
			color: '#000',
			backgroundColor: '#d6e2f7'
		},
		'休闲': {
			// color: '#065861',
			color: '#000',
			backgroundColor: '#bfeef3'
		},
		'棋牌': {
			// color: '#4c2500',
			color: '#000',
			backgroundColor: '#ffd2a8'
		},
		'其他': {
			// color: '#67080d',
			color: '#000',
			backgroundColor: '#ffcacd'
		}
	}
	const popup = ref();
	const popupInfo = ref<NoticeItem>({
		title: '',
		context: ''
	})
	const noticeList = ref<NoticeItem[]>([]);
	const getMore = (info) => {
		console.log(info.context);
		const str =JSON.stringify(info.context);
		console.log(str);
		const list = str.split('>>');
		console.log(list)
		popupInfo.value = info;
		popup.value.open()
	}
	// v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
	const dataList = ref([]);
	const paging = ref(null);
	const searchValue = ref('');
	
	const upTime = computed(() => {
		const time = popupInfo.value.createDate || popupInfo.value.modifyDate;
		if(time) return time.split(' ')[0];
		return ''
	})
	onBeforeMount(() => {
		// getNoticeList();
	})
	
	const search = () => {
		paging.value.reload()
	}
	
	const getNoticeList = async () => {
		const data = await httpsRequest('/api/notice/queryNoticeList', {});
		noticeList.value = data;
	};
	
	const queryList = async (pageNo, pageSize) => {
		console.log(pageNo, pageSize)
		if(pageNo === 1) {
			getNoticeList();
		
			// const data = await httpsRequest('/api/channelGameRelation/queryForPageChannelGameRelation', {
			// 	pageNo, 
			// 	pageSize,
			// 	gameName: searchValue.value
			// });
		} else {
			// paging.value.complete([]);
		}
		const data = await httpsRequest('/api/channelGameRelation/queryForPageChannelGameRelations', {
			pageNo, 
			pageSize,
			gameName: searchValue.value
		});
		paging.value.complete(data.rows);
	}
	const handleApply = async (item, index) => {
		// console.log(item);
		// dataList.value[index].status = '0';
		const data = await httpsRequest('/api/channelGameRelation/bindChannelGame', {
			gameId: item.id
		});
		if(data) {
			uni.showToast({
				icon: 'none',
				title: '申请成功'
			})
			paging.value && paging.value.refresh()
		}
	}
	
	const cancel = () => {
		search();
	}
</script>

<style lang="scss" scoped>
	.rule ::v-deep {
		.uni-noticebar {
			margin-bottom: 0px;
		}
	}

	.list-item {
		display: flex;
		width: 100%;

		.left {
			flex: 1;
		}

		.right {
			width: 70px;
			display: flex;
			align-items: center;
			justify-content: flex-end;

			button.primary {
				width: fit-content;
				font-size: 14px;
				height: 25px;
				line-height: 25px;
				padding: 0 10px;
				margin: 0;
			}
		}

		.header {
			position: relative;
			margin-bottom: 3px;
			display: flex;
			align-items: center;
			width: 400rpx;
			.title {
				width: 300rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-right: 8px;
				font-size: 16px;
			}

			.tag {
				white-space: nowrap;
				margin-right: 10px;
				// background: $light-blue;
				// color: $ocean-blue;
				// position: absolute;
				// top: 10px;
			}

		}

		.desc {
			display: inline-block;
			font-size: 14px;
			color: gray;

		}

		.ratio,
		.last {
			color: $main-green;
		}

	}

	.popup-content {
		width: 320px;
		border-radius: 5px;
		padding: 0px 0px 10px;

		.title {
			height: 40px;
			line-height: 40px;
			text-align: center;
			font-weight: bold;
		}

		.content {
			font-size: 14px;
			padding: 5px 15px 8px;
			overflow-y: scroll;
			min-height: 10vh;
			max-height: 70vh;
		}
		.footer {
			font-size: 14px;
			text-align: right;
			padding: 0 20px 10px;
		}
	}

	.cus-pop ::v-deep {
		.uni-popup__wrapper {
			border-radius: 20px;
		}
	}
	.bar-box ::v-deep {
		.uni-noticebar__content-text.uni-noticebar__content-text--scrollable {
			animation-duration: 3s !important;
		}
	}
	.cus-z-paging::v-deep {
		.z-paging-content {
			margin-bottom: 140rpx;
		}
	}
	.cus-uni-search-bar::v-deep {
		.uni-searchbar__box {
			justify-content: flex-start;
		}
	}
	.header-game-logo {
		width: 14px;
		height: 14px;
		margin-right: 4px;
	}
</style>