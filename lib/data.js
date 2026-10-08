export const CITIES = ['Casablanca','Rabat','Marrakech','Agadir','Tanger','Fès','Mohammedia','Essaouira','Dakhla'];

export const CARS = [
  { id:'dacia-logan', brand:'Dacia', model:'Logan', year:2023, type:'Berline', price:250, old_price:300, seats:5, gear:'Manuelle', fuel:'Diesel', rating:4.6, trips:312, city:'Casablanca', company:'Atlas Drive', img:'https://upload.wikimedia.org/wikipedia/commons/0/02/2021_Dacia_Logan_III_%28rear%29.jpg', tags:['Eco','Top vente'] },
  { id:'dacia-duster', brand:'Dacia', model:'Duster 4x4', year:2024, type:'SUV', price:380, seats:5, gear:'Manuelle', fuel:'Diesel', rating:4.8, trips:198, city:'Marrakech', company:'Sahara Cars', img:'https://unsplash.com/photos/1EFn8clp5Do/download?w=900&q=80', tags:['SUV','Désert'] },
  { id:'clio-5', brand:'Renault', model:'Clio 5', year:2023, type:'Citadine', price:280, seats:5, gear:'Manuelle', fuel:'Essence', rating:4.7, trips:421, city:'Rabat', company:'Atlas Drive', img:'https://unsplash.com/photos/lIxbWUJIxko/download?w=900&q=80', tags:['Ville'] },
  { id:'peugeot-208', brand:'Peugeot', model:'208 GT-Line', year:2024, type:'Citadine', price:320, seats:5, gear:'Auto', fuel:'Essence', rating:4.9, trips:156, city:'Casablanca', company:'Velora Premium', img:'https://unsplash.com/photos/1NwpPHILCFM/download?w=900&q=80', tags:['Premium'] },
  { id:'golf-8', brand:'Volkswagen', model:'Golf 8', year:2023, type:'Berline', price:450, seats:5, gear:'Auto', fuel:'Diesel', rating:4.8, trips:203, city:'Tanger', company:'Nord Auto', img:'https://unsplash.com/photos/wWZIm8vleB0/download?w=900&q=80', tags:['Confort'] },
  { id:'tucson', brand:'Hyundai', model:'Tucson', year:2024, type:'SUV', price:550, seats:5, gear:'Auto', fuel:'Hybride', rating:4.9, trips:132, city:'Agadir', company:'Sahara Cars', img:'https://unsplash.com/photos/9TUHjKs81I8/download?w=900&q=80', tags:['Famille'] },
  { id:'mercedes-c', brand:'Mercedes', model:'Classe C', year:2024, type:'Luxe', price:950, seats:5, gear:'Auto', fuel:'Essence', rating:5.0, trips:87, city:'Casablanca', company:'Velora Premium', img:'https://unsplash.com/photos/L0Y0YSmqiKM/download?w=900&q=80', tags:['Luxe','Chauffeur'] },
  { id:'range-evoque', brand:'Range Rover', model:'Evoque', year:2023, type:'Luxe', price:1100, seats:5, gear:'Auto', fuel:'Diesel', rating:4.9, trips:64, city:'Marrakech', company:'Velora Premium', img:'https://unsplash.com/photos/soJS_Ce49AI/download?w=900&q=80', tags:['Luxe'] },
  { id:'toyota-hiace', brand:'Toyota', model:'Hiace 9pl', year:2022, type:'Van', price:700, seats:9, gear:'Manuelle', fuel:'Diesel', rating:4.5, trips:143, city:'Fès', company:'Atlas Drive', img:'https://unsplash.com/photos/eEG5zGeftB8/download?w=900&q=80', tags:['Groupe'] },
  { id:'tesla-3', brand:'Tesla', model:'Model 3', year:2024, type:'Électrique', price:800, seats:5, gear:'Auto', fuel:'Électrique', rating:4.9, trips:98, city:'Rabat', company:'Nord Auto', img:'https://unsplash.com/photos/L1_XWJ_bRSM/download?w=900&q=80', tags:['Éco','Électrique'] },
  { id:'kia-picanto', brand:'Kia', model:'Picanto', year:2023, type:'Citadine', price:220, seats:5, gear:'Manuelle', fuel:'Essence', rating:4.4, trips:287, city:'Essaouira', company:'Sahara Cars', img:'https://unsplash.com/photos/lb4Ed7w7PJo/download?w=900&q=80', tags:['Budget'] },
  { id:'bmw-x3', brand:'BMW', model:'X3 xDrive', year:2024, type:'SUV', price:890, seats:5, gear:'Auto', fuel:'Diesel', rating:4.9, trips:76, city:'Casablanca', company:'Velora Premium', img:'https://unsplash.com/photos/c8BqSLr5xQg/download?w=900&q=80', tags:['Premium'] },
];

export const COMPANIES = [
  { name:'Atlas Drive', city:'Casablanca', cars:48, rating:4.7, phone:'+212 6 61 00 00 01', img:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600' },
  { name:'Sahara Cars', city:'Marrakech', cars:36, rating:4.8, phone:'+212 6 61 00 00 02', img:'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600' },
  { name:'Velora Premium', city:'Casablanca', cars:22, rating:5.0, phone:'+212 6 61 00 00 03', img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600' },
  { name:'Nord Auto', city:'Tanger', cars:29, rating:4.6, phone:'+212 6 61 00 00 04', img:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600' },
];

export const REVIEWS = [
  { n:'Salma B. — Casablanca', s:5, x:'Service parfait, voiture propre, livraison à l’aéroport à l’heure. Je recommande Velora !' },
  { n:'Yassine E. — Rabat', s:5, x:'أحسن موقع كراء جربت، الثمن واضح بلا مفاجآت والتأمين شامل.' },
  { n:'Julien M. — Paris', s:5, x:'Booked from France, paid online, Duster waiting at Marrakech airport. Flawless.' },
  { n:'Khadija R. — Agadir', s:4, x:'Points fidélité + surclassement offert. Très pro.' },
];

export const FAQS = [
  { q:'Quels documents pour louer ?', a:'CIN ou passeport + permis de +2 ans + 21 ans minimum (25 ans pour luxe). Vérification identité en ligne en 5 min.' },
  { q:'Paiement en ligne ou cash ?', a:'Les deux. CMI / carte / virement ou cash à la livraison. Facture automatique.' },
  { q:'Kilométrage limité ?', a:'200 km/j inclus, 1.5 DH/km supplémentaire. Offres illimité dès 7 jours.' },
  { q:'Annulation ?', a:'Gratuite jusqu’à 48h avant. Remboursement sous 72h.' },
  { q:'Caution ?', a:'Empreinte carte 3000–15000 DH selon gamme, libérée au retour.' },
];
