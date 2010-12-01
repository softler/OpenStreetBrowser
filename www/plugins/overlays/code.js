var overlays_layers={};

function overlays_register(id, overlay) {
  overlays_layers[id]=overlay;

  map.addLayer(overlay);

  layers_reorder();
}

function overlays_permalink(permalink) {
  var list=[];

  for(var i in overlays_layers) {
    if(overlays_layers[i].visibility)
      list.push(i);
  }

  permalink.overlays=list.join(",");
}

function overlays_hash_changed(new_hash) {
  if(!new_hash.overlays)
    return;

  var list=new_hash.overlays.split(",");
  for(var i=0; i<list.length; i++) {
    if(overlays_layers[list[i]])
      overlays_layers[list[i]].setVisibility(true);
  }
}

register_hook("get_permalink", overlays_permalink);
register_hook("hash_changed", overlays_hash_changed);