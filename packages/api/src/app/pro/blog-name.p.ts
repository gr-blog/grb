import { Provider, Scope } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"

export const BLOG_NAME = "BLOG_NAME"

export const BlogNameProvider: Provider = {
    provide: BLOG_NAME,
    scope: Scope.REQUEST,
    inject: [REQUEST],
    useFactory: (req: any) => req.params.blog as string
}
