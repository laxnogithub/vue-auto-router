class routerHandler {
	constructor(p = {}) {
		this.views = p.views;
		// max level for path
		// 路由最大层级/深度
		this.max = 0;
		this.routes = null;
	}

	/**
	 * @function load
	 * @description load components and add route
	 */
	load() {
		/* 获取每层级为对象的集合 */
		const rotate = this.__rotate();
		/* 层级对象合并形成routes */
		const result = this.__concat(rotate);
		return result;
	}
	/**
	 * @function __concat
	 * @description concat level obj
	 * @param {list} collection
	 */
	__concat(collection) {
		// set parent.children
		/**
		 *由最底层级开始向外层合并，将子级对象并入父级children中
		 */
		const result = collection.reduceRight((old, next) => {
			return next.map((parent) => {
				/**
				 * 过滤出该父级所拥有的自集对象
				 */
				parent.children = old.filter((son) => {
					if (son.parent == parent.path) return true;
				});
				return parent;
			});
		});
		// console.log("result:");
		// console.log(result);
		this.routes = result;
		return result;
	}
	/**
	 * @function __rotate
	 * @description rotate component collection and resolve it to route handle
	 */
	__rotate() {
		let result = [];
		const views_comps = this.__get_views_comps();
		// rotate component collection
		for (let i = 0; i < this.max; i++) {
			const routeObjs = views_comps.map((data) => {
				const paths = data.paths;

				// Skip nonexistent level
				/* i > paths.length 说明此路径不存在对应的层级，直接跳过 */
				if (i > paths.length - 1) return null;

				// check is last level
				/* 是否为数组最后一位，对应最底层级 */
				const is_last = i == paths.length - 1;

				// check is top level
				/* 是否为数组第一位，对应最顶层级 */
				const is_top = i == 0;

				// top path head add /
				/* 顶层路径需要以/开头 */
				const path = is_top ? "/" + paths[i] : paths[i];

				// middle level must have component with name "index.vue"
				/* 若是最底层则直接获取对应组件，若为中间层则对应为index组件 */
				const component = is_last
					? data.comp
					: this.views(this.__getPathByIndex(paths, i)).default;

				// create route handler obj
				const routeObj = {
					path,
					name: component.name,
					component,
					is_top,
					// parent path name
					/* 父级路径名称：满足条件：不是顶层 */
					parent:
						!is_top &&
						(() => {
							const pre = i - 1 == 0 ? "/" : "";
							return pre + paths[i - 1];
						})(),
				};
				return routeObj;
			});
			result[i] = this.__clear(routeObjs);
		}
		// console.log("rotate:");
		// console.log(result);
		result = this.__deleteSame(result);
		return result;
	}
	/**
	 * @function __get_views_comps
	 * @description get component collection
	 */
	__get_views_comps() {
		const result = this.views.keys().map((view) => {
			// component
			const comp = this.views(view).default;
			// component path level list
			const paths = this.__getName(view).split("/");

			this.max = paths.length > this.max ? paths.length : this.max;

			return { paths, comp };
		});
		// console.log("views_comps:");
		// console.log(result);

		return result;
	}
	/**
	 * @function __deleteSame
	 * @description delete same path obj
	 * @param {list} collection
	 */
	__deleteSame(collection) {
		const result = collection.map((level) => {
			const level1 = level;
			// delete same path with same level
			level1.filter((check, i) => {
				level.filter((f, j) => {
					if (check.path == f.path && i != j) delete level1[j];
				});
				return true;
			});
			return this.__clear(level1);
		});
		return result;
	}
	/**
	 * @name __getName
	 * @description get name from views.key
	 * @param {*} str
	 * @param {*} is
	 */
	__getName(str, is = true) {
		let name = str.slice(str.indexOf("/") + 1, str.indexOf(".vue"));
		if (is) name = name.toLowerCase();
		return name;
	}
	/**
	 * @function __getPathByIndex
	 * @description get path in paths by index
	 * @param {*} paths
	 * @param {*} index
	 */
	__getPathByIndex(paths, index) {
		return (
			"." +
			paths.reduce((old, next, i) => {
				if (i <= index) return old + "/" + next;
				return old;
			}, "") +
			"/index.vue"
		);
	}
	/**
	 * @function clear
	 * @description array list with null or undefined
	 * @param {*} arr
	 */
	__clear(arr) {
		return arr.filter((o) => {
			if (o && o.path) return true;
		});
	}
}
module.exports = routerHandler;
