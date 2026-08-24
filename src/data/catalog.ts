// Content ported from the existing Vaidh Bharti site. Edit freely.
export interface Product { id:string; name:string; category:string; categoryLabel:string; images:string[]; description:string; shortDesc:string; benefits:string[]; ingredients:string[]; usage:string; weight:string; price:number; mrp:number; stock:number; sku:string; tags:string[]; rating:number; reviews:{author:string;rating:number;text:string}[]; featured:boolean; bestseller:boolean; new:boolean; }
export const PRODUCTS: Product[] = [
  {
    "id": "vb-oil-001",
    "name": "Bala Ashwagandha Tailam",
    "category": "oils",
    "categoryLabel": "Ayurvedic Oils",
    "images": [
      "https://images.pexels.com/photos/7020055/pexels-photo-7020055.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/4173450/pexels-photo-4173450.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "A traditional Ayurvedic body oil blending Bala and Ashwagandha in a sesame oil base. Supports daily Abhyanga self-massage for muscle ease and calm.",
    "shortDesc": "Traditional Ayurvedic body oil for daily Abhyanga and muscle ease.",
    "benefits": [
      "Supports muscle comfort",
      "Calms the body before rest",
      "Nourishes skin texture",
      "Traditional Vata-balancing oil"
    ],
    "ingredients": [
      "Sesame oil (Tila Taila)",
      "Bala (Sida cordifolia)",
      "Ashwagandha (Withania somnifera)",
      "Masha extract"
    ],
    "usage": "Warm slightly and massage gently over the body 15-20 minutes before bathing. Use 2-3 times per week.",
    "weight": "200 ml",
    "price": 540,
    "mrp": 720,
    "stock": 24,
    "sku": "VB-OIL-001",
    "tags": [
      "abhyanga",
      "vata",
      "muscle",
      "massage",
      "ashwagandha"
    ],
    "rating": 4.7,
    "reviews": [
      {
        "author": "Ramesh K.",
        "rating": 5,
        "text": "Excellent oil for evening massage. Very calming."
      },
      {
        "author": "Priya S.",
        "rating": 4,
        "text": "Good quality, authentic aroma. Takes a moment to absorb."
      }
    ],
    "featured": true,
    "bestseller": true,
    "new": false
  },
  {
    "id": "vb-powder-001",
    "name": "Triphala Churna",
    "category": "powders",
    "categoryLabel": "Herbal Powders",
    "images": [
      "https://images.pexels.com/photos/2633406/pexels-photo-2633406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/15760105/pexels-photo-15760105.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "The classic three-fruit formulation of Amalaki, Bibhitaki and Haritaki. A daily digestive support powder used in Ayurveda for gentle cleansing.",
    "shortDesc": "Classic three-fruit powder for daily digestive support.",
    "benefits": [
      "Supports natural digestion",
      "Traditional gentle cleanse",
      "Rich in Amalaki (Vitamin C)",
      "Evening wellness ritual"
    ],
    "ingredients": [
      "Amalaki (Emblica officinalis)",
      "Bibhitaki (Terminalia bellirica)",
      "Haritaki (Terminalia chebula)"
    ],
    "usage": "Take 1 teaspoon with warm water at bedtime, or as advised by an Ayurvedic practitioner.",
    "weight": "100 g",
    "price": 210,
    "mrp": 280,
    "stock": 60,
    "sku": "VB-POW-001",
    "tags": [
      "digestion",
      "triphala",
      "cleanse",
      "amalaki",
      "herbal"
    ],
    "rating": 4.8,
    "reviews": [
      {
        "author": "Anita R.",
        "rating": 5,
        "text": "Best Triphala I have used. Very fresh."
      },
      {
        "author": "Suresh M.",
        "rating": 5,
        "text": "Gentle and effective. Part of my nightly routine."
      }
    ],
    "featured": true,
    "bestseller": true,
    "new": false
  },
  {
    "id": "vb-shilajit-001",
    "name": "Pure Shilajit Resin",
    "category": "shilajit",
    "categoryLabel": "Shilajit",
    "images": [
      "https://images.pexels.com/photos/7526061/pexels-photo-7526061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/7526051/pexels-photo-7526051.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "Premium gold-grade Shilajit resin sourced from high-altitude rocks. Carefully purified using traditional Ayurvedic methods to retain natural fulvic acid.",
    "shortDesc": "Gold-grade purified Shilajit resin with natural fulvic acid.",
    "benefits": [
      "Supports natural vitality",
      "Traditional Rasayana for rejuvenation",
      "Contains natural fulvic acid",
      "Used in Ayurvedic wellness for stamina"
    ],
    "ingredients": [
      "Purified Shilajit resin (Suddha Shilajitu)"
    ],
    "usage": "Dissolve a rice-grain sized portion (approx. 250 mg) in warm water or milk once daily, or as advised by a practitioner.",
    "weight": "20 g",
    "price": 1290,
    "mrp": 1690,
    "stock": 12,
    "sku": "VB-SHL-001",
    "tags": [
      "shilajit",
      "resin",
      "vitality",
      "rasayana",
      "fulvic"
    ],
    "rating": 4.9,
    "reviews": [
      {
        "author": "Vikram J.",
        "rating": 5,
        "text": "Genuine resin, dissolves cleanly. Highly recommended."
      },
      {
        "author": "Meena D.",
        "rating": 5,
        "text": "Excellent purity. You can feel the difference."
      },
      {
        "author": "Arjun T.",
        "rating": 4,
        "text": "Good product, packaging could be better."
      }
    ],
    "featured": true,
    "bestseller": true,
    "new": true
  },
  {
    "id": "vb-cap-001",
    "name": "Ashwagandha Capsules",
    "category": "capsules",
    "categoryLabel": "Capsules",
    "images": [
      "https://images.pexels.com/photos/13787594/pexels-photo-13787594.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/13787562/pexels-photo-13787562.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "Vegetarian capsules of standardised Ashwagandha root extract. A traditional adaptogen used in Ayurveda to support stress response and calm.",
    "shortDesc": "Standardised Ashwagandha root capsules for daily stress support.",
    "benefits": [
      "Supports stress response",
      "Traditional adaptogen",
      "Promotes calm focus",
      "Veggie capsules"
    ],
    "ingredients": [
      "Ashwagandha root extract (Withania somnifera) 500 mg"
    ],
    "usage": "1 capsule twice daily after meals with warm water, or as advised.",
    "weight": "60 capsules",
    "price": 460,
    "mrp": 590,
    "stock": 40,
    "sku": "VB-CAP-001",
    "tags": [
      "ashwagandha",
      "stress",
      "adaptogen",
      "capsules"
    ],
    "rating": 4.6,
    "reviews": [
      {
        "author": "Kavya P.",
        "rating": 5,
        "text": "Helps me stay calm during long work days."
      },
      {
        "author": "Rohit B.",
        "rating": 4,
        "text": "Good quality ashwagandha. Took 2 weeks to notice."
      }
    ],
    "featured": true,
    "bestseller": true,
    "new": false
  },
  {
    "id": "vb-skin-001",
    "name": "Kumkumadi Tailam Face Oil",
    "category": "skin-care",
    "categoryLabel": "Skin Care",
    "images": [
      "https://images.pexels.com/photos/4841234/pexels-photo-4841234.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/4173450/pexels-photo-4173450.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "The legendary Ayurvedic facial oil with Saffron, Sandalwood and a blend of healing herbs in a sesame and milk base. Supports natural skin glow and even tone.",
    "shortDesc": "Saffron-and-sandalwood Ayurvedic facial oil for natural glow.",
    "benefits": [
      "Supports natural skin glow",
      "Traditional facial oil",
      "Helps even skin tone",
      "Suitable for nightly use"
    ],
    "ingredients": [
      "Sesame oil",
      "Goat milk",
      "Saffron (Kesar)",
      "Sandalwood (Chandana)",
      "Licorice (Yashtimadhu)",
      "Vetiver"
    ],
    "usage": "Apply 3-4 drops to cleansed face at night. Gently massage in upward strokes.",
    "weight": "30 ml",
    "price": 890,
    "mrp": 1150,
    "stock": 18,
    "sku": "VB-SKN-001",
    "tags": [
      "kumkumadi",
      "face oil",
      "saffron",
      "glow",
      "skin"
    ],
    "rating": 4.7,
    "reviews": [
      {
        "author": "Sneha L.",
        "rating": 5,
        "text": "Beautiful oil, skin looks brighter in a week."
      },
      {
        "author": "Divya N.",
        "rating": 4,
        "text": "Authentic aroma, a little goes a long way."
      }
    ],
    "featured": true,
    "bestseller": false,
    "new": true
  },
  {
    "id": "vb-well-001",
    "name": "Chyawanprash Awaleha",
    "category": "wellness",
    "categoryLabel": "Wellness Products",
    "images": [
      "https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/7526061/pexels-photo-7526061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "Traditional Chyawanprash prepared in a ghee and sesame oil base with Amalaki and over 30 herbs. A daily Rasayana for overall wellness support.",
    "shortDesc": "Classic Chyawanprash with Amalaki and over 30 Ayurvedic herbs.",
    "benefits": [
      "Daily Rasayana for wellness",
      "Rich in Amalaki",
      "Traditional preparation in ghee base",
      "For all ages"
    ],
    "ingredients": [
      "Amalaki",
      "Ghee",
      "Sesame oil",
      "Honey",
      "Bilva, Agnimantha, Syonaka",
      "30+ Ayurvedic herbs"
    ],
    "usage": "1 teaspoon daily with warm milk in the morning, or as advised.",
    "weight": "500 g",
    "price": 380,
    "mrp": 480,
    "stock": 35,
    "sku": "VB-WEL-001",
    "tags": [
      "chyawanprash",
      "rasayana",
      "amalaki",
      "immunity",
      "wellness"
    ],
    "rating": 4.8,
    "reviews": [
      {
        "author": "Lakshmi V.",
        "rating": 5,
        "text": "Tastes like the traditional one my grandmother made."
      },
      {
        "author": "Karthik R.",
        "rating": 5,
        "text": "Whole family takes it daily. Great quality."
      }
    ],
    "featured": true,
    "bestseller": true,
    "new": false
  },
  {
    "id": "vb-oil-002",
    "name": "Bhringamala Hair Oil",
    "category": "oils",
    "categoryLabel": "Ayurvedic Oils",
    "images": [
      "https://images.pexels.com/photos/19833253/pexels-photo-19833253.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/18066459/pexels-photo-18066459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "A coconut and sesame oil base infused with Bhringraj, Amla and Brahmi. Traditional Ayurvedic hair oil supporting scalp health and hair strength.",
    "shortDesc": "Bhringraj and Amla hair oil for scalp health and hair strength.",
    "benefits": [
      "Supports scalp health",
      "Traditional hair-strengthening herbs",
      "Coconut + sesame base",
      "For weekly oil massage"
    ],
    "ingredients": [
      "Coconut oil",
      "Sesame oil",
      "Bhringraj",
      "Amla",
      "Brahmi",
      "Curry leaf"
    ],
    "usage": "Massage into scalp and hair 2 hours before washing. Use twice weekly.",
    "weight": "200 ml",
    "price": 380,
    "mrp": 490,
    "stock": 28,
    "sku": "VB-OIL-002",
    "tags": [
      "hair",
      "bhringraj",
      "amla",
      "scalp",
      "oil"
    ],
    "rating": 4.5,
    "reviews": [
      {
        "author": "Pooja G.",
        "rating": 5,
        "text": "Reduced my hair fall noticeably in a month."
      },
      {
        "author": "Nisha R.",
        "rating": 4,
        "text": "Nice herbal smell, works well."
      }
    ],
    "featured": false,
    "bestseller": true,
    "new": false
  },
  {
    "id": "vb-powder-002",
    "name": "Ashwagandha Churna",
    "category": "powders",
    "categoryLabel": "Herbal Powders",
    "images": [
      "https://images.pexels.com/photos/5480036/pexels-photo-5480036.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/29387145/pexels-photo-29387145.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "Pure Ashwagandha root powder, sun-dried and finely milled. A versatile adaptogenic powder for mixing with warm milk or water.",
    "shortDesc": "Pure sun-dried Ashwagandha root powder.",
    "benefits": [
      "Adaptogen support",
      "Mix with warm milk or water",
      "Traditional Rasayana",
      "No fillers"
    ],
    "ingredients": [
      "Ashwagandha root (Withania somnifera) 100%"
    ],
    "usage": "1/2 teaspoon with warm milk at night, or as advised.",
    "weight": "100 g",
    "price": 290,
    "mrp": 360,
    "stock": 50,
    "sku": "VB-POW-002",
    "tags": [
      "ashwagandha",
      "powder",
      "adaptogen",
      "rasayana"
    ],
    "rating": 4.6,
    "reviews": [
      {
        "author": "Rajeev T.",
        "rating": 5,
        "text": "Pure powder, no bitterness. Good quality."
      }
    ],
    "featured": false,
    "bestseller": false,
    "new": false
  },
  {
    "id": "vb-cap-002",
    "name": "Brahmi Memory Capsules",
    "category": "capsules",
    "categoryLabel": "Capsules",
    "images": [
      "https://images.pexels.com/photos/13779111/pexels-photo-13779111.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/13779115/pexels-photo-13779115.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "Brahmi (Bacopa monnieri) extract in vegetarian capsules. Traditionally used in Ayurveda to support cognitive function and calm focus.",
    "shortDesc": "Brahmi extract capsules for cognitive support and calm focus.",
    "benefits": [
      "Supports cognitive function",
      "Traditional medhya Rasayana",
      "Promotes calm focus",
      "Veggie capsules"
    ],
    "ingredients": [
      "Brahmi extract (Bacopa monnieri) 450 mg"
    ],
    "usage": "1 capsule twice daily after meals, or as advised.",
    "weight": "60 capsules",
    "price": 420,
    "mrp": 540,
    "stock": 30,
    "sku": "VB-CAP-002",
    "tags": [
      "brahmi",
      "memory",
      "cognitive",
      "medhya"
    ],
    "rating": 4.5,
    "reviews": [
      {
        "author": "Arun S.",
        "rating": 4,
        "text": "Helps with focus during study sessions."
      }
    ],
    "featured": false,
    "bestseller": false,
    "new": true
  },
  {
    "id": "vb-skin-002",
    "name": "Neem Tulsi Face Wash",
    "category": "skin-care",
    "categoryLabel": "Skin Care",
    "images": [
      "https://images.pexels.com/photos/18992755/pexels-photo-18992755.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/19522722/pexels-photo-19522722.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "A gentle Ayurvedic face wash with Neem and Tulsi extracts. Supports clear, balanced skin without over-drying.",
    "shortDesc": "Neem and Tulsi face wash for clear, balanced skin.",
    "benefits": [
      "Supports clear skin",
      "Neem and Tulsi extracts",
      "Gentle daily use",
      "SLS-free formula"
    ],
    "ingredients": [
      "Neem extract",
      "Tulsi extract",
      "Aloe vera",
      "Glycerin",
      "Natural surfactants"
    ],
    "usage": "Massage onto wet face, rinse with water. Use morning and evening.",
    "weight": "100 ml",
    "price": 240,
    "mrp": 320,
    "stock": 44,
    "sku": "VB-SKN-002",
    "tags": [
      "neem",
      "tulsi",
      "face wash",
      "acne",
      "skin"
    ],
    "rating": 4.4,
    "reviews": [
      {
        "author": "Ritu M.",
        "rating": 4,
        "text": "Gentle and effective for daily use."
      }
    ],
    "featured": false,
    "bestseller": false,
    "new": false
  },
  {
    "id": "vb-shilajit-002",
    "name": "Shilajit Gold Tablets",
    "category": "shilajit",
    "categoryLabel": "Shilajit",
    "images": [
      "https://images.pexels.com/photos/13787643/pexels-photo-13787643.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/13779111/pexels-photo-13779111.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "Shilajit tablets blended with Kesar and Swarna Bhasma for a traditional Rasayana formulation supporting vitality and stamina.",
    "shortDesc": "Shilajit with Kesar and Swarna Bhasma for vitality support.",
    "benefits": [
      "Traditional Rasayana blend",
      "With Kesar and Swarna Bhasma",
      "Convenient tablet form",
      "Supports natural stamina"
    ],
    "ingredients": [
      "Shilajit extract",
      "Saffron (Kesar)",
      "Swarna Bhasma",
      "Ashwagandha"
    ],
    "usage": "1 tablet twice daily with warm milk, or as advised.",
    "weight": "30 tablets",
    "price": 980,
    "mrp": 1290,
    "stock": 16,
    "sku": "VB-SHL-002",
    "tags": [
      "shilajit",
      "vitality",
      "rasayana",
      "stamina"
    ],
    "rating": 4.6,
    "reviews": [
      {
        "author": "Manish K.",
        "rating": 5,
        "text": "Good energy support. Premium quality."
      }
    ],
    "featured": false,
    "bestseller": true,
    "new": false
  },
  {
    "id": "vb-well-002",
    "name": "Ayu Detox Kadha",
    "category": "wellness",
    "categoryLabel": "Wellness Products",
    "images": [
      "https://images.pexels.com/photos/29387145/pexels-photo-29387145.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/20689436/pexels-photo-20689436.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
    ],
    "description": "A traditional herbal decoction blend of Tulsi, Ginger, Cinnamon, Mulethi and Black Pepper. Supports daily wellness and respiratory comfort.",
    "shortDesc": "Herbal Kadha blend of Tulsi, Ginger and Cinnamon for daily wellness.",
    "benefits": [
      "Daily wellness support",
      "Traditional decoction blend",
      "Supports respiratory comfort",
      "Caffeine-free"
    ],
    "ingredients": [
      "Tulsi",
      "Ginger",
      "Cinnamon",
      "Mulethi (Licorice)",
      "Black Pepper",
      "Giloy"
    ],
    "usage": "Boil 1 teaspoon in 2 cups water until reduced to 1 cup. Filter and drink warm.",
    "weight": "150 g",
    "price": 320,
    "mrp": 420,
    "stock": 38,
    "sku": "VB-WEL-002",
    "tags": [
      "kadha",
      "detox",
      "tulsi",
      "immunity",
      "wellness"
    ],
    "rating": 4.5,
    "reviews": [
      {
        "author": "Gita S.",
        "rating": 5,
        "text": "Perfect for winter mornings. Very soothing."
      }
    ],
    "featured": false,
    "bestseller": false,
    "new": true
  }
];
export interface Category { id:string; name:string; desc:string; image:string; }
export const CATEGORIES: Category[] = [
  {
    "id": "oils",
    "name": "Ayurvedic Oils",
    "desc": "Traditional Abhyanga and therapeutic oils.",
    "image": "https://images.pexels.com/photos/7020055/pexels-photo-7020055.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "powders",
    "name": "Herbal Powders",
    "desc": "Pure Churna formulations in classic form.",
    "image": "https://images.pexels.com/photos/2633406/pexels-photo-2633406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "shilajit",
    "name": "Shilajit",
    "desc": "Gold-grade purified Shilajit resin and tablets.",
    "image": "https://images.pexels.com/photos/7526061/pexels-photo-7526061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "capsules",
    "name": "Capsules",
    "desc": "Convenient Ayurvedic extract capsules.",
    "image": "https://images.pexels.com/photos/13787594/pexels-photo-13787594.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "skin-care",
    "name": "Skin Care",
    "desc": "Kumkumadi, Neem and herbal skincare.",
    "image": "https://images.pexels.com/photos/4841234/pexels-photo-4841234.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "wellness",
    "name": "Wellness Products",
    "desc": "Chyawanprash, Kadha and daily Rasayanas.",
    "image": "https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  }
];
export interface BlogPost { id:string; title:string; category:string; date:string; image:string; excerpt:string; readTime:string; body:string; }
export const BLOG_POSTS: BlogPost[] = [
  {
    "id": "blog-01",
    "title": "Understanding Your Dosha: A Beginner's Guide to Vata, Pitta and Kapha",
    "category": "Ayurveda",
    "date": "2026-07-28",
    "image": "https://images.pexels.com/photos/8981374/pexels-photo-8981374.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "excerpt": "The foundation of Ayurveda rests on three doshas. Learn how to identify your constitution and balance it through daily choices.",
    "readTime": "6 min",
    "body": "<p>Ayurveda teaches that every individual is made of a unique combination of the three doshas — Vata, Pitta and Kapha. These energies govern not just our physiology, but our temperament, preferences and tendencies.</p>\n<h2>The Three Doshas</h2>\n<p><strong>Vata</strong> (air + space) governs movement, breath and the nervous system. When balanced, creativity flows; when aggravated, anxiety and dryness may increase.</p>\n<p><strong>Pitta</strong> (fire + water) governs digestion, transformation and intellect. Balanced Pitta brings sharp focus; excess Pitta can lead to irritation and heat.</p>\n<p><strong>Kapha</strong> (earth + water) governs structure, stability and immunity. Balanced Kapha is grounded and nurturing; excess Kapha may feel heavy or sluggish.</p>\n<h2>Finding Your Balance</h2>\n<p>Your prakriti (natural constitution) is set at birth, but your vikriti (current state) shifts with season, diet and stress. A qualified Ayurvedic practitioner can assess both through Nadi Pariksha and detailed questioning.</p>\n<blockquote>Ayurveda does not ask 'what disease do you have?' It asks 'who has the disease, and what is out of balance?'</blockquote>\n<h2>Daily Practices</h2>\n<p>Simple Dinacharya (daily routine) — tongue scraping, warm water, Abhyanga, seasonal eating — form the backbone of dosha balancing. Consult our Vaidya for a plan tailored to your constitution.</p>"
  },
  {
    "id": "blog-02",
    "title": "Abhyanga: The Ayurvedic Art of Self-Massage",
    "category": "Lifestyle",
    "date": "2026-07-15",
    "image": "https://images.pexels.com/photos/38494113/pexels-photo-38494113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "excerpt": "Daily oil massage is one of Ayurveda's most grounding rituals. Discover the right oil and method for your dosha.",
    "readTime": "5 min",
    "body": "<p>Abhyanga — the practice of massaging warm oil over the body — is a cornerstone of Ayurvedic Dinacharya. The Charaka Samhita describes it as a daily practice that pacifies Vata, softens skin and builds Ojas (vitality).</p>\n<h2>Choosing Your Oil</h2>\n<p><strong>Sesame oil</strong> is warming and ideal for Vata. <strong>Coconut oil</strong> is cooling and suits Pitta. <strong>Mustard or lighter oils</strong> can work for Kapha when used briskly.</p>\n<h2>The Method</h2>\n<p>Warm the oil gently, apply in long strokes on long bones and circular strokes on joints. Allow 15-20 minutes before a warm shower. Practice 2-4 times per week.</p>\n<blockquote>The body of one who uses oil massage daily does not become affected much even if subjected to accidental injuries. — Charaka Samhita</blockquote>"
  },
  {
    "id": "blog-03",
    "title": "Triphala: Three Fruits, One Daily Ritual",
    "category": "Herbal Remedies",
    "date": "2026-06-30",
    "image": "https://images.pexels.com/photos/2633406/pexels-photo-2633406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "excerpt": "Amalaki, Bibhitaki and Haritaki — three fruits that have anchored Ayurvedic digestive care for centuries.",
    "readTime": "4 min",
    "body": "<p>Triphala literally means 'three fruits'. It is among the most widely used Ayurvedic formulations, valued for gentle digestive support and as a daily Rasayana.</p>\n<h2>The Three Fruits</h2>\n<p><strong>Amalaki</strong> nourishes and is rich in Vitamin C. <strong>Bibhitaki</strong> supports gentle elimination. <strong>Haritaki</strong> is considered the 'king of medicines' in Tibetan tradition.</p>\n<h2>How to Take</h2>\n<p>1 teaspoon of Triphala churna with warm water at bedtime is the classic method. Always consult a practitioner for personalised dosing.</p>"
  },
  {
    "id": "blog-04",
    "title": "Eating for the Seasons: Ritucharya in Modern Life",
    "category": "Nutrition",
    "date": "2026-06-12",
    "image": "https://images.pexels.com/photos/20689437/pexels-photo-20689437.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "excerpt": "Ayurveda's seasonal regimen, Ritucharya, offers timeless guidance on adjusting diet and lifestyle through the year.",
    "readTime": "7 min",
    "body": "<p>Ritucharya — the Ayurvedic science of seasonal living — explains how to adapt diet, routine and herbs as the doshas rise and fall through the year.</p>\n<h2>Late Winter & Spring (Kapha season)</h2>\n<p>Favour warm, light, gently spiced foods. Honey, ginger and light legumes help balance accumulating Kapha.</p>\n<h2>Summer (Pitta season)</h2>\n<p>Cooling, sweet foods — coconut water, ripe fruits, milk, ghee — protect against excess heat.</p>\n<h2>Autumn & Early Winter (Vata season)</h2>\n<p>Warm, moist, grounding foods — soups, stews, soaked nuts, sesame oil — calm rising Vata.</p>\n<blockquote>When you eat according to the season, the body needs far less medicine.</blockquote>"
  },
  {
    "id": "blog-05",
    "title": "Shilajit: The Ancient Rasayana of the Mountains",
    "category": "Ayurvedic Tips",
    "date": "2026-05-28",
    "image": "https://images.pexels.com/photos/7526061/pexels-photo-7526061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "excerpt": "What makes Shilajit so revered in Ayurveda? Understand its origin, traditional uses and how to choose pure resin.",
    "readTime": "5 min",
    "body": "<p>Shilajit is a mineral-rich resin that exudes from rocks in high mountain ranges during summer. In Ayurveda it is classified as a Rasayana — a rejuvenative substance.</p>\n<h2>How to Identify Pure Shilajit</h2>\n<p>Pure resin is dark, has a distinct earthy aroma, dissolves cleanly in warm water and leaves minimal residue. Avoid powders with fillers.</p>\n<h2>Traditional Use</h2>\n<p>A rice-grain sized portion dissolved in warm milk or water, once daily. Always under the guidance of an Ayurvedic practitioner.</p>"
  },
  {
    "id": "blog-06",
    "title": "Better Sleep the Ayurvedic Way",
    "category": "Wellness",
    "date": "2026-05-10",
    "image": "https://images.pexels.com/photos/7878206/pexels-photo-7878206.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "excerpt": "Restless nights? Ayurveda links sleep quality to Vata and Pitta balance. Practical evening rituals that help.",
    "readTime": "6 min",
    "body": "<p>In Ayurveda, sleep (Nidra) is one of the three pillars of health alongside diet and energy management. Poor sleep is most often linked to aggravated Vata or Pitta.</p>\n<h2>Evening Ritual</h2>\n<p>Warm oil foot massage, a cup of warm milk with a pinch of nutmeg, and avoiding screens after 9 PM can transform sleep quality over a few weeks.</p>\n<h2>Herbs That Support Rest</h2>\n<p>Ashwagandha, Brahmi and Tagara are traditionally used. Always consult a practitioner for the right combination for your constitution.</p>"
  }
];
export const FAQS = [
  {
    "q": "How do I book an Ayurvedic consultation?",
    "a": "Visit the Consultation page, choose your preferred consultation type (online, phone, in-person or Nadi Pariksha), select a date and time slot, fill in your details and complete the booking. You will receive a confirmation with your booking ID."
  },
  {
    "q": "Are your Ayurvedic products safe to use with my current medication?",
    "a": "Our products are traditional Ayurvedic formulations, but we always recommend consulting an Ayurvedic practitioner or your physician before combining any herbal products with existing medication."
  },
  {
    "q": "How should I store Ayurvedic oils and powders?",
    "a": "Store in a cool, dry place away from direct sunlight. Keep containers tightly sealed. Oils should be kept at room temperature; avoid refrigeration."
  },
  {
    "q": "What is your shipping policy?",
    "a": "We ship across India. Orders are dispatched within 1-2 business days and typically delivered in 3-7 days depending on location. Free shipping is available on orders above ₹999."
  },
  {
    "q": "What is your return and refund policy?",
    "a": "Unopened products can be returned within 7 days of delivery for a full refund. Please contact us with your order ID to initiate a return."
  },
  {
    "q": "How do I know which products are right for my constitution?",
    "a": "We recommend booking a consultation with our Vaidya who can assess your dosha and current imbalances, and suggest suitable products and routines."
  },
  {
    "q": "Is Nadi Pariksha available online?",
    "a": "Nadi Pariksha (pulse diagnosis) requires physical presence and is offered only as an in-person consultation at Panchsheel Aarogya Dhaam."
  },
  {
    "q": "Are your products tested for quality?",
    "a": "Yes. All products are prepared in GMP-certified facilities and undergo quality checks for purity, heavy metals and microbial safety before dispatch."
  },
  {
    "q": "Do you offer Panchakarma therapy?",
    "a": "Yes, Panchakarma is offered at Panchsheel Aarogya Dhaam. A prior consultation is required to design a personalised therapy plan. Please book a consultation to begin."
  },
  {
    "q": "How can I verify my order is authentic?",
    "a": "Every product carries a batch number and manufacturing date. You can verify authenticity by contacting us with your order ID and product details."
  }
];
export const TESTIMONIALS = [
  {
    "name": "Anjali Mehrotra",
    "location": "Delhi",
    "rating": 5,
    "text": "The consultation was thorough and the Vaidya genuinely listened. The Ayurvedic routine they suggested has helped my digestion more than anything I tried before."
  },
  {
    "name": "Rajiv Khanna",
    "location": "Chandigarh",
    "rating": 5,
    "text": "Pure Shilajit resin of excellent quality. I have tried several brands and Vaidh Bharti's is clearly the most authentic."
  },
  {
    "name": "Sunita Pillai",
    "location": "Bengaluru",
    "rating": 5,
    "text": "The Panchakarma experience at Panchsheel Aarogya Dhaam was deeply restorative. Professional care and a peaceful setting."
  },
  {
    "name": "Manoj Saxena",
    "location": "Lucknow",
    "rating": 4,
    "text": "Good products and prompt delivery. The Triphala churna is fresh and effective. Wish there were more pack sizes."
  },
  {
    "name": "Deepika Nair",
    "location": "Kochi",
    "rating": 5,
    "text": "Kumkumadi tailam has become part of my nightly ritual. My skin looks visibly brighter and more even. Highly recommend."
  }
];
export const CONSULTATION_TYPES = [
  {
    "id": "online",
    "name": "Online Consultation",
    "desc": "Video call with an Ayurvedic Vaidya",
    "price": 499,
    "icon": "video"
  },
  {
    "id": "phone",
    "name": "Phone Consultation",
    "desc": "Voice call consultation",
    "price": 399,
    "icon": "phone"
  },
  {
    "id": "inperson",
    "name": "In-Person Consultation",
    "desc": "Visit Panchsheel Aarogya Dhaam",
    "price": 799,
    "icon": "map"
  },
  {
    "id": "nadi",
    "name": "Nadi Pariksha",
    "desc": "Traditional pulse diagnosis (in-person)",
    "price": 999,
    "icon": "heart"
  }
];
export const TIME_SLOTS = ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"];
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const productSlug = (p: Product) => slugify(p.name);
export const productBySlug = (slug: string) =>
  PRODUCTS.find((p) => productSlug(p) === slug);
export const postSlug = (p: BlogPost) => slugify(p.title);
export const postBySlug = (slug: string) =>
  BLOG_POSTS.find((p) => postSlug(p) === slug);
