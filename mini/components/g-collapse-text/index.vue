<template>
	<view class="text" :style="Style" @click="swicthShow">{{props.text}}</view>
</template>

<script setup lang="ts">
	import { computed, defineProps, ref } from 'vue';
	const props = defineProps<{
		text: string,
		width: number
	}>()
	
	const isShow = ref(false);
	
	const Style = computed(() => {
		if(isShow.value) {
			return {
				width: props.width + 'px',
				'word-break': 'break-all'
			}
		} else {
			return {
				width: props.width + 'px',
				'white-space': 'nowrap', 
				'overflow': 'hidden', 
				'text-overflow': 'ellipsis',
			}
		}
	})
	const swicthShow = () => {
		isShow.value = !isShow.value;
	}
</script>

<style lang="scss" scoped>
	.text {
		
	}
</style>