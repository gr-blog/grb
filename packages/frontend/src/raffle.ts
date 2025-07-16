export function isRaffleHit(odds: number = 3) {
    return Math.random() <= 1 / odds
}
