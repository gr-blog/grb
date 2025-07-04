export interface Params {
    root: {
        y: number
        height: number
    }
    intersection: {
        y: number
        height: number
    }
    element: {
        y: number
        height: number
    }
    scrolling_momentum: number
    computed_ratio: number
    heading_rank: number
}

export function sectionValue(params: Params) {
    const { root, intersection, element, computed_ratio, heading_rank, scrolling_momentum } = params
    // MATH FOLLOWS
    // we need to derive values that are normalized to the interval [0, 1]
    // then we just apply a function on them that determines their different
    // importance from our purpose.

    // I think important values are:
    // 1. How much of the element is visible?
    // 2. How much of the viewport does the element cover?
    // 3. What is the distance of the visible part to the center?
    //    or maybe a reference point a bit above the center.

    const intersection_vs_element = intersection.height / element.height
    const intersection_vs_root = intersection.height / element.height
    const root_center = root.y + root.height / 2
    const intersection_center = intersection.y + intersection.height / 2
    const reference_point = root.y + root.height / 2

    // We divide by root.height to get rid of the units
    const distance_centers_vs_reference_point =
        Math.abs(intersection_center - reference_point) / intersection.height

    return intersection_vs_element + intersection_vs_root * 2 - distance_centers_vs_reference_point
}
