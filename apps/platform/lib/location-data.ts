import { configure } from "@countrystatecity/countries-browser"

configure({ baseURL: "" })

export {
  getCitiesOfState,
  getCountries,
  getCountryTimezones,
  getStatesOfCountry,
} from "@countrystatecity/countries-browser"
export type { ICity, ICountry, IState } from "@countrystatecity/countries-browser"
