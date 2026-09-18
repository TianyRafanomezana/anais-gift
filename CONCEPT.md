# 🎵 Concept Cadeau : Le Vinyle d'Anaïs

## 🎯 Intention & Émotion
Offrir un moment intime, élégant et mémorable. Transformer un simple fichier audio en un véritable rituel d'écoute rétro-chic, directement accessible sur smartphone sans installation préalable (PWA).

---

## 🎨 Direction Artistique : "Rose Gold, Paillettes & Nuit Étoilée"

### 🌟 La Palette & Textures
* **Fond d'ambiance (Chill & Tamisé)** : 
  * Dégradé velours profond (prune / rose nuit très sombre : `#180917` ➔ `#2B0E23`).
  * Crée un contraste sublime où l'or et les paillettes ressortent comme de véritables bijoux lumineux, tout en offrant une ambiance feutrée et apaisante.
* **Or & Champagne (Accents Métalliques)** :
  * Dégradés or liquide (`#FFE6A3` ➔ `#D4AF37` ➔ `#B8860B`).
  * Finition dorure à chaud (*gold foil*) sur le logo Cœur, le bras de lecture et les bordures.
* **Rose Poudré & Rose Gold** :
  * Nuances satinées (`#F7CAD0`, `#E8A598`, `#DDA0B2`) pour la pochette et les halos de lueur.

### ✨ L'Effet Paillettes ("Sparkle Engine")
* Particules scintillantes à 4 branches (✨) et poussières d'or en lévitation douce en arrière-plan.
* Halo lumineux (*glow*) délicatement pulsé au rythme de la musique autour du vinyle.

---

## 🧭 Le Parcours Utilisateur (UX)

### 1. La Découverte (L'Écrin)
* **La Pochette** :
  * Texture cartonnée haut de gamme rose poudré avec le logo **Cœur en dorure brillante** au centre.
  * Titre discret et élégant en typographie raffinée.
* **Le Geste d'ouverture** :
  * À définir ensemble lors de la prochaine étape (gestuelle tactile fluide).

---

### 2. Le Rituel d'Ouverture (L'Interaction Clé)
* Sortie du vinyle hors de sa pochette.
* Légère gerbe d'étincelles dorées au moment de l'extraction.
* Déblocage naturel de l'autoplay sur mobile.
* Mise en rotation fluide (accélération douce vers 33 tours/min) et démarrage du son.

---

### 3. L'Expérience d'Écoute (Focus 100% Vinyle Collector)
* **Immersion totale** :
  * Disque noir laqué avec reflets de lumière dynamiques sur les microsillons.
  * **Macaron central** : finition or brossé / rose gold avec le logo **Cœur doré** en son centre.
  * Pluie lente de paillettes scintillantes dans la pénombre feutrée.
* **Contrôles du Lecteur** :
  * Commandes épurées et discrètes : Play / Pause, barre de progression fine couleur or champagne.
* **Media & Audio** :
  * Fichier audio personnel (déposé dans `assets/audio/`).
  * Support Media Session API (pochette et commandes sur l'écran verrouillé du smartphone).

---

### 4. La Fin de l'Écoute
* Ralentissement progressif du disque jusqu'à l'arrêt complet.
* Apparition douce d'un petit mot final ou bouton "Réécouter".

---

## 🛠️ Spécifications Techniques & Fichiers
- **Technologie** : React Native Web + Expo SDK 57 (PWA).
- **Audio** : Intégration audio optimisée (`expo-audio` / HTML5 Audio).
- **Assets** :
  * `assets/audio/` : votre fichier audio personnel.
  * `assets/images/` : logo Cœur (vectoriel / SVG / PNG).

