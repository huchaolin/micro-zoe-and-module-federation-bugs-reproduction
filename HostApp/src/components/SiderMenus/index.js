import React, { useMemo, useRef } from 'react';
import microApp from '@micro-zoe/micro-app'
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useCommonHooks } from '@common/hooks';
import { debounce } from 'lodash-es';
import styles from './index.module.less';


export default ({ appList }) => {
	const navigate = useNavigate();
	const containerRef = useRef();
	const dataRef = useRef();
	const { setCurrentApp, currentApp, loading, setLoading } = useCommonHooks();

	dataRef.current = {
		loading,
		setLoading,
		setCurrentApp,
		currentApp,
		navigate
	};
	
	const naviagteToApp = useMemo(() => {
		return debounce(
			(app) => {
				const { 	
					loading,
					setLoading,
					setCurrentApp,
					currentApp,
					navigate 
				} = dataRef.current;

				if (loading || currentApp && (app.id == currentApp?.id)) {
					return;
				}
				
				setLoading(true);
				setCurrentApp(app);
				// microApp.router.push({ name: app.id, path: app.path });// 正常速度切换会报错
				navigate(app.path); // 正常速度切换不会报错
			},
			1000,
			{
				leading: true,
				trailing: false
			}
		);
	}, []);

	return (
		<div
			ref={containerRef}
			className={classNames({
				[styles.wrap]: true,
			})}
		>
			<div className={styles.innerWrap}>
				<div className={styles.appNavList}>
					{appList?.map((app) => {
						return (
							<div
								key={app.id}
								className={classNames({
									[styles.appNav]: true,
									[styles.active]: currentApp?.id == app.id,
								})}
								onClick={() => {
									naviagteToApp(app)
								}}
							>
								<div className={styles.navTexts}>
									<div className={styles.navTitle}>{app.name}</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
