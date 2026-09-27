/* =========================================================
   7SMASH — CONTENU ÉDITABLE
   Tout le contenu "métier" du site est ici : carte, prix, horaires.
   Modifier ce fichier suffit, pas besoin de toucher au HTML.
   Carte et prix repris de la carte Uber Eats du restaurant.
   ⚠️ Horaires à valider avec le client.
   ========================================================= */

window.SMASH_DATA = {

  /* Horaires : [ouverture, fermeture] au format "HH:MM", plusieurs créneaux possibles.
     Index 0 = dimanche … 6 = samedi. Tableau vide = fermé. */
  hours: {
    0: [["18:00", "23:30"]],
    1: [["18:00", "23:30"]],
    2: [["18:00", "23:30"]],
    3: [["18:00", "23:30"]],
    4: [["18:00", "23:30"]],
    5: [["18:00", "23:30"]],
    6: [["18:00", "23:30"]]
  },

  /* Carte.
     price : prix seul · menu : prix en menu (frites + boisson) · menuNote : bonus du menu
     tag : badge optionnel · photo : chemin d'une vraie photo (sinon illustration auto)
     compact: true → catégorie affichée en liste (boissons) */
  menu: [
    {
      id: "smash",
      label: "Les Smash",
      emoji: "🍔",
      items: [
        { name: "Double Smash Burger", desc: "Double smash, cheddar, salade, pickles, oignons grillés, sauce Smash.", price: 14.90, menu: 18.90, menuNote: "+ topping cheddar", tag: "Populaire", photo: "assets/img/photo-burger.jpg" },
        { name: "Smash Tenders",       desc: "Tenders, cheddar, salade, pickles, oignons grillés, sauce Smash.",     price: 15.90, menu: 19.50, menuNote: "+ topping cheddar", tag: "Populaire" },
        { name: "Smash Bacon BBQ",     desc: "Double smash, cheddar, bacon, salade, pickles, oignons grillés, sauce BBQ.", price: 16.90, menu: 19.90, menuNote: "+ topping cheddar" },
        { name: "Smash Raclette",      desc: "Double smash, bacon, galette de pomme de terre, raclette fondante, salade, oignons grillés, topping oignons crispy.", price: 17.50, menu: 20.90, tag: "Savoyard" },
        { name: "Triple Smash",        desc: "Triple smash, oignons grillés, salade, pickles, cheddar, sauce Smash.", price: 19.50, menu: 21.90, menuNote: "+ topping Doritos & cheddar fondu", tag: "Monster" },
        { name: "Smash Cheese",        desc: "Smash, pickles, cheddar, ketchup. Le classique.",                         price: 7.00, tag: "Petit prix" }
      ]
    },
    {
      id: "tacos",
      label: "Tacos Gratinés",
      emoji: "🌯",
      items: [
        { name: "Tacos Simple Gratiné", desc: "Viande au choix, sauce au choix, sauce fromagère maison, gratiné mozza–raclette.",            price: 13.90, menu: 17.90 },
        { name: "Tacos Double Gratiné", desc: "2 galettes, 2 viandes au choix, sauce au choix, sauce fromagère maison, gratiné mozza–raclette.", price: 16.90, menu: 19.90, tag: "XL" }
      ]
    },
    {
      id: "bowls",
      label: "Bowls",
      emoji: "🥣",
      items: [
        { name: "Rice Bowl",  desc: "Riz nature, viande au choix, sauce fromagère.", price: 8.00 },
        { name: "Fries Bowl", desc: "Frites servies en bol, généreusement garnies.",  price: 15.90, tag: "Populaire" }
      ]
    },
    {
      id: "faim",
      label: "P'tite Faim",
      emoji: "🍟",
      items: [
        { name: "Frites",                    desc: "Frites nature.",                                          price: 3.95 },
        { name: "Frites Cheddar",            desc: "Frites croustillantes nappées de cheddar fondu.",         price: 4.95, tag: "Cheesy" },
        { name: "Frites Cheddar Lardinettes", desc: "Frites nappées de cheddar fondu et de lardinettes.",     price: 5.95 },
        { name: "Frites Cheddar Crispy",     desc: "Frites, cheddar, topping crispy.",                         price: 5.95 },
        { name: "Nuggets x4",                desc: "4 nuggets de poulet.",                                     price: 5.90, tag: "Populaire" },
        { name: "Tenders x2",                desc: "2 tenders de poulet.",                                     price: 7.90 },
        { name: "Tenders x4",                desc: "4 tenders de poulet.",                                     price: 14.90 },
        { name: "Camembert Frit x4",         desc: "Cœur fondant, extérieur croustillant.",                    price: 5.90 },
        { name: "Stick Mozza x4",            desc: "Bâtonnets de mozzarella, cœur fondant.",                   price: 5.90 },
        { name: "Chili Cheese x4",           desc: "Bouchées au fromage et piment, cœur fondant.",             price: 5.90, tag: "Spicy" }
      ]
    },
    {
      id: "kids",
      label: "Kids",
      emoji: "🧒",
      items: [
        { name: "Menu Smash Kid",   desc: "Smash format mini, frites, boisson. Spécial enfants.", price: 9.10 },
        { name: "Menu Nuggets Kid", desc: "4 nuggets de poulet panés, frites, boisson.",           price: 9.10 }
      ]
    },
    {
      id: "desserts",
      label: "Desserts",
      emoji: "🍰",
      items: [
        { name: "Tiramisu Speculoos", desc: "Fait maison. Crème mascarpone, biscuits Speculoos.", price: 5.90, tag: "Populaire" },
        { name: "Tiramisu Nutella",   desc: "Fait maison.",                                      price: 5.90 },
        { name: "Tiramisu Pistache",  desc: "Fait maison.",                                      price: 5.90 }
      ]
    },
    {
      id: "boissons",
      label: "Boissons",
      emoji: "🥤",
      compact: true,
      price: 2.60,
      items: [
        { name: "Coca-Cola", tag: "Populaire" }, { name: "Coca-Cola Zero" }, { name: "Coca-Cola Cherry", tag: "Populaire" },
        { name: "Fanta Orange" }, { name: "Fanta Citron", tag: "Populaire" }, { name: "Fanta Fruit du Dragon", tag: "Populaire" },
        { name: "Oasis Tropical" }, { name: "Oasis Pomme Cassis Framboise" }, { name: "Schweppes Agrumes" },
        { name: "Lipton Pastèque Menthe" }, { name: "7up Mojito" }, { name: "Hawaï" },
        { name: "Perrier" }, { name: "Capri-Sun" }
      ]
    }
  ],

  /* Build your smash : prix indicatif (base + suppléments) */
  builder: {
    base: 2.50,          // bun + sauce
    patty: 4.00,         // par steak
    maxPatties: 4,
    cheese:   { cheddar: 0.50, raclette: 1.50, none: 0 },
    toppings: { bacon: 1.50, onion: 0, pickles: 0, salad: 0, tomato: 0.50 },
    labels: {
      cheddar: "cheddar", raclette: "raclette", none: "sans fromage",
      bacon: "bacon", onion: "oignons grillés", pickles: "pickles", salad: "salade", tomato: "tomate",
      smash: "sauce Smash", bbq: "sauce BBQ", algerienne: "sauce algérienne", samourai: "sauce samouraï"
    }
  }
};
