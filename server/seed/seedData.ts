import {
  ITemple,
  IPooja,
  IScheduleItem,
  IFacility,
  IParking,
  IPrasadamItem,
  IDonationItem,
  IHospital,
  IEmergencyContact,
  IGuideline,
  IAnnouncement,
  IUser,
  IFavorite,
  IBooking,
  ICalendarEvent,
  IVisitPlan,
  IFeedback
} from '../models/types.js';

// Pre-hashed development-only demo passwords.
// Generated using bcryptjs salt rounds = 10
export const initialUsers: IUser[] = [
  {
    _id: 'user_admin_01',
    name: 'Temple Administrator',
    email: 'admin@templeease.org',
    phone: '+91 98480 12345',
    password: '$2b$10$f9w0Pv5Ek1yDSRLq0Bgfuu/1sAGJuzoc4jxgxu4Ks5ioVuxU8hTTm', // Admin@1234
    role: 'ADMIN',
    favorites: ['temple_tirumala_01', 'temple_srisailam_02', 'temple_meenakshi_03', 'temple_jagannath_04'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'user_devotee_01',
    name: 'Ramesh Sharma',
    email: 'devotee@example.com',
    phone: '+91 98765 43210',
    password: '$2b$10$T0u0oFv5cRcgYPwPuzK1S.knSGe.jmgFmkTFWz4fug5R/5vWaYQbq', // Devotee@123
    role: 'USER',
    favorites: ['temple_tirumala_01', 'temple_somnath_05'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialTemples: ITemple[] = [
  {
    _id: 'temple_tirumala_01',
    slug: 'tirumala-venkateswara',
    name: 'Sri Venkateswara Temple',
    subtitle: 'Kaliyuga Vaikuntham on the Sacred Seshachala Hills',
    deity: 'Lord Venkateswara',
    state: 'Andhra Pradesh',
    district: 'Tirupati',
    city: 'Tirumala',
    address: 'S Mada St, Tirumala, Tirupati, Andhra Pradesh 517504',
    pinCode: '517504',
    latitude: 13.6833,
    longitude: 79.3497,
    description: 'Sri Venkateswara Temple is an ancient Vaishnavite shrine situated on Venkatadri, the seventh peak of the sacred Tirumala hill range. Revered as the spiritual heart of millions of devotees worldwide, the deity Lord Srinivasa is manifested in an imposing swayambhu idol granting divine blessings to all pilgrims.',
    history: 'Recorded in Tamil Sangam literature as Vengadam, the temple was nurtured with patronages from the Pallava, Chola, Pandyan, and Vijayanagara empires. Emperor Sri Krishnadevaraya presented the magnificent golden vimana (Ananda Nilayam) and golden crowns that grace the sanctum to this day.',
    significance: 'One of the most sacred 108 Divya Desams and the world\'s most visited spiritual shrine. It is believed that Lord Vishnu assumed this form to redeem mankind from the trials of Kali Yuga.',
    architecture: 'Classical Dravidian rock and granite architecture featuring the three-tiered golden Ananda Nilayam vimanam over the mulasthanam and exquisite bronze sculptures.',
    traditions: 'Vaikhanasa Agama tradition followed without interruption. Devotees offer hair tonsuring (Kalyanakatta) and receive the sacred Tirupati Laddu Prasadam.',
    festivals: 'Annual Srivari Brahmotsavam (Navaratri), Vaikunta Ekadasi, Rathasapthami, and Ugadi.',
    morningTimings: '03:00 AM – 12:00 PM',
    eveningTimings: '12:00 PM – 11:30 PM',
    darshanTimings: 'Sarva Darshan: 08:30 AM – 11:00 PM | Special Entry (SED ₹300): 09:00 AM – 06:00 PM',
    specialDayTimings: 'Continuous 24-hour darshan arrangements during annual Brahmotsavams and Vaikunta Ekadasi.',
    phone: '+91 877 227 7777',
    email: 'helpdesk@tirumala.org',
    website: 'https://www.tirumala.org',
    officialWebsite: 'https://ttdsevaonline.com',
    sourceUrl: 'https://www.tirumala.org/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Traditional Dhoti with Angavastram or Kurta-Pyjama. Strictly no jeans, shorts, T-shirts, or lungis.',
    dressCodeWomen: 'Saree, Half-Saree (Pavadai), or Chudidar/Salwar Kameez with Dupatta. No Western clothing or sleeveless tops.',
    rules: [
      'Devotees must carry original photo ID matching booking name (Aadhaar/Passport).',
      'Electronic devices, mobile phones, cameras, and luggage must be deposited at free PAC counters.',
      'Maintain utmost silence and queue etiquette through Vaikuntam Queue Complexes.',
      'Only traditional Indian ethnic attire is permitted inside Vaikuntam compartments.'
    ],
    photographyRule: 'Strictly prohibited inside the Anandha Nilayam complex, queue lines, and sanctum.',
    footwearRule: 'Free safe footwear counters available at Vaikuntam Complex entrance, Lepakshi point, and Central Reception.',
    queueInstructions: 'Pilgrims are routed via Vaikuntam Queue Complex (VQC I & II) with free milk, khichdi, and medical care.',
    bannerImage: '/images/temple_tirumala.jpg',
    sanctumImage: '/images/temple_sanctum_courtyard_1794224328434.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'Sri Venkateswara Nitya Annadanam Trust, Annamaiah Bhavan, Tirumala',
      officialUrl: 'https://ttdsevaonline.com/donations',
      instructions: 'Official e-Hundi and trust contributions receive Section 80G tax exemptions under Indian Income Tax Act.',
      trustName: 'TTD Sri Venkateswara Nitya Annadanam Trust'
    },
    prasadamSummary: 'World-famous GI-tagged Tirupati Laddu, Pulihora, Daddojanam, and 24-hour free Tarigonda Vengamamba Annaprasadam.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_srisailam_02',
    slug: 'srisailam-mallikarjuna',
    name: 'Mallikarjuna Swamy Temple',
    subtitle: 'Sacred Jyotirlinga and Shakti Peeth on Nallamala Hills',
    deity: 'Lord Shiva',
    state: 'Andhra Pradesh',
    district: 'Nandyal',
    city: 'Srisailam',
    address: 'Srisailam Devasthanam, Srisailam, Andhra Pradesh 518101',
    pinCode: '518101',
    latitude: 16.0741,
    longitude: 78.8686,
    description: 'Situated on the pristine flat top of Nallamala Hills overlooking the River Krishna (Patalaganga), Srisailam is uniquely venerated as one of the 12 sacred Jyotirlingas and one of the 18 Maha Shakti Peethas (Bhramaramba Devi).',
    history: 'Mentioned in Mahabharata and Skanda Purana, patronized by the Satavahanas, Ikshvakus, Kakatiyas, and Chhatrapati Shivaji Maharaj who built the northern gopuram in 1677.',
    significance: 'One of the rarest shrines where both Lord Shiva (Mallikarjuna) and Parvati (Bhramaramba) abide in highest supreme cosmic manifestations.',
    architecture: 'Fortified stone temple complex surrounded by a magnificent 6-meter high sculpted wall depicting Hindu epics and cavalry.',
    traditions: 'Devotees of all backgrounds are uniquely permitted to touch and perform abhishekam directly on the sacred Mallikarjuna Jyotirlingam during designated hours.',
    festivals: 'Maha Shivaratri Brahmotsavam (February/March), Kartika Masam, Ugadi festival.',
    morningTimings: '04:30 AM – 03:30 PM',
    eveningTimings: '05:30 PM – 10:00 PM',
    darshanTimings: 'Sarva Darshan: 06:00 AM – 02:00 PM, 06:00 PM – 09:30 PM | Sparsha Darshan (Touching Lingam): designated morning and evening slots.',
    specialDayTimings: 'Special 24-hour queue arrangements during Maha Shivaratri with free milk and buttermilk for walking yatris.',
    phone: '+91 8524 288888',
    email: 'support@srisailadevasthanam.org',
    website: 'https://www.srisailadevasthanam.org',
    officialWebsite: 'https://www.srisailadevasthanam.org',
    sourceUrl: 'https://www.srisailadevasthanam.org/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Traditional Dhoti and Uttariyam. Sparsha Darshan requires bare torso or dhoti only.',
    dressCodeWomen: 'Saree or Chudidar with Dupatta.',
    rules: [
      'Sparsha Darshan requires advance online registration and strict traditional attire.',
      'Mobiles, smartwatches, and leather goods are prohibited in the inner parikrama.',
      'Pilgrims traveling through the Tiger Reserve Ghat road must adhere to forest gate timings (06:00 AM to 09:00 PM).'
    ],
    photographyRule: 'Prohibited in the inner praharam and sanctum area.',
    footwearRule: 'Free footwear counters available at North and East Gopuram gates.',
    queueInstructions: 'Regular queue complex at Raja Gopuram. Special ticket queue at Chandravathi complex.',
    bannerImage: '/images/temple_srisailam.jpg',
    sanctumImage: '/images/temple_sanctum_courtyard_1794224328434.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'Central Administrative Office, Srisailam Devasthanam',
      officialUrl: 'https://www.srisailadevasthanam.org/donations',
      instructions: 'Online donations accepted for Annadana Trust and Gosamrakshana Trust.',
      trustName: 'Sri Mallikarjuna Swamy Nitya Annadana Trust'
    },
    prasadamSummary: 'Srisailam Laddu Prasadam, Pulihora, and continuous Annadanam at Nitya Annapurna Bhavan.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_meenakshi_03',
    slug: 'madurai-meenakshi-amman',
    name: 'Meenakshi Amman Temple',
    subtitle: 'The Architectural Wonder of the Pandyan Capital',
    deity: 'Goddess Durga',
    state: 'Tamil Nadu',
    district: 'Madurai',
    city: 'Madurai',
    address: 'Madurai Main, Madurai, Tamil Nadu 625001',
    pinCode: '625001',
    latitude: 9.9195,
    longitude: 78.1193,
    description: 'A monument to classical Dravidian artistry and devotion, Meenakshi Sundareswarar Temple stands at the geographic and cultural heart of Madurai on the banks of River Vaigai. The temple is dedicated to Meenakshi, a form of Parvati, and her consort Sundareswarar (Shiva).',
    history: 'With origins dating back over 2,500 years, the present towering complex was largely rebuilt by the Nayak rulers of Madurai during the 16th and 17th centuries under King Tirumala Nayaka.',
    significance: 'One of the most famous Shakti centres in India, where tradition holds that Goddess Meenakshi is worshipped before Lord Shiva, honoring divine feminine primacy.',
    architecture: 'Fourteen monumental gopurams reaching up to 52 meters, adorned with tens of thousands of sculpted mythological figurines, and the celebrated Hall of Thousand Pillars (Ayiram Kaal Mandapam).',
    traditions: 'Every night at 09:00 PM, an ornate silver palanquin procession conveys Lord Sundareswarar\'s icon to Goddess Meenakshi\'s bedchamber amidst Nadaswaram chants.',
    festivals: 'Chithirai Festival (April/May) celebrating the divine celestial wedding of Meenakshi and Sundareswarar.',
    morningTimings: '05:00 AM – 12:30 PM',
    eveningTimings: '04:00 PM – 10:00 PM',
    darshanTimings: 'General Darshan: 06:00 AM – 12:00 PM, 04:30 PM – 09:30 PM | Special Darshan counters at East and South Towers.',
    specialDayTimings: 'Early morning 04:00 AM opening during Chithirai festival and Navaratri Brahmotsavam.',
    phone: '+91 452 234 4360',
    email: 'info@maduraimeenakshi.org',
    website: 'https://maduraimeenakshi.hrce.tn.gov.in',
    officialWebsite: 'https://maduraimeenakshi.hrce.tn.gov.in',
    sourceUrl: 'https://maduraimeenakshi.hrce.tn.gov.in/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Traditional Dhoti or Kurta-Pyjama. Strictly no jeans, shorts, lungis, or hats.',
    dressCodeWomen: 'Saree, Half-Saree, or Chudidar with Dupatta.',
    rules: [
      'Mobile phones are strictly prohibited inside the temple premises following Madras High Court guidelines; deposit at outer cloaking counters.',
      'Only Hindu devotees are permitted into the inner sanctum sanctorum.',
      'Maintain solemn queue discipline in the golden lotus pond corridor.'
    ],
    photographyRule: 'Strictly prohibited inside the temple. Hall of Thousand Pillars has designated museum viewing.',
    footwearRule: 'Free footwear counters situated at all four massive Raja Gopuram entry towers.',
    queueInstructions: 'Separate lines for Meenakshi Sannidhi and Sundareswarar Sannidhi with clear signboards in Tamil and English.',
    bannerImage: '/images/temple_meenakshi.jpg',
    sanctumImage: '/images/temple_meenakshi.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'HR&CE Office, East Tower Entry, Madurai',
      officialUrl: 'https://maduraimeenakshi.hrce.tn.gov.in',
      instructions: 'Donations to temple golden chariot fund and daily Annadhanam scheme supported via HR&CE portal.',
      trustName: 'Arulmigu Meenakshi Sundareswarar Temple Trust'
    },
    prasadamSummary: 'Panchamirtham, Sakkarai Pongal, Puliyodarai, and noon Annadhanam meals for pilgrims.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_jagannath_04',
    slug: 'puri-jagannath-temple',
    name: 'Jagannath Temple',
    subtitle: 'The Supreme Abode of the Lord of the Universe (Char Dham)',
    deity: 'Lord Krishna',
    state: 'Odisha',
    district: 'Puri',
    city: 'Puri',
    address: 'Grand Road, Puri, Odisha 752001',
    pinCode: '752001',
    latitude: 19.8048,
    longitude: 85.8179,
    description: 'The sacred Jagannath Temple in Puri is one of the four cardinal Char Dham pilgrimage destinations of Hinduism. Revering Lord Jagannath, his brother Balabhadra, and sister Subhadra in distinctive sacred neem-wood deities, the holy complex on the Bay of Bengal represents the peak of Odishan spiritual life.',
    history: 'Built by King Anantavarman Chodaganga Deva of the Eastern Ganga dynasty in the 12th century CE, the temple has preserved uninterrupted ritual customs for nine centuries.',
    significance: 'Supreme pilgrimage site representing equality in the eyes of God, where Mahaprasad is prepared in the world\'s largest traditional earthen-pot kitchen and shared universally.',
    architecture: 'Classical Kalinga architectural masterpiece featuring a 65-meter soaring curvilinear shikhara (Vimana), crowned by the 8-spoke sacred Neelachakra and Patitapavana flag.',
    traditions: 'World-renowned annual Ratha Yatra (Chariot Festival) where the triad deities emerge from the sanctum onto massive wooden chariots to bless millions along the Grand Road.',
    festivals: 'Puri Ratha Yatra (June/July), Snana Yatra, Chandan Yatra, and Navakalevara (sacred recreation of deities).',
    morningTimings: '05:00 AM – 01:00 PM',
    eveningTimings: '04:00 PM – 11:30 PM',
    darshanTimings: 'Mangala Alati: 05:30 AM | Sahanamela (Free Public Darshan): designated times between Nitis | Sandhya Alati: 07:00 PM | Pahuda: 11:30 PM.',
    specialDayTimings: 'Ratha Yatra and festival days follow dynamic temple Sevayat Niti timetables published daily by Shree Jagannatha Temple Administration (SJTA).',
    phone: '+91 6752 222002',
    email: 'contact@shreejagannatha.in',
    website: 'https://shreejagannatha.in',
    officialWebsite: 'https://shreejagannatha.in',
    sourceUrl: 'https://shreejagannatha.in/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Traditional Dhoti and Kurta. Western attire discouraged in inner courtyard.',
    dressCodeWomen: 'Saree, Salwar Kameez with Dupatta.',
    rules: [
      'Strictly non-Hindus are not permitted into the temple complex as per century-old temple codes.',
      'Cameras, mobile phones, leather belts, shoes, and electronic gadgets are strictly banned inside Singhadwara.',
      'Only earthen-pot Mahaprasad authorized by the Suara Nijog is permitted in Ananda Bazar.'
    ],
    photographyRule: 'Prohibited within the fortified Meghanada Pacheri walls.',
    footwearRule: 'Free footwear counters located at the Lions Gate (Singhadwara) and Western Gate (Vyaghradwara).',
    queueInstructions: 'Entry through Singhadwara (Lion\'s Gate) via the 22 holy steps (Baisi Pahacha). Exit through North or South gates.',
    bannerImage: '/images/temple_jagannath.jpg',
    sanctumImage: '/images/temple_jagannath.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'SJTA Office, Grand Road, Puri',
      officialUrl: 'https://shreejagannatha.in/donation',
      instructions: 'Online e-Hundi and corpus fund donations are managed directly by Shree Jagannatha Temple Managing Committee.',
      trustName: 'Shree Jagannatha Temple Administration Fund'
    },
    prasadamSummary: 'Sacred Mahaprasad cooked in the divine Rosaghara (largest kitchen in the world) available fresh daily at Ananda Bazar.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_somnath_05',
    slug: 'somnath-temple-gujarat',
    name: 'Somnath Temple',
    subtitle: 'The Eternal First of the Twelve Jyotirlingas',
    deity: 'Lord Shiva',
    state: 'Gujarat',
    district: 'Gir Somnath',
    city: 'Prabhas Patan',
    address: 'Somnath Mandir Rd, Prabhas Patan, Gujarat 362268',
    pinCode: '362268',
    latitude: 20.8880,
    longitude: 70.4013,
    description: 'Perched on the windswept Arabian Sea shore in Saurashtra, the grand Somnath Temple is revered as the Adi Jyotirlinga (the first among twelve supreme light-pillars of Lord Shiva). Known throughout history as the \'Shrine Eternal\', its resilient reconstruction by Sardar Vallabhbhai Patel stands as a glowing monument to spiritual indomitability.',
    history: 'The temple is described in Rigveda, Skanda Purana, and historical chronicles. After repeated destructions across centuries, the majestic present temple was consecrated in May 1951 by India\'s first President, Dr. Rajendra Prasad.',
    significance: 'First Jyotirlinga where the Moon God (Soma) performed penance to rid himself of a curse, obtaining rejuvenation from Lord Shiva.',
    architecture: 'Kailash Mahameru Prasad style of Chalukyan/Solanki temple architecture with intricate stone carvings, seven-story shikhara, and the famous arrow pillar (Bān-Stambha).',
    traditions: 'Daily sound and light projection (Jay Somnath) narrating the history across millennia, and coastal sea-water Abhishekams.',
    festivals: 'Maha Shivaratri, Kartika Purnima, and Shravan month with thousands of pilgrims undertaking foot pilgrimages.',
    morningTimings: '06:00 AM – 10:00 PM',
    eveningTimings: 'Open continuously from 06:00 AM until 10:00 PM without midday closure',
    darshanTimings: 'Aarti: 07:00 AM (Pratah), 12:00 PM (Madhyahna), 07:00 PM (Sandhya) | Sound & Light Show: 08:00 PM – 09:00 PM.',
    specialDayTimings: 'During Shravan month and Shivaratri, doors remain open until 02:00 AM.',
    phone: '+91 2876 231200',
    email: 'info@somnath.org',
    website: 'https://somnath.org',
    officialWebsite: 'https://somnath.org',
    sourceUrl: 'https://somnath.org/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Decent traditional attire. Dhoti or Kurta-Pyjama preferred.',
    dressCodeWomen: 'Saree or Salwar Suit.',
    rules: [
      'High security screening at entry plaza; mobile phones, bags, and electronic items must be deposited in digital lockers.',
      'Touching the Jyotirlinga is restricted to temple priests during sacred Puja rituals.'
    ],
    photographyRule: 'Photography and recording devices strictly prohibited in the security perimeter.',
    footwearRule: 'Spacious automated shoe deposit counters available at the main promenade.',
    queueInstructions: 'Seamless barrier-free queue complex with air-conditioned holding halls and wheelchair ramps for senior citizens.',
    bannerImage: '/images/temple_somnath.jpg',
    sanctumImage: '/images/temple_somnath.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'Shree Somnath Trust Reception Centre',
      officialUrl: 'https://somnath.org/online-donation',
      instructions: 'Donations eligible under Section 80G. Prasadam delivery and online Puja booking supported.',
      trustName: 'Shree Somnath Trust'
    },
    prasadamSummary: 'Fresh Motichoor Laddu, Peda Prasadam, and subsidized pilgrim meals at Somnath Bhojanalaya.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_kashi_06',
    slug: 'kashi-vishwanath-varanasi',
    name: 'Kashi Vishwanath Temple',
    subtitle: 'The Sacred Golden Spire of Moksha on River Ganga',
    deity: 'Lord Shiva',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    city: 'Varanasi',
    address: 'Lahori Tola, Varanasi, Uttar Pradesh 221001',
    pinCode: '221001',
    latitude: 25.3109,
    longitude: 83.0107,
    description: 'Located in the eternal holy city of Varanasi on the sacred western bank of River Ganga, Kashi Vishwanath is one of the holiest Jyotirlingas. The temple connects directly to the Ghats through the magnificent transformed Kashi Vishwanath Dham Corridor.',
    history: 'Constructed by Maharani Ahilyabai Holkar of Indore in 1780; Maharaja Ranjit Singh of Punjab donated one tonne of pure gold in 1835 to plate the sacred 15.5-meter high shikhara.',
    significance: 'Spiritual belief holds that a devotee who visits Kashi and takes a holy dip in River Ganga attains Moksha (liberation from the cycle of rebirth).',
    architecture: 'Classic Nagara temple architecture featuring the golden dome, restored sandstone corridors, and interconnected ghat promenades.',
    traditions: 'Five daily Aartis: Mangala, Bhog, Sandhya, Sringar, and Shayan Aarti accompanied by profound Vedic Damru beats.',
    festivals: 'Maha Shivaratri, Rangbhari Ekadashi, Dev Deepawali, Shravan Mondays.',
    morningTimings: '03:00 AM – 11:00 AM',
    eveningTimings: '12:00 PM – 11:00 PM',
    darshanTimings: 'Mangala Aarti: 03:00 AM – 04:00 AM | General Darshan: 04:00 AM – 11:00 AM, 12:00 PM – 07:00 PM, 08:30 PM – 11:00 PM.',
    specialDayTimings: '24-hour continuous darshan on Maha Shivaratri and Shravan Somvars with special Kanwariya queues.',
    phone: '+91 542 239 2629',
    email: 'info@shrikashivishwanath.org',
    website: 'https://shrikashivishwanath.org',
    officialWebsite: 'https://shrikashivishwanath.org',
    sourceUrl: 'https://shrikashivishwanath.org/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Traditional Dhoti and Kurta required for sanctum Sparsh Darshan.',
    dressCodeWomen: 'Saree or Salwar Suit with Dupatta.',
    rules: [
      'Bags, electronics, and mobile phones are deposited at secure lockers at the Gateway Plaza.',
      'Pilgrims can access the temple directly from Manikarnika and Lalita Ghats via the Corridor.'
    ],
    photographyRule: 'Prohibited in the inner temple complex.',
    footwearRule: 'Free shoe counters provided at all corridor entrance gates.',
    queueInstructions: 'Multiple gate entries (Gateway 1 to 4) equipped with shade screens and mist coolers.',
    bannerImage: '/images/temple_kashi.jpg',
    sanctumImage: '/images/temple_kashi.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'Kashi Vishwanath Corridor Facilitation Centre',
      officialUrl: 'https://shrikashivishwanath.org/donations',
      instructions: 'Official donations support Annakshetra (free food for pilgrims) and Sanskrit Veda Pathashalas.',
      trustName: 'Shri Kashi Vishwanath Temple Trust'
    },
    prasadamSummary: 'Kashi Peda, Belpatra, and sacred Vibhuti from the Vishwanath sanctum.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_kanakadurg_07',
    slug: 'kanaka-durga-vijayawada',
    name: 'Kanaka Durga Temple',
    subtitle: 'Swayambhu Goddess on the Indrakeeladri Hill',
    deity: 'Goddess Durga',
    state: 'Andhra Pradesh',
    district: 'NTR (Krishna)',
    city: 'Vijayawada',
    address: 'Indrakeeladri, Mallikarjunapeta, Vijayawada, Andhra Pradesh 520001',
    pinCode: '520001',
    latitude: 16.5165,
    longitude: 80.6083,
    description: 'Perched on the scenic Indrakeeladri hill overlooking the River Krishna, Kanaka Durga Temple is the second largest temple in Andhra Pradesh, revering the eight-armed deity who vanquished the demon Mahishasura.',
    history: 'Legend relates that Arjuna performed intense penance on this hill to obtain the Pasupatastra from Lord Shiva. Adi Shankaracharya installed the holy Sri Chakra here to invoke supreme blessings.',
    significance: 'A supreme center of Shakti worship where millions gather for the sacred Navaratri festival and Teppotsavam (boat festival) on the Krishna River.',
    architecture: 'Dravidian style with a gleaming golden gopuram and expansive ghat view deck.',
    traditions: 'Special Kumkumarchana, Chandi Homam, and offering sarees and turmeric to the Goddess.',
    festivals: 'Dasara (Sharad Navaratri), Shakambhari Utsavam, Bhavani Deeksha Viramana.',
    morningTimings: '04:00 AM – 10:00 PM',
    eveningTimings: 'Open continuously throughout the day with aarti pauses.',
    darshanTimings: 'Dharma Darshan (Free): 04:00 AM – 10:00 PM | Special Queues: ₹100, ₹300, and ₹500 passes.',
    specialDayTimings: 'Open continuously for 24 hours during Moola Nakshatram day of Navaratri.',
    phone: '+91 866 242 3600',
    email: 'helpdesk@kanakadurgamma.org',
    website: 'https://kanakadurgamma.org',
    officialWebsite: 'https://kanakadurgamma.org',
    sourceUrl: 'https://kanakadurgamma.org/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Traditional Dhoti or Kurta-Pyjama.',
    dressCodeWomen: 'Saree or Chudidar with Dupatta.',
    rules: [
      'Ghat road is open for pedestrian yatris and special devasthanam electric buses.',
      'Mobile devices must be kept inside bags or deposited at cloakrooms.'
    ],
    photographyRule: 'Prohibited inside sanctum.',
    footwearRule: 'Footwear stands available at the foot of the hill and hill-top bus terminal.',
    queueInstructions: 'Multiple designated queue lines for Dharma, ₹100, ₹300, and VIP protocols.',
    bannerImage: '/images/temple_hero_gopuram.jpg',
    sanctumImage: '/images/temple_sanctum_courtyard_1794224328434.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'Sri Durga Malleswara Swamyvarla Devasthanam Executive Office',
      officialUrl: 'https://kanakadurgamma.org',
      instructions: 'Online donations for Nitya Annadanam, Gosamrakshana, and Vidya Dana.',
      trustName: 'Sri Durga Malleswara Swamyvarla Devasthanam'
    },
    prasadamSummary: 'Kanaka Durga Laddu, Pulihora, and noon meals at Mahamandapam Annadanam Hall.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_ayodhya_08',
    slug: 'ram-janmabhoomi-ayodhya',
    name: 'Shri Ram Janmabhoomi Temple',
    subtitle: 'The Sacred Birthplace of Lord Sri Rama',
    deity: 'Lord Rama',
    state: 'Uttar Pradesh',
    district: 'Ayodhya',
    city: 'Ayodhya',
    address: 'Ramkot, Ayodhya, Uttar Pradesh 224123',
    pinCode: '224123',
    latitude: 26.7956,
    longitude: 82.1944,
    description: 'The monumental Shri Ram Janmabhoomi Mandir marks the sacred birthplace of Maryada Purushottam Lord Sri Rama. Consecrated on January 22, 2024, the magnificent pink sandstone temple is a beacon of Indian heritage and cultural renaissance on the banks of River Saryu.',
    history: 'Ayodhya, celebrated as one of the seven holy Mokshadayika cities of India, has been the eternal capital of the Suryavanshi kings. The newly consecrated temple stands as an emblem of faith for millions across the globe.',
    significance: 'Sacred birthplace of Lord Rama, embodying ideals of dharma, justice, family devotion, and ethical leadership.',
    architecture: 'Traditional Nagara style constructed from pink Bansi Paharpur sandstone, featuring 392 intricately carved pillars and 44 doors without steel or iron reinforcement.',
    traditions: 'Four daily Aartis: Shringaar Aarti, Bhog Aarti, Sandhya Aarti, and Shayan Aarti with Vedic stutis.',
    festivals: 'Ram Navami, Deepotsav, Vivah Panchami, and Hanuman Jayanti.',
    morningTimings: '06:30 AM – 12:00 PM',
    eveningTimings: '02:00 PM – 10:00 PM',
    darshanTimings: 'General Darshan: 07:00 AM – 11:30 AM, 02:00 PM – 07:00 PM, 07:30 PM – 09:30 PM | Special passes through trust portal.',
    specialDayTimings: 'Extended 20-hour queues during Ram Navami with Surya Tilak solar reflection ceremony.',
    phone: '+91 5278 292000',
    email: 'contact@srjbtkshetra.org',
    website: 'https://srjbtkshetra.org',
    officialWebsite: 'https://srjbtkshetra.org',
    sourceUrl: 'https://srjbtkshetra.org/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Traditional or clean modest attire.',
    dressCodeWomen: 'Saree, Salwar Kameez, or modest dress.',
    rules: [
      'Comprehensive security screening at Pilgrim Facilitation Centre (PFC).',
      'Lockers provided free of charge for mobile phones, purses, and luggage.'
    ],
    photographyRule: 'Prohibited inside the temple boundary.',
    footwearRule: 'Free multi-bay shoe counters at Pilgrim Facilitation Centre.',
    queueInstructions: 'Wide covered pathway along Ram Path with wheelchair access and water points.',
    bannerImage: '/images/temple_kashi.jpg',
    sanctumImage: '/images/temple_kashi.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'Shri Ram Janmbhoomi Teerth Kshetra Camp Office, Ayodhya',
      officialUrl: 'https://srjbtkshetra.org/donation',
      instructions: 'Tax-exempt donations under 80G for temple development and pilgrim seva.',
      trustName: 'Shri Ram Janmabhoomi Teerth Kshetra Trust'
    },
    prasadamSummary: 'Sacred Ilaichi Dana, Besan Laddu Prasadam, and free Sita Rasoi meals.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_shirdi_09',
    slug: 'shirdi-sai-baba-temple',
    name: 'Shirdi Sai Baba Temple',
    subtitle: 'The Universal Abode of Faith and Compassion (Shraddha & Saburi)',
    deity: 'Other Deities',
    state: 'Maharashtra',
    district: 'Ahmednagar',
    city: 'Shirdi',
    address: 'Taluka Rahata, Shirdi, Maharashtra 423109',
    pinCode: '423109',
    latitude: 19.7668,
    longitude: 74.4764,
    description: 'The sacred Samadhi Mandir in Shirdi enshrines the divine resting place of Sai Baba, who taught the eternal message of "Sabka Malik Ek" (One God governs all) and "Shraddha & Saburi" (Faith & Patience).',
    history: 'Sai Baba lived in Shirdi for over 50 years until his Mahasamadhi in October 1918. Devotees visit the Samadhi Mandir, Dwarkamai mosque, Gurusthan neem tree, and Chavadi.',
    significance: 'A premier pilgrim destination transcending caste, creed, and religion, attracting seekers of peace and spiritual solace.',
    architecture: 'Marble memorial hall with an Italian marble idol of Sai Baba seated on a silver throne.',
    traditions: 'Four Aartis daily: Kakad (04:30 AM), Madhyan (12:00 PM), Dhoop (sunset), and Shej Aarti (10:30 PM). Palkhi procession on Thursdays.',
    festivals: 'Ram Navami, Guru Purnima, and Vijayadashami (Sai Punyatithi).',
    morningTimings: '04:00 AM – 11:15 PM',
    eveningTimings: 'Open continuously throughout the day.',
    darshanTimings: 'Samadhi Darshan: 05:40 AM – 10:00 PM | VIP and Time Slot online tokens via Sansthan portal.',
    specialDayTimings: '24-hour darshan permitted on Guru Purnima and Vijayadashami nights.',
    phone: '+91 2423 258500',
    email: 'saibaba@sai.org.in',
    website: 'https://online.sai.org.in',
    officialWebsite: 'https://online.sai.org.in',
    sourceUrl: 'https://online.sai.org.in/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Modest Indian or formal clothing.',
    dressCodeWomen: 'Saree, Salwar Kameez, or modest long dresses.',
    rules: [
      'Token/time-slot booking highly recommended during weekends.',
      'Mobile phones must be switched off or deposited in cloaking counters.'
    ],
    photographyRule: 'Prohibited inside the Samadhi hall.',
    footwearRule: 'Free automated shoe counters at Gates 1, 2, and 3.',
    queueInstructions: 'Modern air-conditioned queue complexes with free tea, water, and seating.',
    bannerImage: '/images/temple_annadanam_hall_1794224331195.jpg',
    sanctumImage: '/images/temple_sanctum_courtyard_1794224328434.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'Shri Saibaba Sansthan Trust Donor Cell, Gate 1, Shirdi',
      officialUrl: 'https://online.sai.org.in/donations',
      instructions: 'Contributions to Shri Sai Prasadalaya, Super Specialty Hospital, and Education Fund.',
      trustName: 'Shri Saibaba Sansthan Trust'
    },
    prasadamSummary: 'Udi (holy ash), Laddu Prasadam, and subsidized hygienic thali meals for 50,000+ daily visitors at Asia\'s largest solar-powered kitchen.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_padmanabhaswamy_10',
    slug: 'padmanabhaswamy-thiruvananthapuram',
    name: 'Sree Padmanabhaswamy Temple',
    subtitle: 'The Majestic Ananthasayanam of the Travancore Kings',
    deity: 'Lord Vishnu',
    state: 'Kerala',
    district: 'Thiruvananthapuram',
    city: 'Thiruvananthapuram',
    address: 'West Nada, Fort, Thiruvananthapuram, Kerala 695023',
    pinCode: '695023',
    latitude: 8.4831,
    longitude: 76.9436,
    description: 'Renowned for its spiritual grandeur and intricate gold wealth, Sree Padmanabhaswamy Temple enshrines Lord Vishnu in the eternal cosmic sleep posture (Ananthasayanam) resting on the thousand-headed serpent Adi Sesha.',
    history: 'Rebuilt by King Marthanda Varma in the 18th century, who dedicated his entire kingdom to the deity through the solemn ceremony of Thrippadidanam in 1750.',
    significance: 'One of the 108 Divya Desams, viewed through three separate doors: the face, the navel with Brahma on the lotus, and the feet.',
    architecture: 'A unique blend of indigenous Kerala wooden architecture and Chera-Pandyan Dravidian stone architecture with a 100-foot stone gopuram.',
    traditions: 'Murajapam (chanting of Vedas every six years) and Lakshadeepam (lighting of one hundred thousand lamps).',
    festivals: 'Alpasi Utsavam (Oct/Nov), Painkuni Utsavam (March/April), and Arattu procession to Shanghumukham Beach.',
    morningTimings: '03:15 AM – 12:00 PM',
    eveningTimings: '05:00 PM – 08:00 PM',
    darshanTimings: 'Morning: 03:30 AM – 04:45 AM, 06:30 AM – 07:00 AM, 08:30 AM – 10:00 AM, 10:30 AM – 11:15 AM | Evening: 05:00 PM – 06:15 PM, 06:45 PM – 07:20 PM.',
    specialDayTimings: 'Special entry passes on festival days via the Executive Officer\'s counter.',
    phone: '+91 471 245 0233',
    email: 'info@spst.in',
    website: 'https://spst.in',
    officialWebsite: 'https://spst.in',
    sourceUrl: 'https://spst.in/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Strictly traditional Mundu (Dhoti) around waist with bare chest. Shirts, vests, pants, and shorts are strictly forbidden.',
    dressCodeWomen: 'Saree, Mundum Neriyathum (Set Saree), or Dhavani. Dhotis available for rental at cloakrooms.',
    rules: [
      'Only Hindu devotees are permitted into the inner precincts as per Travancore royal tradition.',
      'Strict security clearance; all metal, leather, mobile phones, and bags deposited at Cloak Room.'
    ],
    photographyRule: 'Strictly prohibited within the entire heritage fortress complex.',
    footwearRule: 'Free footwear counters located at East Nada and North Nada.',
    queueInstructions: 'Separate lines for Special Darshan (₹250 with Prasad) and General Free Darshan.',
    bannerImage: '/images/temple_hero_gopuram.jpg',
    sanctumImage: '/images/temple_sanctum_courtyard_1794224328434.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'Temple Administrative Office, West Nada',
      officialUrl: 'https://spst.in/donation',
      instructions: 'Donations accepted for Annadanam, Veda Pathashala, and temple upkeep.',
      trustName: 'Sree Padmanabhaswamy Temple Trust'
    },
    prasadamSummary: 'Sacred Boli, Palpayasam, Unniyappam, and Panchamrutham.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_vaishnodevi_11',
    slug: 'vaishno-devi-katra',
    name: 'Maa Vaishno Devi Temple',
    subtitle: 'The Sacred Cave of the Three Holy Pindies in Trikuta Hills',
    deity: 'Goddess Durga',
    state: 'Jammu and Kashmir',
    district: 'Reasi',
    city: 'Katra',
    address: 'Bhavan, Trikuta Mountains, Katra, Jammu & Kashmir 182301',
    pinCode: '182301',
    latitude: 33.0308,
    longitude: 74.9490,
    description: 'Located at an altitude of 5,200 feet in the Trikuta mountains, the sacred shrine of Mata Vaishno Devi attracts millions of yatris undertaking the holy 12-km trek from Katra. Inside the sanctum cave, the Mother Goddess manifests as three natural stone formations (Holy Pindies) representing Maha Kali, Maha Lakshmi, and Maha Saraswati.',
    history: 'Revered since antiquity, Mata Vaishno Devi granted vision to Pandit Shridhar and led the path of righteous duty against Bhairon Nath.',
    significance: 'Spiritual belief holds that no devotee visits the cave without a divine call (Bulawa) from the Mother Goddess.',
    architecture: 'Natural limestone cave shrine with modern pedestrian trackways, electric battery carts, and passenger ropeway.',
    traditions: 'Chanting "Jai Mata Di" along the yatra track, holy bath at Banganga, and visiting Bhairon Mandir after Darshan to complete the yatra.',
    festivals: 'Chaitra and Sharad Navaratri (with 24-hour broadcast of Shat Chandi Maha Yagya).',
    morningTimings: '05:00 AM – 12:00 PM',
    eveningTimings: '04:00 PM – 09:00 PM (Sanctum closes briefly during Aarti)',
    darshanTimings: 'Aarti: 06:00 AM – 08:00 AM (Pratah) and 07:00 PM – 09:00 PM (Sandhya). Darshan is open round the clock except during Aartis.',
    specialDayTimings: 'Continuous 24-hour crowd management with RFID tracking bands issued to every yatri at Katra.',
    phone: '+91 1991 232029',
    email: 'feedback@maavaishnodevi.net',
    website: 'https://maavaishnodevi.org',
    officialWebsite: 'https://maavaishnodevi.org',
    sourceUrl: 'https://maavaishnodevi.org/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Modest warm clothing. Traditional attire preferred for Atka Aarti.',
    dressCodeWomen: 'Salwar Kameez, Saree, or modest warm attire.',
    rules: [
      'Mandatory free RFID Yatra Card must be collected at Katra before commencing trek.',
      'Helicopter bookings must only be booked through the official Shrine Board portal to prevent fraud.',
      'Ponies, pithus (porters), and palanquins are government-rate regulated.'
    ],
    photographyRule: 'Prohibited inside the Holy Cave and Bhavan area.',
    footwearRule: 'Free shoe racks and blanket cloakrooms at Bhavan.',
    queueInstructions: 'Regulated queue through multiple holding waiting halls equipped with hot water and snacks.',
    bannerImage: '/images/temple_complex_aerial_1794224329595.jpg',
    sanctumImage: '/images/temple_sanctum_courtyard_1794224328434.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'Central Office, SMVDSB, Katra and Bhavan Donation Counter',
      officialUrl: 'https://maavaishnodevi.org/donation.aspx',
      instructions: 'Tax-exempt 80G donations support SMVD Narayana Super Speciality Hospital and Gurukul.',
      trustName: 'Shri Mata Vaishno Devi Shrine Board (SMVDSB)'
    },
    prasadamSummary: 'Sacred Halwa Chana, Mishri Prasad, and Dry Fruit Pouch packed hermetically.',
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'temple_siddhivinayak_12',
    slug: 'siddhivinayak-mumbai',
    name: 'Siddhivinayak Temple',
    subtitle: 'The Wish-Fulfilling Ganesha of Prabhadevi',
    deity: 'Lord Ganesha',
    state: 'Maharashtra',
    district: 'Mumbai',
    city: 'Mumbai',
    address: 'SK Bole Marg, Prabhadevi, Mumbai, Maharashtra 400028',
    pinCode: '400028',
    latitude: 19.0169,
    longitude: 72.8304,
    description: 'Located in the heart of Mumbai, Shree Siddhivinayak Temple is dedicated to Lord Ganesha, portrayed with his trunk turned to the right (Siddhi Vinayaka), signifying immediate fulfillment of earnest prayers.',
    history: 'Originally consecrated in November 1801 by Laxman Vithu and Deubai Patil, the shrine grew from a modest brick sanctum into a celebrated six-storey gold-plated temple structure.',
    significance: 'Visited by millions from all walks of life, from leaders and cultural icons to everyday devotees seeking auspicious beginnings.',
    architecture: 'Multi-tiered granite and marble monument with a 12-foot high gold-plated main spire (Kalash).',
    traditions: 'Tuesday is especially sacred, drawing devotees who walk barefoot overnight to attend Kakad Aarti.',
    festivals: 'Ganesh Chaturthi, Angaraki Sankashti Chaturthi, Maghi Ganeshotsav.',
    morningTimings: '05:30 AM – 12:00 PM',
    eveningTimings: '12:30 PM – 10:00 PM',
    darshanTimings: 'General Darshan: 06:00 AM – 12:00 PM, 12:30 PM – 07:00 PM, 08:00 PM – 10:00 PM | Tuesday Kakad Aarti starts at 03:15 AM.',
    specialDayTimings: 'Open continuously from 02:00 AM on Angaraki Sankashti days until midnight.',
    phone: '+91 22 2422 2072',
    email: 'info@siddhivinayak.org',
    website: 'https://siddhivinayak.org',
    officialWebsite: 'https://siddhivinayak.org',
    sourceUrl: 'https://siddhivinayak.org/',
    verificationStatus: 'Verified from Official Portal',
    dressCodeMen: 'Clean modest attire; no sleeveless tops or torn jeans.',
    dressCodeWomen: 'Saree, Salwar Kameez, or modest Indian clothing.',
    rules: [
      'Mobile phones on silent mode; security frisking at gate entrance.',
      'Online QR token booking recommended during Angaraki Tuesdays.'
    ],
    photographyRule: 'Prohibited in the sanctum corridor.',
    footwearRule: 'Free shoe counters operated by temple volunteers outside Gate 3.',
    queueInstructions: 'Separate lines for General (Mukh Darshan) and Navas/Charan Sparsh Darshan.',
    bannerImage: '/images/temple_annadanam_hall_1794224331195.jpg',
    sanctumImage: '/images/temple_sanctum_courtyard_1794224328434.jpg',
    popular: true,
    donationInfo: {
      counterLocation: 'Ground Floor, Siddhivinayak Temple Complex, Prabhadevi',
      officialUrl: 'https://siddhivinayak.org/online-donation',
      instructions: 'Donations to medical assistance fund for underprivileged patients and education grants.',
      trustName: 'Shree Siddhivinayak Ganapati Temple Trust'
    },
    prasadamSummary: 'Fresh Modak Prasadam, Ladoos, and sacred Durva grass blessed at the sanctum.',
    updatedAt: new Date().toISOString()
  }
];

// Poojas seed data linked by templeId
export const initialPoojas: IPooja[] = [
  // Tirumala
  {
    _id: 'pooja_tiru_01',
    templeId: 'temple_tirumala_01',
    name: 'Suprabhata Seva',
    category: 'Daily Pooja',
    description: 'The auspicious early morning awakening seva accompanied by Vedic hymns, slokas, and mangala harathi at Bangaru Vakili.',
    dateOrFrequency: 'Daily (03:00 AM)',
    time: '03:00 AM – 04:00 AM',
    duration: '60 minutes',
    price: 120,
    availability: 'Limited Slots',
    instructions: 'Devotees must report at Vaikuntam Queue Complex 1 at 01:30 AM with electronic ticket and valid photo ID.',
    significance: 'Awakens Lord Srinivasa to cosmic dawn, conferring peace and spiritual blessings upon the devotee.',
    prasadamDetails: 'Two sacred Laddus, and sacred Akshatas.',
    verificationStatus: 'Verified',
    active: true
  },
  {
    _id: 'pooja_tiru_02',
    templeId: 'temple_tirumala_01',
    name: 'Thomala Seva',
    category: 'Daily Pooja',
    description: 'Exquisite floral offering ceremony where Lord Venkateswara is adorned with fragrant garlands woven with sacred basil (Tulasi).',
    dateOrFrequency: 'Daily (03:45 AM)',
    time: '03:45 AM – 04:30 AM',
    duration: '45 minutes',
    price: 220,
    availability: 'Limited Slots',
    instructions: 'Traditional dhoti and uttariyam mandatory for men; sarees for women.',
    significance: 'Enables intimate darshan of the Lord adorned in divine fresh flowers.',
    prasadamDetails: 'Laddus and sacred Tulasi.',
    verificationStatus: 'Verified',
    active: true
  },
  {
    _id: 'pooja_tiru_03',
    templeId: 'temple_tirumala_01',
    name: 'Kalyanotsavam',
    category: 'Special Seva',
    description: 'Celestial wedding ceremony celebrating the divine marriage of Lord Srinivasa with Goddess Sri Devi and Bhoo Devi.',
    dateOrFrequency: 'Daily (10:30 AM)',
    time: '10:30 AM – 01:30 PM',
    duration: '3 hours',
    price: 1000,
    availability: 'Available',
    instructions: 'Couples must wear married traditional ethnic attire. One registration admits husband and wife.',
    significance: 'Bestows domestic harmony, marital bliss, and prosperity.',
    prasadamDetails: 'Five big Laddus, two Vadas, one silk Angavastram, and blouse piece.',
    verificationStatus: 'Verified',
    active: true
  },
  {
    _id: 'pooja_tiru_04',
    templeId: 'temple_tirumala_01',
    name: 'Special Entry Darshan (SED ₹300)',
    category: 'Special Pooja',
    description: 'Quick regulated entry tickets for devotees seeking streamlined darshan with reduced waiting hours.',
    dateOrFrequency: 'Daily Slots (09:00 AM to 06:00 PM)',
    time: 'Scheduled Hourly Slots',
    duration: '2 to 3 hours total queue time',
    price: 300,
    availability: 'Available',
    instructions: 'Must report at ATC car parking entry point precisely 30 minutes prior to booked slot time.',
    significance: 'Direct entry to the main sanctum with minimum waiting.',
    prasadamDetails: 'One free Tirupati Laddu included with every ticket.',
    verificationStatus: 'Verified',
    active: true
  },

  // Srisailam
  {
    _id: 'pooja_sri_01',
    templeId: 'temple_srisailam_02',
    name: 'Sparsha Darshanam & Abhishekam',
    category: 'Abhishekam',
    description: 'Unique sacred privilege where the devotee personally touches the Jyotirlingam and performs milk abhishekam.',
    dateOrFrequency: 'Daily (Morning & Evening sessions)',
    time: '06:00 AM – 08:30 AM',
    duration: '45 minutes',
    price: 500,
    availability: 'Limited Slots',
    instructions: 'Men must wear pure cotton white dhoti and bare chest. Electronic devices prohibited.',
    significance: 'Direct communion with the Swayambhu Jyotirlingam destroying all karmic afflictions.',
    prasadamDetails: 'Two Laddus, Vibhuti, and Bilvapatra.',
    verificationStatus: 'Verified',
    active: true
  },
  {
    _id: 'pooja_sri_02',
    templeId: 'temple_srisailam_02',
    name: 'Bhramaramba Devi Kumkumarchana',
    category: 'Archana',
    description: 'Special vermilion worship performed at the sacred Sri Chakra inside the sanctum of Goddess Bhramaramba.',
    dateOrFrequency: 'Daily (08:30 AM – 12:30 PM)',
    time: '09:00 AM – 10:30 AM',
    duration: '90 minutes',
    price: 300,
    availability: 'Available',
    instructions: 'Traditional Saree or Chudidar mandatory.',
    significance: 'Invokes divine feminine blessings for longevity, peace, and health.',
    prasadamDetails: 'Kumkum, blouse piece, and laddu.',
    verificationStatus: 'Verified',
    active: true
  },

  // Meenakshi Amman
  {
    _id: 'pooja_meen_01',
    templeId: 'temple_meenakshi_03',
    name: 'Sahasranama Archana',
    category: 'Archana',
    description: 'Chanting of the 1,008 divine sacred names of Goddess Meenakshi with fragrant Jasmine and lotus blossoms.',
    dateOrFrequency: 'Daily (07:00 AM – 11:30 AM)',
    time: '08:00 AM – 09:00 AM',
    duration: '45 minutes',
    price: 150,
    availability: 'Walk-in Permitted',
    instructions: 'Obtain ticket from temple counter inside East Sannidhi.',
    significance: 'Removes mental anxieties and brings auspiciousness to the household.',
    prasadamDetails: 'Kumkum, sacred thread, and sweet Pongal.',
    verificationStatus: 'Verified',
    active: true
  },
  {
    _id: 'pooja_meen_02',
    templeId: 'temple_meenakshi_03',
    name: 'Thanga Pallakku (Golden Palanquin) Seva',
    category: 'Special Seva',
    description: 'Evening celestial procession of the deities around the inner prakaram in the illuminated golden palanquin.',
    dateOrFrequency: 'Daily at 09:00 PM',
    time: '09:00 PM – 09:45 PM',
    duration: '45 minutes',
    price: 500,
    availability: 'Limited Slots',
    instructions: 'Report at Sundareswarar Sannidhi at 08:45 PM.',
    significance: 'Rare nocturnal ritual marking the union of Shiva and Shakti.',
    prasadamDetails: 'Vibhuti, Chandanam, and Laddu.',
    verificationStatus: 'Verified',
    active: true
  },

  // Jagannath Puri
  {
    _id: 'pooja_jaga_01',
    templeId: 'temple_jagannath_04',
    name: 'Mangala Alati',
    category: 'Daily Pooja',
    description: 'The first auspicious offering of camphor lamps to Lord Jagannath, Balabhadra, and Subhadra at daybreak.',
    dateOrFrequency: 'Daily (05:00 AM – 05:30 AM)',
    time: '05:00 AM – 05:45 AM',
    duration: '45 minutes',
    price: 0,
    availability: 'Walk-in Permitted',
    instructions: 'Enter via Singhadwara Lions Gate at 04:30 AM.',
    significance: 'Witnessing the opening of the sanctum doors grants supreme merit (Patita Pavana).',
    prasadamDetails: 'Darshan of holy lamps.',
    verificationStatus: 'Verified',
    active: true
  },
  {
    _id: 'pooja_jaga_02',
    templeId: 'temple_jagannath_04',
    name: 'Chandan Lagi & Sandhya Dhupa',
    category: 'Special Pooja',
    description: 'Evening perfumed sandalwood paste application followed by royal feast offerings of sweet pitha.',
    dateOrFrequency: 'Daily (07:30 PM)',
    time: '07:30 PM – 08:30 PM',
    duration: '60 minutes',
    price: 250,
    availability: 'Available',
    instructions: 'Arranged via official Temple Sevayat Nijog desk.',
    significance: 'Brings immense peace and devotion to the heart.',
    prasadamDetails: 'Kora Khaja and sacred Chandana.',
    verificationStatus: 'Verified',
    active: true
  },

  // Somnath
  {
    _id: 'pooja_som_01',
    templeId: 'temple_somnath_05',
    name: 'Someshwar Maha Puja & Abhishek',
    category: 'Abhishekam',
    description: 'Special Rudrabhishekam conducted with sacred Gangajal, panchamrit, and bilva leaves on the First Jyotirlinga.',
    dateOrFrequency: 'Daily (08:00 AM – 11:30 AM)',
    time: '09:00 AM – 10:30 AM',
    duration: '90 minutes',
    price: 501,
    availability: 'Available',
    instructions: 'Advance booking online or at the Temple Trust counter.',
    significance: 'Protects against planetary doshas and revitalizes spiritual strength.',
    prasadamDetails: 'Special Panchamrit and Somnath Peda.',
    verificationStatus: 'Verified',
    active: true
  },

  // Kashi Vishwanath
  {
    _id: 'pooja_kashi_01',
    templeId: 'temple_kashi_06',
    name: 'Mangala Aarti',
    category: 'Daily Pooja',
    description: 'Grand dawn ritual of sacred bathing, sringar with ashes and bilvapatra, and ringing of temple bells.',
    dateOrFrequency: 'Daily (03:00 AM – 04:00 AM)',
    time: '03:00 AM – 04:15 AM',
    duration: '75 minutes',
    price: 350,
    availability: 'Limited Slots',
    instructions: 'Report at Gate 4B at 02:30 AM. Traditional attire mandatory.',
    significance: 'The most sacred Aarti at Kashi, conferring the grace of Lord Shiva.',
    prasadamDetails: 'Belpatra, chandan, and peda.',
    verificationStatus: 'Verified',
    active: true
  }
];

// Prasadam items seed data
export const initialPrasadam: IPrasadamItem[] = [
  // Tirumala
  {
    _id: 'prasad_01',
    templeId: 'temple_tirumala_01',
    name: 'Tirupati Srivari Laddu (Small / Regular)',
    description: 'World-famous geographical-indication (GI) tagged prasadam made with pure cow ghee, gram flour, cashews, raisins, cardamom, and sugar candy.',
    counterLocation: 'Laddu Complex (North-West corner of Temple)',
    distributionTiming: '24 Hours (Round the clock)',
    price: '₹50 per extra laddu (1 free with ₹300 SED)',
    availability: 'Available',
    isSpecialOffering: true
  },
  {
    _id: 'prasad_02',
    templeId: 'temple_tirumala_01',
    name: 'Kalyanotsavam Big Laddu (Kalyana Laddu)',
    description: 'Large 750-gram special laddu enriched with extra dry fruits, offered during divine celestial weddings.',
    counterLocation: 'Arjitha Seva Prasadam Counters (near Vaikuntam 1)',
    distributionTiming: '12:30 PM – 04:00 PM',
    price: '₹200 per piece',
    availability: 'Morning Only',
    isSpecialOffering: true
  },
  {
    _id: 'prasad_03',
    templeId: 'temple_tirumala_01',
    name: 'Free Tarigonda Vengamamba Nitya Annaprasadam',
    description: 'Delicious hot meals served free to 1,00,000+ devotees daily including Sambar rice, sweet Pongal, and buttermilk.',
    counterLocation: 'Matrusri Tarigonda Vengamamba Annaprasadam Complex',
    distributionTiming: '09:00 AM – 11:00 PM (Continuous)',
    price: 'Free to all devotees',
    availability: 'Free Annadanam',
    isSpecialOffering: false
  },

  // Srisailam
  {
    _id: 'prasad_04',
    templeId: 'temple_srisailam_02',
    name: 'Mallikarjuna Swamy Laddu Prasadam',
    description: 'Aromatic besan and ghee laddu prepared following temple traditions.',
    counterLocation: 'Devasthanam Prasadam Counters, Raja Gopuram',
    distributionTiming: '06:00 AM – 09:30 PM',
    price: '₹25 per piece',
    availability: 'Available',
    isSpecialOffering: true
  },
  {
    _id: 'prasad_05',
    templeId: 'temple_srisailam_02',
    name: 'Nitya Annadanam Thali',
    description: 'Hygienic vegetarian lunch and dinner served with devotion to all visiting pilgrims.',
    counterLocation: 'Nitya Annapurna Bhavan, Srisailam',
    distributionTiming: '11:00 AM – 03:30 PM, 07:00 PM – 10:00 PM',
    price: 'Free to all devotees',
    availability: 'Free Annadanam',
    isSpecialOffering: false
  },

  // Meenakshi Amman
  {
    _id: 'prasad_06',
    templeId: 'temple_meenakshi_03',
    name: 'Madurai Sakkarai Pongal & Puliyodarai',
    description: 'Traditional jaggery sweet rice and tangy tamarind rice offered to Goddess Meenakshi.',
    counterLocation: 'East Gopuram Madapalli Counter',
    distributionTiming: '08:00 AM – 08:30 PM',
    price: '₹30 per pack',
    availability: 'Available',
    isSpecialOffering: true
  },

  // Jagannath Puri
  {
    _id: 'prasad_07',
    templeId: 'temple_jagannath_04',
    name: 'Chappan Bhog Mahaprasad (Abhada)',
    description: 'Divine steamed rice, dal, and vegetable curries cooked in stacked earthen pots over wood fire in the temple kitchen.',
    counterLocation: 'Ananda Bazar inside Temple Complex',
    distributionTiming: '01:30 PM – 08:00 PM',
    price: '₹120 – ₹250 (Variable based on items)',
    availability: 'Afternoon & Evening',
    isSpecialOffering: true
  },

  // Somnath
  {
    _id: 'prasad_08',
    templeId: 'temple_somnath_05',
    name: 'Shree Somnath Motichoor Laddu & Peda',
    description: 'Pure ghee motichoor laddu and khoya peda offered during Shringar Aarti.',
    counterLocation: 'Central Reception Plaza Counter',
    distributionTiming: '07:30 AM – 09:30 PM',
    price: '₹60 per box (200g)',
    availability: 'Available',
    isSpecialOffering: true
  }
];

// Parking seed data
export const initialParking: IParking[] = [
  // Tirumala
  {
    _id: 'park_01',
    templeId: 'temple_tirumala_01',
    name: 'MBC / Ring Road Central Parking Area',
    location: 'Near Ring Road & Central Reception Office (CRO), Tirumala',
    capacity: '1,500 Cars / 2,000 Two-wheelers',
    timing: '24 Hours Open',
    distance: '0.6 km from Temple Gopuram',
    walkingTime: '7 minutes',
    vehicleTypes: 'Cars, SUVs, Two-wheelers, Tempo Travellers',
    fee: 'Cars ₹50 / 24 hrs | Two-wheelers ₹10',
    description: 'Paved multi-tier parking zone with CCTV surveillance, EV charging points, and shuttle bus connections.',
    availability: 'Available',
    active: true
  },
  {
    _id: 'park_02',
    templeId: 'temple_tirumala_01',
    name: 'TB Guest House Parking Lot',
    location: 'North Mada Street side, adjacent to TTD Cottages',
    capacity: '800 Vehicles',
    timing: '24 Hours Open',
    distance: '0.4 km from Main Temple',
    walkingTime: '5 minutes',
    vehicleTypes: 'Cars and Two-wheelers only',
    fee: 'Standard TTD municipal tariff',
    description: 'Convenient parking for pilgrims staying at TTD cottages on North Ring Road.',
    availability: 'Available',
    active: true
  },
  {
    _id: 'park_03',
    templeId: 'temple_tirumala_01',
    name: 'Alipiri Toll Gate Inter-Transit Parking (Tirupati Foot of Hills)',
    location: 'Alipiri Foot Hills, Tirupati',
    capacity: '3,000 Four-wheelers / 500 Buses',
    timing: '24 Hours Open',
    distance: '18 km (at foot of hills before ghat road)',
    walkingTime: 'Take TTD Electric Ghat Bus',
    vehicleTypes: 'All vehicles including Tourist Buses and Private Cars',
    fee: 'Cars ₹100 per day',
    description: 'Ideal for yatris who wish to park at Tirupati base and take electric public buses or walk up the Alipiri Mettu footpath.',
    availability: 'Available',
    active: true
  },

  // Srisailam
  {
    _id: 'park_04',
    templeId: 'temple_srisailam_02',
    name: 'Patalaganga Ropeway Parking Plaza',
    location: 'Near Ropeway Station & Ganga Sadan, Srisailam',
    capacity: '600 Cars / 1,000 Bikes',
    timing: '05:00 AM – 10:00 PM',
    distance: '0.5 km from Temple',
    walkingTime: '6 minutes',
    vehicleTypes: 'Cars, Buses, Bikes',
    fee: 'Cars ₹50 | Buses ₹100',
    description: 'Direct access to the temple steps and cable car to Krishna River.',
    availability: 'Available',
    active: true
  },

  // Meenakshi
  {
    _id: 'park_05',
    templeId: 'temple_meenakshi_03',
    name: 'Madurai Corporation Multi-Level Car Parking',
    location: 'Old Central Market Road, near East Tower',
    capacity: '850 Cars / 1,200 Two-wheelers',
    timing: '24 Hours Open',
    distance: '0.3 km from East Gopuram',
    walkingTime: '4 minutes',
    vehicleTypes: 'Cars, Two-wheelers',
    fee: 'Cars ₹40 for first 2 hrs',
    description: 'State of the art automated multi-level parking facility with washrooms and luggage storage.',
    availability: 'Available',
    active: true
  },

  // Jagannath Puri
  {
    _id: 'park_06',
    templeId: 'temple_jagannath_04',
    name: 'Jagannath Ballav Pilgrim Centre Parking',
    location: 'Grand Road, near Medical Chhak, Puri',
    capacity: '1,200 Cars / 250 Buses',
    timing: '24 Hours Open',
    distance: '0.8 km from Temple',
    walkingTime: '10 minutes (Free battery carts available)',
    vehicleTypes: 'All Tourist Vehicles and Cars',
    fee: 'Cars ₹50 | Heavy Buses ₹150',
    description: 'Spacious official parking complex with rest rooms and tourist information counters.',
    availability: 'Available',
    active: true
  }
];

// Hospitals seed data
export const initialHospitals: IHospital[] = [
  // Tirumala & Tirupati
  {
    _id: 'hosp_01',
    templeId: 'temple_tirumala_01',
    name: 'Sri Venkateswara Institute of Medical Sciences (SVIMS)',
    address: 'Alipiri Road, Tirupati, Andhra Pradesh 517507',
    distance: '18 km from Tirumala (Base Hospital)',
    phone: '+91 877 228 7777',
    emergencyAvailable: true,
    latitude: 13.6373,
    longitude: 79.4064,
    facilities: ['24x7 Emergency Trauma Care', 'ICU & Cardiac Catheterization', 'Blood Bank', 'Dedicated Pilgrim Wing'],
    ambulanceNumber: '108 / +91 877 227 7777'
  },
  {
    _id: 'hosp_02',
    templeId: 'temple_tirumala_01',
    name: 'Aswini Hospital (Hilltop Emergency Hospital)',
    address: 'Near Old Annadanam Building, S-Mada Street, Tirumala',
    distance: '0.3 km from Main Temple',
    phone: '+91 877 226 3444',
    emergencyAvailable: true,
    latitude: 13.6828,
    longitude: 79.3491,
    facilities: ['Emergency Resuscitation Unit', 'Oxygen Support', 'Cardiac Defibrillators', 'Free Pilgrim Dispensary'],
    ambulanceNumber: '+91 877 226 3444'
  },

  // Srisailam
  {
    _id: 'hosp_03',
    templeId: 'temple_srisailam_02',
    name: 'Government Area Hospital & Devasthanam Dispensary',
    address: 'Temple Main Road, Srisailam, Andhra Pradesh 518101',
    distance: '0.6 km from Temple',
    phone: '+91 8524 288333',
    emergencyAvailable: true,
    latitude: 16.0722,
    longitude: 78.8671,
    facilities: ['24-hour Casualty', 'Snake-bite Anti-venom', 'First Aid Station'],
    ambulanceNumber: '108 / +91 8524 288333'
  },

  // Meenakshi
  {
    _id: 'hosp_04',
    templeId: 'temple_meenakshi_03',
    name: 'Government Rajaji Hospital (Madurai Medical College)',
    address: 'Panagal Road, Shenoy Nagar, Madurai 625020',
    distance: '2.4 km from Meenakshi Temple',
    phone: '+91 452 253 2535',
    emergencyAvailable: true,
    latitude: 9.9312,
    longitude: 78.1310,
    facilities: ['24x7 Multi-Specialty Trauma Center', 'ICU', 'Pediatrics'],
    ambulanceNumber: '108'
  },

  // Jagannath Puri
  {
    _id: 'hosp_05',
    templeId: 'temple_jagannath_04',
    name: 'District Headquarters Hospital (DHH Puri)',
    address: 'Hospital Road, Puri, Odisha 752001',
    distance: '1.2 km from Singhadwara',
    phone: '+91 6752 222044',
    emergencyAvailable: true,
    latitude: 19.8080,
    longitude: 85.8234,
    facilities: ['24x7 Emergency Casualty', 'Heat-stroke emergency ward', 'Ambulance service'],
    ambulanceNumber: '108 / 102'
  }
];

// Emergency Contacts seed data
export const initialEmergencyContacts: IEmergencyContact[] = [
  // Tirumala
  {
    _id: 'emg_01',
    templeId: 'temple_tirumala_01',
    name: 'Tirumala Vigilance & Security Central Command',
    category: 'Temple Security',
    phone: '+91 877 226 3123',
    altPhone: '+91 877 226 3456',
    description: 'Central vigilance control room for lost & found, missing family members, and immediate pilgrim assistance.',
    availableHours: '24 Hours Active',
    active: true
  },
  {
    _id: 'emg_02',
    templeId: 'temple_tirumala_01',
    name: 'Tirumala Police Station (Law & Order)',
    category: 'Police',
    phone: '100',
    altPhone: '+91 877 226 3333',
    description: 'Local police station handling pilgrim reports, lost belongings, and emergency law and order.',
    availableHours: '24 Hours Active',
    active: true
  },
  {
    _id: 'emg_03',
    templeId: 'temple_tirumala_01',
    name: 'Tirumala TTD Ambulance Dispatch',
    category: 'Medical',
    phone: '108',
    altPhone: '+91 877 226 3444',
    description: 'Fast response hilltop emergency ambulance equipped with oxygen and automated defibrillators.',
    availableHours: '24 Hours Active',
    active: true
  },

  // Srisailam
  {
    _id: 'emg_04',
    templeId: 'temple_srisailam_02',
    name: 'Srisailam Police Station',
    category: 'Police',
    phone: '100',
    altPhone: '+91 8524 288133',
    description: 'Local sub-division police station with ghat road mobile patrol units.',
    availableHours: '24 Hours Active',
    active: true
  },

  // General & Nationwide
  {
    _id: 'emg_05',
    templeId: 'all',
    name: 'National Emergency Response Helpline',
    category: 'Police',
    phone: '112',
    description: 'Pan-India single emergency response support for Police, Fire, and Ambulance assistance.',
    availableHours: '24 Hours Active',
    active: true
  },
  {
    _id: 'emg_06',
    templeId: 'all',
    name: 'Women in Distress Helpline',
    category: 'Women Helpline',
    phone: '1091',
    description: 'Dedicated government helpline for women travellers, pilgrims, and families.',
    availableHours: '24 Hours Active',
    active: true
  }
];

// Visitor Guidelines seed data
export const initialGuidelines: IGuideline[] = [
  {
    _id: 'guide_01',
    templeId: 'all',
    title: 'Traditional Temple Dress Code',
    category: 'Dress Code',
    content: [
      'Men: Traditional Dhoti with Angavastram, or Kurta-Pyjama. Avoid Western jeans, shorts, T-shirts, or lungis.',
      'Women: Saree, Half-saree, or Chudidar/Salwar Kameez with Dupatta. Sleeveless tops and western mini skirts are strictly banned.',
      'Children: Modest traditional clothing.'
    ],
    importance: 'Mandatory',
    active: true
  },
  {
    _id: 'guide_02',
    templeId: 'all',
    title: 'Footwear Depository & Cleanliness',
    category: 'Footwear',
    content: [
      'All pilgrims must remove shoes, sandals, and socks before stepping into the sanctum perimeter.',
      'Use the free authorized footwear counters and collect token bands.',
      'Do not leave footwear near the gopuram entrance or along pedestrian walkways.'
    ],
    importance: 'Mandatory',
    active: true
  },
  {
    _id: 'guide_03',
    templeId: 'all',
    title: 'Electronic Gadgets & Photography Policy',
    category: 'Photography',
    content: [
      'Photography and videography are strictly prohibited inside temple sanctums, queue compartments, and inner mandapams.',
      'Mobile phones must be deposited in digital lockers at the security gates or switched completely off.',
      'Do not carry smart watches, cameras, pen drives, or power banks into inner sanctums.'
    ],
    importance: 'Mandatory',
    active: true
  },
  {
    _id: 'guide_04',
    templeId: 'all',
    title: 'Queue Discipline & Waiting Protocols',
    category: 'Queue Discipline',
    content: [
      'Cooperate with temple security staff and voluntary sevaks at all queue holding compartments.',
      'Keep your original government photo identity card ready for physical verification.',
      'Devotees requiring assistance (wheelchairs, senior citizens, infants) can access dedicated priority lanes where designated.'
    ],
    importance: 'High',
    active: true
  },
  {
    _id: 'guide_05',
    templeId: 'all',
    title: 'Temple Discipline, Solitude & Sacred Etiquette',
    category: 'Temple Rules',
    content: [
      'Maintain solemn silence and chant the divine name in your heart while progressing through the lines.',
      'Smoking, tobacco chewing, alcohol consumption, and non-vegetarian food are strictly prohibited in temple holy towns.',
      'Dispose of waste and leaf plates strictly in municipal segregated garbage bins.'
    ],
    importance: 'Mandatory',
    active: true
  },
  {
    _id: 'guide_06',
    templeId: 'all',
    title: 'Senior Citizens & Special Assistance Services',
    category: 'Special Assistance',
    content: [
      'Battery-operated electric golf carts operate free of charge for senior citizens and differently-abled devotees.',
      'Wheelchairs and assistance volunteers are stationed at Central Reception and Pilgrim Assistance Counters.',
      'Separate prioritized queue timings exist for seniors (age 65+) and devotees with medical conditions.'
    ],
    importance: 'Advisory',
    active: true
  }
];

// Announcements seed data
export const initialAnnouncements: IAnnouncement[] = [
  {
    _id: 'ann_01',
    templeId: 'all',
    templeName: 'Temple Ease Multi-Temple Network',
    title: 'Welcome to Temple Ease — Verified Multi-Temple Digital Information Portal',
    description: 'Devotees across India can now explore temple timings, daily poojas, visitor guidelines, and emergency numbers across major shrines in one central place.',
    priority: 'Important',
    publishDate: '2026-11-09',
    active: true
  },
  {
    _id: 'ann_02',
    templeId: 'temple_tirumala_01',
    templeName: 'Sri Venkateswara Temple – Tirumala',
    title: 'Srivari Brahmotsavam Darshan Updates & Online Quota Release',
    description: 'Devotees are advised that electronic darshan quotas for next month will be released on the official TTD portal. Please book only through verified official channels.',
    priority: 'Urgent',
    publishDate: '2026-11-08',
    active: true
  },
  {
    _id: 'ann_03',
    templeId: 'temple_srisailam_02',
    templeName: 'Mallikarjuna Swamy Temple – Srisailam',
    title: 'Maha Shivaratri Sparsha Darshan Slots Notice',
    description: 'Sparsha Darshan registrations for upcoming Kartika and Shivaratri dates will be issued exclusively through biometrics to prevent black marketing.',
    priority: 'Notice',
    publishDate: '2026-11-07',
    active: true
  },
  {
    _id: 'ann_04',
    templeId: 'temple_somnath_05',
    templeName: 'Somnath Temple – Gujarat',
    title: 'Evening Light & Sound Show New Timings',
    description: 'The spectacular "Jay Somnath" 3D projection mapping and light & sound show now commences daily at 08:00 PM at the seafront promenade.',
    priority: 'General',
    publishDate: '2026-11-06',
    active: true
  }
];

// Initial Daily Schedule Items
export const initialSchedule: IScheduleItem[] = [
  {
    _id: 'sched_01',
    templeId: 'temple_tirumala_01',
    time: '03:00 AM',
    activity: 'Suprabhata Seva & Temple Gates Open',
    location: 'Bangaru Vakili (Golden Gate)',
    category: 'Ritual',
    status: 'Completed',
    active: true
  },
  {
    _id: 'sched_02',
    templeId: 'temple_tirumala_01',
    time: '03:45 AM',
    activity: 'Thomala Seva (Garland Adornment)',
    location: 'Main Sanctum',
    category: 'Seva',
    status: 'Completed',
    active: true
  },
  {
    _id: 'sched_03',
    templeId: 'temple_tirumala_01',
    time: '04:30 AM',
    activity: 'Koluvu & Panchanga Sravanam',
    location: 'Tirumamani Mandapam',
    category: 'Tradition',
    status: 'Completed',
    active: true
  },
  {
    _id: 'sched_04',
    templeId: 'temple_tirumala_01',
    time: '06:00 AM',
    activity: 'First Bell & Naivedya Samarpanam',
    location: 'Sanctum Sanctorum',
    category: 'Offering',
    status: 'Completed',
    active: true
  },
  {
    _id: 'sched_05',
    templeId: 'temple_tirumala_01',
    time: '08:30 AM',
    activity: 'Sarva Darshan & Special Entry Darshan',
    location: 'Vaikuntam Queue Complex',
    category: 'Darshan',
    status: 'In Progress',
    active: true
  },
  {
    _id: 'sched_06',
    templeId: 'temple_tirumala_01',
    time: '12:00 PM',
    activity: 'Kalyanotsavam & Arjitha Brahmotsavam',
    location: 'Kalyana Mandapam',
    category: 'Celestial Wedding',
    status: 'Upcoming',
    active: true
  },
  {
    _id: 'sched_07',
    templeId: 'temple_tirumala_01',
    time: '05:30 PM',
    activity: 'Sahasra Deepalankara Seva (Unjal Seva)',
    location: 'Unjal Mandapam outside Gopuram',
    category: 'Evening Seva',
    status: 'Upcoming',
    active: true
  },
  {
    _id: 'sched_08',
    templeId: 'temple_tirumala_01',
    time: '11:00 PM',
    activity: 'Ekanta Seva & Temple Gates Closure',
    location: 'Sayana Mandapam',
    category: 'Night Ritual',
    status: 'Upcoming',
    active: true
  }
];

// Initial Facilities
export const initialFacilities: IFacility[] = [
  {
    _id: 'fac_01',
    templeId: 'temple_tirumala_01',
    name: 'Pilgrim Amenities Complex (PAC I, II, III, IV)',
    category: 'Accommodation & Rest',
    description: 'Free sprawling locker and hall facilities with clean bathrooms, continuous geyser hot water, and rest areas for 30,000+ pilgrims.',
    location: 'Near Central Bus Stand & Railway Booking Office, Tirumala',
    timing: '24 Hours Open',
    status: 'Operational',
    contact: '+91 877 227 7777',
    icon: 'Building'
  },
  {
    _id: 'fac_02',
    templeId: 'temple_tirumala_01',
    name: 'Tarigonda Vengamamba Nitya Annadanam Complex',
    category: 'Free Food & Meals',
    description: 'Four enormous air-cooled dining halls serving hot sattvic meals, vegetable curries, rasam, and sweet pongal continuously.',
    location: 'Opposite Varahaswamy Temple, North Mada Street',
    timing: '09:00 AM – 11:00 PM',
    status: 'Operational',
    contact: '+91 877 226 3450',
    icon: 'Utensils'
  },
  {
    _id: 'fac_03',
    templeId: 'temple_tirumala_01',
    name: 'Kalyanakatta (Tonsure Halls)',
    category: 'Tonsuring & Rituals',
    description: 'Modern hygienic tonsuring centres staffed by licensed barbers with sterilized blades and hot water bathing facilities.',
    location: 'Main Kalyanakatta near PAC 1 & Mini Kalyanakattas across cottages',
    timing: '24 Hours Open',
    status: 'Operational',
    contact: '+91 877 227 7777',
    icon: 'Scissors'
  },
  {
    _id: 'fac_04',
    templeId: 'temple_tirumala_01',
    name: 'Free RO Drinking Water Points (Jala Prasadam)',
    category: 'Drinking Water',
    description: 'Chilled and purified reverse osmosis water dispensing stations located every 100 meters along all queue paths and mada streets.',
    location: 'All queue lines, Mada Streets, and bus stands',
    timing: '24 Hours Available',
    status: 'Available 24x7',
    contact: '1800 425 4141',
    icon: 'Droplet'
  }
];

// Initial Donations
export const initialDonations: IDonationItem[] = [
  {
    _id: 'don_01',
    templeId: 'temple_tirumala_01',
    trustName: 'Sri Venkateswara Nitya Annadanam Trust',
    donationCounterLocation: 'Annamaiah Bhavan & Central Reception Office, Tirumala',
    officialDonationUrl: 'https://ttdsevaonline.com/donations',
    instructions: 'Contributions are 100% utilized for feeding pilgrims free of charge. Donations of ₹1,000 and above qualify for Income Tax exemption under Section 80G.',
    taxExemptionInfo: '80G Income Tax Exempted'
  },
  {
    _id: 'don_02',
    templeId: 'temple_srisailam_02',
    trustName: 'Sri Srisaila Devasthanam Annadana Trust',
    donationCounterLocation: 'Administrative Building, Srisailam',
    officialDonationUrl: 'https://www.srisailadevasthanam.org/donations',
    instructions: 'Official e-Hundi and trust contributions accepted via official portal with digital receipt.',
    taxExemptionInfo: '80G Income Tax Exempted'
  },
  {
    _id: 'don_03',
    templeId: 'temple_somnath_05',
    trustName: 'Shree Somnath Trust General Fund',
    donationCounterLocation: 'Reception Centre, Somnath Temple',
    officialDonationUrl: 'https://somnath.org/online-donation',
    instructions: 'Supports coastal cleanliness, temple conservation, and free meals to visiting pilgrims.',
    taxExemptionInfo: '80G Income Tax Exempted'
  }
];

// Initial Bookings
export const initialBookings: IBooking[] = [
  {
    _id: 'bk_demo_01',
    bookingId: 'TE-BK-2026-8841',
    userId: 'user_devotee_01',
    templeId: 'temple_tirumala_01',
    templeName: 'Sri Venkateswara Temple',
    poojaId: 'pooja_tirumala_01',
    poojaName: 'Suprabhata Seva',
    date: '2026-11-20',
    slot: '03:00 AM - 03:30 AM',
    devoteeName: 'Ramesh Sharma',
    gotram: 'Kasyapa',
    nakshatram: 'Rohini',
    personCount: 2,
    phone: '+91 98765 43210',
    email: 'devotee@example.com',
    sankalpam: 'Ayushya and Family Welfare',
    amount: 240,
    paymentMode: 'Demo Online',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'bk_demo_02',
    bookingId: 'TE-BK-2026-9214',
    userId: 'user_devotee_01',
    templeId: 'temple_srisailam_02',
    templeName: 'Mallikarjuna Swamy Temple',
    poojaId: 'pooja_srisailam_01',
    poojaName: 'Garbhalaya Sparsha Darshanam & Abhishekam',
    date: '2026-11-25',
    slot: '06:00 AM - 07:30 AM',
    devoteeName: 'Ramesh Sharma',
    gotram: 'Kasyapa',
    nakshatram: 'Rohini',
    personCount: 1,
    phone: '+91 98765 43210',
    email: 'devotee@example.com',
    sankalpam: 'Health and Prosperity',
    amount: 500,
    paymentMode: 'Demo Online',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  }
];

// Initial Calendar Events matching reference mockup
export const initialCalendarEvents: ICalendarEvent[] = [
  {
    _id: 'cal_01',
    templeId: 'temple_tirumala_01',
    templeName: 'Sri Venkateswara Temple',
    title: 'Special Seva & Sahasra Deepalankarana',
    date: '2026-11-15',
    time: '6:00 AM – 8:00 AM',
    category: 'Special Seva',
    description: 'Auspicious morning seva celebrating Karthika Masam with sacred lamps and special Vedic recitations.',
    location: 'Unjal Mandapam & Sanctum',
    priority: 'Special'
  },
  {
    _id: 'cal_02',
    templeId: 'temple_tirumala_01',
    templeName: 'Sri Venkateswara Temple',
    title: 'Temple Timings Change for Festival Rush',
    date: '2026-11-15',
    time: 'All Day',
    category: 'Timing Change',
    description: 'Sarva Darshan queue opens early at 4:30 AM to accommodate pilgrim inflow.',
    location: 'Vaikuntham Queue Complex',
    priority: 'High'
  },
  {
    _id: 'cal_03',
    templeId: 'temple_srisailam_02',
    templeName: 'Mallikarjuna Swamy Temple',
    title: 'Karthika Deepotsavam & Jwala Thoranam',
    date: '2026-11-18',
    time: '6:30 PM – 9:00 PM',
    category: 'Festival',
    description: 'Lighting of 10,000 ghee diyas around the ancient prakaram walls and holy Pathalaganga.',
    location: 'Temple Outer Prakaram',
    priority: 'Special'
  },
  {
    _id: 'cal_04',
    templeId: 'temple_tirumala_01',
    templeName: 'Sri Venkateswara Temple',
    title: 'Ekadashi Special Vaikuntha Dwaram Rituals',
    date: '2026-11-20',
    time: '4:00 AM – 10:00 PM',
    category: 'Festival',
    description: 'Sacred Vaikuntha Dwaram circumambulation open for all devotees participating in day-long poojas.',
    location: 'Ananda Nilayam Sanctum',
    priority: 'Special'
  },
  {
    _id: 'cal_05',
    templeId: 'temple_somnath_05',
    templeName: 'Somnath Temple',
    title: 'Somnath Mahadev Sandhya Aarti & Sound & Light Show',
    date: '2026-11-22',
    time: '7:00 PM – 8:30 PM',
    category: 'Pooja',
    description: 'Grand evening seashore Aarti accompanied by traditional conch blowing and laser projection on the temple spire.',
    location: 'Main Sanctum & Shoreline Plaza',
    priority: 'Normal'
  },
  {
    _id: 'cal_06',
    templeId: 'temple_meenakshi_03',
    templeName: 'Meenakshi Amman Temple',
    title: 'Pournami Golden Chariot Procession (Thanga Ther)',
    date: '2026-11-24',
    time: '7:00 PM – 9:30 PM',
    category: 'Festival',
    description: 'Goddess Meenakshi and Lord Sundareswarar ride the magnificent Golden Chariot around the inner Chithirai corridors.',
    location: 'Chithirai Veedhi',
    priority: 'Special'
  },
  {
    _id: 'cal_07',
    templeId: 'temple_jagannath_04',
    templeName: 'Jagannath Temple',
    title: 'Kartika Purnima Boita Bandana & Mahaprasad Feast',
    date: '2026-11-24',
    time: '5:30 AM – 8:00 PM',
    category: 'Festival',
    description: 'Historical maritime boat floating festival followed by grand 56 bhog offering in Ananda Bazar.',
    location: 'Ananda Bazar & Narendra Tank',
    priority: 'High'
  },
  {
    _id: 'cal_08',
    templeId: 'all',
    templeName: 'All Temples',
    title: 'Sankashti Chaturthi Ganapathi Special Archana',
    date: '2026-11-28',
    time: '8:30 AM – 11:30 AM',
    category: 'Special Seva',
    description: 'Special modak offerings and Durva grass archana at all affiliated shrines.',
    location: 'Ganapathi Sub-shrines',
    priority: 'Normal'
  }
];

// Initial Visit Plans
export const initialVisitPlans: IVisitPlan[] = [
  {
    _id: 'plan_demo_01',
    userId: 'user_devotee_01',
    templeId: 'temple_tirumala_01',
    templeName: 'Sri Venkateswara Temple',
    visitDate: '2026-11-20',
    visitorCount: 3,
    arrivalTime: '06:00 AM',
    hasElderly: true,
    hasChildren: false,
    transportMode: 'Private Car',
    wheelchairNeeded: true,
    notes: 'Elderly mother traveling. Requires wheelchair assistance.',
    itinerary: [
      {
        time: '06:00 AM',
        title: 'Arrival & Dedicated Parking',
        description: 'Park at Medaramitta Parking Zone (Lot A). Accessible spaces with direct battery cart shuttle.',
        icon: 'Car',
        category: 'Arrival'
      },
      {
        time: '06:30 AM',
        title: 'Footwear & Luggage Deposit',
        description: 'Free lockers available at PAC-1. Wheelchairs available free of cost at the Assistance Desk.',
        icon: 'ShieldCheck',
        category: 'Preparation'
      },
      {
        time: '07:15 AM',
        title: 'Priority Entry & Darshan Line',
        description: 'Report to Special Privilege Entry Gate for senior citizens. Follow guided carpeted queue lines.',
        icon: 'BookOpen',
        category: 'Darshan'
      },
      {
        time: '09:00 AM',
        title: 'Sanctum Darshan & Harathi',
        description: 'Divine darshan of Lord Venkateswara at Ananda Nilayam. Receive sanctum teertham.',
        icon: 'Sparkles',
        category: 'Sanctum'
      },
      {
        time: '09:45 AM',
        title: 'Prasadam Collection & Annadanam',
        description: 'Collect famous Tirupati Laddus at Counter 12. Free hygienic hot meal at Matrusri Tarigonda Vengamamba complex.',
        icon: 'Droplet',
        category: 'Prasadam'
      },
      {
        time: '11:00 AM',
        title: 'Holy Teertham & Departure',
        description: 'Visit Swami Pushkarini teertham and proceed smoothly back to parking shuttle.',
        icon: 'Clock',
        category: 'Wrap-up'
      }
    ],
    summary: {
      recommendedArrival: '06:00 AM (Early morning avoiding peak afternoon queue)',
      estimatedDuration: '4 - 5 Hours (including Annadanam & Prasadam counter)',
      parkingZone: 'Medaramitta Parking Complex (500 spaces, wheelchair friendly)',
      prasadamCounter: 'Counters 1-16 (Open 24 hours)',
      emergencyDesk: 'Aswini Hospital & Central Medical Centre (+91 877 227 7777)',
      dressCodeSummary: 'Traditional only: Dhoti/Kurta for men, Saree/Chudidar with dupatta for women.'
    },
    createdAt: new Date().toISOString()
  }
];

// Initial Feedback
export const initialFeedback: IFeedback[] = [
  {
    _id: 'fb_01',
    userId: 'user_devotee_01',
    userName: 'Ramesh Sharma',
    userEmail: 'devotee@example.com',
    templeId: 'temple_tirumala_01',
    templeName: 'Sri Venkateswara Temple',
    overallRating: 5,
    useful: true,
    navigationRating: 5,
    facilitiesRating: 5,
    experienceText: 'Temple Ease made our pilgrimage completely stress-free! The parking directions and wheelchair information for my elderly mother were exact and accurate.',
    suggestions: 'Would love if live crowd wait times can be added during festival days.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'fb_02',
    userName: 'Priya Sundaram',
    userEmail: 'priya.s@example.com',
    templeId: 'temple_meenakshi_03',
    templeName: 'Meenakshi Amman Temple',
    overallRating: 5,
    useful: true,
    navigationRating: 5,
    facilitiesRating: 4,
    experienceText: 'The dress code guidelines and pooja timings saved us so much confusion at the entrance. The multi-language support in Tamil is wonderful!',
    suggestions: 'Add information about nearby luggage cloakrooms.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: 'fb_03',
    userName: 'Anand Kulkarni',
    userEmail: 'anand.k@example.com',
    templeId: 'temple_somnath_05',
    templeName: 'Somnath Temple',
    overallRating: 5,
    useful: true,
    navigationRating: 5,
    facilitiesRating: 5,
    experienceText: 'Very clean and easy-to-use platform. We booked our evening seva slot and downloaded the pass on our phone without any paperwork.',
    suggestions: 'Great work by the student engineering team!',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    _id: 'fb_04',
    userName: 'Karthik Rao',
    userEmail: 'karthik.r@example.com',
    templeId: 'temple_srisailam_02',
    templeName: 'Mallikarjuna Swamy Temple',
    overallRating: 4,
    useful: true,
    navigationRating: 4,
    facilitiesRating: 4,
    experienceText: 'The trip planner gave us a complete schedule that we printed before our drive from Hyderabad. Everything was as described.',
    suggestions: 'Keep up the good community service.',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];
