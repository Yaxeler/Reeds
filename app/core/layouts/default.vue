<script setup lang="ts">
	type Theme = 'dark' | 'light' | 'system'

	const storageKey = 'reeds-theme'
	const theme = ref<Theme>('system')
	const systemPreference = matchMedia('(prefers-color-scheme: dark)')
	const systemDark = ref(systemPreference.matches)
	const isDark = computed(
		() =>
			theme.value === 'dark' || (theme.value === 'system' && systemDark.value),
	)

	function applyTheme(value: Theme) {
		document.documentElement.classList.toggle('light', value === 'light')
		document.documentElement.classList.toggle('dark', value === 'dark')
	}

	function updateSystemPreference(event: MediaQueryListEvent) {
		systemDark.value = event.matches
	}

	onMounted(() =>
		systemPreference.addEventListener('change', updateSystemPreference),
	)
	onBeforeUnmount(() =>
		systemPreference.removeEventListener('change', updateSystemPreference),
	)

	let savedTheme: null | string = null
	try {
		savedTheme = localStorage.getItem(storageKey)
	} catch {
		savedTheme = null
	}

	if (savedTheme === 'light' || savedTheme === 'dark') {
		theme.value = savedTheme
		applyTheme(savedTheme)
	}

	function toggleTheme() {
		const value = isDark.value ? 'light' : 'dark'
		theme.value = value

		if (
			document.startViewTransition &&
			!matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			document.startViewTransition(() => applyTheme(value))
		} else {
			applyTheme(value)
		}

		try {
			localStorage.setItem(storageKey, value)
		} catch {
			return
		}
	}
</script>

<template>
	<header class="layout-header">
		<NuxtLink
			class="layout-header__brand"
			to="/"
		>
			Reeds
		</NuxtLink>

		<button
			class="layout-header__theme"
			:class="{ 'layout-header__theme--dark': isDark }"
			:aria-pressed="isDark"
			aria-label="Тёмная тема"
			type="button"
			@click="toggleTheme"
		>
			<Icon
				class="layout-header__sun"
				name="lucide:sun"
				mode="svg"
				aria-hidden="true"
			/>

			<Icon
				class="layout-header__moon"
				name="lucide:moon"
				mode="svg"
				aria-hidden="true"
			/>
		</button>
	</header>

	<main>
		<slot></slot>
	</main>
</template>

<style scoped>
	.layout-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		max-inline-size: 60rem;
		margin-inline: auto;
		padding: var(--space-3) var(--space-4);
	}

	.layout-header__brand {
		transform-origin: left center;
		transition: transform 160ms ease-out;
		font-size: var(--text-lg);
		font-weight: var(--font-weight-bold);
		text-decoration: none;
	}

	@media (hover: hover) and (prefers-reduced-motion: no-preference) {
		.layout-header__brand:hover {
			transform: scale(1.06);
		}
	}

	.layout-header__brand:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}

	.layout-header__theme {
		display: grid;
		block-size: max(44px, 2.5rem);
		inline-size: max(44px, 2.5rem);
		transition: background-color 240ms ease;
		border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--bg));
		border-radius: 50%;
		background: color-mix(in srgb, var(--accent) 6%, var(--bg));
		color: var(--accent);
		place-items: center;
	}

	.layout-header__theme:hover {
		background: color-mix(in srgb, var(--accent) 14%, var(--bg));
	}

	.layout-header__theme:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.layout-header__sun,
	.layout-header__moon {
		grid-area: 1 / 1;
		transition:
			opacity 240ms ease,
			transform 240ms ease;
		font-size: var(--text-lg);
	}

	.layout-header__moon,
	.layout-header__theme--dark .layout-header__sun {
		transform: scale(0.75);
		opacity: 0;
	}

	.layout-header__theme--dark .layout-header__moon {
		transform: none;
		opacity: 1;
	}
</style>
