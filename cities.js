// Every city (si, 시) in South Korea, grouped by province, plus the special cities listed on their own.
// Counts reflect the official lists as of 2024. A city's status can change, so update here if one is upgraded.
// Cities are [English, Korean, latitude, longitude]. Coordinates are approximate city centers.
// "counties" (gun) lists only the counties that have places in the guide so far; add more as places are added.
// Places in special cities are stored under the nearby province in data.js (tagged with the special city).
// "guide" links to the matching province in guide.html when that province has a guide entry.

const SPECIAL_CITIES = [
  { name: "Seoul", ko: "서울", lat: 37.57, lng: 126.98, type: "Special City", note: "The capital" },
  { name: "Busan", ko: "부산", lat: 35.18, lng: 129.08, type: "Metropolitan City" },
  { name: "Daegu", ko: "대구", lat: 35.87, lng: 128.6, type: "Metropolitan City" },
  { name: "Incheon", ko: "인천", lat: 37.46, lng: 126.71, type: "Metropolitan City" },
  { name: "Gwangju", ko: "광주", lat: 35.16, lng: 126.85, type: "Metropolitan City" },
  { name: "Daejeon", ko: "대전", lat: 36.35, lng: 127.38, type: "Metropolitan City" },
  { name: "Ulsan", ko: "울산", lat: 35.54, lng: 129.31, type: "Metropolitan City" },
  { name: "Sejong", ko: "세종", lat: 36.48, lng: 127.29, type: "Special Self-Governing City", note: "Administrative capital" },
];

const PROVINCE_CITIES = [
  {
    name: "Gyeonggi-do", ko: "경기도", guide: "gyeonggi",
    cities: [
      ["Suwon", "수원", 37.26, 127.03], ["Seongnam", "성남", 37.42, 127.13], ["Goyang", "고양", 37.66, 126.83], ["Yongin", "용인", 37.24, 127.18], ["Bucheon", "부천", 37.5, 126.77],
      ["Ansan", "안산", 37.32, 126.83], ["Anyang", "안양", 37.39, 126.95], ["Namyangju", "남양주", 37.64, 127.22], ["Hwaseong", "화성", 37.2, 126.83], ["Pyeongtaek", "평택", 36.99, 127.11],
      ["Uijeongbu", "의정부", 37.74, 127.05], ["Siheung", "시흥", 37.38, 126.8], ["Paju", "파주", 37.76, 126.78], ["Gimpo", "김포", 37.62, 126.72], ["Gwangmyeong", "광명", 37.48, 126.86],
      ["Gwangju (Gyeonggi)", "광주", 37.43, 127.26], ["Gunpo", "군포", 37.36, 126.94], ["Hanam", "하남", 37.54, 127.21], ["Osan", "오산", 37.15, 127.07], ["Icheon", "이천", 37.27, 127.44],
      ["Anseong", "안성", 37.01, 127.28], ["Uiwang", "의왕", 37.34, 126.97], ["Yangju", "양주", 37.79, 127.05], ["Guri", "구리", 37.6, 127.14], ["Pocheon", "포천", 37.89, 127.2],
      ["Dongducheon", "동두천", 37.9, 127.06], ["Gwacheon", "과천", 37.43, 126.99], ["Yeoju", "여주", 37.3, 127.64],
    ],
  },
  {
    name: "Gangwon-do", ko: "강원도", guide: "gangwon",
    cities: [["Chuncheon", "춘천", 37.88, 127.73], ["Wonju", "원주", 37.34, 127.95], ["Gangneung", "강릉", 37.75, 128.88], ["Donghae", "동해", 37.52, 129.11], ["Taebaek", "태백", 37.16, 128.99], ["Sokcho", "속초", 38.21, 128.59], ["Samcheok", "삼척", 37.45, 129.17]],
  },
  {
    name: "Chungcheongbuk-do", ko: "충청북도", guide: "chungbuk", counties: [["Danyang", "단양", 36.98, 128.37]],
    cities: [["Cheongju", "청주", 36.64, 127.49], ["Chungju", "충주", 36.99, 127.93], ["Jecheon", "제천", 37.13, 128.19]],
  },
  {
    name: "Chungcheongnam-do", ko: "충청남도", guide: "chungnam", counties: [["Buyeo", "부여", 36.28, 126.91], ["Taean", "태안", 36.75, 126.3]],
    cities: [["Cheonan", "천안", 36.82, 127.11], ["Gongju", "공주", 36.45, 127.12], ["Boryeong", "보령", 36.33, 126.61], ["Asan", "아산", 36.79, 127.0], ["Seosan", "서산", 36.78, 126.45], ["Nonsan", "논산", 36.2, 127.09], ["Gyeryong", "계룡", 36.27, 127.25], ["Dangjin", "당진", 36.89, 126.65]],
  },
  {
    name: "Jeollabuk-do", ko: "전북특별자치도", guide: "jeonbuk",
    cities: [["Jeonju", "전주", 35.82, 127.15], ["Gunsan", "군산", 35.97, 126.74], ["Iksan", "익산", 35.95, 126.96], ["Jeongeup", "정읍", 35.57, 126.86], ["Namwon", "남원", 35.42, 127.39], ["Gimje", "김제", 35.8, 126.88]],
  },
  {
    name: "Jeollanam-do", ko: "전라남도", guide: "jeonnam", counties: [["Damyang", "담양", 35.32, 126.99], ["Boseong", "보성", 34.77, 127.08]],
    cities: [["Mokpo", "목포", 34.81, 126.39], ["Yeosu", "여수", 34.76, 127.66], ["Suncheon", "순천", 34.95, 127.49], ["Naju", "나주", 35.02, 126.71], ["Gwangyang", "광양", 34.94, 127.7]],
  },
  {
    name: "Gyeongsangbuk-do", ko: "경상북도", guide: "gyeongbuk",
    cities: [
      ["Pohang", "포항", 36.02, 129.34], ["Gyeongju", "경주", 35.86, 129.22], ["Gimcheon", "김천", 36.14, 128.11], ["Andong", "안동", 36.57, 128.73], ["Gumi", "구미", 36.12, 128.34],
      ["Yeongju", "영주", 36.81, 128.62], ["Yeongcheon", "영천", 35.97, 128.94], ["Sangju", "상주", 36.41, 128.16], ["Mungyeong", "문경", 36.59, 128.19], ["Gyeongsan", "경산", 35.83, 128.74],
    ],
  },
  {
    name: "Gyeongsangnam-do", ko: "경상남도", guide: "gyeongnam", counties: [["Hadong", "하동", 35.07, 127.75], ["Uiryeong", "의령", 35.32, 128.26], ["Namhae", "남해", 34.84, 127.89]],
    cities: [["Changwon", "창원", 35.23, 128.68], ["Jinju", "진주", 35.18, 128.11], ["Tongyeong", "통영", 34.85, 128.43], ["Sacheon", "사천", 35.0, 128.06], ["Gimhae", "김해", 35.23, 128.88], ["Miryang", "밀양", 35.5, 128.75], ["Geoje", "거제", 34.88, 128.62], ["Yangsan", "양산", 35.34, 129.04]],
  },
  {
    name: "Jeju-do", ko: "제주특별자치도", guide: "jeju",
    cities: [["Jeju City", "제주시", 33.5, 126.53], ["Seogwipo", "서귀포시", 33.25, 126.56]],
  },
];
