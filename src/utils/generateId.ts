export function generateId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)]
  const randomNumbers = String(Math.floor(Math.random() * 9000) + 1000)
  return randomLetters + randomNumbers
}