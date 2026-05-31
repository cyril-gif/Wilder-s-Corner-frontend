// lib/ghana-locations.ts
export const regionsWithCities: Record<string, string[]> = {
  "Greater Accra": ["Accra", "Tema", "Adenta", "Madina", "Ashaiman", "Dansoman", "Dzorwulu", "Lapaz", "Achimota", "Osu", "Cantoments"],
  "Ashanti": ["Kumasi", "Obuasi", "Tafo", "Ejisu", "Mampong", "Konongo", "Offinso", "Agogo", "Bekwai", "Nkawie"],
  "Northern": ["Tamale", "Sagnarigu", "Yendi", "Buipe", "Salaga", "Gushegu", "Tolon", "Kumbungu", "Karaga"],
  "Eastern": ["Koforidua", "Nkawkaw", "Suhum", "Akropong", "Aburi", "Nsawam", "Mpraeso", "Donkorkrom", "Asamankese"],
  "Central": ["Cape Coast", "Kasoa", "Winneba", "Elmina", "Twifo Praso", "Assin Fosu", "Apam", "Mankessim", "Saltpond"],
  "Volta": ["Ho", "Hohoe", "Keta", "Denu", "Kpando", "Dzodze", "Akatsi", "Sogakope", "Kpeve", "Aflao"],
  "Western": ["Takoradi", "Sekondi", "Tarkwa", "Agona Nkwanta", "Prestea", "Bibiani", "Enchi", "Wassa Akropong"],
  "Upper East": ["Bolgatanga", "Bawku", "Navrongo", "Paga", "Sandema", "Zuarungu", "Garu", "Binduri", "Tempane"],
  "Upper West": ["Wa", "Jirapa", "Nandom", "Lawra", "Tumu", "Hamile", "Daffiama", "Kaleo", "Gwollu"],
  "Bono": ["Sunyani", "Berekum", "Dormaa Ahenkro", "Nsoatre", "Atebubu", "Techiman", "Wenchi", "Kintampo"],
  "Bono East": ["Techiman", "Kintampo", "Nkoranza", "Atebubu", "Prang", "Jema", "Kwame Danso"],
  "Ahafo": ["Goaso", "Bechem", "Duayaw Nkwanta", "Kenyasi", "Mim", "Hwidiem", "Kukuom"],
  "Oti": ["Dambai", "Jasikan", "Kadjebi", "Kete Krachi", "Nkwanta", "Worawora", "Brewaniase"],
  "North East": ["Nalerigu", "Bunkpurugu", "Gambaga", "Walewale", "Yagaba", "Langbensi", "Chereponi"],
  "Savannah": ["Damango", "Salaga", "Daboya", "Bole", "Buipe", "Sawla", "Kpandai"],
  "Western North": ["Sefwi Wiawso", "Sefwi Asawinso", "Sefwi Boako", "Bibiani", "Nkroful", "Juaboso", "Akontombra"],
};

export const allRegions = Object.keys(regionsWithCities);
