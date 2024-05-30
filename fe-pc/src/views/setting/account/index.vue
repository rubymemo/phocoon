<template>
  <div class="container">
    <Breadcrumb :items="['menu.setting', 'menu.setting.account']" />
    <a-card class="general-card" :title="$t('menu.setting.account')">
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleEdit">
              <template #icon>
                <icon-plus />
              </template>
              添加后台账号
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
        <template #roleName="{ record }">
          {{ UserRoleTextMap.get(record.roleName) }}
        </template>
        <template #status="{ record }">
          <a-badge v-if="Number(record.status) === 1" status="success" text="启用"/>
          <a-badge v-else status="danger" text="关闭"/>
        </template>
        <template #operations="{ record }">
          <div>
          <a-button
            type="text"
            size="small"
            @click="handleEdit(record)"
          >
            修改
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="handlePublish(record)"
          >
            {{  Number(record.status) === 1 ? '关闭' : '启用' }}
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="handleDelete(record)"
            v-if="Number(record.status) === 0"
          >
            删除
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
      <template #title> 后台账号 </template>
      <a-form :model="modalInfo" :auto-label-width="true" ref="modalFormRef">
				<a-form-item field="account" label="登录账号" :rules="[{required:true,message:'必填'}]">
          <a-input v-model.trim="modalInfo.account" placeholder="请输入" allow-clear />
        </a-form-item>
        <a-form-item field="password" label="登录密码" :rules="[{required:true,message:'必填'}]">
          <a-input-password v-model.trim="modalInfo.password" placeholder="请输入" :defaultVisibility="true" allow-clear />
        </a-form-item>
				<a-form-item field="repeatPassword" label="确认登录密码" validate-trigger="blur" :rules="[{required:true,message:'必填'},{
          validator: (value, cb) => {
            if (value !== modalInfo.password) {
              cb('两次输入的密码不一致')
            } else {
              cb()
            }
          }
        }]">
          <a-input-password v-model.trim="modalInfo.repeatPassword" placeholder="请输入" :defaultVisibility="true" allow-clear />
        </a-form-item>
        <a-form-item field="userName" label="使用者名称" :rules="[{required:true,message:'必填'}]">
          <a-input v-model.trim="modalInfo.userName" placeholder="请输入" allow-clear />
        </a-form-item>
				<a-form-item field="roleName" label="使用角色" :rules="[{required:true,message:'必填'}]">
					<a-select v-model="modalInfo.roleName" placeholder="请选择" allow-create>
            <a-option value="admin">{{  UserRoleTextMap.get('admin') }}</a-option>
            <a-option value="finance">{{  UserRoleTextMap.get('finance') }}</a-option>
            <a-option value="data">{{  UserRoleTextMap.get('data') }}</a-option>
            <a-option value="operation">{{  UserRoleTextMap.get('operation') }}</a-option>
          </a-select>
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
    getAccountList,
    updateAccount,
    addAccount,
    deleteAccount,
    UserRoleTextMap,
    UserRecord,
    UserParams
  } from '@/api/user';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { Message, Modal } from '@arco-design/web-vue';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const defaultModalInfo = {
    id: null,
    account: '',
    password: '',
    repeatPassword: '',
    userName: '',
    roleName: '',
  }

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
  const renderData = ref<UserRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const modalFormRef = ref();

  const size = ref<SizeProps>('medium');

  const modalVisible = ref(false);
  const modalInfo = ref<Record<string, any>>({ ...defaultModalInfo });

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20
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
      title: '创建日期',
      dataIndex: 'createDate',
    },
    {
      title: '使用者名称',
      dataIndex: 'userName',
    },
    {
      title: '使用角色',
      dataIndex: 'roleName',
      slotName: 'roleName',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '密码',
      dataIndex: 'password',
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 240,
      align: 'center',
    },
  ]);
  const fetchData = async (
    params: UserParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const res = await getAccountList(params);
      renderData.value = res.data || [];
      pagination.current = params.current;
      pagination.total = res.data.length || 0;
      // const res = await getAccountList({ ...params, pageNo: params.current });
      // renderData.value = res.data.rows || [];
      // pagination.current = params.current;
      // pagination.total = res.data?.total ?? 0;
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
    } as unknown as UserParams);
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

  const handleEdit = (record?: UserRecord) => {
    if (record) {
      modalInfo.value = { 
        id: record.id,
        account: record.account,
        password: record.password,
        repeatPassword: record.password,
        userName: record.userName,
        roleName: record.roleName,
      };
    } else {
      modalInfo.value = {
        ...defaultModalInfo
      };
    }
    modalFormRef.value.clearValidate();
    modalVisible.value = true;
  };

  const handleModalCancel = () => {
    modalVisible.value = false;
  };
  const handleModalOk = async () => {
    modalFormRef.value.validate(async(err) => {
      if(!err) {
        const res = modalInfo.value.id ? await updateAccount(modalInfo.value) :await addAccount({...modalInfo.value, status: '0'});
        if(res) {
          search();
          Message.success('更新成功');
          handleModalCancel()
        }
      }
    })
  };
 
  const handlePublish = (record: UserRecord) => {
    Modal.confirm({
      title: Number(record.status) === 1 ? '确认关闭' : '确认开启',
      content: `是否${Number(record.status) === 1 ? '关闭' : '开启'}该账号？`,
      onOk: async () => {
        const res = await updateAccount({
          ...record,
          status: Number(record.status) === 1 ? '0' : '1',
        });
        if(res) {
          search();
          Message.success('操作成功');
        }
      }
    })
  };

  const handleDelete = (record: UserRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `是否确认删除该账号？`,
      onOk: async () => {
        const res = await deleteAccount({
          id: record.id,
        });
        if(res) {
          search();
          Message.success('操作成功');
        }
      }
    })
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
