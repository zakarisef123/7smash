# 7Smash — site vitrine

Site one-page statique (HTML/CSS/JS, aucune dépendance, aucun build).
Ouvrir `index.html` ou déployer le dossier tel quel (Netlify, Vercel, GitHub Pages, OVH…).

## Modifier le contenu
Tout le contenu métier est dans **`assets/js/data.js`** :
- `hours` : horaires (badge « Ouvert / Fermé » calculé à l'heure de Paris)
- `menu` : catégories, produits, descriptions, prix, prix menu, badges
- `builder` : prix du configurateur « Build your smash »

Couleurs et typos : variables en haut de `assets/css/style.css` (`:root`).

## Commande en ligne (Click & Collect)
Panier sur le site : produits seuls ou en menu (choix de la boisson), burger du configurateur,
choix sur place / à emporter, créneau de retrait (calculé selon les horaires), prénom, téléphone, précisions.
Paiement sur place. Pas de serveur nécessaire.
- **Renseigner `order.whatsapp` dans `assets/js/data.js`** (ex. `"33612345678"`) : la commande
  est alors envoyée au restaurant sur WhatsApp. Sans numéro, le client obtient un récap à montrer au comptoir.
- `minDelay`, `slotStep`, `lastOrderBeforeClose` : délai de préparation et créneaux.
- Paiement en ligne (Stripe / SumUp) possible plus tard : nécessite un compte marchand du restaurant.

## DA
Tirée du logo et du restaurant : fond noir (murs, banquettes cuir), cheddar orangé
qui coule (logo = louche de cheddar versée sur le burger), vert-jaune de l'enseigne
néon « Crispy · Cheesy · Smash ». Couleurs dans `:root` de `assets/css/style.css`.

## Photos
`assets/img/` : `logo.png`, `photo-burger.jpg`, `photo-spot.jpg`.
Pour ajouter une photo à un produit : champ `photo: "assets/img/xxx.jpg"` dans `data.js`.

## À valider avec le client
- Horaires exacts (actuellement 18h00–23h30 tous les jours)
- Prix : repris de la carte Uber Eats (les prix sur place peuvent être plus bas)
- Photos HD des produits et du logo (les fichiers actuels sont des captures basse résolution)
