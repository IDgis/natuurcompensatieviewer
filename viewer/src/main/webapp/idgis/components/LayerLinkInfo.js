/* 
 * Copyright (C) 2012-2013 B3Partners B.V.
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
 * LayerLinkInfo component
 * Shows feature info and highlights linked features in a linkedlayer.
 * Only works for geoserver layers.
 * @author <a href="mailto:lindavels@idgis.nl">LindaVels</a>
 */
Ext.define ("idgis.components.LayerLinkInfo", {
    extend: "viewer.components.FeatureInfo",   
    progressElement: null,
    //config: {
		// linkedlayers: null
	//},
	linkLayers: [],
    /**
     * Overwrite constructor to set some other settings then maptip.
     */
    constructor: function (conf){    

        conf.isPopup=true;
        //don't call maptip constructor but that of super maptip.
        idgis.components.LayerLinkInfo.superclass.superclass.constructor.call(this, conf);
        this.initConfig(conf);
        
        //voeg de appLayer toe aan linklayers en vul linklayers[]
        var appLayers = this.config.viewerController.app.appLayers;
        var wmsFilter1 = conf.InfoLayerAttr1 + ":[" + conf.LinkLayerAttr1 + "]"; 
        var wfsFilter1 = conf.InfoLayerAttr1 + "=[" + conf.LinkLayerAttr1 + "]"; 
        var wmsFilter2 = conf.InfoLayerAttr2 + ":[" + conf.LinkLayerAttr2 + "]"; 
        var wfsFilter2 = conf.InfoLayerAttr2 + "=[" + conf.LinkLayerAttr2 + "]"; 

        var confLinkLayers = [{layername:conf.InfoLayer1, linklayername:conf.LinkLayer1, wmsfilterparam:{env:wmsFilter1}, wfsfilterparam:wfsFilter1},
                             {layername:conf.InfoLayer2, linklayername:conf.LinkLayer2, wmsfilterparam:{env:wmsFilter2}, wfsfilterparam:wfsFilter2}]; 
        
        
        
        for (var linkLayerIndex in confLinkLayers) {
        	var linkLayer = confLinkLayers[linkLayerIndex];
        	for (var appLayerIndex in appLayers) {
        		var appLayer = appLayers[appLayerIndex]; 
        		if (linkLayer.layername === appLayer.layerName) {
        			linkLayer.appLayer = appLayer;
        		}
        		if (linkLayer.linklayername === appLayer.layerName) {
        			linkLayer.linkappLayer = appLayer;
        		}
        	}
        	this.linkLayers.push (linkLayer);
        }

        this.popup.popupWin.addListener('hide', this.onPopupHide, this);
        return this;        
    },    
	  
	onPopupHide: function() {
		//removemarker 
		this.config.viewerController.mapComponent.getMap().removeMarker('MarkerComponent');
		//removehighlights
		this.removeHighlights ();
	},
      
    onDataReturned: function(options){
    	var coords = options.coord;
        var x = coords.x;
        var y = coords.y;
    	this.config.viewerController.mapComponent.getMap().setMarker('MarkerComponent', x, y);
        var infoLinkLayer = null;
        var data = options.data;   
        for (var layerIndex in data) {
            if(!data.hasOwnProperty(layerIndex)){
                continue;
            }
            var layer = data[layerIndex];
            //check of layer een linklaag is
            for(var linklayer in this.linkLayers) {
            	if (this.linkLayers[linklayer].layername === layer.appLayer.layerName) {
            		for (var index in layer.features) {
    	                if (layer.features.hasOwnProperty(index)) {
    	                	infoLinkLayer = this.linkLayers[linklayer];
    	                	infoLinkLayer.layer = layer;
    	                } else {
    	                	
    	                	//foutmelding
    	                }
    	            }
            	} 
            }
        }
        if (infoLinkLayer){        	
        	this.setHighlight (infoLinkLayer);
        	//maak het info scherm
        	this.createLinkInfoDiv (infoLinkLayer);
        } 
    },
    

    
    createLinkInfoDiv: function (infoLinkLayer) {
    	var cDiv=Ext.get (this.getContentDiv());
    	cDiv.update("");
        var linkInfoHtml = this.createInfoHtmlElement (infoLinkLayer);
        this.addZoomLinks (infoLinkLayer,linkInfoHtml);
    	
	    if (!Ext.isEmpty (linkInfoHtml)){
	    	var linkInfoDiv = new Ext.Element(document.createElement ("div"));
	    	 	linkInfoDiv.setStyle ("background-color", "white");
	    	 	linkInfoDiv.appendChild (linkInfoHtml);  	
	    	var cDiv=Ext.get (this.getContentDiv());
	    	cDiv.appendChild (linkInfoDiv);
	        this.popup.show ();
	    }
    },

    setHighlight: function (infoLinkLayer) {
    	this.removeHighlights();
    	var attributes = infoLinkLayer.layer.features[0];
    	var filterparam = new Object();
    	var key = Object.keys(infoLinkLayer.wmsfilterparam)[0];
    	filterparam[key] = this.replaceByAttributes(infoLinkLayer.wmsfilterparam[key],attributes,true,true);
   		var highlightLayer = this.config.viewerController.getLayer(infoLinkLayer.linkappLayer);
   		highlightLayer.setOGCParams (filterparam);
    },
    
    removeHighlights: function () {
	    for(var linklayer in this.linkLayers) {
	    	var key = Object.keys(this.linkLayers[linklayer].wmsfilterparam)[0];
			var highlightLayer = this.config.viewerController.getLayer(this.linkLayers[linklayer].linkappLayer);
			var param = new Object();
			param[key] = "";
			highlightLayer.setOGCParams (param);
		}
    },
    
    addZoomLinks: function (infoLinkLayer, featureDiv) {
    	/*var geom = OpenLayers.Geometry.fromWKT(infoLinkLayer.layer.features[0][infoLinkLayer.appLayer.geometryAttribute]);
    	var extent = this.config.viewerController.mapComponent.getMap().utils.createExtent(geom.getBounds());
    	var linkDiv = new Ext.Element(document.createElement("div"));
        linkDiv.addCls("feature_detail_link");
        var me = this;	
        var link = new Ext.Element(document.createElement("a"));
        link.set({href:'#'});//'this.config.viewerController.mapComponent.getMap().zoomToExtent(extent)'});
        link.on('click', function() {
        	me.config.viewerController.mapComponent.getMap().zoomToExtent(extent);
        });
        link.insertHtml("beforeEnd","Zoom naar " + infoLinkLayer.appLayer.alias);

        featureDiv.appendChild(link);*/
    	var attributes = infoLinkLayer.layer.features[0];
    	var linkedfeaturesfilter = this.replaceByAttributes(infoLinkLayer.wfsfilterparam,attributes,true,true);
    	var linkedgeom = infoLinkLayer.linkappLayer.geometryAttribute;
    	var url = actionBeans.attributes;
        var params = [];
        params = {store:1, application:this.config.viewerController.app.id, appLayer:infoLinkLayer.linkappLayer.id,filter:linkedfeaturesfilter, start:0, page:1, limit:1000};
    	Ext.apply(params);
        return Ext.Ajax.request({
            url: url,
            params: params,
            method: 'POST', 
            scope:this,
            timeout: 60000,
            success: function(result) {
                var response = Ext.JSON.decode(result.responseText);
                
                var geomCol = new OpenLayers.Geometry.Collection();
                for (var i = 0 ; i < response.features.length; i++) {
                	var feature = response.features[i];
                	var geom = OpenLayers.Geometry.fromWKT(feature[linkedgeom]);
                	geomCol.addComponent(geom);
                }	
                geomCol.calculateBounds();
            	var extent = this.config.viewerController.mapComponent.getMap().utils.createExtent(geomCol.bounds);
    
                var me = this;	
                var link = new Ext.Element(document.createElement("a"));
                link.set({href:'javascript:void(0)'});
                link.on('click', function() {
                	me.config.viewerController.mapComponent.getMap().zoomToExtent(extent);
                });         
                link.insertHtml("beforeEnd","Zoom naar " + infoLinkLayer.linkappLayer.alias);
                featureDiv.appendChild(link);
                
            },
            failure: function(result) {
            	console.log("mislukt");
            	/*if(failureFunction != undefined) {
                    failureFunction("Ajax request failed with status " + result.status + " " + result.statusText + ": " + result.responseText);
                }*/
            }
        });
            
    },
        
    /**
     * create info elements for the popup.
     */
    createInfoHtmlElement: function (infoLinkLayer){
        var me = this;
        var layer = infoLinkLayer.layer;
        if (layer.error){
           this.config.viewerController.logger.error(layer.error);
        } else{
           var appLayer =  infoLinkLayer.appLayer;
           var details;
           details = appLayer.details;
          
           var layerName= layer.request.appLayer;
           
           //alleen het eerste feature
        	var feature = layer.features[0];
            //backwards compatibility. If the feature is the attributes (old way) use the feature as attribute obj.
            var attributes = feature.attributes? feature.attributes : feature;
            var featureDiv = new Ext.Element(document.createElement("div"));
            featureDiv.addCls("feature_summary_feature");
            //var id= "f" + appLayer.serviceId+layerName+"_0";
            //featureDiv.id= id;

            var columnDiv = new Ext.Element(document.createElement("div"));
            columnDiv.addCls("feature_summary_leftcolumn");
            columnDiv.setStyle({
                   'width': '100%'
            });
            
            //title
            if (details && details["summary.title"] ){
                var titleDiv = new Ext.Element(document.createElement("div"));
                titleDiv.addCls("feature_summary_title");
                titleDiv.insertHtml("beforeEnd",this.replaceByAttributes(details["summary.title"],attributes,true,true));
                columnDiv.appendChild(titleDiv);
            }
            //description
            if (details && details["summary.description"]){
                var descriptionDiv = new Ext.Element(document.createElement("div"));
                descriptionDiv.addCls("feature_summary_description");
                if (this.config.heightDescription){
                    descriptionDiv.setHeight(Number(this.config.heightDescription));
                }
                var desc = this.replaceByAttributes(details["summary.description"],attributes,true,true);

                descriptionDiv.insertHtml("beforeEnd",desc);
                columnDiv.appendChild(descriptionDiv);
            }
                

            if (this.extraLinkCallbacks && this.extraLinkCallbacks.length > 0) {
                var extraDiv = new Ext.Element(document.createElement("div"));
                extraDiv.addCls("feature_callback_link");
                for (var i = 0; i < this.extraLinkCallbacks.length; i++) {
                    var entry = this.extraLinkCallbacks[i];
                    if (entry.appLayers && !Ext.Array.contains(entry.appLayers, appLayer)) {
                        // looking at an unspecified appLayer, skip adding the link
                        continue;
                    }
                    //extraDiv.appendChild(this.createCallbackLink(entry, feature, appLayer, options.coord));
                }
                columnDiv.insertFirst(extraDiv);
            }

            featureDiv.appendChild(columnDiv);

            
        }
        return featureDiv;
    },
    
    

    
    
    
    
//    /**
//     *Called when extent is changed, recalculate the position
//     */
//    onChangeExtent : function(map,options){        
//        if (this.worldPosition && options.extent){
//            if (options.extent.isIn(this.worldPosition.x,this.worldPosition.y)){
//                this.balloon.setPositionWorldCoords(this.worldPosition.x,this.worldPosition.y,false,this.getBrowserZoomRatio());
//            }else{
//                this.balloon.hide();
//            }
//        }
//    },
//    /**
//     * 
//     */
//     setMaptipEnabled: function (enable){        
//        var maptips= this.config.viewerController.getComponentsByClassName("viewer.components.Maptip");
//        for (var i =0; i < maptips.length;i++){
//            if (typeof maptips[i].setEnabled == 'function'){
//                maptips[i].setEnabled(enable);
//            }
//        } 
//     },
//    
    
    /**
     * Return the name of the superclass to inherit the css property.
     * @returns {String} base class name
     * @override
     */
    getBaseClass: function () {
        return this.superclass.self.getName().replace(/\./g, '');
    }
            
});