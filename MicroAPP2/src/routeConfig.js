import React from 'react';
import loadable from '@loadable/component';

// 注意： webpackChunkName 若需要使用请保证命名全局唯一，建议取名按文件路径，以保证全局唯一

const App = loadable(
	() =>
		import(
			/* webpackChunkName: 'App' */
			/* webpackPrefetch: true */
			'@modules/App'
		)
);


const Module1 = loadable(
	() =>
		import(
			/* webpackChunkName: 'Module1' */
			/* webpackPrefetch: true */
			'@modules/Module1'
		)
);

const Module2 = loadable(
	() =>
		import(
			/* webpackChunkName: 'Module2' */
			/* webpackPrefetch: true */
			'@modules/Module2'
		)
);


export default [
	{
		key: 'app',
		path: '/',
		element: <App />,
		children: [
			{
				key: 'app.module1',
				path: 'module1',
				title: 'module1',
				element: <Module1 />,
		},
		{
			key: 'app.module2',
			path: 'module2',
			title: 'module2',
			element: <Module2 />,
	}
	]
}];
