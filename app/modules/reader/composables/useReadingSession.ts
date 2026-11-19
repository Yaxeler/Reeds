const sample = [
	'Утром река была совершенно тихой. На воде лежал лёгкий туман, и дальний берег едва угадывался за камышами. Я остановился у тропинки и услышал, как под ногами шелестит сухая трава.',
	'Когда поднялось солнце, туман начал рассеиваться. Над самой водой пролетела птица, и по зеркальной поверхности разошлись тонкие круги.',
	'Я остался на берегу ещё немного. Спешить было некуда, и с каждой минутой становилось проще замечать то, что обычно проходило мимо.',
].join('\n\n')

export function useReadingSession() {
	const draft = useState('reading-draft', () => '')
	const document = useState<null | { text: string; title: string }>(
		'reading-document',
		() => null,
	)
	const settings = useState('reading-settings', () => ({
		leading: 1.6,
		letterSpacing: 0,
		lineWidth: 54,
		size: 1.125,
	}))

	function openDraft() {
		const text = draft.value.trim()
		if (!text) return

		document.value = { text, title: 'Ваш текст' }
		return navigateTo('/read')
	}

	function openExample() {
		document.value = { text: sample, title: 'Утро у реки' }
		return navigateTo('/read')
	}

	return { document, draft, openDraft, openExample, settings }
}
