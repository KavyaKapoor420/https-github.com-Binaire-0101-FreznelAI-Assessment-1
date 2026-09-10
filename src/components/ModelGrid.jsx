import ModelCard from "./ModelCard.jsx";

function ModelGrid({ models, isLoading, error, onRetry }) {
  if (isLoading) {
    return <div className="model-grid">{Array.from({ length: 6 }, (_, index) => <div className="model-skeleton" key={index} />)}</div>;
  }

  if (error && models.length === 0) {
    return <div className="empty-state"><p className="eyebrow">Unable to load models</p><h2>We could not reach the model service.</h2><p>{error}</p><button className="primary-button" type="button" onClick={onRetry}>Try again</button></div>;
  }

  if (models.length === 0) {
    return <div className="empty-state"><p className="eyebrow">No matches</p><h2>No models found</h2><p>Try changing your search or clearing some filters.</p></div>;
  }

  return <div className="model-grid">{models.map((model) => <ModelCard key={model.id || model.name} model={model} />)}</div>;
}

export default ModelGrid;
