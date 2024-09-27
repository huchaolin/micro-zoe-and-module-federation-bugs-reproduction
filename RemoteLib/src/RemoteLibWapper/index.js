import { createContext, useContext, useEffect, useState } from 'react';
import WaterMark from '@/components/WaterMark';
import { writeCssVariablesToBody } from './utils';

import '@styles/global.less';

const RemoteLibDataContext = createContext({});

export const useRemoteLibData = () => {
	return useContext(RemoteLibDataContext);
};

export const RemoteLibWapper = ({ window: appRealWindow, children, appId }) => {
	const [globalData, setGlobalData] = useState(null);
	window.appRealWindow = appRealWindow;

	if(!appRealWindow) {
		throw Error('请传入window, <RemoteLibWapper window={window } ... />')
	}

	const inMicro = (window !== appRealWindow);

	if(inMicro) {
		console.log('====现在Remote Lib 处于微前端环境====');
		console.log('====appId===', appId);
		console.log('但此时取得的window是基座的window:', window);
		console.log('window.__MICRO_APP_ENVIRONMENT__', window.__MICRO_APP_ENVIRONMENT__);
		console.log('window.__MICRO_APP_NAME__', window.__MICRO_APP_NAME__);
		console.log('window.__MICRO_APP_BASE_ROUTE__', window.__MICRO_APP_BASE_ROUTE__);
		console.log('window.__MICRO_APP_BASE_APPLICATION__', window.__MICRO_APP_BASE_APPLICATION__);

		console.log('微应用通过属性传入的appRealWindow:', appRealWindow);
		console.log('appRealWindow.__MICRO_APP_ENVIRONMENT__', appRealWindow.__MICRO_APP_ENVIRONMENT__);
		console.log('appRealWindow.__MICRO_APP_NAME__', appRealWindow.__MICRO_APP_NAME__);
		console.log('appRealWindow.__MICRO_APP_BASE_ROUTE__', appRealWindow.__MICRO_APP_BASE_ROUTE__);
		console.log('appRealWindow.__MICRO_APP_BASE_APPLICATION__', appRealWindow.__MICRO_APP_BASE_APPLICATION__);

	}

	useEffect(() => {
		// 一些异步操作初始化数据
		new Promise((resolve) => {
			setTimeout(() => {
				const mockData = {
					useInfo: { name: 'test', loginId: 'test' },
					themeConfig: { 	
						fontSize: 12,
						borderRadius: 2,
						colorTextBase: '#333333',
						colorPrimary: '#3880ff',
						colorBorder: '#e9ecf0'
					}
				};

				setGlobalData(mockData);
				writeCssVariablesToBody(mockData.themeConfig);
				resolve();
			}, 1000);
		});

	}, []);
	
	return (
		<RemoteLibDataContext.Provider value={globalData}>
				{globalData && children}
				{globalData && !inMicro && <WaterMark />}
		</RemoteLibDataContext.Provider>
	);
};
