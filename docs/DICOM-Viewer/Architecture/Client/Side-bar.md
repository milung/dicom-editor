Each tab is separated by Tab element.
Side bar consists of Loaded files and Saved files tab

Loaded files tab contains multiple ElementOfSelectableList , which each represents one file that can be checked.
Loaded files, selected files and compare mode are all stored in IndexDB, which provides persistence and offline functionality. 


Saved files tab is represented as ElementOfDeletableList, because each file can be deleted by pressing a button and files are added through Save current file button.

One popup dialog is called upon deletion from saved tab or overwrite action in the saved tab.


