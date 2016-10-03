Ext.onReady(function () {


    var ALL_ID = 1;

    var data = {
        text: 'SELECT ALL (id' + ALL_ID + ')',
        expanded: true,
        checked: false,
        id: ALL_ID,
        children: [
            { text: "id2 homework ", checked: false, expanded: true,
                id: 2,
                children: [
                    {       id: 3, checked: false, text: "id3 book report ", leaf: true },
                    {       id: 4, checked: false, text: "id4 algebra ", leaf: true}

                ] },
            {        id: 5, checked: false, text: "id5 food ", expanded: true, children: [
                {        id: 6, checked: false, text: "id6 meat ", leaf: true },
                {        id: 7, checked: false, text: "id7 drinks ", children: [
                    {        id: 11, checked: false, text: "id11 soda ", leaf: true },
                    {        id: 12, checked: false, text: "id12 milk ", leaf: true }
                ]}
            ] },
            {        id: 8, checked: false, text: "id8 plans ", expanded: true, children: [
                {        id: 9, checked: false, text: "id9 vacation ", leaf: true },
                {        id: 10, checked: false, text: "id10 rule the world ", leaf: true}
            ] }
        ]
    };


    var store = Ext.create('Ext.data.TreeStore', {
        fields: ['text' , 'id'],
        root: data

    });

    Ext.create('Ext.ux.grid.TriStateTree', {
        store: store,
        ALL_ID: ALL_ID,
        width: 600,
        height: 300,
        tbar: [

            '<a href="http://wap7.ru/folio/ext-tri-state-tree/"  target="_top">Doc</a>'
            ,
            {   xtype: 'button',
                text: 'Check Root',
                handler: function () {
                    this.up('panel').setSelections([ALL_ID])
                }
            },
            {   xtype: 'button',
                text: 'Uncheck Root',
                handler: function () {
                    this.up('panel').uncheckRoot();
                }
            },
            {   xtype: 'button',
                text: 'Check 3,4,7,10',
                handler: function () {
                    this.up('panel').setSelections([ 3, 4, 7, 10])
                }
            },
            {   xtype: 'button',
                text: 'Get: Id only, Leafs only',
                handler: function () {
                    Ext.MessageBox.show({
                        title: 'Selected Nodes Id only, Leafs only',
                        msg: JSON.stringify(this.up('panel').getSelections(true, true), null, 4),
                        icon: Ext.MessageBox.INFO
                    });
                }
            },
            { xtype: 'button',
                text: 'Get: as objects, with branches',
                handler: function () {

                    Ext.MessageBox.show({
                        title: 'Selected Nodes with branches',
                        msg: JSON.stringify(this.up('panel').getSelections(), null, 4),
                        icon: Ext.MessageBox.INFO
                    });
                }}
        ],
        renderTo: 'grid-example'
    });
});