function calculateScore(pet, user) {
  let score = 0;

  // Lifestyle match
  if (pet.energy === user.energy) score += 25;
  if (pet.space === user.space) score += 20;
  if (pet.experience === user.experience) score += 20;

  // Kids compatibility
  if (user.hasKids && pet.goodWithKids) score += 15;
  if (!user.hasKids) score += 10;

  // Vaccination preference
  if (user.requiresVaccinated && pet.vaccinated) score += 10;

  // Type preference
  if (user.preferredType && pet.type === user.preferredType) {
    score += 10;
  }

  return score;
}

module.exports = calculateScore;