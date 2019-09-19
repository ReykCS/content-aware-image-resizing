class HorizontalGraph extends Graph {
	constructor(width, height)  {
		super(width, height);
	}

	createGraphImage(img)   {
		this.image = new Array(this.width);
		img.loadPixels();
		for (let i = 0; i < this.width; i++)  {
			this.image[i] = new Array(this.height);
			for (let j = 0; j < this.height; j++) {
				let index = 4 * (j * this.width + i);
				this.image[i][j] = create3dVector(img.pixels[index], img.pixels[index + 1], img.pixels[index + 2]);
			}
		}
	}

	createGraph()	{
		this.edges = new Array(this.nodes + 2);
		for ( let i = 0; i < this.width - 1; i++)	{
			for ( let j = 0; j < this.height; j++)	{
				let index = this.getIndexFromCoordinates(i, j);
				this.edges[index] = [];
				this.edges[index].push(this.createEdge(index, index + 1, this.contrast(index, index + 1)));
				if ( index >= this.width ) this.edges[index].push(this.createEdge(index, index + 1 - this.width, this.contrast(index, index + 1 - this.width)));
				if ( index < (this.nodes - this.width)) this.edges[index].push(this.createEdge(index, index + 1 + this.width, this.contrast(index, index + 1 + this.width)));
			}
		}
		this.edges[this.nodes] = [];
		for ( let i = 1; i <= this.height; i++)	{
			let index = i * this.width - 1;
			this.edges[index] = [];
			this.edges[index].push(this.createEdge(index, this.nodes + 1, 0));
			index = (i - 1) * this.width;
			this.edges[this.nodes].push(this.createEdge(this.nodes, index, 0));
		}
		this.edges[this.nodes + 1] = [];
	}

	removePath(path)	{
		path = path.slice(1, path.length - 1).reverse();
		//console.log(path);
		for ( let i = 0; i < path.length; i++)	{
			let index = Math.floor(path[i] / this.width);
			this.image[i].splice(index, 1);
		}
		this.height--;
		this.nodes -= this.width;
		let newImage = createImage(this.width, this.height);
		for ( let i = 0; i < this.width; i++)	{
			for ( let j = 0; j < this.height; j++)	{
				let col = this.image[i][j];
				newImage.set(i, j, color(col.x, col.y, col.z));
			}
		}
		newImage.updatePixels();
		const ret = {
			dimension: {
				width: this.width,
				height: this.height
			},
			img: newImage
		};
		return ret;
		//console.log(this.image);
	}

	contrast(from, to)  {
    let first = this.getNodeFromIndex(from);
    let second = this.getNodeFromIndex(to);
    return this.getContrast(first, second);
	}
	
	getNodeFromIndex(index)	{
		return this.image[index % this.width][Math.floor(index / this.width)];
	}
	
	getIndexFromCoordinates(x, y)	{
		return y * this.width + x;
	}
}