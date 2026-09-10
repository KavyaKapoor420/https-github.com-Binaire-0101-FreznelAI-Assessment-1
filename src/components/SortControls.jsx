function SortControls({ value, onChange, resultCount }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-500"><span className="font-semibold text-slate-900">{resultCount}</span> models found</p>
      <label className="flex items-center gap-2 text-sm text-slate-500">
        Sort by
        <select className="sort-select" value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="name-asc">Name A to Z</option>
          <option value="name-desc">Name Z to A</option>
          <option value="safetensor-asc">File count low to high</option>
          <option value="safetensor-desc">File count high to low</option>
        </select>
      </label>
    </div>
  );
}

export default SortControls;
