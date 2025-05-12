// Importeer de FontAwesome bibliotheek en iconen
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faHouse,
  faUser,
  faCalendarDays,
  faPooStorm,
  faListCheck,
  faLanguage,
  faRightFromBracket,
  faPenToSquare,
  faFloppyDisk,
  faCoffee,
  faCar,
  faDog,
  faBicycle,
  faHome,
  faTree,
  faSun,
  faMoon,
  faRocket,
} from '@fortawesome/free-solid-svg-icons'

// Voeg iconen toe aan de FontAwesome bibliotheek
library.add(
  faHouse,
  faUser,
  faCalendarDays,
  faPooStorm,
  faListCheck,
  faLanguage,
  faRightFromBracket,
  faPenToSquare,
  faFloppyDisk,
  faCoffee,
  faCar,
  faDog,
  faBicycle,
  faHome,
  faTree,
  faSun,
  faMoon,
  faRocket
)

// Optioneel: Exporteer de iconenlijst voor hergebruik in andere delen van de app
export const iconList = [
  faHouse,
  faUser,
  faCalendarDays,
  faPooStorm,
  faListCheck,
  faLanguage,
  faRightFromBracket,
  faPenToSquare,
  faFloppyDisk,
  faCoffee,
  faCar,
  faDog,
  faBicycle,
  faHome,
  faTree,
  faSun,
  faMoon,
  faRocket,
]

// Exporteer de bibliotheek (optioneel, voor testen of debugging)
export { library }
