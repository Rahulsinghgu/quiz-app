export default function Progress({ current, total }) {
	const percent = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
	return (
		<div className="w-full max-w-2xl mx-auto">
			<div className="w-full h-2 bg-gray-200/70 rounded-full overflow-hidden">
				<div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 transition-[width] duration-300" style={{ width: `${percent}%` }} />
			</div>
			<div className="mt-2 text-xs text-gray-600">{percent}% complete</div>
		</div>
	);
}
