import { matchPath, generatePath } from 'react-router-dom';

class RoutesManager {
	constructor() {
		this.inited = false;
		this.keyDict = {};
		this.pathDict = {};
		this.flattenedRoutes = [];
		this.activeRoute = null; // 当前匹配的路由
		this.activeParams = {};
		this.basename = '/';
	}

	initDict(routes) {
		const list = Array.isArray(routes) ? routes : [routes];
		const keyDict = {}; // 用于存储key为键的字典
		const pathDict = {}; // 用于存储路径为键的字典
		const flattenedRoutes = [];

		function traverse(node, parent = null, absolutePath = '') {
			const pureNode = getPureRouteNode(node);
			const { path: _path, key } = pureNode;
			const currentPath = `${removeTailingSlash(absolutePath || '')}/${removeSlash(_path)}`;

			pureNode._path = _path;

			pureNode.path = currentPath;
			pureNode.absolutePath = currentPath;

			pureNode.parentRoute = parent;

			if (key) {
				keyDict[key] = pureNode;
			}

			pathDict[currentPath] = pureNode;

			// 递归遍历子节点
			pureNode.children = pureNode.children?.map((child) => {
				return traverse(child, pureNode, currentPath);
			});

			flattenedRoutes.push(pureNode);
			return pureNode;
		}

		// 遍历所有根节点
		list.forEach((rootNode) => traverse(rootNode));

		this.keyDict = keyDict;
		this.pathDict = pathDict;
		this.flattenedRoutes = flattenedRoutes;
	}

	init(routes, options) {
		if (this.inited) {
			return;
		}
		this.basename = options?.basename ? removeTailingSlash(options?.basename) : this.basename;

		routes = routes || [];
		this.initDict(routes);
		console.log(' routesManager inited ', this);

		this.inited = true;
	}

	updateActiveRoute(path) {
		const activeRoute = this.matchRouteByMixPath(path);

		if (activeRoute) {
			this.activeParams = activeRoute.match.params;
			this.activeRoute = activeRoute;

			console.log('activeRoute', this.activeRoute);

			// 更新标签页title
				document.title = `${activeRoute.title || document.title}`;
		}
	}

	getActiveParams(key) {
		return this.activeRoute?.match?.params?.[key];
	}

	getRouteByPath(path) {
		return this.matchRouteByMixPath(path);
	}

	getPathWithoutBasename(path = '') {
		if (path.startsWith(this.basename)) {
			return path.slice(removeTailingSlash(this.basename).length);
		}
		return path;
	}

	// 获取path 配置， 及match信息
	matchRouteByMixPath(path = '') {
		const pathWithoutBasename = this.getPathWithoutBasename(path);
		let match;
		let matchedPureRouteNode;

		matchedPureRouteNode = this.pathDict[pathWithoutBasename] || this.pathDict[removeTailingSlash(pathWithoutBasename)];

		if (matchedPureRouteNode) {
			match = matchPath(
				{
					path: matchedPureRouteNode.absolutePath,
					caseSensitive: false,
					end: true
				},
				pathWithoutBasename
			);
		}

		if (!match || !matchedPureRouteNode) {
			matchedPureRouteNode = this.flattenedRoutes.find((v) => {
				const macthResult = matchPath(
					{
						path: v.absolutePath,
						caseSensitive: false,
						end: true
					},
					pathWithoutBasename
				);
				if (macthResult) {
					match = macthResult;
					return true;
				}
				return false;
			});
		}

		if (matchedPureRouteNode && match) {
			return {
				...matchedPureRouteNode,
				match
			};
		}
	}

	getRouteByKey(key) {
		return this.keyDict[key];
	}

	makeAbsoluteUrlByKey({ key, params }) {
		const route = this.keyDict[key];

		if (route) {
			const defaultParamsList = route.absolutePath.match(/:\w+/g);
			const defaultParams = defaultParamsList?.reduce((prev, cur) => {
				prev[cur.replace(':', '')] = cur;
				return prev;
			}, {});
			return generatePath(route.absolutePath, {
				...(defaultParams || {}),
				...(this.activeRoute?.match?.params || {}),
				...(params || {})
			});
		}
	}
}

function removeTailingSlash(str) {
	if (!str) {
		return str;
	}
	const index = str.lastIndexOf('/');
	const endIndex = str.length - 1;
	if (index == str.length - 1) {
		str = str.slice(0, endIndex);
		return removeTailingSlash(str);
	}
	return str;
}

function removeFrontSlash(str) {
	if (!str) {
		return str;
	}
	const index = str.indexOf('/');
	if (index === 0) {
		str = str.slice(1);
		return removeFrontSlash(str);
	}
	return str;
}

function removeSlash(str) {
	return removeTailingSlash(removeFrontSlash(str));
}

function getPureRouteNode(routeObject) {
	// interface RouteObject {
	//   path?: string;
	//   index?: boolean;
	//   children?: RouteObject[];
	//   caseSensitive?: boolean;
	//   id?: string;
	//   loader?: LoaderFunction;
	//   action?: ActionFunction;
	//   element?: React.ReactNode | null;
	//   hydrateFallbackElement?: React.ReactNode | null;
	//   errorElement?: React.ReactNode | null;
	//   Component?: React.ComponentType | null;
	//   HydrateFallback?: React.ComponentType | null;
	//   ErrorBoundary?: React.ComponentType | null;
	//   handle?: RouteObject["handle"];
	//   shouldRevalidate?: ShouldRevalidateFunction;
	//   lazy?: LazyRouteFunction<RouteObject>;
	// }
	const { loader, action, element, hydrateFallbackElement, errorElement, Component, ErrorBoundary, handle, shouldRevalidate, lazy, ...props } = routeObject;
	return props;
}
const RoutesManagerInstance = new RoutesManager();

export default RoutesManagerInstance;
