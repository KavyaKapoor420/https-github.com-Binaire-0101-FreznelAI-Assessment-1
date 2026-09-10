export function throttle(callback, interval = 60000) {
	let lastRun = 0;
	let timeoutId = null;
	let latestArguments = [];

	function throttled(...argumentsList) {
		const now = Date.now();
		const remaining = interval - (now - lastRun);
		latestArguments = argumentsList;

		if (remaining <= 0) {
			if (timeoutId !== null) {
				window.clearTimeout(timeoutId);
				timeoutId = null;
			}

			lastRun = now;
			callback(...latestArguments);
			latestArguments = [];
			return;
		}

		if (timeoutId === null) {
			timeoutId = window.setTimeout(() => {
				lastRun = Date.now();
				callback(...latestArguments);
				timeoutId = null;
				latestArguments = [];
			}, remaining);
		}
	}

	throttled.cancel = () => {
		if (timeoutId !== null) {
			window.clearTimeout(timeoutId);
		}

		timeoutId = null;
		latestArguments = [];
	};

	return throttled;
}

export default throttle;
