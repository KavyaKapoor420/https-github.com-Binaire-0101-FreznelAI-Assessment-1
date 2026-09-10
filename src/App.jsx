import { useState } from "react";
import { Button } from "@adobe/react-spectrum";
import { Link } from "react-router-dom";

function App() {
	const [isDark, setIsDark] = useState(false);

	return (
		<main
			className={
				isDark
					? "min-h-screen bg-[#0b1018] text-slate-100 transition-colors duration-300"
					: "min-h-screen bg-[#fbfcfe] text-slate-950 transition-colors duration-300"
			}
		>
			<div
				className={
					isDark
						? "min-h-screen bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:24px_24px]"
						: "min-h-screen bg-[linear-gradient(rgba(18,38,63,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,38,63,0.055)_1px,transparent_1px)] bg-[size:24px_24px]"
				}
			>
				<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 lg:px-10">
					<Link className="text-lg font-semibold tracking-[-0.04em]" to="#top">
						<span className="text-blue-600">●</span> binaire
					</Link>
					<div className="flex items-center gap-4">
						<Link
							className="hidden text-sm font-medium opacity-70 transition-opacity hover:opacity-100 sm:block"
							to="#features"
						>
							Explore
						</Link>
						<Button
							aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
							variant="secondary"
							onPress={() => setIsDark((current) => !current)}
						>
							{isDark ? "Light" : "Dark"}
						</Button>
					</div>
				</nav>

				<section id="top" className="mx-auto max-w-4xl px-6 pb-24 pt-20 text-center lg:pt-28">
					<div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
						<span className="h-2 w-2 rounded-full bg-emerald-500" />
						A clearer way to discover AI models
					</div>
					<p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
						Model discovery, simplified
					</p>
					<h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-7xl">
						Find the right model
						<span className="block text-slate-400">for the work ahead.</span>
					</h1>
					<p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
						Search, compare, and understand available AI models through one calm,
						focused workspace built for better decisions.
					</p>
					<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Button variant="accent" onPress={() => (window.location.hash = "features")}>
							Explore models
						</Button>
						<Button variant="secondary" onPress={() => (window.location.hash = "features")}>
							See how it works
						</Button>
					</div>
				</section>

				<section id="features" className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-3 lg:px-10">
					{[
						["01", "Search with intent", "Find models by name or family with fast, forgiving substring search."],
						["02", "Compare the details", "See architecture, pipeline, weights, and file counts at a glance."],
						["03", "Keep moving offline", "Your recent model data stays available when the connection does not."],
					].map(([number, title, description]) => (
						<article
							className="border-t border-slate-200/80 bg-white/60 p-5 shadow-[0_12px_40px_rgba(30,55,90,0.05)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/60"
							key={number}
						>
							<span className="text-xs font-semibold text-blue-600">{number}</span>
							<h2 className="mt-8 text-lg font-semibold tracking-[-0.03em]">{title}</h2>
							<p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
						</article>
					))}
				</section>
			</div>
		</main>
	);
}

export default App;
