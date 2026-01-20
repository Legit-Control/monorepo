# Stop liting .legit folder

claude crawels the whole project once at the begining - since legit exposes every version in time by exposing branches and commit folder - the indexing time increase with every commit.
Seems like this is not possible to configure via permissions:

we should hide the .legit folder from the root dir

# allow to resume a session

currently we only store the lines into the commit history.
To allow recreating the content we should build up the jsonl file

# check behavior of package mangagers

package manger like pnpm do fs level optimization like linking to save space.
This needs to be checked.