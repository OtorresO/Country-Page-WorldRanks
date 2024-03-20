export default function ExpandDown({ width = 24, height = 24, color = '#6C727F', classes }: { width?: number, height?: number, color?: string, classes?: string }) {
    return (
        <svg className={classes} xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none"><path stroke={color} stroke-width="2" d="m12 6-4 4-4-4" /></svg>
    )
}
