export function innerUrl(args: TemplateStringsArray, ...values: string[]): string {
    const url = args.reduce((acc, str, i) => acc + str + (values[i] || ""), "")
    return `http://localhost:3001${url}`
}
