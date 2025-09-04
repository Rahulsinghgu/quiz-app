export async function fetchQuestions(preferredCount = 10, difficulty) {
	const diffParam = difficulty ? `&difficulty=${encodeURIComponent(difficulty)}` : '';
	const apiUrl = `https://opentdb.com/api.php?amount=${preferredCount}&type=multiple${diffParam}`;
	try {
		const res = await fetch(apiUrl, { cache: 'no-store' });
		if (!res.ok) throw new Error('Network response was not ok');
		const data = await res.json();
		if (!data || !Array.isArray(data.results) || data.results.length === 0) {
			throw new Error('Empty results');
		}
		return normalizeOpenTriviaResults(data.results).slice(0, preferredCount);
	} catch (e) {
		const local = await import('../data/questions.json');
		return local.default.slice(0, Math.min(preferredCount, local.default.length));
	}
}

function decodeHtml(encoded) {
	const txt = typeof window !== 'undefined' ? window.document.createElement('textarea') : null;
	if (!txt) return encoded;
	txt.innerHTML = encoded;
	return txt.value;
}

function normalizeOpenTriviaResults(results) {
	return results.map((item, idx) => {
		const incorrect = item.incorrect_answers.map(decodeHtml);
		const correct = decodeHtml(item.correct_answer);
		const options = [...incorrect, correct];
		for (let i = options.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[options[i], options[j]] = [options[j], options[i]];
		}
		const answerIndex = options.indexOf(correct);
		return {
			id: idx + 1,
			question: decodeHtml(item.question),
			options,
			answerIndex,
		};
	});
}
