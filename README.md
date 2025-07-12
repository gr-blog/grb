# GRB

The platform backing my blogs:
- [gregros.dev](https://gregros.dev)
- [gregros.xyz](https://gregros.xyz)

Currently the design looks like this:

```mermaid
graph TD
	Ext@{shape: circle, label: " "}
	Frontend["Frontend<br/><sub><i>Next.js</i></sub>"]

	style Ext fill:none,stroke:none
	style Frontend stroke:4,strokeWidth:5
	Ext == "Ingress" ==> Frontend
	subgraph External["External"]
		Discord{{"Discord<br/><i>API</i>"}}
		GH{{"Github<br/><i>API</i>"}}
	end

	style External stroke:#666,stroke-dasharray:6 3,fill:#fff
    Platform["Platform<br/><sub><i>NestJS</i></sub>"]
    Bot["Bot<br/><sub><i>NestJS</i></sub>"]
	
    Frontend -- "gets processed content" --> Platform
    Bot -- "checks published posts" --> Platform
    Bot -.->|"Push announcements"| Discord
    Platform -.->|"Polls for HEAD change"| GH
    Platform -.->|"Read raw markdown"| GH
    
```

GRB is deployed on a k8s cluster, with a single HTTPRoute resource that provides ingress for the Frontend component. 
# Frontend
The Next.js service that builds the UI. This is the only service that’s accessible from outside. 
# Bot
A Discord announcer that regularly polls Platform for new posts to announce.
# Platform
Central component that:

1. Abstracts the data source (can take from github or local)
2. Caches content.
3. Regularly polls data source for changes to update the cache.
4. Processes markdown:
	1. Extracts headings
	2. Extracts excerpts
	3. Processes frontmatter
	4. Renders math