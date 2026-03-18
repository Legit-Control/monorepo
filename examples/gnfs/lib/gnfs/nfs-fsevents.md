# NFS event delegation:

NFS-3 does *not* produce filesystem events (FSEvents on the mac) when a file changes on the server. 
Changes happening on the server reach the client only via polling.

On the other hand - Changes produced by the client within the mounted folder do produce events. 

Applications like emacs that rely on file events for reloading instead of polling will not reload the content and never reflect
the server state once loaded - even if the clients file cache had been updated by other applications.

## Client side event simulation

When nfs-server is running on the same host as the client mounting the network folder it utilizing the filesystem access to the mounted folder as a side channel to simulate the events. 

TL;DR: We observe the files of interest using fs.watch on the `serving fs`- the fs attached to nfs-serve - and propagate the events by operating on the mounted folder. 

### Files of interest

The server should not propagate all file chnages to the client. A change in a file not seen by the client yet shouldn't produce events on the client. Why? 

- Some protocols don't provide a wildcard event recursive subscription.

Having a recurisve watch on braid for example would just not work - since the subscription requires a dicsovery of a resource first - a recurisve wildcard subscription would not be feasable

- events may lead to unintended materializations on the client.

Lets say the file `/mounted_folder/path/to/file.txt changes` on the server but the client has never
looked up `file.txt`. (No prior discovery via the finder or an open call to that file)
If we propagate the changes to the client the propagation to the folder would lead to a materialization. 


#### subscribe to files and folders of interest

To only watch the files / folders we are interested we can define "of interest" as files that the client has seen or opened.

Every file that was opened, its stats where asked of or had been looked up is a file that the client is (or was) interessted in. 

We can build a map of observers by hooking into the lookup, stats function open function and add the path to the list of subscribers. For those elements in the list we observe the corresponding paths.

##### unsubscribe files and folders

The list of observers will grow with the usage of the fs. For the current implementation this is a known issue and we gonna investigate the posibilities to cleanup or remove event handlers depending on the uscases 

### Side channel in detail

To "simulate" file events on the client we need to distinguish between `change` events and `rename` events.

### File change event.

Any modification in the `serving fs` produces a `change` event for the given node when watching on a file or the direct parent directory.

1. a `watch` on the `serving fs` for the file of interest (see lazy propagation) triggers a callback with a `change` event
2. store the changed path on the server in a `toPropagateChange`-set
3. use `fs.promises.utimes` to set the `mtime` on the file with a magic date (1970-1-1-00:00), this will trigger `setAttributes` call to the nfs server 
4. detect the magic date on set attribute - check if the file is in the `toPropagateChange`-set
5. don't forward the stats to the `serving fs` but return success including the current files attributes from `serving fs`
6. 🎉 client has the new stats on the client and triggers a change event on the mounted drive

### File removal/create/move simulation. 

A `removal`, `move` as well as a `creation` of files produce a `rename` event(s) in the `serving fs`.

Question: what events does the client need?
-> removal `rename` if the file was openend, stats where requested (e.g. by readdir)
-> creation `rename` if the parent folder was "opened" (readdir) 
-> rename `rename` same as remval and creation

1. a `watch` on the `serving fs` for the file of interest (see lazy propagation) triggers a callback with a `rename` event
2. the file was observerd directly (stats call) -> The client assumes the existance of the file 
   1. `rename` represents a deletion (?) -> double check this hypothesis
   2. store the renamed path in `toPropagateDeletion` set
   3. use `fs.promises.unlink` to remove trigger a `unlink` call to the nfs server 
   4. check the `toPropagateDeletion` set in the unlink and just return success and skip the unlink on the `serving fs`
3. the file was observed because of the parent dir (no `stats` call because the file did not exists) 
   1. `rename` represents a creation
   2. store the renamed path in `toPropagateCreation` set
   3. use `fs.open` to trigger trigger a `create` call to the nfs server 
   4. check the `toPropagateCreation` set in the nfs create function and just return success and skip the open call on the `serving fs`
4. 🎉 client has the parent folder index and the client and triggers the expected `rename` event on the mounted drive


## Next steps

1. produces events in gnfs to provide the interface to nfs-serve
2. an interface that produce change in the `memory-backed-state` (using braid http in the browser?)
3. implement the side channel logic in nfs-serve


## Limitiations

- recursive watchers like using fs.watch('path', {recursive}) will not work properly
- ...


