<template>
  <a-breadcrumb class="container-breadcrumb">
    <a-breadcrumb-item>
      <icon-apps />
    </a-breadcrumb-item>
    <template v-if="routes.length">
      <a-breadcrumb-item
        v-for="item in routes"
        :key="item.label"
        @click="goPage(item)"
      >
        <a-link v-if="item.path">
          {{ $t(item.label)}}
        </a-link>
        <span v-else>
          {{ $t(item.label) }}
        </span>
      </a-breadcrumb-item>
    </template>
    <template v-else>
      <a-breadcrumb-item v-for="item in items" :key="item">
        {{ $t(item) }}
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  type routeItem = {
    label: string;
    path?: string;
  };

  defineProps({
    items: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      },
    },
    routes: {
      type: Array as PropType<Array<routeItem>>,
      default() {
        return [];
      },
    },
  });
  const goPage = ({ path }: routeItem) => {
    if (path) {
      router.push({
        path,
      });
    }
  };
</script>

<style scoped lang="less">
  .container-breadcrumb {
    margin: 16px 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }
</style>
