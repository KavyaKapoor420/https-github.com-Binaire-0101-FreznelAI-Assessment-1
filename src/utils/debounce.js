export function debounce(callback, delay = 350) {
	let timeoutId = null;
	let latestArguments = [];

	function debounced(...argumentsList) {
		latestArguments = argumentsList;
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback(...latestArguments);
			timeoutId = null;
		}, delay);
	}

	debounced.cancel = () => {
		window.clearTimeout(timeoutId);
		timeoutId = null;
		latestArguments = [];
	};

	debounced.flush = () => {
		if (timeoutId === null) {
			return;
		}

		window.clearTimeout(timeoutId);
		callback(...latestArguments);
		timeoutId = null;
		latestArguments = [];
	};

	return debounced;
}

export default debounce;
