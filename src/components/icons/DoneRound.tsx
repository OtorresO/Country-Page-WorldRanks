
export default function DoneRound({width=24,height=24,color='#6C727F'}:{width?:number,height?:number,color?:string}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none"><path stroke={color} stroke-linecap="round" stroke-width="2" d="m5 14 3.233 2.425a1 1 0 0 0 1.374-.167L18 6" /></svg>
    )
}
