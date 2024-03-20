
export default function Search({ width = 24, height = 24, color='#6C727F' }: { width?: number, height?: number, color?: string }) {
    return (
        <svg  width={width} height={height} fill="none"><circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" /><path stroke={color} strokeLinecap="round" strokeWidth="2" d="m20 20-3-3" /></svg>
    )
}
