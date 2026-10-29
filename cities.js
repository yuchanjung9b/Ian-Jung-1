// Every city (si, 시) in South Korea, grouped by province, plus the special cities listed on their own.
// Counts reflect the official lists as of 2024. A city's status can change, so update here if one is upgraded.
// "counties" (gun) lists only the counties that have places in the guide so far; add more as places are added.
// "nearby" lists special cities that sit next to a province, shown on its guide page.
// "guide" links to the matching province in guide.html when that province has a guide entry.

const SPECIAL_CITIES = [
  { name: "Seoul", ko: "서울", type: "Special City", note: "The capital" },
  { name: "Busan", ko: "부산", type: "Metropolitan City" },
  { name: "Daegu", ko: "대구", type: "Metropolitan City" },
  { name: "Incheon", ko: "인천", type: "Metropolitan City" },
  { name: "Gwangju", ko: "광주", type: "Metropolitan City" },
  { name: "Daejeon", ko: "대전", type: "Metropolitan City" },
  { name: "Ulsan", ko: "울산", type: "Metropolitan City" },
  { name: "Sejong", ko: "세종", type: "Special Self-Governing City", note: "Administrative capital" },
];

const PROVINCE_CITIES = [
  {
    name: "Gyeonggi-do", ko: "경기도", guide: "gyeonggi", nearby: ["Seoul", "Incheon"],
    cities: [
      ["Suwon", "수원"], ["Seongnam", "성남"], ["Goyang", "고양"], ["Yongin", "용인"], ["Bucheon", "부천"],
      ["Ansan", "안산"], ["Anyang", "안양"], ["Namyangju", "남양주"], ["Hwaseong", "화성"], ["Pyeongtaek", "평택"],
      ["Uijeongbu", "의정부"], ["Siheung", "시흥"], ["Paju", "파주"], ["Gimpo", "김포"], ["Gwangmyeong", "광명"],
      ["Gwangju (Gyeonggi)", "광주"], ["Gunpo", "군포"], ["Hanam", "하남"], ["Osan", "오산"], ["Icheon", "이천"],
      ["Anseong", "안성"], ["Uiwang", "의왕"], ["Yangju", "양주"], ["Guri", "구리"], ["Pocheon", "포천"],
      ["Dongducheon", "동두천"], ["Gwacheon", "과천"], ["Yeoju", "여주"],
    ],
  },
  {
    name: "Gangwon-do", ko: "강원도", guide: "gangwon",
    cities: [["Chuncheon", "춘천"], ["Wonju", "원주"], ["Gangneung", "강릉"], ["Donghae", "동해"], ["Taebaek", "태백"], ["Sokcho", "속초"], ["Samcheok", "삼척"]],
  },
  {
    name: "Chungcheongbuk-do", ko: "충청북도", guide: "chungbuk", counties: [["Danyang", "단양"]], nearby: ["Sejong"],
    cities: [["Cheongju", "청주"], ["Chungju", "충주"], ["Jecheon", "제천"]],
  },
  {
    name: "Chungcheongnam-do", ko: "충청남도", guide: "chungnam", counties: [["Buyeo", "부여"], ["Taean", "태안"]], nearby: ["Daejeon", "Sejong"],
    cities: [["Cheonan", "천안"], ["Gongju", "공주"], ["Boryeong", "보령"], ["Asan", "아산"], ["Seosan", "서산"], ["Nonsan", "논산"], ["Gyeryong", "계룡"], ["Dangjin", "당진"]],
  },
  {
    name: "Jeollabuk-do", ko: "전북특별자치도", guide: "jeonbuk",
    cities: [["Jeonju", "전주"], ["Gunsan", "군산"], ["Iksan", "익산"], ["Jeongeup", "정읍"], ["Namwon", "남원"], ["Gimje", "김제"]],
  },
  {
    name: "Jeollanam-do", ko: "전라남도", guide: "jeonnam", counties: [["Damyang", "담양"], ["Boseong", "보성"]], nearby: ["Gwangju"],
    cities: [["Mokpo", "목포"], ["Yeosu", "여수"], ["Suncheon", "순천"], ["Naju", "나주"], ["Gwangyang", "광양"]],
  },
  {
    name: "Gyeongsangbuk-do", ko: "경상북도", guide: "gyeongbuk", nearby: ["Daegu"],
    cities: [
      ["Pohang", "포항"], ["Gyeongju", "경주"], ["Gimcheon", "김천"], ["Andong", "안동"], ["Gumi", "구미"],
      ["Yeongju", "영주"], ["Yeongcheon", "영천"], ["Sangju", "상주"], ["Mungyeong", "문경"], ["Gyeongsan", "경산"],
    ],
  },
  {
    name: "Gyeongsangnam-do", ko: "경상남도", guide: "gyeongnam", counties: [["Hadong", "하동"], ["Uiryeong", "의령"], ["Namhae", "남해"]], nearby: ["Busan", "Ulsan"],
    cities: [["Changwon", "창원"], ["Jinju", "진주"], ["Tongyeong", "통영"], ["Sacheon", "사천"], ["Gimhae", "김해"], ["Miryang", "밀양"], ["Geoje", "거제"], ["Yangsan", "양산"]],
  },
  {
    name: "Jeju-do", ko: "제주특별자치도", guide: "jeju",
    cities: [["Jeju City", "제주시"], ["Seogwipo", "서귀포시"]],
  },
];
