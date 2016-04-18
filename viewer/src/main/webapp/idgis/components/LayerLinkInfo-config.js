/* 
 * Copyright (C) 2013 B3Partners B.V.
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
 * Custom configuration object for LayerLinkInfo configuration
 * @author <a href="mailto:linda.vels@idgis.nl">Linda Vels</a>
 */
Ext.define("viewer.components.CustomConfiguration",{
    extend: "viewer.components.SelectionWindowConfig",
    form: null,
    constructor: function (parentId,configObject){
        //console.log(configObject);
    	if (configObject===undefined || configObject===null){
            configObject={};
        }
        
        configObject.layerFilter=this.layerFilter;
        //console.log(configObject.layers);
        //console.log(configObject.layerFilter(configObject.layers));
        viewer.components.CustomConfiguration.superclass.constructor.call(this, parentId,configObject);        
        
        this.checkPanelHeight=200;
        
        console.log(Ext.form.Field.prototype.afterRender);
        
       
        
        
        this.form.add([
         {
            xtype: 'numberfield',
            fieldLabel: 'Klik nauwkeurigheid',
            name: 'clickRadius',
            value: this.configObject.clickRadius !== undefined ? this.configObject.clickRadius : 4,
            labelWidth:this.labelWidth,
            style: {
                marginRight: "70px"
            }
        },{
            xtype: 'checkbox',
            fieldLabel: 'Toon laadanimatie op plek van klikken (uit gebruikt de cursor)',
            name: 'spinnerWhileIdentify',
            inputValue: true,
            checked: this.configObject.spinnerWhileIdentify !== undefined ? this.configObject.spinnerWhileIdentify : false,
            labelWidth:this.labelWidth
        },{
            xtype: 'combo',
            fieldLabel: '1: FeatureInfolaag',
            name: 'InfoLayer1',
            valueField: 'layerName',
            displayField: 'layerName',
            triggerAction: 'all',
            editable: false,
            value: this.configObject.InfoLayer1 !== undefined ? this.configObject.InfoLayer1 : "",
            labelWidth:this.labelWidth,
            style: {
                width: "700px"
            },
            tip: 'Selecteer een FeatureInfo laag',
            listeners: {
              render: function(c) {
                Ext.create('Ext.tip.ToolTip', {
                  target: c.getEl(),
                  html: c.tip 
                });
              }
            }
        
        },{
            xtype: 'textfield',
            fieldLabel: '1: FeatureInfolaag attribuut',
            name: 'InfoLayerAttr1',
            value: this.configObject.InfoLayerAttr1 !== undefined ? this.configObject.InfoLayerAttr1 : "",
            labelWidth:this.labelWidth,
            style: {
               width: "600px"
            },
            tip: 'Voer de naam in van het attribuut uit de FeatureInfo laag die verwijst naar de highlight laag',
            listeners: {
              render: function(c) {
                Ext.create('Ext.tip.ToolTip', {
                  target: c.getEl(),
                  html: c.tip 
                });
              }
            }
        },{
            xtype: 'combo',
            fieldLabel: '1: Highlightlaag',
            name: 'LinkLayer1',
            valueField: 'layerName',
            displayField: 'layerName',
            triggerAction: 'all',
            editable: false,
            value: this.configObject.LinkLayer1 !== undefined ? this.configObject.LinkLayer1 : "",
            labelWidth:this.labelWidth,
            style: {
                width: "700px"
            },
            tip: 'Selecteer de highlight laag',
            listeners: {
              render: function(c) {
                Ext.create('Ext.tip.ToolTip', {
                  target: c.getEl(),
                  html: c.tip 
                });
              }
            }
        },{
            xtype: 'textfield',
            fieldLabel: '1: Highlightlaag attribuut',
            name: 'LinkLayerAttr1',
            value: this.configObject.LinkLayerAttr1 !== undefined ? this.configObject.LinkLayerAttr1 : "",
            labelWidth:this.labelWidth,
            style: {
                width: "600px"
            },
            tip: 'Voer de naam in van het attribuut uit de highlight laag waar de FeatureInfo attribuut naar verwijst',
            listeners: {
              render: function(c) {
                Ext.create('Ext.tip.ToolTip', {
                  target: c.getEl(),
                  html: c.tip 
                });
              }
            }
        },{
            xtype: 'combo',
            fieldLabel: '2: FeatureInfolaag',
            name: 'InfoLayer2',
            valueField: 'layerName',
            displayField: 'layerName',
            triggerAction: 'all',
            editable: false,
            value: this.configObject.InfoLayer2 !== undefined ? this.configObject.InfoLayer2 : "",
            labelWidth:this.labelWidth,
            style: {
                width: "700px"
            },
            tip: 'Selecteer een FeatureInfo laag',
            listeners: {
              render: function(c) {
                Ext.create('Ext.tip.ToolTip', {
                  target: c.getEl(),
                  html: c.tip 
                });
              }
            }
        },{
            xtype: 'textfield',
            fieldLabel: '2: FeatureInfolaag attribuut',
            name: 'InfoLayerAttr2',
            value: this.configObject.InfoLayerAttr2 !== undefined ? this.configObject.InfoLayerAttr2 : "",
            labelWidth:this.labelWidth,
            style: {
               width: "600px"
            },
            tip: 'Voer de naam in van het attribuut uit de FeatureInfo laag die verwijst naar de highlight laag',
            listeners: {
              render: function(c) {
            	  
                Ext.create('Ext.tip.ToolTip', {
                  target: c.getEl(),
                  html: c.tip 
                });
              }
            }
        },{
            xtype: 'combo',
            fieldLabel: '2: HighlightLaag',
            name: 'LinkLayer2',
            valueField: 'layerName',
            displayField: 'layerName',
            triggerAction: 'all',
            editable: false,
            value: this.configObject.LinkLayer2 !== undefined ? this.configObject.LinkLayer2 : "",
            labelWidth:this.labelWidth,
            style: {
                width: "700px"
            },
	        tip: 'Voer de naam in van het attribuut uit de highlight laag waar de FeatureInfo attribuut naar verwijst',
	        listeners: {
	          render: function(c) {
	            Ext.create('Ext.tip.ToolTip', {
	              target: c.getEl(),
	              html: c.tip 
	            });
	          }
	        }
        },{
            xtype: 'textfield',
            fieldLabel: '2: Highlightlaag attribuut',
            name: 'LinkLayerAttr2',
            value: this.configObject.LinkLayerAttr2 !== undefined ? this.configObject.LinkLayerAttr2 : "",
            labelWidth:this.labelWidth,
            style: {
                width: "600px"
            },
            tip: 'Voer de naam in van het attribuut uit de highlight laag waar de FeatureInfo attribuut naar verwijst',
            listeners: {
              render: function(c) {
                Ext.create('Ext.tip.ToolTip', {
                  target: c.getEl(),
                  html: c.tip 
                });
              }
            }
        }
        ]);
        
        this.createCheckBoxes(this.configObject.layers,{});

		
        
        
    },
    layerFilter: function(layers){
        var filteredLayers=[];
        for (var i in layers){
            if(!layers.hasOwnProperty(i)) {
                continue;
            }
            var l = layers[i];
            //check if layer has something to show in the maptip
            if (l && l.details !=undefined &&
                (!Ext.isEmpty(l.details["summary.description"]) ||
                    !Ext.isEmpty(l.details["summary.image"]) ||
                    !Ext.isEmpty(l.details["summary.link"]) ||
                    !Ext.isEmpty(l.details["summary.title"]))){
                filteredLayers.push(l);
            }
        }

        //fill comboboxes
        var data = [];
        for (var lyr in filteredLayers){
        	data.push([filteredLayers[lyr].layerName]);
        }
        var store = new Ext.data.SimpleStore({
            data: data,
               id: 0,
               fields: ['layerName']});
        this.customConfiguration.form.getForm().findField("InfoLayer1").bindStore(store);
        this.customConfiguration.form.getForm().findField("LinkLayer1").bindStore(store);
        this.customConfiguration.form.getForm().findField("InfoLayer2").bindStore(store);
        this.customConfiguration.form.getForm().findField("LinkLayer2").bindStore(store);
        
        return filteredLayers;
    },
    getConfiguration : function(){
        var config = this.callParent(arguments);
        return config;
    }
});