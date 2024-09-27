import React, { ReactElement, useRef, useState, useEffect } from 'react';
import { Dropdown } from 'antd';
import styles from './index.module.less';

type AllowedElement = ReactElement<HTMLDivElement | HTMLSpanElement | HTMLAnchorElement>;

function MenuNav(props: React.HTMLAttributes<HTMLDivElement>) {
	const { children, className, ...resProps } = props;
	return (
		<div {...resProps} className={`${styles.menuNav} ${className || ''}`}>
			{children}
		</div>
	);
}

function Item(props: React.HTMLAttributes<HTMLDivElement> & { active?: boolean; children: AllowedElement }) {
	const { children, className, active, ...resProps } = props;
	return (
		<div {...resProps} className={`${styles.menuNavItem} ${className || ''} ${active ? styles.active : ''}`}>
			{children}
		</div>
	);
}

function SubMenu(
	props: React.HTMLAttributes<HTMLDivElement> & {
		active?: boolean;
		title: AllowedElement | string;
		children: React.ReactElement<typeof Item> | React.ReactElement<typeof Item>[];
	}
) {
	const { children, className, active, ...resProps } = props;
	const contentDomRef = useRef(null);
	const dropdownRef = useRef(null);
	const [minWidth, setMinWidth] = useState(0);
	const [open, setOpen] = useState(false);
	const activeItem = React.Children.toArray(children).find((child) => React.isValidElement(child) && (child.props.active || (child.props.className || '').includes('active'))) || active;
	useEffect(() => {
		const contentDom = contentDomRef.current;
		if (!contentDom) {
			return;
		}

		let resizeObserver = new ResizeObserver(() => {
			const { offsetWidth = 0 } = contentDom || {};
			setMinWidth(offsetWidth);
		});

		resizeObserver.observe(contentDom);

		return () => {
			contentDom && resizeObserver.unobserve(contentDom);
			resizeObserver.disconnect();
			resizeObserver = null;
		};
	}, []);

	const isTitleString = typeof props.title == 'string';

	return (
		<Dropdown
			align={{ offset: [0, 0] }}
			open={open}
			onOpenChange={setOpen}
			overlayClassName={styles.dropdownWrap}
			placement="bottomLeft"
			trigger={['hover']}
			menu={{
				items: [
					{
						label: (
							<div ref={dropdownRef} className={styles.subMenuDropdownWrap} style={{ minWidth: minWidth || undefined }}>
								{children}
							</div>
						),
						key: 'menu-nav-item'
					}
				]
			}}
		>
			<div
				{...resProps}
				title={''}
				ref={contentDomRef}
				className={`${styles.subMenuTitle} ${className || ''} ${activeItem ? styles.active : ''} ${open ? styles.open : ''} ${isTitleString ? styles.isString : ''}`}
			>
				{props.title}
			</div>
		</Dropdown>
	);
}

MenuNav.Item = Item;
MenuNav.SubMenu = SubMenu;

export default MenuNav;
