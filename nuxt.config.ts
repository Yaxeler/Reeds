import { script, style } from '@lotva/ples/head'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',

	// Только клиентский рендеринг, деплой статикой (nuxt generate)
	ssr: false,

	app: {
		head: {
			script: [{ innerHTML: script }],
			style: [{ innerHTML: style }],
		},
	},

	css: ['@/core/assets/styles/main.css'],

	devtools: { enabled: true },

	dir: {
		assets: '~~/app/core/assets',
		layouts: '~~/app/core/layouts',
	},

	icon: {
		clientBundle: {
			icons: [
				'lucide:sun',
				'lucide:moon',
				'lucide:sliders-horizontal',
				'lucide:chevron-down',
			],
			scan: true,
		},
		provider: 'none',
	},

	imports: {
		dirs: [],
		scan: false,
	},

	modules: ['@nuxt/eslint', '@pinia/nuxt', '@nuxt/icon'],
})
