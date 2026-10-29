// Travel data for each of Korea's 9 provinces (도).
// Big cities are listed under the province around them (e.g. Seoul → Gyeonggi, Busan → Gyeongnam).
// Prices are rough estimates in Korean won (KRW). Update them as you learn more.
//
// To add a place, copy one entry in the right list and change the text.
//   attractions: { name, ko, desc, price }
//   hotels:      { name, ko, type: "Luxury" | "Mid-range" | "Budget", desc, price }  (price = per night, double room)
//   foods:       { name, ko, desc, price }   (price = per person)
//   restaurants: { name, ko, desc, price }   (price = per person)
// Optional on any item: city (shown under the name), address (shown with a map link)
// and source (shown as a small credit).

// Rough exchange rate used to show USD next to KRW prices. Update when needed.
const KRW_PER_USD = 1400;

const PROVINCES = [
  {
    id: "gyeonggi",
    name: "Gyeonggi-do",
    ko: "경기도",
    cities: "Seoul · Incheon · Suwon",
    color: "#c0392b",
    intro:
      "The capital region. Royal palaces, K-pop neighborhoods, night markets and the DMZ, all within an hour of Seoul.",
    attractions: [
      { name: "Gyeongbokgung Palace", ko: "경복궁", city: "Seoul", desc: "The largest Joseon-era palace. Free entry if you wear a hanbok.", price: "₩3,000" },
      { name: "Bukchon Hanok Village", ko: "북촌한옥마을", city: "Seoul", desc: "Hillside lanes of traditional houses between two palaces. Please keep quiet, people live here.", price: "Free" },
      { name: "N Seoul Tower", ko: "N서울타워", city: "Seoul", desc: "City views from Namsan mountain. Go at sunset.", price: "₩26,000 (observatory)" },
      { name: "Hwaseong Fortress", ko: "수원 화성", city: "Suwon", desc: "UNESCO-listed 18th-century fortress wall you can walk around in Suwon.", price: "₩1,000" },
      { name: "DMZ Tour", ko: "DMZ 투어", city: "Paju", desc: "Guided day trip to the border between North and South Korea. Book ahead and bring your passport.", price: "₩60,000–100,000" },
    ],
    hotels: [
      { name: "Lotte Hotel Seoul", ko: "롯데호텔 서울", city: "Seoul", type: "Luxury", desc: "Classic luxury hotel next to Myeongdong shopping.", price: "₩350,000–550,000" },
      { name: "Nine Tree Premier Myeongdong", ko: "나인트리 프리미어 명동", city: "Seoul", type: "Mid-range", desc: "Modern rooms in the middle of Myeongdong.", price: "₩150,000–220,000" },
      { name: "Hongdae guesthouses", ko: "홍대 게스트하우스", city: "Seoul", type: "Budget", desc: "Lots of small guesthouses near the university area with music and nightlife.", price: "₩40,000–80,000" },
    ],
    foods: [
      { name: "Korean BBQ (samgyeopsal)", ko: "삼겹살", city: "Seoul", desc: "Pork belly grilled at your table, wrapped in lettuce.", price: "₩16,000–20,000 / serving" },
      { name: "Tteokbokki", ko: "떡볶이", city: "Seoul", desc: "Chewy rice cakes in a sweet and spicy sauce.", price: "₩4,000–6,000" },
      { name: "Suwon galbi", ko: "수원갈비", city: "Suwon", desc: "Large marinated beef short ribs, a Suwon specialty.", price: "₩50,000–65,000" },
      { name: "Fried chicken & beer", ko: "치맥", city: "Seoul", desc: "Korean fried chicken with beer, the classic night-out meal.", price: "₩20,000–28,000 / chicken" },
    ],
    restaurants: [
      { name: "Gwangjang Market", ko: "광장시장", city: "Seoul", desc: "Historic market famous for mung-bean pancakes (bindaetteok) and mayak gimbap.", price: "₩5,000–15,000" },
      { name: "Myeongdong Kyoja", ko: "명동교자", city: "Seoul", desc: "Famous for kalguksu (knife-cut noodle soup) and dumplings since 1966.", price: "₩11,000–13,000" },
      { name: "Bonsuwon Galbi", ko: "본수원갈비", city: "Suwon", desc: "One of the best-known Suwon galbi restaurants.", price: "₩55,000–70,000" },
    ],
  },
  {
    id: "gangwon",
    name: "Gangwon",
    ko: "강원특별자치도",
    cities: "Gangneung · Sokcho · Chuncheon · Pyeongchang",
    color: "#2e7d5b",
    intro:
      "Mountains and the East Sea. Hiking in Seoraksan, beaches, ski resorts and filming spots from K-dramas.",
    attractions: [
      { name: "Seoraksan National Park", ko: "설악산국립공원", city: "Sokcho", desc: "Korea's most famous mountain park, best in autumn.", price: "Free (cable car ~₩15,000)" },
      { name: "Nami Island", ko: "남이섬", city: "Chuncheon", desc: "Tree-lined island made famous by the drama Winter Sonata.", price: "~₩16,000 (incl. ferry)" },
      { name: "Gangneung Anmok Coffee Street", ko: "안목해변 커피거리", city: "Gangneung", desc: "Beachfront street lined with cafés.", price: "Free" },
      { name: "Jumunjin Breakwater", ko: "주문진 방파제", city: "Gangneung", desc: "Filming spot from the drama Goblin (Guardian).", price: "Free" },
    ],
    hotels: [
      { name: "Seamarq Hotel", ko: "씨마크 호텔", city: "Gangneung", type: "Luxury", desc: "Ocean-view luxury hotel at Gyeongpo, Gangneung.", price: "₩350,000–600,000" },
      { name: "Lotte Resort Sokcho", ko: "롯데리조트 속초", city: "Sokcho", type: "Mid-range", desc: "Seaside resort with an infinity pool.", price: "₩200,000–350,000" },
      { name: "Sokcho & Gangneung guesthouses", ko: "게스트하우스", city: "Sokcho", type: "Budget", desc: "Simple rooms near the bus terminals and beaches.", price: "₩40,000–80,000" },
    ],
    foods: [
      { name: "Chuncheon dakgalbi", ko: "춘천 닭갈비", city: "Chuncheon", desc: "Spicy stir-fried chicken cooked on a big iron pan.", price: "₩14,000–17,000" },
      { name: "Makguksu", ko: "막국수", city: "Chuncheon", desc: "Cold buckwheat noodles, perfect in summer.", price: "₩9,000–12,000" },
      { name: "Chodang sundubu", ko: "초당순두부", city: "Gangneung", desc: "Soft tofu made with seawater in Gangneung.", price: "₩10,000–13,000" },
      { name: "Dakgangjeong", ko: "닭강정", city: "Sokcho", desc: "Sweet and crispy glazed fried chicken, a Sokcho favorite.", price: "₩20,000–25,000 / box" },
    ],
    restaurants: [
      { name: "Chodang Tofu Village", ko: "초당순두부마을", city: "Gangneung", desc: "A whole neighborhood of tofu restaurants in Gangneung.", price: "₩10,000–15,000" },
      { name: "Sokcho Jungang Market", ko: "속초관광수산시장", city: "Sokcho", desc: "Dakgangjeong, squid sundae and fresh seafood.", price: "₩5,000–25,000" },
      { name: "Chuncheon Dakgalbi Street", ko: "명동 닭갈비골목", city: "Chuncheon", desc: "Street full of dakgalbi restaurants in downtown Chuncheon.", price: "₩15,000–18,000" },
    ],
  },
  {
    id: "chungbuk",
    name: "Chungcheongbuk-do",
    ko: "충청북도",
    cities: "Cheongju · Danyang · Chungju",
    color: "#7b5ea7",
    intro:
      "Korea's only landlocked province. Rivers, caves, quiet temples and paragliding over Danyang.",
    attractions: [
      { name: "Dodamsambong Peaks", ko: "도담삼봉", city: "Danyang", desc: "Three rock peaks rising out of the river in Danyang.", price: "Free" },
      { name: "Danyang Paragliding", ko: "단양 패러글라이딩", city: "Danyang", desc: "Tandem flight with views over the Namhan River.", price: "₩100,000–150,000" },
      { name: "Gosu Cave", ko: "고수동굴", city: "Danyang", desc: "Limestone cave with walkways through the rock formations.", price: "~₩11,000" },
      { name: "Cheongnamdae", ko: "청남대", city: "Cheongju", desc: "Former presidential summer villa with lakeside gardens.", price: "~₩6,000" },
    ],
    hotels: [
      { name: "Sono Moon Danyang", ko: "소노문 단양", city: "Danyang", type: "Mid-range", desc: "Riverside resort in central Danyang.", price: "₩120,000–220,000" },
      { name: "Cheongju city hotels", ko: "청주 시내 호텔", city: "Cheongju", type: "Mid-range", desc: "Business hotels near the bus terminal and airport.", price: "₩80,000–150,000" },
      { name: "Danyang pensions", ko: "단양 펜션", city: "Danyang", type: "Budget", desc: "Family-run guest houses along the river.", price: "₩60,000–120,000" },
    ],
    foods: [
      { name: "Garlic set meal", ko: "마늘정식", city: "Danyang", desc: "Danyang is famous for garlic. Many side dishes plus garlic tteokgalbi.", price: "₩15,000–25,000" },
      { name: "Olgaengi soup", ko: "올갱이국", city: "Danyang", desc: "Light soup made with freshwater snails.", price: "₩9,000–12,000" },
      { name: "Red fish cake", ko: "빨간오뎅", city: "Jecheon", desc: "Spicy fish cake skewers, a Jecheon street snack.", price: "₩1,000–2,000 / skewer" },
    ],
    restaurants: [
      { name: "Danyang Gugyeong Market", ko: "단양구경시장", city: "Danyang", desc: "Garlic snacks, garlic fried chicken and local food stalls.", price: "₩5,000–20,000" },
      { name: "Jecheon Jungang Market", ko: "제천 중앙시장", city: "Jecheon", desc: "Try the red fish cakes and other street food.", price: "₩2,000–10,000" },
    ],
  },
  {
    id: "chungnam",
    name: "Chungcheongnam-do",
    ko: "충청남도",
    cities: "Daejeon · Gongju · Buyeo · Boryeong",
    color: "#d4882b",
    intro:
      "The land of the ancient Baekje kingdom, the Boryeong Mud Festival, and the famous bakery Sungsimdang in Daejeon.",
    attractions: [
      { name: "Gongsanseong Fortress", ko: "공산성", city: "Gongju", desc: "Baekje-era fortress on a hill above the river in Gongju (UNESCO).", price: "~₩1,200" },
      { name: "Buyeo Baekje sites", ko: "부여 백제유적지구", city: "Buyeo", desc: "Busosanseong Fortress, Gungnamji Pond and Jeongnimsa Temple site.", price: "₩1,500–2,000" },
      { name: "Boryeong Mud Festival", ko: "보령머드축제", city: "Boryeong", desc: "Huge summer festival on Daecheon Beach every July.", price: "₩10,000–15,000 (mud zone)" },
      { name: "Anmyeondo Island", ko: "안면도", city: "Taean", desc: "Quiet beaches and famous sunsets at Kkotji Beach.", price: "Free" },
    ],
    hotels: [
      { name: "Lotte Resort Buyeo", ko: "롯데리조트 부여", city: "Buyeo", type: "Mid-range", desc: "Resort near the Baekje Cultural Land.", price: "₩180,000–300,000" },
      { name: "Hotel Onoma Daejeon", ko: "호텔 오노마 대전", city: "Daejeon", type: "Luxury", desc: "Modern hotel at Daejeon Expo Park.", price: "₩200,000–350,000" },
      { name: "Daecheon Beach motels", ko: "대천해수욕장 숙소", city: "Boryeong", type: "Budget", desc: "Simple rooms by the beach (book early for July).", price: "₩60,000–120,000" },
    ],
    foods: [
      { name: "Lotus leaf rice", ko: "연잎밥", city: "Buyeo", desc: "Rice steamed in a lotus leaf, a Buyeo specialty.", price: "₩15,000–20,000" },
      { name: "Gongju chestnut treats", ko: "공주 밤", city: "Gongju", desc: "Chestnut bread, chestnut makgeolli and more.", price: "₩2,000–10,000" },
      { name: "Daejeon kalguksu", ko: "대전 칼국수", city: "Daejeon", desc: "Daejeon is known as the city of noodle soup.", price: "₩8,000–10,000" },
    ],
    restaurants: [
      { name: "Sungsimdang", ko: "성심당", city: "Daejeon", desc: "Daejeon's legendary bakery since 1956. Try the fried soboro bread.", price: "₩2,000–10,000" },
      { name: "Daecheon Port seafood", ko: "대천항 수산시장", city: "Boryeong", desc: "Fresh seafood, grilled clams and raw fish.", price: "₩20,000–40,000" },
    ],
  },
  {
    id: "jeonbuk",
    name: "Jeonbuk",
    ko: "전북특별자치도",
    cities: "Jeonju · Gunsan · Namwon",
    color: "#1f6f8b",
    intro:
      "The food capital of Korea. Jeonju's hanok village, bibimbap and makgeolli alleys.",
    attractions: [
      { name: "Jeonju Hanok Village", ko: "전주한옥마을", city: "Jeonju", desc: "More than 700 traditional houses. Rent a hanbok and walk around.", price: "Free" },
      { name: "Gyeonggijeon Shrine", ko: "경기전", city: "Jeonju", desc: "Shrine holding the portrait of the founder of the Joseon dynasty.", price: "₩3,000" },
      { name: "Naejangsan National Park", ko: "내장산국립공원", city: "Jeongeup", desc: "One of the best places in Korea to see autumn leaves.", price: "Free" },
      { name: "Gunsan Modern History Street", ko: "군산 근대역사거리", city: "Gunsan", desc: "Old 1930s buildings and a retro atmosphere.", price: "Free–₩2,000" },
    ],
    hotels: [
      { name: "Lahan Hotel Jeonju", ko: "라한호텔 전주", city: "Jeonju", type: "Mid-range", desc: "Right next to the Hanok Village.", price: "₩130,000–220,000" },
      { name: "Hanok stays", ko: "한옥스테이", city: "Jeonju", type: "Mid-range", desc: "Sleep on the floor in a traditional Korean house.", price: "₩80,000–180,000" },
      { name: "Jeonju guesthouses", ko: "전주 게스트하우스", city: "Jeonju", type: "Budget", desc: "Small guesthouses near the Hanok Village.", price: "₩40,000–70,000" },
    ],
    foods: [
      { name: "Jeonju bibimbap", ko: "전주비빔밥", city: "Jeonju", desc: "Rice with many vegetables, beef and gochujang in a brass bowl.", price: "₩13,000–18,000" },
      { name: "Kongnamul gukbap", ko: "콩나물국밥", city: "Jeonju", desc: "Bean sprout soup with rice, a hangover cure.", price: "₩8,000–10,000" },
      { name: "Makgeolli set", ko: "막걸리 한상", city: "Jeonju", desc: "A kettle of rice wine with lots of side dishes for the table.", price: "₩20,000–30,000 / table" },
    ],
    restaurants: [
      { name: "Hankookjib", ko: "한국집", city: "Jeonju", desc: "One of the oldest and most famous Jeonju bibimbap restaurants.", price: "₩15,000–18,000" },
      { name: "Sambaekjip", ko: "삼백집", city: "Jeonju", desc: "Famous kongnamul gukbap restaurant.", price: "₩8,000–11,000" },
      { name: "Lee Sung Dang", ko: "이성당", city: "Gunsan", desc: "Korea's oldest bakery, in Gunsan. Known for red bean and vegetable bread.", price: "₩2,000–10,000" },
    ],
  },
  {
    id: "jeonnam",
    name: "Jeollanam-do",
    ko: "전라남도",
    cities: "Gwangju · Yeosu · Suncheon · Mokpo",
    color: "#3f8f3a",
    intro:
      "Green tea fields, bamboo forests and the romantic night sea of Yeosu. Famous for generous home-style meals.",
    attractions: [
      { name: "Suncheon Bay Wetland", ko: "순천만습지", city: "Suncheon", desc: "Huge reed fields. Plus the National Garden nearby.", price: "~₩8,000 (combined ticket)" },
      { name: "Yeosu Maritime Cable Car", ko: "여수 해상케이블카", city: "Yeosu", desc: "Cable car over the sea. Best at night.", price: "₩17,000–24,000" },
      { name: "Boseong Green Tea Fields", ko: "보성 녹차밭", city: "Boseong", desc: "Rolling hills covered in tea bushes.", price: "~₩4,000" },
      { name: "Juknokwon Bamboo Forest", ko: "죽녹원", city: "Damyang", desc: "Walking paths through a tall bamboo forest in Damyang.", price: "₩3,000" },
    ],
    hotels: [
      { name: "Sono Calm Yeosu", ko: "소노캄 여수", city: "Yeosu", type: "Luxury", desc: "Ocean-view hotel near Yeosu Expo.", price: "₩200,000–350,000" },
      { name: "Gwangju city hotels", ko: "광주 시내 호텔", city: "Gwangju", type: "Mid-range", desc: "Hotels around the Asia Culture Center.", price: "₩90,000–160,000" },
      { name: "Yeosu guesthouses", ko: "여수 게스트하우스", city: "Yeosu", type: "Budget", desc: "Small rooms near the night-sea waterfront.", price: "₩40,000–80,000" },
    ],
    foods: [
      { name: "Hanjeongsik", ko: "한정식", city: "Suncheon", desc: "A full table of 20+ dishes. Jeolla style is the most generous.", price: "₩20,000–40,000" },
      { name: "Gejang", ko: "게장", city: "Yeosu", desc: "Raw crab marinated in soy sauce, a Yeosu favorite.", price: "₩15,000–30,000" },
      { name: "Tteokgalbi", ko: "떡갈비", city: "Damyang", desc: "Grilled minced beef patties, a Damyang specialty.", price: "₩20,000–30,000" },
      { name: "Nakji (octopus)", ko: "낙지", city: "Mokpo", desc: "Small octopus dishes from Mokpo.", price: "₩15,000–30,000" },
    ],
    restaurants: [
      { name: "Yeosu Gejang Street", ko: "봉산동 게장거리", city: "Yeosu", desc: "A street full of all-you-can-eat gejang restaurants.", price: "₩15,000–25,000" },
      { name: "Damyang Tteokgalbi Street", ko: "담양 떡갈비거리", city: "Damyang", desc: "Many tteokgalbi restaurants near Juknokwon.", price: "₩20,000–30,000" },
      { name: "1913 Songjeong Station Market", ko: "1913송정역시장", city: "Gwangju", desc: "Retro market with modern street food in Gwangju.", price: "₩3,000–15,000" },
    ],
  },
  {
    id: "gyeongbuk",
    name: "Gyeongsangbuk-do",
    ko: "경상북도",
    cities: "Daegu · Gyeongju · Andong · Pohang",
    color: "#a0522d",
    intro:
      "Gyeongju was the capital of the Silla kingdom for 1,000 years. Temples, royal tombs and traditional villages.",
    attractions: [
      { name: "Bulguksa Temple", ko: "불국사", city: "Gyeongju", desc: "Korea's most famous Buddhist temple (UNESCO).", price: "Free" },
      { name: "Donggung Palace & Wolji Pond", ko: "동궁과 월지", city: "Gyeongju", desc: "Beautiful at night when the pavilions light up.", price: "₩3,000" },
      { name: "Daereungwon & Cheomseongdae", ko: "대릉원 · 첨성대", city: "Gyeongju", desc: "Grassy royal tomb hills and Asia's oldest observatory.", price: "Free" },
      { name: "Andong Hahoe Village", ko: "안동하회마을", city: "Andong", desc: "Living traditional village with mask dance performances (UNESCO).", price: "₩5,000" },
    ],
    hotels: [
      { name: "Lahan Select Gyeongju", ko: "라한셀렉트 경주", city: "Gyeongju", type: "Luxury", desc: "Lakeside resort hotel at Bomun Lake.", price: "₩180,000–350,000" },
      { name: "Gyeongju hanok stays", ko: "경주 한옥스테이", city: "Gyeongju", type: "Mid-range", desc: "Traditional houses near Hwangnidan-gil.", price: "₩80,000–180,000" },
      { name: "Daegu Dongseongno hotels", ko: "대구 동성로 숙소", city: "Daegu", type: "Budget", desc: "Small hotels in Daegu's shopping district.", price: "₩50,000–100,000" },
    ],
    foods: [
      { name: "Andong jjimdak", ko: "안동찜닭", city: "Andong", desc: "Braised chicken with glass noodles in soy sauce.", price: "₩30,000–40,000 (for 2–3)" },
      { name: "Gyeongju bread", ko: "경주빵 · 황남빵", city: "Gyeongju", desc: "Small pastry filled with red bean paste.", price: "₩1,000 each" },
      { name: "Daegu makchang", ko: "대구 막창", city: "Daegu", desc: "Grilled pork intestines, Daegu's late-night specialty.", price: "₩12,000–16,000 / serving" },
    ],
    restaurants: [
      { name: "Hwangnam Bread (original store)", ko: "황남빵 본점", city: "Gyeongju", desc: "The original Gyeongju bread shop, since 1939.", price: "₩10,000–25,000 / box" },
      { name: "Andong Jjimdak Alley", ko: "안동구시장 찜닭골목", city: "Andong", desc: "A whole alley of jjimdak restaurants in Andong's old market.", price: "₩15,000–20,000" },
      { name: "Seomun Night Market", ko: "서문시장 야시장", city: "Daegu", desc: "Daegu's biggest market with street food at night.", price: "₩3,000–10,000" },
    ],
  },
  {
    id: "gyeongnam",
    name: "Gyeongsangnam-do",
    ko: "경상남도",
    cities: "Busan · Ulsan · Tongyeong · Jinju",
    color: "#1e5aa8",
    intro:
      "Busan's beaches and seafood, the island harbors of Tongyeong and the cherry blossoms of Jinhae.",
    attractions: [
      { name: "Haeundae Beach", ko: "해운대해수욕장", city: "Busan", desc: "Busan's most famous beach, with the Sky Capsule train nearby.", price: "Free" },
      { name: "Gamcheon Culture Village", ko: "감천문화마을", city: "Busan", desc: "Colorful hillside houses and murals.", price: "Free" },
      { name: "Haedong Yonggungsa Temple", ko: "해동용궁사", city: "Busan", desc: "Rare temple built on the rocks by the sea.", price: "Free" },
      { name: "Tongyeong Cable Car", ko: "통영 케이블카", city: "Tongyeong", desc: "Views over the islands of Hallyeosu.", price: "~₩17,000" },
      { name: "Jinhae Cherry Blossom Festival", ko: "진해군항제", city: "Changwon (Jinhae)", desc: "Korea's biggest cherry blossom festival, early April.", price: "Free" },
    ],
    hotels: [
      { name: "Paradise Hotel Busan", ko: "파라다이스호텔 부산", city: "Busan", type: "Luxury", desc: "Right on Haeundae Beach with an ocean-view pool.", price: "₩350,000–600,000" },
      { name: "Haeundae business hotels", ko: "해운대 비즈니스호텔", city: "Busan", type: "Mid-range", desc: "Many modern hotels a short walk from the beach.", price: "₩100,000–180,000" },
      { name: "Seomyeon & Busan Station guesthouses", ko: "서면 · 부산역 게스트하우스", city: "Busan", type: "Budget", desc: "Cheap rooms close to the subway.", price: "₩35,000–70,000" },
    ],
    foods: [
      { name: "Dwaeji gukbap", ko: "돼지국밥", city: "Busan", desc: "Pork and rice soup, Busan's soul food.", price: "₩10,000–12,000" },
      { name: "Milmyeon", ko: "밀면", city: "Busan", desc: "Cold wheat noodles, a Busan summer classic.", price: "₩9,000–11,000" },
      { name: "Chungmu gimbap", ko: "충무김밥", city: "Tongyeong", desc: "Plain rice rolls with spicy squid and radish, from Tongyeong.", price: "₩6,000–10,000" },
      { name: "Fresh raw fish", ko: "회", city: "Busan", desc: "Choose your fish at the market and eat it upstairs.", price: "₩30,000–60,000" },
    ],
    restaurants: [
      { name: "Jagalchi Fish Market", ko: "자갈치시장", address: "부산 중구 자갈치해안로 52", city: "Busan", desc: "Korea's largest seafood market.", price: "₩30,000–60,000" },
      { name: "Ssangdungi Dwaeji Gukbap", ko: "쌍둥이돼지국밥", address: "부산 남구 유엔평화로 35-1", city: "Busan", desc: "Popular pork soup restaurant near Daeyeon Station.", price: "₩10,000–13,000" },
      { name: "Gaegeum Milmyeon", ko: "개금밀면", address: "부산 부산진구 가야공원로14번길 88-8", city: "Busan", desc: "One of Busan's best-known milmyeon shops.", price: "₩9,000–11,000" },
      // Top-ranked Gyeongnam restaurants from DiningCode (diningcode.com/rank/경남), Oct 2026.
      // Prices are typical ranges for the signature dish, not from DiningCode.
      { name: "Bamtol", ko: "밤톨", address: "경남 하동군 화개면 화개로 17-1", city: "Hadong", desc: "Bakery known for chestnut pies made with local Hadong chestnuts. A popular souvenir snack.", price: "~₩3,000–15,000", source: "DiningCode" },
      { name: "Hwajeong Soba", ko: "화정소바", address: "경남 의령군 의령읍 의병로18길 9-3", city: "Uiryeong", desc: "Long-running soba shop with warm and cold buckwheat noodles. Certified as a 'Century Store' (백년가게).", price: "~₩10,000–13,000", source: "DiningCode" },
      { name: "Hiphansik", ko: "힙한식", address: "경남 남해군 미조면 동부대로 2", city: "Namhae", desc: "Modern Korean spot serving pot rice (sotbap) and seafood pancakes. Seen on the show Culinary Class Wars. Expect a wait.", price: "~₩18,000–28,000", source: "DiningCode" },
      { name: "Dongpirang Jeonbok Maeul", ko: "동피랑전복마을", address: "경남 통영시 해송정2길 29, 2층", city: "Tongyeong", desc: "Abalone stone-pot rice sets with grilled fish and pancakes, near Dongpirang mural village.", price: "~₩18,000–30,000", source: "DiningCode" },
      { name: "Osong Wave", ko: "오송웨이브", address: "경남 거제시 동부면 오송7길 3-1", city: "Geoje", desc: "Large seaside café with bakery, terrace and ocean views.", price: "~₩6,000–10,000", source: "DiningCode" },
      { name: "Phosong", ko: "포숑", address: "경남 창원시 성산구 용호로 109", city: "Changwon (Garosu-gil)", desc: "Busy Vietnamese restaurant known for rich beef pho.", price: "~₩10,000–14,000", source: "DiningCode" },
      { name: "Dongbu Hoe Center", ko: "동부회센타", address: "경남 창원시 진해구 천자로 5", city: "Changwon (Jinhae)", desc: "Local raw-fish restaurant with platters, fresh sea squirt and spicy fish stew (maeuntang). Table charge applies.", price: "~₩25,000–40,000", source: "DiningCode" },
      { name: "Hajuok", ko: "하주옥", address: "경남 사천시 사남면 하동길 8-11", city: "Sacheon", desc: "Well-known spot for Jinju-style naengmyeon (cold noodles in seafood broth) with beef jeon.", price: "~₩12,000–16,000", source: "DiningCode" },
      { name: "Chungnam Sikdang", ko: "충남식당", address: "경남 거제시 거제중앙로 1883-2 (고현시장)", city: "Geoje", desc: "Simple local gukbap house famous for tender offal and sundae soup.", price: "~₩9,000–12,000", source: "DiningCode" },
      { name: "Namhae Jeonbok Mulhoe", ko: "남해전복물회", address: "경남 남해군 이동면 남해대로 2436", city: "Namhae", desc: "Cold, spicy raw-fish soup topped with fresh abalone. Great in summer.", price: "~₩18,000–25,000", source: "DiningCode" },
      { name: "Jeil Sikdang", ko: "제일식당", address: "경남 진주시 중앙시장길 37-8", city: "Jinju", desc: "Old market restaurant serving Jinju-style beef tartare bibimbap and blood-sausage soup. Featured on Baekban Gihaeng.", price: "~₩10,000–15,000", source: "DiningCode" },
      { name: "Won Dwaeji Gukbap", ko: "원돼지국밥", address: "경남 창원시 성산구 상남로 67", city: "Changwon", desc: "Called one of Changwon's top 3 pork soup restaurants. Lines move fast.", price: "~₩10,000–12,000", source: "DiningCode" },
      { name: "Mura", ko: "무라", address: "경남 양산시 양산역9길 5, 102호", city: "Yangsan", desc: "Japanese ramen shop serving Kumamoto ramen (the spicy one is very spicy) and mazesoba.", price: "~₩10,000–13,000", source: "DiningCode" },
      { name: "Jinju Naengmyeon Sanhong", ko: "진주냉면 산홍 본점", address: "경남 진주시 금산면 금산로 62", city: "Jinju", desc: "Main branch of a famous Jinju naengmyeon restaurant, with thick noodles and generous toppings.", price: "~₩12,000–16,000", source: "DiningCode" },
      { name: "Monster Roasters", ko: "몬스터로스터스", address: "경남 창원시 마산합포구 월영동9길 14", city: "Changwon (Masan)", desc: "Roastery café with coffee tastings and desserts. Blue Ribbon listed.", price: "~₩5,000–9,000", source: "DiningCode" },
      { name: "Simgane Haemul Jjamppong", ko: "심가네해물짬뽕", address: "경남 통영시 새터길 74-4", city: "Tongyeong", desc: "Spicy seafood noodle soup loaded with shellfish. A certified 'Century Store'.", price: "~₩10,000–15,000", source: "DiningCode" },
      { name: "Bangkok Sanjang", ko: "방콕산장", address: "경남 창원시 진해구 진해대로660번길 9", city: "Changwon (Jinhae)", desc: "Thai restaurant with a garden setting, popular for dates.", price: "~₩12,000–20,000", source: "DiningCode" },
      { name: "Daepunggwan", ko: "대풍관", address: "경남 통영시 해송정2길 29", city: "Tongyeong", desc: "Abalone pot rice and oyster dishes, neatly served. Featured on 2 Days & 1 Night.", price: "~₩20,000–35,000", source: "DiningCode" },
      { name: "Jangsabu", ko: "장사부", address: "경남 밀양시 남천강변로3길 9-1", city: "Miryang", desc: "Popular Korean-Chinese restaurant for jjajangmyeon and spicy Chinese-style bibimbap.", price: "~₩8,000–13,000", source: "DiningCode" },
      { name: "Basak Kkwabaegi", ko: "바삭꽈배기", address: "경남 거제시 일운면 지세포4길 8", city: "Geoje", desc: "Chewy rice-flour twisted doughnuts, including a green-onion version. Sells out in the afternoon.", price: "~₩1,000–3,000 each", source: "DiningCode" },
    ],
  },
  {
    id: "jeju",
    name: "Jeju-do",
    ko: "제주도",
    cities: "Jeju City · Seogwipo",
    color: "#c2477c",
    intro:
      "Korea's volcanic island. Hallasan mountain, lava tubes, a sunrise crater, black pork and tangerines, about an hour's flight from Seoul.",
    attractions: [
      { name: "Hallasan National Park", ko: "한라산", city: "Jeju City", desc: "Korea's highest mountain (1,947 m). Summit trails need a reservation and a full day, shorter trails are easier.", price: "Free" },
      { name: "Seongsan Ilchulbong", ko: "성산일출봉", city: "Seogwipo", desc: "UNESCO volcanic crater on the coast. A short steep climb gives a famous sunrise view.", price: "₩5,000" },
      { name: "Manjanggul Cave", ko: "만장굴", city: "Jeju City", desc: "One of the world's longest lava tubes. It stays cool inside all year, so bring a jacket.", price: "₩4,000" },
      { name: "Jusangjeolli Cliff", ko: "주상절리대", city: "Seogwipo", desc: "Tall hexagonal basalt columns beside the sea, a short walk from the path.", price: "₩2,000" },
      { name: "Cheonjeyeon Waterfalls", ko: "천제연폭포", city: "Seogwipo", desc: "Three waterfalls in a green gorge, reached by a bridge and a short walk.", price: "₩2,500" },
      { name: "Jeongbang Waterfall", ko: "정방폭포", city: "Seogwipo", desc: "A waterfall that drops straight into the sea.", price: "₩2,000" },
      { name: "Udo Island", ko: "우도", city: "Jeju City", desc: "Small island by ferry from Seongsan Port. Rent an e-bike and ride the coast.", price: "~₩11,000 (ferry)" },
      { name: "Hyeopjae Beach", ko: "협재해수욕장", city: "Jeju City", desc: "White sand and pale blue water, with a view of Biyangdo island.", price: "Free" },
    ],
    hotels: [
      { name: "The Shilla Jeju", ko: "제주신라호텔", city: "Seogwipo", type: "Luxury", desc: "Resort hotel with sea views near Jungmun beach.", price: "₩350,000–600,000" },
      { name: "Grand Hyatt Jeju", ko: "그랜드 하얏트 제주", city: "Jeju City", type: "Luxury", desc: "Large tower hotel with a casino and shops in central Jeju City.", price: "₩250,000–400,000" },
      { name: "Lotte City Hotel Jeju", ko: "롯데시티호텔 제주", city: "Jeju City", type: "Mid-range", desc: "Comfortable city hotel, handy for the airport and Dongmun Market.", price: "₩120,000–200,000" },
      { name: "Seogwipo KAL Hotel", ko: "서귀포 KAL호텔", city: "Seogwipo", type: "Mid-range", desc: "Hillside hotel with views of the southern coast.", price: "₩130,000–220,000" },
      { name: "Jeju guesthouses", ko: "제주 게스트하우스", city: "Jeju City", type: "Budget", desc: "Friendly small guesthouses around Jeju City and the east coast.", price: "₩30,000–70,000" },
    ],
    foods: [
      { name: "Black pork BBQ", ko: "흑돼지", city: "Jeju City", desc: "Jeju's famous black pigs, grilled at your table.", price: "₩18,000–25,000 / serving" },
      { name: "Gogi-guksu", ko: "고기국수", city: "Jeju City", desc: "Noodles in a rich pork broth topped with thick slices of pork.", price: "₩9,000–11,000" },
      { name: "Hallabong tangerines", ko: "한라봉", city: "Jeju City", desc: "Large sweet citrus with a bump on top. Great as a gift.", price: "₩10,000–20,000 / box" },
      { name: "Galchi-jorim", ko: "갈치조림", city: "Jeju City", desc: "Cutlassfish braised with radish in a spicy sauce.", price: "₩30,000–50,000 / table" },
      { name: "Jeonbok-juk", ko: "전복죽", city: "Jeju City", desc: "Creamy rice porridge with abalone, a comfort food on cool days.", price: "₩15,000–20,000" },
    ],
    restaurants: [
      { name: "Dongmun Market", ko: "동문시장", city: "Jeju City", desc: "Big traditional market for seafood, tangerines and street snacks.", price: "₩5,000–15,000" },
      { name: "Seogwipo Maeil Olle Market", ko: "서귀포매일올레시장", city: "Seogwipo", desc: "Covered market with tangerine treats, fried chicken and fresh fish.", price: "₩5,000–15,000" },
      { name: "Black Pork Street", ko: "흑돼지거리", city: "Jeju City", desc: "A street of grill restaurants serving Jeju black pork.", price: "₩20,000–30,000" },
    ],
  },
];
