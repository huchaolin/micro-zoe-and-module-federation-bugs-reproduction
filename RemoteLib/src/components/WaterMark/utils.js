const MASK_CONTAINER_ID = 'WATER_MASK_CONTAINER_YYDS';

const rowTagNum = Math.ceil((window.top.innerWidth / 1280) * 10);
const rowNum = Math.ceil((window.top.innerHeight / 720) * 8);

const ROW_TAG_NUM = rowTagNum < 10 ? 10 : rowTagNum; // 一行中 标签个数
const ROW_NUM = rowNum < 8 ? 8 : rowNum; // 有几行

const markModalDomStyle = {
	position: 'fixed',
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	'background-color': 'transparent',
	'pointer-events': 'none',
	'z-index': 9999,
	overflow: 'hidden'
};

const markContentDomStyle = {
	position: 'relative',
	display: 'inline-block',
	padding: '80px 0',
	height: '120px',
	width: '240px',
	'text-align': 'center',
	'pointer-events': 'none'
};

const markContentTxtDomStyle = {
	position: 'absolute',
	display: 'inline-block',
	'pointer-events': 'none',
	top: '50%',
	left: '50%'
};

const rowContentDomStyle = {
	overview: 'hidden',
	'white-space': 'nowrap',
	'pointer-events': 'none'
};

const initStyle = (dom, style) => {
	Object.keys(style).forEach((key) => {
		dom.style[key] = style[key];
	});
};

export function clearWaterMark() {
	const document = window.top.document;

	const existMarkModalDom = document.getElementById(MASK_CONTAINER_ID);
	if (existMarkModalDom) {
		document.body.removeChild(existMarkModalDom);
	}
}

export function initWaterMark(config) {
	config = config || {};
	config = {
		content: config.content || 'YYDS',
		fontSize: config.fontSize || '16px',
		opacity: config.opacity || 0.5,
		rotate: config.rotate || '-30',
		color: config.color || 'rgba(133,141,149,0.24)'
	};

	// 获取最顶层的 document
	const document = window.top.document;

	const existMarkModalDom = document.getElementById(MASK_CONTAINER_ID);
	if (existMarkModalDom) {
		document.body.removeChild(existMarkModalDom);
	}

	const markModalDom = document.createElement('div');

	markModalDom.setAttribute('id', MASK_CONTAINER_ID);
	initStyle(markModalDom, markModalDomStyle);

	const markContentDom = document.createElement('span');
	initStyle(markContentDom, { ...markContentDomStyle, opacity: config.opacity });

	const markContentTxtDom = document.createElement('span');
	initStyle(markContentTxtDom, {
		...markContentTxtDomStyle,
		transform: `translate(-50%, -50%) rotate(${config.rotate}deg)`,
		'font-size': config.fontSize,
		color: config.color
	});

	markContentTxtDom.innerHTML = config.content;

	markContentDom.appendChild(markContentTxtDom);

	const contentHtml = markContentDom.outerHTML;

	// 待优化，考虑更宽更高的视窗
	let rowContentHtml = '';
	// 初始哈一行的标签数

	for (let i = 0; i < ROW_TAG_NUM; i++) {
		rowContentHtml += contentHtml;
	}

	const rowContentDom = document.createElement('div');
	rowContentDom.innerHTML = rowContentHtml;
	initStyle(rowContentDom, rowContentDomStyle);

	// 初始化4行
	let allContentHtml = '';
	for (let j = 0; j < ROW_NUM; j++) {
		// 错位
		rowContentDom.style['padding-left'] = j % 2 ? '120px' : '0px';

		allContentHtml += rowContentDom.outerHTML;
	}

	markModalDom.innerHTML = allContentHtml;

	document.body.appendChild(markModalDom);
}
