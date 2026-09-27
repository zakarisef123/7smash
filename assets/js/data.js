/* =========================================================
   7SMASH — CONTENU ÉDITABLE
   Tout le contenu "métier" du site est ici : carte, prix, horaires.
   Modifier ce fichier suffit, pas besoin de toucher au HTML.
   ⚠️ Prix et horaires à valider avec le client.
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

  /* Carte. tag : badge optionnel ("Best-seller", "New", "Spicy"…) */
  menu: [
    {
      id: "burgers",
      label: "Smash Burgers",
      emoji: "🍔",
      items: [
        { name: "Smash Cheese",      desc: "1 steak smashé, cheddar, oignons, pickles, sauce 7Smash.",                        price: 7.00,  menu: 10.50, tag: "Classic" },
        { name: "Double Smash",      desc: "2 steaks smashés, double cheddar coulant, oignons, pickles, sauce 7Smash.",       price: 10.50, menu: 14.00, tag: "Best-seller" },
        { name: "Triple Smash",      desc: "3 steaks, 3 cheddars. Pour les vrais. Pas pour les faibles.",                       price: 13.50, menu: 17.00, tag: "Monster" },
        { name: "Smash Bacon BBQ",   desc: "2 steaks, cheddar, bacon de bœuf croustillant, oignons frits, sauce BBQ fumée.",   price: 12.00, menu: 15.50 },
        { name: "Smash Raclette",    desc: "2 steaks, raclette fondue, oignons caramélisés, sauce maison. Savoyard ET US.",     price: 12.50, menu: 16.00, tag: "Local hero" },
        { name: "Smash Chicken",     desc: "Poulet croustillant, cheddar, salade, sauce 7Smash.",                               price: 9.50,  menu: 13.00 },
        { name: "Mini Smash (kids)", desc: "Le smash en format mini pour les petits. Frites + Capri-Sun en menu.",              price: 5.50,  menu: 8.00 }
      ]
    },
    {
      id: "crousty",
      label: "Crousty",
      emoji: "🍗",
      items: [
        { name: "Crousty Classic",   desc: "Poulet croustillant, riz, sauce au choix. Le crousty le moins cher d'Annemasse.",  price: 6.50,  menu: 8.00, tag: "Prix choc" },
        { name: "Crousty Cheese",    desc: "Le Classic + sauce cheddar coulante.",                                              price: 7.50,  menu: 9.00 },
        { name: "Crousty Spicy",     desc: "Poulet croustillant, sauce samouraï, jalapeños.",                                   price: 7.50,  menu: 9.00, tag: "Spicy" }
      ]
    },
    {
      id: "tacos",
      label: "Tacos",
      emoji: "🌯",
      items: [
        { name: "Tacos M",           desc: "1 viande au choix, frites, sauce fromagère maison.",                                price: 8.00,  menu: 10.00 },
        { name: "Tacos L",           desc: "2 viandes au choix, frites, sauce fromagère maison.",                               price: 10.00, menu: 12.00, tag: "Best-seller" },
        { name: "Tacos XL",          desc: "3 viandes. Pour partager (ou pas).",                                                price: 13.00, menu: 15.00 }
      ]
    },
    {
      id: "sides",
      label: "Sides",
      emoji: "🍟",
      items: [
        { name: "Frites maison",     desc: "Bien dorées, bien assaisonnées.",                                                   price: 3.00 },
        { name: "Cheese fries",      desc: "Frites + sauce cheddar + oignons frits.",                                           price: 5.00, tag: "Must" },
        { name: "Tenders x4",        desc: "Filets de poulet panés, sauce au choix.",                                           price: 5.50 },
        { name: "Nuggets x6",        desc: "Croustillants dehors, fondants dedans.",                                            price: 4.50 }
      ]
    },
    {
      id: "drinks",
      label: "Drinks & Sweet",
      emoji: "🥤",
      items: [
        { name: "Soda 33cl",         desc: "Coca-Cola, Fanta, Oasis, Ice Tea…",                                                 price: 2.00 },
        { name: "Milkshake",         desc: "Vanille, chocolat, fraise ou Oreo.",                                                price: 4.50, tag: "New" },
        { name: "Cookie géant",      desc: "Chocolat, servi tiède.",                                                            price: 3.00 }
      ]
    }
  ],

  /* Build your smash : prix de base + suppléments */
  builder: {
    base: 4.00,          // bun + sauce
    patty: 3.00,         // par steak
    maxPatties: 4,
    cheese:   { cheddar: 0.50, raclette: 1.50, none: 0 },
    toppings: { bacon: 1.50, onion: 0, pickles: 0, salad: 0, tomato: 0.50 },
    labels: {
      cheddar: "cheddar", raclette: "raclette", none: "sans fromage",
      bacon: "bacon de bœuf", onion: "oignons", pickles: "pickles", salad: "salade", tomato: "tomate",
      smash: "sauce 7Smash", bbq: "sauce BBQ", algerienne: "sauce algérienne", samourai: "sauce samouraï"
    }
  }
};
