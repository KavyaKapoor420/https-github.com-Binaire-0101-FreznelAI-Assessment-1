export class ModelSearch {
	normalizeQuery(query) {
		return String(query || "").trim().toLowerCase();
	}

	search(models = [], { name = "", family = "" } = {}) {
		const nameQuery = this.normalizeQuery(name);
		const familyQuery = this.normalizeQuery(family);

		if (!nameQuery && !familyQuery) {
			return [...models];
		}

		return models.filter((model) => {
			const matchesName = !nameQuery || model.matchesName(nameQuery);
			const matchesFamily = !familyQuery || model.matchesFamily(familyQuery);
			return matchesName && matchesFamily;
		});
	}
}

export default ModelSearch;
