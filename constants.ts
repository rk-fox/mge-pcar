import { Car, Testimonial } from './types';

export const CARS: Car[] = [
  {
    id: '1',
    brand: 'Audi',
    model: 'A4',
    version: '2.0 TFSI Prestige',
    year_fab: 2017,
    year_mod: 2017,
    price: 169900,
    mileage: 33000, // converted approx from miles in image
    transmission: 'Automático',
    fuel: 'Gasolina',
    color: 'Prata',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJs_6piKU-fHi4L1NnQ2FGQXIGnsTqAt8_WTWx1GEUk6xr0PwSgGQMRdkTupPmVk_ibibJHhJvBiSsC8PKM3gDqdDdnHs1Kfoddixgq1zckIMCA2PesofYIL7nHQxP0fFT0D7ZKaIcUWUVNul_kio2USXcTm6evFDtHhGfdZiL6JgONP9ASiugA9yAh1TGZ7lIaXpXDN-bZke4Z2LRaFLLYIKrdr8zX8bLDS7_4junwVE0K935mlSM_aIiOoQ63ma_Xp7eZG8qc096',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJs_6piKU-fHi4L1NnQ2FGQXIGnsTqAt8_WTWx1GEUk6xr0PwSgGQMRdkTupPmVk_ibibJHhJvBiSsC8PKM3gDqdDdnHs1Kfoddixgq1zckIMCA2PesofYIL7nHQxP0fFT0D7ZKaIcUWUVNul_kio2USXcTm6evFDtHhGfdZiL6JgONP9ASiugA9yAh1TGZ7lIaXpXDN-bZke4Z2LRaFLLYIKrdr8zX8bLDS7_4junwVE0K935mlSM_aIiOoQ63ma_Xp7eZG8qc096',
      'https://picsum.photos/800/600?random=101',
      'https://picsum.photos/800/600?random=102'
    ],
    description: 'Veículo impecável com teto solar, bancos em couro e revisões em dia na concessionária.',
    features: ['Teto Solar', 'Bancos de Couro', 'Sensor de Estacionamento', 'Câmera de Ré'],
    isFeatured: true
  },
  {
    id: '2',
    brand: 'Jaguar',
    model: 'XF',
    version: '2.0 R-Sport',
    year_fab: 2018,
    year_mod: 2018,
    price: 245000,
    mileage: 25000,
    transmission: 'Automático',
    fuel: 'Gasolina',
    color: 'Preto',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlbfxw4NYaZUtMVvRu6sZZsOaB6sy0qO2wvjkhfh6HycpGCUXWWrXdr7J5shBjKWRZXuZTszSo6J2VhTqYsO3I2uOovd1u-E9U35Smn8V5lIkdJU1_AFJfr8FMimi7jU4kI85SYh-x4e5KWPF4TWQRg8WYFv7dL8Fk8VnT1AGrMSyiKFVdBudt7-Q6pg95Ly-yczzflDQYPBHfFJyDxXhnZaTUqVqeL3bKcLLKRJ_3uw65qNC_GNsEOPE9NPnuWom129q_-CJ_kjvm',
    images: [],
    description: 'Puro luxo e desempenho. Motor V6 com sistema de som Meridian premium.',
    features: ['Som Meridian', 'Teto Panorâmico', 'Head-up Display'],
    isFeatured: false
  },
  {
    id: '3',
    brand: 'BMW',
    model: 'Serie 3',
    version: '320i M Sport',
    year_fab: 2017,
    year_mod: 2017,
    price: 189900,
    mileage: 33000,
    transmission: 'Automático',
    fuel: 'Flex',
    color: 'Azul Portimao',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWzHf1qzEZ-lkXIeWBTqTAxWP6OUt_6-fdc3mgJ_wHV0zRUEBlqO6l7wCXWj97A7BxIdOBlJnJhGjOssqx2IJDHntamCATIDAAMFpoBse56ic3EGaU6PYvJw2b2hLFiG8MSjb-JQAiSfpwwFzEf4koMzM5c5vEdA1pYLPR6_A9CzzDolrSDgHWnOSCHheUhAhUSL1ZvDSqWFMTKf46WaueLx2u4E0Otg1-DUCJqbsltNYlwIGTpM80gR6hPy2fs43HVRXkcsLcIRa4',
    images: [],
    description: 'A cor exclusiva mais desejada. Tecnologia e prazer ao dirigir garantidos.',
    features: ['M Sport Package', 'Digital Cockpit', 'Rodas 19'],
    isFeatured: false
  },
  {
    id: '4',
    brand: 'BMW',
    model: '420i',
    version: 'Cabrio M Sport',
    year_fab: 2019,
    year_mod: 2019,
    price: 210000,
    mileage: 32000,
    transmission: 'Automático',
    fuel: 'Gasolina',
    color: 'Preto',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkoxjr7CXcaeULEOecLrDnwWfR4DC16HSxeu6X5u_DiwLVsB61vxTNC3qgf2USeZkMnmRHA7N7l75I8ICkvn7FjLbSB7pUOUX0xAp_1GdQE1WVxhvOpQlBiA5PeLQoaUx8mEcbR5fHSttpCWospdBW1OoygrUprc2VSTFCvSBI1cDKo3gQt8fhXhh4S-9uWYHkpqvLRajEBlb0zg5lveRL5pc68DX2s7_9lYrQ7wfnz1SmftnWlliaBqN5RCQ-0Ucad1s47GwJz-Qv',
    images: [],
    description: 'Elegância esportiva em um coupé de tirar o fôlego. Segundo dono, impecável.',
    features: ['Cabriolet', 'Bancos Aquecidos', 'Harman Kardon'],
    isFeatured: true
  },
  {
    id: '5',
    brand: 'BMW',
    model: 'M4',
    version: 'Competition',
    year_fab: 2023,
    year_mod: 2023,
    price: 689900,
    mileage: 4200,
    transmission: 'Automático',
    fuel: 'Gasolina',
    color: 'Frozen Gray',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpk5UOBfiGhUoSTI--dnvA58Oqr7B4Ji4ohsYJmjdipJjLJHMUKzdvJXU92nCL0HX9hwkEk2e3HyXtLhNEKS73WwUOOEmhXIpSK7Yqv_adajOE743uGalqTc_pnVElzwH5e6HjNdOEHhTLIoDp-HSotsxSzFuvrt_TOflUGMm3-hqB3gld5dG72iJR0LVcN_cGvz6ccQI--8_eroNt-0cU75FGni-6n9DGsmDkXJ_IfwZwYPFw5RSu4s8xxT8kk-ffRBRgAoV1vKCM',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDlC46cVQOgJEV4VWMsmcYKYLxQXxzl3dPNArcZHytonF8pmd7im60Frqhy2FzGtwmcMF_62n00G8oPo5JLe7yTvlPoO2iIpW2bW3ZlT3ItJEUnrD4kHyAib2imQowoxB7iEXQh8wvmRq-UggukcEJ_tyP7af1EBDQ-USrZFltmkgHSaQBjI_Zyfjw7rAmClcS0RjWsqlFUJhit-4GCF0b_hpj5AjJJ_c4EqETsU0LWNmNDZlS0jtDXP-iS4GvLMhvG3pN33Zor6PrY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQbk4tB8fPDQhf8n9Lk8hTnetM35EjMdZHGZH3gAH2NJxkNuL_gDammch_KdUQcTm-edeLvrJLV-_vZ0ge4h4AXpqSZebG5fH0FANtr-08Tut8uWcd0S_8HjNTPA684O4aOlSwLfGG7f8EHIpmWoz44R6PapEB1TO6FvGoC2f_dOPMAfqAm4JuPXxMcGo2Y4tIGihORBe_8pDHq7cULeuDyKbmCtt4nEhR7QxTMHaSjx_KWJXQIVZOC4mYKLHCQoL5FHBhWPoI39nC',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA73Rloqhd2KQNG3027piKg3eTiLc0Z6CQ4vPvqiHuZs5e0w8Pm9vrqcSerwihfnf9CDRFxnYMiHg4dYZ5InCtA7Ip-uYFF4gvxU_IFuISVawhZgyTz6oCJ9njdEg4ZEZzehEWT5X3TNHeFGSyi_hjkqIeJPVjXNfjR4xmMMa2C7jeIB8hyvVkipYcxiz-KGZgIj4YoqnVM3Udb8DEiV20JIq8qhg5AphbdAxr_GwTb2gTd-fazOuN2PxoLb1xKm_3SdWyUG-gjBFZJ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjnXBIRnlK0HUVr4Hm9fKQ1aXfOrO5Or3ZX1Uf40nLU2s-974udnkpvMS9yIdGk8OCsfNnHDXQLsLTsbnTJUOUs4QsBFZK3x1bNN-da7B7RdNFgHEGRXvQ4WwioEyvbvXyJ-l9rOmFGEyiuM5akcD-TkQllD7i7uzWmXaR9L4IpEcVnHX9sL8tAkMpyz88tnCO0kVyeKUw6uVJyN9-SeiClaTOG72WdAuSna87LcgdHa7KZ6vCCClsCN3FG1o_GfVa3leOQu8tv4tj'
    ],
    description: 'Veículo impecável, único dono, todas as revisões feitas na concessionária. Possui pacote M-Track, bancos em concha de fibra de carbono.',
    features: ['Pacote M-Track', 'Bancos Carbono', 'Harman Kardon', 'PPF Frontal'],
    isFeatured: true
  },
  {
    id: '6',
    brand: 'Mercedes-Benz',
    model: 'E300',
    version: 'Exclusive',
    year_fab: 2021,
    year_mod: 2021,
    price: 299900,
    mileage: 8000,
    transmission: 'Automático',
    fuel: 'Gasolina',
    color: 'Prata',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbQ5L1J6wVrQ1LLTb_5ochKZLEn6myCrCJlOVev6Y00aUj_tvK0732PnkpTjXkj0j0K4u7jJisyHym-9kHLhac5YLhvVSB5VehCbzmA9eGx0Ej95e0HWJkWjI7EPhB57Nc5AhV6JoGSegh3yjNzITit9IN2SBoP20I9moMw4jwkknDr5z4NAtikEoZxrS9W2tHHftAss82wPjYfjYo5hjWHx7ralvy273zZeKMh2QdCCi0fWlYmnLV6CxqQDJa78knIuTjA6FIsqjq',
    images: [],
    description: 'Estado de zero quilômetro. Completa com todos os pacotes de assistência.',
    features: ['Driving Assistant', 'Burmester Sound', 'Soft Close'],
    isFeatured: false
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Ricardo Silva',
    role: 'Cliente desde 2021',
    text: 'Atendimento excepcional! A MGE encontrou exatamente o carro que eu buscava e cuidou de toda a burocracia.',
    rating: 5
  },
  {
    id: '2',
    name: 'Mariana Costa',
    role: 'Cliente desde 2023',
    text: 'Melhor experiência de compra que já tive. O cuidado com a revisão e a entrega do veículo impecável me surpreendeu muito.',
    rating: 5
  },
  {
    id: '3',
    name: 'Carlos Eduardo',
    role: 'Cliente desde 2022',
    text: 'Atendimento transparente e rápido. O carro que comprei estava ainda melhor do que nas fotos. Nota 10!',
    rating: 5
  }
];
