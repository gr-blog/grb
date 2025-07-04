import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager"
import { MiddlewareConsumer, Module, Scope } from "@nestjs/common"
import { APP_INTERCEPTOR, APP_PIPE, REQUEST } from "@nestjs/core"
import { createCache } from "cache-manager"
import type { Request } from "express"
import { ZodValidationPipe } from "nestjs-zod"
import { AccessLogMiddleware } from "../../logging/access-logs.js"
import { ImageController } from "../ctrl/image.c.js"
import { MetadataController } from "../ctrl/meta.c.js"
import { NewsletterController } from "../ctrl/newsletter.js"
import { PostsController } from "../ctrl/post.c.js"
import { SeriesController } from "../ctrl/series.c.js"
import { BLOG_ID } from "../dec/blog.js"
import { CustomCacheInterceptor } from "../dec/cache-interceptor-full.js"
import { DATA_SOURCE, DataSource, DataSourceProvider } from "../dec/disk.js"
import { createOctokit, OCTOKIT } from "../dec/octokit.js"
import { PrefixedCache } from "../dec/prefixed-cache.js"
import { DATA_SERVICE } from "../svc/data.js"
import { DiskService } from "../svc/disk.s.js"
import { GithubPollerService } from "../svc/github-poller.s.js"
import { GithubService } from "../svc/github.s.js"
import { ImageService } from "../svc/image.s.js"
import { MyLoggerService } from "../svc/logger.s.js"
import { MailerApiService } from "../svc/mailer.s.js"
import { MdxCompilerService } from "../svc/mdx.s.js"
import { MetadataService } from "../svc/meta.s.js"
import { PostFileService } from "../svc/post-file.s.js"
import { PostService } from "../svc/post.s.js"
import { SeriesFileService } from "../svc/series-file.s.js"
import { SeriesService } from "../svc/series.s.js"

@Module({
    controllers: [
        PostsController,
        SeriesController,
        ImageController,
        MetadataController,
        NewsletterController
    ],
    providers: [
        MailerApiService,
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe
        },
        {
            provide: OCTOKIT,
            useFactory: () => createOctokit()
        },
        {
            provide: BLOG_ID,
            scope: Scope.REQUEST,
            inject: [REQUEST],
            useFactory: (req: Request) => req.params.blog
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CustomCacheInterceptor
        },
        GithubPollerService,
        DiskService,
        PrefixedCache,
        MyLoggerService,
        PostFileService,
        SeriesFileService,
        SeriesService,
        GithubService,
        PostService,
        MdxCompilerService,
        ImageService,
        MetadataService,
        {
            provide: CACHE_MANAGER,
            useFactory: () => {
                if (process.env.NO_CACHE !== "true") {
                    return createCache()
                }

                // Minimal no-op implementation
                const noop = async () => undefined
                return {
                    get: noop,
                    set: noop,
                    del: noop,
                    reset: noop,
                    store: "none"
                } as unknown as Cache
            }
        },
        DataSourceProvider,
        {
            provide: DATA_SERVICE,
            useFactory: (
                diskService: DiskService,
                githubService: GithubService,
                dataSource: DataSource
            ) => {
                switch (dataSource.type) {
                    case "github":
                        return githubService
                    case "local":
                        return diskService
                }
            },
            inject: [DiskService, GithubService, DATA_SOURCE]
        }
    ]
})
export class BlogsModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AccessLogMiddleware).forRoutes("*")
    }
}
