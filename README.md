===========
The Ext.ux.grid.TriStateTree
Features:

Extends Ext.tree.Panel
If a parent node is checked / unchecked, all its child nodes are automatically checked / unchecked too.
If only some children of a node are selected, its checkbox remains checked, but with a third visual state, using a darkened background.
* A single file (checkboxes.gif) defines all the three images.
getSelections method returns list of checked data as objects for simple backend serialization as [{id: 123}, {id: 345} ...]
* If called with parameter id_only (bool) - it returns list of checked data as [123, 345]
* If ALL_ID value found, only ALL_ID returned. as [{id: 1}]
* By default only leaf nodes id`s returned. You can configure it via 'returnLeafsOnly' property.
setSelections method consumes list of IDS [123,456,789] or objects [{id: 123}, {id: 345}]
* Pass ALL_ID value in input list to check all.
