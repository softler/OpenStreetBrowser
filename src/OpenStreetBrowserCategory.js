var OverpassLayer = require('overpass-layer')
var OverpassLayerList = require('overpass-layer').List

function OpenStreetBrowserCategory (id) {
  function reqListener (req) {
    var data = JSON.parse(req.responseText)

    this.layer = new OverpassLayer(data.query, data)

    if (this.autoAdd) {
      this.addTo(this.map)
      this.autoAdd = false
    }
  }

  var req = new XMLHttpRequest()
  req.addEventListener("load", reqListener.bind(this, req))
  req.open("GET", "categories/" + id + ".json")
  req.send()
}

OpenStreetBrowserCategory.prototype.addTo = function (map) {
  this.map = map

  if (this.layer) {
    this.layer.addTo(this.map)
    new OverpassLayerList(document.getElementById('info'), this.layer);
  } else {
    this.autoAdd = true
  }
}

module.exports = OpenStreetBrowserCategory