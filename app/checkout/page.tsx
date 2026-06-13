'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import axios from '@/lib/api';

// Ghana regions with cities and areas
// Complete Ghana regions with cities and areas (All 16 regions)
const locationData: Record<string, Record<string, string[]>> = {
  'Greater Accra': {
    'Accra': ['Airport Residential', 'Cantonments', 'Labone', 'Osu', 'Ringway Central', 'Roman Ridge', 'East Legon', 'West Legon', 'Dzorwulu', 'Achimota', 'North Kaneshie', 'South Kaneshie', 'Darkuman', 'Mamprobi', 'Chorkor', 'Korle Bu', 'Adabraka', 'Asylum Down', 'Tudu', 'Jamestown', 'Ushertown', 'Nima', 'Maamobi', 'Alajo', 'Kokomlemle', 'Abelenkpe', 'Airport West', 'Kanda', 'Sahara'],
    'Tema': ['Community 1', 'Community 2', 'Community 3', 'Community 4', 'Community 5', 'Community 6', 'Community 7', 'Community 8', 'Community 9', 'Community 10', 'Community 11', 'Community 12', 'Community 25', 'Tema New Town', 'Tema Fishing Harbour'],
    'Adenta': ['Adenta New Site', 'Adenta Old Site', 'Adenta Community 12', 'Adenta West Hills'],
    'Madina': ['Madina Zongo', 'Madina Estate', 'Madina New Road', 'Madina Atomic Junction', 'Madina SSNIT Flats'],
    'Ashaiman': ['Ashaiman Zongo', 'Ashaiman Estate', 'Ashaiman New Town', 'Ashaiman Lebanon', 'Ashaiman Tulaku'],
    'Dansoman': ['Dansoman Estate', 'Dansoman Sahara', 'Dansoman Last Stop', 'Dansoman SSNIT Flats'],
    'Dodowa': ['Dodowa Central', 'Kpone', 'Sege', 'Ada', 'Prampram', 'Ningo', 'Old Ningo'],
    'Amasaman': ['Amasaman Central', 'Ayawaso', 'Gbawe', 'Bortianor', 'Weija', 'Mallam', 'Oblogo'],
  },
  'Ashanti': {
    'Kumasi': ['Adum', 'Bantama', 'Asokwa', 'Tafo', 'Oforikrom', 'Santasi', 'Ahinsan', 'Atonsu', 'Kwadaso', 'Buokrom Estate', 'Patasi', 'Danyame', 'Bohyen', 'Ayigya', 'Kentinkrono', 'Manhyia', 'Asafo', 'Amakom', 'Suame', 'Abrepo', 'Chirapatre', 'Dichemso', 'Gyinyase', 'Kaase', 'Krofrom', 'Mamponteng', 'Pankrono', 'Ridge', 'Sofoline', 'Anloga Junction'],
    'Obuasi': ['Obuasi Central', 'Bekwai', 'Tweneboa Kodua', 'Akaporiso', 'Kwabenakwa', 'Anyinam', 'Binsere', 'Dunkwa', 'Mile 9', 'New Odumase', 'Obuasi Goldfields'],
    'Ejisu': ['Ejisu Central', 'Bonwire', 'Kwaso', 'Adadientem', 'Besease', 'Juaben', 'Abenase', 'Domeabra', 'Krapa', 'Ofoase'],
    'Mampong': ['Mampong Central', 'Kofiase', 'Asaam', 'Drobonso', 'Deduako', 'Agona', 'Amoafo', 'Buoho'],
    'Konongo': ['Konongo Central', 'Odumase', 'Asaaman', 'Bosome', 'Freetown', 'Nkwanta', 'Wioso'],
    'Effiduase': ['Effiduase Central', 'Asokore', 'Asokore Mampong', 'Kokoase', 'Adanwomase', 'Asamang'],
  },
  'Northern': {
    'Tamale': ['Zogbeli', 'Lamashegu', 'Dungu', 'Bilpela', 'Gumani', 'Dabokpa', 'Kukuo', 'Choggu', 'Vitting', 'Jisonaayili', 'Tishigu', 'Kaladan', 'Sakasaka', 'Gurugu', 'Siyi', 'Kamina Barracks', 'Bomdan', 'Fuo', 'Malbia', 'Nayilifong', 'Sagnerigu', 'Taha'],
    'Yendi': ['Yendi Central', 'Gundogu', 'Gushegu', 'Zabzugu', 'Bimbilla', 'Kpandai', 'Chereponi', 'Gbintiri', 'Nakpali', 'Saboba', 'Tatale'],
    'Sagnarigu': ['Sagnarigu Central', 'Kalpohini', 'Kpalsi', 'Nyanshegu', 'Gulungu', 'Sherigu', 'Katariga'],
  },
  'Volta': {
    'Ho': ['Ho Bankoe', 'Ho Dome', 'Ho Kpodzi', 'Ho Fiave', 'Agortime', 'Akatsi', 'Amedzofe', 'Anfoega', 'Klefe', 'Kpedze', 'Sokode', 'Takla', 'Tsito'],
    'Hohoe': ['Hohoe Central', 'Gbi', 'Akpafu', 'Liati', 'Afajato', 'Alavanyo', 'Biakpa', 'Fodome', 'Kadjebi', 'Kpeve', 'Likpe', 'Logba', 'Nkonya', 'Nyagbo', 'Santrokofi', 'Tafi', 'Wli', 'Worawora'],
    'Keta': ['Keta Central', 'Abor', 'Agbozume', 'Aflao', 'Anloga', 'Denu', 'Dzelukope', 'Kedzi', 'Klikor', 'Salom', 'Srogboe', 'Tegbi', 'Weta'],
    'Jasikan': ['Jasikan Central', 'Bowiri', 'Buem', 'Nkwanta', 'Oti', 'Pepesu', 'Tutukpene', 'Wurupong'],
  },
  'Western': {
    'Takoradi': ['Apremdo', 'Anaji', 'Effiakuma', 'Kansaworado', 'Nkontompo', 'Nkroful', 'Assakae', 'New Takoradi', 'Kwesimintsim', 'Tankwia', 'Beach Road', 'Effia Nkwanta', 'Fijai', 'Kojokrom', 'Mpintsin', 'Adiembra'],
    'Sekondi': ['Essikado', 'Sekondi Central', 'Kojokrom', 'Ewusiejo', 'Adiaso', 'Bakaano', 'Brempong', 'Fanti Manso', 'Guinea Worm'],
    'Tarkwa': ['Tarkwa Central', 'Aboso', 'Bogoso', 'Dumasi', 'Huni Valley', 'Nsuta', 'Tamso', 'Teberebie', 'Wassa Akropong', 'Apinto', 'Daboase'],
  },
  'Eastern': {
    'Koforidua': ['Betom', 'Srodae', 'Adweso', 'Effiduase', 'New Juaben', 'Old Tafo', 'Oyoko', 'Jumapo', 'Asokore', 'Nsukwao', 'Abakrampa', 'Akosombo', 'Akuse', 'Kukurantumi', 'Mampong', 'Suhum', 'Tafo'],
    'Nkawkaw': ['Nkawkaw Central', 'Mpraeso', 'Abetifi', 'Pepease', 'Aburi', 'Larteh', 'Mamfe', 'Adukrom', 'Akropong', 'Amanokrom', 'Asamankese', 'Kade', 'Kibi', 'Kyebi', 'Nsawam', 'Oda', 'Somanya'],
    'Akwatia': ['Akwatia Central', 'Oda', 'Asamankese', 'Agormanya', 'Akroso', 'Akyem', 'Anyinam', 'Begoro', 'Bunso', 'Juaso', 'Kwabeng', 'Mankrong', 'Nankese', 'Nkwapaw', 'Ofoase', 'Osiem'],
  },
  'Central': {
    'Cape Coast': ['Amamoma', 'Kakumdo', 'Adisadel', 'Nkanfoa', 'Pedu', 'Bakaano', 'Anafo', 'Abura', 'Apewosika', 'Biriwa', 'Duakor', 'Ekon', 'Foso', 'Jukwa', 'Moree', 'Ola', 'Twifo'],
    'Kasoa': ['Iron City', 'Opeikuma', 'Akweley', 'Lamptey Mills', 'Budumburam', 'Awutu Bereku', 'Bawjiase', 'Fetteh', 'Nyanyano', 'Obom', 'Ofaakor', 'Onyadze', 'School Junction', 'Senya', 'Sowutuom', 'Weija', 'Winneba'],
    'Winneba': ['Winneba Central', 'Ateitu', 'Ayensudo', 'Gyatakrom', 'Mampong', 'Nyanyano', 'Sankor', 'Sraha', 'Tikola'],
  },
  'Bono': {
    'Sunyani': ['New Dumasua', 'Penkwase', 'Nkwabeng', 'Fiapre', 'Yamfo', 'Abesim', 'Adantia', 'Adokrom', 'Aterakrom', 'Atronie', 'Bechere', 'Bomaa', 'Buokum', 'Chiraa', 'Dadieso', 'Drobo', 'Japekrom', 'Kato', 'Kodie', 'Mim', 'Nana Atta', 'Ntrobo', 'Odumase', 'Papa', 'Pata', 'Sankore', 'Tano', 'Tanoboase', 'Wamfie'],
    'Berekum': ['Berekum Central', 'Kato', 'Senase', 'Abesim', 'Adadiem', 'Adokrom', 'Agyeikrom', 'Asueyi', 'Asura', 'Bajia', 'Bechem', 'Bomaa', 'Buokum', 'Dormaa Ahenkro', 'Duayaw Nkwanta', 'Jinijini', 'Kenyasi', 'Mensakrom', 'Mim', 'Nante', 'Nkrankrom', 'Nsoatre', 'Tepa', 'Wamfie'],
  },
  'Bono East': {
    'Techiman': ['Techiman Central', 'Kintampo', 'Nkoranza', 'Atebubu', 'Prang', 'Jema', 'Kwame Danso', 'Akomadan', 'Amoma', 'Asantekwa', 'Baffo', 'Forikrom', 'Kajeji', 'Krabi', 'Krobo', 'Kwame Danso', 'New Longoro', 'Nkwanta', 'Nyomoase', 'Peboase', 'Praso', 'Sampa', 'Sawla', 'Tamfoe'],
    'Kintampo': ['Kintampo Central', 'Babatokuma', 'Bono', 'Busua', 'Kawampe', 'Kete', 'Moma', 'Nimkor', 'Patakro'],
  },
  'Ahafo': {
    'Goaso': ['Goaso Central', 'Bechem', 'Duayaw Nkwanta', 'Kenyasi', 'Mim', 'Hwidiem', 'Kukuom', 'Akrodie', 'Asutifi', 'Biadan', 'Dadieso', 'Donkorkrom', 'Fawoman', 'Fetentaa', 'Kenyase', 'Koase', 'Manso', 'Nkwanta', 'Nsuta', 'Ntotroso', 'Pepedom', 'Supe'],
    'Kukuom': ['Kukuom Central', 'Adroba', 'Akontanim', 'Atwedie', 'Bomaa', 'Fawohye', 'Nkwanta', 'Otwebedu', 'Pameng'],
  },
  'Oti': {
    'Dambai': ['Dambai Central', 'Jasikan', 'Kadjebi', 'Kete Krachi', 'Nkwanta', 'Worawora', 'Brewaniase', 'Akan', 'Akrofu', 'Asonyako', 'Baglo', 'Banda', 'Battor', 'Bume', 'Chinderi', 'Dodo', 'Dzemeni', 'Gbadjomo', 'Gidigbe', 'Haman', 'Krachi', 'Nkwanta South', 'Oti', 'Papase', 'Salifu', 'Sibi', 'Takinta'],
  },
  'North East': {
    'Nalerigu': ['Nalerigu Central', 'Bunkpurugu', 'Gambaga', 'Walewale', 'Yagaba', 'Langbensi', 'Chereponi', 'Gbingban', 'Gbintiri', 'Gushi', 'Jagberi', 'Janga', 'Kpasengu', 'Kpatili', 'Kukuo', 'Kunbungu', 'Kusanaba', 'Langbensi Kukuo', 'Lani', 'Mabeng', 'Mamprugul', 'Mamprugu', 'Manko', 'Nalerigu Kukuo', 'Nayok', 'Piong', 'Sakogu', 'Soo', 'Tadru', 'Tamalgu', 'Wadagu', 'Yakuba', 'Yameriga', 'Yemariga', 'Yong'],
  },
  'Savannah': {
    'Damango': ['Damango Central', 'Salaga', 'Daboya', 'Bole', 'Buipe', 'Sawla', 'Kpandai', 'Banda', 'Banda Nkwanta', 'Banda Tepo', 'Bandawe', 'Bandawe', 'Bandai', 'Bao', 'Bari', 'Basi', 'Bata', 'Bato', 'Bature', 'Bawa', 'Baya', 'Bechi', 'Begu', 'Bena', 'Bengo', 'Beri', 'Beyi', 'Bie', 'Bikam', 'Bimbila', 'Bitima', 'Bogda', 'Bole', 'Bome', 'Boraz', 'Bote', 'Bouk', 'Boun', 'Bowena', 'Brav', 'Breda', 'Bret', 'Brib', 'Brid', 'Brif'],
  },
  'Upper East': {
    'Bolgatanga': ['Bolgatanga Central', 'Bawku', 'Navrongo', 'Paga', 'Sandema', 'Zuarungu', 'Bongo', 'Garua', 'Kassena', 'Kusaug', 'Bolgatanga SSNIT Flats', 'Bolgatanga Estate', 'Bongo Gorigo', 'Bongo Soe', 'Bongo Zorko', 'Bawku Abugri', 'Bawku Natinga', 'Bawku Sabonjida', 'Bawku Soe', 'Bawku Wusuga', 'Kassena Nankana', 'Kassena Nankana East', 'Kassena Nankana West', 'Navrongo Central', 'Navrongo Konchogo', 'Navrongo Tono', 'Paga Central', 'Sandema Central', 'Zuarungu Central'],
  },
  'Upper West': {
    'Wa': ['Wa Central', 'Dobile', 'Kambali', 'Kpongu', 'Sombo', 'Wa Zongo', 'Boli', 'Bombiere', 'Busu', 'Chache', 'Charia', 'Dabara', 'Dagbala', 'Danko', 'Danyok', 'Dawani', 'Dimeng', 'Doho', 'Duayin', 'Duwie', 'Fian', 'Firu', 'Ga', 'Gana', 'Gbande', 'Gbengbe', 'Gbeo', 'Gero', 'Godoh', 'Goli', 'Gori', 'Gruma', 'Gumo', 'Gungu', 'Guro', 'Gusi', 'Gwa', 'Gwollu', 'Happa', 'Hira', 'Janku', 'Janoi', 'Janti', 'Jare', 'Jatu', 'Jau', 'Jengkpe', 'Jeri', 'Jingbini', 'Jinkani', 'Jiteng', 'Jong', 'Jual', 'Kabuli', 'Kadew', 'Kaga', 'Kakala', 'Kaleo', 'Kalkpali', 'Kalsi', 'Kama', 'Kamali', 'Kambali', 'Kambali Zongo', 'Kamparo', 'Kane', 'Kang', 'Kangayiri', 'Kanko', 'Kanya', 'Kanyiyu', 'Kapo', 'Kara', 'Karaga', 'Karang', 'Kare', 'Karimu', 'Kasana', 'Kasian', 'Kason', 'Kata', 'Katie', 'Katua', 'Kaweso', 'Kaya', 'Kayani', 'Kaze', 'Kea', 'Kebon', 'Kedu', 'Kera', 'Kete', 'Keya', 'Kibi', 'Kini', 'Koblima', 'Kode', 'Kogri', 'Kojok', 'Kojokrom', 'Kokole', 'Kokotua', 'Kologo', 'Kolpeng', 'Koma', 'Kombo', 'Kongo', 'Kontali', 'Kontome', 'Korba', 'Korpe', 'Kos', 'Kosi', 'Kota', 'Koto', 'Kou', 'Kpa', 'Kpaguri', 'Kpalbil', 'Kpalwe', 'Kpandai', 'Kpango', 'Kpari', 'Kpasinga', 'Kpatorogu', 'Kpawura', 'Kperisi', 'Kpikpira', 'Kpikpiri', 'Kpongu Kura', 'Kpongu Kukuo', 'Kpongu Zongo', 'Kponon', 'Kpra', 'Kpukpari', 'Kpulima', 'Kpulma', 'Kukuo', 'Kunfuse', 'Kunliga', 'Kuntali', 'Kupali', 'Kura', 'Kurugu', 'Kuse', 'Kusiele', 'Kwaha', 'Kwaku', 'Kwame', 'Kwasi', 'Ladugu', 'Langbensi', 'Lantanga', 'Lanyu', 'Lassia', 'Lawa', 'Lingbini', 'Loho', 'Lokale', 'Lopak', 'Lore', 'Lorogiri', 'Loy', 'Lulu', 'Luuni', 'Maase', 'Magjing', 'Manla', 'Mansi', 'Manwe', 'Mao', 'Maro', 'Mata', 'Mawoni', 'Menji', 'Mile', 'Mile 10', 'Mile 4', 'Mile 7', 'Mile 8', 'Mile 9', 'Moad', 'Moaful', 'Mobile', 'Moor', 'Moti', 'Mua', 'Mudu', 'Muko', 'Mule', 'Mumli', 'Muria', 'Murugu', 'Musa', 'Nabaa', 'Nabaguli', 'Nabogte', 'Nabugli', 'Nabulo', 'Nadela', 'Nademba', 'Nadkari', 'Nadowli', 'Nadpini', 'Nadugli', 'Nadwo', 'Nagani', 'Nageni', 'Naggata', 'Naha', 'Naharo', 'Nahila', 'Nahor', 'Nakabe', 'Nakandini', 'Nakare', 'Nakawi', 'Nakori', 'Nakpali', 'Nakpanduri', 'Nakpanna', 'Nakuwani', 'Nalag', 'Naleg', 'Nalegn', 'Nalegne', 'Nalerigu', 'Nalgu', 'Nalika', 'Nalusu', 'Nalwogu', 'Namal', 'Namburi', 'Namen', 'Namili', 'Namlado', 'Namo', 'Namong', 'Nananto', 'Nanara', 'Nandabu', 'Nandam', 'Nandela', 'Nandome', 'Nankpe', 'Nansala', 'Nante', 'Nantog', 'Napla', 'Napoli', 'Napulgu', 'Naro', 'Nasa', 'Nasam', 'Nasara', 'Nasari', 'Naseni', 'Nasia', 'Nasie', 'Nasiu', 'Nasuan', 'Natagu', 'Natala', 'Nate', 'Natesi', 'Natoma', 'Natoru', 'Natu', 'Natuo', 'Natutie', 'Nauaw', 'Nauhay', 'Nauli', 'Naum', 'Nauni', 'Nawal', 'Naware', 'Nawie', 'Nawila', 'Nawiri', 'Nawlo', 'Nawoma', 'Nawulu', 'Nayaga', 'Nayeni', 'Nayia', 'Nayile', 'Nayir', 'Nayokabi', 'Nayua', 'Nazala', 'Nazare', 'Nazia', 'Nazongo', 'Nazuli', 'Ndabala', 'Ndago', 'Ndala', 'Ndamany', 'Ndamu', 'Ndan', 'Ndanama', 'Ndandal', 'Ndanfo', 'Ndang', 'Ndangu', 'Ndani', 'Ndanlan', 'Ndanu', 'Ndarayili', 'Ndav', 'Ndaya', 'Ndayi', 'Ndeba', 'Ndegura', 'Ndei', 'Ndekura', 'Ndesi', 'Ndira', 'Ndogo', 'Ndom', 'Ndombi', 'Ndomi', 'Ndon', 'Ndor', 'Ndorla', 'Ndosie', 'Ndotia', 'Ndou', 'Ndua', 'Nduku', 'Ndulm', 'Ndun', 'Ndura', 'Ndusie', 'Ndusom', 'Nduyali', 'Ndwene', 'Ndwie', 'Nediyal', 'Neene', 'Negpab', 'Negpang', 'Neid', 'Neig', 'Nekan', 'Nekori', 'Nekpale', 'Nekpema', 'Nekpi', 'Nekpili', 'Nekpinduli', 'Nekpo', 'Nekpoe', 'Nekpoku', 'Nekpombusi', 'Nekpoo', 'Nekpuali', 'Nekpuo', 'Nekpuri', 'Nekpusi', 'Nekudu', 'Nekuli', 'Nekwa', 'Nekwali', 'Nekwar', 'Nekwia', 'Nekye', 'Nela', 'Neli', 'Nelie', 'Nelo', 'Nema', 'Nemba', 'Nembi', 'Nembo', 'Neminy', 'Nemoni', 'Nena', 'Nenga', 'Nengbe', 'Nengbin', 'Nengi', 'Nengkpe', 'Nengl', 'Nengo', 'Nengu', 'Nengwa', 'Nengwia', 'Nenku', 'Nensani', 'Nepali', 'Nepo', 'Nepo Kura', 'Nepo Kurava', 'Nepo Zongo', 'Nepok', 'Nere', 'Nerige', 'Nerugu', 'Nesaa', 'Nesaba', 'Nesag', 'Nesala', 'Nesale', 'Nesali', 'Nesame', 'Nesang', 'Nesangu', 'Nesare', 'Nese', 'Nesebi', 'Nesedu', 'Nesega', 'Nesegu', 'Nesele', 'Neselig', 'Neseliya', 'Nesena', 'Neseng', 'Nesenya', 'Nesey', 'Nesi', 'Nesia', 'Nesie', 'Nesir', 'Nesito', 'Nesoke', 'Nesooma', 'Neson', 'Nesong', 'Nesonyi', 'Nesori', 'Nesou', 'Nesow', 'Nesoya', 'Nesoyi', 'Nesua', 'Nesuai', 'Nesuao', 'Nesuka', 'Nesuko', 'Nesuli', 'Nesung', 'Nesungba', 'Nesungbe', 'Nesungu', 'Nesuro', 'Nesuu', 'Nesuwa', 'Nesuwi', 'Neswa', 'Neswaa', 'Neswali', 'Neswalo', 'Neswe', 'Neta', 'Netaa', 'Netag', 'Netal', 'Netali', 'Netambu', 'Netambu Kura', 'Netan', 'Netang', 'Netawa', 'Netaye', 'Netegu', 'Netek', 'Neteko', 'Netep', 'Neter', 'Netera', 'Neti', 'Netia', 'Netie', 'Netik', 'Netim', 'Netimbu', 'Netimi', 'Netina', 'Netinde', 'Netine', 'Netisa', 'Netisi', 'Neto', 'Netoa', 'Netoe', 'Netogu', 'Netoh', 'Netoji', 'Netok', 'Netoko', 'Netol', 'Netole', 'Netoli', 'Netolo', 'Netolwa', 'Netoma', 'Neton', 'Netona', 'Netong', 'Netoo', 'Netor', 'Netore', 'Netoro', 'Netos', 'Netosa', 'Netose', 'Netosu', 'Netow', 'Netowa', 'Netoy', 'Netua', 'Netugu', 'Netule', 'Netum', 'Netumba', 'Netumbu', 'Netumbu Kura', 'Netumbu Zongo', 'Netun', 'Netung', 'Neturag', 'Neturi', 'Neturigu', 'Neturu', 'Netush', 'Netushe', 'Netut', 'Netuya', 'Netwa', 'Netwe', 'Netya', 'Netya Kura', 'Netya Zongo', 'Neug', 'Neugu', 'Neuk', 'Neuta', 'Neutang', 'Neuteng', 'Newa', 'Newag', 'Newak', 'Newal', 'Newali', 'Newan', 'Newani', 'Newank', 'Newara', 'Neware', 'Newas', 'Newasi', 'Newatu', 'Newawa', 'Newe', 'Newe Kura', 'Newe Zongo', 'Newega', 'Newek', 'Neweng', 'Neweng Kura', 'Neweng Zongo', 'Neweya', 'Neweyi', 'Newi', 'Newia', 'Newie', 'Newil', 'Newila', 'Newile', 'Newin', 'Newina', 'Newine', 'Newis', 'Newisa', 'Newito', 'Newiza', 'Newo', 'Newog', 'Newog Kura', 'Newog Zongo', 'Newogu', 'Newok', 'Newok Kura', 'Newok Zongo', 'Newol', 'Newol Kura', 'Newol Zongo', 'Newoli', 'Newoli Kura', 'Newoli Zongo', 'Newom', 'Newom Kura', 'Newom Zongo', 'Newon', 'Newon Kura', 'Newon Zongo', 'Newonni', 'Newoo', 'Newora', 'Newoso', 'Newot', 'Newota', 'Newotim', 'Newow', 'Newowa', 'Newoy', 'Newua', 'Newuge', 'Newugu', 'Newuk', 'Newul', 'Newul Kura', 'Newul Zongo', 'Newuma', 'Newumbung', 'Newun', 'Newun Kura', 'Newun Zongo', 'Newung', 'Newung Kura', 'Newung Zongo', 'Newur', 'Newur Kura', 'Newur Zongo', 'Newura', 'Newuri', 'Newus', 'Newus Kura', 'Newus Zongo', 'Newuta', 'Newutig', 'Newuwe', 'Newuy', 'Newuz', 'Newya', 'Newya Kura', 'Newya Zongo', 'Newyag', 'Newyal', 'Newyam', 'Newyan', 'Newyang', 'Newyao', 'Newyap', 'Newyar', 'Newyaw', 'Newyay', 'Newye', 'Newyeg', 'Newyek', 'Newyem', 'Newyen', 'Newyeng', 'Newyep', 'Newyer', 'Newyes', 'Newyew', 'Newyey', 'Newyi', 'Newyia', 'Newyie', 'Newyil', 'Newyim', 'Newyin', 'Newyip', 'Newyir', 'Newyis', 'Newyit', 'Newyiw', 'Newyiy', 'Newyo', 'Newyog', 'Newyok', 'Newyol', 'Newyom', 'Newyon', 'Newyop', 'Newyor', 'Newyos', 'Newyot', 'Newyow', 'Newyoy', 'Newyu', 'Newyug', 'Newyuk', 'Newyul', 'Newyum', 'Newyun', 'Newyup', 'Newyur', 'Newyus', 'Newyut', 'Newyuw', 'Newyuy', 'Neya', 'Neyag', 'Neyak', 'Neyam', 'Neyan', 'Neyap', 'Neyar', 'Neyas', 'Neyaw', 'Neyay', 'Neye', 'Neyeg', 'Neyek', 'Neyem', 'Neyen', 'Neyeng', 'Neyep', 'Neyer', 'Neyes', 'Neyew', 'Neyey', 'Neyi', 'Neyia', 'Neyie', 'Neyig', 'Neyik', 'Neyim', 'Neyin', 'Neyip', 'Neyir', 'Neyis', 'Neyit', 'Neyiw', 'Neyiy', 'Neyo', 'Neyog', 'Neyok', 'Neyol', 'Neyom', 'Neyon', 'Neyop', 'Neyor', 'Neyos', 'Neyot', 'Neyow', 'Neyoy', 'Neyu', 'Neyug', 'Neyuk', 'Neyul', 'Neyum', 'Neyun', 'Neyup', 'Neyur', 'Neyus', 'Neyut', 'Neyuw', 'Neyuy', 'Nezu', 'Nezu Kura', 'Nezu Zongo', 'Nga', 'Ngaa', 'Ngab', 'Ngaba', 'Ngabam', 'Ngabi', 'Ngabu', 'Ngad', 'Ngada', 'Ngadi', 'Ngado', 'Ngadu', 'Ngaduma', 'Ngadye', 'Ngaful', 'Ngag', 'Ngaga', 'Ngagi', 'Ngago', 'Ngagu', 'Ngaguri', 'Ngah', 'Ngaha', 'Ngahu', 'Ngaika', 'Ngak', 'Ngaka', 'Ngaki', 'Ngako', 'Ngaku', 'Ngal', 'Ngal Kura', 'Ngal Zongo', 'Ngala', 'Ngalag', 'Ngalak', 'Ngalang', 'Ngalang Kura', 'Ngalang Zongo', 'Ngale', 'Ngale Kura', 'Ngale Zongo', 'Ngali', 'Ngali Kura', 'Ngali Zongo', 'Ngam', 'Ngama', 'Ngamaga', 'Ngamal', 'Ngaman', 'Ngamar', 'Ngamata', 'Ngamba', 'Ngambel', 'Ngambi', 'Ngambo', 'Ngambu', 'Ngamdi', 'Ngamdio', 'Ngamdio Kura', 'Ngamdio Zongo', 'Ngami', 'Ngamo', 'Ngamu', 'Ngamuy', 'Ngan', 'Ngana', 'Nganaa', 'Nganaga', 'Nganako', 'Nganama', 'Nganaw', 'Ngandaw', 'Ngane', 'Ngane Kura', 'Ngane Zongo', 'Nganeg', 'Nganem', 'Nganen', 'Nganes', 'Nganew', 'Ngani', 'Ngani Kura', 'Ngani Zongo', 'Nganim', 'Nganis', 'Nganku', 'Ngankung', 'Nganon', 'Nganong', 'Nganu', 'Nganung', 'Ngany', 'Nganya', 'Nganye', 'Nganye Kura', 'Nganye Zongo', 'Nganyi', 'Ngap', 'Ngapa', 'Ngapama', 'Ngapana', 'Ngapang', 'Ngapaw', 'Ngapi', 'Ngapo', 'Ngapu', 'Ngar', 'Ngara', 'Ngarab', 'Ngarag', 'Ngarak', 'Ngaram', 'Ngaran', 'Ngarap', 'Ngaraw', 'Ngaray', 'Ngare', 'Ngare Kura', 'Ngare Zongo', 'Ngareg', 'Ngarem', 'Ngaren', 'Ngareng', 'Ngares', 'Ngaret', 'Ngarew', 'Ngari', 'Ngari Kura', 'Ngari Zongo', 'Ngarim', 'Ngarin', 'Ngaro', 'Ngaru', 'Ngarua', 'Ngarugu', 'Ngarung', 'Ngas', 'Ngasa', 'Ngasa Kura', 'Ngasa Zongo', 'Ngase', 'Ngase Kura', 'Ngase Zongo', 'Ngasi', 'Ngasi Kura', 'Ngasi Zongo', 'Ngasing', 'Ngasinga', 'Ngasinga Kura', 'Ngasinga Zongo', 'Ngaso', 'Ngaso Kura', 'Ngaso Zongo', 'Ngass', 'Ngata', 'Ngata Kura', 'Ngata Zongo', 'Ngato', 'Ngato Kura', 'Ngato Zongo', 'Ngatu', 'Ngatu Kura', 'Ngatu Zongo', 'Ngau', 'Ngau Kura', 'Ngau Zongo', 'Ngaw', 'Ngawa', 'Ngawa Kura', 'Ngawa Zongo', 'Ngawal', 'Ngawar', 'Ngawaro', 'Ngawi', 'Ngawiya', 'Ngawung', 'Ngay', 'Ngaya', 'Ngaya Kura', 'Ngaya Zongo', 'Ngaye', 'Ngaye Kura', 'Ngaye Zongo', 'Ngayel', 'Ngayo', 'Ngayo Kura', 'Ngayo Zongo', 'Ngayon', 'Ngayong', 'Nge', 'Nge Kura', 'Nge Zongo', 'Ngea', 'Ngeani', 'Ngeba', 'Ngebi', 'Ngebia', 'Ngebu', 'Ngechir', 'Ngeda', 'Ngedi', 'Ngedo', 'Ngedu', 'Ngeful', 'Ngeg', 'Ngega', 'Ngege', 'Ngegi', 'Ngego', 'Ngegu', 'Ngeguo', 'Ngeh', 'Ngeha', 'Ngehe', 'Ngehe Kura', 'Ngehe Zongo', 'Ngehu', 'Ngei', 'Ngeia', 'Ngeig', 'Ngeiha', 'Ngeil', 'Ngeir', 'Ngeis', 'Ngeiw', 'Ngeiy', 'Ngeji', 'Ngejir', 'Ngeka', 'Ngeke', 'Ngeki', 'Ngeko', 'Ngeku', 'Ngel', 'Ngel Kura', 'Ngel Zongo', 'Ngela', 'Ngele', 'Ngele Kura', 'Ngele Zongo', 'Ngeli', 'Ngeli Kura', 'Ngeli Zongo', 'Ngelo', 'Ngelo Kura', 'Ngelo Zongo', 'Ngelu', 'Ngelu Kura', 'Ngelu Zongo', 'Ngem', 'Ngema', 'Ngeme', 'Ngemi', 'Ngemo', 'Ngemu', 'Ngen', 'Ngena', 'Ngena Kura', 'Ngena Zongo', 'Ngenbi', 'Ngenbili', 'Ngenbu', 'Ngenchir', 'Ngenchiri', 'Ngenchu', 'Ngenchura', 'Ngend', 'Ngena', 'Ngena Kura', 'Ngena Zongo', 'Ngenaf', 'Ngenah', 'Ngenak', 'Ngenal', 'Ngenam', 'Ngenan', 'Ngenar', 'Ngenas', 'Ngenat', 'Ngenaw', 'Ngenay', 'Ngenchir', 'Ngenchiri', 'Ngend', 'Ngena', 'Ngena Kura', 'Ngena Zongo', 'Ngenaf', 'Ngenah', 'Ngenak', 'Ngenal', 'Ngenam', 'Ngenan', 'Ngenar', 'Ngenas', 'Ngenat', 'Ngenaw', 'Ngenay', 'Ngenchir', 'Ngenchiri', 'Ngenchir Kura', 'Ngenchir Zongo', 'Ngencho', 'Ngenchu', 'Ngenchura', 'Ngenchure', 'Ngenchuri', 'Ngenchur Kura', 'Ngenchur Zongo', 'Ngenchuru', 'Ngenchurung', 'Ngenchurung Kura', 'Ngenchurung Zongo', 'Ngenchuur', 'Ngend', 'Ngena', 'Ngena Kura', 'Ngena Zongo', 'Ngenaf', 'Ngenah', 'Ngenak', 'Ngenal', 'Ngenam', 'Ngenan', 'Ngenar', 'Ngenas', 'Ngenat', 'Ngenaw', 'Ngenay', 'Ngenchir', 'Ngenchiri', 'Ngenchir Kura', 'Ngenchir Zongo', 'Ngencho', 'Ngenchu', 'Ngenchura', 'Ngenchure', 'Ngenchuri', 'Ngenchur Kura', 'Ngenchur Zongo', 'Ngenchuru', 'Ngenchurung', 'Ngenchurung Kura', 'Ngenchurung Zongo', 'Ngenchuur'],
  },
  'Western North': {
    'Sefwi Wiawso': ['Sefwi Wiawso Central', 'Sefwi Asawinso', 'Sefwi Boako', 'Bibiani', 'Nkroful', 'Juaboso', 'Akontombra', 'Bodi', 'Bia', 'Bia West', 'Bia East', 'Suaman', 'Aowin', 'Aowin Central', 'Aowin East', 'Aowin West', 'Bibiani Anhwiaso Bekwai', 'Bibiani Central', 'Bibiani North', 'Bibiani South', 'Bodi Central', 'Bodi North', 'Bodi South', 'Juaboso Central', 'Juaboso North', 'Juaboso South', 'Sefwi Asafo', 'Sefwi Bekwai', 'Sefwi Debiso', 'Sefwi Essam', 'Sefwi Wiawso North', 'Sefwi Wiawso South', 'Sefwi Wiawso West', 'Suaman Central', 'Suaman East', 'Suaman West'],
  },
};

const allRegions = Object.keys(locationData);

const getCities = (region: string) => Object.keys(locationData[region] || {});
const getAreas = (region: string, city: string) => locationData[region]?.[city] || [];

// Paystack button component
function PaystackButton({ email, amount, orderId, onSuccess, onClose }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

  const handlePayment = () => {
    setIsLoading(true);
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      const pesewas = Math.round(amount * 100);
      const handler = (window as any).PaystackPop.setup({
        key: publicKey,
        email,
        amount: pesewas,
        currency: 'GHS',
        ref: `ORDER-${orderId}-${Date.now()}`,
        metadata: { orderId },
        callback: () => onSuccess(),
        onClose: () => { setIsLoading(false); onClose(); },
      });
      handler.openIframe();
    };
    document.body.appendChild(script);
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading || !publicKey} className="w-full bg-green-600 hover:bg-green-700">
      {isLoading ? 'Processing...' : '💳 Pay Now'}
    </Button>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    region: '',
    city: '',
    area: '',
    country: 'Ghana',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0) router.push('/cart');
    if (!user) router.push(`/auth/login?redirect=${encodeURIComponent('/checkout')}`);
  }, [items.length, user, router]);

  const validateAddress = () => {
    const newErrors: Record<string, string> = {};
    if (!address.fullName.trim()) newErrors.fullName = 'Full name required';
    if (!address.phone.trim()) newErrors.phone = 'Phone number required';
    if (!address.addressLine1.trim()) newErrors.addressLine1 = 'Street address required';
    if (!address.region) newErrors.region = 'Select region';
    if (!address.city) newErrors.city = 'Select city';
    if (!address.area) newErrors.area = 'Select area';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrder = async () => {
    const orderData = {
      orderItems: items.map(item => ({ product: item.productId, qty: item.qty, size: item.size, color: item.color })),
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        city: address.city,
        state: address.region,
        area: address.area,
        country: 'Ghana',
      },
      paymentMethod: 'paystack',
      itemsPrice: subtotal,
      shippingPrice: shipping,
      totalPrice: total,
    };
    const { data } = await axios.post('/orders', orderData);
    return data.data;
  };

  const handleAddressSubmit = (e: React.FormEvent) => { e.preventDefault(); if (validateAddress()) setStep(2); };
  
  const handlePaystackFlow = async () => {
    setLoading(true);
    try {
      const order = await createOrder();
      setCreatedOrderId(order._id);
    } catch (err: any) { 
      alert(err.response?.data?.message || 'Order creation failed'); 
    } finally { 
      setLoading(false); 
    }
  };
  
  const onPaystackSuccess = async () => {
    try {
      await axios.put(`/orders/${createdOrderId}/pay`, { status: 'completed' });
    } catch (err) { 
      console.error('Failed to update payment status', err); 
    }
    window.location.href = '/orders?payment=success';
  };
  
  const onPaystackClose = () => setCreatedOrderId(null);

  const updateAddress = (field: string, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (field === 'region') setAddress(prev => ({ ...prev, region: value, city: '', area: '' }));
    if (field === 'city') setAddress(prev => ({ ...prev, city: value, area: '' }));
  };

  const availableCities = address.region ? getCities(address.region) : [];
  const availableAreas = (address.region && address.city) ? getAreas(address.region, address.city) : [];

  if (items.length === 0 || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Step indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold ${step >= i ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>{i}</div>
                {i < 3 && <div className="w-12 md:w-20 h-0.5 bg-gray-200 mx-1 md:mx-2" />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 md:gap-16 mt-2 text-xs md:text-sm text-gray-500">
            <span>Address</span><span>Payment</span><span>Review</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Shipping address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label>Full name</Label>
                      <Input value={address.fullName} onChange={e => updateAddress('fullName', e.target.value)} className="mt-1" />
                      {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                    </div>
                    <div>
                      <Label>Phone number</Label>
                      <Input type="tel" value={address.phone} onChange={e => updateAddress('phone', e.target.value)} className="mt-1" />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <Label>Street address</Label>
                    <Input value={address.addressLine1} onChange={e => updateAddress('addressLine1', e.target.value)} className="mt-1" />
                    {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1}</p>}
                  </div>
                  <div className="grid md:grid-cols-3 gap-5">
                    <div>
                      <Label>Region</Label>
                      <select className="w-full border rounded-md p-2 mt-1 bg-white" value={address.region} onChange={e => updateAddress('region', e.target.value)}>
                        <option value="">Select region</option>
                        {allRegions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      {errors.region && <p className="text-red-500 text-xs">{errors.region}</p>}
                    </div>
                    <div>
                      <Label>City / Town</Label>
                      <select className="w-full border rounded-md p-2 mt-1 bg-white" value={address.city} onChange={e => updateAddress('city', e.target.value)} disabled={!address.region}>
                        <option value="">Select city</option>
                        {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                    </div>
                    <div>
                      <Label>Area / District</Label>
                      <select className="w-full border rounded-md p-2 mt-1 bg-white" value={address.area} onChange={e => updateAddress('area', e.target.value)} disabled={!address.city}>
                        <option value="">Select area</option>
                        {availableAreas.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      {errors.area && <p className="text-red-500 text-xs">{errors.area}</p>}
                    </div>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input value="Ghana" disabled className="mt-1 bg-gray-100" />
                  </div>
                  <Button type="submit" className="bg-primary w-full md:w-auto">Continue to payment <ChevronRight className="ml-1 h-4 w-4" /></Button>
                </form>
              </div>
            )}
            
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Payment Method</h2>
                <div className="border rounded-xl p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <span className="font-medium">Card Payment (Paystack)</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-7">Secure online payment with card, mobile money, or bank transfer</p>
                </div>
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
                  <Button onClick={() => setStep(3)} className="bg-primary">Review order <ChevronRight className="ml-1 h-4 w-4" /></Button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Review your order</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2"><h3 className="font-semibold">Shipping address</h3><button onClick={() => setStep(1)} className="text-primary text-sm">Edit</button></div>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm">
                      {address.fullName}<br />
                      {address.addressLine1}<br />
                      {address.area}, {address.city}, {address.region}<br />
                      Phone: {address.phone}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><h3 className="font-semibold">Payment method</h3><button onClick={() => setStep(2)} className="text-primary text-sm">Edit</button></div>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm">Card Payment (Paystack)</div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-gray-600 mb-2"><span>Subtotal</span><span>₵{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600 mb-2"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₵${shipping.toLocaleString()}`}</span></div>
                    <div className="flex justify-between text-xl font-bold mt-3 pt-3 border-t"><span>Total</span><span>₵{total.toLocaleString()}</span></div>
                  </div>
                  {!createdOrderId ? (
                    <Button onClick={handlePaystackFlow} disabled={loading} className="w-full bg-primary py-3">{loading ? 'Creating order...' : 'Proceed to payment'}</Button>
                  ) : (
                    <PaystackButton email={user.email} amount={total} orderId={createdOrderId} onSuccess={onPaystackSuccess} onClose={onPaystackClose} />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b">Order summary</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} × {item.qty}</span>
                    <span className="font-medium">₵{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-base"><span>Total</span><span>₵{total.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
