import ImageLayout from "./image-layout"
export interface FiguredImageProps {
    title: string
    figureUrl: string
    site: string
}
export function FiguredImage({ title, figureUrl, site }: FiguredImageProps) {
    return (
        <ImageLayout>
            <img
                src={figureUrl}
                alt={title}
                width={500}
                height={500}
                style={{
                    width: "70%",
                    alignSelf: "center",
                    justifySelf: "center"
                }}
            />
        </ImageLayout>
    )
}
