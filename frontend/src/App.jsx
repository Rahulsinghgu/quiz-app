import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Quiz from './pages/Quiz'
import Results from './pages/Results'

export default function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen font-sans">
				<Routes>
					<Route path="/" element={<Navigate to="/quiz" replace />} />
					<Route path="/quiz" element={<Quiz />} />
					<Route path="/results" element={<Results />} />
				</Routes>
			</div>
		</BrowserRouter>
	)
}
