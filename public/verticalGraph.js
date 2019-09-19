class VerticalGraph extends Graph {
  constructor(width, height) {
    super(width, height);
  }

  createGraphImage(img) {
    this.image = new Array(this.height);
    img.loadPixels();
    for (let i = 0; i < this.height; i++) {
      this.image[i] = new Array(this.width);
      for ( let j = 0; j < this.width; j++)  {
        let index = 4 * (i * this.width + j);
        this.image[i][j] = create3dVector(img.pixels[index], img.pixels[index + 1], img.pixels[index + 2]);
      }
    }
  }

  createGraph() {
    this.edges = new Array(this.nodes + 2);
    for ( let i = 0; i < this.nodes - this.width; i++) {
      this.edges[i] = [];
      this.edges[i].push(this.createEdge(i, i + this.width, this.contrast(i, i + this.width)));
      if ( i % this.width != 0 ) this.edges[i].push(this.createEdge(i, i + this.width - 1, this.contrast(i, i + this.width - 1)));
      if ( i % this.width != (this.width - 1) ) this.edges[i].push(this.createEdge(i, i + this.width + 1, this.contrast(i, i + this.width + 1)));
    }
    this.edges[this.nodes] = [];
    for ( let i = 0; i < this.width; i++) {
      this.edges[this.nodes].push(this.createEdge(this.nodes, i, 0));
      this.edges[this.nodes - 1 - i] = [];
      this.edges[this.nodes - 1 - i].push(this.createEdge(this.nodes - 1 - i, this.nodes + 1, 0));
    }
    this.edges[this.nodes + 1] = [];
  }

  contrast(from, to)  {
    let first = this.getNodeFromIndex(from);
    let second = this.getNodeFromIndex(to);
    return this.getContrast(first, second);
  }

  removePath(path)  {
    path = path.slice(1, path.length - 1);
    for ( let i = path.length - 1; i > 0; i--)  {
      let x = path[i] % this.width;
      this.image[path.length - i - 1].splice(x, 1);
    }
    this.width = this.width - 1;
    this.nodes = this.nodes - this.height;
    let newImg = createImage(this.width, this.height);
    newImg.loadPixels();
    for ( let i = 0; i < this.height; i++) {
      for ( let j = 0; j < this.width; j++) {
        let col = this.image[i][j];
        newImg.set(j, i, color(col.x, col.y, col.z));
      }
    }
    newImg.updatePixels();
    const ret = {
      dimension: {
        width: this.width,
        height: this.height
      },
      img: newImg
    };
    return ret;
  }

  getNodeFromIndex(index) {
    return  this.image[Math.floor(index / this.width)][index % this.width];
  }

  getIndex(x, y)  {
    return y * this.width + x;
  }
}