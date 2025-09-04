export default function QuestionCard({ questionIndex, total, question, options, selectedIndex, onSelect }) {
	return (
		<div className="w-full max-w-2xl mx-auto p-6 bg-indigo-50/80 backdrop-blur shadow-lg rounded-2xl border border-indigo-100 transition-transform">
			<div className="mb-3 text-xs tracking-wide uppercase text-gray-600">Question {questionIndex + 1} of {total}</div>
			<div className="mb-5 rounded-xl border-2 border-amber-400/60 shadow-[0_0_0_3px_rgba(251,191,36,0.25)_inset]">
				<div className="rounded-[10px] bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 px-4 py-3">
					<h2 className="text-lg md:text-xl font-semibold leading-snug text-amber-300 drop-shadow-sm">{question}</h2>
				</div>
			</div>
			<div className="grid gap-3">
				{options.map((opt, idx) => {
					const isSelected = selectedIndex === idx;
					return (
						<button
							key={idx}
							onClick={() => onSelect(idx)}
							className={`group text-left px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 active:scale-[0.99] ${
								isSelected
									? 'bg-indigo-800 text-amber-200 border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.35)] focus-visible:ring-amber-400'
									: 'bg-indigo-900/90 text-white border-amber-300/50 hover:border-amber-400 hover:shadow-[0_0_0_3px_rgba(251,191,36,0.25)] focus-visible:ring-amber-400'
							}`}
						>
							<span className="inline-block">{opt}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
