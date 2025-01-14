export class LateCheckInError extends Error {
  constructor() {
    super('You are late to validate this check-in.')
  }
}
