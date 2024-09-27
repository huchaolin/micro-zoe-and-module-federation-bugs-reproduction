import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './index.less';

type LoadingProps = {
	fontSize?: number;
	center?: boolean;
	top?: number;
	height?: number | string | null;
	position?: 'absolute' | 'relative';
	showCover?: boolean;
};

export default (props: LoadingProps) => {
	const { fontSize = 24, center = true, top = 0, height = 80, position = 'absolute', showCover = true } = props;
	const antIcon = <LoadingOutlined style={{ fontSize }} spin />;
	const alignClassName = center ? 'custom-loading-center' : 'custom-loading-top';
	const style: React.CSSProperties = {
		paddingTop: top
	};

	if (position != 'absolute' && height) {
		style.height = height;
	}

	const loading = (
		<div className={`${alignClassName} ${position || ''}`} style={style}>
			{showCover && <div className="cover"></div>}
			<Spin indicator={antIcon} />
		</div>
	);

	return loading;
};
