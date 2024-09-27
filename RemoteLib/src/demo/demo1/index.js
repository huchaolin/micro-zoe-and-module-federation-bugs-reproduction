import React, { useEffect } from 'react';
import { Menu } from 'antd';

import { Outlet, NavLink, useNavigate, useMatches } from 'react-router-dom';
import { routesManager, useActiveRoute } from '@/routerUtils';
import styles from './index.module.less';

export default () => {
  const matches = useMatches();
  const activeRoute = useActiveRoute();
  const rootRoute = routesManager.getRouteByKey('app.demo1');
  const items = rootRoute?.children?.map(v => ({ key: v.key, label: <NavLink to={v.path}>{v.title}</NavLink>  }));
  const currentKeys = matches?.map(v => routesManager.getRouteByPath(v.pathname)?.key)
  const navigate = useNavigate();

  useEffect(() => {
    if(activeRoute.key == 'app.demo1') {
      const route = routesManager.getRouteByKey('app.demo1');
      navigate(route.children[0].absolutePath);
    }
  }, [activeRoute]);

  return (
      <div className={styles.wrap}>
        <div className={styles.menu}>
          <Menu style={{width: '100%', height: '100%' }} selectedKeys={currentKeys} mode="vertical" items={items} />
        </div>
        <div className={styles.main}>
          <Outlet />
        </div>
      </div>
  );
}