import type { UserConfig } from '@commitlint/types'

export default {
	defaultIgnores: true,
	extends: ['@commitlint/config-conventional'],
	formatter: '@commitlint/format',
	ignores: [(commit: string) => commit === ''],
} satisfies UserConfig
