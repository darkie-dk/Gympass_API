export class FarFromGymError extends Error {
  constructor() {
    super('You are too far from gym to check in.')
  }
}
