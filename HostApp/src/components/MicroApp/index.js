/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import React from 'react';
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event';

import { useCommonHooks } from '@common/hooks';
import { useRemoteLibData } from 'RemoteLib';

import { useEffect } from 'react';
import Loading from '@components/Loading';

// 此处为了将jsxCustomEvent引入,不然不会打包进来, polyfill用于主子应用通过data发送数据
jsxCustomEvent('event');

function MicroApp({ app }) {
	const {
		setCurrentApp,
		setLoading,
		loading
	} = useCommonHooks();
	const remoteLibData = useRemoteLibData();

	useEffect(() => {
		setLoading && setLoading(true);
		setCurrentApp && setCurrentApp(app);
	}, [app, setCurrentApp, setLoading]);

	const microEventHandler = (e) => {
		console.log('message from micro app:', e);
	};

	const isIframe = app.iframe;

	if (!app.id) {
		return null;
	}

	const microAppParams = {
		iframe: isIframe,
		name: app.id,
		url: app.url,
		baseroute: app.baseroute,
		data: { remoteLibData },
		onDataChange: microEventHandler,

		onCreated: () => {
			console.log('micro-app created:', app.id);
		},
		onBeforemount: () => {
			console.log('micro-app rendering:', app.id);
		},
		onMounted: () => {
			setLoading(false);
			console.log('micro-app mounted:', app.id);
		},
		onUnmount: () => {
			console.log('micro-app unmounted:', app.id);
		},
		onError: () => {
			console.log('micro-app error:', app.id);
		},
		style: { height: '100%', position: 'relative', overflow: 'auto' }
	};

	return (
		<>
			<micro-app {...microAppParams} />
			{loading && <Loading />}
		</>
	);
}

export default MicroApp;
