import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker'

export interface TabColor {
    name: string
    value: string | null
}

export const TAB_COLORS: TabColor[] = [
    { name: _('No color'), value: null },
    { name: _('Blue'), value: '#0275d8' },
    { name: _('Green'), value: '#5cb85c' },
    { name: _('Orange'), value: '#f0ad4e' },
    { name: _('Purple'), value: '#613d7c' },
    { name: _('Red'), value: '#d9534f' },
    { name: _('Yellow'), value: '#ffd500' },
]

/**
 * Combines the built-in tab palette with valid user-defined colors.
 * Built-in colors take precedence over custom colors with the same HEX value.
 */
export function getTabColors (customColors: unknown): TabColor[] {
    const colors = [...TAB_COLORS]
    const seenValues = new Set(
        TAB_COLORS
            .map(color => color.value?.toLowerCase())
            .filter((value): value is string => !!value),
    )

    if (!Array.isArray(customColors)) {
        return colors
    }

    for (const candidate of customColors) {
        if (!candidate || typeof candidate !== 'object') {
            continue
        }

        const color = candidate as Record<string, unknown>
        if (typeof color.name !== 'string' || !color.name.trim() ||
            typeof color.value !== 'string' || !/^#[\da-f]{6}$/i.test(color.value)) {
            continue
        }

        const value = color.value.toLowerCase()
        if (seenValues.has(value)) {
            continue
        }

        seenValues.add(value)
        colors.push({ name: color.name.trim(), value: color.value })
    }

    return colors
}
