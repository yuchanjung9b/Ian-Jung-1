// Travel data for each of Korea's 8 provinces (도).
// Big cities are listed under the province around them (e.g. Seoul → Gyeonggi, Busan → Gyeongnam).
// Prices are rough estimates in Korean won (KRW). Update them as you learn more.
//
// To add a place, copy one entry in the right list and change the text.
//   attractions: { name, ko, desc, price }
//   hotels:      { name, ko, type: "Luxury" | "Mid-range" | "Budget", desc, price }  (price = per night, double room)
//   foods:       { name, ko, desc, price }   (price = per person)
//   restaurants: { name, ko, desc, price }   (price = per person)

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
      { name: "Gyeongbokgung Palace", ko: "경복궁", desc: "The largest Joseon-era palace. Free entry if you wear a hanbok.", price: "₩3,000" },
      { name: "Bukchon Hanok Village", ko: "북촌한옥마을", desc: "Hillside lanes of traditional houses between two palaces. Please keep quiet, people live here.", price: "Free" },
      { name: "N Seoul Tower", ko: "N서울타워", desc: "City views from Namsan mountain. Go at sunset.", price: "₩26,000 (observatory)" },
      { name: "Hwaseong Fortress", ko: "수원 화성", desc: "UNESCO-listed 18th-century fortress wall you can walk around in Suwon.", price: "₩1,000" },
      { name: "DMZ Tour", ko: "DMZ 투어", desc: "Guided day trip to the border between North and South Korea. Book ahead and bring your passport.", price: "₩60,000–100,000" },
    ],
    hotels: [
      { name: "Lotte Hotel Seoul", ko: "롯데호텔 서울", type: "Luxury", desc: "Classic luxury hotel next to Myeongdong shopping.", price: "₩350,000–550,000" },
      { name: "Nine Tree Premier Myeongdong", ko: "나인트리 프리미어 명동", type: "Mid-range", desc: "Modern rooms in the middle of Myeongdong.", price: "₩150,000–220,000" },
      { name: "Hongdae guesthouses", ko: "홍대 게스트하우스", type: "Budget", desc: "Lots of small guesthouses near the university area with music and nightlife.", price: "₩40,000–80,000" },
    ],
    foods: [
      { name: "Korean BBQ (samgyeopsal)", ko: "삼겹살", desc: "Pork belly grilled at your table, wrapped in lettuce.", price: "₩16,000–20,000 / serving" },
      { name: "Tteokbokki", ko: "떡볶이", desc: "Chewy rice cakes in a sweet and spicy sauce.", price: "₩4,000–6,000" },
      { name: "Suwon galbi", ko: "수원갈비", desc: "Large marinated beef short ribs, a Suwon specialty.", price: "₩50,000–65,000" },
      { name: "Fried chicken & beer", ko: "치맥", desc: "Korean fried chicken with beer, the classic night-out meal.", price: "₩20,000–28,000 / chicken" },
    ],
    restaurants: [
      { name: "Gwangjang Market", ko: "광장시장", desc: "Historic market famous for mung-bean pancakes (bindaetteok) and mayak gimbap.", price: "₩5,000–15,000" },
      { name: "Myeongdong Kyoja", ko: "명동교자", desc: "Famous for kalguksu (knife-cut noodle soup) and dumplings since 1966.", price: "₩11,000–13,000" },
      { name: "Bonsuwon Galbi", ko: "본수원갈비", desc: "One of the best-known Suwon galbi restaurants.", price: "₩55,000–70,000" },
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
      { name: "Seoraksan National Park", ko: "설악산국립공원", desc: "Korea's most famous mountain park, best in autumn.", price: "Free (cable car ~₩15,000)" },
      { name: "Nami Island", ko: "남이섬", desc: "Tree-lined island made famous by the drama Winter Sonata.", price: "~₩16,000 (incl. ferry)" },
      { name: "Gangneung Anmok Coffee Street", ko: "안목해변 커피거리", desc: "Beachfront street lined with cafés.", price: "Free" },
      { name: "Jumunjin Breakwater", ko: "주문진 방파제", desc: "Filming spot from the drama Goblin (Guardian).", price: "Free" },
    ],
    hotels: [
      { name: "Seamarq Hotel", ko: "씨마크 호텔", type: "Luxury", desc: "Ocean-view luxury hotel at Gyeongpo, Gangneung.", price: "₩350,000–600,000" },
      { name: "Lotte Resort Sokcho", ko: "롯데리조트 속초", type: "Mid-range", desc: "Seaside resort with an infinity pool.", price: "₩200,000–350,000" },
      { name: "Sokcho & Gangneung guesthouses", ko: "게스트하우스", type: "Budget", desc: "Simple rooms near the bus terminals and beaches.", price: "₩40,000–80,000" },
    ],
    foods: [
      { name: "Chuncheon dakgalbi", ko: "춘천 닭갈비", desc: "Spicy stir-fried chicken cooked on a big iron pan.", price: "₩14,000–17,000" },
      { name: "Makguksu", ko: "막국수", desc: "Cold buckwheat noodles, perfect in summer.", price: "₩9,000–12,000" },
      { name: "Chodang sundubu", ko: "초당순두부", desc: "Soft tofu made with seawater in Gangneung.", price: "₩10,000–13,000" },
      { name: "Dakgangjeong", ko: "닭강정", desc: "Sweet and crispy glazed fried chicken, a Sokcho favorite.", price: "₩20,000–25,000 / box" },
    ],
    restaurants: [
      { name: "Chodang Tofu Village", ko: "초당순두부마을", desc: "A whole neighborhood of tofu restaurants in Gangneung.", price: "₩10,000–15,000" },
      { name: "Sokcho Jungang Market", ko: "속초관광수산시장", desc: "Dakgangjeong, squid sundae and fresh seafood.", price: "₩5,000–25,000" },
      { name: "Chuncheon Dakgalbi Street", ko: "명동 닭갈비골목", desc: "Street full of dakgalbi restaurants in downtown Chuncheon.", price: "₩15,000–18,000" },
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
      { name: "Dodamsambong Peaks", ko: "도담삼봉", desc: "Three rock peaks rising out of the river in Danyang.", price: "Free" },
      { name: "Danyang Paragliding", ko: "단양 패러글라이딩", desc: "Tandem flight with views over the Namhan River.", price: "₩100,000–150,000" },
      { name: "Gosu Cave", ko: "고수동굴", desc: "Limestone cave with walkways through the rock formations.", price: "~₩11,000" },
      { name: "Cheongnamdae", ko: "청남대", desc: "Former presidential summer villa with lakeside gardens.", price: "~₩6,000" },
    ],
    hotels: [
      { name: "Sono Moon Danyang", ko: "소노문 단양", type: "Mid-range", desc: "Riverside resort in central Danyang.", price: "₩120,000–220,000" },
      { name: "Cheongju city hotels", ko: "청주 시내 호텔", type: "Mid-range", desc: "Business hotels near the bus terminal and airport.", price: "₩80,000–150,000" },
      { name: "Danyang pensions", ko: "단양 펜션", type: "Budget", desc: "Family-run guest houses along the river.", price: "₩60,000–120,000" },
    ],
    foods: [
      { name: "Garlic set meal", ko: "마늘정식", desc: "Danyang is famous for garlic. Many side dishes plus garlic tteokgalbi.", price: "₩15,000–25,000" },
      { name: "Olgaengi soup", ko: "올갱이국", desc: "Light soup made with freshwater snails.", price: "₩9,000–12,000" },
      { name: "Red fish cake", ko: "빨간오뎅", desc: "Spicy fish cake skewers, a Jecheon street snack.", price: "₩1,000–2,000 / skewer" },
    ],
    restaurants: [
      { name: "Danyang Gugyeong Market", ko: "단양구경시장", desc: "Garlic snacks, garlic fried chicken and local food stalls.", price: "₩5,000–20,000" },
      { name: "Jecheon Jungang Market", ko: "제천 중앙시장", desc: "Try the red fish cakes and other street food.", price: "₩2,000–10,000" },
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
      { name: "Gongsanseong Fortress", ko: "공산성", desc: "Baekje-era fortress on a hill above the river in Gongju (UNESCO).", price: "~₩1,200" },
      { name: "Buyeo Baekje sites", ko: "부여 백제유적지구", desc: "Busosanseong Fortress, Gungnamji Pond and Jeongnimsa Temple site.", price: "₩1,500–2,000" },
      { name: "Boryeong Mud Festival", ko: "보령머드축제", desc: "Huge summer festival on Daecheon Beach every July.", price: "₩10,000–15,000 (mud zone)" },
      { name: "Anmyeondo Island", ko: "안면도", desc: "Quiet beaches and famous sunsets at Kkotji Beach.", price: "Free" },
    ],
    hotels: [
      { name: "Lotte Resort Buyeo", ko: "롯데리조트 부여", type: "Mid-range", desc: "Resort near the Baekje Cultural Land.", price: "₩180,000–300,000" },
      { name: "Hotel Onoma Daejeon", ko: "호텔 오노마 대전", type: "Luxury", desc: "Modern hotel at Daejeon Expo Park.", price: "₩200,000–350,000" },
      { name: "Daecheon Beach motels", ko: "대천해수욕장 숙소", type: "Budget", desc: "Simple rooms by the beach (book early for July).", price: "₩60,000–120,000" },
    ],
    foods: [
      { name: "Lotus leaf rice", ko: "연잎밥", desc: "Rice steamed in a lotus leaf, a Buyeo specialty.", price: "₩15,000–20,000" },
      { name: "Gongju chestnut treats", ko: "공주 밤", desc: "Chestnut bread, chestnut makgeolli and more.", price: "₩2,000–10,000" },
      { name: "Daejeon kalguksu", ko: "대전 칼국수", desc: "Daejeon is known as the city of noodle soup.", price: "₩8,000–10,000" },
    ],
    restaurants: [
      { name: "Sungsimdang", ko: "성심당", desc: "Daejeon's legendary bakery since 1956. Try the fried soboro bread.", price: "₩2,000–10,000" },
      { name: "Daecheon Port seafood", ko: "대천항 수산시장", desc: "Fresh seafood, grilled clams and raw fish.", price: "₩20,000–40,000" },
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
      { name: "Jeonju Hanok Village", ko: "전주한옥마을", desc: "More than 700 traditional houses. Rent a hanbok and walk around.", price: "Free" },
      { name: "Gyeonggijeon Shrine", ko: "경기전", desc: "Shrine holding the portrait of the founder of the Joseon dynasty.", price: "₩3,000" },
      { name: "Naejangsan National Park", ko: "내장산국립공원", desc: "One of the best places in Korea to see autumn leaves.", price: "Free" },
      { name: "Gunsan Modern History Street", ko: "군산 근대역사거리", desc: "Old 1930s buildings and a retro atmosphere.", price: "Free–₩2,000" },
    ],
    hotels: [
      { name: "Lahan Hotel Jeonju", ko: "라한호텔 전주", type: "Mid-range", desc: "Right next to the Hanok Village.", price: "₩130,000–220,000" },
      { name: "Hanok stays", ko: "한옥스테이", type: "Mid-range", desc: "Sleep on the floor in a traditional Korean house.", price: "₩80,000–180,000" },
      { name: "Jeonju guesthouses", ko: "전주 게스트하우스", type: "Budget", desc: "Small guesthouses near the Hanok Village.", price: "₩40,000–70,000" },
    ],
    foods: [
      { name: "Jeonju bibimbap", ko: "전주비빔밥", desc: "Rice with many vegetables, beef and gochujang in a brass bowl.", price: "₩13,000–18,000" },
      { name: "Kongnamul gukbap", ko: "콩나물국밥", desc: "Bean sprout soup with rice, a hangover cure.", price: "₩8,000–10,000" },
      { name: "Makgeolli set", ko: "막걸리 한상", desc: "A kettle of rice wine with lots of side dishes for the table.", price: "₩20,000–30,000 / table" },
    ],
    restaurants: [
      { name: "Hankookjib", ko: "한국집", desc: "One of the oldest and most famous Jeonju bibimbap restaurants.", price: "₩15,000–18,000" },
      { name: "Sambaekjip", ko: "삼백집", desc: "Famous kongnamul gukbap restaurant.", price: "₩8,000–11,000" },
      { name: "Lee Sung Dang", ko: "이성당", desc: "Korea's oldest bakery, in Gunsan. Known for red bean and vegetable bread.", price: "₩2,000–10,000" },
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
      { name: "Suncheon Bay Wetland", ko: "순천만습지", desc: "Huge reed fields. Plus the National Garden nearby.", price: "~₩8,000 (combined ticket)" },
      { name: "Yeosu Maritime Cable Car", ko: "여수 해상케이블카", desc: "Cable car over the sea. Best at night.", price: "₩17,000–24,000" },
      { name: "Boseong Green Tea Fields", ko: "보성 녹차밭", desc: "Rolling hills covered in tea bushes.", price: "~₩4,000" },
      { name: "Juknokwon Bamboo Forest", ko: "죽녹원", desc: "Walking paths through a tall bamboo forest in Damyang.", price: "₩3,000" },
    ],
    hotels: [
      { name: "Sono Calm Yeosu", ko: "소노캄 여수", type: "Luxury", desc: "Ocean-view hotel near Yeosu Expo.", price: "₩200,000–350,000" },
      { name: "Gwangju city hotels", ko: "광주 시내 호텔", type: "Mid-range", desc: "Hotels around the Asia Culture Center.", price: "₩90,000–160,000" },
      { name: "Yeosu guesthouses", ko: "여수 게스트하우스", type: "Budget", desc: "Small rooms near the night-sea waterfront.", price: "₩40,000–80,000" },
    ],
    foods: [
      { name: "Hanjeongsik", ko: "한정식", desc: "A full table of 20+ dishes. Jeolla style is the most generous.", price: "₩20,000–40,000" },
      { name: "Gejang", ko: "게장", desc: "Raw crab marinated in soy sauce, a Yeosu favorite.", price: "₩15,000–30,000" },
      { name: "Tteokgalbi", ko: "떡갈비", desc: "Grilled minced beef patties, a Damyang specialty.", price: "₩20,000–30,000" },
      { name: "Nakji (octopus)", ko: "낙지", desc: "Small octopus dishes from Mokpo.", price: "₩15,000–30,000" },
    ],
    restaurants: [
      { name: "Yeosu Gejang Street", ko: "봉산동 게장거리", desc: "A street full of all-you-can-eat gejang restaurants.", price: "₩15,000–25,000" },
      { name: "Damyang Tteokgalbi Street", ko: "담양 떡갈비거리", desc: "Many tteokgalbi restaurants near Juknokwon.", price: "₩20,000–30,000" },
      { name: "1913 Songjeong Station Market", ko: "1913송정역시장", desc: "Retro market with modern street food in Gwangju.", price: "₩3,000–15,000" },
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
      { name: "Bulguksa Temple", ko: "불국사", desc: "Korea's most famous Buddhist temple (UNESCO).", price: "Free" },
      { name: "Donggung Palace & Wolji Pond", ko: "동궁과 월지", desc: "Beautiful at night when the pavilions light up.", price: "₩3,000" },
      { name: "Daereungwon & Cheomseongdae", ko: "대릉원 · 첨성대", desc: "Grassy royal tomb hills and Asia's oldest observatory.", price: "Free" },
      { name: "Andong Hahoe Village", ko: "안동하회마을", desc: "Living traditional village with mask dance performances (UNESCO).", price: "₩5,000" },
    ],
    hotels: [
      { name: "Lahan Select Gyeongju", ko: "라한셀렉트 경주", type: "Luxury", desc: "Lakeside resort hotel at Bomun Lake.", price: "₩180,000–350,000" },
      { name: "Gyeongju hanok stays", ko: "경주 한옥스테이", type: "Mid-range", desc: "Traditional houses near Hwangnidan-gil.", price: "₩80,000–180,000" },
      { name: "Daegu Dongseongno hotels", ko: "대구 동성로 숙소", type: "Budget", desc: "Small hotels in Daegu's shopping district.", price: "₩50,000–100,000" },
    ],
    foods: [
      { name: "Andong jjimdak", ko: "안동찜닭", desc: "Braised chicken with glass noodles in soy sauce.", price: "₩30,000–40,000 (for 2–3)" },
      { name: "Gyeongju bread", ko: "경주빵 · 황남빵", desc: "Small pastry filled with red bean paste.", price: "₩1,000 each" },
      { name: "Daegu makchang", ko: "대구 막창", desc: "Grilled pork intestines, Daegu's late-night specialty.", price: "₩12,000–16,000 / serving" },
    ],
    restaurants: [
      { name: "Hwangnam Bread (original store)", ko: "황남빵 본점", desc: "The original Gyeongju bread shop, since 1939.", price: "₩10,000–25,000 / box" },
      { name: "Andong Jjimdak Alley", ko: "안동구시장 찜닭골목", desc: "A whole alley of jjimdak restaurants in Andong's old market.", price: "₩15,000–20,000" },
      { name: "Seomun Night Market", ko: "서문시장 야시장", desc: "Daegu's biggest market with street food at night.", price: "₩3,000–10,000" },
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
      { name: "Haeundae Beach", ko: "해운대해수욕장", desc: "Busan's most famous beach, with the Sky Capsule train nearby.", price: "Free" },
      { name: "Gamcheon Culture Village", ko: "감천문화마을", desc: "Colorful hillside houses and murals.", price: "Free" },
      { name: "Haedong Yonggungsa Temple", ko: "해동용궁사", desc: "Rare temple built on the rocks by the sea.", price: "Free" },
      { name: "Tongyeong Cable Car", ko: "통영 케이블카", desc: "Views over the islands of Hallyeosu.", price: "~₩17,000" },
      { name: "Jinhae Cherry Blossom Festival", ko: "진해군항제", desc: "Korea's biggest cherry blossom festival, early April.", price: "Free" },
    ],
    hotels: [
      { name: "Paradise Hotel Busan", ko: "파라다이스호텔 부산", type: "Luxury", desc: "Right on Haeundae Beach with an ocean-view pool.", price: "₩350,000–600,000" },
      { name: "Haeundae business hotels", ko: "해운대 비즈니스호텔", type: "Mid-range", desc: "Many modern hotels a short walk from the beach.", price: "₩100,000–180,000" },
      { name: "Seomyeon & Busan Station guesthouses", ko: "서면 · 부산역 게스트하우스", type: "Budget", desc: "Cheap rooms close to the subway.", price: "₩35,000–70,000" },
    ],
    foods: [
      { name: "Dwaeji gukbap", ko: "돼지국밥", desc: "Pork and rice soup, Busan's soul food.", price: "₩10,000–12,000" },
      { name: "Milmyeon", ko: "밀면", desc: "Cold wheat noodles, a Busan summer classic.", price: "₩9,000–11,000" },
      { name: "Chungmu gimbap", ko: "충무김밥", desc: "Plain rice rolls with spicy squid and radish, from Tongyeong.", price: "₩6,000–10,000" },
      { name: "Fresh raw fish", ko: "회", desc: "Choose your fish at the market and eat it upstairs.", price: "₩30,000–60,000" },
    ],
    restaurants: [
      { name: "Jagalchi Fish Market", ko: "자갈치시장", desc: "Korea's largest seafood market.", price: "₩30,000–60,000" },
      { name: "Ssangdungi Dwaeji Gukbap", ko: "쌍둥이돼지국밥", desc: "Popular pork soup restaurant near Daeyeon Station.", price: "₩10,000–13,000" },
      { name: "Gaegeum Milmyeon", ko: "개금밀면", desc: "One of Busan's best-known milmyeon shops.", price: "₩9,000–11,000" },
    ],
  },
];
