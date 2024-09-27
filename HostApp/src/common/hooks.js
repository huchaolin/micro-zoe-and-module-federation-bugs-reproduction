import React, { useState, useContext, useMemo } from 'react';

export const CommonHooksContext = React.createContext({});

export const useCommonHooks = () => {
	const { currentApp, setCurrentApp, loading, setLoading } = useContext(CommonHooksContext);
	return {
		currentApp,
		setCurrentApp,
		loading,
		setLoading
	};
};

export const CommonHooksWrapper = ({ children }) => {
	const [currentApp, setCurrentApp] = useState();
	const [loading, setLoading] = useState(false);

	const value = useMemo(() => {
		return {
			currentApp,
			setCurrentApp,
			loading,
			setLoading
		};
	}, [currentApp, setCurrentApp, loading, setLoading]);

	return <CommonHooksContext.Provider value={value}>{children}</CommonHooksContext.Provider>;
};
