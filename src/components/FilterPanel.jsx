function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function FilterPanel({ filters, options, onChange, onClear }) {
  return (
    <aside className="filter-panel">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Refine</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em]">Filters</h2>
        </div>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700" type="button" onClick={onClear}>Clear all</button>
      </div>
      <div className="mt-6 space-y-4">
        <FilterSelect label="Pipeline" value={filters.pipelineTag} options={options.pipelineTags} onChange={(value) => onChange("pipelineTag", value)} />
        <FilterSelect label="Family" value={filters.familyTag} options={options.familyTags} onChange={(value) => onChange("familyTag", value)} />
        <FilterSelect label="Architecture" value={filters.architectureTag} options={options.architectureTags} onChange={(value) => onChange("architectureTag", value)} />
        <FilterSelect label="Weight" value={filters.weightTag} options={options.weightTags} onChange={(value) => onChange("weightTag", value)} />
        <div className="grid grid-cols-2 gap-3">
          <label className="filter-field"><span>Min files</span><input min="0" type="number" value={filters.minSafetensors} onChange={(event) => onChange("minSafetensors", event.target.value)} /></label>
          <label className="filter-field"><span>Max files</span><input min="0" type="number" value={filters.maxSafetensors} onChange={(event) => onChange("maxSafetensors", event.target.value)} /></label>
        </div>
      </div>
    </aside>
  );
}

export default FilterPanel;
