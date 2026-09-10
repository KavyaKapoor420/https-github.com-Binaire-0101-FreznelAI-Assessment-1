function firstValue(...values) {
	return values.find((value) => value !== undefined && value !== null && value !== "");
}

function asNumber(value) {
	const number = Number(value);
	return Number.isFinite(number) ? number : 0;
}

function asText(value) {
	if (Array.isArray(value)) {
		return value.filter(Boolean).join(", ");
	}

	return value === undefined || value === null ? "" : String(value);
}

export class Model {
	constructor(data = {}) {
		const config = data.config || {};
		const cardData = data.cardData || data.card_data || {};
		const tags = Array.isArray(data.tags) ? data.tags : [];

		this.id = asText(firstValue(data.id, data.modelId, data.model_id, data.name));
		this.name = asText(firstValue(data.name, data.model_name, data.modelId, data.id)) || "Unnamed model";
		this.family = asText(
			firstValue(data.family, data.model_family, data.modelFamily, data.organization, tags[0])
		) || "Unknown family";
		this.pipelineTag = asText(
			firstValue(data.pipeline_tag, data.pipelineTag, data.pipeline, data.task, tags.find((tag) => tag.includes("-")))
		) || "Unknown pipeline";
		this.architecture = asText(
			firstValue(data.architecture, data.architectures, config.architectures, data.architecture_tag)
		) || "Unknown architecture";
		this.weightTag = asText(
			firstValue(data.weight_tag, data.weightTag, data.weight, data.library_name, data.dtype)
		) || "Not specified";
		this.safetensorCount = asNumber(
			firstValue(
				data.safetensorCount,
				data.safetensors,
				data.safetensor_count,
				data.safetensors_count,
				data.safetensorsFiles
			)
		);
		this.downloads = asNumber(firstValue(data.downloads, data.download_count));
		this.likes = asNumber(firstValue(data.likes, data.like_count));
		this.updatedAt = firstValue(data.lastModified, data.last_modified, data.updatedAt, data.updated_at) || null;
		this.raw = data;
		this.cardData = cardData;
	}

	getDisplayName() {
		return this.name;
	}

	matchesName(query) {
		return this.name.toLowerCase().includes(String(query || "").trim().toLowerCase());
	}

	matchesFamily(query) {
		return this.family.toLowerCase().includes(String(query || "").trim().toLowerCase());
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			family: this.family,
			pipelineTag: this.pipelineTag,
			architecture: this.architecture,
			weightTag: this.weightTag,
			safetensorCount: this.safetensorCount,
			downloads: this.downloads,
			likes: this.likes,
			updatedAt: this.updatedAt,
			raw: this.raw,
		};
	}
}

export default Model;
