import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getTabColors, TAB_COLORS } from '../src/tabColors.ts'

describe('getTabColors', () => {
    it('returns the built-in palette when custom colors are absent', () => {
        assert.deepEqual(getTabColors(undefined), TAB_COLORS)
    })

    it('returns the built-in palette when the custom setting is not an array', () => {
        assert.deepEqual(getTabColors({ name: 'Custom', value: '#123456' }), TAB_COLORS)
        assert.deepEqual(getTabColors(null), TAB_COLORS)
    })

    it('appends valid custom colors and trims their names', () => {
        const colors = getTabColors([
            { name: '  Ocean  ', value: '#123456' },
            { name: 'Forest', value: '#abcdef' },
        ])

        assert.equal(colors.length, TAB_COLORS.length + 2)
        assert.deepEqual(colors.slice(-2), [
            { name: 'Ocean', value: '#123456' },
            { name: 'Forest', value: '#abcdef' },
        ])
    })

    it('accepts upper- and lower-case six-digit HEX values', () => {
        const colors = getTabColors([
            { name: 'Upper', value: '#ABCDEF' },
            { name: 'Lower', value: '#abcdef' },
        ])

        assert.equal(colors.length, TAB_COLORS.length + 1)
        assert.equal(colors.at(-1)?.name, 'Upper')
    })

    it('ignores malformed entries and invalid HEX values', () => {
        const colors = getTabColors([
            null,
            'not an object',
            {},
            { name: '', value: '#123456' },
            { name: 'Missing value' },
            { name: 'Short HEX', value: '#123' },
            { name: 'Named color', value: 'red' },
            { name: 'Alpha HEX', value: '#12345678' },
        ])

        assert.deepEqual(colors, TAB_COLORS)
    })

    it('does not add duplicate custom colors or override built-in colors', () => {
        const colors = getTabColors([
            { name: 'Custom blue', value: '#0275D8' },
            { name: 'First custom', value: '#123456' },
            { name: 'Duplicate custom', value: '#123456' },
        ])

        assert.equal(colors.length, TAB_COLORS.length + 1)
        assert.equal(colors.find(color => color.value === '#0275d8')?.name, 'Blue')
        assert.equal(colors.at(-1)?.name, 'First custom')
    })
})
