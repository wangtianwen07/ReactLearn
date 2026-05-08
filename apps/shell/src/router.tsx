import { AppstoreOutlined, DesktopOutlined, HomeOutlined, LogoutOutlined, SafetyOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography } from 'antd';
import { useMemo } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getDashboardMetrics, logout } from '@react-learn/api';
import { ROUTE_KEYS, getDataScopeDescription, type RouteKey } from '@react-learn/auth';
import { microAppManifests, shellHighlights, type ChildAppManifest } from '@react-learn/shared';
import { create } from 'zustand';
import { LoginPage } from './auth/LoginPage';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { useSessionSnapshot } from './auth/useSessionSnapshot';

const { Header, Sider, Content } = Layout;

interface ShellState {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const useShellStore = create<ShellState>((set) => ({
  collapsed: false,
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
}));

const microAppRouteKeys: Record<ChildAppManifest['name'], RouteKey> = {
  iam: ROUTE_KEYS.iamUsers,
  ticket: ROUTE_KEYS.ticketBoard,
};

function DashboardPage() {
  const { data: user } = useQuery({ queryKey: ['current-user'], queryFn: getCurrentUser });
  const { data: metrics = [] } = useQuery({ queryKey: ['dashboard-metrics'], queryFn: getDashboardMetrics });

  return (
    <div className="page-grid">
      <Typography.Title level={2} style={{ margin: 0 }}>
        企业级中后台 Shell
      </Typography.Title>
      <Typography.Paragraph className="muted-text" style={{ marginTop: 0 }}>
        当前角色：{user?.role}；组织：{user?.orgName}。这个应用提供基座布局、统一导航、权限入口与共享能力。
      </Typography.Paragraph>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {metrics.map((metric) => (
          <div
            key={metric.key}
            style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 6px 20px rgba(15,23,42,0.06)' }}
          >
            <div className="muted-text">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="muted-text">{metric.trend}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
        <Typography.Title level={4}>模板亮点</Typography.Title>
        <ul>
          {shellHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
        <Typography.Title level={4}>业务域子应用清单（qiankun 已接入）</Typography.Title>
        <div style={{ display: 'grid', gap: 12 }}>
          {microAppManifests.map((app) => (
            <div key={app.name} style={{ border: '1px solid #eef2f7', borderRadius: 12, padding: 16 }}>
              <Typography.Text strong>{app.title}</Typography.Text>
              <div className="muted-text">{app.description}</div>
              <div className="muted-text">主应用挂载路由：{app.activeRule}</div>
              <div className="muted-text">独立运行入口：{app.entry}</div>
              <Space style={{ marginTop: 12 }}>
                <Button type="primary" href={app.activeRule}>
                  在 Shell 内打开
                </Button>
                <Button href={app.entry} target="_blank" rel="noreferrer">
                  独立运行
                </Button>
              </Space>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MicroAppPage({ app }: { app: ChildAppManifest }) {
  return (
    <div className="page-grid">
      <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {app.title}
        </Typography.Title>
        <Typography.Paragraph className="muted-text">
          当前页面由 Shell 通过 qiankun 挂载子应用。你也可以打开独立入口进行单独开发与调试。
        </Typography.Paragraph>
        <Space>
          <Button href={app.entry} target="_blank" rel="noreferrer">
            独立运行：{app.entry}
          </Button>
        </Space>
      </div>
      <div
        id={app.containerId}
        style={{
          minHeight: '70vh',
          background: '#fff',
          borderRadius: 16,
          padding: 8,
          boxShadow: '0 6px 20px rgba(15,23,42,0.06)',
        }}
      />
    </div>
  );
}

function ArchitecturePage() {
  return (
    <div className="page-grid">
      <Typography.Title level={2}>工程模板结构</Typography.Title>
      <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
        <Typography.Paragraph>
          <strong>apps/</strong>：`shell`、`iam`、`ticket` 三个业务应用，后续可通过 qiankun 基座统一装配。
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>packages/shared</strong>：公共类型、微应用清单、演示数据。
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>packages/auth</strong>：RBAC routeKey/actionKey 与权限判断。
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>packages/api</strong>：Axios 工厂 + mock API，后续可替换为真实网关地址。
        </Typography.Paragraph>
      </div>
    </div>
  );
}

function PermissionsPage() {
  const { data: user } = useQuery({ queryKey: ['current-user'], queryFn: getCurrentUser });

  return (
    <div className="page-grid">
      <Typography.Title level={2}>权限与数据范围</Typography.Title>
      <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
        <Typography.Paragraph>
          本模板将 RBAC 拆为菜单/路由、按钮/操作、数据权限三层，并在 `packages/auth` 统一常量与判断逻辑。
        </Typography.Paragraph>
        <Typography.Paragraph>
          当前账号在 IAM 域的数据范围：{user ? getDataScopeDescription(user.role, 'iam') : '加载中...'}
        </Typography.Paragraph>
        <Typography.Paragraph>
          当前账号在 Ticket 域的数据范围：{user ? getDataScopeDescription(user.role, 'ticket') : '加载中...'}
        </Typography.Paragraph>
      </div>
    </div>
  );
}

function ForbiddenPage() {
  return (
    <div className="page-grid">
      <div style={{ background: '#fff', borderRadius: 16, padding: 24 }}>
        <Typography.Title level={2}>403 无权限访问</Typography.Title>
        <Typography.Paragraph className="muted-text">
          当前账号没有访问该模块的 RBAC 路由权限。你可以切换演示账号，或返回首页查看当前角色的数据范围说明。
        </Typography.Paragraph>
      </div>
    </div>
  );
}

function ShellLayout() {
  const collapsed = useShellStore((state) => state.collapsed);
  const toggleCollapsed = useShellStore((state) => state.toggleCollapsed);
  const session = useSessionSnapshot();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith('/architecture')) return 'architecture';
    if (location.pathname.startsWith('/permissions')) return 'permissions';
    const activeMicroApp = microAppManifests.find((app) => location.pathname.startsWith(app.activeRule));
    if (activeMicroApp) return activeMicroApp.name;
    return 'dashboard';
  }, [location.pathname]);

  const menuItems = useMemo(
    () => [
      { key: 'dashboard', icon: <HomeOutlined />, label: '基座总览' },
      { key: 'architecture', icon: <DesktopOutlined />, label: '工程结构' },
      { key: 'permissions', icon: <SafetyOutlined />, label: '权限模型' },
      ...microAppManifests.map((app) => ({
        key: app.name,
        icon: <AppstoreOutlined />,
        label: app.title,
      })),
    ],
    []
  );

  const handleMenuClick = (key: string) => {
    if (key === 'dashboard') {
      navigate('/');
      return;
    }
    if (key === 'architecture' || key === 'permissions') {
      navigate(`/${key}`);
      return;
    }

    const targetApp = microAppManifests.find((app) => app.name === key);
    if (targetApp) {
      navigate(targetApp.activeRule);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed} theme="light">
        <div style={{ padding: 20, fontWeight: 700 }}>ReactLearn</div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => handleMenuClick(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingInline: 24,
          }}
        >
          <Space direction="vertical" size={0}>
            <Typography.Text strong>Shell / 企业级中后台工程模板</Typography.Text>
            <Typography.Text type="secondary">
              当前登录：{session.user?.name ?? '游客'} / {session.user?.role ?? '未登录'}
            </Typography.Text>
          </Space>
          <Space wrap>
            {microAppManifests.map((app) => (
              <Button key={app.name} size="small" href={app.entry} target="_blank" rel="noreferrer">
                {app.title}（独立）
              </Button>
            ))}
            <Button size="small" icon={<LogoutOutlined />} onClick={handleLogout}>
              退出登录
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<ShellLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute routeKey={ROUTE_KEYS.dashboard}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/architecture"
            element={
              <ProtectedRoute routeKey={ROUTE_KEYS.architecture}>
                <ArchitecturePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <ProtectedRoute routeKey={ROUTE_KEYS.permissions}>
                <PermissionsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          {microAppManifests.map((app) => (
            <Route
              key={app.name}
              path={`${app.activeRule}/*`}
              element={
                <ProtectedRoute routeKey={microAppRouteKeys[app.name]}>
                  <MicroAppPage app={app} />
                </ProtectedRoute>
              }
            />
          ))}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
