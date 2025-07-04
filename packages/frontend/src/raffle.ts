export function isRaffleHit(odds: number = 2) {
    return Math.random() <= 1 / odds
}
