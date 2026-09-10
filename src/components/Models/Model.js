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
		const hfTags = data.hf_tags || data.hfTags || {};
		const architectures = firstValue(data.architecture_category, data.architecture, data.architectures, hfTags.architecture);

		this.id = asText(firstValue(data.id, data.modelId, data.model_id, data.name));
		this.name = asText(firstValue(data.display_name, data.name, data.model_name, data.modelId, data.id)) || "Unnamed model";
		this.searchName = [this.name, data.id, data.huggingface_repo, data.model_name].filter(Boolean).join(" ");
		this.family = asText(
			firstValue(data.family, data.model_family, data.modelFamily, data.organization, tags[0])
		) || "Unknown family";
		this.useCase = asText(firstValue(data.use_case, data.useCase, data.task)) || "General purpose";
		this.repoUrl = asText(firstValue(data.repo_url, data.repoUrl, data.url));
		this.pipelineTag = asText(
			firstValue(data.pipeline_tag, data.pipelineTag, data.pipeline, data.task, hfTags.pipeline_tag, data.use_case, tags.find((tag) => tag.includes("-")))
		) || "Unknown pipeline";
		this.architecture = asText(firstValue(architectures, config.architectures, data.architecture_tag)) || "Unknown architecture";
		this.weightTag = asText(
			firstValue(data.weight_format, data.weight_tag, data.weightTag, data.weight, data.library_name, data.dtype)
		) || "Not specified";
		this.safetensorLabel = asText(firstValue(data.safetensor_file_count, data.safetensorCount, data.safetensors, data.safetensor_count, data.safetensors_count, data.safetensorsFiles)) || "TBD";
		this.safetensorCount = asNumber(
			firstValue(
				data.safetensor_file_count,
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
		return this.searchName.toLowerCase().includes(String(query || "").trim().toLowerCase());
	}

	matchesFamily(query) {
		return this.family.toLowerCase().includes(String(query || "").trim().toLowerCase());
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			family: this.family,
			useCase: this.useCase,
			repoUrl: this.repoUrl,
			pipelineTag: this.pipelineTag,
			architecture: this.architecture,
			weightTag: this.weightTag,
			safetensorLabel: this.safetensorLabel,
			safetensorCount: this.safetensorCount,
			downloads: this.downloads,
			likes: this.likes,
			updatedAt: this.updatedAt,
			raw: this.raw,
		};
	}
}

export default Model;
