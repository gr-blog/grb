import { ShikiTransformer } from "shiki"

export function shikiTransformerList(...transformers: ShikiTransformer[]) {
    return transformers
}
