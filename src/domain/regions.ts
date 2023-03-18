export type Region = (typeof regions)[number];

// Simferopol and Luhansk are missing from regions.csv, so they are not included in calculations
export const RegionEnum = Object.freeze({
  "1": "Chernivtsi",
  "2": "Lutsk",
  "3": "Vinnytsia",
  "4": "Dnipro",
  "5": "Donetsk",
  "6": "Zhytomyr",
  "7": "Uzhgorod",
  "8": "Zaporozhye",
  "9": "Kyiv",
  "10": "Kropyvnytskyi",
  "12": "Lviv",
  "13": "Mykolaiv",
  "14": "Odesa",
  "15": "Poltava",
  "16": "Rivne",
  "17": "Sumy",
  "18": "Ternopil",
  "19": "Kharkiv",
  "20": "Kherson",
  "21": "Khmelnytskyi",
  "22": "Cherkasy",
  "23": "Chernihiv",
  "24": "Ivano-Frankivsk"
  // "25": "Simferopol",
  // "26": "Luhansk",
})

export const regions = Object.values(RegionEnum);
