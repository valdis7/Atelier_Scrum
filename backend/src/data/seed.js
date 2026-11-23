// T-03 : 4 voisins et 8 outils dans au moins 3 catégories, chargés au démarrage.
export const CATEGORIES = ['Perçage', 'Jardinage', 'Peinture', 'Nettoyage', 'Mesure', 'Autre'];

export function createSeed() {
  const users = [
    { id: 'u1', firstName: 'Camille', district: 'Antigone' },
    { id: 'u2', firstName: 'Hugo', district: 'Beaux-Arts' },
    { id: 'u3', firstName: 'Inès', district: 'Antigone' },
    { id: 'u4', firstName: 'Malik', district: 'Port Marianne' },
  ];

  const tools = [
    { id: 't1', ownerId: 'u1', name: 'Perceuse-visseuse', category: 'Perçage', description: 'Perceuse sans fil 18 V avec deux batteries.', status: 'available' },
    { id: 't2', ownerId: 'u1', name: 'Taille-haie', category: 'Jardinage', description: 'Taille-haie électrique, lame de 50 cm.', status: 'lent' },
    { id: 't3', ownerId: 'u2', name: 'Ponceuse orbitale', category: 'Peinture', description: 'Livrée avec 10 disques grain 120.', status: 'available' },
    { id: 't4', ownerId: 'u2', name: 'Nettoyeur haute pression', category: 'Nettoyage', description: '', status: 'available' },
    { id: 't5', ownerId: 'u3', name: 'Télémètre laser', category: 'Mesure', description: 'Portée 40 m.', status: 'unavailable' },
    { id: 't6', ownerId: 'u3', name: 'Tondeuse', category: 'Jardinage', description: 'Tondeuse thermique, bac de 50 L.', status: 'available' },
    { id: 't7', ownerId: 'u4', name: 'Perforateur', category: 'Perçage', description: 'Perforateur SDS+ pour béton.', status: 'available' },
    { id: 't8', ownerId: 'u4', name: 'Rouleau et bac à peinture', category: 'Peinture', description: 'Kit complet pour un mur.', status: 'available' },
  ];

  return { users, tools, loans: [] };
}
