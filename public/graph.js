class Graph {
	constructor(w, h)  {
		this.width = w;
		this.height = h;
		this.nodes = this.width * this.height;
		this.edges = new Array(this.nodes + 2);
		this.dist = new Array(this.nodes + 2).fill(100000000);
	}

	getEdges(v) {
		return this.edges[v];
	}

	createEdge(from, to, contrast) {
		return ({from: from, to: to, weight: contrast});
	}
	
	getContrast(c1, c2) {
		let vector = create3dVector(c1.x - c2.x, c1.y - c2.y, c1.z - c2.z);
		let distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
		return distance;
	} 
}