window.__ModuleLoader__.load({ id: "dsh-annotate-viewport", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// node_modules/html-to-image/lib/util.js
var require_util = __commonJS({
  "node_modules/html-to-image/lib/util.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isInstanceOfElement = exports2.nodeToDataURL = exports2.svgToDataURL = exports2.createImage = exports2.canvasToBlob = exports2.checkCanvasDimensions = exports2.getPixelRatio = exports2.getImageSize = exports2.getStyleProperties = exports2.toArray = exports2.delay = exports2.uuid = exports2.resolveUrl = void 0;
    function resolveUrl(url, baseUrl) {
      if (url.match(/^[a-z]+:\/\//i)) {
        return url;
      }
      if (url.match(/^\/\//)) {
        return window.location.protocol + url;
      }
      if (url.match(/^[a-z]+:/i)) {
        return url;
      }
      var doc = document.implementation.createHTMLDocument();
      var base = doc.createElement("base");
      var a = doc.createElement("a");
      doc.head.appendChild(base);
      doc.body.appendChild(a);
      if (baseUrl) {
        base.href = baseUrl;
      }
      a.href = url;
      return a.href;
    }
    exports2.resolveUrl = resolveUrl;
    exports2.uuid = /* @__PURE__ */ (function() {
      var counter = 0;
      var random = function() {
        return "0000".concat((Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
      };
      return function() {
        counter += 1;
        return "u".concat(random()).concat(counter);
      };
    })();
    function delay(ms) {
      return function(args) {
        return new Promise(function(resolve) {
          setTimeout(function() {
            return resolve(args);
          }, ms);
        });
      };
    }
    exports2.delay = delay;
    function toArray(arrayLike) {
      var arr = [];
      for (var i = 0, l = arrayLike.length; i < l; i++) {
        arr.push(arrayLike[i]);
      }
      return arr;
    }
    exports2.toArray = toArray;
    var styleProps = null;
    function getStyleProperties(options) {
      if (options === void 0) {
        options = {};
      }
      if (styleProps) {
        return styleProps;
      }
      if (options.includeStyleProperties) {
        styleProps = options.includeStyleProperties;
        return styleProps;
      }
      styleProps = toArray(window.getComputedStyle(document.documentElement));
      return styleProps;
    }
    exports2.getStyleProperties = getStyleProperties;
    function px(node, styleProperty) {
      var win = node.ownerDocument.defaultView || window;
      var val = win.getComputedStyle(node).getPropertyValue(styleProperty);
      return val ? parseFloat(val.replace("px", "")) : 0;
    }
    function getNodeWidth(node) {
      var leftBorder = px(node, "border-left-width");
      var rightBorder = px(node, "border-right-width");
      return node.clientWidth + leftBorder + rightBorder;
    }
    function getNodeHeight(node) {
      var topBorder = px(node, "border-top-width");
      var bottomBorder = px(node, "border-bottom-width");
      return node.clientHeight + topBorder + bottomBorder;
    }
    function getImageSize(targetNode, options) {
      if (options === void 0) {
        options = {};
      }
      var width = options.width || getNodeWidth(targetNode);
      var height = options.height || getNodeHeight(targetNode);
      return { width, height };
    }
    exports2.getImageSize = getImageSize;
    function getPixelRatio() {
      var ratio;
      var FINAL_PROCESS;
      try {
        FINAL_PROCESS = process;
      } catch (e) {
      }
      var val = FINAL_PROCESS && FINAL_PROCESS.env ? FINAL_PROCESS.env.devicePixelRatio : null;
      if (val) {
        ratio = parseInt(val, 10);
        if (Number.isNaN(ratio)) {
          ratio = 1;
        }
      }
      return ratio || window.devicePixelRatio || 1;
    }
    exports2.getPixelRatio = getPixelRatio;
    var canvasDimensionLimit = 16384;
    function checkCanvasDimensions(canvas) {
      if (canvas.width > canvasDimensionLimit || canvas.height > canvasDimensionLimit) {
        if (canvas.width > canvasDimensionLimit && canvas.height > canvasDimensionLimit) {
          if (canvas.width > canvas.height) {
            canvas.height *= canvasDimensionLimit / canvas.width;
            canvas.width = canvasDimensionLimit;
          } else {
            canvas.width *= canvasDimensionLimit / canvas.height;
            canvas.height = canvasDimensionLimit;
          }
        } else if (canvas.width > canvasDimensionLimit) {
          canvas.height *= canvasDimensionLimit / canvas.width;
          canvas.width = canvasDimensionLimit;
        } else {
          canvas.width *= canvasDimensionLimit / canvas.height;
          canvas.height = canvasDimensionLimit;
        }
      }
    }
    exports2.checkCanvasDimensions = checkCanvasDimensions;
    function canvasToBlob(canvas, options) {
      if (options === void 0) {
        options = {};
      }
      if (canvas.toBlob) {
        return new Promise(function(resolve) {
          canvas.toBlob(resolve, options.type ? options.type : "image/png", options.quality ? options.quality : 1);
        });
      }
      return new Promise(function(resolve) {
        var binaryString = window.atob(canvas.toDataURL(options.type ? options.type : void 0, options.quality ? options.quality : void 0).split(",")[1]);
        var len = binaryString.length;
        var binaryArray = new Uint8Array(len);
        for (var i = 0; i < len; i += 1) {
          binaryArray[i] = binaryString.charCodeAt(i);
        }
        resolve(new Blob([binaryArray], {
          type: options.type ? options.type : "image/png"
        }));
      });
    }
    exports2.canvasToBlob = canvasToBlob;
    function createImage(url) {
      return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function() {
          img.decode().then(function() {
            requestAnimationFrame(function() {
              return resolve(img);
            });
          });
        };
        img.onerror = reject;
        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.src = url;
      });
    }
    exports2.createImage = createImage;
    function svgToDataURL(svg) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, Promise.resolve().then(function() {
            return new XMLSerializer().serializeToString(svg);
          }).then(encodeURIComponent).then(function(html) {
            return "data:image/svg+xml;charset=utf-8,".concat(html);
          })];
        });
      });
    }
    exports2.svgToDataURL = svgToDataURL;
    function nodeToDataURL(node, width, height) {
      return __awaiter(this, void 0, void 0, function() {
        var xmlns, svg, foreignObject;
        return __generator(this, function(_a) {
          xmlns = "http://www.w3.org/2000/svg";
          svg = document.createElementNS(xmlns, "svg");
          foreignObject = document.createElementNS(xmlns, "foreignObject");
          svg.setAttribute("width", "".concat(width));
          svg.setAttribute("height", "".concat(height));
          svg.setAttribute("viewBox", "0 0 ".concat(width, " ").concat(height));
          foreignObject.setAttribute("width", "100%");
          foreignObject.setAttribute("height", "100%");
          foreignObject.setAttribute("x", "0");
          foreignObject.setAttribute("y", "0");
          foreignObject.setAttribute("externalResourcesRequired", "true");
          svg.appendChild(foreignObject);
          foreignObject.appendChild(node);
          return [2, svgToDataURL(svg)];
        });
      });
    }
    exports2.nodeToDataURL = nodeToDataURL;
    var isInstanceOfElement = function(node, instance) {
      if (node instanceof instance)
        return true;
      var nodePrototype = Object.getPrototypeOf(node);
      if (nodePrototype === null)
        return false;
      return nodePrototype.constructor.name === instance.name || (0, exports2.isInstanceOfElement)(nodePrototype, instance);
    };
    exports2.isInstanceOfElement = isInstanceOfElement;
  }
});

// node_modules/html-to-image/lib/clone-pseudos.js
var require_clone_pseudos = __commonJS({
  "node_modules/html-to-image/lib/clone-pseudos.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.clonePseudoElements = void 0;
    var util_1 = require_util();
    function formatCSSText(style) {
      var content = style.getPropertyValue("content");
      return "".concat(style.cssText, " content: '").concat(content.replace(/'|"/g, ""), "';");
    }
    function formatCSSProperties(style, options) {
      return (0, util_1.getStyleProperties)(options).map(function(name) {
        var value = style.getPropertyValue(name);
        var priority = style.getPropertyPriority(name);
        return "".concat(name, ": ").concat(value).concat(priority ? " !important" : "", ";");
      }).join(" ");
    }
    function getPseudoElementStyle(className, pseudo, style, options) {
      var selector = ".".concat(className, ":").concat(pseudo);
      var cssText = style.cssText ? formatCSSText(style) : formatCSSProperties(style, options);
      return document.createTextNode("".concat(selector, "{").concat(cssText, "}"));
    }
    function clonePseudoElement(nativeNode, clonedNode, pseudo, options) {
      var style = window.getComputedStyle(nativeNode, pseudo);
      var content = style.getPropertyValue("content");
      if (content === "" || content === "none") {
        return;
      }
      var className = (0, util_1.uuid)();
      try {
        clonedNode.className = "".concat(clonedNode.className, " ").concat(className);
      } catch (err) {
        return;
      }
      var styleElement = document.createElement("style");
      styleElement.appendChild(getPseudoElementStyle(className, pseudo, style, options));
      clonedNode.appendChild(styleElement);
    }
    function clonePseudoElements(nativeNode, clonedNode, options) {
      clonePseudoElement(nativeNode, clonedNode, ":before", options);
      clonePseudoElement(nativeNode, clonedNode, ":after", options);
    }
    exports2.clonePseudoElements = clonePseudoElements;
  }
});

// node_modules/html-to-image/lib/mimes.js
var require_mimes = __commonJS({
  "node_modules/html-to-image/lib/mimes.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getMimeType = void 0;
    var WOFF = "application/font-woff";
    var JPEG = "image/jpeg";
    var mimes = {
      woff: WOFF,
      woff2: WOFF,
      ttf: "application/font-truetype",
      eot: "application/vnd.ms-fontobject",
      png: "image/png",
      jpg: JPEG,
      jpeg: JPEG,
      gif: "image/gif",
      tiff: "image/tiff",
      svg: "image/svg+xml",
      webp: "image/webp"
    };
    function getExtension(url) {
      var match = /\.([^./]*?)$/g.exec(url);
      return match ? match[1] : "";
    }
    function getMimeType(url) {
      var extension = getExtension(url).toLowerCase();
      return mimes[extension] || "";
    }
    exports2.getMimeType = getMimeType;
  }
});

// node_modules/html-to-image/lib/dataurl.js
var require_dataurl = __commonJS({
  "node_modules/html-to-image/lib/dataurl.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resourceToDataURL = exports2.fetchAsDataURL = exports2.makeDataUrl = exports2.isDataUrl = void 0;
    function getContentFromDataUrl(dataURL) {
      return dataURL.split(/,/)[1];
    }
    function isDataUrl(url) {
      return url.search(/^(data:)/) !== -1;
    }
    exports2.isDataUrl = isDataUrl;
    function makeDataUrl(content, mimeType) {
      return "data:".concat(mimeType, ";base64,").concat(content);
    }
    exports2.makeDataUrl = makeDataUrl;
    function fetchAsDataURL(url, init, process2) {
      return __awaiter(this, void 0, void 0, function() {
        var res, blob;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, fetch(url, init)];
            case 1:
              res = _a.sent();
              if (res.status === 404) {
                throw new Error('Resource "'.concat(res.url, '" not found'));
              }
              return [4, res.blob()];
            case 2:
              blob = _a.sent();
              return [2, new Promise(function(resolve, reject) {
                var reader = new FileReader();
                reader.onerror = reject;
                reader.onloadend = function() {
                  try {
                    resolve(process2({ res, result: reader.result }));
                  } catch (error) {
                    reject(error);
                  }
                };
                reader.readAsDataURL(blob);
              })];
          }
        });
      });
    }
    exports2.fetchAsDataURL = fetchAsDataURL;
    var cache = {};
    function getCacheKey(url, contentType, includeQueryParams) {
      var key = url.replace(/\?.*/, "");
      if (includeQueryParams) {
        key = url;
      }
      if (/ttf|otf|eot|woff2?/i.test(key)) {
        key = key.replace(/.*\//, "");
      }
      return contentType ? "[".concat(contentType, "]").concat(key) : key;
    }
    function resourceToDataURL(resourceUrl, contentType, options) {
      return __awaiter(this, void 0, void 0, function() {
        var cacheKey, dataURL, content, error_1, msg;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
              if (cache[cacheKey] != null) {
                return [2, cache[cacheKey]];
              }
              if (options.cacheBust) {
                resourceUrl += (/\?/.test(resourceUrl) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime();
              }
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4, fetchAsDataURL(resourceUrl, options.fetchRequestInit, function(_a2) {
                var res = _a2.res, result = _a2.result;
                if (!contentType) {
                  contentType = res.headers.get("Content-Type") || "";
                }
                return getContentFromDataUrl(result);
              })];
            case 2:
              content = _a.sent();
              dataURL = makeDataUrl(content, contentType);
              return [3, 4];
            case 3:
              error_1 = _a.sent();
              dataURL = options.imagePlaceholder || "";
              msg = "Failed to fetch resource: ".concat(resourceUrl);
              if (error_1) {
                msg = typeof error_1 === "string" ? error_1 : error_1.message;
              }
              if (msg) {
                console.warn(msg);
              }
              return [3, 4];
            case 4:
              cache[cacheKey] = dataURL;
              return [2, dataURL];
          }
        });
      });
    }
    exports2.resourceToDataURL = resourceToDataURL;
  }
});

// node_modules/html-to-image/lib/clone-node.js
var require_clone_node = __commonJS({
  "node_modules/html-to-image/lib/clone-node.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.cloneNode = void 0;
    var clone_pseudos_1 = require_clone_pseudos();
    var util_1 = require_util();
    var mimes_1 = require_mimes();
    var dataurl_1 = require_dataurl();
    function cloneCanvasElement(canvas) {
      return __awaiter(this, void 0, void 0, function() {
        var dataURL;
        return __generator(this, function(_a) {
          dataURL = canvas.toDataURL();
          if (dataURL === "data:,") {
            return [2, canvas.cloneNode(false)];
          }
          return [2, (0, util_1.createImage)(dataURL)];
        });
      });
    }
    function cloneVideoElement(video, options) {
      return __awaiter(this, void 0, void 0, function() {
        var canvas, ctx, dataURL_1, poster, contentType, dataURL;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (video.currentSrc) {
                canvas = document.createElement("canvas");
                ctx = canvas.getContext("2d");
                canvas.width = video.clientWidth;
                canvas.height = video.clientHeight;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                dataURL_1 = canvas.toDataURL();
                return [2, (0, util_1.createImage)(dataURL_1)];
              }
              poster = video.poster;
              contentType = (0, mimes_1.getMimeType)(poster);
              return [4, (0, dataurl_1.resourceToDataURL)(poster, contentType, options)];
            case 1:
              dataURL = _a.sent();
              return [2, (0, util_1.createImage)(dataURL)];
          }
        });
      });
    }
    function cloneIFrameElement(iframe, options) {
      var _a;
      return __awaiter(this, void 0, void 0, function() {
        var _b;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              _c.trys.push([0, 3, , 4]);
              if (!((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) return [3, 2];
              return [4, cloneNode(iframe.contentDocument.body, options, true)];
            case 1:
              return [2, _c.sent()];
            case 2:
              return [3, 4];
            case 3:
              _b = _c.sent();
              return [3, 4];
            case 4:
              return [2, iframe.cloneNode(false)];
          }
        });
      });
    }
    function cloneSingleNode(node, options) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          if ((0, util_1.isInstanceOfElement)(node, HTMLCanvasElement)) {
            return [2, cloneCanvasElement(node)];
          }
          if ((0, util_1.isInstanceOfElement)(node, HTMLVideoElement)) {
            return [2, cloneVideoElement(node, options)];
          }
          if ((0, util_1.isInstanceOfElement)(node, HTMLIFrameElement)) {
            return [2, cloneIFrameElement(node, options)];
          }
          return [2, node.cloneNode(isSVGElement(node))];
        });
      });
    }
    var isSlotElement = function(node) {
      return node.tagName != null && node.tagName.toUpperCase() === "SLOT";
    };
    var isSVGElement = function(node) {
      return node.tagName != null && node.tagName.toUpperCase() === "SVG";
    };
    function cloneChildren(nativeNode, clonedNode, options) {
      var _a, _b;
      return __awaiter(this, void 0, void 0, function() {
        var children;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              if (isSVGElement(clonedNode)) {
                return [2, clonedNode];
              }
              children = [];
              if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
                children = (0, util_1.toArray)(nativeNode.assignedNodes());
              } else if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLIFrameElement) && ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
                children = (0, util_1.toArray)(nativeNode.contentDocument.body.childNodes);
              } else {
                children = (0, util_1.toArray)(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
              }
              if (children.length === 0 || (0, util_1.isInstanceOfElement)(nativeNode, HTMLVideoElement)) {
                return [2, clonedNode];
              }
              return [4, children.reduce(function(deferred, child) {
                return deferred.then(function() {
                  return cloneNode(child, options);
                }).then(function(clonedChild) {
                  if (clonedChild) {
                    clonedNode.appendChild(clonedChild);
                  }
                });
              }, Promise.resolve())];
            case 1:
              _c.sent();
              return [2, clonedNode];
          }
        });
      });
    }
    function cloneCSSStyle(nativeNode, clonedNode, options) {
      var targetStyle = clonedNode.style;
      if (!targetStyle) {
        return;
      }
      var sourceStyle = window.getComputedStyle(nativeNode);
      if (sourceStyle.cssText) {
        targetStyle.cssText = sourceStyle.cssText;
        targetStyle.transformOrigin = sourceStyle.transformOrigin;
      } else {
        (0, util_1.getStyleProperties)(options).forEach(function(name) {
          var value = sourceStyle.getPropertyValue(name);
          if (name === "font-size" && value.endsWith("px")) {
            var reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
            value = "".concat(reducedFont, "px");
          }
          if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLIFrameElement) && name === "display" && value === "inline") {
            value = "block";
          }
          if (name === "d" && clonedNode.getAttribute("d")) {
            value = "path(".concat(clonedNode.getAttribute("d"), ")");
          }
          targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
        });
      }
    }
    function cloneInputValue(nativeNode, clonedNode) {
      if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLTextAreaElement)) {
        clonedNode.innerHTML = nativeNode.value;
      }
      if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLInputElement)) {
        clonedNode.setAttribute("value", nativeNode.value);
      }
    }
    function cloneSelectValue(nativeNode, clonedNode) {
      if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLSelectElement)) {
        var clonedSelect = clonedNode;
        var selectedOption = Array.from(clonedSelect.children).find(function(child) {
          return nativeNode.value === child.getAttribute("value");
        });
        if (selectedOption) {
          selectedOption.setAttribute("selected", "");
        }
      }
    }
    function decorate(nativeNode, clonedNode, options) {
      if ((0, util_1.isInstanceOfElement)(clonedNode, Element)) {
        cloneCSSStyle(nativeNode, clonedNode, options);
        (0, clone_pseudos_1.clonePseudoElements)(nativeNode, clonedNode, options);
        cloneInputValue(nativeNode, clonedNode);
        cloneSelectValue(nativeNode, clonedNode);
      }
      return clonedNode;
    }
    function ensureSVGSymbols(clone, options) {
      return __awaiter(this, void 0, void 0, function() {
        var uses, processedDefs, i, use, id, exist, definition, _a, _b, nodes, ns, svg, defs, i;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              uses = clone.querySelectorAll ? clone.querySelectorAll("use") : [];
              if (uses.length === 0) {
                return [2, clone];
              }
              processedDefs = {};
              i = 0;
              _c.label = 1;
            case 1:
              if (!(i < uses.length)) return [3, 4];
              use = uses[i];
              id = use.getAttribute("xlink:href");
              if (!id) return [3, 3];
              exist = clone.querySelector(id);
              definition = document.querySelector(id);
              if (!(!exist && definition && !processedDefs[id])) return [3, 3];
              _a = processedDefs;
              _b = id;
              return [4, cloneNode(definition, options, true)];
            case 2:
              _a[_b] = _c.sent();
              _c.label = 3;
            case 3:
              i++;
              return [3, 1];
            case 4:
              nodes = Object.values(processedDefs);
              if (nodes.length) {
                ns = "http://www.w3.org/1999/xhtml";
                svg = document.createElementNS(ns, "svg");
                svg.setAttribute("xmlns", ns);
                svg.style.position = "absolute";
                svg.style.width = "0";
                svg.style.height = "0";
                svg.style.overflow = "hidden";
                svg.style.display = "none";
                defs = document.createElementNS(ns, "defs");
                svg.appendChild(defs);
                for (i = 0; i < nodes.length; i++) {
                  defs.appendChild(nodes[i]);
                }
                clone.appendChild(svg);
              }
              return [2, clone];
          }
        });
      });
    }
    function cloneNode(node, options, isRoot) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          if (!isRoot && options.filter && !options.filter(node)) {
            return [2, null];
          }
          return [2, Promise.resolve(node).then(function(clonedNode) {
            return cloneSingleNode(clonedNode, options);
          }).then(function(clonedNode) {
            return cloneChildren(node, clonedNode, options);
          }).then(function(clonedNode) {
            return decorate(node, clonedNode, options);
          }).then(function(clonedNode) {
            return ensureSVGSymbols(clonedNode, options);
          })];
        });
      });
    }
    exports2.cloneNode = cloneNode;
  }
});

// node_modules/html-to-image/lib/embed-resources.js
var require_embed_resources = __commonJS({
  "node_modules/html-to-image/lib/embed-resources.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.embedResources = exports2.shouldEmbed = exports2.embed = exports2.parseURLs = void 0;
    var util_1 = require_util();
    var mimes_1 = require_mimes();
    var dataurl_1 = require_dataurl();
    var URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
    var URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
    var FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
    function toRegex(url) {
      var escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
      return new RegExp(`(url\\(['"]?)(`.concat(escaped, `)(['"]?\\))`), "g");
    }
    function parseURLs(cssText) {
      var urls = [];
      cssText.replace(URL_REGEX, function(raw, quotation, url) {
        urls.push(url);
        return raw;
      });
      return urls.filter(function(url) {
        return !(0, dataurl_1.isDataUrl)(url);
      });
    }
    exports2.parseURLs = parseURLs;
    function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
      return __awaiter(this, void 0, void 0, function() {
        var resolvedURL, contentType, dataURL, content, error_1;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 5, , 6]);
              resolvedURL = baseURL ? (0, util_1.resolveUrl)(resourceURL, baseURL) : resourceURL;
              contentType = (0, mimes_1.getMimeType)(resourceURL);
              dataURL = void 0;
              if (!getContentFromUrl) return [3, 2];
              return [4, getContentFromUrl(resolvedURL)];
            case 1:
              content = _a.sent();
              dataURL = (0, dataurl_1.makeDataUrl)(content, contentType);
              return [3, 4];
            case 2:
              return [4, (0, dataurl_1.resourceToDataURL)(resolvedURL, contentType, options)];
            case 3:
              dataURL = _a.sent();
              _a.label = 4;
            case 4:
              return [2, cssText.replace(toRegex(resourceURL), "$1".concat(dataURL, "$3"))];
            case 5:
              error_1 = _a.sent();
              return [3, 6];
            case 6:
              return [2, cssText];
          }
        });
      });
    }
    exports2.embed = embed;
    function filterPreferredFontFormat(str, _a) {
      var preferredFontFormat = _a.preferredFontFormat;
      return !preferredFontFormat ? str : str.replace(FONT_SRC_REGEX, function(match) {
        while (true) {
          var _a2 = URL_WITH_FORMAT_REGEX.exec(match) || [], src = _a2[0], format = _a2[2];
          if (!format) {
            return "";
          }
          if (format === preferredFontFormat) {
            return "src: ".concat(src, ";");
          }
        }
      });
    }
    function shouldEmbed(url) {
      return url.search(URL_REGEX) !== -1;
    }
    exports2.shouldEmbed = shouldEmbed;
    function embedResources(cssText, baseUrl, options) {
      return __awaiter(this, void 0, void 0, function() {
        var filteredCSSText, urls;
        return __generator(this, function(_a) {
          if (!shouldEmbed(cssText)) {
            return [2, cssText];
          }
          filteredCSSText = filterPreferredFontFormat(cssText, options);
          urls = parseURLs(filteredCSSText);
          return [2, urls.reduce(function(deferred, url) {
            return deferred.then(function(css) {
              return embed(css, url, baseUrl, options);
            });
          }, Promise.resolve(filteredCSSText))];
        });
      });
    }
    exports2.embedResources = embedResources;
  }
});

// node_modules/html-to-image/lib/embed-images.js
var require_embed_images = __commonJS({
  "node_modules/html-to-image/lib/embed-images.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.embedImages = void 0;
    var embed_resources_1 = require_embed_resources();
    var util_1 = require_util();
    var dataurl_1 = require_dataurl();
    var mimes_1 = require_mimes();
    function embedProp(propName, node, options) {
      var _a;
      return __awaiter(this, void 0, void 0, function() {
        var propValue, cssString;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
              if (!propValue) return [3, 2];
              return [4, (0, embed_resources_1.embedResources)(propValue, null, options)];
            case 1:
              cssString = _b.sent();
              node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
              return [2, true];
            case 2:
              return [2, false];
          }
        });
      });
    }
    function embedBackground(clonedNode, options) {
      return __awaiter(this, void 0, void 0, function() {
        var _a, _b, _c, _d;
        return __generator(this, function(_e) {
          switch (_e.label) {
            case 0:
              ;
              return [4, embedProp("background", clonedNode, options)];
            case 1:
              _a = _e.sent();
              if (_a) return [3, 3];
              return [4, embedProp("background-image", clonedNode, options)];
            case 2:
              _a = _e.sent();
              _e.label = 3;
            case 3:
              _a;
              return [4, embedProp("mask", clonedNode, options)];
            case 4:
              _d = _e.sent();
              if (_d) return [3, 6];
              return [4, embedProp("-webkit-mask", clonedNode, options)];
            case 5:
              _d = _e.sent();
              _e.label = 6;
            case 6:
              _c = _d;
              if (_c) return [3, 8];
              return [4, embedProp("mask-image", clonedNode, options)];
            case 7:
              _c = _e.sent();
              _e.label = 8;
            case 8:
              _b = _c;
              if (_b) return [3, 10];
              return [4, embedProp("-webkit-mask-image", clonedNode, options)];
            case 9:
              _b = _e.sent();
              _e.label = 10;
            case 10:
              _b;
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    function embedImageNode(clonedNode, options) {
      return __awaiter(this, void 0, void 0, function() {
        var isImageElement, url, dataURL;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              isImageElement = (0, util_1.isInstanceOfElement)(clonedNode, HTMLImageElement);
              if (!(isImageElement && !(0, dataurl_1.isDataUrl)(clonedNode.src)) && !((0, util_1.isInstanceOfElement)(clonedNode, SVGImageElement) && !(0, dataurl_1.isDataUrl)(clonedNode.href.baseVal))) {
                return [
                  2
                  /*return*/
                ];
              }
              url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
              return [4, (0, dataurl_1.resourceToDataURL)(url, (0, mimes_1.getMimeType)(url), options)];
            case 1:
              dataURL = _a.sent();
              return [4, new Promise(function(resolve, reject) {
                clonedNode.onload = resolve;
                clonedNode.onerror = options.onImageErrorHandler ? function() {
                  var attributes = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    attributes[_i] = arguments[_i];
                  }
                  try {
                    resolve(options.onImageErrorHandler.apply(options, attributes));
                  } catch (error) {
                    reject(error);
                  }
                } : reject;
                var image = clonedNode;
                if (image.decode) {
                  image.decode = resolve;
                }
                if (image.loading === "lazy") {
                  image.loading = "eager";
                }
                if (isImageElement) {
                  clonedNode.srcset = "";
                  clonedNode.src = dataURL;
                } else {
                  clonedNode.href.baseVal = dataURL;
                }
              })];
            case 2:
              _a.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    function embedChildren(clonedNode, options) {
      return __awaiter(this, void 0, void 0, function() {
        var children, deferreds;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              children = (0, util_1.toArray)(clonedNode.childNodes);
              deferreds = children.map(function(child) {
                return embedImages(child, options);
              });
              return [4, Promise.all(deferreds).then(function() {
                return clonedNode;
              })];
            case 1:
              _a.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    function embedImages(clonedNode, options) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (!(0, util_1.isInstanceOfElement)(clonedNode, Element)) return [3, 4];
              return [4, embedBackground(clonedNode, options)];
            case 1:
              _a.sent();
              return [4, embedImageNode(clonedNode, options)];
            case 2:
              _a.sent();
              return [4, embedChildren(clonedNode, options)];
            case 3:
              _a.sent();
              _a.label = 4;
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    exports2.embedImages = embedImages;
  }
});

// node_modules/html-to-image/lib/apply-style.js
var require_apply_style = __commonJS({
  "node_modules/html-to-image/lib/apply-style.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.applyStyle = void 0;
    function applyStyle(node, options) {
      var style = node.style;
      if (options.backgroundColor) {
        style.backgroundColor = options.backgroundColor;
      }
      if (options.width) {
        style.width = "".concat(options.width, "px");
      }
      if (options.height) {
        style.height = "".concat(options.height, "px");
      }
      var manual = options.style;
      if (manual != null) {
        Object.keys(manual).forEach(function(key) {
          style[key] = manual[key];
        });
      }
      return node;
    }
    exports2.applyStyle = applyStyle;
  }
});

// node_modules/html-to-image/lib/embed-webfonts.js
var require_embed_webfonts = __commonJS({
  "node_modules/html-to-image/lib/embed-webfonts.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.embedWebFonts = exports2.getWebFontCSS = void 0;
    var util_1 = require_util();
    var dataurl_1 = require_dataurl();
    var embed_resources_1 = require_embed_resources();
    var cssFetchCache = {};
    function fetchCSS(url) {
      return __awaiter(this, void 0, void 0, function() {
        var cache, res, cssText;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              cache = cssFetchCache[url];
              if (cache != null) {
                return [2, cache];
              }
              return [4, fetch(url)];
            case 1:
              res = _a.sent();
              return [4, res.text()];
            case 2:
              cssText = _a.sent();
              cache = { url, cssText };
              cssFetchCache[url] = cache;
              return [2, cache];
          }
        });
      });
    }
    function embedFonts(data, options) {
      return __awaiter(this, void 0, void 0, function() {
        var cssText, regexUrl, fontLocs, loadFonts;
        var _this = this;
        return __generator(this, function(_a) {
          cssText = data.cssText;
          regexUrl = /url\(["']?([^"')]+)["']?\)/g;
          fontLocs = cssText.match(/url\([^)]+\)/g) || [];
          loadFonts = fontLocs.map(function(loc) {
            return __awaiter(_this, void 0, void 0, function() {
              var url;
              return __generator(this, function(_a2) {
                url = loc.replace(regexUrl, "$1");
                if (!url.startsWith("https://")) {
                  url = new URL(url, data.url).href;
                }
                return [2, (0, dataurl_1.fetchAsDataURL)(url, options.fetchRequestInit, function(_a3) {
                  var result = _a3.result;
                  cssText = cssText.replace(loc, "url(".concat(result, ")"));
                  return [loc, result];
                })];
              });
            });
          });
          return [2, Promise.all(loadFonts).then(function() {
            return cssText;
          })];
        });
      });
    }
    function parseCSS(source) {
      if (source == null) {
        return [];
      }
      var result = [];
      var commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
      var cssText = source.replace(commentsRegex, "");
      var keyframesRegex = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
      while (true) {
        var matches = keyframesRegex.exec(cssText);
        if (matches === null) {
          break;
        }
        result.push(matches[0]);
      }
      cssText = cssText.replace(keyframesRegex, "");
      var importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
      var combinedCSSRegex = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})";
      var unifiedRegex = new RegExp(combinedCSSRegex, "gi");
      while (true) {
        var matches = importRegex.exec(cssText);
        if (matches === null) {
          matches = unifiedRegex.exec(cssText);
          if (matches === null) {
            break;
          } else {
            importRegex.lastIndex = unifiedRegex.lastIndex;
          }
        } else {
          unifiedRegex.lastIndex = importRegex.lastIndex;
        }
        result.push(matches[0]);
      }
      return result;
    }
    function getCSSRules(styleSheets, options) {
      return __awaiter(this, void 0, void 0, function() {
        var ret, deferreds;
        return __generator(this, function(_a) {
          ret = [];
          deferreds = [];
          styleSheets.forEach(function(sheet) {
            if ("cssRules" in sheet) {
              try {
                (0, util_1.toArray)(sheet.cssRules || []).forEach(function(item, index) {
                  if (item.type === CSSRule.IMPORT_RULE) {
                    var importIndex_1 = index + 1;
                    var url = item.href;
                    var deferred = fetchCSS(url).then(function(metadata) {
                      return embedFonts(metadata, options);
                    }).then(function(cssText) {
                      return parseCSS(cssText).forEach(function(rule) {
                        try {
                          sheet.insertRule(rule, rule.startsWith("@import") ? importIndex_1 += 1 : sheet.cssRules.length);
                        } catch (error) {
                          console.error("Error inserting rule from remote css", {
                            rule,
                            error
                          });
                        }
                      });
                    }).catch(function(e) {
                      console.error("Error loading remote css", e.toString());
                    });
                    deferreds.push(deferred);
                  }
                });
              } catch (e) {
                var inline_1 = styleSheets.find(function(a) {
                  return a.href == null;
                }) || document.styleSheets[0];
                if (sheet.href != null) {
                  deferreds.push(fetchCSS(sheet.href).then(function(metadata) {
                    return embedFonts(metadata, options);
                  }).then(function(cssText) {
                    return parseCSS(cssText).forEach(function(rule) {
                      inline_1.insertRule(rule, inline_1.cssRules.length);
                    });
                  }).catch(function(err) {
                    console.error("Error loading remote stylesheet", err);
                  }));
                }
                console.error("Error inlining remote css file", e);
              }
            }
          });
          return [2, Promise.all(deferreds).then(function() {
            styleSheets.forEach(function(sheet) {
              if ("cssRules" in sheet) {
                try {
                  (0, util_1.toArray)(sheet.cssRules || []).forEach(function(item) {
                    ret.push(item);
                  });
                } catch (e) {
                  console.error("Error while reading CSS rules from ".concat(sheet.href), e);
                }
              }
            });
            return ret;
          })];
        });
      });
    }
    function getWebFontRules(cssRules) {
      return cssRules.filter(function(rule) {
        return rule.type === CSSRule.FONT_FACE_RULE;
      }).filter(function(rule) {
        return (0, embed_resources_1.shouldEmbed)(rule.style.getPropertyValue("src"));
      });
    }
    function parseWebFontRules(node, options) {
      return __awaiter(this, void 0, void 0, function() {
        var styleSheets, cssRules;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (node.ownerDocument == null) {
                throw new Error("Provided element is not within a Document");
              }
              styleSheets = (0, util_1.toArray)(node.ownerDocument.styleSheets);
              return [4, getCSSRules(styleSheets, options)];
            case 1:
              cssRules = _a.sent();
              return [2, getWebFontRules(cssRules)];
          }
        });
      });
    }
    function normalizeFontFamily(font) {
      return font.trim().replace(/["']/g, "");
    }
    function getUsedFonts(node) {
      var fonts = /* @__PURE__ */ new Set();
      function traverse(node2) {
        var fontFamily = node2.style.fontFamily || getComputedStyle(node2).fontFamily;
        fontFamily.split(",").forEach(function(font) {
          fonts.add(normalizeFontFamily(font));
        });
        Array.from(node2.children).forEach(function(child) {
          if (child instanceof HTMLElement) {
            traverse(child);
          }
        });
      }
      traverse(node);
      return fonts;
    }
    function getWebFontCSS(node, options) {
      return __awaiter(this, void 0, void 0, function() {
        var rules, usedFonts, cssTexts;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, parseWebFontRules(node, options)];
            case 1:
              rules = _a.sent();
              usedFonts = getUsedFonts(node);
              return [4, Promise.all(rules.filter(function(rule) {
                return usedFonts.has(normalizeFontFamily(rule.style.fontFamily));
              }).map(function(rule) {
                var baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
                return (0, embed_resources_1.embedResources)(rule.cssText, baseUrl, options);
              }))];
            case 2:
              cssTexts = _a.sent();
              return [2, cssTexts.join("\n")];
          }
        });
      });
    }
    exports2.getWebFontCSS = getWebFontCSS;
    function embedWebFonts(clonedNode, options) {
      return __awaiter(this, void 0, void 0, function() {
        var cssText, _a, _b, styleNode, sytleContent;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              if (!(options.fontEmbedCSS != null)) return [3, 1];
              _a = options.fontEmbedCSS;
              return [3, 5];
            case 1:
              if (!options.skipFonts) return [3, 2];
              _b = null;
              return [3, 4];
            case 2:
              return [4, getWebFontCSS(clonedNode, options)];
            case 3:
              _b = _c.sent();
              _c.label = 4;
            case 4:
              _a = _b;
              _c.label = 5;
            case 5:
              cssText = _a;
              if (cssText) {
                styleNode = document.createElement("style");
                sytleContent = document.createTextNode(cssText);
                styleNode.appendChild(sytleContent);
                if (clonedNode.firstChild) {
                  clonedNode.insertBefore(styleNode, clonedNode.firstChild);
                } else {
                  clonedNode.appendChild(styleNode);
                }
              }
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    exports2.embedWebFonts = embedWebFonts;
  }
});

// node_modules/html-to-image/lib/index.js
var require_lib = __commonJS({
  "node_modules/html-to-image/lib/index.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getFontEmbedCSS = exports2.toBlob = exports2.toJpeg = exports2.toPng = exports2.toPixelData = exports2.toCanvas = exports2.toSvg = void 0;
    var clone_node_1 = require_clone_node();
    var embed_images_1 = require_embed_images();
    var apply_style_1 = require_apply_style();
    var embed_webfonts_1 = require_embed_webfonts();
    var util_1 = require_util();
    function toSvg(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, width, height, clonedNode, datauri;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
              return [4, (0, clone_node_1.cloneNode)(node, options, true)];
            case 1:
              clonedNode = _b.sent();
              return [4, (0, embed_webfonts_1.embedWebFonts)(clonedNode, options)];
            case 2:
              _b.sent();
              return [4, (0, embed_images_1.embedImages)(clonedNode, options)];
            case 3:
              _b.sent();
              (0, apply_style_1.applyStyle)(clonedNode, options);
              return [4, (0, util_1.nodeToDataURL)(clonedNode, width, height)];
            case 4:
              datauri = _b.sent();
              return [2, datauri];
          }
        });
      });
    }
    exports2.toSvg = toSvg;
    function toCanvas(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, width, height, svg, img, canvas, context, ratio, canvasWidth, canvasHeight;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
              return [4, toSvg(node, options)];
            case 1:
              svg = _b.sent();
              return [4, (0, util_1.createImage)(svg)];
            case 2:
              img = _b.sent();
              canvas = document.createElement("canvas");
              context = canvas.getContext("2d");
              ratio = options.pixelRatio || (0, util_1.getPixelRatio)();
              canvasWidth = options.canvasWidth || width;
              canvasHeight = options.canvasHeight || height;
              canvas.width = canvasWidth * ratio;
              canvas.height = canvasHeight * ratio;
              if (!options.skipAutoScale) {
                (0, util_1.checkCanvasDimensions)(canvas);
              }
              canvas.style.width = "".concat(canvasWidth);
              canvas.style.height = "".concat(canvasHeight);
              if (options.backgroundColor) {
                context.fillStyle = options.backgroundColor;
                context.fillRect(0, 0, canvas.width, canvas.height);
              }
              context.drawImage(img, 0, 0, canvas.width, canvas.height);
              return [2, canvas];
          }
        });
      });
    }
    exports2.toCanvas = toCanvas;
    function toPixelData(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, width, height, canvas, ctx;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
              return [4, toCanvas(node, options)];
            case 1:
              canvas = _b.sent();
              ctx = canvas.getContext("2d");
              return [2, ctx.getImageData(0, 0, width, height).data];
          }
        });
      });
    }
    exports2.toPixelData = toPixelData;
    function toPng(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var canvas;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, toCanvas(node, options)];
            case 1:
              canvas = _a.sent();
              return [2, canvas.toDataURL()];
          }
        });
      });
    }
    exports2.toPng = toPng;
    function toJpeg(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var canvas;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, toCanvas(node, options)];
            case 1:
              canvas = _a.sent();
              return [2, canvas.toDataURL("image/jpeg", options.quality || 1)];
          }
        });
      });
    }
    exports2.toJpeg = toJpeg;
    function toBlob(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var canvas, blob;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, toCanvas(node, options)];
            case 1:
              canvas = _a.sent();
              return [4, (0, util_1.canvasToBlob)(canvas)];
            case 2:
              blob = _a.sent();
              return [2, blob];
          }
        });
      });
    }
    exports2.toBlob = toBlob;
    function getFontEmbedCSS(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, (0, embed_webfonts_1.getWebFontCSS)(node, options)];
        });
      });
    }
    exports2.getFontEmbedCSS = getFontEmbedCSS;
  }
});

// src/region.cjs
var require_region = __commonJS({
  "src/region.cjs"(exports2, module2) {
    "use strict";
    function createRegionTools() {
      function clipRect2(rect, width, height, minimum = 1) {
        if (!rect || ![rect.x, rect.y, rect.width, rect.height, width, height].every(Number.isFinite) || rect.width <= 0 || rect.height <= 0 || width <= 0 || height <= 0) return null;
        const x = Math.max(0, Math.min(width, rect.x));
        const y = Math.max(0, Math.min(height, rect.y));
        const right = Math.max(0, Math.min(width, rect.x + rect.width));
        const bottom = Math.max(0, Math.min(height, rect.y + rect.height));
        if (right - x < minimum || bottom - y < minimum) return null;
        return { x, y, width: right - x, height: bottom - y };
      }
      function dragRect(start, end, width, height, minimum = 4) {
        return clipRect2({
          x: Math.min(start.x, end.x),
          y: Math.min(start.y, end.y),
          width: Math.abs(end.x - start.x),
          height: Math.abs(end.y - start.y)
        }, width, height, minimum);
      }
      function pixelRect(rect, viewport, image) {
        const box = clipRect2(rect, viewport.width, viewport.height);
        if (!box || ![image.width, image.height].every(Number.isFinite) || image.width <= 0 || image.height <= 0) return null;
        const sx = image.width / viewport.width, sy = image.height / viewport.height;
        const x = Math.floor(box.x * sx), y = Math.floor(box.y * sy);
        return {
          x,
          y,
          width: Math.ceil((box.x + box.width) * sx) - x,
          height: Math.ceil((box.y + box.height) * sy) - y
        };
      }
      function installRegionPicker2(target, options) {
        let drag = null;
        const swallow = (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
        };
        const cancel = () => {
          const previous = drag;
          drag = null;
          if (previous) {
            try {
              previous.target.releasePointerCapture(previous.id);
            } catch (_) {
            }
            options.preview(null);
          }
          return !!previous;
        };
        const down = (event) => {
          if (options.ignore(event)) return;
          swallow(event);
          if (event.button !== 0 || event.isPrimary === false || options.blocked()) return;
          cancel();
          drag = { x: event.clientX, y: event.clientY, id: event.pointerId, target: event.target, moved: false };
          try {
            event.target.setPointerCapture(event.pointerId);
          } catch (_) {
          }
        };
        const move = (event) => {
          if (!drag || drag.id !== event.pointerId) return;
          swallow(event);
          if (event.buttons === 0) {
            cancel();
            return;
          }
          if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) >= 4) drag.moved = true;
          if (!drag.moved) return;
          const bounds = options.bounds();
          options.preview(dragRect(drag, { x: event.clientX, y: event.clientY }, bounds.width, bounds.height, 1));
        };
        const up = (event) => {
          if (!drag || drag.id !== event.pointerId) return;
          swallow(event);
          const start = drag;
          const moved = start.moved || Math.hypot(event.clientX - start.x, event.clientY - start.y) >= 4;
          const bounds = options.bounds();
          const rect = dragRect(drag, { x: event.clientX, y: event.clientY }, bounds.width, bounds.height);
          cancel();
          if (moved) {
            if (rect) options.select(rect);
          } else options.click(start);
        };
        const lost = (event) => {
          if (drag && drag.id === event.pointerId) cancel();
        };
        const listeners = { pointerdown: down, pointermove: move, pointerup: up, pointercancel: lost, lostpointercapture: lost };
        Object.entries(listeners).forEach(([name, handler]) => target.addEventListener(name, handler, true));
        return { cancel, isDragging: () => !!drag?.moved, destroy() {
          cancel();
          Object.entries(listeners).forEach(([name, handler]) => target.removeEventListener(name, handler, true));
        } };
      }
      return { clipRect: clipRect2, dragRect, pixelRect, installRegionPicker: installRegionPicker2 };
    }
    module2.exports = { ...createRegionTools(), createRegionTools };
  }
});

// src/capture.cjs
var require_capture = __commonJS({
  "src/capture.cjs"(exports2, module2) {
    "use strict";
    var { toSvg } = require_lib();
    var { clipRect: clipRect2 } = require_region();
    var MAX_VIEWPORT_AREA = 9e6;
    var MAX_EDGE = 1600;
    var UI2 = "[data-annot-ui]";
    var BOX_COLOR = "#ff3b30";
    var CaptureError2 = class extends Error {
      constructor(code) {
        super(code);
        this.code = code;
      }
    };
    function captureErrorKey2(error) {
      const keys = {
        invalid: "captureInvalid",
        tooLarge: "captureTooLarge",
        assets: "captureAssets",
        protected: "captureProtected",
        decode: "captureDecode",
        changed: "captureChanged",
        guestUnavailable: "captureGuestUnavailable",
        guest: "captureGuestFailed"
      };
      return "error." + (keys[error && error.code] || (error && error.name === "SecurityError" ? "captureProtected" : "captureFailed"));
    }
    async function decodeImage(dataUrl) {
      const image = new Image();
      image.src = dataUrl;
      try {
        await image.decode();
      } catch (_error) {
        throw new CaptureError2("decode");
      }
      if (!image.naturalWidth || !image.naturalHeight) throw new CaptureError2("decode");
      return image;
    }
    async function rasterize(dataUrl) {
      const image = await decodeImage(dataUrl);
      const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, width, height);
      return { dataUrl: canvas.toDataURL("image/png"), width, height };
    }
    function boundedSnapshot(rect) {
      const included = /* @__PURE__ */ new Set([document.documentElement, document.body]);
      const marker = "data-annot-layout-" + Math.random().toString(36).slice(2);
      for (const node of document.querySelectorAll("body *")) {
        if (node.closest(UI2)) continue;
        const b = node.getBoundingClientRect();
        if (b.width <= 0 || b.height <= 0 || b.right <= rect.x || b.left >= rect.x + rect.width || b.bottom <= rect.y || b.top >= rect.y + rect.height) continue;
        for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) included.add(ancestor);
      }
      const layouts = [];
      for (const parent of included) {
        parent.setAttribute(marker, String(layouts.length));
        const omitted = [];
        Array.from(parent.childNodes).forEach((node, index) => {
          if (node.nodeType !== 1 || included.has(node)) return;
          const style = getComputedStyle(node);
          let css = "";
          for (const key of [
            "display",
            "position",
            "inset",
            "inset-block",
            "inset-inline",
            "width",
            "height",
            "min-width",
            "max-width",
            "min-height",
            "max-height",
            "box-sizing",
            "margin",
            "padding",
            "border-width",
            "border-style",
            "flex",
            "order",
            "align-self",
            "justify-self",
            "grid-area",
            "float",
            "clear",
            "vertical-align",
            "aspect-ratio",
            "writing-mode",
            "font-size",
            "line-height",
            "transform",
            "transform-origin",
            "translate",
            "rotate",
            "scale",
            "zoom"
          ]) {
            css += key + ":" + style.getPropertyValue(key) + ";";
          }
          omitted.push({ index, css });
        });
        layouts.push({ parent, omitted });
      }
      return {
        filter: (node) => node.nodeType !== 1 || included.has(node) && !(node.matches && node.matches("[data-annot-broken]")),
        restore: () => layouts.forEach(({ parent }) => parent.removeAttribute(marker)),
        fill(svg) {
          layouts.forEach(({ omitted }, id) => {
            const parent = svg.querySelector("[" + marker + '="' + id + '"]');
            if (!parent) return;
            omitted.forEach(({ index, css }) => {
              const placeholder = svg.createElementNS("http://www.w3.org/1999/xhtml", "div");
              placeholder.style.cssText = css;
              Object.assign(placeholder.style, {
                visibility: "hidden",
                background: "none",
                mask: "none",
                webkitMask: "none",
                borderImageSource: "none",
                listStyleImage: "none",
                filter: "none"
              });
              parent.insertBefore(placeholder, parent.childNodes[index] || null);
            });
            parent.removeAttribute(marker);
          });
        }
      };
    }
    async function prepareMedia(viewport) {
      const changed = [];
      const broken = [];
      const mark = (node) => {
        node.setAttribute("data-annot-broken", "1");
        broken.push(node);
      };
      const visible = (node) => {
        const rect = node.getBoundingClientRect();
        return rect.width >= 1 && rect.height >= 1 && rect.right > 0 && rect.bottom > 0 && rect.left < viewport.width && rect.top < viewport.height;
      };
      for (const image of Array.from(document.images || [])) {
        if (!visible(image)) continue;
        if (!image.naturalWidth || !image.naturalHeight) {
          mark(image);
          continue;
        }
        const src = image.currentSrc || image.src;
        if (!src || /^data:/i.test(src)) continue;
        if (image.naturalWidth * image.naturalHeight > 16e6) continue;
        try {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext("2d");
          if (!context) throw new Error("no 2d context");
          context.drawImage(image, 0, 0);
          let dataUrl = canvas.toDataURL("image/webp", 0.95);
          if (!/^data:image\/webp/i.test(dataUrl)) dataUrl = canvas.toDataURL("image/png");
          changed.push({ image, src: image.getAttribute("src"), srcset: image.getAttribute("srcset") });
          image.removeAttribute("srcset");
          image.setAttribute("src", dataUrl);
        } catch (_error) {
          mark(image);
        }
      }
      for (const canvas of Array.from(document.querySelectorAll("canvas"))) {
        if (!visible(canvas)) continue;
        try {
          canvas.toDataURL();
        } catch (_error) {
          mark(canvas);
        }
      }
      return {
        getCount: () => broken.length,
        /** Last-resort fallback: exclude every image and canvas and retry. */
        markAll: () => {
          for (const image of Array.from(document.images || [])) mark(image);
          for (const canvas of Array.from(document.querySelectorAll("canvas"))) mark(canvas);
        },
        restore: () => {
          for (const entry of changed) {
            if (entry.src === null) entry.image.removeAttribute("src");
            else entry.image.setAttribute("src", entry.src);
            if (entry.srcset === null) entry.image.removeAttribute("srcset");
            else entry.image.setAttribute("srcset", entry.srcset);
          }
          for (const node of broken) node.removeAttribute("data-annot-broken");
        }
      };
    }
    async function hostSnapshot(viewport) {
      const rect = { x: 0, y: 0, width: viewport.width, height: viewport.height };
      const box = clipRect2(rect, viewport.width, viewport.height, 1);
      if (!box) throw new CaptureError2("invalid");
      const snapshot = boundedSnapshot(box);
      const media = await prepareMedia(viewport);
      const marker = "data-annot-scroll-" + Math.random().toString(36).slice(2);
      const scrollers = [];
      const positioned = [];
      for (const node of document.querySelectorAll("*")) {
        if (!node.closest(UI2) && (node.scrollTop || node.scrollLeft)) {
          node.setAttribute(marker, String(scrollers.length));
          scrollers.push({ node, x: node.scrollLeft, y: node.scrollTop, width: node.scrollWidth, height: node.scrollHeight });
        }
      }
      for (const node of document.querySelectorAll("*")) {
        if (node.closest(UI2) || !scrollers.some((entry) => entry.node.contains(node))) continue;
        if (!["fixed", "sticky"].includes(getComputedStyle(node).position)) continue;
        node.setAttribute(marker + "-position", String(positioned.length));
        positioned.push({ node, rect: node.getBoundingClientRect() });
      }
      let data;
      try {
        data = await toSvg(document.documentElement, {
          width: viewport.width,
          height: viewport.height,
          skipFonts: true,
          cacheBust: false,
          filter: snapshot.filter
        });
      } catch (error) {
        if (error && error.name === "SecurityError") throw new CaptureError2("protected");
        media.markAll();
        try {
          data = await toSvg(document.documentElement, {
            width: viewport.width,
            height: viewport.height,
            skipFonts: true,
            cacheBust: false,
            filter: snapshot.filter
          });
        } catch (_retry) {
          throw new CaptureError2("assets");
        }
      } finally {
        snapshot.restore();
        media.restore();
        scrollers.forEach(({ node }) => node.removeAttribute(marker));
        positioned.forEach(({ node }) => node.removeAttribute(marker + "-position"));
      }
      const svg = new DOMParser().parseFromString(decodeURIComponent(data.slice(data.indexOf(",") + 1)), "image/svg+xml");
      if (svg.querySelector("parsererror")) throw new CaptureError2("decode");
      snapshot.fill(svg);
      for (const [index, scroll] of scrollers.entries()) {
        const node = svg.querySelector("[" + marker + '="' + index + '"]');
        if (!node) continue;
        const inner = svg.createElementNS("http://www.w3.org/1999/xhtml", "div");
        for (const key of [
          "display",
          "flexDirection",
          "flexWrap",
          "alignItems",
          "alignContent",
          "justifyContent",
          "justifyItems",
          "gap",
          "gridTemplateColumns",
          "gridTemplateRows",
          "gridAutoColumns",
          "gridAutoRows",
          "gridAutoFlow",
          "padding",
          "writingMode"
        ]) inner.style[key] = node.style[key];
        while (node.firstChild) inner.appendChild(node.firstChild);
        Object.assign(inner.style, {
          position: "relative",
          top: "0",
          left: "0",
          margin: "0",
          border: "0",
          width: scroll.width + "px",
          height: scroll.height + "px",
          boxSizing: "border-box",
          overflow: "visible",
          transform: `translate(${-scroll.x}px, ${-scroll.y}px)`
        });
        Object.assign(node.style, { display: "block", padding: "0", paddingBlock: "0", paddingInline: "0", overflow: "hidden" });
        node.appendChild(inner);
      }
      for (const [index, entry] of positioned.entries()) {
        const node = svg.querySelector("[" + marker + '-position="' + index + '"]');
        if (!node) continue;
        const placeholder = node.cloneNode(true);
        placeholder.style.visibility = "hidden";
        placeholder.removeAttribute(marker + "-position");
        placeholder.querySelectorAll("[" + marker + "-position]").forEach((child) => child.removeAttribute(marker + "-position"));
        node.replaceWith(placeholder);
        const { x, y, width, height } = entry.rect;
        const values = {
          position: "absolute",
          inset: `${y}px auto auto ${x}px`,
          insetBlock: `${y}px auto`,
          insetInline: `${x}px auto`,
          margin: "0",
          marginBlock: "0",
          marginInline: "0",
          width: width + "px",
          inlineSize: width + "px",
          height: height + "px",
          blockSize: height + "px",
          boxSizing: "border-box",
          transform: "none"
        };
        for (const [key, value] of Object.entries(values)) node.style.setProperty(key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()), value, "important");
        svg.querySelector("foreignObject").firstElementChild.appendChild(node);
      }
      return {
        dataUrl: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg)),
        skipped: media.getCount()
      };
    }
    async function captureHostViewport2() {
      const viewport = { width: window.innerWidth, height: window.innerHeight, x: window.scrollX, y: window.scrollY };
      if (!(viewport.width > 0 && viewport.height > 0)) throw new CaptureError2("invalid");
      if (viewport.width * viewport.height > MAX_VIEWPORT_AREA) throw new CaptureError2("tooLarge");
      const snapshot = await hostSnapshot(viewport);
      const shot = await rasterize(snapshot.dataUrl);
      return {
        dataUrl: shot.dataUrl,
        image: { width: shot.width, height: shot.height },
        viewport,
        skipped: snapshot.skipped
      };
    }
    async function captureGuestViewport2(wv) {
      if (!wv || typeof wv.capturePage !== "function" || typeof wv.executeJavaScript !== "function") {
        throw new CaptureError2("guestUnavailable");
      }
      let viewport;
      try {
        viewport = await wv.executeJavaScript("window.__dshAnnotate && window.__dshAnnotate.prepareCapture()");
      } catch (_error) {
        throw new CaptureError2("guest");
      }
      if (!viewport || !["width", "height", "x", "y"].every((key) => Number.isFinite(viewport[key]))) {
        throw new CaptureError2("changed");
      }
      if (viewport.width * viewport.height > MAX_VIEWPORT_AREA) throw new CaptureError2("tooLarge");
      let shot;
      try {
        const image = await wv.capturePage();
        shot = await rasterize(image.toDataURL());
      } catch (error) {
        if (error instanceof CaptureError2) throw error;
        throw new CaptureError2("guest");
      } finally {
        try {
          await wv.executeJavaScript("window.__dshAnnotate && window.__dshAnnotate.finishCapture()");
        } catch (_error) {
        }
      }
      let valid = false;
      try {
        valid = await wv.executeJavaScript(
          "window.__dshAnnotate && window.__dshAnnotate.captureValid(" + JSON.stringify(viewport) + ")"
        );
      } catch (_error) {
        valid = false;
      }
      if (!valid) throw new CaptureError2("changed");
      return { dataUrl: shot.dataUrl, image: { width: shot.width, height: shot.height }, viewport };
    }
    function roundedRect(context, x, y, width, height, radius) {
      const r = Math.max(0, Math.min(radius, width / 2, height / 2));
      context.beginPath();
      if (typeof context.roundRect === "function") {
        context.roundRect(x, y, width, height, r);
        return;
      }
      context.moveTo(x + r, y);
      context.lineTo(x + width - r, y);
      context.quadraticCurveTo(x + width, y, x + width, y + r);
      context.lineTo(x + width, y + height - r);
      context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      context.lineTo(x + r, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - r);
      context.lineTo(x, y + r);
      context.quadraticCurveTo(x, y, x + r, y);
      context.closePath();
    }
    async function drawAnnotations2(base, items, color) {
      const image = await decodeImage(base.dataUrl);
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new CaptureError2("decode");
      context.drawImage(image, 0, 0);
      const viewport = base.viewport || { width: canvas.width, height: canvas.height };
      const sx = canvas.width / viewport.width;
      const sy = canvas.height / viewport.height;
      const stroke = Math.max(2, Math.round(2.5 * Math.max(sx, sy)));
      const halo = Math.max(1, Math.round(stroke * 0.6));
      const radius = Math.max(2, Math.round(4 * Math.max(sx, sy)));
      const accent = color || BOX_COLOR;
      const badgeRadius = Math.max(10, Math.round(11 * Math.max(sx, sy)));
      for (const item of items) {
        const box = clipRect2(item.rect, viewport.width, viewport.height, 2);
        if (!box) continue;
        const x = box.x * sx;
        const y = box.y * sy;
        const width = Math.max(1, box.width * sx);
        const height = Math.max(1, box.height * sy);
        roundedRect(context, x - halo, y - halo, width + halo * 2, height + halo * 2, radius + halo);
        context.lineWidth = stroke + halo * 2;
        context.strokeStyle = "rgba(255,255,255,0.92)";
        context.stroke();
        roundedRect(context, x, y, width, height, radius);
        context.lineWidth = stroke;
        context.strokeStyle = accent;
        context.stroke();
        const cx = Math.min(Math.max(badgeRadius, x), Math.max(badgeRadius, canvas.width - badgeRadius));
        const cy = Math.min(Math.max(badgeRadius, y), Math.max(badgeRadius, canvas.height - badgeRadius));
        context.beginPath();
        context.arc(cx, cy, badgeRadius, 0, Math.PI * 2);
        context.fillStyle = accent;
        context.fill();
        context.lineWidth = Math.max(1, Math.round(badgeRadius * 0.18));
        context.strokeStyle = "rgba(255,255,255,0.95)";
        context.stroke();
        context.fillStyle = "#ffffff";
        context.font = "600 " + Math.round(badgeRadius * 1.05) + 'px "Segoe UI", system-ui, -apple-system, sans-serif';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(String(item.index), cx, cy + Math.round(badgeRadius * 0.05));
      }
      return canvas.toDataURL("image/png");
    }
    module2.exports = {
      CaptureError: CaptureError2,
      captureErrorKey: captureErrorKey2,
      rasterize,
      captureHostViewport: captureHostViewport2,
      captureGuestViewport: captureGuestViewport2,
      drawAnnotations: drawAnnotations2,
      BOX_COLOR,
      MAX_EDGE
    };
  }
});

// src/lib.cjs
var require_lib2 = __commonJS({
  "src/lib.cjs"(exports2, module2) {
    "use strict";
    function clip2(text, max) {
      const limit = max === void 0 ? 140 : max;
      const value = String(text === void 0 || text === null ? "" : text).replace(/\s+/g, " ").trim();
      return value.length > limit ? value.slice(0, limit - 1) + "\u2026" : value;
    }
    function cssEscape(value) {
      if (typeof CSS !== "undefined" && CSS && typeof CSS.escape === "function") return CSS.escape(String(value));
      return String(value).replace(/[^a-zA-Z0-9_-]/g, (ch) => "\\" + ch);
    }
    function elementLabel(el) {
      if (!el || typeof el.getAttribute !== "function") return "";
      const read = (name) => {
        try {
          return el.getAttribute(name);
        } catch (_error) {
          return null;
        }
      };
      const text = el.innerText !== void 0 && el.innerText !== null ? el.innerText : el.textContent;
      const parts = [read("aria-label"), read("title"), read("alt"), read("placeholder"), text].map((part) => clip2(part, 90)).filter((part) => part !== "");
      const unique = parts.filter((part, index) => parts.indexOf(part) === index);
      if (unique.length > 0) return unique[0];
      return el.tagName ? String(el.tagName).toLowerCase() : "";
    }
    function selectorOf(el, depth) {
      const limit = depth === void 0 ? 4 : depth;
      const parts = [];
      let node = el;
      while (node && node.nodeType === 1 && parts.length < limit) {
        let part = String(node.tagName).toLowerCase();
        const id = node.getAttribute && node.getAttribute("id");
        if (id) {
          parts.unshift(part + "#" + cssEscape(id));
          break;
        }
        const classes = node.classList ? Array.prototype.slice.call(node.classList, 0, 2) : [];
        if (classes.length > 0) part += "." + classes.map(cssEscape).join(".");
        const parent = node.parentElement;
        if (parent) {
          const siblings = Array.prototype.filter.call(parent.children, (child) => child.tagName === node.tagName);
          if (siblings.length > 1) part += ":nth-of-type(" + (siblings.indexOf(node) + 1) + ")";
        }
        parts.unshift(part);
        node = node.parentElement;
      }
      return parts.join(" > ");
    }
    function rectOf(el) {
      if (!el || typeof el.getBoundingClientRect !== "function") return null;
      const rect = el.getBoundingClientRect();
      return {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    }
    function describeElement2(el) {
      if (!el) return null;
      return {
        tag: String(el.tagName || "").toLowerCase(),
        label: elementLabel(el),
        text: clip2(el.innerText !== void 0 && el.innerText !== null ? el.innerText : el.textContent, 200),
        selector: selectorOf(el),
        rect: rectOf(el)
      };
    }
    function dataUrlToBytes2(dataUrl) {
      const text = String(dataUrl);
      const comma = text.indexOf(",");
      if (comma < 0) throw new Error("not a data URL");
      const meta = text.slice(0, comma);
      if (!/;base64/i.test(meta)) throw new Error("not base64");
      const binary = atob(text.slice(comma + 1));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return { mediaType: meta.slice(5).split(";")[0] || "image/png", bytes };
    }
    function formatInsertText2(groups, t) {
      const lines = [t("insert.head")];
      groups.forEach((group) => {
        const viewport = group.viewport || {};
        const scroll = group.scroll || { x: 0, y: 0 };
        lines.push(t("insert.shot", {
          url: group.url || "",
          width: Math.round(viewport.width || 0),
          height: Math.round(viewport.height || 0),
          x: Math.round(scroll.x || 0),
          y: Math.round(scroll.y || 0)
        }));
        group.items.forEach((item) => {
          const label = item.desc && (item.desc.label || item.desc.tag) || t("insert.regionLabel");
          lines.push(t("insert.item", {
            index: item.index,
            label: clip2(label, 80),
            comment: clip2(String(item.comment || "").trim(), 300) || t("insert.noComment")
          }));
          if (item.desc && item.desc.selector) lines.push(t("insert.where", { selector: clip2(item.desc.selector, 240) }));
          const rect = item.rect || {};
          lines.push(t("insert.rect", {
            x: Math.round(rect.x || 0),
            y: Math.round(rect.y || 0),
            width: Math.round(rect.width || 0),
            height: Math.round(rect.height || 0)
          }));
        });
      });
      return lines.join("\n");
    }
    module2.exports = {
      clip: clip2,
      cssEscape,
      elementLabel,
      selectorOf,
      rectOf,
      describeElement: describeElement2,
      dataUrlToBytes: dataUrlToBytes2,
      formatInsertText: formatInsertText2
    };
  }
});

// src/guest.cjs
var require_guest = __commonJS({
  "src/guest.cjs"(exports2, module2) {
    "use strict";
    var { createRegionTools } = require_region();
    var MARK2 = "__DSH_ANNOTATE__";
    var GUEST_INSTALL2 = `(function () {
  var MARK = '${MARK2}';
  var tools = (${createRegionTools.toString()})();
  var installRegionPicker = tools.installRegionPicker;
  var revision = 0;
  var instance = Math.random().toString(36).slice(2);
  var capturing = false;
  function viewport() { return { width: innerWidth, height: innerHeight, x: scrollX, y: scrollY, revision: revision, instance: instance }; }
  function emit(payload) { console.log(MARK + JSON.stringify(payload)); }
  function hide() { box.style.display = 'none'; label.style.display = 'none'; }
  if (window.__dshAnnotate) { try { window.__dshAnnotate.destroy(); } catch (error) {} }
  var BOX = '__BOX__';
  var HIT = 'position:fixed;pointer-events:none;border:2px solid __ACCENT__;background:color-mix(in srgb,__ACCENT__ 16%,transparent);border-radius:3px;z-index:2147483647;display:none;box-sizing:border-box';
  var LABEL = 'position:fixed;pointer-events:none;background:__ACCENT__;color:__ON_ACCENT__;font:11px/1.5 -apple-system,system-ui,sans-serif;padding:1px 6px;border-radius:3px;z-index:2147483647;display:none;white-space:nowrap;max-width:60vw;overflow:hidden;text-overflow:ellipsis';
  var layer = document.createElement('div');
  layer.setAttribute('data-dsh-annotate', '1');
  layer.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:transparent;pointer-events:none';
  var box = document.createElement('div');
  box.style.cssText = HIT;
  var label = document.createElement('div');
  label.style.cssText = LABEL;
  function clip(value, max) {
    var text = String(value == null ? '' : value).replace(/\\s+/g, ' ').trim();
    return text.length > max ? text.slice(0, max - 1) + '\u2026' : text;
  }
  function describe(el) {
    var read = function (name) { try { return el.getAttribute(name); } catch (error) { return null; } };
    var text = el.innerText != null ? el.innerText : el.textContent;
    var label = clip(read('aria-label') || read('title') || read('alt') || read('placeholder') || text, 90);
    var parts = [];
    var node = el;
    var depth = 0;
    while (node && node.nodeType === 1 && depth < 4) {
      var part = String(node.tagName).toLowerCase();
      if (node.getAttribute && node.getAttribute('id')) { parts.unshift(part + '#' + node.getAttribute('id')); break; }
      var classes = node.classList ? Array.prototype.slice.call(node.classList, 0, 2) : [];
      if (classes.length) part += '.' + classes.join('.');
      var parent = node.parentElement;
      if (parent) {
        var same = Array.prototype.filter.call(parent.children, function (child) { return child.tagName === node.tagName; });
        if (same.length > 1) part += ':nth-of-type(' + (same.indexOf(node) + 1) + ')';
      }
      parts.unshift(part);
      node = node.parentElement;
      depth += 1;
    }
    var rect = el.getBoundingClientRect();
    return {
      tag: String(el.tagName).toLowerCase(),
      label: label,
      text: clip(text, 200),
      selector: parts.join(' > '),
      rect: { x: Math.round(rect.left), y: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) }
    };
  }
  function hit(x, y) {
    var list = document.elementsFromPoint(x, y);
    for (var i = 0; i < list.length; i += 1) {
      var el = list[i];
      if (el === layer || el === box || el === label) continue;
      if (el.closest && el.closest('[data-dsh-annotate]')) continue;
      return el;
    }
    return null;
  }
  /** Scroll offsets of every scrollable ancestor: regions follow content without assuming an element moves. */
  function scrollChain(el) {
    var chain = [];
    var root = document.scrollingElement || document.documentElement;
    for (var node = el; node; node = node.parentElement) {
      if (node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1) {
        chain.push({ el: node, top: node.scrollTop, left: node.scrollLeft });
      }
    }
    var known = chain.some(function (entry) { return entry.el === root; });
    if (!known) chain.push({ el: root, top: root.scrollTop, left: root.scrollLeft });
    return chain;
  }
  function chainDelta(entry) {
    var chain = entry.chain || [];
    var dx = 0; var dy = 0;
    for (var i = 0; i < chain.length; i += 1) {
      if (!chain[i].el.isConnected) return null;
      dx -= chain[i].el.scrollLeft - chain[i].left;
      dy -= chain[i].el.scrollTop - chain[i].top;
    }
    return { dx: dx, dy: dy };
  }
  function regionNow(entry) {
    var width = Math.round(entry.region.width);
    var height = Math.round(entry.region.height);
    // Scroll offsets are stable even when the page recycles the element under
    // the selection; element movement covers transform-based scrolling.
    var delta = chainDelta(entry);
    if (delta && (Math.abs(delta.dx) > 1 || Math.abs(delta.dy) > 1)) {
      return { x: Math.round(entry.region.x + delta.dx), y: Math.round(entry.region.y + delta.dy), width: width, height: height };
    }
    if (entry.el && entry.el.isConnected && entry.base) {
      var bounds = entry.el.getBoundingClientRect();
      var movedX = bounds.left - entry.base.left;
      var movedY = bounds.top - entry.base.top;
      if (Math.abs(movedX) > 1 || Math.abs(movedY) > 1) {
        return { x: Math.round(entry.region.x + movedX), y: Math.round(entry.region.y + movedY), width: width, height: height };
      }
    }
    if (delta) return { x: Math.round(entry.region.x + delta.dx), y: Math.round(entry.region.y + delta.dy), width: width, height: height };
    return null;
  }
  var adopted = [];
  var markerLayer = null;
  var markerNodes = new Map();
  function elementNow(entry) {
    if (!entry.el || !entry.el.isConnected) return null;
    var bounds = entry.el.getBoundingClientRect();
    return { x: Math.round(bounds.left), y: Math.round(bounds.top), width: Math.round(bounds.width), height: Math.round(bounds.height) };
  }
  function markers() {
    if (!markerLayer) {
      markerLayer = document.createElement('div');
      markerLayer.setAttribute('data-dsh-annotate', '1');
      markerLayer.setAttribute('data-dsh-annotate-markers', '1');
      markerLayer.style.cssText = 'position:fixed;inset:0;z-index:2147483645;pointer-events:none;overflow:hidden';
      document.documentElement.appendChild(markerLayer);
    }
    return markerLayer;
  }
  var pendingId = null;
  function addMarker(id, index) {
    markers();
    if (markerNodes.has(id)) return;
    var outline = document.createElement('div');
    outline.style.cssText = 'position:fixed;pointer-events:none;border:2px solid ' + BOX + ';border-radius:3px;box-sizing:border-box;opacity:.95;display:none';
    var pin = document.createElement('button');
    pin.type = 'button';
    pin.textContent = String(index);
    pin.style.cssText = 'position:fixed;pointer-events:auto;width:22px;height:22px;padding:0;border:0;border-radius:11px;background:' + BOX + ';color:#fff;font:600 12px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.28);display:none';
    pin.addEventListener('click', function (event) { event.preventDefault(); event.stopImmediatePropagation(); emit({ kind: 'pin', id: id }); }, true);
    markers().appendChild(outline);
    markers().appendChild(pin);
    markerNodes.set(id, { outline: outline, pin: pin });
    paintMarkers();
  }
  function dropMarker(id) {
    var node = markerNodes.get(id);
    if (!node) return;
    try { node.outline.remove(); node.pin.remove(); } catch (error) {}
    markerNodes.delete(id);
  }
  function adopt(list) {
    adopted = Array.isArray(list) ? list : [];
    markers();
    markerNodes.forEach(function (node, id) {
      var keep = adopted.some(function (item) { return item.id === id; }) || id === pendingId;
      if (!keep) dropMarker(id);
    });
    adopted.forEach(function (item) {
      if (!item || typeof item.id !== 'string') return;
      addMarker(item.id, item.index);
      var node = markerNodes.get(item.id);
      if (node) node.pin.textContent = String(item.index);
    });
    if (pendingId && adopted.some(function (item) { return item.id === pendingId; })) pendingId = null;
    paintMarkers();
  }
  function paintMarkers() {
    if (!markerNodes.size) return;
    markerNodes.forEach(function (node, id) {
      var entry = null;
      for (var i = 0; i < picks.length; i += 1) if (picks[i].id === id) { entry = picks[i]; break; }
      var rect = entry ? (entry.region ? regionNow(entry) : elementNow(entry)) : null;
      if (!rect) { node.outline.style.display = 'none'; node.pin.style.display = 'none'; return; }
      Object.assign(node.outline.style, { display: 'block', left: rect.x + 'px', top: rect.y + 'px', width: rect.width + 'px', height: rect.height + 'px' });
      Object.assign(node.pin.style, { display: 'block', left: Math.max(0, rect.x - 11) + 'px', top: Math.max(0, rect.y - 11) + 'px' });
    });
  }
  function show(el) {
    if (!el) { box.style.display = 'none'; label.style.display = 'none'; return; }
    var rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) { box.style.display = 'none'; label.style.display = 'none'; return; }
    box.style.display = 'block';
    box.style.left = rect.left + 'px';
    box.style.top = rect.top + 'px';
    box.style.width = rect.width + 'px';
    box.style.height = rect.height + 'px';
    var info = describe(el);
    label.textContent = info.tag + (info.label ? ' \xB7 ' + clip(info.label, 48) : '');
    label.style.display = 'block';
    var below = rect.top + 20 < window.innerHeight;
    label.style.left = Math.max(2, Math.min(rect.left, window.innerWidth - 220)) + 'px';
    label.style.top = (below ? rect.top + 2 : Math.max(2, rect.top - 20)) + 'px';
  }
  var frozen = false;
  var frozenEl = null;
  var scrollFrame = 0;
  var picker;
  var picks = [];
  var pickSeq = 0;
  function reportMoves() {
    if (!picks.length) return;
    picks = picks.filter(function (entry) { return entry.region || (entry.el && entry.el.isConnected); });
    for (var i = 0; i < picks.length; i += 1) {
      var entry = picks[i];
      var bounds = entry.region ? null : entry.el.getBoundingClientRect();
      var rect = entry.region
        ? regionNow(entry)
        : { x: Math.round(bounds.left), y: Math.round(bounds.top), width: Math.round(bounds.width), height: Math.round(bounds.height) };
      if (!rect) continue;
      var last = picks[i].last;
      if (last && last.x === rect.x && last.y === rect.y && last.width === rect.width && last.height === rect.height) continue;
      picks[i].last = rect;
      emit({ kind: 'move', id: picks[i].id, rect: rect, viewport: viewport() });
    }
  }
  var monitorFrame = 0;
  function monitor() {
    monitorFrame = requestAnimationFrame(monitor);
    paintMarkers();
  }
  function reportScroll() {
    revision += 1;
    if (picker) picker.cancel();
    hide();
    if (frozen && frozenEl && frozenEl.isConnected) show(frozenEl);
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(function () {
      scrollFrame = 0;
      try { console.log(MARK + JSON.stringify({ kind: 'scroll', width: innerWidth, height: innerHeight, x: window.scrollX, y: window.scrollY, revision: revision })); } catch (error) {}
    });
  }
  window.addEventListener('scroll', reportScroll, true);
  window.addEventListener('resize', reportScroll, true);
  function onHover(event) {
    if (frozen || capturing || picker.isDragging()) return;
    if (event.target instanceof Element && event.target.closest('[data-dsh-annotate]')) return;
    show(hit(event.clientX, event.clientY));
  }
  function own(event) { return event.target instanceof Element && !!event.target.closest('[data-dsh-annotate]'); }
  function onDown(event) { if (own(event)) return; event.preventDefault(); event.stopImmediatePropagation(); }
  function onClick(event) { if (own(event)) return; event.preventDefault(); event.stopImmediatePropagation(); }
  function onContext(event) { if (own(event)) return; event.preventDefault(); }
  document.addEventListener('mousemove', onHover, true);
  document.addEventListener('mousedown', onDown, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('contextmenu', onContext, true);
  var cursorStyle = document.createElement('style');
  cursorStyle.setAttribute('data-dsh-annotate', '1');
  cursorStyle.textContent = 'html,html *{cursor:crosshair !important}';
  document.documentElement.appendChild(cursorStyle);
  function pickElement(point) {
    if (frozen || capturing) return;
    var el = hit(point.x, point.y);
    if (!el) return;
    frozen = true;
    frozenEl = el;
    var id = instance + ':' + String(++pickSeq);
    picks.push({ id: id, el: el });
    pendingId = id;
    addMarker(id, pickSeq);
    var info = describe(el);
    info.kind = 'pick';
    info.id = id;
    info.viewport = viewport();
    info.scroll = { x: window.scrollX, y: window.scrollY };
    try { console.log(MARK + JSON.stringify(info)); } catch (error) {}
  }
  picker = installRegionPicker(document, {
    ignore: function () { return false; },
    blocked: function () { return frozen || capturing; },
    bounds: viewport,
    click: pickElement,
    preview: function (rect) {
      hide();
      if (!rect) return;
      Object.assign(box.style, { display: 'block', left: rect.x + 'px', top: rect.y + 'px', width: rect.width + 'px', height: rect.height + 'px' });
    },
    select: function (rect) {
      frozen = true;
      var id = instance + ':r' + String(++pickSeq);
      pendingId = id;
      addMarker(id, pickSeq);
      var anchor = hit(rect.x + rect.width / 2, rect.y + rect.height / 2) || hit(rect.x + 2, rect.y + 2);
      if (anchor) {
        var bounds = anchor.getBoundingClientRect();
        picks.push({ id: id, el: anchor, region: rect, chain: scrollChain(anchor),
          base: { left: bounds.left, top: bounds.top },
          offset: { dx: rect.x - bounds.left, dy: rect.y - bounds.top } });
      }
      emit({ kind: 'region', id: id, rect: rect, viewport: viewport(), scroll: { x: scrollX, y: scrollY } });
    }
  });
  function onKey(event) {
    if (event.key !== 'Escape') return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (!picker.cancel()) emit({ kind: 'escape' });
  }
  function onBlur() { picker.cancel(); }
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('blur', onBlur);
  document.documentElement.appendChild(box);
  document.documentElement.appendChild(label);
  document.documentElement.appendChild(layer);
  monitorFrame = requestAnimationFrame(monitor);
  window.__dshAnnotate = {
    freeze: function () { frozen = true; picker.cancel(); },
    prepareCapture: async function (expected) {
      var now = viewport();
      if (expected && !['width', 'height', 'instance'].every(function (key) { return now[key] === expected[key]; })) return null;
      capturing = true; hide();
      if (!markerLayer) markers();
      markerLayer.style.visibility = 'hidden';
      await new Promise(function (resolve) { requestAnimationFrame(function () { requestAnimationFrame(resolve); }); });
      return window.__dshAnnotate && window.__dshAnnotate.captureValid(now) ? now : null;
    },
    captureValid: function (expected) {
      var now = viewport();
      return !!expected && ['width', 'height', 'instance'].every(function (key) { return now[key] === expected[key]; });
    },
    finishCapture: function () {
      capturing = false;
      if (markerLayer) markerLayer.style.visibility = '';
      if (!frozen) hide();
    },
    resume: function () {
      frozen = false;
      picker.cancel();
      frozenEl = null;
      frozenEl = null;
      box.style.display = 'none';
      label.style.display = 'none';
    },
    scroll: reportScroll,
    adopt: adopt,
    forget: function (id) { if (typeof id === 'string') { dropMarker(id); if (pendingId === id) pendingId = null; } },
    /** Current viewport rects of every tracked pick, for host-side polling. */
    geometry: function () {
      var out = [];
      for (var i = 0; i < picks.length; i += 1) {
        var entry = picks[i];
        var rect;
        if (entry.region) rect = regionNow(entry);
        else if (entry.el && entry.el.isConnected) {
          var bounds = entry.el.getBoundingClientRect();
          rect = { x: Math.round(bounds.left), y: Math.round(bounds.top), width: Math.round(bounds.width), height: Math.round(bounds.height) };
        }
        if (rect) out.push({ id: entry.id, rect: rect });
      }
      return out;
    },
    destroy: function () {
      picker.destroy();
      cancelAnimationFrame(monitorFrame);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mousemove', onHover, true);
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('contextmenu', onContext, true);
      picks = [];
      adopted = [];
      markerNodes.clear();
      try { layer.remove(); box.remove(); label.remove(); cursorStyle.remove(); } catch (error) {}
      try { if (markerLayer) markerLayer.remove(); } catch (error) {}
      window.removeEventListener('scroll', reportScroll, true);
      window.removeEventListener('resize', reportScroll, true);
      window.__dshAnnotate = null;
    }
  };
  emit({ kind: 'ready', width: innerWidth, height: innerHeight, x: scrollX, y: scrollY, revision: revision });
  return true;
})()`;
    var GUEST_FREEZE2 = `(function () {
  if (window.__dshAnnotate && window.__dshAnnotate.freeze) window.__dshAnnotate.freeze();
  return true;
})()`;
    var GUEST_RESUME2 = `(function () {
  if (window.__dshAnnotate && window.__dshAnnotate.resume) window.__dshAnnotate.resume();
  return true;
})()`;
    var GUEST_REMOVE2 = `(function () {
  if (window.__dshAnnotate) { try { window.__dshAnnotate.destroy(); } catch (error) {} }
  window.__dshAnnotate = null;
  return true;
})()`;
    module2.exports = { MARK: MARK2, GUEST_INSTALL: GUEST_INSTALL2, GUEST_REMOVE: GUEST_REMOVE2, GUEST_FREEZE: GUEST_FREEZE2, GUEST_RESUME: GUEST_RESUME2 };
  }
});

// src/client.cjs
var React = require("react");
var ReactDOM = require("react-dom");
var {
  CaptureError,
  captureErrorKey,
  captureHostViewport,
  captureGuestViewport,
  drawAnnotations
} = require_capture();
var { clipRect, installRegionPicker } = require_region();
var { describeElement, dataUrlToBytes, formatInsertText, clip } = require_lib2();
var { MARK, GUEST_INSTALL, GUEST_REMOVE, GUEST_FREEZE, GUEST_RESUME } = require_guest();
var NS = "annotateViewport";
var UI = "[data-annot-ui]";
var BOX = "#ff3b30";
var ACTION = "#2f6feb";
var ACTION_HOVER = "#245fd6";
var CSS2 = `
.dsh-annot-trigger{position:relative;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;flex:none}
.dsh-annot-trigger__badge{position:absolute;top:-2px;right:-3px;min-width:13px;height:13px;padding:0 3px;border-radius:7px;background:${ACTION};color:#fff;font:600 9px/13px system-ui,sans-serif;text-align:center}
.dsh-annot-trigger:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-annot-trigger--active{background:color-mix(in srgb,${ACTION} 16%,transparent);color:${ACTION}}
.dsh-annot-layer{position:fixed;inset:0;z-index:9000;pointer-events:none}
.dsh-annot-bar{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:6px 8px 6px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 6px 24px rgba(0,0,0,.18);font:12px/1.4 system-ui,-apple-system,sans-serif;pointer-events:auto;max-width:min(820px,94vw)}
.dsh-annot-bar__hint{color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:340px}
.dsh-annot-bar__count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:${ACTION};color:#fff;font-weight:600}
.dsh-annot-bar__warn{color:#b45309;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px}
.dsh-annot-chip{appearance:none;min-width:22px;height:22px;padding:0 6px;border:1px solid ${BOX};background:color-mix(in srgb,${BOX} 12%,transparent);color:${BOX};border-radius:11px;font:600 11px/1 system-ui,sans-serif;cursor:pointer}
.dsh-annot-chip:hover{background:color-mix(in srgb,${BOX} 22%,transparent)}
.dsh-annot-btn{appearance:none;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:7px;padding:4px 10px;font:12px/1.3 inherit;cursor:pointer;white-space:nowrap}
.dsh-annot-btn:hover:enabled{background:var(--dsw-alias-bg-layer-2)}
.dsh-annot-btn:disabled{opacity:.5;cursor:default}
.dsh-annot-btn--primary{border-color:transparent;background:${ACTION};color:#fff}
.dsh-annot-btn--primary:hover:enabled{background:${ACTION_HOVER};filter:none}
.dsh-annot-btn--danger{color:var(--dsw-alias-state-error-primary)}
.dsh-annot-hover{position:fixed;pointer-events:none;border:2px solid var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 14%,transparent);border-radius:3px;box-sizing:border-box}
.dsh-annot-hover__tag{position:fixed;pointer-events:none;max-width:60vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:1px 6px;border-radius:4px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff);font:11px/1.5 system-ui,-apple-system,sans-serif}
.dsh-annot-outline{position:fixed;pointer-events:none;border:2px solid ${BOX};border-radius:3px;box-sizing:border-box;box-shadow:0 0 0 1px rgba(255,255,255,.85)}
.dsh-annot-pin{position:fixed;pointer-events:auto;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:0;border-radius:11px;background:${BOX};color:#fff;font:600 12px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.28)}
.dsh-annot-card{position:fixed;width:320px;pointer-events:auto;padding:10px;display:flex;flex-direction:column;gap:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 10px 30px rgba(0,0,0,.22);font:12px/1.45 system-ui,-apple-system,sans-serif}
.dsh-annot-card__title{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-annot-card__input{width:100%;box-sizing:border-box;resize:vertical;min-height:64px;padding:6px 8px;border-radius:7px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit}
.dsh-annot-card__input:focus{outline:2px solid ${ACTION};outline-offset:0}
.dsh-annot-card__where{color:var(--dsw-alias-label-secondary);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-annot-card__rows{display:flex;gap:6px;justify-content:flex-end}
.dsh-annot-error{position:fixed;bottom:62px;left:50%;transform:translateX(-50%);pointer-events:none;max-width:80vw;padding:6px 12px;border-radius:8px;background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-label-primary-foreground,#fff);font:12px/1.4 system-ui,-apple-system,sans-serif;z-index:9001}
.dsh-annot-fab{position:fixed;right:18px;bottom:18px;z-index:9000;display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 4px 16px rgba(0,0,0,.18);font:12px/1 system-ui,-apple-system,sans-serif;cursor:pointer;pointer-events:auto;opacity:.94}
.dsh-annot-fab:hover{opacity:1;background:var(--dsw-alias-bg-layer-1)}
.dsh-annot-fab__icon{color:${ACTION};display:inline-flex}
`;
var ICON = React.createElement(
  "svg",
  { viewBox: "0 0 16 16", width: 16, height: 16, "aria-hidden": true, focusable: false },
  React.createElement("path", {
    d: "M2.5 2.5h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8l-3 2.5V11.5H2.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinejoin: "round"
  }),
  React.createElement("rect", { x: 3.5, y: 4.5, width: 9, height: 6, rx: 1, fill: "none", stroke: "currentColor", strokeWidth: 1, strokeDasharray: "2 1.4" })
);
function createStore() {
  let state = { active: false, sessionId: void 0, count: 0 };
  const listeners = /* @__PURE__ */ new Set();
  return {
    get: () => state,
    set(patch) {
      state = Object.assign({}, state, patch);
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
function boxOf(rect) {
  if (!rect) return null;
  const x = rect.x !== void 0 ? rect.x : rect.left;
  const y = rect.y !== void 0 ? rect.y : rect.top;
  const width = rect.width;
  const height = rect.height;
  if (![x, y, width, height].every(Number.isFinite) || width < 1 || height < 1) return null;
  return { x, y, width, height };
}
function Trigger({ props, store, t }) {
  const state = React.useSyncExternalStore(store.subscribe, store.get, store.get);
  React.useEffect(() => {
    store.set({ sessionId: props && props.sessionId });
  }, [props && props.sessionId]);
  return React.createElement(
    "button",
    {
      type: "button",
      "data-annot-ui": "trigger",
      className: "dsh-annot-trigger" + (state.active ? " dsh-annot-trigger--active" : ""),
      title: state.count > 0 ? t("trigger.titleCount", { count: state.count }) : t("trigger.title"),
      "aria-label": t("trigger.title"),
      "aria-pressed": state.active,
      onClick: () => store.set({ active: !state.active })
    },
    ICON,
    state.count > 0 && !state.active ? React.createElement("span", { className: "dsh-annot-trigger__badge" }, String(state.count)) : null
  );
}
function Overlay({ ctx, store, t }) {
  const state = React.useSyncExternalStore(store.subscribe, store.get, store.get);
  const [items, setItems] = React.useState([]);
  const [draft, setDraftState] = React.useState(null);
  const [hover, setHover] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [, setTick] = React.useState(0);
  const itemsRef = React.useRef(items);
  const draftRef = React.useRef(null);
  const basesRef = React.useRef(/* @__PURE__ */ new Map());
  const guestStatesRef = React.useRef(/* @__PURE__ */ new Map());
  const guestsRef = React.useRef([]);
  const captureChainsRef = React.useRef(/* @__PURE__ */ new Map());
  const pickerRef = React.useRef(null);
  const commentRef = React.useRef(null);
  const seqRef = React.useRef(0);
  const sessionRef = React.useRef(void 0);
  const busyRef = React.useRef(false);
  itemsRef.current = items;
  draftRef.current = draft;
  busyRef.current = busy;
  const setDraft = (value) => {
    draftRef.current = value;
    setDraftState(value);
  };
  const bump = () => setTick((value) => value + 1);
  const boxKey = (surface, st) => {
    if (!st) return "";
    return [
      surface,
      st.instance || "",
      Math.round(st.x || 0),
      Math.round(st.y || 0),
      Math.round(st.width || 0),
      Math.round(st.height || 0)
    ].join("|");
  };
  const hostState = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    x: window.scrollX,
    y: window.scrollY,
    instance: "harness"
  });
  const guestState = (wv) => guestStatesRef.current.get(wv) || null;
  const currentKey = (surface, wv) => boxKey(surface, surface === "browser" ? guestState(wv) : hostState());
  const itemVisible = (item) => {
    if (!item || !item.key) return false;
    return item.key === currentKey(item.surface, item.wv);
  };
  const isUiTarget = (target) => target instanceof Element && !!target.closest(UI);
  const pickAt = (x, y) => {
    const list = document.elementsFromPoint(x, y);
    for (const el of list) {
      if (el instanceof Element && el.closest(UI)) continue;
      return el;
    }
    return null;
  };
  const ensureBase = (surface, wv, st) => {
    const key = boxKey(surface, st);
    const existing = basesRef.current.get(key);
    if (existing && existing.status !== "error") return existing;
    if (existing) basesRef.current.delete(key);
    const base = {
      key,
      surface,
      wv: wv || null,
      state: Object.assign({}, st),
      viewport: { width: st.width, height: st.height },
      dataUrl: null,
      image: null,
      url: surface === "browser" ? safeGuestUrl(wv) : location.href,
      status: "capturing",
      errorKey: null,
      ready: null
    };
    basesRef.current.set(key, base);
    const chainKey = wv || "harness";
    const previous = captureChainsRef.current.get(chainKey) || Promise.resolve();
    const run = previous.catch(() => {
    }).then(async () => {
      const shot = surface === "browser" ? await captureGuestViewport(wv) : await captureHostViewport();
      const now = shot.viewport || {};
      const moved = Math.abs((now.x || 0) - (base.state.x || 0)) > 1 || Math.abs((now.y || 0) - (base.state.y || 0)) > 1 || Math.round(now.width) !== Math.round(base.state.width) || Math.round(now.height) !== Math.round(base.state.height) || now.instance && base.state.instance && now.instance !== base.state.instance;
      if (moved) throw new CaptureError("changed");
      return shot;
    });
    captureChainsRef.current.set(chainKey, run.catch(() => {
    }));
    base.ready = run.then((shot) => {
      base.dataUrl = shot.dataUrl;
      base.image = shot.image;
      base.skipped = shot.skipped || 0;
      base.viewport = { width: shot.viewport.width, height: shot.viewport.height };
      base.state = Object.assign({}, base.state, {
        x: shot.viewport.x,
        y: shot.viewport.y,
        width: shot.viewport.width,
        height: shot.viewport.height
      });
      base.status = "ready";
      bump();
    }).catch((failure) => {
      base.status = "error";
      base.errorKey = captureErrorKey(failure);
      bump();
    });
    return base;
  };
  const addItem = (surface, wv, st, rect, desc, guestId) => {
    const state2 = Object.assign({}, st);
    const item = {
      id: "a" + Math.random().toString(36).slice(2),
      index: ++seqRef.current,
      key: boxKey(surface, state2),
      state: state2,
      surface,
      wv: wv || null,
      guestId: guestId || null,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      desc: desc || {},
      comment: ""
    };
    setItems((prev) => prev.concat([item]));
    return item;
  };
  const openDraft = (item) => {
    setError("");
    setDraft({ itemId: item.id, comment: item.comment || "", editing: true });
  };
  const clearAll = (resetSeq) => {
    setItems([]);
    itemsRef.current = [];
    basesRef.current.clear();
    if (resetSeq) seqRef.current = 0;
    setDraft(null);
    setHover(null);
    store.set({ count: 0 });
  };
  const removeItem = (id) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id));
    setDraft(null);
  };
  const saveComment = () => {
    const current = draftRef.current;
    if (!current) return;
    const area = commentRef.current;
    const comment = area ? area.value : current.comment || "";
    const item = itemsRef.current.find((entry) => entry.id === current.itemId);
    setItems((prev) => prev.map((entry) => entry.id === current.itemId ? Object.assign({}, entry, { comment }) : entry));
    setDraft(null);
    if (item && item.state && !basesRef.current.has(item.key)) ensureBase(item.surface, item.wv, item.state);
  };
  const targetTitle = () => {
    try {
      const id = activeSessionId(ctx, state);
      const sessions = ctx.get("sessions");
      const byId = sessions && sessions.list ? sessions.list.getSnapshot().byId : void 0;
      const entry = byId && id ? byId[id] : void 0;
      return entry && (entry.title || entry.name) || t("bar.currentChat");
    } catch (_error) {
      return t("bar.currentChat");
    }
  };
  React.useEffect(() => {
    store.set({ count: items.length });
  }, [items.length]);
  React.useEffect(() => {
    if (!error) return void 0;
    const timer = setTimeout(() => setError(""), 9e3);
    return () => clearTimeout(timer);
  }, [error]);
  const isActive = state.active;
  React.useEffect(() => {
    if (sessionRef.current === void 0) {
      sessionRef.current = state.sessionId;
      return;
    }
    if (state.sessionId !== sessionRef.current) {
      sessionRef.current = state.sessionId;
      clearAll(true);
    }
  }, [state.sessionId]);
  React.useEffect(() => {
    if (!isActive) {
      setDraft(null);
      setHover(null);
    }
  }, [isActive]);
  React.useEffect(() => {
    if (!isActive) return void 0;
    const guests = [];
    const watched = /* @__PURE__ */ new WeakSet();
    let disposed = false;
    const guestList = (wv) => {
      const st = guestStatesRef.current.get(wv);
      if (!st) return [];
      const key = boxKey("browser", st);
      return itemsRef.current.filter((item) => item.surface === "browser" && item.wv === wv && item.key === key && item.guestId).map((item) => ({ id: item.guestId, index: item.index }));
    };
    const adoptInto = (wv) => {
      try {
        const pending = wv.executeJavaScript(
          "window.__dshAnnotate && window.__dshAnnotate.adopt ? (window.__dshAnnotate.adopt(" + JSON.stringify(guestList(wv)) + "), true) : false"
        );
        if (pending && typeof pending.catch === "function") pending.catch(() => {
        });
      } catch (_error) {
      }
    };
    const detach = (wv) => {
      const index = guests.findIndex((pair) => pair[0] === wv);
      if (index === -1) return;
      try {
        guests[index][0].removeEventListener("console-message", guests[index][1]);
        wv.removeEventListener("did-start-navigation", guests[index][2]);
      } catch (_error) {
      }
      guests.splice(index, 1);
      guestsRef.current = guests;
    };
    const forgetGuest = (wv) => {
      for (const key of Array.from(basesRef.current.keys())) {
        const base = basesRef.current.get(key);
        if (base && base.surface === "browser" && base.wv === wv) basesRef.current.delete(key);
      }
      guestStatesRef.current.delete(wv);
      setItems((prev) => prev.filter((entry) => !(entry.surface === "browser" && entry.wv === wv)));
      setHover(null);
    };
    const onMessage = (wv, ...args) => {
      const message = args.map((value) => typeof value === "string" ? value : value && value.message).find((value) => typeof value === "string" && value.indexOf(MARK) === 0);
      if (!message) return;
      let payload;
      try {
        payload = JSON.parse(message.slice(MARK.length));
      } catch (_error) {
        return;
      }
      if (payload && payload.kind === "escape") {
        onEscape();
        return;
      }
      if (payload && (payload.kind === "ready" || payload.kind === "scroll")) {
        if (Number.isFinite(payload.width) && Number.isFinite(payload.height)) {
          guestStatesRef.current.set(wv, {
            width: payload.width,
            height: payload.height,
            x: Number(payload.x) || 0,
            y: Number(payload.y) || 0,
            instance: payload.instance || ""
          });
        }
        if (payload.kind === "scroll") {
          setHover(null);
          bump();
        }
        return;
      }
      if (payload && payload.kind === "pin") {
        const item2 = itemsRef.current.find((entry) => entry.guestId === payload.id);
        if (item2) openDraft(item2);
        return;
      }
      if (!payload || !["pick", "region"].includes(payload.kind)) return;
      const st = payload.viewport;
      if (!st || !["width", "height", "x", "y"].every((key) => Number.isFinite(st[key]))) return;
      const rect = clipRect(payload.rect, st.width, st.height, payload.kind === "region" ? 4 : 2);
      if (!rect) return;
      guestStatesRef.current.set(wv, {
        width: st.width,
        height: st.height,
        x: st.x,
        y: st.y,
        instance: st.instance || ""
      });
      if (payload.kind === "region") {
        const item2 = addItem(
          "browser",
          wv,
          { width: st.width, height: st.height, x: st.x, y: st.y, instance: st.instance || "" },
          rect,
          { label: t("region.label"), surface: "browser" },
          payload.id
        );
        setDraft({ itemId: item2.id, comment: "", editing: false });
        setHover(null);
        return;
      }
      const item = addItem(
        "browser",
        wv,
        { width: st.width, height: st.height, x: st.x, y: st.y, instance: st.instance || "" },
        rect,
        {
          tag: clip(payload.tag, 40),
          label: clip(payload.label, 90),
          text: clip(payload.text, 200),
          selector: clip(payload.selector, 300)
        },
        payload.id
      );
      setDraft({ itemId: item.id, comment: "", editing: false });
      setHover(null);
    };
    const install = () => {
      if (disposed) return;
      for (const wv of Array.from(document.querySelectorAll("webview"))) {
        if (guests.some((pair) => pair[0] === wv)) continue;
        const rect = wv.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        if (!watched.has(wv)) {
          watched.add(wv);
          wv.addEventListener("did-stop-loading", () => {
            detach(wv);
            install();
          });
        }
        try {
          const pending = wv.executeJavaScript(guestInstallScript());
          if (pending && typeof pending.catch === "function") pending.catch(() => {
          });
        } catch (_error) {
        }
        const handler = (...args) => onMessage(wv, ...args);
        const navigate = () => forgetGuest(wv);
        wv.addEventListener("console-message", handler);
        wv.addEventListener("did-start-navigation", navigate);
        guests.push([wv, handler, navigate]);
      }
      guestsRef.current = guests;
    };
    const uninstall = () => {
      disposed = true;
      for (const pair of guests) {
        try {
          pair[0].removeEventListener("console-message", pair[1]);
          pair[0].removeEventListener("did-start-navigation", pair[2]);
          const pending = pair[0].executeJavaScript(GUEST_REMOVE);
          if (pending && typeof pending.catch === "function") pending.catch(() => {
          });
        } catch (_error) {
        }
      }
      guests.length = 0;
      guestsRef.current = [];
    };
    install();
    const poll = setInterval(() => {
      install();
      if (draftRef.current) return;
      for (const pair of guests) adoptInto(pair[0]);
    }, 200);
    return () => {
      clearInterval(poll);
      uninstall();
    };
  }, [isActive, t]);
  React.useEffect(() => {
    if (!isActive) return void 0;
    const onMove = (event) => {
      if (pickerRef.current && pickerRef.current.isDragging()) return;
      if (draftRef.current || busyRef.current) return;
      if (isUiTarget(event.target)) return;
      const el = pickAt(event.clientX, event.clientY);
      if (!el) {
        setHover(null);
        return;
      }
      if (String(el.tagName).toLowerCase() === "webview") {
        setHover(null);
        return;
      }
      if (String(el.tagName).toLowerCase() === "iframe") {
        setHover(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) {
        setHover(null);
        return;
      }
      setHover({ x: rect.left, y: rect.top, width: rect.width, height: rect.height, desc: describeElement(el) });
    };
    const pickElement = ({ x, y }) => {
      if (draftRef.current || busyRef.current) return;
      const el = pickAt(x, y);
      if (!el) return;
      if (String(el.tagName).toLowerCase() === "webview") {
        setError(t("error.guestHint"));
        return;
      }
      if (String(el.tagName).toLowerCase() === "iframe") {
        setError(t("error.iframeHint"));
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const item = addItem(
        "harness",
        null,
        hostState(),
        { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
        describeElement(el),
        null
      );
      setDraft({ itemId: item.id, comment: "", editing: false });
      setHover(null);
    };
    const stop = (event) => {
      if (isUiTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const onEscape2 = () => {
      if (pickerRef.current && pickerRef.current.cancel()) return;
      const current = draftRef.current;
      if (current) {
        const item = itemsRef.current.find((entry) => entry.id === current.itemId);
        if (!current.editing && item) removeItem(item.id);
        else setDraft(null);
        return;
      }
      store.set({ active: false });
    };
    const escapeHandler = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onEscape2();
    };
    const picker = installRegionPicker(document, {
      ignore: (event) => isUiTarget(event.target),
      blocked: () => !!draftRef.current || busyRef.current,
      bounds: () => ({ width: window.innerWidth, height: window.innerHeight }),
      preview: setHover,
      click: pickElement,
      select: (rect) => {
        const overlapsGuest = Array.from(document.querySelectorAll("webview")).some((wv) => {
          const b = wv.getBoundingClientRect();
          return rect.x < b.right && rect.x + rect.width > b.left && rect.y < b.bottom && rect.y + rect.height > b.top;
        });
        if (overlapsGuest) {
          setError(t("error.guestHint"));
          return;
        }
        const overlapsFrame = Array.from(document.querySelectorAll("iframe")).some((frame) => {
          const b = frame.getBoundingClientRect();
          return rect.x < b.right && rect.x + rect.width > b.left && rect.y < b.bottom && rect.y + rect.height > b.top;
        });
        if (overlapsFrame) {
          setError(t("error.iframeHint"));
          return;
        }
        const item = addItem("harness", null, hostState(), rect, { label: t("region.label"), surface: "harness" }, null);
        setDraft({ itemId: item.id, comment: "", editing: false });
      }
    });
    pickerRef.current = picker;
    const onScroll = (event) => {
      if (isUiTarget(event.target)) return;
      setHover(null);
      bump();
    };
    const onBlur = () => picker.cancel();
    window.addEventListener("blur", onBlur);
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("mousedown", stop, true);
    document.addEventListener("pointerdown", stop, true);
    document.addEventListener("click", stop, true);
    document.addEventListener("keydown", escapeHandler, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll, true);
    return () => {
      picker.destroy();
      pickerRef.current = null;
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("mousedown", stop, true);
      document.removeEventListener("pointerdown", stop, true);
      document.removeEventListener("click", stop, true);
      document.removeEventListener("keydown", escapeHandler, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll, true);
    };
  }, [isActive, t]);
  const onEscape = () => {
    if (draftRef.current) {
      const current = draftRef.current;
      const item = itemsRef.current.find((entry) => entry.id === current.itemId);
      if (!current.editing && item) removeItem(item.id);
      else setDraft(null);
      return;
    }
    store.set({ active: false });
  };
  React.useEffect(() => {
    if (!isActive) return;
    const code = draft ? GUEST_FREEZE : GUEST_RESUME;
    for (const pair of guestsRef.current) {
      try {
        const pending = pair[0].executeJavaScript(code);
        if (pending && typeof pending.catch === "function") pending.catch(() => {
        });
      } catch (_error) {
      }
    }
  }, [draft, isActive]);
  const insert = async () => {
    if (busyRef.current) return;
    if (itemsRef.current.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const conversation = ctx.get("conversation");
      const sessions = ctx.get("sessions");
      const sessionId = activeSessionId(ctx, state);
      const session = sessionId && sessions ? (sessions.binding(sessionId) || {}).session : void 0;
      if (!conversation || !session || !sessionId) throw new Error(t("error.noSession"));
      const shell = conversation.input && conversation.input.shell ? conversation.input.shell(sessionId) : null;
      if (!shell || typeof shell.addAttachments !== "function") throw new Error(t("error.noComposer"));
      if (shell.snapshot && ["adjudicating", "submitting", "sending"].includes(shell.snapshot.phase)) {
        throw new Error(t("error.composerBusy"));
      }
      const ordered = itemsRef.current.slice().sort((a, b) => a.index - b.index);
      const keys = [];
      for (const item of ordered) if (!keys.includes(item.key)) keys.push(item.key);
      for (const key of keys) {
        let base = basesRef.current.get(key);
        if (!base) {
          const item = ordered.find((entry) => entry.key === key);
          if (!item) throw new Error(t("error.captureFailed"));
          base = ensureBase(item.surface, item.wv, item.state);
        }
        if (base.ready) await base.ready;
        if (!base.dataUrl) throw new Error(t(base.errorKey || "error.captureFailed"));
      }
      const groups = [];
      for (const key of keys) {
        const base = basesRef.current.get(key);
        const groupItems = ordered.filter((item) => item.key === key);
        if (!groupItems.length) continue;
        const dataUrl = await drawAnnotations(base, groupItems);
        groups.push({ base, items: groupItems, dataUrl, url: base.url });
      }
      if (!groups.length) throw new Error(t("error.captureFailed"));
      const imageLimit = imageLimitOf(session);
      if (groups.length > imageLimit) {
        throw new Error(t("error.tooManyShots", { count: groups.length, limit: imageLimit }));
      }
      const files = groups.map((group, index) => {
        const decoded = dataUrlToBytes(group.dataUrl);
        return new File([decoded.bytes], "annotation-" + (index + 1) + ".png", { type: decoded.mediaType });
      });
      const snapshot = session.getSnapshot ? session.getSnapshot() : {};
      const uploadImages = snapshot.subagent === null;
      if (typeof conversation.createDrafts !== "function") throw new Error(t("error.unsupportedApi"));
      const drafts = conversation.createDrafts(sessionId, files, uploadImages) || [];
      if (!drafts.length) throw new Error(t("error.captureFailed"));
      const added = shell.addAttachments(drafts.map((entry) => entry.id));
      if (!added) {
        if (typeof conversation.releaseDraftAttachments === "function") conversation.releaseDraftAttachments(drafts);
        throw new Error(t("error.composerBusy"));
      }
      const text = formatInsertText(
        groups.map((group) => ({
          url: group.url,
          viewport: group.base.viewport,
          scroll: group.base.state,
          items: group.items
        })),
        t
      );
      const skipped = groups.reduce((sum, group) => sum + (group.base.skipped || 0), 0);
      const caption = skipped > 0 ? text + "\n" + t("insert.skipped", { count: skipped }) : text;
      const typed = String(shell.snapshot && shell.snapshot.draft || "");
      shell.setDraft(typed.trim() ? typed.replace(/\s+$/, "") + "\n\n" + caption : caption);
      try {
        if (typeof shell.focus === "function") shell.focus();
      } catch (_error) {
      }
      clearAll(true);
      store.set({ active: false });
    } catch (failure) {
      setError(failure instanceof CaptureError ? t(captureErrorKey(failure)) : String(failure && failure.message || failure));
    } finally {
      setBusy(false);
    }
  };
  if (!isActive) {
    return ReactDOM.createPortal(
      React.createElement(
        "div",
        { "data-annot-ui": "layer", className: "dsh-annot-layer" },
        React.createElement(
          "button",
          {
            type: "button",
            "data-annot-ui": "fab",
            className: "dsh-annot-fab",
            title: t("fab.title"),
            onClick: () => {
              const sessionId = activeSessionId(ctx, state);
              if (sessionId && sessionId !== state.sessionId) store.set({ sessionId });
              store.set({ active: true });
            }
          },
          React.createElement("span", { className: "dsh-annot-fab__icon" }, ICON),
          React.createElement("span", null, t("fab.label"))
        )
      ),
      document.body
    );
  }
  const draftItem = draft ? itemsRef.current.find((item) => item.id === draft.itemId) : null;
  const children = [];
  const pendingBases = Array.from(basesRef.current.values()).filter((base) => base.status === "capturing").length;
  const readyBases = Array.from(basesRef.current.values()).filter((base) => base.status === "ready").length;
  children.push(
    React.createElement(
      "div",
      { key: "bar", "data-annot-ui": "bar", className: "dsh-annot-bar" },
      React.createElement(
        "span",
        { className: "dsh-annot-bar__hint" },
        t(draft ? "bar.hintDraft" : pendingBases > 0 ? "bar.capturing" : "bar.hint")
      ),
      React.createElement("span", { className: "dsh-annot-bar__count" }, String(items.length)),
      items.length > 0 && readyBases > 0 ? React.createElement("span", { className: "dsh-annot-bar__hint" }, t("bar.shots", { count: readyBases })) : null,
      items.length > 30 ? React.createElement("span", { className: "dsh-annot-bar__warn" }, t("bar.manyItems", { count: items.length })) : null,
      ...items.filter((item) => !itemVisible(item)).map(
        (item) => React.createElement(
          "button",
          {
            key: "chip-" + item.id,
            type: "button",
            className: "dsh-annot-chip",
            "data-annot-ui": "chip",
            title: item.comment || t("pin.empty"),
            onClick: () => openDraft(item),
            disabled: busy
          },
          String(item.index)
        )
      ),
      items.length > 0 ? React.createElement("button", { key: "clear", className: "dsh-annot-btn dsh-annot-btn--danger", onClick: () => clearAll(true) }, t("bar.clear")) : null,
      React.createElement(
        "button",
        {
          key: "insert",
          className: "dsh-annot-btn dsh-annot-btn--primary",
          disabled: items.length === 0 || busy || !!draft,
          title: t("bar.insertTarget", { title: targetTitle() }),
          onClick: insert
        },
        busy ? t("bar.inserting") : t("bar.insert", { count: items.length })
      ),
      React.createElement("button", { key: "close", className: "dsh-annot-btn", onClick: () => {
        setDraft(null);
        store.set({ active: false });
      } }, t("bar.close"))
    )
  );
  const hoverRect = hover ? boxOf(hover) : null;
  if (hover && hoverRect && !draft) {
    const label = clip(hover.desc && (hover.desc.label || hover.desc.tag) || "", 60);
    children.push(
      React.createElement("div", { key: "hover", className: "dsh-annot-hover", style: { left: hoverRect.x, top: hoverRect.y, width: hoverRect.width, height: hoverRect.height } })
    );
    children.push(
      React.createElement(
        "div",
        {
          key: "hovertag",
          className: "dsh-annot-hover__tag",
          style: { left: Math.max(4, hoverRect.x), top: hoverRect.y + 2 < 24 ? hoverRect.y + 2 : hoverRect.y - 18 }
        },
        (hover.desc ? hover.desc.tag : "") + (label ? " \xB7 " + label : "")
      )
    );
  }
  items.forEach((item) => {
    if (item.surface === "browser") return;
    if (item.id === (draft && draft.itemId)) return;
    if (!itemVisible(item)) return;
    const rect = boxOf(item.rect);
    if (!rect) return;
    children.push(
      React.createElement("div", {
        key: "outline-" + item.id,
        className: "dsh-annot-outline",
        style: { left: rect.x, top: rect.y, width: rect.width, height: rect.height }
      })
    );
    children.push(
      React.createElement(
        "button",
        {
          key: "pin-" + item.id,
          "data-annot-ui": "pin",
          className: "dsh-annot-pin",
          style: { left: Math.max(0, rect.x - 11), top: Math.max(0, rect.y - 11) },
          title: item.comment || t("pin.empty"),
          disabled: busy,
          onClick: () => openDraft(item)
        },
        String(item.index)
      )
    );
  });
  if (draft) {
    let rect = draftItem ? boxOf(draftItem.rect) : null;
    if (draftItem && draftItem.surface === "browser" && draftItem.wv) {
      const st = guestState(draftItem.wv);
      const outer = draftItem.wv.getBoundingClientRect();
      if (st && st.width > 0 && rect) {
        const scale = outer.width / st.width;
        rect = { x: outer.left + rect.x * scale, y: outer.top + rect.y * scale, width: rect.width * scale, height: rect.height * scale };
      }
    }
    const anchor = rect || { x: 48, y: 72, width: 0, height: 0 };
    const width = 320;
    const left = Math.max(8, Math.min(anchor.x, (window.innerWidth || 1200) - width - 8));
    const below = anchor.y + anchor.height + 8;
    const top = below + 230 > (window.innerHeight || 800) ? Math.max(8, anchor.y - 230) : below;
    const label = draftItem && draftItem.desc && (draftItem.desc.label || draftItem.desc.tag) || "";
    const where = draftItem ? draftItem.surface === "browser" ? t("card.browser") : draftItem.desc && draftItem.desc.selector ? draftItem.desc.selector : "" : "";
    children.push(
      React.createElement(
        "div",
        { key: "card", "data-annot-ui": "card", className: "dsh-annot-card", style: { left, top } },
        React.createElement("div", { className: "dsh-annot-card__title" }, clip(label, 70)),
        React.createElement("textarea", {
          key: draft.itemId,
          className: "dsh-annot-card__input",
          ref: commentRef,
          autoFocus: true,
          rows: 3,
          placeholder: t("card.placeholder"),
          defaultValue: draft.comment,
          onKeyDown: (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              event.stopPropagation();
              saveComment();
            }
          }
        }),
        React.createElement("div", { className: "dsh-annot-card__where" }, where),
        React.createElement(
          "div",
          { className: "dsh-annot-card__rows" },
          React.createElement(
            "button",
            {
              key: "cancel",
              className: "dsh-annot-btn",
              onClick: () => {
                if (!draft.editing) removeItem(draft.itemId);
                else setDraft(null);
              }
            },
            t("card.cancel")
          ),
          draft.editing ? React.createElement("button", { key: "delete", className: "dsh-annot-btn dsh-annot-btn--danger", onClick: () => removeItem(draft.itemId) }, t("card.delete")) : null,
          React.createElement(
            "button",
            {
              key: "save",
              className: "dsh-annot-btn dsh-annot-btn--primary",
              onClick: saveComment
            },
            t("card.save")
          )
        )
      )
    );
  }
  if (error) children.push(React.createElement("div", { key: "error", "data-annot-ui": "error", className: "dsh-annot-error" }, error));
  return ReactDOM.createPortal(
    React.createElement("div", { "data-annot-ui": "layer", className: "dsh-annot-layer" }, children),
    document.body
  );
}
function safeGuestUrl(wv) {
  try {
    return wv && wv.getURL && wv.getURL() || "";
  } catch (_error) {
    return "";
  }
}
function imageLimitOf(session) {
  try {
    const face = session && session.projections && session.projections.faceOf ? session.projections.faceOf("imageLimits") : void 0;
    const snapshot = face && face.getSnapshot ? face.getSnapshot() : void 0;
    const limit = snapshot && (snapshot.maxImagesPerMessage || snapshot.limits && snapshot.limits.maxImagesPerMessage);
    if (Number.isFinite(limit) && limit > 0) return limit;
  } catch (_error) {
  }
  return 20;
}
function sessionIdFromDom() {
  try {
    const frames = Array.from(document.querySelectorAll("webview[data-sidebar-browser-frame]"));
    for (const frame of frames) {
      const rect = frame.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) continue;
      if (rect.right <= 0 || rect.bottom <= 0 || rect.left >= window.innerWidth || rect.top >= window.innerHeight) continue;
      const host = frame.closest("[data-sidebar-right-session]");
      const id = host && host.getAttribute("data-sidebar-right-session");
      if (id) return id;
    }
  } catch (_error) {
  }
  return void 0;
}
function activeSessionId(ctx, state) {
  try {
    const uiSession = ctx.get("uiSession");
    const current = uiSession && uiSession.current && uiSession.current.getSnapshot ? uiSession.current.getSnapshot() : void 0;
    if (current && current.sessionId) return current.sessionId;
  } catch (_error) {
  }
  try {
    const right = ctx.get("sidebarRight");
    const mounted = right && right.mounted && right.mounted.getSnapshot();
    if (mounted) return mounted;
  } catch (_error) {
  }
  if (state && state.sessionId) return state.sessionId;
  return sessionIdFromDom();
}
function guestInstallScript() {
  const root = getComputedStyle(document.documentElement);
  const read = (name, fallback) => (root.getPropertyValue(name) || "").trim() || fallback;
  const accent = read("--dsw-alias-button-primary-fill", read("--dsw-alias-brand-primary", "#3b82f6"));
  const onAccent = read("--dsw-alias-label-primary-foreground", "#fff");
  return GUEST_INSTALL.split("__BOX__").join(BOX).split("__ACCENT__").join(accent).split("__ON_ACCENT__").join(onAccent);
}
function apply(ctx) {
  ctx.effect(() => {
    if (typeof document === "undefined") return void 0;
    const marker = "dsh-annotate-viewport/client.css";
    if (document.querySelector('style[data-plugin-css="' + marker + '"]') === null) {
      const style = document.createElement("style");
      style.dataset.plugin = "dsh-annotate-viewport";
      style.dataset.pluginCss = marker;
      style.textContent = CSS2;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.querySelector('style[data-plugin-css="' + marker + '"]');
      if (style) style.remove();
    };
  }, "annotate-viewport: styles");
  ctx.effect(() => ctx.locale.register(NS, { en: DICT_EN, zh: DICT_ZH }), "annotate-viewport: dictionaries");
  const t = ctx.locale.bind(NS);
  const store = createStore();
  ctx.slots.inject(
    "conversation.input.left",
    () => ctx.slots.register(
      { name: "conversation.input.left", id: "annotate-viewport-trigger", order: 95, locale: NS, label: () => t("trigger.title") },
      (props) => React.createElement(Trigger, { props, store, t })
    )
  );
  ctx.slots.inject(
    "shell.overlay",
    () => ctx.slots.register(
      { name: "shell.overlay", id: "annotate-viewport-overlay", order: 400 },
      () => React.createElement(Overlay, { ctx, store, t })
    )
  );
}
var DICT_EN = {
  "trigger.title": "Annotate",
  "trigger.titleCount": "Annotate \u2014 {count} kept",
  "fab.label": "Annotate",
  "fab.title": "Annotate the browser page or the Harness UI",
  "bar.hint": "Click an element, or drag over a region of the page",
  "bar.hintDraft": "Describe this annotation",
  "bar.capturing": "Taking a full screenshot\u2026",
  "bar.shots": "screenshots: {count}",
  "bar.manyItems": "{count} annotations \u2014 numbering may get hard to follow; keep it to \u226430 per screenshot",
  "bar.insert": "Insert {count} into input",
  "bar.inserting": "Inserting\u2026",
  "bar.insertTarget": "Insert into: {title}",
  "bar.currentChat": "current chat",
  "bar.clear": "Clear",
  "bar.close": "Close",
  "region.label": "Selected region",
  "card.placeholder": "What should change here?",
  "card.save": "Add",
  "card.cancel": "Cancel",
  "card.delete": "Delete",
  "card.browser": "Inside the Browser page",
  "pin.empty": "No comment",
  "pin.edit": "Edit annotation {index}",
  "insert.head": "Red boxes in the screenshots below mark the places to look at; numbers match the comments:",
  "insert.shot": "Screenshot: {url} (viewport {width}\xD7{height}, scroll {x}, {y})",
  "insert.item": "{index}. {label} \u2014 {comment}",
  "insert.noComment": "(no comment)",
  "insert.where": "   selector: {selector}",
  "insert.rect": "   rect: x={x}, y={y}, w={width}, h={height}",
  "insert.skipped": "({count} image(s) could not be rendered and were skipped)",
  "insert.regionLabel": "Region",
  "error.noSession": "Open a chat before inserting annotations",
  "error.noComposer": "The target chat has no composer available. Open that chat and try again.",
  "error.unsupportedApi": "This Harness version does not expose image drafts. Update Harness before inserting.",
  "error.composerBusy": "The composer is busy; finish or cancel the current send first.",
  "error.captureFailed": "The screenshot could not be produced. Try again.",
  "error.captureInvalid": "The viewport is not available. Try again.",
  "error.captureTooLarge": "This viewport is too large to capture. Resize the window or zoom out.",
  "error.captureAssets": "A style or image in the page could not be rendered. Unreachable images are now skipped automatically; refresh and retry, or annotate another page.",
  "error.captureProtected": "The page contains protected canvas/video pixels that cannot be read.",
  "error.captureDecode": "The screenshot could not be decoded.",
  "error.captureChanged": "The page scrolled, resized or navigated during capture. Take the annotation again.",
  "error.captureGuestUnavailable": "This Browser tab does not expose screenshot capture.",
  "error.captureGuestFailed": "The Browser tab could not capture its viewport.",
  "error.tooManyShots": "This insert would create {count} screenshots, over the {limit}-image limit for one message. Annotate fewer scroll positions, or insert in several batches.",
  "error.guestHint": "Pick inside the page content, not the tab frame",
  "error.iframeHint": "This HTML preview runs in a sandboxed iframe and cannot be captured. Switch the preview to plain text/code, then annotate.",
  "meta.title": "Annotate viewport",
  "meta.description": "Take one full screenshot per viewport, mark places with numbered red boxes, and insert them into the composer with your comments."
};
var DICT_ZH = {
  "trigger.title": "\u6807\u6CE8",
  "trigger.titleCount": "\u6807\u6CE8 \u2014 \u5DF2\u4FDD\u7559 {count} \u6761",
  "fab.label": "\u6807\u6CE8",
  "fab.title": "\u6807\u6CE8\u6D4F\u89C8\u5668\u9875\u9762\u6216 Harness \u754C\u9762",
  "bar.hint": "\u70B9\u51FB\u5143\u7D20\uFF0C\u6216\u5728\u9875\u9762\u4E0A\u62D6\u51FA\u4E00\u4E2A\u533A\u57DF",
  "bar.hintDraft": "\u8BF4\u660E\u8FD9\u6761\u6807\u6CE8\u8981\u6539\u4EC0\u4E48",
  "bar.capturing": "\u6B63\u5728\u622A\u53D6\u6574\u5C4F\u2026",
  "bar.shots": "\u622A\u56FE\uFF1A{count} \u5F20",
  "bar.manyItems": "\u6807\u6CE8\u8F83\u591A\uFF08{count} \u6761\uFF09\uFF0C\u7F16\u53F7\u53EF\u80FD\u96BE\u4EE5\u5BF9\u5E94\uFF0C\u5EFA\u8BAE\u6BCF\u5F20\u56FE \u226430 \u6761",
  "bar.insert": "\u63D2\u5165\u8F93\u5165\u6846\uFF08{count}\uFF09",
  "bar.inserting": "\u6B63\u5728\u63D2\u5165\u2026",
  "bar.insertTarget": "\u63D2\u5165\u5230\uFF1A{title}",
  "bar.currentChat": "\u5F53\u524D\u4F1A\u8BDD",
  "bar.clear": "\u6E05\u7A7A",
  "bar.close": "\u5173\u95ED",
  "region.label": "\u6846\u9009\u533A\u57DF",
  "card.placeholder": "\u8FD9\u91CC\u6709\u4EC0\u4E48\u95EE\u9898\uFF1F",
  "card.save": "\u6DFB\u52A0",
  "card.cancel": "\u53D6\u6D88",
  "card.delete": "\u5220\u9664",
  "card.browser": "\u6D4F\u89C8\u5668\u9875\u9762\u5185",
  "pin.empty": "\u6CA1\u6709\u8BC4\u8BBA",
  "pin.edit": "\u7F16\u8F91\u7B2C {index} \u6761\u6807\u6CE8",
  "insert.head": "\u4E0B\u9762\u622A\u56FE\u91CC\u7684\u7EA2\u6846\u6807\u51FA\u4E86\u9700\u8981\u5173\u6CE8\u7684\u4F4D\u7F6E\uFF0C\u7F16\u53F7\u4E0E\u8BC4\u8BBA\u4E00\u4E00\u5BF9\u5E94\uFF1A",
  "insert.shot": "\u622A\u56FE\uFF1A{url}\uFF08\u89C6\u53E3 {width}\xD7{height}\uFF0C\u6EDA\u52A8 {x}, {y}\uFF09",
  "insert.item": "{index}. {label} \u2014 {comment}",
  "insert.noComment": "\uFF08\u65E0\u8BC4\u8BBA\uFF09",
  "insert.where": "   \u9009\u62E9\u5668\uFF1A{selector}",
  "insert.rect": "   \u533A\u57DF\uFF1Ax={x}, y={y}, w={width}, h={height}",
  "insert.skipped": "\uFF08\u622A\u56FE\u4E2D\u6709 {count} \u5F20\u56FE\u7247\u65E0\u6CD5\u6E32\u67D3\uFF0C\u5DF2\u8DF3\u8FC7\uFF09",
  "insert.regionLabel": "\u6846\u9009\u533A\u57DF",
  "error.noSession": "\u5148\u6253\u5F00\u4E00\u4E2A\u4F1A\u8BDD\uFF0C\u518D\u63D2\u5165\u6807\u6CE8",
  "error.noComposer": "\u76EE\u6807\u4F1A\u8BDD\u7684\u8F93\u5165\u6846\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5148\u6253\u5F00\u8BE5\u4F1A\u8BDD\u518D\u63D2\u5165\u3002",
  "error.unsupportedApi": "\u5F53\u524D Harness \u7248\u672C\u6CA1\u6709\u66B4\u9732\u56FE\u7247\u8349\u7A3F\u63A5\u53E3\uFF0C\u8BF7\u5347\u7EA7\u540E\u518D\u8BD5\u3002",
  "error.composerBusy": "\u8F93\u5165\u6846\u6B63\u5FD9\uFF0C\u5148\u5B8C\u6210\u6216\u53D6\u6D88\u5F53\u524D\u7684\u53D1\u9001\u3002",
  "error.captureFailed": "\u622A\u56FE\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "error.captureInvalid": "\u62FF\u4E0D\u5230\u89C6\u53E3\u4FE1\u606F\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  "error.captureTooLarge": "\u89C6\u53E3\u592A\u5927\uFF0C\u65E0\u6CD5\u622A\u56FE\u3002\u8BF7\u7F29\u5C0F\u7A97\u53E3\u6216\u964D\u4F4E\u7F29\u653E\u3002",
  "error.captureAssets": "\u9875\u9762\u91CC\u6709\u6837\u5F0F\u6216\u56FE\u7247\u65E0\u6CD5\u6E32\u67D3\uFF08\u65E0\u6CD5\u8BFB\u53D6\u7684\u56FE\u7247\u4F1A\u81EA\u52A8\u8DF3\u8FC7\uFF09\u3002\u8BF7\u5237\u65B0\u540E\u91CD\u8BD5\uFF0C\u6216\u6362\u4E00\u4E2A\u9875\u9762\u6807\u6CE8\u3002",
  "error.captureProtected": "\u9875\u9762\u5305\u542B\u65E0\u6CD5\u8BFB\u53D6\u7684\u53D7\u4FDD\u62A4 canvas/\u89C6\u9891\u50CF\u7D20\u3002",
  "error.captureDecode": "\u622A\u56FE\u89E3\u7801\u5931\u8D25\u3002",
  "error.captureChanged": "\u622A\u56FE\u671F\u95F4\u9875\u9762\u6EDA\u52A8\u3001\u7F29\u653E\u6216\u8DF3\u8F6C\u4E86\uFF0C\u8BF7\u91CD\u65B0\u6807\u6CE8\u3002",
  "error.captureGuestUnavailable": "\u8FD9\u4E2A\u6D4F\u89C8\u5668\u6807\u7B7E\u6CA1\u6709\u66B4\u9732\u622A\u56FE\u80FD\u529B\u3002",
  "error.captureGuestFailed": "\u6D4F\u89C8\u5668\u6807\u7B7E\u622A\u53D6\u89C6\u53E3\u5931\u8D25\u3002",
  "error.tooManyShots": "\u8FD9\u6B21\u4F1A\u751F\u6210 {count} \u5F20\u622A\u56FE\uFF0C\u8D85\u8FC7\u5355\u6761\u6D88\u606F\u7684\u56FE\u7247\u4E0A\u9650\uFF08{limit} \u5F20\uFF09\u3002\u8BF7\u51CF\u5C11\u6EDA\u52A8\u6807\u6CE8\uFF0C\u6216\u5206\u51E0\u6B21\u63D2\u5165\u3002",
  "error.guestHint": "\u8BF7\u5728\u9875\u9762\u5185\u5BB9\u91CC\u9009\u62E9\uFF0C\u4E0D\u8981\u9009\u6807\u7B7E\u8FB9\u6846",
  "error.iframeHint": "\u8FD9\u662F\u6C99\u7BB1 HTML \u9884\u89C8\uFF0C\u65E0\u6CD5\u76F4\u63A5\u622A\u56FE\uFF1B\u8BF7\u628A\u9884\u89C8\u5207\u6362\u5230\u300C\u7EAF\u6587\u672C / \u4EE3\u7801\u300D\u540E\u518D\u6807\u6CE8\u3002",
  "meta.title": "\u6574\u5C4F\u6807\u6CE8",
  "meta.description": "\u6BCF\u4E2A\u89C6\u53E3\u622A\u4E00\u5F20\u6574\u5C4F\u56FE\uFF0C\u7528\u7F16\u53F7\u7EA2\u6846\u6807\u51FA\u4F4D\u7F6E\uFF0C\u8FDE\u540C\u8BC4\u8BBA\u4E00\u8D77\u63D2\u5165\u8F93\u5165\u6846\u3002"
};
module.exports = { name: "dsh-annotate-viewport", inject: ["slots", "locale"], apply };

return module.exports;
} });
