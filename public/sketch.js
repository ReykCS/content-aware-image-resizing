let img;
function preload() {
  img = loadImage('assets/100x100.jpg');
}
let width;
let height;

let startBtn;
let saveBtn;

let endImage;
let cnv;

function setup() {
  //console.log(img);
  input  = createFileInput(handleFile);
  input.parent(document.getElementById('inputContainer'));
  cnv = createCanvas(0,0);
  cnv.parent(document.getElementById('canvasHolder'));
  // width = img.width;
  // height = img.height;
  // createCanvas(width, height);
  // image(img, 0, 0);

  // const start = {
  //   width: width,
  //   height: height
  // };
  // const end = {
  //   width: 3 * Math.floor(width / 4 ),
  //   height: 3 * Math.floor(height / 4 )
  // }
  // console.log(start, end);
  // contentAware = new ContentAwareImageResizing(img, start, end, true);
}

// function draw() {
//   image(img, 0, 0);
//   contentAware.run();
//   noLoop();
// }

function startContentAware()  {
  if ( img )  {
    startBtn.remove();
    width = img.width;
    height = img.height;
    cnv = createCanvas(width, height);
    cnv.parent(document.getElementById('canvasHolder'));
    image(img, 0, 0);

    const start = {
      width: width,
      height: height
    };
    const end = {
      width: 3 * Math.floor(width / 4 ),
      height: 3 * Math.floor(height / 4 )
    }
    console.log(start, end);
    let contentAware = new ContentAwareImageResizing(img , start, end, true);

    endImage = contentAware.run();

    saveBtn = createButton('save image');
    saveBtn.parent(document.getElementById('buttonHolder'));

    saveBtn.mousePressed(downloadImage);
  }
}

function downloadImage()  {
  if ( endImage ) endImage.save('resizedImage', 'png');
}


class ContentAwareImageResizing {
  constructor(img, start, end, skt) {
    this.start = start;
    this.actual = start;
    this.end = end;
    this.img = img;
    this.graph;
    this.mode = -1;
    this.draw = skt ? skt : false; 
    console.log(this.img);
  }

  // initHorizontal()  {
  //   this.graph = new Graph(this.actual.width, this.actual.height);
  //   this.graph.createHorizontalImage(this.img);
  //   this.mode = 1;  
  // }

  // runHorizontal() {
  //   this.initHorizontal();
  //   let a = 0;
  //   while ( this.actual.height >= this.end.height && a < 2) {
  //     console.log(this.actual.height, this.end.height);
  //     this.step();
  //     a++;
  //   }
  // }

  initHorizontal()  {
    this.graph = new HorizontalGraph(this.actual.width, this.actual.height);
    this.graph.createGraphImage(this.img);
  }

  initVertical()  {
    this.graph = new VerticalGraph(this.actual.width, this.actual.height);
    this.graph.createGraphImage(this.img);
    this.mode = 2;
  }

  runVertical() {
    this.initVertical();
    while ( this.actual.width > this.end.width )  {
      this.step();
    }
  }

  runHorizontal() {
    this.initHorizontal();
    while ( this.actual.height > this.end.height ) {
      this.step();
    }
  }

  run() {
    this.runHorizontal();
    this.runVertical();

    return this.img;
  }

  step() {
    this.graph.createGraph();

    let sorting = new ShortestPathTree(this.graph);
    let path = sorting.pathTo(this.graph.nodes + 1);

    let data = this.graph.removePath(path);
    this.actual = data.dimension;
    this.img = data.img;
    if ( this.draw == true ) {
      //background(0);
      image(data.img, 0, 0);
    }
  }

  // removePath(path)  {
  //   if ( this.mode == -1 )  return null;
  //   else if ( this.mode == 1 ) return this.graph.removeHorizontalPath(path);
  //   else if ( this.mode == 2 ) return this.graph.removeVerticalPath(path);
  // }
}

class Topological {
  constructor(graph)  {
    this.marked = new Array(graph.nodes + 2).fill(false);
    this.graph = graph;
    this.postOrder = [];
    
  }

  dfs(node)  {
    this.marked[node] = true;
    let edges = this.graph.getEdges(node);
    for ( let i of edges )  {
      
      let w = i.to;
      if ( ! this.marked[w] ) {
        this.dfs(w);
      }
    }
    this.postOrder.push(node);
  }

  order() {
    return this.postOrder;
  }
}

class ShortestPathTree {
  constructor(graph)  {
    this.dist = new Array(graph.nodes + 2).fill(100000000);
    this.parent = new Array(graph.nodes + 2);
    this.dist[graph.nodes] = 0;
    this.graph = graph;
    this.start = graph.nodes;
    let topo = new Topological(graph);
    topo.dfs(graph.nodes);
    this.order = topo.order().reverse();
    for ( let node of this.order) {
      for ( let edge of graph.getEdges(node) )  {
        this.relax(edge);
      }
    }
  }

  relax(edge) {
    let v = edge.from;
    let w = edge.to;
    if ( this.dist[w] >= this.dist[v] + edge.weight )  {
      this.parent[w] = v;
      this.dist[w] = this.dist[v] + edge.weight;
    }
  }

  parent()  {
    return this.parent;
  }

  hasPathTo(node) {
    return this.parent[node] >= 0;
  }

  pathTo(node)  {
    if ( ! this.hasPathTo(node) ) return null;

    let path = [];
    for ( let i = node; i != this.start; i = this.parent[i])  {
      path.push(i);
    }
    path.push(this.start);
    return path;
  }
}

class MarkVerticalPath {
  constructor(path, width, height)  {
    this.height = height;
    for ( let i = 1; i < path.length - 1; i++)  {
      let coordinates = this.getCoordinatesFromIndex(path[i]);
      stroke(color(255,0,0));
      point(coordinates.x, coordinates.y);
    }
  }

  getCoordinatesFromIndex(index)  {
    return {x : Math.floor(index / this.height), y: index % this.height};
  }
}

class MarkPath {
  constructor(path, width, height) {
    this.width = width;
    for ( let i = 1; i < path.length - 1; i++)  {
      let coordinates = this.getCoordinatesFromIndex(path[i]);
      stroke(color(255,0,0));
      point(coordinates.x, coordinates.y);
    }
  }

  getCoordinatesFromIndex(index)  {
    return {x: index % this.width, y: Math.floor(index / this.width)};
  }
}

function createEdge(from, to, contrast) {
  return ({from: from, to: to, weight: contrast});

}

function getContrast(c1, c2) {

  let vector = create3dVector(c1.x - c2.x, c1.y - c2.y, c1.z - c2.z);
  let distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  return distance;
} 



function create3dVector(x, y, z)  {
  return { x: x, y: y, z: z};
}

function handleFile(file) {
  if (file.type === 'image') {
    if ( saveBtn ) saveBtn.remove();
    img = loadImage(file.data);
    cnv.image(img, 0, 0);
    //img.hide();
    startBtn = createButton('Start');
    startBtn.parent(document.getElementById('buttonHolder'));
    //console.log(img);
    startBtn.mousePressed(startContentAware);
  } else {
    img = null;
  }
}