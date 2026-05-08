import { useState } from 'react';
import { Alert, Button, Card, Form, Input, List, Typography, message } from 'antd';
import { getApiErrorMessage, getDemoAccounts, login } from '@react-learn/api';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSessionSnapshot } from './useSessionSnapshot';

interface LoginFormValues {
  username: string;
  password: string;
}

export function LoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSessionSnapshot();
  const demoAccounts = getDemoAccounts();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  if (session.isAuthenticated) {
    return <Navigate to={from === '/login' ? '/' : from} replace />;
  }

  const onFinish = async (values: LoginFormValues) => {
    try {
      setSubmitting(true);
      const result = await login(values);
      message.success(`欢迎回来，${result.user.name}`);
      navigate(from, { replace: true });
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #f0f5ff 0%, #f8fafc 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{ width: '100%', maxWidth: 960, borderRadius: 24, boxShadow: '0 20px 60px rgba(15,23,42,0.08)' }}
        bodyStyle={{ padding: 32 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 32 }}>
          <div>
            <Typography.Title level={2}>ReactLearn 登录入口</Typography.Title>
            <Typography.Paragraph type="secondary">
              这是企业级中后台模板的登录页骨架，使用 mock 登录、会话持久化、路由守卫与 RBAC 常量配合。
            </Typography.Paragraph>
            <Alert
              type="info"
              showIcon
              message="推荐登录流程"
              description="登录成功后会将 access token / refresh token 与用户快照写入本地会话存储；受保护页面会在刷新后自动恢复。"
              style={{ marginBottom: 24 }}
            />
            <Typography.Title level={4}>演示账号</Typography.Title>
            <List
              bordered
              dataSource={demoAccounts}
              renderItem={(account) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${account.username} / ${account.password}`}
                    description={`角色：${account.role}`}
                  />
                </List.Item>
              )}
            />
          </div>
          <Card title="登录" variant="borderless" style={{ background: '#fafafa' }}>
            <Form<LoginFormValues>
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ username: 'org.admin', password: 'Admin@123' }}
            >
              <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder="例如：org.admin" autoComplete="username" />
              </Form.Item>
              <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password placeholder="请输入密码" autoComplete="current-password" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={submitting}>
                登录并进入系统
              </Button>
            </Form>
          </Card>
        </div>
      </Card>
    </div>
  );
}
