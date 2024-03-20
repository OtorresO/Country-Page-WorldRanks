import { useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Country } from './interfaces/Country'
import { mappingData } from './helpers/Helper';
import Search from './components/icons/Search';
import ExpandDown from './components/icons/ExpandDown';
import DoneRound from './components/icons/DoneRound';
import ArrowLeft from './components/icons/ArrowLeft';
import Spinner from './components/icons/Spinner';
function App() {
  const [countries, setCountries] = useState<Country[]>([])
  const [sort, setSort] = useState('population')
  const [search, setSearch] = useState('')
  const [regions, setRegions] = useState<string[]>([])
  const [independent, setIndependent] = useState<boolean | null>(null)
  const [unMember, setUnMember] = useState<boolean | null>(null)
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0)
  const [countFilterCountry, setCountFilterCountry] = useState(0);
  const [displayCountry, setDisplayCountry] = useState(false);
  const [countriesToDisplay, setCountriesToDisplay] = useState<Country[]>([])
  const [country, setCountry] = useState<Country>({} as Country)
  const [activePage, setActivePage] = useState(0)
  const [fetching, setFetching] = useState(false);
  const ITEMS_PER_PAGE = 10


  const fetchCountries = async () => {
    setFetching(true)
    fetch('https://restcountries.com/v3.1/all?fields=flags,capital,languages,currencies,continents,name,borders,independent,population,cca3,area,region,subregion,unMember')
      .then(res => res.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        let formatData = mappingData(data);
        formatData = formatData.sort((a, b) => b.population - a.population)
        setCountries(formatData);
        setCountFilterCountry(formatData.length)
        const endOffset = itemOffset + ITEMS_PER_PAGE;
        setPageCount(Math.ceil(formatData.length / ITEMS_PER_PAGE))
        setCountriesToDisplay(formatData.slice(itemOffset, endOffset))
        setFetching(false)
      })
      .catch(error => console.log(error))
  }

  const filterCountries = useMemo(() => {
    let newCountries = countries
    const fieldText = search.toLowerCase()
    //Search
    newCountries = newCountries.filter(e => e.name.common.toLocaleLowerCase().includes(fieldText)
      || e.region.toLocaleLowerCase().includes(fieldText)
      || e.subregion.toLocaleLowerCase().includes(fieldText)
    )
    // Independent
    if (independent) {
      newCountries = newCountries.filter(e => e.independent == independent)
    }
    //United States Member
    if (unMember) {
      newCountries = newCountries.filter(e => e.unMember == unMember);

    }


    //Regions
    if (regions.length > 0) { newCountries = newCountries.filter(e => regions.includes(e.region.toLocaleLowerCase())); }

    //Sort
    switch (sort) {
      case 'population':
        newCountries = newCountries.sort((b, a) => a.population - b.population)
        break;
      case 'name':
        newCountries = newCountries.sort((a, b) => b.name.common.localeCompare(a.name.common))
        break;
      case 'area':
        newCountries = newCountries.sort((b, a) => a.area - b.area)
        break;
    }
    
    const newOffset = 0;
    const endOffset = newOffset + ITEMS_PER_PAGE
    setPageCount(Math.ceil(newCountries.length / ITEMS_PER_PAGE))
    setCountFilterCountry(newCountries.length)
    setCountriesToDisplay(newCountries.slice(newOffset, endOffset))
    setItemOffset(newOffset)
    setActivePage(0)
    return newCountries

  }, [search, sort, regions, independent, unMember, countries])


  const toggleRegion = (value: string) => {
    setRegions(prevRegions => {
      if (prevRegions.includes(value)) {
        return prevRegions.filter(e => e != value)
      } else {
        return [...prevRegions, value]
      }
    })
  }

  const handleOnSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLocaleLowerCase())
  }

  const handleOnSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value)
  }

  const onHandleUnMemberChange = (e: boolean) => {
    setUnMember(e)
  }
  const onHandleIndependentCange = (e: boolean) => {
    setIndependent(e)
  }
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * ITEMS_PER_PAGE);
    setActivePage(event.selected)
    setItemOffset(newOffset);
    setCountriesToDisplay(filterCountries.slice(newOffset, newOffset + ITEMS_PER_PAGE));
  }

  const showCountry = (cca3: string) => {
    const country = countries.find(e => e.cca3 === cca3)
    setCountry(country!)
    setDisplayCountry(true);
  }


  useEffect(() => {
    fetchCountries()

  }, [])



  return (
    !displayCountry ? (<div className='lg:mx-7 xl:mx-9  lg:-my-20 border border-[#282B30] bg-[#1B1D1F] rounded-lg py-5 px-6'>

      <header className='flex justify-between items-center '>
        <h1 className='text-base text-[#6C727F] font-semibold'>Found {countFilterCountry} countries</h1>
        <div className='flex bg-[#282B30] rounded-lg gap-2 items-center py-2 px-2 w-[30%]'>
          <Search />
          <input
            type="text"
            placeholder="Search by Name, Region, Subregion"
            aria-label="Search countries"
            className='outline-none bg-[#282B30] text-[#D2D5DA] text-sm w-full h-full'
            onChange={handleOnSearchChange}
          />

        </div>
      </header>

      <main className="grid  grid-rows-1 lg:grid-cols-[250px,1fr] gap-4 mt-6">
        <section className="filters">

          <div className='flex flex-col gap-2 relative mb-6'>
            <label htmlFor="sort-by" className='text-[12px] text-[#6C727F] font-medium font-pro'>Sort By:</label>
            <select id="sort-by" onChange={handleOnSortChange} className='border-2 border-[#282B30] rounded-xl bg-transparent px-4 py-3 text-[#D2D5DA] font-semibold text-xs caret-transparent'>
              <option value="population">Population</option>
              <option value="name">Name</option>
              <option value="area">Area</option>
            </select>
            <ExpandDown classes='absolute top-[55%] left-[97%] lg:left-[90%]' />
          </div>

          <fieldset className='flex flex-col gap-2 mb-6'>
            <div className='text-[12px] text-[#6C727F] font-medium font-pro'>Region</div>
            <div className='flex flex-wrap gap-2'>
              <button onClick={() => toggleRegion('americas')} className={`text-[#6C727F] font-semibold text-sm px-2 py-2 rounded-lg ${regions.includes('americas') ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-transparent'}`}>Americas</button>
              <button onClick={() => toggleRegion('antarctic')} className={`text-[#6C727F] font-semibold text-sm px-2 py-2 rounded-lg ${regions.includes('antarctic') ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-transparent'}`} >Antarctic</button>
              <button onClick={() => toggleRegion('africa')} className={`text-[#6C727F] font-semibold text-sm px-2 py-2 rounded-lg ${regions.includes('africa') ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-transparent'}`}>Africa</button>
              <button onClick={() => toggleRegion('asia')} className={`text-[#6C727F] font-semibold text-sm px-2 py-2 rounded-lg ${regions.includes('asia') ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-transparent'}`}>Asia</button>
              <button onClick={() => toggleRegion('europe')} className={`text-[#6C727F] font-semibold text-sm px-2 py-2 rounded-lg ${regions.includes('europe') ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-transparent'}`}>Europe</button>
              <button onClick={() => toggleRegion('oceania')} className={`text-[#6C727F] font-semibold text-sm px-2 py-2 rounded-lg ${regions.includes('oceania') ? 'bg-[#282B30] text-[#D2D5DA]' : 'bg-transparent'}`}>Oceania</button>
            </div>

          </fieldset>

          <fieldset className='flex flex-col gap-4 mb-6'>
            <div className='text-[12px] text-[#6C727F] font-medium font-pro'>Status</div>
            <div className='flex gap-3 items-center ' onClick={() => onHandleUnMemberChange(!unMember)}>
              <div className={`w-6 h-6  rounded-md ${unMember ? 'bg-[#4E80EE]' : 'bg-transparent border-2 border-[#6C727F]'}`}>
                {
                  unMember && <DoneRound color='#D2D5DA' />
                }
              </div>
              <span className='text-[14px] text-[#D2D5DA] font-medium font-pro'>Member of the United States</span>
            </div>
            <div className='flex gap-3 items-center ' onClick={() => onHandleIndependentCange(!independent)}>
              <div className={`w-6 h-6  rounded-md ${independent ? 'bg-[#4E80EE]' : 'bg-transparent border-2 border-[#6C727F]'}`}>
                {independent && <DoneRound color='#D2D5DA' />}
              </div>
              <span className='text-[14px] text-[#D2D5DA] font-medium font-pro'>Independent</span>
            </div>
          </fieldset>
        </section>

        {
          fetching ?
            (<Spinner />) :
            countriesToDisplay.length > 0 ?
              (<section >

                <table className='w-full'>

                  <thead className='border-b-2 border-[#282B30]'>
                    <tr className='text-xs text-[#6C727F] font-thin ' >
                      <th scope="col" className='py-4 text-start'>Flag</th>
                      <th scope="col" className='py-4 text-start'>Name</th>
                      <th scope="col" className='py-4 text-start'>Population</th>
                      <th scope="col" className='py-4 text-start'>Area (km<sup>2</sup>)</th>
                      <th scope="col" className='py-4 text-start'>Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      countriesToDisplay.map(e => (
                        <tr key={crypto.randomUUID()} onClick={() => showCountry(e.cca3)} className='text-base text-[#D2D5DA] font-semibold cursor-pointer hover:bg-[#282B3047]'>
                          <td className='py-4'><img src={e.flags.svg} alt={e.flags.alt} className='w-14 h-auto  rounded-md' /></td>
                          <td className='py-4'>{e.name.common}</td>
                          <td className='py-4'>{e.population.toLocaleString()}</td>
                          <td className='py-4'>{e.area.toLocaleString()}</td>
                          <td className='py-4'>{e.region}</td>
                        </tr>

                      ))
                    }
                  </tbody>
                </table>
                <div className='float-end'>
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    forcePage={activePage}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    containerClassName='flex gap-4 text-[#6C727F] items-center'
                    activeClassName='bg-[#282B30] text-[#D2D5DA]'
                    pageClassName='text-[#6C727F] font-semibold text-sm  rounded-lg w-8 h-8 '
                    pageLinkClassName='w-full h-full flex items-center justify-center'
                    previousClassName='font-semibold text-sm  rounded-lg '
                    previousLinkClassName='w-full h-full flex items-center justify-center'
                    nextClassName='font-semibold text-sm  rounded-lg'
                    nextLinkClassName=' w-full h-full flex items-center justify-center'

                  />

                </div>
              </section>) :
              (<p className='w-full h-full flex items-center justify-center text-xl text-[#D2D5DA]'>Data not found</p>)


        }




      </main>



    </div >) :
      (<div className='mx-[298px] my-52 border border-[#282B30] bg-[#1B1D1F] rounded-xl'>
        <button className=' bg-transparent text-base text-[#6C727F] hover:text-[#D2D5DA] hover:bg-[#282B30] font-semibold -mt-3 -ml-3 rounded-full' onClick={() => setDisplayCountry(false)}>
          <ArrowLeft />
        </button>
        <div className='flex justify-center items-center -mt-24'>
          <img src={country.flags.svg} alt={country.flags.alt} className='w-60 h-auto rounded-xl' />
        </div>

        <div className='text-center my-6 text-[#D2D5DA] '>
          <h2 className='text-3xl font-semibold'>{country.name.common}</h2>
          <p className='text-base font-semibold'> {country.name.official}</p>
        </div>
        <div className='flex justify-center gap-8  '>
          <div className='bg-[#282B30] rounded-xl px-5 py-4 text-[#D2D5DA] font-medium text-sm flex gap-5'><span>Population</span><span>|</span><span>{country.population.toLocaleString()}</span></div>
          <div className='bg-[#282B30] rounded-xl px-5 py-4 text-[#D2D5DA] font-medium text-sm flex gap-5'><span>Area(km<sup>2</sup>)</span><span>|</span><span>{country.population.toLocaleString()}</span></div>
        </div>

        <table className='w-full mt-6'>
          <tbody className=''>
            <tr className='border-y border-[#282B30]  text-sm  font-semibold'>
              <td className='pl-5  text-[#6C727F] py-5'>Capital</td>
              <td className='pr-5 text-[#D2D5DA] py-5'>{country.capital.length <= 1 ? country.capital.join('') : country.capital.join(',')}</td>
            </tr>
            <tr className='border-b border-[#282B30]  text-sm font-semibold'>
              <td className='pl-5  text-[#6C727F] py-5'>Subregion</td>
              <td className='pr-5 text-[#D2D5DA] py-5'>{country.subregion}</td>
            </tr>
            <tr className='border-b border-[#282B30] text-sm font-semibold'>
              <td className='pl-5 text-[#6C727F] py-5'>Language</td>
              <td className='pr-5 text-[#D2D5DA] py-5'>{country.languages.length <= 1 ? country.languages.join('') : country.languages.join(',')}</td>
            </tr>
            <tr className='border-b border-[#282B30] text-sm font-semibold'>
              <td className='pl-5  text-[#6C727F] py-5'>Currencies</td>
              <td className='pr-5 text-[#D2D5DA] py-5'>{country.currencies.length <= 1 ? country.currencies[0].name : country.languages.reduce((prev, current) => prev + current + ',', '')}</td>
            </tr>
            <tr className='border-b border-[#282B30] text-sm font-semibold'>
              <td className='pl-5  text-[#6C727F] py-5'>Continents</td>
              <td className='pr-5 text-[#D2D5DA] py-5'>{country.continents.length <= 1 ? country.continents.join('') : country.continents.join(',')}</td>
            </tr>

            <tr className='border-b border-[#282B30] text-sm font-semibold'>
              <td className='pl-5  text-[#6C727F] py-5'>
                Neighbouring Contries
                <div className='flex flex-wrap gap-5 mt-6'>
                  {countries.filter(currenCountry => country.borders.includes(currenCountry.cca3)).map(country => (
                    <div onClick={() => showCountry(country.cca3)} className='cursor-pointer'>
                      <img src={country.flags.svg} alt={country.flags.alt} className='w-20 h-auto rounded-md' />
                      <small>{country.name.common}</small>
                    </div>

                  ))}
                </div>
              </td>
            </tr>


          </tbody>
        </table>
      </div>)
  )

}

export default App
