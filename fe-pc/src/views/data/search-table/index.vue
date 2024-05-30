<template>
  <div class="container">
    <Breadcrumb :items="['menu.data', 'menu.data.correction']" />
    <a-card class="general-card" :title="$t('menu.data.correction')">
      <a-row style="margin-bottom: 16px">
        <a-col :span="20">
          <a-space>
            <a-upload
              action="/admin/correction/upload"
              accept=".xlsx,.xls,.csv"
              :headers="upheaders"
              @success="uploadSuccess"
              @error="uploadError"
              :show-file-list="false"
            >
            </a-upload>
            <a-button @click="handleAllPublish" :disabled="!renderData.length"
              >一键全部发布</a-button
            >
            <a-button @click="handleClearData" :disabled="!renderData.length"
              >一键消除“数据补正”的所有数据</a-button
            >
            <a-alert style="padding: 4px 15px">
              校正好正确的活跃度和收益后，点击“一键全部发布”按钮即可将数据全部执行发布计算。
            </a-alert>
          </a-space>
        </a-col>
        <a-col
          :span="4"
          style="display: flex; align-items: center; justify-content: end"
        >
          <!-- <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button> -->
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
        <template #operations="{ record }">
          <a-space>
            <a-button
              v-permission="['admin']"
              type="text"
              size="small"
              @click="handleEdit(record)"
            >
              校正
            </a-button>
            <!-- <a-button v-permission="['admin']" type="text" size="small">
            确认
          </a-button> -->
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :visible="modalVisible"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <template #title> 校正 </template>
      <a-form :model="modalInfo">
        <a-divider orientation="center">校正前</a-divider>
        <a-form-item field="beforeCorrectionActive" label="校正前活跃">
          <a-input-number
            v-model="modalInfo.beforeCorrectionActive"
            placeholder="请输入"
            disabled
          />
        </a-form-item>
        <a-form-item field="beforeCorrectionProfits" label="校正前收益">
          <a-input-number
            v-model="modalInfo.beforeCorrectionProfits"
            placeholder="请输入"
            disabled
          />
        </a-form-item>
        <a-divider orientation="center">校正后</a-divider>
        <a-form-item field="afterCorrectionActive" label="校正后活跃">
          <a-input-number
            v-model="modalInfo.afterCorrectionActive"
            placeholder="请输入"
          />
        </a-form-item>

        <a-form-item field="afterCorrectionProfits" label="校正后收益">
          <a-input-number
            v-model="modalInfo.afterCorrectionProfits"
            placeholder="请输入"
          />
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
    queryDataList,
    updateDataInfo,
    DataRecord,
    DataParams,
    publishAllData,
    clearAllData
  } from '@/api/data';
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
  const renderData = ref<DataRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const upheaders = ref({
    token: localStorage.getItem('token') ?? '',
  });

  const size = ref<SizeProps>('medium');

  const modalVisible = ref(false);
  const modalInfo = ref<Record<string, any>>({});

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
      title: '校正日期',
      dataIndex: 'correctionDate',
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
      title: '所属合集',
      dataIndex: 'collectionName',
    },
    {
      title: '校正前活跃',
      dataIndex: 'beforeCorrectionActive',
    },
    {
      title: '校正后活跃',
      dataIndex: 'afterCorrectionActive',
    },
    {
      title: '校正前收益',
      dataIndex: 'beforeCorrectionProfits',
    },
    {
      title: '校正后收益',
      dataIndex: 'afterCorrectionProfits',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
    },
  ]);
  const fetchData = async (
    params: DataParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      // const { data } = await queryDataList(params);
      // renderData.value = data || [];
      // pagination.current = params.current;
      // pagination.total = data.length || 0;

      const res = await queryDataList({ ...params, pageNo: params.current });
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
    } as unknown as DataParams);
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

  const handleEdit = (record) => {
    modalInfo.value = { ...record };
    modalVisible.value = true;
  };
  const handleModalCancel = () => {
    modalVisible.value = false;
  };

  const handleModalOk = async () => {
    console.log(modalInfo.value);
    const res = await updateDataInfo(modalInfo.value);
    console.log(res);
    if (res) {
      Message.success('更新成功');
      search();
      handleModalCancel();
    }
  };

  const uploadSuccess = () => {
    search();
  };

  const uploadError = () => {
    Message.error('上传失败，请检查文件内容是否正确');
  }

  const handleAllPublish = () => {
    Modal.confirm({
      title: '确认发布',
      content: '发布后的数据可以到“已发布的数据页面”查看',
      onOk: async () => {
        const res = await publishAllData();
        if(res) {
          Message.success("全部发布成功");
          search();
        }
      }
    });
  };

  const handleClearData = () => {
    Modal.confirm({
      title: '确认消除',
      content: '消除后“数据补全”页面的所有数据将被清空',
      onOk: async () => {
        const res = await clearAllData();
        if(res) {
          Message.success("消除成功");
          search();
        }
      }
    });
  }
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
