import React from 'react';
import { createRoot } from 'react-dom/client';
import Loading from '@components/Loading';
import loadable from '@loadable/component';
import { ConfigProvider } from 'antd';
import { CommonHooksWrapper } from '@common/hooks';
import { useRemoteLibData } from 'RemoteLib';

import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

import App from './modules/App';
import zhCN from 'antd/es/locale/zh_CN';

import '@assets/common.less';

const APP_ID = 'host-app';

const RemoteLibWapper = loadable(() =>
	import('RemoteLib').then((l) => {
		return {
			default: l.RemoteLibWapper
		};
	})
);

const router = createBrowserRouter(createRoutesFromElements(<Route path="/*" element={<App />} />));


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
		<RemoteLibWapper window={window} fallback={<Loading />} appId={APP_ID}>
			<AntdConfigWapper>
				<CommonHooksWrapper>
					<RouterProvider router={router} />
				</CommonHooksWrapper>
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
