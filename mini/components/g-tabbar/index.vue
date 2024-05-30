<template>
  <view class="g-tabbar">
	  <view class="cover">
	   <view
		  class="tab"
		  v-for="(item,index) in TabBarList"
		  :key="index"
		  @tap="navigatorTo(item.url)"
		>
		  <image
			class="imgsize"
			:src="props.current == index ? item.selectIcon : item.icon"
			mode="widthFix"
		  ></image>
		  <view class="text">{{ item.text }}</view>
		</view>
	</view>
  </view>
</template>
 
<script setup lang="ts">
	import { onMounted, defineProps, withDefaults } from 'vue';
	const props = withDefaults(
		defineProps<{
			current: number | undefined
		}>(),
		{ current: 0 }
	);
	onMounted(() => {
		console.log(props.current)
	})
	const TabBarList = [
        {
          icon: '/static/png/home.png',
          selectIcon: '/static/png/home-active.png',
          url: '/pages/home/home',
		  text: '合作游戏'
        },
		{
		  icon: '/static/png/order.png',
		  selectIcon: '/static/png/order-active.png',
		  url: '/pages/channel/channel',
		  text: '渠道管理'
		},
		{
		  icon: '/static/png/add-services.png',
		  selectIcon: '/static/png/add-services-active.png',
		  url: '/pages/promotion/promotion',
		   text: '推广数据'
		},
        {
          icon: '/static/png/user.png',
          selectIcon: '/static/png/user-active.png',
          url: '/pages/myearnings/myearnings',
		  text: '我的收益'
        },
      ];
	const navigatorTo = (e) => {
      uni.switchTab({
        url: e,
      })
    };
</script>

<style lang="scss" scoped>
.g-tabbar {
  position: fixed;
  bottom: 0;
  background-color: $light-green;
  width: 100%;
  height: 120rpx;
  border-radius: 14vw 14vw 0 0;
  padding-bottom: 40rpx;  

  z-index: 10;
  .cover {
	height: inherit;
	padding: 0 18px;
	display: flex;
	justify-content: space-around;
	align-items: center;
  }
}
.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.imgsize {
  width: 68rpx;
  height: 62rpx;
}
.addimgsize {
  width: 98rpx;
  height: 98rpx;
  margin-top: -30rpx;
}
.active {
  margin-top: 10rpx;
   font-size: 20rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: bold;
  color: $primary-color;
  line-height: 20rpx;
}
.text {
	font-size: 20rpx;
	color: $letters-icon-color;
}
</style>
