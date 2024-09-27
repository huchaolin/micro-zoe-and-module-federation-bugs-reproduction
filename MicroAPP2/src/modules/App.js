import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routesManager } from 'RemoteLib';
import AppContainer from '@components/AppContainer';

export default () => {
	const navigate = useNavigate();

	useEffect(() => {
		if (routesManager.activeRoute.key == 'app') {
			navigate(routesManager.makeAbsoluteUrlByKey({ key: 'app.module1' }));
		}
	}, [navigate]);

	return <AppContainer />;
};
