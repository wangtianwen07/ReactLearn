import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, Layout, Space, Table, Tag, Typography } from 'antd';
import { create } from 'zustand';
import { createUser, getCurrentUser, listUsers } from '@react-learn/api';
import { ACTION_KEYS, canAccessAction } from '@react-learn/auth';
import type { UserRecord } from '@react-learn/shared';

const { Header, Content } = Layout;

interface IamRouterProps {
  standalone?: boolean;
}

interface IamState {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

const useIamStore = create<IamState>((set) => ({
  keyword: '',
  setKeyword: (keyword) => set({ keyword }),
}));

const userFormSchema = z.object({
  name: z.string().min(2, '姓名至少 2 个字符'),
  email: z.string().email('请输入合法邮箱'),
  phone: z.string().min(11, '请输入手机号或脱敏手机号'),
  department: z.string().min(2, '部门不能为空'),
});

type UserFormValues = z.infer<typeof userFormSchema>;

function CreateUserCard() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({ queryKey: ['session-user'], queryFn: getCurrentUser });
  const { control, handleSubmit, reset, formState } = useForm<UserFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: '',
    },
    resolver: zodResolver(userFormSchema),
  });

  const canCreate = canAccessAction(user?.role ?? 'AGENT', ACTION_KEYS.userCreate);

  useEffect(() => {
    if (user) {
      reset({
        name: '',
        email: '',
        phone: '',
        department: user.orgName,
      });
    }
  }, [reset, user]);

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['iam-users'] });
      reset();
    },
  });

  return (
    <Card title="快速新增用户（RHF + Zod 模板示例）">
      <Form layout="vertical" onFinish={handleSubmit((values) => mutation.mutate(values))}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Form.Item label="姓名" validateStatus={fieldState.error ? 'error' : ''} help={fieldState.error?.message}>
                <Input {...field} placeholder="例如：周倩" />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Form.Item label="邮箱" validateStatus={fieldState.error ? 'error' : ''} help={fieldState.error?.message}>
                <Input {...field} placeholder="name@corp.local" />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <Form.Item
                label="手机号"
                validateStatus={fieldState.error ? 'error' : ''}
                help={fieldState.error?.message}
              >
                <Input {...field} placeholder="13800000000" />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            name="department"
            render={({ field, fieldState }) => (
              <Form.Item label="部门" validateStatus={fieldState.error ? 'error' : ''} help={fieldState.error?.message}>
                <Input {...field} placeholder="运营交付部" />
              </Form.Item>
            )}
          />
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
            disabled={!canCreate || formState.isSubmitting}
          >
            {canCreate ? '提交创建' : '当前角色无创建权限'}
          </Button>
        </Space>
      </Form>
    </Card>
  );
}

function UsersTable() {
  const keyword = useIamStore((state) => state.keyword);
  const setKeyword = useIamStore((state) => state.setKeyword);
  const { data = [], isFetching } = useQuery({
    queryKey: ['iam-users', keyword],
    queryFn: () => listUsers(keyword),
  });

  const columns = useMemo(
    () => [
      { title: '用户', dataIndex: 'name', key: 'name' },
      { title: '邮箱', dataIndex: 'email', key: 'email' },
      { title: '部门', dataIndex: 'department', key: 'department' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (value: UserRecord['status']) => <Tag color={value === 'ENABLED' ? 'green' : 'orange'}>{value}</Tag>,
      },
    ],
    []
  );

  return (
    <Card
      title="用户列表"
      extra={
        <Input.Search placeholder="按姓名/邮箱/部门搜索" allowClear onSearch={setKeyword} style={{ width: 280 }} />
      }
    >
      <Table<UserRecord> rowKey="id" columns={columns} dataSource={data} loading={isFetching} pagination={false} />
    </Card>
  );
}

function OverviewCards() {
  const { data: user } = useQuery({ queryKey: ['session-user'], queryFn: getCurrentUser });

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          IAM 子应用
        </Typography.Title>
        <Typography.Paragraph>
          当前模板演示了：查询状态放入 Zustand、列表数据使用 TanStack Query、权限按钮使用 `packages/auth`、表单校验使用
          RHF + Zod。
        </Typography.Paragraph>
      </Card>
      <Card>
        <Typography.Text strong>当前角色</Typography.Text>
        <div>{user?.role ?? '未加载'}</div>
        <Typography.Text strong>组织数据范围</Typography.Text>
        <div>{user?.orgName ?? '未加载组织信息'}</div>
      </Card>
    </Space>
  );
}

export function IamRouter({ standalone = true }: IamRouterProps) {
  return (
    <Layout className="iam-wrapper">
      <Header style={{ background: '#fff', marginBottom: 24, borderRadius: 16, display: 'flex', alignItems: 'center' }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            IAM 权限域子应用
          </Typography.Title>
          <Typography.Text type="secondary">{standalone ? '独立运行模式' : 'qiankun 挂载模式'}</Typography.Text>
        </div>
      </Header>
      <Content>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1.1fr 1.4fr' }}>
          <OverviewCards />
          <CreateUserCard />
        </div>
        <div style={{ marginTop: 16 }}>
          <UsersTable />
        </div>
      </Content>
    </Layout>
  );
}
