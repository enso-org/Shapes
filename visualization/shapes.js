return class ShapesVisualization extends Visualization {
  static inputType = "Any"
  static label = "Shapes"

  constructor(config) {
    super(config);
    this.script = document.createElement('script');
    this.script.src = 'https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.11/paper-full.min.js';
    this.dom.appendChild(this.script);
    this.canvas = document.createElement('canvas');
    this.dom.appendChild(this.canvas);
  }

  onDataReceived(data) {
    this.paper.project.clear();
    this.render(data);
    this.paper.view.draw();
  }

  render(data) {
    if (Array.isArray(data)) {
      return data.map(x => this.render(x));
    } else {
      switch (data.type) {
        case 'Union':
          var shapes = data.items.map(x => this.render(x));
          var result = shapes.reduce((x, y) => x.unite(y));
          shapes.map(x => x.remove());
          return result;
        case 'Subtract':
          var l = this.render(data.left);
          var r = this.render(data.right);
          var result = l.subtract(r);
          l.remove();
          r.remove();
          return result;
        case 'Circle':
          return new this.paper.Path.Circle({
            center: [0,0],
            radius: data.radius,
            strokeColor: "black",
            fillColor: "black"
          });
        case 'Rectangle':
          return new this.paper.Path.Rectangle({
            point: [-data.width/2, -data.height/2],
            size: [data.width, data.height],
            strokeColor: "black",
            fillColor: "black"
          });
        case 'Translate':
          var shape = this.render(data.shape);
          shape.position = shape.position.add([data.tx, data.ty]);
          return shape;
      }
    }
  }

  setSize(size) {
    this.canvas.width = size[0];
    this.canvas.height = size[1];
    this.paper = new paper.PaperScope();
    this.paper.setup(this.canvas);
    this.paper.view.center = [0,0];
  }
}
