<template>
  <div class="container">
    <Breadcrumb :items="['menu.channel', 'menu.channel.list']" />
    <a-card class="general-card" :title="$t('menu.channel.list')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="registerDate" label="创建日期">
                  <a-range-picker
                    v-model="formModel.registerDate"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="channelName" label="渠道名称">
                  <a-input
                    v-model.trim="formModel.channelName"
                    placeholder="请输入渠道名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="gameName" label="游戏名称">
                  <a-input
                    v-model.trim="formModel.gameName"
                    placeholder="请输入游戏名称"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col style="display: flex; align-items: center; justify-content: end">
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #promotionUrl="{ record }">
          <div style="max-width: 300px">{{ record.promotionUrl }}</div>
        </template>
        <template #commisionRate="{ record }">
          {{ record.commisionRate + '%' }}
        </template>
        <template #operations="{ record }">
          <view>
            <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="handlelink(record)"
            >
              回收链接
            </a-button>
            <a-button type="text" size="small" @click="goRelation(record)"
              >前往绑定关系</a-button
            >
          </view>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    ApplyRecord,
    ApplyParams,
    getChannels,
    recycleChannelsLink,
  } from '@/api/channel';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { Message, Modal } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      channelName: '',
      gameName: '',
      registerDate: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<ApplyRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const router = useRouter();

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '注册日期',
      dataIndex: 'registerDate',
    },
    {
      title: '所属合集',
      dataIndex: 'collectionTag',
    },
    {
      title: '渠道名称',
      dataIndex: 'channelName',
    },
    {
      title: '推广游戏',
      dataIndex: 'gameName',
    },
    {
      title: '活跃用户',
      dataIndex: 'activityUser',
    },
    {
      title: '推广收益',
      dataIndex: 'profit',
    },
    {
      title: '推广链接',
      dataIndex: 'promotionUrl',
    },
    {
      title: '分成比例',
      dataIndex: 'commissionRate',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
    },
  ]);
  const fetchData = async (
    params: ApplyParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      // const { data } = await getChannels(params);
      // renderData.value = data || [];
      // pagination.current = params.current;
      // pagination.total = data.length;
      const res = await getChannels({ ...params, pageNo: params.current });
      renderData.value = res.data.rows || [];
      pagination.current = params.current;
      pagination.total = res.data?.total ?? 0;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    const params = {
      ...basePagination,
      ...formModel.value,
    } as unknown as ApplyParams;
    fetchData({
      ...params,
    });
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );

  const handlelink = (record: ApplyRecord) => {
    if (record.relationId) {
      Modal.confirm({
        title: '确认回收',
        content: '回收后该游戏及链接将不会展示给前台，是否继续？',
        onOk: async () => {
          const data = await recycleChannelsLink({
            relationId: record.relationId,
          });
          if (data) {
            Message.success('回收成功');
            search();
          }
        },
      });
    } else {
      Message.error('回收链接不存在');
    }
  };

  const goRelation = (record: ApplyRecord) => {
    router.push(
      `/channel/relation?id=${record.id}&channelName=${
        record.channelName ?? ''
      }&gameName=${record.gameName ?? ''}`
    );
  };
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
