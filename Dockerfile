FROM image.onecode.ict.cmcc:31104/oc/nginx:latest
RUN mkdir -p /data/dist
ADD ./dist /data/dist/