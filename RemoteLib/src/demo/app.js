import React, { useEffect } from 'react';
import { RemoteLibWapper, useRemoteLibData } from '../index';
import { Menu, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import { Outlet, NavLink, useNavigate, useMatches } from 'react-router-dom';
import { routesManager } from '@/routerUtils';
import styles from './index.module.less';

const App = () => {
	const { themeConfig } = useRemoteLibData();
  const matches = useMatches();
  const rootRoute = routesManager.getRouteByKey('app');
  const items = rootRoute?.children?.map(v => ({ key: v.key, label:  <NavLink to={v.path}>{v.title}</NavLink>   }));
  const currentKeys = matches?.map(v => routesManager.getRouteByPath(v.pathname)?.key)
  const theme = {
		cssVar: {
			key: 'remote-lib' // antd的css 变量注入在该class类名下
		},
		hashed: false,
		token: {
			...(themeConfig || {})
		}
	};

  return <ConfigProvider theme={theme} locale={zhCN}>
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Menu style={{width: '100%'}} selectedKeys={currentKeys} mode="horizontal" items={items} />
      </div>
      <div className={styles.main}>
        <Outlet />
      </div>
  </div>
  </ConfigProvider>
}
export default () => {

  const navigate = useNavigate();

  useEffect(() => {
    if(routesManager.activeRoute.key == 'app') {
      const route = routesManager.getRouteByKey('app.demo1');
      navigate(route.children[0].absolutePath);
    }
  }, []);

  return (
    <RemoteLibWapper window={window} appId="demo">
     <App />
    </RemoteLibWapper>
  );
}