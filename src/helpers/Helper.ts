/* eslint-disable @typescript-eslint/no-explicit-any */
import { Country } from '../interfaces/Country';
export function mappingData(data: any) {
    const newData: Country[] = data.map((e: any) => {
        const { common, official } = e.name
        const { cca3, independent, unMember,
            currencies, capital, region,
            subregion, languages, borders,
            area, flags, population, continents } = e

        return {
            name: {
                common: common,
                official: official
            },
            cca3: cca3,
            independent: independent,
            unMember: unMember,
            capital: capital,
            region: region,
            subregion: subregion,
            area: area,
            flags: flags,
            population: population,
            continents: continents,
            borders: borders,
            currencies: (Object.keys(currencies).map(e => currencies[e])),
            languages: Object.keys(languages)
        } as Country



    })

    return newData;





}