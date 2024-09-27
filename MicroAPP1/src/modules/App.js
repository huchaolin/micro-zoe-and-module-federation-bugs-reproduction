import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { routesManager } from 'RemoteLib';

export default (props) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (routesManager.activeRoute.key == 'app') {
			navigate(routesManager.makeAbsoluteUrlByKey({ key: 'app.subApp1' }));
		}
	}, [navigate]);

	useEffect(() => {
		const navTo = (data) => {
			// 当基座下发跳转指令时进行跳转
			if (data.path) {
				navigate(data.path);
			}
		};

		window?.microApp?.addDataListener(navTo);

		return () => {
			window?.microApp?.removeDataListener(navTo);
		};
	}, [navigate]);

	return <Outlet />;
};
