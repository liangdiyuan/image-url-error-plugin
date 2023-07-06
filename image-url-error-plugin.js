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

  addOnErrorFunc(contents, newStr) {
    let start = contents.match(/<img\s+.*\s*/i);
    if (start) {
      let first = contents.substring(0, start.index);
      let last = contents.substring(start.index);
      let end = last.match(/\s*(\/?)>/);
      let target = "";
      if (end) {
        target = last.substring(0, end.index);
      }

      console.log(target);

      if (target.indexOf("onerror") < 0) {
        target += ` onerror="this.src='${this.imageUrl}'" `;
      }

      let imgStr = first + target;
      return this.addOnErrorFunc(
        last.substr(end.index),
        newStr ? newStr + imgStr : imgStr
      );
    } else {
      return newStr ? newStr + contents : contents;
    }
  }
}

module.exports = ImageUrlErrorPlugin;
