function ModelCard({ model }) {
  return (
    <article className="model-card">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-[-0.02em]" title={model.name}>{model.getDisplayName()}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{model.family} <span className="text-slate-300">/</span> {model.useCase}</p>
        </div>
        <span className="model-index">AI</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="tag tag-blue">{model.pipelineTag}</span>
        <span className="tag">{model.architecture}</span>
        <span className="tag">{model.weightTag}</span>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        <div><dt>Safetensors</dt><dd>{model.safetensorLabel}</dd></div>
        <div><dt>Downloads</dt><dd>{model.downloads.toLocaleString()}</dd></div>
      </dl>
      <details className="mt-5 border-t border-slate-100 pt-4">
        <summary className="cursor-pointer text-sm font-semibold text-blue-600">View details</summary>
        <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-slate-50 p-3 text-[11px] leading-5 text-slate-500">{JSON.stringify(model.raw, null, 2)}</pre>
      </details>
      {model.repoUrl && <a className="repo-link" href={model.repoUrl} target="_blank" rel="noreferrer">Open model repository <span aria-hidden="true">↗</span></a>}
    </article>
  );
}

export default ModelCard;
