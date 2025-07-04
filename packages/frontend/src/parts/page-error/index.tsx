import "./page-error.scss"
export interface PageErrorProps {
    message: string
    status: number
}
export default function PageError(props: PageErrorProps) {
    return (
        <div className={`error-page error-page__${props.status}`}>
            <h1>Error {props.status}</h1>
            <p>{props.message}</p>
        </div>
    )
}
