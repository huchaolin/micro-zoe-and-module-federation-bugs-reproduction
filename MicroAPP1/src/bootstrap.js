import React from 'react';
import { createRoot } from 'react-dom/client';
import Loading from '@components/Loading';
import loadable from '@loadable/component';
import { RouterProvider } from 'react-router-dom';
import routeConfig from './routeConfig';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { useRemoteLibData, createBrowserRouter } from 'RemoteLib';

const APP_ID = 'micro-app-1';
const RemoteLibWapper = loadable(() =>
	import('RemoteLib').then((l) => {
		return {
			default: l.RemoteLibWapper
		};
	})
);

const basename = window.__MICRO_APP_BASE_ROUTE__ || `/${APP_ID}`;

const router = createBrowserRouter(routeConfig, { basename });


const AntdConfigWapper = ({children}) => {

	const { themeConfig } = useRemoteLibData();
	const theme = {
		cssVar: {
			key: APP_ID // antd的css 变量注入在该class类名下
		},
		hashed: false,
		token: {
			...(themeConfig || {})
		}
	};

	return <ConfigProvider theme={theme} locale={zhCN}>
		{children}
	</ConfigProvider>
}


const RootComponent = () => {
	
	return (
		<RemoteLibWapper fallback={<Loading />} window={window} appId={APP_ID}>
				<AntdConfigWapper>					
					<RouterProvider router={router} />
			</AntdConfigWapper>
		</RemoteLibWapper>
	);
};

const render = () => {
	const rootElement = document.getElementById(APP_ID);

	const root = createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<RootComponent />
		</React.StrictMode>
	);
};

render();
