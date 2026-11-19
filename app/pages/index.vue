<script setup lang="ts">
	import { annotate } from 'rough-notation'

	import wip from '@/common/images/wip.gif'
	import wipStatic from '@/common/images/wip.png'

	const readingAccent = useTemplateRef('readingAccent')
	const annotation = shallowRef<ReturnType<typeof annotate>>()

	onMounted(() => {
		const target = readingAccent.value
		if (!target) return

		annotation.value = annotate(target, {
			animate: false,
			padding: 1,
			type: 'underline',
		})
		annotation.value.show()
		if (target.nextElementSibling?.classList.contains('rough-annotation')) {
			target.nextElementSibling.setAttribute('aria-hidden', 'true')
		}
	})

	onBeforeUnmount(() => annotation.value?.remove())
</script>

<template>
	<section class="wip">
		<h1 class="wip__title">Reeds</h1>

		<p class="wip__description">
			Веб-приложение для
			<span class="wip__accent">
				<span ref="readingAccent">адаптивного чтения:</span>
			</span>
			загружаете свой текст, а приложение приводит его к удобному для вас виду и
			при необходимости озвучивает.
		</p>

		<picture
			class="wip__image"
			data-ples
		>
			<source
				:srcset="wipStatic"
				media="(prefers-reduced-motion: reduce)"
			/>

			<img
				:src="wip"
				alt="Сайт в разработке"
				width="450"
				height="450"
			/>
		</picture>
	</section>
</template>

<style scoped>
	.wip {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		align-items: center;
		max-width: 40rem;
		margin-inline: auto;
		padding: var(--space-6) var(--space-4);
		text-align: center;
	}

	.wip__title {
		font-size: var(--text-xl);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-heading);
	}

	.wip__accent {
		display: inline-block;
		color: var(--accent);
	}

	.wip__accent > span {
		display: inline-block;
		color: var(--text);
	}

	.wip__image {
		width: min(100%, 18rem);
	}
</style>
