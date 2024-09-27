import React, { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from '@components/Header';
import { routesManager } from 'RemoteLib';

import styles from './index.module.less';

export default ({ routeKey = 'app' }) => {

	const navigate = useNavigate();
	const location = useLocation();


	useEffect(() => {
		// 路由严格匹配当前组件时
		if (routesManager.activeRoute?.key == routeKey) {
			const route = routesManager.getRouteByKey(routeKey);
			const targetUrl = routesManager.makeAbsoluteUrlByKey({
				key: route.children[0].key,
			});
			navigate(targetUrl);
			return;
		}

	}, [routeKey, navigate, location]);

	return (
		<div className={styles.wrap}>
			<Header routeKey={routeKey} />
			<div className={styles.bodyWrap}>
				<Outlet />
			</div>
		</div>
	);
};
