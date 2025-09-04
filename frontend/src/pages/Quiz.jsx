// Quiz page: orchestrates quiz flow, timer, persistence, and navigation
import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchQuestions } from '../services/questionsService'
import QuestionCard from '../components/QuestionCard'
import Progress from '../components/Progress'
import { useNavigate } from 'react-router-dom'
import quizLogo from '../assets/Quiz-logo.svg.jpeg'

const STORAGE_KEY = 'quiz_state_v2'
const QUESTION_TIME_SEC = 30

export default function Quiz() {
	const [questions, setQuestions] = useState([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [selectedIndex, setSelectedIndex] = useState(null)
	const [answers, setAnswers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [secondsLeft, setSecondsLeft] = useState(QUESTION_TIME_SEC)
	const [difficulty, setDifficulty] = useState('easy')
	const navigate = useNavigate()
	const intervalRef = useRef(null)

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			if (raw) {
				const parsed = JSON.parse(raw)
				setQuestions(parsed.questions || [])
				setCurrentIndex(parsed.currentIndex || 0)
				setSelectedIndex(parsed.selectedIndex ?? null)
				setAnswers(parsed.answers || [])
				setLoading(false)
				setSecondsLeft(parsed.secondsLeft ?? QUESTION_TIME_SEC)
				setDifficulty(parsed.difficulty || 'easy')
				return
			}
		} catch {}
		loadQuestions('easy')
	}, [])

	function loadQuestions(diff) {
		let active = true
		setLoading(true)
		fetchQuestions(10, diff).then(qs => {
			if (!active) return
			setQuestions(qs)
			setCurrentIndex(0)
			setSelectedIndex(null)
			setAnswers([])
			setLoading(false)
			setSecondsLeft(QUESTION_TIME_SEC)
		}).catch(err => {
			if (!active) return
			setError('Failed to load questions')
			setLoading(false)
		})
		return () => { active = false }
	}

	useEffect(() => {
		try {
			if (loading) return
			const payload = { questions, currentIndex, selectedIndex, answers, secondsLeft, difficulty }
			localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
		} catch {}
	}, [questions, currentIndex, selectedIndex, answers, secondsLeft, difficulty, loading])

	useEffect(() => {
		if (loading) return
		if (intervalRef.current) clearInterval(intervalRef.current)
		intervalRef.current = setInterval(() => {
			setSecondsLeft(prev => {
				if (prev <= 1) {
					clearInterval(intervalRef.current)
					handleNext(true)
					return QUESTION_TIME_SEC
				}
				return prev - 1
			})
		}, 1000)
		return () => clearInterval(intervalRef.current)
	}, [loading, currentIndex])

	const total = questions.length
	const canGoNext = selectedIndex !== null
	const scoreSoFar = answers.reduce((acc, a) => acc + (a && a.selectedIndex === a.correctIndex ? 1 : 0), 0)

	function handleSelect(idx) {
		setSelectedIndex(idx)
	}

	function commitAnswer(selectedIdx) {
		const currentQ = questions[currentIndex]
		const entry = {
			questionId: currentQ.id,
			question: currentQ.question,
			selectedIndex: selectedIdx,
			correctIndex: currentQ.answerIndex,
			options: currentQ.options
		}
		const nextAnswers = [...answers]
		nextAnswers[currentIndex] = entry
		setAnswers(nextAnswers)
		return nextAnswers
	}

	function handleNext(isTimeout = false) {
		if (!isTimeout && selectedIndex === null) return
		const sel = isTimeout ? (selectedIndex ?? -1) : selectedIndex
		const nextAnswers = commitAnswer(sel)
		setSelectedIndex(null)
		setSecondsLeft(QUESTION_TIME_SEC)
		if (currentIndex + 1 < total) {
			setCurrentIndex(currentIndex + 1)
		} else {
			const score = nextAnswers.reduce((acc, a) => acc + (a.selectedIndex === a.correctIndex ? 1 : 0), 0)
			localStorage.removeItem(STORAGE_KEY)
			navigate('/results', { state: { answers: nextAnswers, total, score } })
		}
	}

	function handlePrev() {
		if (currentIndex === 0) return
		const prevIndex = currentIndex - 1
		setCurrentIndex(prevIndex)
		const prevAnswer = answers[prevIndex]
		setSelectedIndex(prevAnswer ? prevAnswer.selectedIndex : null)
		setSecondsLeft(QUESTION_TIME_SEC)
	}

	function handleSkip() {
		handleNext(true)
	}

	function onChangeDifficulty(e) {
		const diff = e.target.value
		setDifficulty(diff)
		loadQuestions(diff)
	}

	if (loading) return <div className="p-6 text-center">Loading questions…</div>
	if (error) return <div className="p-6 text-center text-red-600">{error}</div>
	if (total === 0) return <div className="p-6 text-center">No questions available.</div>

	const q = questions[currentIndex]

	return (
		<div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 py-10">
			<div className="px-4">
				<div className="max-w-2xl mx-auto flex items-center gap-3 mb-6">
					<img src={quizLogo} alt="Quiz logo" className="h-10 w-10 rounded" />
					<h1 className="text-2xl font-semibold text-indigo-900">Take the Quiz</h1>
				</div>
				<div className="max-w-2xl mx-auto flex items-center justify-between mb-4">
					<Progress current={currentIndex} total={total} />
					<div className="flex items-center gap-3">
						<label className="text-sm text-gray-700" htmlFor="difficulty">Difficulty</label>
						<select id="difficulty" value={difficulty} onChange={onChangeDifficulty} className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
							<option value="easy">Easy</option>
							<option value="medium">Medium</option>
							<option value="hard">Hard</option>
						</select>
						<div className="text-right bg-indigo-50 text-indigo-900 px-3 py-2 rounded-lg border border-indigo-100">
							<div className="text-sm">Score: <span className="font-semibold">{scoreSoFar}</span></div>
							<div className="text-sm">Time: <span className="font-semibold" aria-live="polite">{secondsLeft}s</span></div>
						</div>
					</div>
				</div>
				<QuestionCard
					questionIndex={currentIndex}
					total={total}
					question={q.question}
					options={q.options}
					selectedIndex={selectedIndex}
					onSelect={handleSelect}
				/>
				<div className="max-w-2xl mx-auto mt-6 flex items-center justify-between">
					<button
						className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
						onClick={handlePrev}
						disabled={currentIndex === 0}
						aria-label="Go to previous question"
					>
						Previous
					</button>

					<div className="flex items-center gap-2">
						<button
							className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
							onClick={handleSkip}
							aria-label="Skip this question"
						>
							Skip
						</button>
						<button
							className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
							onClick={() => handleNext(false)}
							disabled={!canGoNext}
							aria-label="Go to next question"
						>
							{currentIndex + 1 < total ? 'Next' : 'Finish'}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
