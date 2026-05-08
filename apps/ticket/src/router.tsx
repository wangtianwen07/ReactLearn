import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Layout, Segmented, Space, Table, Tag, Typography } from 'antd';
import { create } from 'zustand';
import { getCurrentUser, listTickets } from '@react-learn/api';
import { canAccessAction, getDataScopeDescription, ACTION_KEYS } from '@react-learn/auth';
import type { TicketRecord } from '@react-learn/shared';

const { Header, Content } = Layout;

interface TicketRouterProps {
  standalone?: boolean;
}

type StatusFilter = TicketRecord['status'] | 'ALL';

interface TicketState {
  status: StatusFilter;
  setStatus: (status: StatusFilter) => void;
}

const useTicketStore = create<TicketState>((set) => ({
  status: 'ALL',
  setStatus: (status) => set({ status }),
}));

function TicketBoardPage() {
  const status = useTicketStore((state) => state.status);
  const setStatus = useTicketStore((state) => state.setStatus);
  const { data: user } = useQuery({ queryKey: ['session-user'], queryFn: getCurrentUser });
  const { data = [], isFetching } = useQuery({
    queryKey: ['tickets', status],
    queryFn: () => listTickets(status),
  });
  const canCloseTicket = canAccessAction(user?.role ?? 'AGENT', ACTION_KEYS.ticketClose);

  const columns = useMemo(
    () => [
      { title: '工单号', dataIndex: 'id', key: 'id' },
      { title: '标题', dataIndex: 'title', key: 'title' },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
        render: (value: TicketRecord['priority']) => (
          <Tag color={value === 'P1' ? 'red' : value === 'P2' ? 'gold' : 'blue'}>{value}</Tag>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (value: TicketRecord['status']) => (
          <Tag color={value === 'DONE' ? 'green' : value === 'PROCESSING' ? 'processing' : 'default'}>{value}</Tag>
        ),
      },
      { title: '处理人', dataIndex: 'assignee', key: 'assignee' },
    ],
    []
  );

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Ticket 工单域子应用
        </Typography.Title>
        <Typography.Paragraph>
          当前角色：{user?.role ?? '未加载'}；数据范围：
          {user ? getDataScopeDescription(user.role, 'ticket') : '加载中...'}。
        </Typography.Paragraph>
        <Segmented
          value={status}
          options={['ALL', 'OPEN', 'PROCESSING', 'DONE']}
          onChange={(value) => setStatus(value as StatusFilter)}
        />
      </Card>
      {!canCloseTicket && <Alert type="warning" message="当前角色不可关闭工单，仅可查看或被指派的工单。" showIcon />}
      <Card title="工单看板">
        <Table<TicketRecord> rowKey="id" columns={columns} dataSource={data} loading={isFetching} pagination={false} />
      </Card>
    </Space>
  );
}

export function TicketRouter({ standalone = true }: TicketRouterProps) {
  return (
    <Layout className="ticket-wrapper">
      <Header style={{ background: '#fff', marginBottom: 24, borderRadius: 16, display: 'flex', alignItems: 'center' }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Ticket 业务域子应用
          </Typography.Title>
          <Typography.Text type="secondary">{standalone ? '独立运行模式' : 'qiankun 挂载模式'}</Typography.Text>
        </div>
      </Header>
      <Content>
        <TicketBoardPage />
      </Content>
    </Layout>
  );
}
