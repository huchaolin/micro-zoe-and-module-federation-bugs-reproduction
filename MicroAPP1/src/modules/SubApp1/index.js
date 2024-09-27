import React from 'react';
import AppContainer from '@components/AppContainer';

console.log('===========微应用 window.document.body ==========', window.document.body)
console.log('window.__MICRO_APP_ENVIRONMENT__', appRealWindow.__MICRO_APP_ENVIRONMENT__);
console.log('window.__MICRO_APP_NAME__', appRealWindow.__MICRO_APP_NAME__);

export default (props) => {
	return <AppContainer {...props}  routeKey={'app.subApp1'} />;
};
