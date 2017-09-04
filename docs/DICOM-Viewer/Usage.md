
Dicom Viewer allows loading, viewing, comparing, exporting and editing **_dicom files._**
Any non-DICOM format files are not supported and the application will not show any information. 

## **Loading files**

Files can be loaded either by _dragging and dropping_ file into the application

![95232-200.png](../.attachments/95232-200-3cc6bf1b-3916-4002-b38d-5bd50bf2d16c.png)

or by clicking LOAD A FILE button and choosing files, if no files have been loaded.

![load file.png](../.attachments/load-file-de98ee86-8ac4-4249-a33b-1546aa02edf0.png)

Multiple files can be loaded at once.

Loaded files are listed in the [LOADED](./Usage/Components/Loaded.md) tab.

## **Viewing images**
Image viewer provides a visualization of the currently opened loaded file’s image. Image viewer tab supports single-frame and multi-frame images. 
To show the image click on [IMAGE VIEWER](./Usage/Components/Image-viewer.md) tab.

![image.png](../.attachments/image-753d1cf0-53f7-4802-b41f-3a98c316ee8e.png)

## **Viewing tags**
Tags of the currently selected loaded file can be displayed by clicking on the [TAGS](./Usage/Components/Tags.md) tab.
The tags are displayed in table where each row represents one tag.
The application provides two different views: simple and hierarchical.
In the simple view, all tags are listed and ordered by the tag group and tag element.
In the hierarchical view, the modules according to the file’s modality are displayed, and tags are grouped to these. 
![image.png](../.attachments/image-888f3e90-6d2a-4828-a8d3-6449f4b796d2.png)

## **Searching in tags**
There is a simple search in the [TAGS](./Usage/Components/Tags.md) tab, which allows to search, or filter, tags in accordance to the tag's group, element, name and value.

## **Editing files**
Dicom viewer supports editing files. Tags in the file can be edited, removed or added. All these functions are available directly in the [TAGS](./Usage/Components/Tags) tab. (For more information click [here](./Usage/Components/Tags.md).)

## **Other features**
The bottom menu in the [LOADED](./Usage/Components/Loaded.md) tab, as well as the left application menu, provides more functions of Dicom Viewer, such as comparing two dicom files, storing files in the application, exporting files. These are described in [File actions](./Usage/File-actions.md)

![image.png](../.attachments/image-9767f4b6-2170-43cf-ba3d-e64ac54b11ca.png)