We're going to migrate my monorepo from a self-hosted gitlab to a public github.

# Image mapping

Here is how we map the names of images. 

## Image

Image path is the same for all images:

```
registry.host/grb/grb→ ghcr.io/gr-blog/
```

Image name is determined by tag:

### TAG

```
:SERVICE -> grb-SERVICE

:k8s-service -> grb-k8s-service
```

The main tags will be :latest.

## Double tagging

When an image is produced, it's tagged with:

```
:latest
:SHORT-SHA
```













fi