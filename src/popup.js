document.addEventListener('DOMContentLoaded', function () {
	// i18n
	document.querySelectorAll('[data-i18n]').forEach(function (el) {
		var msg = chrome.i18n.getMessage(el.getAttribute('data-i18n'));
		if (msg) el.textContent = msg;
	});
	document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
		var msg = chrome.i18n.getMessage(el.getAttribute('data-i18n-placeholder'));
		if (msg) el.placeholder = msg;
	});

	loadCounts();

	// Add rule
	document.getElementById('btn-add').addEventListener('click', function () {
		var type = document.getElementById('rule-type').value;
		var match = document.getElementById('rule-match').value.trim();
		var folder = document.getElementById('rule-folder').value.trim();

		if (!match || !folder) {
			showMsg(chrome.i18n.getMessage('popupMsgEmpty') || 'Please fill in both fields.', 'error');
			return;
		}

		// Ensure trailing slash
		if (folder.slice(-1) !== '/' && folder.slice(-1) !== '\\') {
			folder += '/';
		}

		var storageKey = {
			mime: 'dr_mime_map',
			filename: 'dr_filename_map',
			referrer: 'dr_referrer_map'
		}[type];

		chrome.storage.local.get(storageKey, function (result) {
			var map = result[storageKey] || {};
			map[match] = folder;
			var update = {};
			update[storageKey] = map;
			chrome.storage.local.set(update, function () {
				document.getElementById('rule-match').value = '';
				document.getElementById('rule-folder').value = '';
				showMsg(chrome.i18n.getMessage('popupMsgAdded') || 'Rule added!', 'success');
				loadCounts();
			});
		});
	});

	// Open options page
	document.getElementById('open-options').addEventListener('click', function () {
		chrome.runtime.openOptionsPage();
	});
});

function loadCounts() {
	chrome.storage.local.get(
		['dr_filename_map', 'dr_mime_map', 'dr_referrer_map'],
		function (result) {
			document.getElementById('filename-count').textContent =
				Object.keys(result.dr_filename_map || {}).length;
			document.getElementById('mime-count').textContent =
				Object.keys(result.dr_mime_map || {}).length;
			document.getElementById('referrer-count').textContent =
				Object.keys(result.dr_referrer_map || {}).length;
		}
	);
}

function showMsg(text, type) {
	var el = document.getElementById('msg');
	el.textContent = text;
	el.className = 'msg ' + type;
	setTimeout(function () {
		el.className = 'msg';
	}, 2000);
}
