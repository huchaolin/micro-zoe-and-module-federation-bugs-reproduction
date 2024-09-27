import { RemoteLibWapper, useRemoteLibData } from './RemoteLibWapper';
import MenuNav from './components/MenuNav';
import { initWaterMark, clearWaterMark } from './components/WaterMark/utils';
import routesManager from './routerUtils/routesManager';
import { createBrowserRouter, useActiveRoute } from './routerUtils';

export {
	useRemoteLibData,
	RemoteLibWapper,
	MenuNav,
	createBrowserRouter,
	routesManager,
	useActiveRoute,
	initWaterMark,
	clearWaterMark
};
