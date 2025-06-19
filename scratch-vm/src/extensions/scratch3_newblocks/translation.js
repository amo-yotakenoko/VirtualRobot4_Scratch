const formatMessage = require('format-message');

const messages = {
	'categoryName': {
		ja: '新しいブロック',
		en: 'New Blocks'
	},

	// ───────── Block labels ─────────
	'connect': {
		ja: 'webSocketで接続[URL]',
		en: 'Connect via WebSocket [URL]'
	},
	'connectHttp': {
		ja: 'HTTPで接続[URL]',
		en: 'Connect via HTTP [URL]'
	},
	'readyState': {
		ja: 'webSocketの接続状態',
		en: 'WebSocket connection state'
	},
	'motor': {
		ja: 'モーター[KEY]のパワーを[VALUE]にする',
		en: 'Set motor [KEY] power to [VALUE]'
	},
	'servo': {
		ja: 'サーボモーター[KEY]を[VALUE]°にする',
		en: 'Set servo [KEY] to [VALUE]°'
	},
	'intensity': {
		ja: 'ライト[KEY]の明るさを[VALUE]にする',
		en: 'Set light [KEY] brightness to [VALUE]'
	},
	'keyGet': {
		ja: '[KEY]キーが押された',
		en: 'Key [KEY] pressed?'
	},
	'distance': {
		ja: '距離センサ[KEY]',
		en: 'Distance sensor [KEY]'
	},
	'set': {
		ja: 'Key:[KEY]=[VALUE]',
		en: 'Set key [KEY] to [VALUE]'
	},
	'get': {
		ja: 'Key:[KEY]',
		en: 'Key [KEY]'
	},
	'teleport': {
		ja: 'テレポート([X],[Y],[Z])',
		en: 'Teleport to ([X],[Y],[Z])'
	},
	'vrFloat': {
		ja: 'VRコントローラー[DEVICE]の[KEY]',
		en: 'VR controller [DEVICE] [KEY] (float)'
	},
	'vrBool': {
		ja: 'VRコントローラー[DEVICE]の[KEY]',
		en: 'VR controller [DEVICE] [KEY] (boolean)'
	},
	'activeViewproperty': {
		ja: '情報の表示を[ISACTIVE]にする',
		en: 'Set info display to [ISACTIVE]'
	},

	// ───────── Menus ─────────
	'newblocks.menu.device.right': {
		ja: '右',
		en: 'Right'
	},
	'newblocks.menu.device.left': {
		ja: '左',
		en: 'Left'
	},
	'newblocks.menu.active.show': {
		ja: '表示',
		en: 'Show'
	},
	'newblocks.menu.active.hide': {
		ja: '非表示',
		en: 'Hide'
	},
	'newblocks.menu.float.trigger': {
		ja: 'Trigger',
		en: 'Trigger'
	},
	'newblocks.menu.float.grip': {
		ja: 'Grip',
		en: 'Grip'
	},

	// keyMenuBool
	'gripButton': {
		ja: 'GripButton',
		en: 'GripButton'
	},
	'menuButton': {
		ja: 'MenuButton',
		en: 'MenuButton'
	},
	'primaryButton': {
		ja: 'PrimaryButton',
		en: 'PrimaryButton'
	},
	'primaryTouch': {
		ja: 'PrimaryTouch',
		en: 'PrimaryTouch'
	},
	'secondaryButton': {
		ja: 'SecondaryButton',
		en: 'SecondaryButton'
	},
	'secondaryTouch': {
		ja: 'SecondaryTouch',
		en: 'SecondaryTouch'
	},
	'triggerButton': {
		ja: 'TriggerButton',
		en: 'TriggerButton'
	},
	'triggerTouch': {
		ja: 'TriggerTouch',
		en: 'TriggerTouch'
	},
	'primary2DAxisClick': {
		ja: 'Primary2DAxisClick',
		en: 'Primary2DAxisClick'
	},
	'primary2DAxisTouch': {
		ja: 'Primary2DAxisTouch',
		en: 'Primary2DAxisTouch'
	},
	'thumbrestTouch': {
		ja: 'ThumbrestTouch',
		en: 'ThumbrestTouch'
	},
	'deviceIsTracked': {
		ja: 'DeviceIsTracked',
		en: 'DeviceIsTracked'
	},
	'pointerIsTracked': {
		ja: 'PointerIsTracked',
		en: 'PointerIsTracked'
	},
	'isTracked': {
		ja: 'IsTracked',
		en: 'IsTracked'
	}
};

function translation(id) {
	const locale = formatMessage.setup().locale
	const item = messages[id];
	if (!item) return id;
	return item[locale] ?? item['en'] ?? id;
}

module.exports = translation;