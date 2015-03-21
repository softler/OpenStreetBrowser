function object_ol4pgm(feature, category) {
  this.inheritFrom=geo_object;
  this.inheritFrom();

  this.feature = feature;
  this.category = category;

  this.name = this.feature.getProperties().results[0]['text'] || lang("unnamed");
  this.type = this.feature.getProperties().results[0]['type'];
  this.id = this.feature.getProperties()['osm:id'];
  this.href = url({ obj: category.id + "/" + this.id });

  this.highlight = new ol.format.WKT().writeFeature(this.feature);
  this.highlight_center=new ol.format.WKT().writeGeometry(new ol.geom.Point(ol.extent.getCenter(this.feature.getGeometry().getExtent())));

  this.geo = function() {
    return [this.feature];
  }

  this.geo_center = function() {
    return [this.feature]; // todo
  }

  this.list_weight = function() {
    return -parseFloat(this.feature.getProperties().results[0]['z-index']) || 0.0;
  }.bind(this);
}