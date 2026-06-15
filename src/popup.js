document.addEventListener('DOMContentLoaded', function () {
	// i18n
	document.querySelectorAll('[data-i18n]').forEach(function (el) {
		var msg = chrome.i18n.getMessage(el.getAttribute('data-i18n'));
		if (msg) el.textContent = msg;
	});

	// Load rule counts
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

	// Open options page
	document.getElementById('open-options').addEventListener('click', function () {
		chrome.runtime.openOptionsPage();
	});
});
