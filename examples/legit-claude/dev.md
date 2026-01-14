# debug

run with debugger in main process

```
lsof -ti tcp:9229 | xargs -r kill -9 && NODE_OPTIONS="--inspect-brk" legit-claude
```


## run only nfs worker

```
lsof -ti tcp:9229 | xargs -r kill -9 && node --inspect-brk nfs-server-worker.js /Users/martinlysk/legit/sample-repos/temp/Sync 3333
```