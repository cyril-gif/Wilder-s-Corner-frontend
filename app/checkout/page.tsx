'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import axios from '@/lib/api';

// Ghana regions with cities and areas
// Complete Ghana regions with cities and areas
const locationData: Record<string, Record<string, string[]>> = {
  'Greater Accra': {
    'Accra': ['Airport Residential', 'Cantonments', 'Labone', 'Osu', 'Ringway Central', 'Roman Ridge', 'East Legon', 'West Legon', 'Dzorwulu', 'Achimota', 'North Kaneshie', 'South Kaneshie', 'Darkuman', 'Mamprobi', 'Chorkor', 'Korle Bu', 'Adabraka', 'Asylum Down', 'Tudu', 'Jamestown', 'Ushertown', 'Christiansborg', 'Nima', 'Maamobi', 'Alajo', 'Kokomlemle', 'Abelenkpe', 'Airport West'],
    'Tema': ['Community 1', 'Community 2', 'Community 3', 'Community 4', 'Community 5', 'Community 6', 'Community 7', 'Community 8', 'Community 9', 'Community 10', 'Community 11', 'Community 12', 'Community 25', 'Tema New Town', 'Tema Fishing Harbour'],
    'Adenta': ['Adenta New Site', 'Adenta Old Site', 'Adenta Community 12', 'Adenta West Hills', 'Brewery'],
    'Madina': ['Madina Zongo', 'Madina Estate', 'Madina New Road', 'Madina Atomic Junction', 'Madina SSNIT Flats', 'Madina Council'],
    'Ashaiman': ['Ashaiman Zongo', 'Ashaiman Estate', 'Ashaiman New Town', 'Ashaiman Lebanon', 'Ashaiman Tulaku', 'Ashaiman Makola', 'Ashaiman Main Market'],
    'Dansoman': ['Dansoman Estate', 'Dansoman Sahara', 'Dansoman Last Stop', 'Dansoman SSNIT Flats', 'Dansoman Junction'],
    'Dodowa': ['Dodowa Central', 'Kpone', 'Sege', 'Ada', 'Prampram', 'Ningo', 'Old Ningo'],
    'Amasaman': ['Amasaman Central', 'Ayawaso', 'Gbawe', 'Bortianor', 'Weija', 'Mallam', 'Oblogo'],
  },
  'Ashanti': {
    'Kumasi': ['Adum', 'Bantama', 'Asokwa', 'Tafo', 'Oforikrom', 'Santasi', 'Ahinsan', 'Atonsu', 'Kwadaso', 'Buokrom Estate', 'Patasi', 'Danyame', 'Bohyen', 'Ayigya', 'Kentinkrono', 'Manhyia', 'Asafo', 'Amakom', 'Suame', 'Bompata', 'Abuakwa', 'Asem', 'Nhyiaeso', 'Moshie Zongo', 'Abrepo', 'Abrepo Junction', 'Bekwai Roundabout', 'Anloga Junction', 'Atonsu-Agogo', 'Chirapatre', 'Danyame-Barracks', 'Dichemso', 'Emesuo', 'Fumesua', 'Gyinyase', 'Kaase', 'Krofrom', 'Kwadaso Estate', 'Mamponteng', 'Oduom', 'Pankrono', 'Ridge', 'Sofoline'],
    'Obuasi': ['Obuasi Central', 'Bekwai', 'Tweneboa Kodua', 'Akaporiso', 'Kwabenakwa', 'Anyinam', 'Binsere', 'Dunkwa', 'Mile 9', 'New Odumase', 'Obuasi Goldfields', 'Tarkwa Breman'],
    'Ejisu': ['Ejisu Central', 'Bonwire', 'Kwaso', 'Adadientem', 'Besease', 'Juaben', 'Abenase', 'Domeabra', 'Ejuraman', 'Krapa', 'Nkwanta', 'Ofoase'],
    'Mampong': ['Mampong Central', 'Kofiase', 'Asaam', 'Drobonso', 'Deduako', 'Agona', 'Amoafo', 'Aponapon', 'Asaaman', 'Asaamang', 'Asante Akyem', 'Beposo', 'Bodomase', 'Buoho'],
    'Konongo': ['Konongo Central', 'Odumase', 'Asaaman', 'Bosome', 'Freetown', 'Nkwanta', 'Wioso', 'Anyinofi'],
    'Effiduase': ['Effiduase Central', 'Asokore', 'Asokore Mampong', 'Kokoase', 'Adanwomase', 'Ahensan', 'Asamang', 'Asante Bekwai'],
  },
  'Northern': {
    'Tamale': ['Zogbeli', 'Lamashegu', 'Dungu', 'Bilpela', 'Gumani', 'Dabokpa', 'Kukuo', 'Choggu', 'Vitting', 'Jisonaayili', 'Tishigu', 'Kaladan', 'Sakasaka', 'Gurugu', 'Siyi', 'Kamina Barracks', 'Lamashegu Zongo', 'Bomdan', 'Fuo', 'Kamina', 'Kukuo Zongo', 'Malbia', 'Nayilifong', 'Sagnerigu', 'Tisigu', 'Tugu-Yepala', 'Victory Road', 'Taha'],
    'Yendi': ['Yendi Central', 'Gundogu', 'Gushegu', 'Zabzugu', 'Bimbilla', 'Kpandai', 'Salaga', 'Chereponi', 'Gbintiri', 'Jagberi', 'Nakpali', 'Nayoko', 'Nyensung', 'Piong', 'Saboba', 'Tatale', 'Wapuli', 'Zangbalun'],
    'Sagnarigu': ['Sagnarigu Central', 'Kalpohini', 'Kpalsi', 'Nyanshegu', 'Gulungu', 'Jisonanyili', 'Sherigu', 'Tiyumba', 'Katariga', 'Kurugu'],
  },
  'Volta': {
    'Ho': ['Ho Bankoe', 'Ho Dome', 'Ho Kpodzi', 'Ho Fiave', 'Agortime', 'Akatsi', 'Amedzofe', 'Anfoega', 'Awudome', 'Bame', 'Gbi', 'Hohoe', 'Klefe', 'Kpedze', 'Kpele', 'Kpeme', 'Mataheko', 'Sokode', 'Takla', 'Tsito', 'Vane'],
    'Hohoe': ['Hohoe Central', 'Gbi', 'Akpafu', 'Liati', 'Afajato', 'Alavanyo', 'Bame', 'Biakpa', 'Fodome', 'Have', 'Kadjebi', 'Kpasa', 'Kpeve', 'Likpe', 'Logba', 'Nkonya', 'Nyagbo', 'Santrokofi', 'Tafi', 'Wli', 'Wodome', 'Worawora'],
    'Keta': ['Keta Central', 'Abor', 'Afife', 'Agbozume', 'Aflao', 'Agblekpui', 'Anloga', 'Atiavi', 'Denu', 'Dzelukope', 'Fiadame', 'Gbefi', 'Horvi', 'Kedzi', 'Klikor', 'Kpone', 'Mataheko', 'Penyi', 'Salom', 'Seva', 'Srogboe', 'Tegbi', 'Toko', 'Vui', 'Weta'],
    'Jasikan': ['Jasikan Central', 'Bowiri', 'Buem', 'Kadjebi', 'Nkwanta', 'Oti', 'Pepesu', 'Tutukpene', 'Ve Koloenu', 'Worawora', 'Wurupong'],
  },
  'Western': {
    'Takoradi': ['Apremdo', 'Anaji', 'Effiakuma', 'Kansaworado', 'Nkontompo', 'Nkroful', 'Assakae', 'New Takoradi', 'Kwesimintsim', 'Tankwia', 'Beach Road', 'Effia Nkwanta', 'Fijai', 'Kojokrom', 'Mpintsin', 'Nkotompo', 'Sekondi', 'Adiembra', 'Amesima', 'Anaji Estate', 'Asem'],
    'Sekondi': ['Essikado', 'Sekondi Central', 'Kojokrom', 'Ewusiejo', 'Adiaso', 'Adiembra', 'Ahenboboano', 'Akodzo', 'Annieville', 'Bakaano', 'Bewyerba', 'Brawire', 'Brempong', 'Brinja', 'Churchil', 'Ekusie', 'Essia', 'Fanti Manso', 'Fijai', 'Guinea Worm'],
    'Tarkwa': ['Tarkwa Central', 'Aboso', 'Bogoso', 'Dumasi', 'Huni Valley', 'Nkonya', 'Nsuta', 'Tamso', 'Teberebie', 'Wassa Akropong', 'Apinto', 'Aklika', 'Amanful', 'Boku', 'Daboase', 'Abuoso'],
  },
  'Eastern': {
    'Koforidua': ['Betom', 'Srodae', 'Adweso', 'Effiduase', 'New Juaben', 'Old Tafo', 'Oyoko', 'Jumapo', 'Asokore', 'Nsukwao', 'Abakrampa', 'Akosombo', 'Akuse', 'Asesease', 'Asuboi', 'Akwadum', 'Bunso', 'Kukurantumi', 'Mampong', 'Maase', 'Nkurakan', 'Nkwatia', 'Obawale', 'Suhum', 'Tafo', 'Zongo'],
    'Nkawkaw': ['Nkawkaw Central', 'Mpraeso', 'Abetifi', 'Pepease', 'Aburi', 'Larteh', 'Mamfe', 'Adukrom', 'Akropong', 'Amanokrom', 'Apirede', 'Asamankese', 'Asesewa', 'Ayensuano', 'Dome', 'Kade', 'Kibi', 'Koforidua', 'Kyebi', 'Mangoase', 'Nsawam', 'Nsuapemso', 'Oda', 'Oduponkpehe', 'Pokuase', 'Somanya', 'Suhum', 'Tafo'],
    'Akwatia': ['Akwatia Central', 'Oda', 'Asamankese', 'Aburi', 'Agormanya', 'Akroso', 'Akyem', 'Anyinam', 'Apoli', 'Asafo', 'Asamankese', 'Asuboi', 'Atewa', 'Atti', 'Awisa', 'Begoro', 'Bunso', 'Dome', 'Juaso', 'Kade', 'Kwabeng', 'Mame', 'Mankrong', 'Nankese', 'Nkwapaw', 'Nkwaten', 'Ofoase', 'Osiem', 'Pakro', 'Pameng', 'Pankrono', 'Suhum', 'Yilo Krobo'],
  },
  'Central': {
    'Cape Coast': ['Amamoma', 'Kakumdo', 'Adisadel', 'Nkanfoa', 'Pedu', 'Bakaano', 'Anafo', 'Anaafo', 'Abura', 'Apewosika', 'Ayensu', 'Biriwa', 'Duakor', 'Ekon', 'Esikyir', 'Foso', 'Jukwa', 'Kakum', 'Kokodo', 'Kwapro', 'Mankesim', 'Moree', 'Nakwa', 'Nsusua', 'Ola', 'Okyere', 'Otuam', 'Sasun', 'Siwdo', 'Sofos', 'Srafa', 'Tandoro', 'Twifo'],
    'Kasoa': ['Iron City', 'Opeikuma', 'Akweley', 'Lamptey Mills', 'Budumburam', 'Awutu Bereku', 'Awutu Senya', 'Bawjiase', 'Chinto', 'Dampase', 'Fetteh', 'Gomoa', 'Gyamfi', 'Kakraba', 'Kokrobite', 'Nduom', 'Nyanyano', 'Obom', 'Ofaakor', 'Ohwim', 'Onyadze', 'Papase', 'School Junction', 'Senya', 'Sowutuom', 'Weija', 'Winneba'],
    'Winneba': ['Winneba Central', 'Ateitu', 'Atimu', 'Ayensudo', 'Gyatakrom', 'Hasi', 'Issakrom', 'Jukwa', 'Kojo Bedu', 'Mampong', 'Nyanyano', 'Sankor', 'Sasabi', 'Soccer', 'Sraha', 'Tete', 'Tikola', 'Yakum'],
  },
  'Bono': {
    'Sunyani': ['New Dumasua', 'Penkwase', 'Nkwabeng', 'Fiapre', 'Yamfo', 'Abesim', 'Adantia', 'Adjoafua', 'Adokrom', 'Akrobi', 'Asufui', 'Aterakrom', 'Atronie', 'Awuom', 'Bechere', 'Benin', 'Benkasa', 'Bomaa', 'Buokum', 'Chiraa', 'Dadieso', 'Drobo', 'Japekrom', 'Kato', 'Kodie', 'Kwasi Bu', 'Mim', 'Nana Atta', 'Ntrobo', 'Odumase', 'Oforikrom', 'Papa', 'Pata', 'Pepedom', 'Sankore', 'Sinnadai', 'Tabora', 'Tain', 'Tano', 'Tanoboase', 'Tepa', 'Tisikasi', 'Wamfie', 'Wareto', 'Yamfo', 'Yaw Tufu'],
    'Berekum': ['Berekum Central', 'Kato', 'Senase', 'Abesim', 'Adadiem', 'Adokrom', 'Adunafua', 'Agyeikrom', 'Akunkrom', 'Anana', 'Asueyi', 'Asura', 'Aterakrom', 'Bajia', 'Bechem', 'Bomaa', 'Buokum', 'Dormaa', 'Dormaa Ahenkro', 'Drobo', 'Duayaw Nkwanta', 'Japekrom', 'Jinijini', 'Kato', 'Kato Krom', 'Kenyasi', 'Mensakrom', 'Mim', 'Nante', 'Nkrankrom', 'Nkronua', 'Nkwanta', 'Nsoatre', 'Odumase', 'Papa', 'Sankore', 'Sinnadai', 'Tain', 'Tano', 'Tanoboase', 'Tepa', 'Tisikasi', 'Wamfie'],
  },
  'Bono East': {
    'Techiman': ['Techiman Central', 'Kintampo', 'Nkoranza', 'Atebubu', 'Prang', 'Jema', 'Kwame Danso', 'Akomadan', 'Amoma', 'Asantekwa', 'Baffo', 'Bah', 'Boankra', 'Bono', 'Bonso', 'Bontuku', 'Branam', 'Bredi', 'Buoku', 'Busua', 'Forikrom', 'Jama', 'Kajeji', 'Kawampe', 'Kenten', 'Kera', 'Kete', 'Krabi', 'Kranso', 'Krobo', 'Kwaku', 'Kwame', 'Kwame Danso', 'Kwasi', 'Lombardo', 'Maase', 'Manso', 'Mim', 'Moma', 'Nago', 'New Longoro', 'Nimkor', 'Nkwanta', 'Nkwanta South', 'Nnwu', 'Nsoatre', 'Nyomoase', 'Oforikrom', 'Patakro', 'Peboase', 'Pepasah', 'Praso', 'Saboa', 'Sampa', 'Sankore', 'Sawla', 'Sunyani', 'Tamfoe', 'Tano'],
  },
  'Ahafo': {
    'Goaso': ['Goaso Central', 'Bechem', 'Duayaw Nkwanta', 'Kenyasi', 'Mim', 'Hwidiem', 'Kukuom', 'Akrodie', 'Asutifi', 'Biadan', 'Bono', 'Buoku', 'Dadieso', 'Dama', 'Donkorkrom', 'Fawoman', 'Fetentaa', 'Gambia', 'Kaserem', 'Kenyase', 'Koase', 'Koforidua', 'Kukuom', 'Kwadwo', 'Kwaku', 'Kwasi', 'Mamfe', 'Manso', 'Mim', 'Nana', 'Nante', 'Nkrankrom', 'Nkwanta', 'Nsuta', 'Ntotroso', 'Ntotoroso', 'Papa', 'Pata', 'Pebaa', 'Pepedom', 'Sankore', 'Sinnadai', 'Supe', 'Tain', 'Tano', 'Tanoboase', 'Tepa', 'Tisikasi', 'Wamfie', 'Wareto', 'Yamfo', 'Yaw', 'Yaw Tufu'],
  },
  'Oti': {
    'Dambai': ['Dambai Central', 'Jasikan', 'Kadjebi', 'Kete Krachi', 'Nkwanta', 'Worawora', 'Brewaniase', 'Alavanyo', 'Akan', 'Akrofu', 'Amedzope', 'Ameti', 'Apewu', 'Asabla', 'Asato', 'Asibi', 'Asonyako', 'Ayibonte', 'Badi', 'Baglo', 'Baii', 'Banda', 'Battor', 'Bawe', 'Beye', 'Bibiana', 'Bikoe', 'Bishi', 'Bonya', 'Boso', 'Botoku', 'Bowiri', 'Buafi', 'Bume', 'Challa', 'Chamle', 'Chinderi', 'Dambai', 'Damja', 'Dodo', 'Dofor', 'Dorma', 'Doyon', 'Dzemeni', 'Dzroke', 'Gbadjomo', 'Gbagba', 'Gbemini', 'Gbite', 'Georn', 'Gida', 'Gidigbe', 'Ginatso', 'Goke', 'Gona', 'Gosung', 'Grange', 'Gwei', 'Haho', 'Hakob', 'Haman', 'Hamoni', 'Harness', 'Hatasu', 'Hawah', 'Hembe', 'Hina', 'Hlodzo', 'Hodawu', 'Hohoe', 'Honuta', 'Horm'],
  },
  'North East': {
    'Nalerigu': ['Nalerigu Central', 'Bunkpurugu', 'Gambaga', 'Walewale', 'Yagaba', 'Langbensi', 'Chereponi', 'Gbingban', 'Gbintiri', 'Guma', 'Gushi', 'Jagberi', 'Janga', 'Kadelso', 'Kaku', 'Kanda', 'Karikaru', 'Kate', 'Kobliman', 'Kpado', 'Kpajai', 'Kpaligu', 'Kparigu', 'Kpasengu', 'Kpatili', 'Kpatiok', 'Kperisi', 'Kpikpira', 'Kponbo', 'Kukoyiri', 'Kukuo', 'Kunbungu', 'Kunfuse', 'Kungu', 'Kunko', 'Kunyukuo', 'Kusanaba', 'Kuunduri', 'Kwahu', 'Kwaku', 'Kwame', 'Kwasi', 'Langbensi', 'Langbensi Kukuo', 'Lani', 'Lanten', 'Lantungo', 'Laribanga', 'Lawa', 'Mabeng', 'Mabure', 'Makesi', 'Malik', 'Malima', 'Mamankoma', 'Mamprugul', 'Mamprusi', 'Mamprugu', 'Manko', 'Manso', 'Mari', 'Marilyn'],
  },
  'Savannah': {
    'Damango': ['Damango Central', 'Salaga', 'Daboya', 'Bole', 'Buipe', 'Sawla', 'Kpandai', 'Banda', 'Banda Nkwanta', 'Banda Tepo', 'Bandabeya', 'Bandadabi', 'Bandadi', 'Bandai', 'Bandal', 'Bandawe', 'Bandigbe', 'Bandima', 'Bandina', 'Bandini', 'Bandon', 'Bandu', 'Bandun', 'Banjam', 'Banko', 'Bao', 'Bape', 'Barabara', 'Barbe', 'Bario', 'Basare', 'Basi', 'Bata', 'Batagbene', 'Batak', 'Bato', 'Batoma', 'Batong', 'Bature', 'Bawa', 'Baya', 'Bazua', 'Bechi', 'Begu', 'Behinye', 'Bekai', 'Bekitik', 'Bembasi', 'Bena', 'Benga', 'Beni', 'Benim', 'Benne', 'Beposo', 'Bera', 'Beri', 'Beriyi', 'Besi', 'Beyi', 'Bianima', 'Biasi', 'Bibiri', 'Bie', 'Bikam', 'Bikani', 'Bile', 'Bimbila'],
  },
  'Upper East': {
    'Bolgatanga': ['Bolgatanga Central', 'Bawku', 'Navrongo', 'Paga', 'Sandema', 'Zuarungu', 'Bongo', 'Garua', 'Kassena', 'Kusaug', 'Bolgatanga SSNIT Flats', 'Bolgatanga Estate', 'Bolgatanga Town', 'Bongo Central', 'Bongo Gorigo', 'Bongo Soe', 'Bongo Zorko', 'Bawku Abugri', 'Bawku Adaboya', 'Bawku Central', 'Bawku Natinga', 'Bawku Sabonjida', 'Bawku Soe', 'Bawku Wusuga', 'Bawku Zongo', 'Kassena Nankana', 'Kassena Nankana East', 'Kassena Nankana West', 'Navrongo Central', 'Navrongo Konchogo', 'Navrongo Paga', 'Navrongo Tono', 'Paga Central', 'Paga North', 'Paga South', 'Sandema Central', 'Sandema North', 'Sandema South', 'Zuarungu Central', 'Zuarungu North', 'Zuarungu South'],
  },
  'Upper West': {
    'Wa': ['Wa Central', 'Jirapa', 'Nandom', 'Lawra', 'Tumu', 'Hamile', 'Daffiama', 'Kaleo', 'Gwollu', 'Wa North', 'Wa South', 'Wa SSNIT Flats', 'Wa Estate', 'Wa Town', 'Jirapa Central', 'Jirapa Raya', 'Jirapa Zongo', 'Nandom Central', 'Nandom Gbengbe', 'Nandom Kokoligu', 'Nandom Nadowli', 'Lawra Central', 'Lawra Eremon', 'Lawra Fielmuo', 'Lawra Sombo', 'Tumu Central', 'Tumu Dema', 'Tumu Nandwene', 'Tumu Yagtuur', 'Hamile Central', 'Hamile Pafoe', 'Hamile Sissala', 'Daffiama Central', 'Daffiama Issa', 'Daffiama Sissala', 'Kaleo Central', 'Kaleo Nadowli', 'Kaleo Wa', 'Gwollu Central', 'Gwollu Tumu', 'Gwollu Wa'],
  },
  'Western North': {
    'Sefwi Wiawso': ['Sefwi Wiawso Central', 'Sefwi Asawinso', 'Sefwi Boako', 'Bibiani', 'Nkroful', 'Juaboso', 'Akontombra', 'Bodi', 'Bia', 'Bia West', 'Bia East', 'Suaman', 'Aowin', 'Aowin Central', 'Aowin East', 'Aowin West', 'Bibiani Anhwiaso Bekwai', 'Bibiani Central', 'Bibiani North', 'Bibiani South', 'Bodi Central', 'Bodi North', 'Bodi South', 'Juaboso Central', 'Juaboso North', 'Juaboso South', 'Sefwi Asafo', 'Sefwi Bekwai', 'Sefwi Debiso', 'Sefwi Essam', 'Sefwi Wiawso North', 'Sefwi Wiawso South', 'Sefwi Wiawso West', 'Suaman Central', 'Suaman East', 'Suaman West'],
  },
};

const allRegions = Object.keys(locationData);


// Helper to get cities for selected region
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
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    region: '',
    city: '',
    area: '',
    postalCode: '',
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
    if (!address.postalCode.trim()) newErrors.postalCode = 'Postal code required';
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
        postalCode: address.postalCode,
        country: 'Ghana',
      },
      paymentMethod,
      itemsPrice: subtotal,
      shippingPrice: shipping,
      totalPrice: total,
    };
    const { data } = await axios.post('/orders', orderData);
    return data.data;
  };

  const handleAddressSubmit = (e: React.FormEvent) => { e.preventDefault(); if (validateAddress()) setStep(2); };
  
  const handleCOD = async () => {
    setLoading(true);
    try {
      await createOrder();
      clearCart();
      router.push('/orders?success=true');
    } catch (err: any) { alert(err.response?.data?.message || 'Order failed'); }
    finally { setLoading(false); }
  };
  
  const handlePaystackFlow = async () => {
    setLoading(true);
    try {
      const order = await createOrder();
      setCreatedOrderId(order._id);
    } catch (err: any) { alert(err.response?.data?.message || 'Order creation failed'); }
    finally { setLoading(false); }
  };
  
  const onPaystackSuccess = async () => {
    try {
      await axios.put(`/orders/${createdOrderId}/pay`, { status: 'completed' });
    } catch (err) { console.error('Failed to update payment status', err); }
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
            {[1,2,3].map(i => (
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
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label>Postal code</Label>
                      <Input value={address.postalCode} onChange={e => updateAddress('postalCode', e.target.value)} className="mt-1" />
                      {errors.postalCode && <p className="text-red-500 text-xs">{errors.postalCode}</p>}
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Input value="Ghana" disabled className="mt-1 bg-gray-100" />
                    </div>
                  </div>
                  <Button type="submit" className="bg-primary w-full md:w-auto">Continue to payment <ChevronRight className="ml-1 h-4 w-4" /></Button>
                </form>
              </div>
            )}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Payment method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex justify-between items-center border rounded-xl p-4 hover:border-primary">
                    <div className="flex items-center gap-3"><RadioGroupItem value="cash_on_delivery" id="cod" /><Label htmlFor="cod" className="font-medium">Cash on delivery</Label></div>
                    <span className="text-green-600 text-sm">Pay when you receive</span>
                  </div>
                  <div className="flex justify-between items-center border rounded-xl p-4 hover:border-primary">
                    <div className="flex items-center gap-3"><RadioGroupItem value="paystack" id="paystack" /><Label htmlFor="paystack" className="font-medium">Card payment (Paystack)</Label></div>
                    <span className="text-blue-600 text-sm">Secure online payment</span>
                  </div>
                </RadioGroup>
                <div className="flex justify-between mt-8"><Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button><Button onClick={() => setStep(3)} className="bg-primary">Review order <ChevronRight className="ml-1 h-4 w-4" /></Button></div>
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
                      {address.postalCode}<br />
                      Phone: {address.phone}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><h3 className="font-semibold">Payment method</h3><button onClick={() => setStep(2)} className="text-primary text-sm">Edit</button></div>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm">{paymentMethod === 'cash_on_delivery' ? 'Cash on delivery' : 'Card (Paystack)'}</div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-gray-600 mb-2"><span>Subtotal</span><span>₵{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600 mb-2"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₵${shipping.toLocaleString()}`}</span></div>
                    <div className="flex justify-between text-xl font-bold mt-3 pt-3 border-t"><span>Total</span><span>₵{total.toLocaleString()}</span></div>
                  </div>
                  {paymentMethod === 'cash_on_delivery' ? (
                    <Button onClick={handleCOD} disabled={loading} className="w-full bg-primary py-3">{loading ? 'Placing order...' : 'Place order (Cash on delivery)'}</Button>
                  ) : (
                    !createdOrderId ? (
                      <Button onClick={handlePaystackFlow} disabled={loading} className="w-full bg-primary py-3">{loading ? 'Creating order...' : 'Proceed to payment'}</Button>
                    ) : (
                      <PaystackButton email={user.email} amount={total} orderId={createdOrderId} onSuccess={onPaystackSuccess} onClose={onPaystackClose} />
                    )
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
