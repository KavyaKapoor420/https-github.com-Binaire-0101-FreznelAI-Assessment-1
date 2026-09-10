import Model from "../components/Models/Model.js";

const API_URL = import.meta.env.VITE_API_URL || "https://binaire.app/hf-models-api.json";

function getModelRecords(payload) {
	if (Array.isArray(payload)) {
		return payload;
	}

	if (!payload || typeof payload !== "object") {
		return null;
	}

	const records = payload.models || payload.data || payload.items || payload.results;
	return Array.isArray(records) ? records : null;
}

export class ModelAPI {
	constructor(url = API_URL) {
		this.url = url;
	}

	fetchModels() {
		return fetch(this.url, {
			headers: {
				Accept: "application/json",
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Model service responded with status ${response.status}`);
				}

				const contentType = response.headers.get("content-type") || "";
				if (contentType && !contentType.includes("json")) {
					throw new Error("Model service returned an unsupported response format");
				}

				return response.json();
			})
			.then((payload) => {
				const records = getModelRecords(payload);

				if (!records) {
					throw new Error("Model service returned an invalid data structure");
				}

				return records.map((record) => new Model(record));
			})
			.catch((error) => {
				const message = error instanceof TypeError
					? "The model service could not be reached"
					: error.message;

				throw new Error(message || "Unable to load models");
			});
	}
}

export { API_URL };
export default ModelAPI;
