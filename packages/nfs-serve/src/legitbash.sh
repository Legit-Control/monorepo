PROMPT='%~ %# '

cd ~/legit-box_real
sudo rm -rf ~/legit-box_real/*
sudo rm -rf ~/legit-box_real/.git



- step 1

: # create a repo on legitet-box_real

git init --initial-branch=main
echo "# My project" > README.md
git add README.md
git commit -m "Initial commit"


- step 2 

: # change director into the mounted legit folder
cd ~/legit-box 

: # show files in legit folder - including the .legit folder
ls -1Fa 

- step 3

:# show the conent of the .legit folder 
ls .legit -1Fa 

- step 3

: # change into the main branch directory
cd .legit/branches/main
: # write a new file containing "hello scott"
echo "hello scott" > any_file_type.md

- step 4

: # change the content
echo "hello scott - we share a passion" > any_file_type.md

- step 5

: # show git diff using the real repo folder
git -C ~/legit-box_real diff HEAD^!

- step 8

: # run git log in folder served by legit 
git -C ~/legit-box_real log

- step 7

: # show git log equivalent in legit 
echo ~/legit-box/.legit/branches/main/history

- step 8

: # create a branch by creating a folder
mkdir ~/legit-box/.legit/branches/my-agents-sandbox 

- step 9

: # show new branch
git -C ~/legit-box_real branch
