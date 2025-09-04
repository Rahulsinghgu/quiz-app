import { useLocation, useNavigate } from 'react-router-dom'

export default function Results() {
	const { state } = useLocation()
	const navigate = useNavigate()
	const answers = state?.answers || []
	const total = state?.total || 0
	const score = state?.score || 0

	function handleRestart() {
		navigate('/quiz')
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 py-10 px-4">
			<div className="max-w-3xl mx-auto bg-indigo-50/80 backdrop-blur rounded-2xl shadow-lg border border-indigo-100 p-6">
				<h1 className="text-2xl font-bold mb-2 text-gray-900">Results</h1>
				<div className="mb-6 text-gray-700">You scored <span className="font-semibold">{score}</span>/{total}</div>
				<div className="space-y-4">
					{answers.map((a, i) => {
						const isCorrect = a.selectedIndex === a.correctIndex
						return (
							<div key={i} className="border border-indigo-100 rounded-xl p-4 bg-white/90">
								<div className="font-medium mb-2">Q{i + 1}. {a.question}</div>
								<div className="text-sm mb-1">Your answer: <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{a.selectedIndex >= 0 ? a.options[a.selectedIndex] : '—'}</span></div>
								{!isCorrect && (
									<div className="text-sm">Correct answer: <span className="text-green-600 font-medium">{a.options[a.correctIndex]}</span></div>
								)}
							</div>
						)
					})}
				</div>
				<div className="mt-6">
					<button onClick={handleRestart} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Restart Quiz</button>
				</div>
			</div>
		</div>
	)
}
