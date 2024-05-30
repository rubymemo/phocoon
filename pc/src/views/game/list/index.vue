<template>
  <div class="container">
    <Breadcrumb :items="['menu.game', 'menu.game.list']"
      />
    <a-card class="general-card" :title="$t('menu.game.list')">
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
                <a-form-item
                  field="gameName"
                  label="游戏名称"
                >
                  <a-input
                    v-model.trim="formModel.gameName"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="gameType"
                  label="游戏类型"
                >
                  <a-select
                    v-model.trim="formModel.gameType"
                    placeholder="请选择"
                    allow-create
                  >
                    <a-option v-for="(item, index) in gameTypeList" :value="item" :key="index" >{{ item }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="profitModel"
                  label="变现模式"
                  allow-create
                >
                  <a-select
                    v-model.trim="formModel.profitModel"
                    placeholder="请选择"
                    allow-create
                  >
                  <a-option value="CPS+M 佣金">CPS+M 佣金</a-option>
                  <!-- <a-option value="内购">内购</a-option>
                  <a-option value="广告">广告</a-option>
                  <a-option value="佣金">佣金</a-option> -->
                  </a-select>
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
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleEdit">
              <template #icon>
                <icon-plus />
              </template>
                新建
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
        <template #commissionRate="{ record }">
          {{ record.commissionRate }}%
        </template>

        <template #gameStatus="{ record }">
          <a-badge v-if="Number(record.gameStatus) === 1" status="success" text="上线"/>
          <a-badge v-else status="danger" text="下线"/>
        </template>
        <template #operations="{record}">
          <view>
          <a-button type="text" @click="handleEdit(record)">
            编辑
          </a-button>
          <a-button type="text" size="small" @click="upDownStatus(record)">
              {{  Number(record.gameStatus) === 1 ? '下线' : '上线' }}
          </a-button>
          <a-button type="text" size="small" @click="topGame(record)">
              置顶
          </a-button>
          </view>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :visible="modalVisible"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <template #title> {{modalInfo.id ? '编辑' : '新增'}}游戏 </template>
      <a-form ref="modalFormRef" :model="modalInfo"  :auto-label-width="true">
        <a-form-item field="gameName" label="游戏名称" :rules="[{required:true,message:'必填'}]">
          <a-input v-model.trim="modalInfo.gameName" placeholder="请输入" />
        </a-form-item>

        <a-form-item field="gameType" label="游戏类型" :rules="[{required:true,message:'必填'}]">
          <a-select v-model.trim="modalInfo.gameType" placeholder="请选择，或者输入后选择" allow-create>
            <a-option v-for="(item, index) in gameTypeList" :value="item" :key="index" >{{ item }}</a-option>
          </a-select>
        </a-form-item>

        <a-form-item field="profitModel" label="变现模式" >
          <a-select v-model="modalInfo.profitModel" placeholder="请选择，或者输入后选择" allow-create :disabled="true">
            <!-- <a-option value="内购">内购</a-option> :rules="[{required:true,message:'必填'}]"
            <a-option value="广告">广告</a-option>
            <a-option value="佣金">佣金</a-option> -->
            <a-option value="CPS+M 佣金">CPS+M 佣金</a-option>
          </a-select>
        </a-form-item>

        <a-form-item field="commissionRate" label="分成比例" :rules="[{required:true,message:'必填'}]">
          <a-input-number v-model="modalInfo.commissionRate" placeholder="请输入" />
        </a-form-item>

        <a-form-item field="channelLimit" label="推广渠道名额" :rules="[{required:true,message:'必填'}]">
          <a-input-number v-model="modalInfo.channelLimit" placeholder="请输入" />
        </a-form-item>

        <a-form-item field="developerName" label="开发商名称" :rules="[{required:true,message:'必填'}]">
          <a-input v-model.trim="modalInfo.developerName" placeholder="请输入" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { addGame, updateGame, upTopGame, 
    queryGameList, GameRecord, GameParams } from '@/api/game';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { Message } from '@arco-design/web-vue';
  import loash from 'lodash';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const gameTypeList = ["角色", "休闲", "动作", "棋牌", "竞技", "其他"];


  const generateFormModel = () => {
    return {
      gameName: '',
      gameType: '',
      profitModel: '',
    };
  };

  
  const defaultModal = {
      id: null,
      gameName: '',
      gameType: '',
      profitModel: 'CPS+M 佣金',
      channelLimit: 0,
      commissionRate: 0,
      developerName: '',
      gameStatus: '0' 
  }
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<GameRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');


  const modalVisible = ref(false);
  const modalInfo = ref({ ...defaultModal });
  const modalFormRef = ref();

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
      title: '游戏名称',
      dataIndex: 'gameName',
    },
    {
      title: '游戏类型',
      dataIndex: 'gameType',
    },
    {
      title: '变现模式',
      dataIndex: 'profitModel',
    },
    {
      title: '分成比例',
      dataIndex: 'commissionRate',
      slotName: 'commissionRate'
    },
    {
      title: '渠道名额',
      dataIndex: 'channelLimit',
    },
    {
      title: '开发商名称',
      dataIndex: 'developerName',
    },
    {
      title: '运营状态',
      dataIndex: 'gameStatus',
      slotName: 'gameStatus',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center',
    },
  ]);
  const fetchData = async (
    params: GameParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const res = await queryGameList({ ...params, pageNo: params.current });
      renderData.value = res.data.rows || [];
      pagination.current = params.current;
      pagination.total = res.data?.total ?? 0;
      // const { data } = await queryGameList(params);
      // renderData.value = data || [];
      // pagination.current = params.current;
      // pagination.total = (data || []).length;
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
    } as unknown as GameParams);
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

  const handleEdit = (record: GameRecord) => {
    if(record.id) {
      const data = loash.pick(record, [ 'id',
      'gameName',
      'gameType',
      'profitModel',
      'channelLimit',
      'commissionRate',
      'developerName',
      'gameStatus'
       ])
      modalInfo.value = data;
    } else {      
      modalInfo.value = { ...defaultModal };
    }
    modalVisible.value = true;
  };
  const handleModalCancel = () => {
    modalFormRef.value.resetFields();
    modalVisible.value = false;
  };
  const handleModalOk = async () => {
    modalFormRef.value.validate(async(err) => {
      if(!err) {
        const res = modalInfo.value.id ? await updateGame(modalInfo.value) : await addGame({...modalInfo.value, gameStatus: '0'});
        if(res) {
          search();
          Message.success('更新成功');
          handleModalCancel()
        }
      }
    })
  };
  const upDownStatus =  async (record: GameRecord) => {
    const res = await updateGame({
      ...record,
      gameStatus: Number(record.gameStatus) === 1 ? '0': '1',
    })
    if(res) {
      search();
      Message.success('更新成功');
    }
  }
  const topGame = async (record: GameRecord) => {
    const res = await upTopGame({id: record.id})
    if(res) {
      search();
    }
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
