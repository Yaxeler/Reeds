<script setup lang="ts">
	import {
		CollapsibleContent,
		CollapsibleRoot,
		CollapsibleTrigger,
	} from 'reka-ui'

	import { useReadingSession } from '@/modules/reader'

	const { document, settings } = useReadingSession()
	const heading = useTemplateRef('heading')
	const settingsOpen = ref(false)
	const paragraphs = computed(
		() => document.value?.text.split(/\r?\n(?:[^\S\r\n]*\r?\n)+/) ?? [],
	)
	const readerStyle = computed(() => ({
		'--reader-leading': settings.value.leading,
		'--reader-letter-spacing': `${settings.value.letterSpacing / 100}em`,
		'--reader-size': `${settings.value.size}rem`,
		'--reader-width': `${settings.value.lineWidth}ch`,
	}))

	useHead({ title: 'Читалка — Reeds' })

	onMounted(() => {
		settingsOpen.value = matchMedia('(width > 42rem)').matches
		heading.value?.focus()
	})
</script>

<template>
	<section
		v-if="document"
		class="reader"
	>
		<h1
			ref="heading"
			class="reader__title"
			tabindex="-1"
		>
			{{ document.title }}
		</h1>

		<CollapsibleRoot
			v-model:open="settingsOpen"
			class="reader__settings"
		>
			<CollapsibleTrigger class="reader__summary">
				<Icon
					class="reader__settings-icon"
					name="lucide:sliders-horizontal"
					mode="svg"
					aria-hidden="true"
				/>

				<span>Настройки чтения</span>

				<Icon
					class="reader__chevron"
					name="lucide:chevron-down"
					mode="svg"
					aria-hidden="true"
				/>
			</CollapsibleTrigger>

			<CollapsibleContent class="reader__settings-content">
				<div class="reader__controls">
					<div class="reader__control">
						<label for="reader-size">Размер текста</label>

						<span aria-hidden="true">
							{{ Math.round(settings.size * 100) }}%
						</span>

						<input
							id="reader-size"
							v-model.number="settings.size"
							:aria-valuetext="`${Math.round(settings.size * 100)} процентов`"
							max="2"
							min="1"
							step="0.125"
							type="range"
						/>
					</div>

					<div class="reader__control">
						<label for="reader-leading">Межстрочный интервал</label>

						<span aria-hidden="true">
							{{ settings.leading.toLocaleString('ru') }}
						</span>

						<input
							id="reader-leading"
							v-model.number="settings.leading"
							max="2.2"
							min="1.3"
							step="0.1"
							type="range"
						/>
					</div>

					<div class="reader__control">
						<label for="reader-letter-spacing">Межсимвольный интервал</label>

						<span aria-hidden="true">{{ settings.letterSpacing }}%</span>

						<input
							id="reader-letter-spacing"
							v-model.number="settings.letterSpacing"
							:aria-valuetext="`${settings.letterSpacing}% от размера текста`"
							max="15"
							min="0"
							step="1"
							type="range"
						/>
					</div>

					<div class="reader__control">
						<label for="reader-width">Ширина строки</label>

						<span aria-hidden="true">{{ settings.lineWidth }} зн.</span>

						<input
							id="reader-width"
							v-model.number="settings.lineWidth"
							:aria-valuetext="`${settings.lineWidth} знаков`"
							max="72"
							min="24"
							step="2"
							type="range"
						/>
					</div>
				</div>
			</CollapsibleContent>
		</CollapsibleRoot>

		<article
			class="reader__article"
			:style="readerStyle"
			aria-label="Текст для чтения"
		>
			<p
				v-for="(paragraph, index) in paragraphs"
				:key="index"
				class="reader__paragraph"
			>
				{{ paragraph }}
			</p>
		</article>

		<NuxtLink
			class="reader__back"
			to="/"
		>
			К вводу текста
		</NuxtLink>
	</section>

	<section
		v-else
		class="reader reader--empty"
	>
		<h1
			ref="heading"
			class="reader__title"
			tabindex="-1"
		>
			Читалка
		</h1>

		<p>Вставьте свой текст или откройте пример на главной.</p>

		<NuxtLink to="/">На главную</NuxtLink>
	</section>
</template>

<style scoped>
	.reader {
		display: grid;
		grid-template-areas: 'title settings' 'article settings' 'back settings';
		grid-template-columns: minmax(0, 1fr) minmax(12rem, 15rem);
		align-items: start;
		max-inline-size: 60rem;
		margin-inline: auto;
		padding: var(--space-6) var(--space-4);
		gap: var(--space-4) var(--space-6);
	}

	.reader__title {
		grid-area: title;
		font-size: var(--text-xl);
		line-height: var(--line-height-heading);
	}

	.reader__settings {
		grid-area: settings;
		min-inline-size: 0;
		border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--bg));
		border-radius: var(--space-4);
		background: color-mix(in srgb, var(--accent) 5%, var(--bg));
	}

	.reader__summary {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--space-2);
		min-block-size: 2.75rem;
		inline-size: 100%;
		padding: var(--space-2) var(--space-3);
		border-radius: var(--space-4);
		color: var(--text);
		font-weight: var(--font-weight-bold);
		text-align: start;
	}

	.reader__summary:hover {
		background: color-mix(in srgb, var(--accent) 9%, var(--bg));
	}

	.reader__summary:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.reader__settings-icon,
	.reader__chevron {
		color: var(--accent);
	}

	.reader__summary[data-state='open'] .reader__chevron {
		transform: rotate(180deg);
	}

	.reader__controls {
		display: grid;
		gap: var(--space-2);
		margin-inline: var(--space-3);
		padding-block: var(--space-3);
		border-block-start: 1px solid
			color-mix(in srgb, var(--accent) 18%, var(--bg));
	}

	@media (prefers-reduced-motion: no-preference) {
		.reader__summary {
			transition: background-color 240ms ease;
		}

		.reader__chevron {
			transition: transform 260ms ease;
		}

		.reader__settings-content[data-state='open'] {
			animation: reader-settings-open 340ms cubic-bezier(0.2, 0.65, 0.3, 1);
		}

		.reader__settings-content[data-state='closed'] {
			animation: reader-settings-close 160ms ease-in;
		}
	}

	@keyframes reader-settings-open {
		from {
			block-size: 0;
			overflow: clip;
		}

		to {
			block-size: var(--reka-collapsible-content-height);
			overflow: clip;
		}
	}

	@keyframes reader-settings-close {
		from {
			block-size: var(--reka-collapsible-content-height);
			overflow: clip;
		}

		to {
			block-size: 0;
			overflow: clip;
		}
	}

	.reader__control {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--space-1) var(--space-2);
		font-size: var(--text-sm);
	}

	.reader__control span {
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}

	.reader__control input {
		grid-column: 1 / -1;
		min-block-size: 2.5rem;
		inline-size: 100%;
		margin: 0;
		accent-color: var(--accent);
	}

	.reader__article {
		grid-area: article;
		min-inline-size: 0;
		max-inline-size: var(--reader-width);
		font-size: var(--reader-size);
		letter-spacing: var(--reader-letter-spacing);
		line-height: var(--reader-leading);
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}

	.reader__paragraph + .reader__paragraph {
		margin-block-start: 1em;
	}

	.reader__back {
		grid-area: back;
		justify-self: start;
	}

	.reader--empty {
		grid-template: none / minmax(0, 1fr);
	}

	.reader--empty .reader__title {
		grid-area: auto;
	}

	@media (width <= 42rem) {
		.reader {
			grid-template-areas: 'title' 'settings' 'article' 'back';
			grid-template-columns: minmax(0, 1fr);
		}

		.reader--empty {
			grid-template-areas: none;
		}
	}
</style>
