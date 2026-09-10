function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function matchesValue(modelValue, selectedValue) {
  if (!selectedValue) {
    return true;
  }

  return normalize(modelValue) === normalize(selectedValue);
}

export class ModelFilter {
  filter(models = [], options = {}) {
    const {
      pipelineTag = "",
      familyTag = "",
      architectureTag = "",
      weightTag = "",
      minSafetensors = "",
      maxSafetensors = "",
    } = options;
    const minimum = minSafetensors === "" ? null : Number(minSafetensors);
    const maximum = maxSafetensors === "" ? null : Number(maxSafetensors);

    return models.filter((model) => {
      const count = Number(model.safetensorCount) || 0;
      const meetsMinimum = minimum === null || count >= minimum;
      const meetsMaximum = maximum === null || count <= maximum;

      return (
        matchesValue(model.pipelineTag, pipelineTag) &&
        matchesValue(model.family, familyTag) &&
        matchesValue(model.architecture, architectureTag) &&
        matchesValue(model.weightTag, weightTag) &&
        meetsMinimum &&
        meetsMaximum
      );
    });
  }

  getOptions(models = []) {
    return {
      pipelineTags: this.uniqueValues(models, "pipelineTag"),
      familyTags: this.uniqueValues(models, "family"),
      architectureTags: this.uniqueValues(models, "architecture"),
      weightTags: this.uniqueValues(models, "weightTag"),
    };
  }

  uniqueValues(models, field) {
    return [...new Set(models.map((model) => model[field]).filter(Boolean))].sort((first, second) =>
      String(first).localeCompare(String(second), undefined, { sensitivity: "base" })
    );
  }
}

export default ModelFilter;
