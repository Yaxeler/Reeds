<script setup lang="ts">
	import wip from '@/common/images/wip.gif'
</script>

<template>
	<section class="wip">
		<h1 class="wip__title">Reeds</h1>

		<p class="wip__description">
			Веб-приложение для адаптивного чтения: загружаете свой текст, а приложение
			приводит его к удобному для вас виду и при необходимости озвучивает.
		</p>

		<img
			class="wip__image"
			:src="wip"
			alt="Сайт в разработке"
			width="450"
			height="450"
		/>
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

	.wip__image {
		width: min(100%, 18rem);
	}
</style>
