# How to present an empyt folder in git

Git doesnt allow empty folders - so we need to create a placeholder file to keep the folder alive.

## Make dir

folderA/
└── myfile.txt

mkdir('folderA/folderB')

folderA/
└── myfile.txt
└── folderB/ <- empty folder, would be deleted by git

We use a `.keep` file for that - when creating a folder we create a `.keep` file inside it.

When deleting a folder we delete the `.keep` file inside it.

Some problematic cases with that:

## Deletion of folder

folderA/
└── folderB/
└── .keep

delete('rfolderA/folderB')

folderA/ <- empty folder, leadd to deletion of folderA as well

## Removal of last file in folder

folderA/
└── folderB/
└── myfile.txt

Two szenarios exists: deletion and move

delete('folderA/folderB/myfile.txt')

folderA/ <- empty folder, leadd to deletion of folderA as well
└── folderB/ <- empty folder, leadd to deletion of folderB as well

move('folderA/folderB/myfile.txt', 'folderA/myfile.txt')

folderA/ <- empty folder, leadd to deletion of folderA as well
└── folderB/ <- empty folder, leadd to deletion of folderB as well
└── myfile.txt

The simplest solution for this would be to create .keep file in every folder and deletion of a folder would mean empty the directory.

folderA/
└── .keep
└── folderB/
└── .keep

This would solve the deletion issue - but this won't work with existing repos not fulfilling this precondition.

Instead we need to implement a simple rule based execution:

rm -> check if the parent folder is empty -> if so create .keep file
mv -> check if source folder is empty -> if so create .keep file
writeFile -> check if target folder contains a .keep file -> delete it
