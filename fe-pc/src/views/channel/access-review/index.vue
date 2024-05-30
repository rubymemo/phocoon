<template>
  <div class="container">
    <Breadcrumb :items="['menu.channel', 'menu.channel.review']" />
    <a-card class="general-card">
      <a-row style="margin: 16px 0 16px 0; padding: 20px 0 0">
        <a-col :span="12">
          <span style="font-size: 16px; font-weight: 500; color: #1d2129"
            >接入审核</span
          >
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
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
          <div style="max-width: 300px;">{{  record.promotionUrl }}</div>
        </template>
        <template #commisionRate="{ record }">
          {{ record.commisionRate + '%' }}
        </template>
        <template #status="{ record }">
          <div style="width: 70px">

            <a-badge
            v-if="Number(record.status) === 1"
            status="success"
            text="审核通过"
          />
          <a-badge v-else status="processing" text="待审核" />
          </div>

        </template>
      
        <template #operations="{ record }">
          <div>
            <a-button
              type="text"
              size="small"
              :disabled="Number(record.status) === 1"
              @click="handleAudit(record)"
            >
              审核通过
            </a-button>
            <a-button type="text" size="small" @click="handleEdit(record)">
              编辑链接与标签
            </a-button>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :visible="modalVisible"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <template #title> 编辑链接与标签 </template>
      <a-form :model="modalInfo" ref="modalFormRef">
        <a-form-item
          field="promotionUrl"
          label="推广链接"
          tooltip="确认推广链接是否正确，推广链接会在审核通过后展示给前台"
          :rules="[{ type: 'url', required: false, message: '请输入正确的链接格式' }]"
        >
          <a-input v-model.trim="modalInfo.promotionUrl" placeholder="请输入" />
        </a-form-item>

        <a-form-item field="collectionTag" label="合集标签">
          <a-input v-model.trim="modalInfo.collectionTag" placeholder="请输入" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryApplyChannelList,
    updateChannelGameRelation,
    updateChannelStatus,
    ApplyRecord,
    ApplyParams,
  } from '@/api/channel';

  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { Message, Modal } from '@arco-design/web-vue';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };


  const generateFormModel = () => {
    return {
      number: '',
      name: '',
      contentType: '',
      filterType: '',
      createdTime: [],
      status: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<ApplyRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const modalFormRef = ref();

  const modalVisible = ref(false);
  const modalInfo = ref({
    promotionUrl: '',
    collectionTag: '',
  });

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
      title: '申请日期',
      dataIndex: 'applyDate',
    },
    {
      title: '渠道名称',
      dataIndex: 'channelName',
    },
    {
      title: '申请推广游戏',
      dataIndex: 'gameName',
    },
    {
      title: '剩余名额',
      dataIndex: 'channelLimit',
    },
    {
      title: '分成比例',
      dataIndex: 'commisionRate',
      slotName: 'commisionRate',
    },
    {
      title: '推广链接',
      dataIndex: 'promotionUrl',
      slotName: 'promotionUrl',
    },
    {
      title: '合集标签',
      dataIndex: 'collectionTag',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '操作',
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
      const res = await queryApplyChannelList({ ...params, pageNo: params.current });
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
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as ApplyParams);
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
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

  const handleEdit = (record: ApplyRecord) => {
    modalInfo.value = { ...record };
    modalVisible.value = true;
  };

  const handleModalCancel = () => {
    modalFormRef.value.clearValidate();
    modalVisible.value = false;
  };
  const handleModalOk = async () => {
    modalFormRef.value.validate(async (err) => {
      if (!err) {
        const res = await updateChannelGameRelation({
          channelGameRelationId: modalInfo.value.id,
          promotionUrl: modalInfo.value.promotionUrl,
          collectionTag: modalInfo.value.collectionTag,
        });
        if (res) {
          search();
          Message.success('更新成功');
          handleModalCancel();
        }
      }
    });
  };
  const handleAudit = (record: ApplyRecord) => {
    Modal.confirm({
      title: '确认通过',
      content: '确认通过后前台会看到该链接',
      onOk: async () => {
        const res = await updateChannelStatus({
          channelGameRelationId: record.id,
          status: '1'
        });
        if (res) {
          search();
          Message.success('更新成功');
        }
      },
    });
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
