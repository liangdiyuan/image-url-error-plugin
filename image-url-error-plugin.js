class ImageUrlErrorPlugin {
  constructor(option) {
    this.imageUrl = option.imageUrl;
  }
  apply(compiler) {
    console.log("ImageUrlErrorPlugin 启动");
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
    console.log(start)
    if (start) {
      let first = contents.substring(0, start.index);
      let sliceStr = contents.substr(start.index);
      let end = sliceStr.match(/\s*(\/?)>/);
      let content = "";
      if (end) {
        content = sliceStr.substr(0, end.index);
      }

      if (content.indexOf("onerror") < 0) {
        content += ` onerror="this.src='${this.imageUrl}'" `;
      }

      let imgStr = first + content;
      return this.addOnErrorFunc(
        sliceStr.substr(end.index),
        newStr ? newStr + imgStr : imgStr
      );
    } else {
      return newStr ? newStr + contents : contents;
    }
  }
}

module.exports = ImageUrlErrorPlugin;
