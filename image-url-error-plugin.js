class ImageUrlErrorPlugin {
  constructor(option) {
    this.imageUrl = option.imageUrl;
  }
  apply(compiler) {
    console.log("ImageUrlErrorPlugin 启动");
    // 在资源输出到目标目录之前触发emit
    compiler.hooks.emit.tap("ImageUrlErrorPlugin", (compilation) => {
      const { assets } = compilation;
      for (const name in assets) {
        if (assets.hasOwnProperty(name) && name.endsWith(".html")) {
          const contents = assets[name].source();
          const noComments = this.addOnErrorFunc(contents);
          compilation.assets[name] = {
            source: () => noComments,
            size: () => noComments.length,
          };
        }
      }
    });
  }

  addOnErrorFunc(contents, newContents = "") {
    // 检测是否有<img/> 标签
    const start = contents.match(/<img\s+.*\s*/i);
    if (start) {
      const first = contents.substring(0, start.index);
      const last = contents.substring(start.index);
      const end = last.match(/\s*(\/?)>/);
      let target = "";
      if (end) {
        target = last.substring(0, end.index);
      }

      // 判断如何没有写错误处理函数，则自动加上错误处理函数
      if (!/\s+onerror\s*=/.test(target)) {
        target += ` onerror="this.src='${this.imageUrl}'" `;
      }
      newContents = newContents + first + target;
      return this.addOnErrorFunc(last.substring(end.index), newContents);
    } else {
      return newContents ? newContents + contents : contents;
    }
  }
}

module.exports = ImageUrlErrorPlugin;
