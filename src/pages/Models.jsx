import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModelAPI from "../api/ModelApi.js";
import ConnectionStatus from "../components/ConnectionStatus.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import ModelGrid from "../components/ModelGrid.jsx";
import SearchBar from "../components/SearchBar.jsx";
import SortControls from "../components/SortControls.jsx";
import ModelFilter from "../filters/ModelFilter.js";
import useOnlineStatus from "../hooks/useOnlineStatus.js";
import ModelCache from "../offline/ModelCache.js";
import ModelSearch from "../components/Search/ModelSearch.js";
import ModelSorter from "../components/Sorting/ModelSorter.js";
import debounce from "../utils/debounce.js";
import throttle from "../utils/throttle.js";

const initialFilters = {
	pipelineTag: "",
	familyTag: "",
	architectureTag: "",
	weightTag: "",
	minSafetensors: "",
	maxSafetensors: "",
};

function Models({ user, authService }) {
	const navigate = useNavigate();
	const isOnline = useOnlineStatus();
	const [models, setModels] = useState([]);
	const [searchInput, setSearchInput] = useState({ name: "", family: "" });
	const [debouncedSearch, setDebouncedSearch] = useState({ name: "", family: "" });
	const [filters, setFilters] = useState(initialFilters);
	const [sortDirection, setSortDirection] = useState("name-asc");
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState("");
	const [lastSynced, setLastSynced] = useState("");
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const api = useMemo(() => new ModelAPI(), []);
	const cache = useMemo(() => new ModelCache(), []);
	const searchEngine = useMemo(() => new ModelSearch(), []);
	const filterEngine = useMemo(() => new ModelFilter(), []);
	const sorter = useMemo(() => new ModelSorter(), []);

	const updateSearch = useMemo(() => debounce(setDebouncedSearch, 350), []);

	useEffect(() => () => updateSearch.cancel(), [updateSearch]);

	useEffect(() => {
		cache
			.getModels()
			.then((cachedModels) => {
				if (cachedModels.length > 0) {
					setModels(cachedModels);
				}
			})
			.catch(() => setError("Cached data could not be opened."))
			.finally(() => setIsLoading(false));

		cache
			.getMetadata()
			.then((metadata) => {
				if (metadata?.lastSuccessfulSync) {
					setLastSynced(new Date(metadata.lastSuccessfulSync).toLocaleString());
				}
			})
			.catch(() => {});
	}, [cache]);

	useEffect(() => {
		const refreshModels = () => {
			setIsRefreshing(true);
			setError("");

			api
				.fetchModels()
				.then((freshModels) => cache.saveModels(freshModels).then(() => freshModels))
				.then((freshModels) => {
					setModels(freshModels);
					setLastSynced(new Date().toLocaleString());
				})
				.catch((refreshError) => setError(refreshError.message || "Fresh model data is unavailable."))
				.finally(() => setIsRefreshing(false));
		};

		if (isOnline) {
			const throttledRefresh = throttle(refreshModels, 30000);
			throttledRefresh();
			return () => throttledRefresh.cancel();
		}

		return undefined;
	}, [api, cache, isOnline]);

	const processedModels = useMemo(() => {
		const searched = searchEngine.search(models, debouncedSearch);
		const filtered = filterEngine.filter(searched, filters);
		return sorter.sort(filtered, sortDirection);
	}, [models, debouncedSearch, filters, sortDirection, searchEngine, filterEngine, sorter]);

	const filterOptions = useMemo(() => filterEngine.getOptions(models), [filterEngine, models]);

	function handleSearch(field, value) {
		const nextSearch = { ...searchInput, [field]: value };
		setSearchInput(nextSearch);
		updateSearch(nextSearch);
	}

	function handleFilterChange(field, value) {
		setFilters((current) => ({ ...current, [field]: value }));
	}

	function clearFilters() {
		setFilters(initialFilters);
	}

	function handleRetry() {
		setIsLoading(true);
		api
			.fetchModels()
			.then((freshModels) => cache.saveModels(freshModels).then(() => freshModels))
			.then(setModels)
			.catch((retryError) => setError(retryError.message || "Unable to load model data."))
			.finally(() => setIsLoading(false));
	}

	function handleSignOut() {
		authService.signOut().then(() => navigate("/login")).catch(() => setError("Unable to sign out right now."));
	}

	return (
		<main className="min-h-screen bg-[#fbfcfe] text-slate-950">
			<nav className="border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-10">
					<Link className="text-lg font-semibold tracking-[-0.04em]" to="/"><span className="text-blue-600">●</span> binaire</Link>
					<div className="flex items-center gap-3">
						<ConnectionStatus isOnline={isOnline} lastSynced={lastSynced} />
						<span className="hidden max-w-48 truncate text-sm text-slate-500 md:block">{user.email}</span>
						<button className="ghost-button" type="button" onClick={handleSignOut}>Log out</button>
					</div>
				</div>
			</nav>

			<div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
				<header className="max-w-3xl">
					<p className="eyebrow">Model discovery</p>
					<h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">Find the right model for your use case.</h1>
					<p className="mt-5 max-w-2xl text-base leading-7 text-slate-500">Search, compare and filter available models based on architecture, family, pipeline and file configuration.</p>
				</header>

				<section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(30,55,90,0.06)] sm:p-7">
					<SearchBar
						nameQuery={searchInput.name}
						familyQuery={searchInput.family}
						onNameChange={(value) => handleSearch("name", value)}
						onFamilyChange={(value) => handleSearch("family", value)}
					/>
					{isRefreshing && <p className="mt-4 text-xs font-medium text-blue-600">Refreshing data in the background...</p>}
					{!isOnline && <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Offline mode. Showing cached data.</p>}
					{error && models.length > 0 && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
				</section>

				<div className="mt-8 lg:hidden"><button className="secondary-button" type="button" onClick={() => setIsFilterOpen((current) => !current)}>{isFilterOpen ? "Hide filters" : "Show filters"}</button></div>
				<div className="mt-6 grid gap-8 lg:grid-cols-[250px_1fr]">
					<div className={`${isFilterOpen ? "block" : "hidden"} lg:block`}><FilterPanel filters={filters} options={filterOptions} onChange={handleFilterChange} onClear={clearFilters} /></div>
					<section>
						<SortControls value={sortDirection} onChange={setSortDirection} resultCount={processedModels.length} />
						<div className="mt-5"><ModelGrid models={processedModels} isLoading={isLoading} error={error} onRetry={handleRetry} /></div>
					</section>
				</div>
			</div>
		</main>
	);
}

export default Models;
