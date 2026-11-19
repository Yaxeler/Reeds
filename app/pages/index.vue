<script setup lang="ts">
	import { annotate } from 'rough-notation'

	import { useReadingSession } from '@/modules/reader'

	const { draft, openDraft, openExample } = useReadingSession()
	const readingAccent = useTemplateRef('readingAccent')
	const annotation = shallowRef<ReturnType<typeof annotate>>()
	const hoverMotion = matchMedia(
		'(hover: hover) and (prefers-reduced-motion: no-preference)',
	)

	function showReadingAccent(shouldAnimate: boolean) {
		const target = readingAccent.value
		const accent = annotation.value
		if (!target || !accent) return

		accent.animate = shouldAnimate
		accent.show()
		if (target.nextElementSibling?.classList.contains('rough-annotation')) {
			target.nextElementSibling.setAttribute('aria-hidden', 'true')
		}
	}

	function showReadingAccentOnHover() {
		if (hoverMotion.matches) showReadingAccent(true)
	}

	function syncReadingAccent() {
		if (hoverMotion.matches) {
			annotation.value?.hide()
		} else {
			showReadingAccent(false)
		}
	}

	useHead({ title: 'Reeds — адаптивное чтение' })

	onMounted(() => {
		const target = readingAccent.value
		if (!target) return

		annotation.value = annotate(target, {
			animate: false,
			animationDuration: 460,
			iterations: 1,
			padding: 2,
			type: 'underline',
		})
		syncReadingAccent()
		hoverMotion.addEventListener('change', syncReadingAccent)
	})

	onBeforeUnmount(() => {
		hoverMotion.removeEventListener('change', syncReadingAccent)
		annotation.value?.remove()
	})
</script>

<template>
	<section class="home">
		<div class="home__intro">
			<h1
				class="home__title"
				@pointerenter="showReadingAccentOnHover"
				@pointerleave="syncReadingAccent"
			>
				Читайте в своём
				<span class="home__accent"><span ref="readingAccent">темпе</span></span>
			</h1>

			<p class="home__description">
				Вставьте текст и настройте его размер, интервалы и ширину строки так,
				как вам удобно.
			</p>
		</div>

		<form
			class="home__form"
			@submit.prevent="openDraft"
		>
			<label
				class="home__label"
				for="reading-draft"
			>
				Текст для чтения
			</label>

			<textarea
				id="reading-draft"
				v-model="draft"
				class="home__input"
				placeholder="Вставьте сюда свой текст"
				required
				rows="7"
			></textarea>

			<div class="home__actions">
				<button
					class="home__primary"
					:disabled="!draft.trim()"
					type="submit"
				>
					Начать чтение
				</button>

				<button
					class="home__example"
					type="button"
					@click="openExample"
				>
					Открыть пример
				</button>
			</div>
		</form>
	</section>
</template>

<style scoped>
	.home {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		align-items: start;
		gap: var(--space-6);
		max-inline-size: 60rem;
		margin-inline: auto;
		padding: calc(var(--space-6) * 2) var(--space-4) var(--space-6);
	}

	.home__title {
		max-inline-size: 11ch;
		font-size: 2.5rem;
		letter-spacing: -0.035em;
		line-height: var(--line-height-heading);
	}

	.home__accent {
		color: var(--accent);
	}

	.home__accent > span {
		display: inline-block;
	}

	.home__description {
		max-inline-size: 34ch;
		margin-block-start: var(--space-5);
	}

	.home__form {
		display: grid;
		gap: var(--space-3);
		min-inline-size: 0;
		padding: var(--space-5);
		border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--bg));
		border-radius: var(--space-4);
		background: color-mix(in srgb, var(--accent) 5%, var(--bg));
	}

	.home__label {
		font-weight: var(--font-weight-bold);
	}

	.home__input {
		inline-size: 100%;
		min-inline-size: 0;
		padding: var(--space-3);
		border: 1px solid color-mix(in srgb, var(--text) 48%, var(--bg));
		border-radius: var(--space-2);
		background: var(--bg);
		color: var(--text);
		resize: vertical;
	}

	.home__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.home__primary,
	.home__example {
		min-block-size: 2.5rem;
		padding: var(--space-2) var(--space-3);
		transition:
			background-color 240ms ease,
			border-color 240ms ease;
		border: 1px solid var(--accent);
		border-radius: var(--space-2);
		font-weight: var(--font-weight-bold);
	}

	.home__primary {
		transition-duration: 420ms;
		transition-timing-function: ease-in-out;
		background: var(--accent);
		color: var(--bg);
	}

	.home__primary:disabled {
		border-color: transparent;
		background: color-mix(in srgb, var(--text) 9%, var(--bg));
		color: color-mix(in srgb, var(--text) 74%, var(--bg));
		cursor: default;
	}

	.home__primary:where(:enabled):hover {
		background: color-mix(in srgb, var(--accent) 88%, var(--text));
	}

	.home__example {
		border-color: transparent;
		color: var(--accent);
	}

	.home__example:hover {
		background: color-mix(in srgb, var(--accent) 12%, var(--bg));
	}

	.home__input:focus-visible,
	.home__primary:focus-visible,
	.home__example:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	@media (width <= 42rem) {
		.home {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--space-5);
			padding-block-start: var(--space-6);
		}

		.home__form {
			padding: var(--space-4);
		}

		.home__title {
			max-inline-size: none;
			font-size: var(--text-xl);
		}

		.home__description {
			margin-block-start: var(--space-3);
		}
	}
</style>
