export class ModelSorter {
	sort(models = [], direction = "name-asc") {
		const sortedModels = [...models];

		return sortedModels.sort((firstModel, secondModel) => {
			if (direction === "name-desc") {
				return this.compareText(secondModel.name, firstModel.name);
			}

			if (direction === "safetensor-asc") {
				return firstModel.safetensorCount - secondModel.safetensorCount;
			}

			if (direction === "safetensor-desc") {
				return secondModel.safetensorCount - firstModel.safetensorCount;
			}

			return this.compareText(firstModel.name, secondModel.name);
		});
	}

	compareText(firstValue, secondValue) {
		return String(firstValue || "").localeCompare(String(secondValue || ""), undefined, {
			sensitivity: "base",
			numeric: true,
		});
	}
}

export default ModelSorter;
