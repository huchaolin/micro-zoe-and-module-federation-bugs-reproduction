import microApp from '@micro-zoe/micro-app';
import { Routes, Route } from 'react-router-dom';
import SiderMenus from '@components/SiderMenus';
import MicroApp from '@components/MicroApp';

import styles from './index.module.less';

microApp.start({
	'disable-patch-request': true, // 关闭对子应用请求的拦截
	'router-mode': 'native',
});

const appList = [
	{
		id: 'micro-app-1-subApp1',
		url: `${location.origin}/micro-app-1/`, // 微应用访问url， webpack做转发
		baseroute: '/host-app/micro-app-1', // 微应用路由basename
		path: '/host-app/micro-app-1/subApp1', // 基座导航跳转
		matchPath: `/host-app/micro-app-1/subApp1/*`, // 基座路由匹配
		name: 'micro-app-1/subApp1',
	},
	{
		id: 'micro-app-1-subApp2',
		url: `${location.origin}/micro-app-1/`,
		baseroute: '/host-app/micro-app-1', 
		path: '/host-app/micro-app-1/subApp2',
		matchPath: `/host-app/micro-app-1/subApp2/*`,
		name: 'micro-app-1/subApp2',
	},
	{
		id: 'micro-app-2',
		url: `${location.origin}/micro-app-2/`,
		baseroute: '/host-app/micro-app-2', 
		path: '/host-app/micro-app-2',
		matchPath: `/host-app/micro-app-2/*`,
		name: 'micro-app-2',
	}
];

export default () => {

	return (
		<div className={styles.app}>
			<div className={styles.main}>
				<SiderMenus appList={appList} />
				<div className={styles.microApp}>
					<Routes>
						{appList?.map((app) => {
							return <Route key={app.id} path={app.matchPath} element={<MicroApp app={app} />} />;
						})}
					</Routes>
				</div>
			</div>
		</div>
	);
};
