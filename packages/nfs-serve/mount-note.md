# Mount NFS with options:
# - nolocks: disable locking
# - soft: fail quickly on errors
# - retrans=2: 2 retries
# - timeo=10: timeout = 1s
# - vers=3: NFSv3
# - tcp: use TCP
# - rsize=131072: large read size
# - actimeo=120: cache attributes for 120 seconds
# - port/mountport: manual ports
mount_nfs -o nolocks,soft,retrans=2,timeo=10,vers=3,tcp,rsize=131072,actimeo=120,port=2049,mountport=2049  localhost:/ /Users/martinlysk/nfs-mount


umount /Users/martinlysk/nfs-mount