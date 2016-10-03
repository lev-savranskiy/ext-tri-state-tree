/**
 * @class Ext.ux.grid.TriStateTree
 * @extends   Ext.tree.Panel
 * @requires Ext.selection.TreeModel
 * @version 0.4
 * @author Lev Savranskiy
 * @link http://wap7.ru/folio/ext-tri-state-tree
 * @contact  levsavranskiy at gmail.com
 */


Ext.define('Ext.ux.grid.TriStateTree', {
    extend: 'Ext.tree.Panel',
    rootVisible: true,
    useArrows: true,
    frame: false,
    header: false,
    style: 'margin: 0px 5px',
    disabledCls: 'x-tree-checkbox-checked-disabled',
    ALL_ID: 1,
    //deprecated
    returnLeafsOnly: false,

    width: 350,
    height: 200,
    selModel: new Ext.selection.TreeModel({
        mode: 'MULTI',
        ignoreRightMouseSelection: true
    }),

    listeners: {
        checkchange: function (node, check) {

            var me = this;

            if(me.isThirdState(node)){

                //skip for now
            }else{
                me.applyCheck(node);
            }

        }
    },

    applyCheck: function(node){
        var me = this;
        if (node.hasChildNodes()) {
            node.eachChild(this.setChildrenCheckedStatus);
        }
        if (node.get('id') == this.ALL_ID) {
            console.log('[root checked]');

            //unsetThirdState for all
            me.clearThirdState()
        }else{

            node.set('cls', '');
            me.updateCheckedStatus(node);

        }

    },

    // Propagate change downwards (for all children of current node).
    setChildrenCheckedStatus: function (current) {
        //console.log('[setChildrenCheckedStatus]');
        //console.log( 'current.data' , current.data);
        if (current.data.visible !== false) {
            // if not root checked
            if (current.parentNode) {
                var parent = current.parentNode;
                current.set('checked', parent.get('checked'));
            }


            if (current.hasChildNodes()) {
                current.eachChild(arguments.callee);
            }
        }

    },

    // Propagate change upwards (if all siblings are the same, update parent).
    updateCheckedStatus: function (current) {
        var me = this,
            currentChecked = me.isChecked(current);


       //console.log('currentChecked' , currentChecked)

        var childrenWithState = 0;
        var childrenChecked = 0;

        console.log(current.get('text'), currentChecked);
        current.eachChild(function (n) {
            if(me.isChecked(n)){
                childrenChecked++;
            }
            if(me.isThirdState(n)){
                childrenWithState++;
            }

        });

        me.unsetThirdState(current);

        if (!currentChecked && (childrenChecked > 0 || childrenWithState > 0)){
            me.setThirdState(current);
        }


//        console.log('childrenWithState '  + childrenWithState);
//        console.log('childrenChecked '  + childrenChecked);
//        console.log('--------');



        if (current.parentNode) {

            var parent = current.parentNode;

            var siblingsWithState = 0;
            var siblingsChecked = 0;


            parent.eachChild(function (n) {
                if(me.isChecked(n)){
                    siblingsChecked++;
                }
                if(me.isThirdState(n)){
                    siblingsWithState++;
                }
            });

            me.unsetThirdState(parent);
            parent.set('checked' , false);

            if(siblingsChecked == parent.childNodes.length){
                parent.set('checked' , true);
            }else if (childrenChecked > 0 || childrenWithState > 0){
                me.setThirdState(parent);
            }


//            console.log(parent.get('text'))
//            console.log('siblingsWithState '  + siblingsWithState)
//            console.log('siblingsChecked '  + siblingsChecked)
//            console.log('--------')
            me.updateCheckedStatus(parent);

        }



    },


    isChecked: function (node) {
        return  node.get('checked')===true;

    },

    uncheckRoot: function(){
        var me = this;
        me.getRootNode().set('checked' , false);
        me.applyCheck(me.getRootNode());
    },



    clearThirdState: function(){
        var me = this;
        me.getRootNode().cascadeBy(function(){
            if (me.isThirdState(this)) {
                me.unsetThirdState(this);
            }
        });
    },

    isThirdState: function (node) {
        return  node.get('cls') == this.disabledCls;

    },

    setThirdState: function (node) {
        node.set('cls', this.disabledCls);
        node.set('checked', false);
       // console.log( 'setThirdState ' +  node.get('text'));
    },

    unsetThirdState: function (node) {
        node.set('cls', '');
    },

    getSelections: function (id_only, leafs_only) {
        var me = this;

        //console.log('[accessPanel getSelections]');

        if(leafs_only == undefined){
            leafs_only = me.returnLeafsOnly;
        }


        try {
            var grid_selections = me.getView().getChecked(),
                allFound = false,
                result = [];


            Ext.Array.each(grid_selections, function (rec) {

                var pushdata = false;

                //  find all checked items
                if (rec.get('id') ) {

                    if (!!leafs_only ){
                        if (rec.get('leaf') === true){
                            pushdata = true;
                        }
                    }   else{
                        pushdata = true;
                    }
                    if (pushdata){
                        result.push(id_only == true ?  rec.get('id') : {id: rec.get('id')});
                    }

                }

                //  if NODE 'ALL' checked  - no children required
                if (rec.get('id') == me.ALL_ID) {
                    allFound = true;
                }
            });


            if (allFound) {
                result = id_only ? [  me.ALL_ID ] : [ {id: me.ALL_ID} ];
            }

            //console.log(result);
            return result;
        } catch (e) {

            console.log('[error in accessPanel getSelections]');
            console.log(e);
        }
    },

    setSelections: function (ids) {

        var me = this;
        //  me.stopListener = true;


        me.clearThirdState();

//        console.log('[accessPanel setSelections]');
//         console.log(ids);


        if (ids[0] && ids[0]['id']){
            ids = Ext.Array.pluck(ids, 'id');
        }

        // check RootNode or do cascade checking

        if (ids.indexOf(me.ALL_ID) > -1) {

            console.log('[ALL_ID found]');
            me.getRootNode().set('checked', true);
            me.applyCheck(me.getRootNode());
        } else {

            console.log('[ALL_ID not found]');

            me.getRootNode().cascadeBy(function () {

                var currNode = this;
                var checked = ids.indexOf(currNode.get('id')) > -1;

                if(checked){
                    me.unsetThirdState(currNode);
                    currNode.set('checked',  checked);

                    console.log(currNode.get('text') , checked)

                    if (currNode.hasChildNodes()) {

                        currNode.eachChild(function(n) {
                            //if(currNode.get('id')== 7){
                            n.set('checked', checked);
                            console.log(n.get('text'))
                            //}

                        });
                    }

                    me.updateCheckedStatus(currNode);


                }





            });
        }


    }

});