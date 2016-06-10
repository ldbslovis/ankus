/*
 * Copyright (C) 2011  Flamingo Project (http://www.opencloudengine.org).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Ankus : Content based Similarity
 *
 * @cli hadoop jar ankus-core.jar ContentBasedSimilarity -input <IN> -output <OUT> -keyIndex 0 -indexList 1,2,3,4 -algorithmOption jaccard -delimiter '::' -subDelimiter '|'
 * @extends Flamingo.view.designer.property._NODE_ALG
 * @author <a href="mailto:fharenheit@gmail.com">Byoung Gon, Kim</a>
 * @author <a href="mailto:myeongha.kim@cloudine.co.kr">Myeong Ha, Kim</a>
 * @see <a href="http://www.openankus.org/display/DOC/Flamingo+Hadoop+Manager+Integration">Ankus Algorithm</a>
 */
Ext.ns('Flamingo.view.designer.property.ankus');
Ext.define('Flamingo.view.designer.property.ankus.ALG_ANKUS_CONTENT_SIM', {
    extend: 'Flamingo.view.designer.property._NODE_ALG',
    alias: 'widget.ALG_ANKUS_CONTENT_SIM',

    requires: [
        'Flamingo.view.designer.property._ConfigurationBrowserField',
        'Flamingo.view.designer.property._BrowserField',
        'Flamingo.view.designer.property._ColumnGrid',
        'Flamingo.view.designer.property._DependencyGrid',
        'Flamingo.view.designer.property._NameValueGrid',
        'Flamingo.view.designer.property._KeyValueGrid',
        'Flamingo.view.designer.property._EnvironmentGrid',
        'Flamingo.model.designer.Preview'
    ],

    //overflowY: 'scroll',
    width: 520,
    height: 580,
    autoScroll : true,

    items: [
        {
            title: MSG.DESIGNER_TITLE_PARAMETER,
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 180
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                // Ankus MapReduce가 동작하는데 필요한 입력 경로를 지정한다.  이 경로는 N개 지정가능하다.
                //layout 변경 start
                 {
                  xtype: 'fieldset',
                  height: 190,
                  title: 'File Path',
                  layout: 'anchor',
                  defaults: {
                      anchor: '100%',
                      labelWidth: 200,
                      hideEmptyLabel: false
                  }, 
                  items:[                
			                {
			                    xtype: '_inputGrid',
			                    title: MSG.DESIGNER_TITLE_INPUT_PATH,
			                    height: 115
			                },
	                        {
			            	    forceFit: true,
			            	    columnLines: true,                	    
			            	    title: MSG.DESIGNER_TITLE_OUTPUT_PATH,            	    
			            	    defaults: {
			                        hideLabel: true,                              
			                    //    margin: "2 0 0 0"  // Same as CSS ordering (top, right, bottom, left)
			                    },
			                    layout: 'hbox',
			                    items: [
			                        {
			                            xtype: '_browserField',
			                            name: 'output',
			                            allowBlank: false,
			                            readOnly: false,
			                            flex: 1
			                        }
			                    ]
	                        }
			                ]
                 },
                 {
                     xtype: 'fieldset',
                     height: 470,
                     title: 'Parameter Option',
                     layout: 'anchor',
                     defaults: {
                         anchor: '100%',
                         labelWidth: 200,
                         hideEmptyLabel: false
                   }, 
                  items:[          
                /*
                  {
                      xtype: 'tbspacer',
                      height: 10
                  } ,
                 */ 
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: MSG.DESIGNER_COL_DELIMITER,
                    tooltip: MSG.DESIGNER_MSG_COL_DELIMITER,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'delimiter',
                                    value: '::',
                                    flex: 1,
                                    forceSelection: true,
                                    multiSelect: false,
                                    editable: false,
                                    readOnly: this.readOnly,
                                    displayField: 'name',
                                    valueField: 'value',
                                    mode: 'local',
                                    queryMode: 'local',
                                    triggerAction: 'all',
                                    tpl: '<tpl for="."><div class="x-boundlist-item" data-qtip="{description}">{name}</div></tpl>',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value', 'description'],
                                        data: [
                                            {name: MSG.COMMON_DOUBLE_COLON, value: '::', description: '::'},
                                            {name: MSG.COMMON_COMMA, value: ',', description: ','},
                                            {name: MSG.COMMON_TAB, value: '\\t', description: '\\t'},
                                            {name: MSG.COMMON_BLANK, value: '\\s', description: '\\s'},
                                            {name: MSG.COMMON_USER_DEFINED, value: 'CUSTOM', description: MSG.COMMON_USER_DEFINED}
                                        ]
                                    }),
                                    listeners: {
                                        change: function (combo, newValue, oldValue, eOpts) {
                                            // 콤보 값에 따라 관련 textfield 를 enable | disable 처리한다.
                                            var customValueField = combo.nextSibling('textfield');
                                            if (newValue === 'CUSTOM') {
                                                customValueField.enable();
                                                customValueField.isValid();
                                            } else {
                                            	if(customValueField!=null){
                                            		customValueField.disable();
                                                    if (newValue) {
                                                        customValueField.setValue(newValue);
                                                    } else {
                                                        customValueField.setValue('::');
                                                    }                                            		
                                            	}else{
                                            		customValueField = '\\t';
                                            	}
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'delimiterValue',
                                    id: 'delimiterValue',
                                    vtype: 'exceptcommaspace',
                                    flex: 1,
                                    disabled: true,
                                    readOnly: this.readOnly,
                                    allowBlank: false,
                                    value: '::'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: MSG.DESIGNER_CON_BASED_DELIMITER,
                    tooltip: MSG.DESIGNER_MSG_CON_BASED_DELIMITER,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'subDelimiter',
                                    value: '|',
                                    flex: 1,
                                    forceSelection: true,
                                    multiSelect: false,
                                    editable: false,
                                    readOnly: this.readOnly,
                                    displayField: 'name',
                                    valueField: 'value',
                                    mode: 'local',
                                    queryMode: 'local',
                                    triggerAction: 'all',
                                    tpl: '<tpl for="."><div class="x-boundlist-item" data-qtip="{description}">{name}</div></tpl>',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value', 'description'],
                                        data: [
                                            {name: MSG.COMMON_PIPE, value: '|', description: '|'},
                                            {name: MSG.COMMON_COMMA, value: ',', description: ','},
                                            {name: MSG.COMMON_TAB, value: '\\t', description: '\\t'},
                                            {name: MSG.COMMON_BLANK, value: '\\s', description: '\\s'},
                                            {name: MSG.COMMON_USER_DEFINED, value: 'CUSTOM', description: MSG.COMMON_USER_DEFINED}
                                        ]
                                    }),
                                    listeners: {
                                        change: function (combo, newValue, oldValue, eOpts) {
                                            // 콤보 값에 따라 관련 textfield 를 enable | disable 처리한다.
                                            var customValueField = combo.nextSibling('textfield');
                                            if (newValue === 'CUSTOM') {
                                                customValueField.enable();
                                                customValueField.isValid();
                                            } else {
                                                customValueField.disable();
                                                if (newValue) {
                                                    customValueField.setValue(newValue);
                                                } else {
                                                    customValueField.setValue('|');
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'subDelimiterValue',
                                    vtype: 'exceptcommaspace',
                                    flex: 1,
                                    disabled: true,
                                    readOnly: this.readOnly,
                                    allowBlank: false,
                                    value: '|'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'button',
                    text: 'Preview file from HDFS',
//                    iconCls: 'common-confirm',
                    handler: function (grid, rowIndex, colIndex) {

                        // Parameter form
                        var canvas = Ext.ComponentQuery.query('form')[1];
                        var form = canvas.getForm();

                        // Preview grid
                        var previewGrid = Ext.ComponentQuery.query('#previewGrid')[0];

                        // Input paths grid
                        var inputGrid = Ext.ComponentQuery.query('_inputGrid')[0];
                        var selectedInputPath = inputGrid.getView().getSelectionModel().getSelection();

                        if (selectedInputPath[0] === undefined) {
                            msg('Add File and Dirctory', 'Please input File Path or Dirctory Path.');
                            return;
                        }

                        var inputPath = selectedInputPath[0].data.input;
                        //var delimiter = form.getValues()['delimiter'];
                        var delimiter = Ext.getCmp('delimiterValue').getValue();
                        
                        if(delimiter == undefined){
                        	delimiter = '::';
                        }                        

                        // Get _inputGrid values
                        var inputGridCanvas = Ext.ComponentQuery.query('canvas')[0];
                        var inputGridForm = inputGridCanvas.getForm();
                        var engineId = inputGridForm.getValues()['engine_id'];

                        var store = Ext.create('Ext.data.Store', {
                            fields: [
                                {name: 'columnIndex'},
                                {name: 'rowData'}
                            ],
                            autoLoad: true,
                            proxy: {
                                type: 'ajax',
                                url: CONSTANTS.CONTEXT_PATH + CONSTANTS.DESIGNER.LOAD_HDFS_FILE,
                                headers: {
                                    'Accept': 'application/json'
                                },
                                reader: {
                                    type: 'json',
                                    root: 'list'
                                },
                                extraParams: {
                                    'inputPath': inputPath,
                                    'delimiter': delimiter,
                                    'engineId': engineId
                                }
                            }
                        });

                        // Set grid row to preview file from hdfs
                        var rec;
                        var columnIndexList;
                        var rowDataList;

                        store.on('load', function (store, records) {

                            for (var i = 0; i < records.length; i++) {

                                columnIndexList = records[i].get('columnIndex');
                                rowDataList = records[i].get('rowData');

                                for (var k = 0; k < columnIndexList.length; k++) {
                                    rec = new Flamingo.model.designer.Preview({
                                        rIndex: columnIndexList[k],
                                        rData: rowDataList[k]
                                    });

                                    store.insert(0, rec);
                                    //Remove get list from ajax
                                    store.remove(records);
                                    previewGrid.store.sort('rIndex', 'ASC');
                                }
                            }
                        });

                        Ext.suspendLayouts();
                        previewGrid.reconfigure(store, [
                            {
                                text: 'Index',
                                dataIndex: 'rIndex',
                                id: 'rIndex',
                                width: 80
                            },
                            {
                                text: 'Value',
                                dataIndex: 'rData',
                                flex: 1
                            },
                            {
                                xtype: 'checkcolumn',
                                width: 55,
                                header: 'Identifier',
                                dataIndex: 'identifierCheckIndex',
                                listeners: {
                                    checkchange: function (column, recordIndex, checked) {

                                        var rowCount = previewGrid.getStore().data.length;
                                        var dataIndex = this.dataIndex;
                                        var record = previewGrid.getStore().getAt(recordIndex);
                                        checked = !record.get(dataIndex);

                                        // 하나 체크할 때 나머지는 체크 해지
                                        for (var i = 0; i < rowCount; i++) {
                                            if (i != recordIndex) {
                                                previewGrid.getStore().getAt(i).set(dataIndex, checked=false);
                                            }
                                        }
                                        
                                        var str_target = record.get('targetCheckIndex');
                                        var str_exception = record.get('exceptionCheckIndex');	
                                        
                                        if(str_target==true){
                                        	 record.set('targetCheckIndex', checked);	
                                        }else if(str_exception==true){                                       	 	
                                       	 	record.set('exceptionCheckIndex', checked);	
                                        }
                                    }
                                }
                            },                            
                            {
                                xtype: 'checkcolumn',
                                width: 65,
                                header: 'Target',
                                dataIndex: 'targetCheckIndex',
                                listeners: {
                                    checkchange: function (column, recordIndex, checked) {
                                    
                                        var record = previewGrid.getStore().getAt(recordIndex);
                                        var dataIndex = this.dataIndex;
                                        checked = !record.get(dataIndex);
                                        
                                        var str_Identifier = record.get('identifierCheckIndex');
                                        var str_exception = record.get('exceptionCheckIndex');	
                                        
                                        if(str_Identifier==true){
                                        	 record.set('identifierCheckIndex', checked);	
                                        }else if(str_exception==true){                                       	 	
                                       	 	record.set('exceptionCheckIndex', checked);	
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'checkcolumn',
                                width: 65,
                                header: 'Exception',
                                dataIndex: 'exceptionCheckIndex',
                                listeners: {
                                    checkchange: function (column, recordIndex, checked) {
                                        
                                        var dataIndex = this.dataIndex;
                                        var record = previewGrid.getStore().getAt(recordIndex);
                                        checked = !record.get(dataIndex);
                                        
                                        var str_target = record.get('targetCheckIndex');
                                        var str_Identifier = record.get('identifierCheckIndex');
                                        
                                        if(str_target==true){
                                        	 record.set('targetCheckIndex', checked);	
                                        }else if(str_Identifier==true){                                       	 	
                                       	 	record.set('identifierCheckIndex', checked);	
                                        }                         
                                    }
                                }
                            }                            
                        ]);
                        Ext.resumeLayouts(true);
                    }
                },
                {
                    margin: '10 0 0 0',
                    xtype: 'grid',
                    minHeight: 100,
                    height: 130,
                    itemId: 'previewGrid',
                    multiSelect: true,
                    columns: [
                        {
                            text: 'Index',
                            width: 80,
                            dataIndex: 'rIndex',
                            id: 'rIndex'
                        },
                        {
                            text: 'Value',
                            flex: 1,
                            dataIndex: 'rData'
                        },
                        {
                            xtype: 'checkcolumn',
                            width: 55,
                            header: 'Identifier',
                            dataIndex: 'identifierCheckIndex',
                            editor: {
                                xtype: 'checkbox',
                                cls: 'x-grid-checkheader-editor'
                            }
                        },                        
                        {
                            xtype: 'checkcolumn',
                            width: 65,
                            header: 'Target',
                            dataIndex: 'targetCheckIndex'
                        },
                        {
                            xtype: 'checkcolumn',
                            width: 65,
                            header: 'Exception',
                            dataIndex: 'exceptionCheckIndex'

                        }
                        
                    ],
                    tbar: [
                        {
                            text: 'Target All',
                            iconCls: 'common-confirm',
                            scope: this,
                            align: 'right',
                            handler: function (store) {

                                var previewGrid = Ext.ComponentQuery.query('#previewGrid')[0];
                                var range = previewGrid.store.getRange();

                                for (var i = 0; i < range.length; i++) {
                                    if (range[i] != null) {
                                        var record = previewGrid.getStore().getAt(i);
                                        record.set('targetCheckIndex', true);
                                        record.set('exceptionCheckIndex', false);
                                        record.set('identifierCheckIndex', false);
                                    }
                                }
                            }
                        },
                        {
                            text: 'Exception All',
                            iconCls: 'common-delete',
                            scope: this,
                            align: 'right',
                            handler: function (store) {

                                var previewGrid = Ext.ComponentQuery.query('#previewGrid')[0];
                                var range = previewGrid.store.getRange();

                                for (var i = 0; i < range.length; i++) {
                                    if (range[i] != null) {
                                        var record = previewGrid.getStore().getAt(i);
                                        record.set('exceptionCheckIndex', true);
                                        record.set('targetCheckIndex', false);
                                        record.set('identifierCheckIndex', false);
                                    }
                                }
                            }
                        },
                        {
                            text: 'Reset',
                            iconCls: 'common-find-clear',
                            scope: this,
                            align: 'right',
                            handler: function (store) {
                                var previewGrid = Ext.ComponentQuery.query('#previewGrid')[0];
                                var range = previewGrid.store.getRange();

                                for (var i = 0; i < range.length; i++) {
                                    if (range[i] != null) {
                                        var record = previewGrid.getStore().getAt(i);
                                        record.set('targetCheckIndex', false);
                                        record.set('exceptionCheckIndex', false);
                                        record.set('identifierCheckIndex', false);
                                    }
                                }
                            }
                        }
                    ],
                    viewConfig: {
                        enableTextSelection: true,
                        emptyText: 'Click a button to show preview data from HDFS',
                        deferEmptyText: false
                    }
                },
                {
                    xtype: 'tbspacer',
                    height: 10
                },
                {
                    xtype: 'button',
                    text: 'Select field number',
                    iconCls: 'common-confirm',
                    handler: function (store) {
                        var previewGrid = Ext.ComponentQuery.query('#previewGrid')[0];
                        var r = previewGrid.store.getRange();

                        var targetCount = 0;
                        var exceptionCount = 0;
                        var identifierCount = 0;
                        var record;

                        // Count checkbox from grid
                        for (var i = 0; i < r.length; i++) {
                            if (r[i] != null) {
                                record = previewGrid.getStore().getAt(i);

                                if (r[i].data.targetCheckIndex) targetCount++;
                                if (r[i].data.exceptionCheckIndex) exceptionCount++;
                                if (r[i].data.identifierCheckIndex) identifierCount++;
                            }
                        }

                        var targetIndexList = [];
                        var exceptionIndexList = [];
                        var identifierIndexList = [];

                        // Set checkbox index from gird
                        for (var i = 0; i < r.length; i++) {
                            if (r[i] != null) {
                                record = previewGrid.getStore().getAt(i);
                                
                                // Set identifier attribute(index) 
                                if (identifierCount != r.length && identifierCount != 0) {
                                    if (r[i].data.identifierCheckIndex) {
                                        identifierIndexList.push(r[i].data.rIndex);
                                        if (identifierCount === identifierCount - 1) {
                                            identifierIndexList.push(',');
                                        }
                                    }
                                }

                                // Set target attribute(index) list
                                if (targetCount != r.length && targetCount != 0) {
                                    if (r[i].data.targetCheckIndex) {
                                        targetIndexList.push(r[i].data.rIndex);
                                        if (targetCount === targetCount - 1) {
                                            targetIndexList.push(',');
                                        }
                                    }
                                }

                                // Set exception attribute(index) list
                                if (exceptionCount != r.length && exceptionCount != 0) {
                                    if (r[i].data.exceptionCheckIndex) {
                                        exceptionIndexList.push(r[i].data.rIndex);
                                        if (exceptionCount === exceptionCount - 1) {
                                            exceptionIndexList.push(',');
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Set textfiled by grid
                        if (identifierCount == r.length) {
                            Ext.getCmp('keyIndex').setValue('-1');
                        } else if (identifierCount === 0) {
                            Ext.getCmp('keyIndex').setValue('');
                        } else {
                            Ext.getCmp('keyIndex').setValue(identifierIndexList);
                        }
                        
                        if (targetCount == r.length) {
                            Ext.getCmp('indexList').setValue('-1');
                        } else if (targetCount === 0) {
                            Ext.getCmp('indexList').setValue('');
                        } else {
                            Ext.getCmp('indexList').setValue(targetIndexList);
                        }
                        
                        if (exceptionCount == r.length) {
                            Ext.getCmp('exceptionIndexList').setValue('-1');
                        } else if (exceptionCount === 0) {
                            Ext.getCmp('exceptionIndexList').setValue('');
                        } else {
                            Ext.getCmp('exceptionIndexList').setValue(exceptionIndexList);
                        }
                    }
                },
                {
                    xtype: 'fieldset',
                    height: 190,
                    title: 'Select Parameter Option',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%',
                        labelWidth: 200,
                        hideEmptyLabel: false
                    },
                    items: [
                    	{
                            xtype: 'textfield',
                            fieldLabel: MSG.DESIGNER_CON_BASED_IDENTIFIER,
                            name: 'keyIndex',
                            id: 'keyIndex',
                            tooltip: MSG.DESIGNER_MSG_CON_BASED_IDENTIFIER,
                            vtype: 'numeric',
                            allowBlank: false
                        },                        
                        {
                            xtype: 'textfield',
                            name: 'indexList',
                            id: 'indexList',
                            fieldLabel: MSG.DESIGNER_CON_BASED_TARGET_INCLUDE_LIST,
                            tooltip: MSG.DESIGNER_MSG_CON_BASED_TARGET_INCLUDE_LIST,
                            vtype: 'commaseperatednum',
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            name: 'exceptionIndexList',
                            id: 'exceptionIndexList',
                            fieldLabel: 'Exception Attribute(Index)',                            
                            vtype: 'commaseperatednum',
                            allowBlank: true
                        },                        
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: MSG.DESIGNER_CON_BASED_ALGORITHM,
                            tooltip: MSG.DESIGNER_MSG_CON_BASED_ALGORITHM,
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'algorithmOption',
                                    value: 'jaccard',
                                    flex: 1,
                                    forceSelection: true,
                                    multiSelect: false,
                                    disabled: false,
                                    editable: false,
                                    displayField: 'name',
                                    valueField: 'value',
                                    mode: 'local',
                                    queryMode: 'local',
                                    triggerAction: 'all',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value', 'description'],
                                        data: [                                            
                                            {name: 'JACCARD COEFFICIENT', value: 'jaccard', description: 'JACCARD COEFFICIENT'}, 
                                            {name: 'DICE COEFFICIENT', value: 'dice', description: 'DICE COEFFICIENT'}                                           
                                        ]
                                    })
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Similarity Sum Option',                            
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'sumOption',
                                    value: 'avg',
                                    flex: 1,
                                    forceSelection: true,
                                    multiSelect: false,
                                    disabled: false,
                                    editable: false,
                                    displayField: 'name',
                                    valueField: 'value',
                                    mode: 'local',
                                    queryMode: 'local',
                                    triggerAction: 'all',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value', 'description'],
                                        data: [
                                            {name: 'AVERAGE', value: 'avg', description: 'AVERAGE'},
                                            {name: 'SUM', value: 'sum', description: 'SUM'},     
                                            {name: 'CERTAINTY FACTOR', value: 'cfsum', description: 'CERTAINTY FACTOR'}                                       
                                        ]
                                    })
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Similarity Target ID',
                            name: 'targetID',
                            id: 'targetID',                                         
                            allowBlank: true
                        }
                    ]
                },
                /*
                {
                    xtype: 'fieldset',
                    height: 110,
                    title: 'Input Parameter Option',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%',
                        labelWidth: 200,
                        hideEmptyLabel: false
                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: MSG.DESIGNER_CON_BASED_ALGORITHM,
                            tooltip: MSG.DESIGNER_MSG_CON_BASED_ALGORITHM,
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'algorithmOption',
                                    value: 'dice',
                                    flex: 1,
                                    forceSelection: true,
                                    multiSelect: false,
                                    disabled: false,
                                    editable: false,
                                    displayField: 'name',
                                    valueField: 'value',
                                    mode: 'local',
                                    queryMode: 'local',
                                    triggerAction: 'all',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value', 'description'],
                                        data: [
                                            {name: 'DICE COEFFICIENT', value: 'dice', description: 'DICE COEFFICIENT'},
                                            {name: 'JACCARD COEFFICIENT', value: 'jaccard', description: 'JACCARD COEFFICIENT'},
                                            {name: 'HAMMING DISTANCE', value: 'hamming', description: 'HAMMING DISTANCE'}
                                        ]
                                    })
                                }
                            ]
                        },
                        {
                            xtype: 'radiogroup',
                            fieldLabel: MSG.DESIGNER_NOR_PRINT_EXCLUDE_LIST,
                            tooltip: MSG.DESIGNER_MSG_NOR_PRINT_EXCLUDE_LIST,
                            allowBlank: true,
                            columns: 2,
                            itemId: 'myRadio',
                            items: [
                                {
                                    xtype: 'radiofield',
                                    boxLabel: 'True',
                                    name: 'remainAllFields',
                                    tooltip: MSG.DESIGNER_MSG_NOR_PRINT_EXCLUDE_LIST_RADIO_Y,
                                    checked: true,
                                    inputValue: 'true'
                                },
                                {
                                    xtype: 'radiofield',
                                    boxLabel: 'False',
                                    name: 'remainAllFields',
                                    tooltip: MSG.DESIGNER_MSG_NOR_PRINT_EXCLUDE_LIST_RADIO_N,
                                    checked: false,
                                    inputValue: 'false'
                                }
                            ]
                        },
                        // Ankus MapReduce가 동작하는데 필요한 출력 경로를 지정한다. 이 경로는 오직 1개만 지정가능하다.
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: MSG.DESIGNER_TITLE_OUTPUT_PATH,
                            defaults: {
                                hideLabel: true,
                                margin: "5 0 0 0"  // Same as CSS ordering (top, right, bottom, left)
                            },
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: '_browserField',
                                    name: 'output',
                                    allowBlank: false,
                                    readOnly: false,
                                    flex: 1
                                }
                            ]
                        }
                        */
                    ]
                }
            ]
        },
        {
            title: MSG.DESIGNER_TITLE_MAPREDUCE,
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'jar',
                    id:'CODENAME_VAR',
                    fieldLabel: MSG.DESIGNER_MR_JAR,
                    disabledCls: 'disabled-plain',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'driver',
                    fieldLabel: MSG.DESIGNER_DRIVER,
                    value: 'ContentBasedSimilarity',
                    disabledCls: 'disabled-plain',
                    allowBlank: false
                }
            ]
        },
        {
            title: MSG.DESIGNER_TITLE_H_CONFIG,
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                /*
                 {
                 xtype: '_configurationBrowserField'
                 },
                 */
                {
                    xtype: '_keyValueGrid',
                    flex: 1
                }
            ]
        }
    ],

    /**
     * UI 컴포넌트의 Key를 필터링한다.
     *
     * ex) 다음과 같이 필터를 설정할 수 있다.
     * propFilters: {
     *     // 추가할 프라퍼티
     *     add   : [
     *         {'test1': '1'},
     *         {'test2': '2'}
     *     ],
     *
     *     // 변경할 프라퍼티
     *     modify: [
     *         {'delimiterType': 'delimiterType2'},
     *         {'config': 'config2'}
     *     ],
     *
     *     // 삭제할 프라퍼티
     *     remove: ['script', 'metadata']
     * }
     */
    propFilters: {
        add: [],
        modify: [],
        remove: ['config']
    },

    /**
     * MapReduce의 커맨드 라인 파라미터를 수동으로 설정한다.
     * 커맨드 라인 파라미터는 Flamingo Workflow Engine에서 props.mapreduce를 Key로 꺼내어 구성한다.
     *
     * @param props UI 상에서 구성한 컴포넌트의 Key Value값
     */
    afterPropertySet: function (props) {
        props.mapreduce = {
            "driver": props.driver ? props.driver : '',
            "jar": props.jar ? props.jar : '',
            "confKey": props.hadoopKeys ? props.hadoopKeys : '',
            "confValue": props.hadoopValues ? props.hadoopValues : '',
            params: []
        };

        if (props.input) {
            props.mapreduce.params.push("-input", props.input);
        }

        if (props.output) {
            props.mapreduce.params.push("-output", props.output);
        }
        
        if (props.keyIndex) {
            props.mapreduce.params.push("-keyIndex", props.keyIndex);
        }        
        
        if (props.indexList) {
            props.mapreduce.params.push("-indexList", props.indexList);
        }
        
        if (props.exceptionIndexList) {
            props.mapreduce.params.push("-exceptionIndexList", props.exceptionIndexList);
        }        
        
        if (props.algorithmOption) {
            props.mapreduce.params.push("-algorithmOption", props.algorithmOption);
        }
        
        if (props.sumOption) {
            props.mapreduce.params.push("-sumOption", props.sumOption);
        }
        
        if (props.targetID) {
            props.mapreduce.params.push("-targetID", props.targetID);
        }
        

        if (props.subDelimiter) {
            if (props.subDelimiter == 'CUSTOM') {
                props.mapreduce.params.push("-subDelimiter", props.subDelimiterValue);
            } else {
                props.mapreduce.params.push("-subDelimiter", props.subDelimiter);
            }
        }

        if (props.delimiter) {
            if (props.delimiter == 'CUSTOM') {
                props.mapreduce.params.push("-delimiter", props.delimiterValue);
            } else {
                props.mapreduce.params.push("-delimiter", props.delimiter);
            }
        }
        
        

        this.callParent(arguments);
    }
});