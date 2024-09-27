import React from 'react';
import { routesManager } from 'RemoteLib';
import loadable from '@loadable/component';

import { NavLink } from 'react-router-dom';

const MenuNav = loadable(() => {
	return import('RemoteLib').then((l) => {
		return {
			default: l.MenuNav
		};
	});
});

const MenuNavItem = loadable(() => {
	return import('RemoteLib').then((l) => {
		return {
			default: l.MenuNav.Item
		};
	});
});


export default function ({ routeKey = 'app' }) {
	const rootRoute = routesManager.getRouteByKey(routeKey);
	const menuRoutes = rootRoute?.children;
	return (
			<MenuNav>
				{menuRoutes &&
					menuRoutes.map((route) => (
						<MenuNavItem key={route.key}>
							<NavLink key={route.key} to={routesManager.makeAbsoluteUrlByKey({ key: route.key })}>
								{route.title}
							</NavLink>
						</MenuNavItem>
					))}
			</MenuNav>
	);
}
