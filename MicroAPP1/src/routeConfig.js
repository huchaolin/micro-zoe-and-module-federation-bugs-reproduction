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

const  SubApp1 = loadable(
	() =>
		import(
			/* webpackChunkName: 'SubApp1' */
			/* webpackPrefetch: true */
			'@modules/SubApp1'
		)
);

const SubApp1Module1 = loadable(
	() =>
		import(
			/* webpackChunkName: 'SubApp1Module1' */
			/* webpackPrefetch: true */
			'@modules/SubApp1/Module1'
		)
);

const SubApp1Module2 = loadable(
	() =>
		import(
			/* webpackChunkName: 'SubApp1Module2' */
			/* webpackPrefetch: true */
			'@modules/SubApp1/Module2'
		)
);


const  SubApp2 = loadable(
	() =>
		import(
			/* webpackChunkName: 'SubApp2' */
			/* webpackPrefetch: true */
			'@modules/SubApp2'
		)
);

const SubApp2Module1 = loadable(
	() =>
		import(
			/* webpackChunkName: 'SubApp2Module1' */
			/* webpackPrefetch: true */
			'@modules/SubApp2/Module1'
		)
);

const SubApp2Module2 = loadable(
	() =>
		import(
			/* webpackChunkName: 'SubApp2Module2' */
			/* webpackPrefetch: true */
			'@modules/SubApp2/Module2'
		)
);



export default [
	{
		key: 'app',
		path: '/',
		element: <App />,
		children: [
			{
				key: 'app.subApp1',
				path: 'subApp1',
				title: 'subApp1',
				element: <SubApp1 />,
				children: [{
					key: 'app.subApp1.module1',
					path: 'module1',
					title: 'module1-subApp1',
					element: <SubApp1Module1 />,
				},
				{
					key: 'app.subApp1.module2',
					path: 'module2',
					title: 'module2-subApp1',
					element: <SubApp1Module2 />,
				}
			]
		},
		{
			key: 'app.subApp2',
			path: 'subApp2',
			title: 'subApp2',
			element: <SubApp2 />,
			children: [{
				key: 'app.subApp2.module1',
				path: 'module1',
				title: 'module1-subApp2',
				element: <SubApp2Module1 />,
			},
			{
				key: 'app.subApp2.module2',
				path: 'module2',
				title: 'module2-subApp2',
				element: <SubApp2Module2 />,
			}
		]
	}
	]
}];
