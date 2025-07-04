import { Module } from "@nestjs/common"
import { RouterModule } from "@nestjs/core"
import { BlogsModule } from "./blogs.m.js"
@Module({
    imports: [
        BlogsModule,
        RouterModule.register([
            {
                path: ":blog",
                module: BlogsModule
            }
        ])
    ]
})
export class AppModule {}
