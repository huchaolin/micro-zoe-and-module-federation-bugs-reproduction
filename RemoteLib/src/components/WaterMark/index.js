import { useEffect } from 'react';
import { useRemoteLibData } from '@/RemoteLibWapper';
import { initWaterMark, clearWaterMark } from './utils';
import dayjs from 'dayjs';

export default function WaterMark() {
	const { userInfo } = useRemoteLibData();

	useEffect(() => {
		if (!userInfo) {
			return;
		}

		initWaterMark({
			content: `${userInfo.loginId || ''} ${dayjs().format('YYYY-MM-DD')}`
		});

		return () => {
			clearWaterMark();
		};
	}, [userInfo]);

	return null;
}
