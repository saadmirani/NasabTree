export const translations = {
   en: {
      // Navbar
      nasabTree: "NasabTree",

      // Menu Items
      home: "Home",
      shajraESaadaat: "Shajra-e-Saadaat",
      qasbaMiranBigha: "Qasba Miran Bigha",
      qasbaSimla: "Qasba Simla",
      qasbaDeora: "Qasba Deora",
      books: "Books",
      ursCalendar: "Urs Calendar",
      khanqahList: "Khanqah List",
      graveyards: "Graveyards",
      contactUs: "Contact Us",

      // Home Page
      currentFocus: "Exploring the Genealogies of Aal-e-Miran",
      welcomeMessage: "Documenting the spiritual legacy and family histories of the revered Saadat families",

      // Urs Calendar
      upcomingUrs: "Upcoming Urs",
      threeMonthOverview: "Three Month Overview",
      noUrsEvents: "No Urs events this month",

      // Khanqah List
      fehristEKhanqah: "Fehrist-e-Khanqah Auliya-e-Karaam",
      searchByNameCityState: "Search by name, city, or state...",
      noKhanqahsFound: "No Khanqahs found",

      // Khanqah Details
      yearOfEstablishment: "Year of Establishment",
      founder: "Founder",
      order: "Order",
      sajjadaNashinName: "Sajjada Nashin Name",
      currentSajjadaNashin: "Current Sajjada Nashin",
      address: "Address",
      city: "City",
      state: "State",
      country: "Country",
      phone: "Phone",
      email: "Email",
      about: "About",
      viewOnGoogleMaps: "View on Google Maps",
   },

   ur: {
      // Navbar
      nasabTree: "نسب ٹری",

      // Menu Items
      home: "گھر",
      shajraESaadaat: "شجرہ اِ سادات",
      qasbaMiranBigha: "قصبہ میران بیگھ",
      qasbaSimla: "قصبہ سملہ",
      qasbaDeora: "قصبہ ڈیورہ",
      books: "کتابیں",
      ursCalendar: "عرس کیلنڈر",
      khanqahList: "خانقاہ کی فہرست",
      graveyards: "قبرستانیں",
      contactUs: "رابطہ کریں",

      // Home Page
      currentFocus: "آل ِ میران کے نسب ناموں کی تحقیق",
      welcomeMessage: "معزز سادات خاندانوں کی روحانی میراث اور خاندانی تاریخ کو دستاویز کرنا",

      // Urs Calendar
      upcomingUrs: "آنے والے عرس",
      threeMonthOverview: "تین ماہ کا جائزہ",
      noUrsEvents: "اس ماہ میں کوئی عرس کی تقریب نہیں",

      // Khanqah List
      fehristEKhanqah: "فہرست ِ خانقاہ اولیاء ِ کرام",
      searchByNameCityState: "نام، شہر، یا ریاست سے تلاش کریں...",
      noKhanqahsFound: "کوئی خانقاہ نہیں ملی",

      // Khanqah Details
      yearOfEstablishment: "قیام کا سال",
      founder: "بانی",
      order: "طریقت",
      sajjadaNashinName: "سجادہ نشین کا نام",
      currentSajjadaNashin: "موجودہ سجادہ نشین",
      address: "پتہ",
      city: "شہر",
      state: "ریاست",
      country: "ملک",
      phone: "فون",
      email: "ای میل",
      about: "تعارف",
      viewOnGoogleMaps: "گوگل میپ پر دیکھیں",
   }
};

export function t(key, language = "en") {
   return translations[language]?.[key] || translations.en[key] || key;
}
