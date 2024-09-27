import React, { useEffect } from 'react';
import { createBrowserRouter as OriginalCreateBrowserRouter, useLocation } from 'react-router-dom';
import RoutesManagerInstance from './routesManager';

const AuthErrorPage = () => <h1>Access Denied: You do not have permission to view this page.</h1>;

const RouteMonitorWrapper = ({ children }) => {
	const location = useLocation();
	RoutesManagerInstance.updateActiveRoute(location.pathname);
	return children;
};

const withRouteMonitorWrapper = (Comp) => {
	return (props) => (
		<RouteMonitorWrapper>
			<Comp {...props} />
		</RouteMonitorWrapper>
	);
};

// 模拟一个权限检查函数
const checkAuth = () => {
	// const isAuthenticated = false; // 假设用户未认证
	// if (!isAuthenticated) {
	//   throw new Error("Unauthorized");
	// }
};

export const useActiveRoute = () => {
	const location = useLocation();
	if (!RoutesManagerInstance.activeRoute) {
		RoutesManagerInstance.updateActiveRoute(location.pathname);
	}
	return RoutesManagerInstance.activeRoute;
};

export const createBrowserRouter = (routeconfig, ...rest) => {
	RoutesManagerInstance.init(routeconfig, ...rest);
	initRouteConfigWidthAuthCheck(routeconfig, ...rest);
	return OriginalCreateBrowserRouter(routeconfig, ...rest);
};

function initRouteConfigWidthAuthCheck(routes) {
	// 遍历所有根节点
	routes?.forEach((rootNode) => traverse(rootNode));

	return routes;
}

function traverse(node, deep = 1) {
	const { permissionKey, loader, errorElement, children = [] } = node;
	node.errorElement = errorElement || (permissionKey ? <AuthErrorPage /> : undefined);

	if (deep == 1) {
		// 第一层路由添加路由变动监控
		if (node.element) {
			node.element = <RouteMonitorWrapper>{node.element}</RouteMonitorWrapper>;
		} else if (node.Component) {
			node.Component = withRouteMonitorWrapper(node.Component);
		}
	}
	node.loader = (params) => {
		// 获取当前请求的 URL
		// const currentUrl = new URL(params.request.url);
		// console.log('Current Route:', currentUrl);

		if (permissionKey) {
			checkAuth(permissionKey); // 在访问这个路径前检查权限
		}
		if (loader) {
			return loader(params);
		}
		return null;
	};

	children?.forEach((child) => {
		traverse(child, deep + 1);
	});
}

const routesManager = RoutesManagerInstance;

export { routesManager };
