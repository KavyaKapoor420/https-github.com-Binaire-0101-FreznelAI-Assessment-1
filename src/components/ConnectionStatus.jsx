function ConnectionStatus({ isOnline, lastSynced }) {
  return (
    <div className={isOnline ? "status-pill status-online" : "status-pill status-offline"}>
      <span className="status-dot" />
      <span>{isOnline ? "Online" : "Offline mode"}</span>
      {lastSynced && <span className="hidden text-slate-400 sm:inline">Updated {lastSynced}</span>}
    </div>
  );
}

export default ConnectionStatus;
