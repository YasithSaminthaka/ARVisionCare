!function(e) {
    var t = {};
    function s(i) {
        if (t[i])
            return t[i].exports;
        var a = t[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return e[i].call(a.exports, a, a.exports, s),
        a.l = !0,
        a.exports
    }
    s.m = e,
    s.c = t,
    s.d = function(e, t, i) {
        s.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
        })
    }
    ,
    s.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    s.t = function(e, t) {
        if (1 & t && (e = s(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var i = Object.create(null);
        if (s.r(i),
        Object.defineProperty(i, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var a in e)
                s.d(i, a, function(t) {
                    return e[t]
                }
                .bind(null, a));
        return i
    }
    ,
    s.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return s.d(t, "a", t),
        t
    }
    ,
    s.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    s.p = "",
    s(s.s = 0)
}([function(e, t, s) {
    s(1)
}
, function(e, t, s) {
    if ("undefined" == typeof AFRAME)
        throw new Error("Component attempted to register before AFRAME was available.");
    const i = s(2);
    AFRAME.registerComponent("htmlembed", {
        schema: {
            ppu: {
                type: "number",
                default: 256
            }
        },
        init: function() {
            var e = new i(this.el,()=>{
                t && (t.needsUpdate = !0)
            }
            ,(e,t)=>{
                switch (e) {
                case "resize":
                    this.el.emit("resize");
                    break;
                case "rendered":
                    this.el.emit("rendered");
                    break;
                case "focusableenter":
                    this.el.emit("focusableenter", t);
                    break;
                case "focusableleave":
                    this.el.emit("focusableleave", t);
                    break;
                case "inputrequired":
                    this.el.emit("inputrequired", t)
                }
            }
            );
            this.htmlcanvas = e;
            var t = new THREE.CanvasTexture(e.canvas);
            t.minFilter = THREE.LinearFilter,
            t.wrapS = THREE.ClampToEdgeWrapping,
            t.wrapT = THREE.ClampToEdgeWrapping;
            const s = new THREE.MeshBasicMaterial({
                map: t,
                transparent: !0
            });
            var a = new THREE.PlaneGeometry
              , n = new THREE.Mesh(a,s);
            this.el.setObject3D("screen", n),
            this.screen = n,
            this.el.addEventListener("raycaster-intersected", e=>{
                this.raycaster = e.detail.el
            }
            ),
            this.el.addEventListener("raycaster-intersected-cleared", e=>{
                this.htmlcanvas.clearHover(),
                this.raycaster = null
            }
            ),
            this.el.addEventListener("mousedown", e=>{
                e instanceof CustomEvent ? this.htmlcanvas.mousedown(this.lastX, this.lastY) : e.stopPropagation()
            }
            ),
            this.el.addEventListener("mouseup", e=>{
                e instanceof CustomEvent ? this.htmlcanvas.mouseup(this.lastX, this.lastY) : e.stopPropagation()
            }
            ),
            this.resize()
        },
        resize() {
            this.width = this.htmlcanvas.width / this.data.ppu,
            this.height = this.htmlcanvas.height / this.data.ppu,
            this.screen.scale.x = Math.max(1e-4, this.width),
            this.screen.scale.y = Math.max(1e-4, this.height)
        },
        update() {
            this.resize()
        },
        forceRender() {
            this.htmlcanvas.forceRender()
        },
        tick: function() {
            if (this.resize(),
            this.raycaster) {
                var e = this.raycaster.components.raycaster.getIntersection(this.el);
                if (e) {
                    var t = e.point;
                    this.el.object3D.worldToLocal(t);
                    var s = this.width / 2
                      , i = this.height / 2
                      , a = Math.round((t.x + s) / this.width * this.htmlcanvas.canvas.width)
                      , n = Math.round((1 - (t.y + i) / this.height) * this.htmlcanvas.canvas.height);
                    this.lastX == a && this.lastY == n || this.htmlcanvas.mousemove(a, n),
                    this.lastX = a,
                    this.lastY = n
                }
            }
        },
        remove: function() {
            this.el.removeObject3D("screen")
        }
    })
}
, function(e, t) {
    !function() {
        var e = document.createElement("style");
        e.innerHTML = "input, select,textarea{border: 1px solid #000000;margin: 0;background-color: #ffffff;-webkit-appearance: none;}:-webkit-autofill {color: #fff !important;}input[type='checkbox']{width: 20px;height: 20px;display: inline-block;}input[type='radio']{width: 20px;height: 20px;display: inline-block;border-radius: 50%;}input[type='checkbox'][checked],input[type='radio'][checked]{background-color: #555555;}a-entity[htmlembed] img{display:inline-block}a-entity[htmlembed]{display:none}";
        var t = document.querySelector("head");
        t.insertBefore(e, t.firstChild)
    }();
    e.exports = class {
        constructor(e, t, s) {
            if (!e)
                throw "Container Element is Required";
            var i;
            this.updateCallback = t,
            this.eventCallback = s,
            this.canvas = document.createElement("canvas"),
            this.ctx = this.canvas.getContext("2d"),
            this.html = e,
            this.html.style.display = "block",
            this.width = 0,
            this.height = 0,
            this.html.style.display = "none",
            this.html.style.position = "absolute",
            this.html.style.top = "0",
            this.html.style.left = "0",
            this.html.style.overflow = "hidden",
            this.mousemovehtml = e=>{
                e.stopPropagation()
            }
            ,
            this.html.addEventListener("mousemove", this.mousemovehtml),
            this.hashChangeEvent = ()=>{
                this.hashChanged()
            }
            ,
            window.addEventListener("hashchange", this.hashChangeEvent, !1),
            this.overElements = [],
            this.focusElement = null,
            this.img = new Image,
            this.img.addEventListener("load", ()=>{
                this.render()
            }
            ),
            this.csshack();
            var a = new MutationObserver((e,t)=>{
                if (!this.nowatch)
                    for (var s = 0; s < e.length; s++)
                        if (e[s].target != this.html || "attributes" != e[s].type) {
                            if (!e[s].target.styleRef || "class" == e[s].attributeName) {
                                var a = this.csssig(e[s].target);
                                if (e[s].target.styleRef == a)
                                    continue;
                                e[s].target.styleRef = a
                            }
                            i || (i = setTimeout(()=>{
                                this.svgToImg(),
                                i = !1
                            }
                            ))
                        }
            }
            );
            a.observe(this.html, {
                attributes: !0,
                childList: !0,
                subtree: !0
            }),
            this.observer = a,
            this.cssgenerated = [],
            this.cssembed = [],
            this.serializer = new XMLSerializer,
            this.hashChanged()
        }
        forceRender() {
            Array.from(document.querySelectorAll("*")).map(e=>e.classCache = {}),
            this.svgToImg()
        }
        hashChanged() {
            if (window.clearedHash != window.location.hash) {
                Array.from(document.querySelectorAll("*")).map(e=>e.classCache = {});
                var e = document.querySelector(".targethack");
                if (e && e.classList.remove("targethack"),
                window.location.hash) {
                    var t = document.querySelector(window.location.hash);
                    t && t.classList.add("targethack")
                }
            }
            window.clearedHash = window.location.hash,
            this.svgToImg()
        }
        cleanUp() {
            this.observer.disconnect(),
            window.removeEventListener("hashchange", this.hashChangeEvent),
            this.html.addEventListener("mousemove", this.mousrmovehtml)
        }
        csshack() {
            for (var e = document.styleSheets, t = 0; t < e.length; t++)
                try {
                    for (var s = e[t].cssRules, i = [], a = 0; a < s.length; a++) {
                        s[a].cssText.indexOf(":hover") > -1 && i.push(s[a].cssText.replace(new RegExp(":hover","g"), ".hoverhack")),
                        s[a].cssText.indexOf(":active") > -1 && i.push(s[a].cssText.replace(new RegExp(":active","g"), ".activehack")),
                        s[a].cssText.indexOf(":focus") > -1 && i.push(s[a].cssText.replace(new RegExp(":focus","g"), ".focushack")),
                        s[a].cssText.indexOf(":target") > -1 && i.push(s[a].cssText.replace(new RegExp(":target","g"), ".targethack"));
                        var n = i.indexOf(s[a].cssText);
                        n > -1 && i.splice(n, 1)
                    }
                    for (a = 0; a < i.length; a++)
                        e[t].insertRule(i[a])
                } catch (e) {}
        }
        dbj2(e) {
            for (var t = 5381, s = 0; s < e.length; s++)
                t = (t << 5) + t + e.charCodeAt(s);
            return t
        }
        csssig(e) {
            if (e.classCache || (e.classCache = {}),
            !e.classCache[e.className]) {
                for (var t = getComputedStyle(e), s = "", i = 0; i < t.length; i++)
                    s += t[t[i]];
                e.classCache[e.className] = this.dbj2(s)
            }
            return e.classCache[e.className]
        }
        arrayBufferToBase64(e) {
            for (var t = "", s = e.byteLength, i = 0; i < s; i++)
                t += String.fromCharCode(e[i]);
            return window.btoa(t)
        }
        embedCss(e, t) {
            return new Promise(s=>{
                var i, a = [];
                t = (t = (t = (t = t.replace(new RegExp(":hover","g"), ".hoverhack")).replace(new RegExp(":active","g"), ".activehack")).replace(new RegExp(":focus","g"), ".focushack")).replace(new RegExp(":target","g"), ".targethack");
                const n = RegExp(/url\((?!['"]?(?:data):)['"]?([^'"\)]*)['"]?\)/gi);
                for (; i = n.exec(t); )
                    a.push(this.getDataURL(new URL(i[1],e)).then((e=>s=>{
                        t = t.replace(e[1], s)
                    }
                    )(i)));
                Promise.all(a).then(e=>{
                    s(t)
                }
                )
            }
            )
        }
        getURL(e) {
            return e = new URL(e,window.location),
            new Promise(t=>{
                var s = new XMLHttpRequest;
                s.open("GET", e, !0),
                s.responseType = "arraybuffer",
                s.onload = ()=>{
                    t(s)
                }
                ,
                s.send()
            }
            )
        }
        generatePageCSS() {
            for (var e = Array.from(document.querySelectorAll("style, link[type='text/css'],link[rel='stylesheet']")), t = [], s = 0; s < e.length; s++) {
                var i = e[s];
                if (-1 == this.cssgenerated.indexOf(i)) {
                    this.csshack();
                    var a = this.cssgenerated.length;
                    this.cssgenerated.push(i),
                    "STYLE" == i.tagName ? t.push(this.embedCss(window.location, i.innerHTML).then(((e,t)=>e=>{
                        this.cssembed[t] = e
                    }
                    )(0, a))) : t.push(this.getURL(i.getAttribute("href")).then((e=>t=>{
                        var s = new TextDecoder("utf-8").decode(t.response);
                        return this.embedCss(window.location, s).then(((e,t)=>e=>{
                            this.cssembed[t] = e
                        }
                        )(0, e))
                    }
                    )(a)))
                }
            }
            return Promise.all(t)
        }
        getDataURL(e) {
            return new Promise(t=>{
                this.getURL(e).then(s=>{
                    var i = new Uint8Array(s.response)
                      , a = s.getResponseHeader("Content-Type").split(";")[0];
                    if ("text/css" == a) {
                        var n = new TextDecoder("utf-8").decode(i);
                        this.embedCss(e, n).then(e=>{
                            var s = window.btoa(e);
                            s.length > 0 ? t("data:" + a + ";base64," + s) : t("")
                        }
                        )
                    } else {
                        var r = this.arrayBufferToBase64(i);
                        t("data:" + a + ";base64," + r)
                    }
                }
                )
            }
            )
        }
        embededSVG() {
            for (var e = [], t = this.html.querySelectorAll("*"), s = 0; s < t.length; s++) {
                var i = t[s].getAttributeNS("http://www.w3.org/1999/xlink", "href");
                if (i && e.push(this.getDataURL(i).then((e=>t=>{
                    e.removeAttributeNS("http://www.w3.org/1999/xlink", "href"),
                    e.setAttribute("href", t)
                }
                )(t[s]))),
                "IMG" == t[s].tagName && "data" != t[s].src.substr(0, 4) && e.push(this.getDataURL(t[s].src).then((e=>t=>{
                    e.setAttribute("src", t)
                }
                )(t[s]))),
                "http://www.w3.org/1999/xhtml" == t[s].namespaceURI && t[s].hasAttribute("style")) {
                    var a = t[s].getAttribute("style");
                    e.push(this.embedCss(window.location, a).then(((e,t)=>s=>{
                        e != s && t.setAttribute("style", s)
                    }
                    )(a, t[s])))
                }
            }
            var n = this.html.querySelectorAll("style");
            for (s = 0; s < n.length; s++)
                e.push(this.embedCss(window.location, n[s].innerHTML).then((e=>t=>{
                    e.innerHTML != t && (e.innerHTML = t)
                }
                )(n[s])));
            return Promise.all(e)
        }
        updateFocusBlur() {
            for (var e = this.html.querySelectorAll("*"), t = 0; t < e.length; t++) {
                var s = e[t];
                s.tabIndex > -1 ? (s.hasOwnProperty("focus") || (s.focus = (e=>()=>this.setFocus(e))(s)),
                s.hasOwnProperty("blur") || (s.blur = (e=>()=>this.focusElement == e && this.setBlur())(s))) : (delete s.focus,
                delete s.blur)
            }
        }
        getParents() {
            var e = []
              , t = []
              , s = this.html.parentNode;
            do {
                var i = s.tagName.toLowerCase();
                "a-" == i.substr(0, 2) && (i = "div");
                var a = "<" + ("body" == i ? 'body xmlns="http://www.w3.org/1999/xhtml"' : i) + ' style="transform: none;left: 0;top: 0;position:static;display: block" class="' + s.className + '"' + (s.id ? ' id="' + s.id + '"' : "") + ">";
                e.unshift(a);
                var n = "</" + i + ">";
                if (t.push(n),
                "body" == i)
                    break
            } while (s = s.parentNode);
            return [e.join(""), t.join("")]
        }
        updateCheckedAttributes() {
            for (var e = this.html.getElementsByTagName("input"), t = 0; t < e.length; t++) {
                var s = e[t];
                s.hasAttribute("checked") ? s.checked || s.removeAttribute("checked") : s.checked && s.setAttribute("checked", "")
            }
        }
        svgToImg() {
            this.updateFocusBlur(),
            Promise.all([this.embededSVG(), this.generatePageCSS()]).then(()=>{
                this.html.style.display = "block",
                this.width == this.html.offsetWidth && this.height == this.html.offsetHeight || (this.width = this.html.offsetWidth,
                this.height = this.html.offsetHeight,
                this.canvas.width = this.width,
                this.canvas.height = this.height,
                this.eventCallback && this.eventCallback("resized"));
                var e = this.serializer.serializeToString(this.html)
                  , t = this.getParents();
                e = '<svg width="' + this.width + '" height="' + this.height + '" xmlns="http://www.w3.org/2000/svg"><defs><style type="text/css"><![CDATA[a[href]{color:#0000EE;text-decoration:underline;}' + this.cssembed.join("") + ']]></style></defs><foreignObject x="0" y="0" width="' + this.width + '" height="' + this.height + '">' + t[0] + e + t[1] + "</foreignObject></svg>",
                this.img.src = "data:image/svg+xml;utf8," + encodeURIComponent(e),
                this.html.style.display = "none"
            }
            )
        }
        render() {
            this.canvas.width = this.width,
            this.canvas.height = this.height,
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height),
            this.ctx.drawImage(this.img, 0, 0),
            this.updateCallback && this.updateCallback(),
            this.eventCallback && this.eventCallback("rendered")
        }
        transformPoint(e, t, s, i, a) {
            var n = e.transform;
            if (0 == n.indexOf("matrix(")) {
                var r = new THREE.Matrix4
                  , h = n.substring(7, n.length - 1).split(", ").map(parseFloat);
                r.elements[0] = h[0],
                r.elements[1] = h[1],
                r.elements[4] = h[2],
                r.elements[5] = h[3],
                r.elements[12] = h[4],
                r.elements[13] = h[5]
            } else {
                if (0 != n.indexOf("matrix3d("))
                    return [t, s, z];
                r = new THREE.Matrix4,
                h = n.substring(9, n.length - 1).split(", ").map(parseFloat),
                r.elements = h
            }
            var l = e["transform-origin"]
              , o = i + (l = l.replace(new RegExp("px","g"), "").split(" ").map(parseFloat))[0]
              , c = a + l[1]
              , u = 0;
            l[2] && (u += l[2]);
            var d = (new THREE.Matrix4).makeTranslation(-o, -c, -u);
            if (0 != (r = (new THREE.Matrix4).makeTranslation(o, c, u).multiply(r).multiply(d)).determinant())
                return [t, s];
            var m = (new THREE.Matrix4).getInverse(r)
              , v = new THREE.Vector3(t,s,0)
              , f = new THREE.Vector3(t,s,-1);
            v.applyMatrix4(m),
            f.applyMatrix4(m);
            var p = f.sub(v).normalize();
            if (0 == p.z)
                return !1;
            var g = p.multiplyScalar(-v.z / p.z).add(v);
            return [g.x, g.y]
        }
        getBorderRadii(e, t) {
            for (var s, i = ["border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"], a = [], n = 0; n < i.length; n++) {
                for (var r = t[i[n]], h = /(\d*)([a-z%]{1,3})/gi, l = []; s = h.exec(r); )
                    l.push({
                        value: s[1],
                        unit: s[2]
                    });
                1 == l.length && l.push(l[0]),
                a.push(l)
            }
            const o = {
                px: 1,
                "%": e.offsetWidth / 100
            };
            var c = [];
            for (n = 0; n < a.length; n++) {
                for (var u = a[n], d = (l = [],
                0); d < u.length; d++)
                    l.push(u[d].value * o[u[d].unit]);
                c.push(l)
            }
            var m = 1
              , v = 1
              , f = 1
              , p = 1
              , g = c[0][0] + c[1][0];
            if (g > e.offsetWidth) {
                var b = 1 / g * e.offsetWidth;
                m = Math.min(m, b),
                v = Math.min(v, b)
            }
            var w = c[1][1] + c[2][1];
            w > e.offsetHeight && (b = 1 / w * e.offsetHeight,
            f = Math.min(f, b),
            v = Math.min(v, b));
            var E = c[2][0] + c[3][0];
            E > e.offsetWidth && (b = 1 / E * e.offsetWidth,
            f = Math.min(f, b),
            p = Math.min(p, b));
            var y = c[0][1] + c[3][1];
            return y > e.offsetHeight && (b = 1 / y * e.offsetHeight,
            m = Math.min(m, b),
            p = Math.min(p, b)),
            c[0][0] = c[0][0] * m,
            c[0][1] = c[0][1] * m,
            c[1][0] = c[1][0] * v,
            c[1][1] = c[1][1] * v,
            c[2][0] = c[2][0] * f,
            c[2][1] = c[2][1] * f,
            c[3][0] = c[3][0] * p,
            c[3][1] = c[3][1] * p,
            c
        }
        checkInBorder(e, t, s, i, a, n) {
            if ("0px" == t["border-radius"])
                return !0;
            var r, h, l = e.offsetWidth, o = e.offsetHeight, c = this.getBorderRadii(e, t);
            return !(s < c[0][0] + a && i < c[0][1] + n && (r = (c[0][0] + a - s) / c[0][0]) * r + (h = (c[0][1] + n - i) / c[0][1]) * h > 1) && (!(s > a + l - c[1][0] && i < c[1][1] + n && (r = (s - (a + l - c[1][0])) / c[1][0]) * r + (h = (c[1][1] + n - i) / c[1][1]) * h > 1) && (!(s > a + l - c[2][0] && i > n + o - c[2][1] && (r = (s - (a + l - c[2][0])) / c[2][0]) * r + (h = (i - (n + o - c[2][1])) / c[2][1]) * h > 1) && !(s < c[3][0] + a && i > n + o - c[3][1] && (r = (c[3][0] + a - s) / c[3][0]) * r + (h = (i - (n + o - c[3][1])) / c[3][1]) * h > 1)))
        }
        checkElement(e, t, s, i, a, n, r, h) {
            if (r.offsetParent) {
                var l = window.getComputedStyle(r)
                  , o = r.offsetLeft + s
                  , c = r.offsetTop + i
                  , u = r.offsetWidth
                  , d = r.offsetHeight
                  , m = l["z-index"];
                if ("auto" != m && (a = 0,
                n = parseInt(m)),
                "static" != l.position && r != this.html && "auto" == m && (a += 1),
                ("block" == l.display || "inline-block" == l.display) && "none" != l.transform) {
                    var v = this.transformPoint(l, e, t, o, c);
                    if (!v)
                        return;
                    e = v[0],
                    t = v[1],
                    "auto" == m && (a += 1)
                }
                if (e > o && e < o + u && t > c && t < c + d)
                    this.checkInBorder(r, l, e, t, o, c) && (a >= h.zIndex || n > h.level) && n >= h.level && "none" != l["pointer-events"] && (h.zIndex = a,
                    h.ele = r,
                    h.level = n);
                else if ("visible" != l.overflow)
                    return;
                var f = r.firstChild;
                if (f)
                    do {
                        1 == f.nodeType && (f.offsetParent == r ? this.checkElement(e, t, s + o, i + c, a, n, f, h) : this.checkElement(e, t, s, i, a, n, f, h))
                    } while (f = f.nextSibling)
            }
        }
        elementAt(e, t) {
            this.html.style.display = "block";
            var s = {
                zIndex: 0,
                ele: null,
                level: 0
            };
            return this.checkElement(e, t, 0, 0, 0, 0, this.html, s),
            this.html.style.display = "none",
            s.ele
        }
        moveMouse() {
            var e = this.moveX
              , t = this.moveY
              , s = this.moveButton
              , i = {
                screenX: e,
                screenY: t,
                clientX: e,
                clientY: t,
                button: s || 0,
                bubbles: !0,
                cancelable: !0
            }
              , a = {
                clientX: e,
                clientY: t,
                button: s || 0,
                bubbles: !1
            }
              , n = this.elementAt(e, t);
            if (n != this.lastEle)
                if (n) {
                    n.tabIndex > -1 && this.eventCallback && this.eventCallback("focusableenter", {
                        target: n
                    }),
                    this.lastEle && this.lastEle.tabIndex > -1 && this.eventCallback && this.eventCallback("focusableleave", {
                        target: this.lastEle
                    });
                    var r = []
                      , h = n;
                    this.lastEle && this.lastEle.dispatchEvent(new MouseEvent("mouseout",i)),
                    n.dispatchEvent(new MouseEvent("mouseover",i));
                    do {
                        if (h == this.html)
                            break;
                        -1 == this.overElements.indexOf(h) && (h.classList && h.classList.add("hoverhack"),
                        h.dispatchEvent(new MouseEvent("mouseenter",a)),
                        this.overElements.push(h)),
                        r.push(h)
                    } while (h = h.parentNode);
                    for (var l = 0; l < this.overElements.length; l++) {
                        var o = this.overElements[l];
                        -1 == r.indexOf(o) && (o.classList && o.classList.remove("hoverhack"),
                        o.dispatchEvent(new MouseEvent("mouseleave",a)),
                        this.overElements.splice(l, 1),
                        l--)
                    }
                } else
                    for (; o = this.overElements.pop(); )
                        o.classList && o.classList.remove("hoverhack"),
                        o.dispatchEvent(new MouseEvent("mouseout",i));
            n && -1 == this.overElements.indexOf(n) && this.overElements.push(n),
            this.lastEle = n,
            n && n.dispatchEvent(new MouseEvent("mousemove",i)),
            this.moveTimer = !1
        }
        mousemove(e, t, s) {
            this.moveX = e,
            this.moveY = t,
            this.moveButton = s,
            this.moveTimer || (this.moveTimer = setTimeout(this.moveMouse.bind(this), 20))
        }
        mousedown(e, t, s) {
            var i = {
                screenX: e,
                screenY: t,
                clientX: e,
                clientY: t,
                button: s || 0,
                bubbles: !0,
                cancelable: !0
            }
              , a = this.elementAt(e, t);
            a && (this.activeElement = a,
            a.classList.add("activehack"),
            a.classList.remove("hoverhack"),
            a.dispatchEvent(new MouseEvent("mousedown",i))),
            this.mousedownElement = a
        }
        setFocus(e) {
            e.dispatchEvent(new FocusEvent("focus")),
            e.dispatchEvent(new CustomEvent("focusin",{
                bubbles: !0,
                cancelable: !1
            })),
            e.classList.add("focushack"),
            this.focusElement = e
        }
        setBlur() {
            this.focusElement && (this.focusElement.classList.remove("focushack"),
            this.focusElement.dispatchEvent(new FocusEvent("blur")),
            this.focusElement.dispatchEvent(new CustomEvent("focusout",{
                bubbles: !0,
                cancelable: !1
            })))
        }
        clearHover() {
            var e;
            for (this.moveTimer && (clearTimeout(this.moveTimer),
            this.moveTimer = !1); e = this.overElements.pop(); )
                e.classList && e.classList.remove("hoverhack"),
                e.dispatchEvent(new MouseEvent("mouseout",{
                    bubbles: !0,
                    cancelable: !0
                }));
            this.lastEle && this.lastEle.dispatchEvent(new MouseEvent("mouseleave",{
                bubbles: !0,
                cancelable: !0
            })),
            this.lastEle = null;
            var t = document.querySelector(".activeElement");
            t && (t.classList.remove("activehack"),
            this.activeElement = null)
        }
        mouseup(e, t, s) {
            var i = {
                screenX: e,
                screenY: t,
                clientX: e,
                clientY: t,
                button: s || 0,
                bubbles: !0,
                cancelable: !0
            }
              , a = this.elementAt(e, t);
            this.activeElement && (this.activeElement.classList.remove("activehack"),
            a && (a.classList.add("hoverhack"),
            -1 == this.overElements.indexOf(a) && this.overElements.push(a)),
            this.activeElement = null),
            a ? (a.dispatchEvent(new MouseEvent("mouseup",i)),
            a != this.focusElement && (this.setBlur(),
            a.tabIndex > -1 ? this.setFocus(a) : this.focusElement = null),
            a == this.mousedownElement && (a.dispatchEvent(new MouseEvent("click",i)),
            "INPUT" == a.tagName && this.updateCheckedAttributes(),
            "INPUT" != a.tagName && "TEXTAREA" != a.tagName && "SELECT" != a.tagName || this.eventCallback && this.eventCallback("inputrequired", {
                target: a
            }))) : (this.focusElement && this.focusElement.dispatchEvent(new FocusEvent("blur")),
            this.focusElement = null)
        }
    }
}
]);
