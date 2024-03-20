export default function ExpandDown({ width = 24, height = 24, color = '#6C727F', classes }: { width?: number, height?: number, color?: string, classes?: string }) {
    return (
        <svg className={classes}  width={width} height={height} fill="none"><path stroke={color} strokeWidth="2" d="m12 6-4 4-4-4" /></svg>
    )
}
