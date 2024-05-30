<template>
  <div class="container">
    <Breadcrumb :items="['menu.channel', 'menu.channel.notice']" />
    <a-card class="general-card" :title="$t('menu.channel.notice')">
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button @click="handleEdit" type="primary">
              <template #icon>
                <icon-plus />
              </template>
              添加公告
            </a-button>
          </a-space>
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
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #modifyDate="{record}">
          {{  record.modifyDate || record.createDate }}
        </template>
        <template #context="{record}">
          <div style="max-width: 500px;">
            {{  record.context }}
          </div>
        </template>
        <template #status="{ record }">
          <a-badge
            v-if="Number(record.status) === 1"
            status="success"
            text="已发布"
          />
          <a-badge v-else status="processing" text="未发布" />
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="handleEdit(record)">
              修改
            </a-button>
            <a-button type="text" size="small" @click="handlePublish(record)">
              {{ Number(record.status) === 1 ? '下架' : '发布' }}
            </a-button>
            <a-button type="text" size="small" @click="handleDelete(record)">
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :visible="modalVisible"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      :width="440"
    >
      <template #title> 公告 </template>
      <a-form :model="modalInfo" ref="modalFormRef" auto-label-width>
        <a-form-item
          field="title"
          label="标题"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-input v-model.trim="modalInfo.title" placeholder="请输入" />
        </a-form-item>

        <a-form-item
          field="context"
          label="正文内容"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-textarea
            v-model="modalInfo.context"
            placeholder="请输入"
            auto-size
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
    addNotice,
    updateNotice,
    deleteNotice,
    NoticeRecord,
    NoticeParams,
    queryNoticeList,
  } from '@/api/notice';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { Message, Modal } from '@arco-design/web-vue';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {};
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<NoticeRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const modalFormRef = ref();

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
      title: '排序',
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '正文内容',
      dataIndex: 'context',
      slotName: 'context',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '更新时间',
      dataIndex: 'modifyDate',
      slotName: 'modifyDate',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 200,
      align: 'center',
    },
  ]);
  const fetchData = async (
    params: NoticeParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      // const { data } = await queryNoticeList(params);
      // renderData.value = data || [];
      // pagination.current = params.current;
      // pagination.total = data.length;
      const res = await queryNoticeList({ ...params, pageNo: params.current });
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
    } as unknown as NoticeParams);
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

  const handleEdit = (record: NoticeRecord) => {
    if (record) {
      modalInfo.value = { ...record };
    } else {
      modalInfo.value = {};
    }
    modalVisible.value = true;
  };

  const handleModalCancel = () => {
    modalVisible.value = false;
    modalFormRef.value.clearValidate();
  };

  const handleModalOk = async () => {
    modalFormRef.value.validate(async (err) => {
      if (!err) {
        const res = modalInfo.value.id
          ? await updateNotice(modalInfo.value)
          : await addNotice(modalInfo.value);
        if (res) {
          search();
          Message.success('更新成功');
          handleModalCancel();
        }
      }
    });
  };

  const handlePublish = async (record: NoticeRecord) => {
    const res = await updateNotice({
      ...record,
      status: Number(record.status) === 1 ? `0` : '1',
    });
    if (res) {
      search();
      Message.success('更新成功');
    }
  };
  const handleDelete = async (record: NoticeRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后不可恢复',
      onOk: async () => {
         const res = await deleteNotice({
          id: record.id,
        });
        if (res) {
          search();
          Message.success('删除成功');
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
