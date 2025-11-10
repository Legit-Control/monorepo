(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function() {
    var e = {
        675: function(e, r) {
            "use strict";
            r.byteLength = byteLength;
            r.toByteArray = toByteArray;
            r.fromByteArray = fromByteArray;
            var t = [];
            var f = [];
            var n = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(var o = 0, u = i.length; o < u; ++o){
                t[o] = i[o];
                f[i.charCodeAt(o)] = o;
            }
            f["-".charCodeAt(0)] = 62;
            f["_".charCodeAt(0)] = 63;
            function getLens(e) {
                var r = e.length;
                if (r % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4");
                }
                var t = e.indexOf("=");
                if (t === -1) t = r;
                var f = t === r ? 0 : 4 - t % 4;
                return [
                    t,
                    f
                ];
            }
            function byteLength(e) {
                var r = getLens(e);
                var t = r[0];
                var f = r[1];
                return (t + f) * 3 / 4 - f;
            }
            function _byteLength(e, r, t) {
                return (r + t) * 3 / 4 - t;
            }
            function toByteArray(e) {
                var r;
                var t = getLens(e);
                var i = t[0];
                var o = t[1];
                var u = new n(_byteLength(e, i, o));
                var a = 0;
                var s = o > 0 ? i - 4 : i;
                var h;
                for(h = 0; h < s; h += 4){
                    r = f[e.charCodeAt(h)] << 18 | f[e.charCodeAt(h + 1)] << 12 | f[e.charCodeAt(h + 2)] << 6 | f[e.charCodeAt(h + 3)];
                    u[a++] = r >> 16 & 255;
                    u[a++] = r >> 8 & 255;
                    u[a++] = r & 255;
                }
                if (o === 2) {
                    r = f[e.charCodeAt(h)] << 2 | f[e.charCodeAt(h + 1)] >> 4;
                    u[a++] = r & 255;
                }
                if (o === 1) {
                    r = f[e.charCodeAt(h)] << 10 | f[e.charCodeAt(h + 1)] << 4 | f[e.charCodeAt(h + 2)] >> 2;
                    u[a++] = r >> 8 & 255;
                    u[a++] = r & 255;
                }
                return u;
            }
            function tripletToBase64(e) {
                return t[e >> 18 & 63] + t[e >> 12 & 63] + t[e >> 6 & 63] + t[e & 63];
            }
            function encodeChunk(e, r, t) {
                var f;
                var n = [];
                for(var i = r; i < t; i += 3){
                    f = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (e[i + 2] & 255);
                    n.push(tripletToBase64(f));
                }
                return n.join("");
            }
            function fromByteArray(e) {
                var r;
                var f = e.length;
                var n = f % 3;
                var i = [];
                var o = 16383;
                for(var u = 0, a = f - n; u < a; u += o){
                    i.push(encodeChunk(e, u, u + o > a ? a : u + o));
                }
                if (n === 1) {
                    r = e[f - 1];
                    i.push(t[r >> 2] + t[r << 4 & 63] + "==");
                } else if (n === 2) {
                    r = (e[f - 2] << 8) + e[f - 1];
                    i.push(t[r >> 10] + t[r >> 4 & 63] + t[r << 2 & 63] + "=");
                }
                return i.join("");
            }
        },
        72: function(e, r, t) {
            "use strict";
            /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ var f = t(675);
            var n = t(783);
            var i = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
            r.Buffer = Buffer;
            r.SlowBuffer = SlowBuffer;
            r.INSPECT_MAX_BYTES = 50;
            var o = 2147483647;
            r.kMaxLength = o;
            Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
            if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
                console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
            }
            function typedArraySupport() {
                try {
                    var e = new Uint8Array(1);
                    var r = {
                        foo: function() {
                            return 42;
                        }
                    };
                    Object.setPrototypeOf(r, Uint8Array.prototype);
                    Object.setPrototypeOf(e, r);
                    return e.foo() === 42;
                } catch (e) {
                    return false;
                }
            }
            Object.defineProperty(Buffer.prototype, "parent", {
                enumerable: true,
                get: function() {
                    if (!Buffer.isBuffer(this)) return undefined;
                    return this.buffer;
                }
            });
            Object.defineProperty(Buffer.prototype, "offset", {
                enumerable: true,
                get: function() {
                    if (!Buffer.isBuffer(this)) return undefined;
                    return this.byteOffset;
                }
            });
            function createBuffer(e) {
                if (e > o) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
                var r = new Uint8Array(e);
                Object.setPrototypeOf(r, Buffer.prototype);
                return r;
            }
            function Buffer(e, r, t) {
                if (typeof e === "number") {
                    if (typeof r === "string") {
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    }
                    return allocUnsafe(e);
                }
                return from(e, r, t);
            }
            Buffer.poolSize = 8192;
            function from(e, r, t) {
                if (typeof e === "string") {
                    return fromString(e, r);
                }
                if (ArrayBuffer.isView(e)) {
                    return fromArrayLike(e);
                }
                if (e == null) {
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
                }
                if (isInstance(e, ArrayBuffer) || e && isInstance(e.buffer, ArrayBuffer)) {
                    return fromArrayBuffer(e, r, t);
                }
                if (typeof SharedArrayBuffer !== "undefined" && (isInstance(e, SharedArrayBuffer) || e && isInstance(e.buffer, SharedArrayBuffer))) {
                    return fromArrayBuffer(e, r, t);
                }
                if (typeof e === "number") {
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                }
                var f = e.valueOf && e.valueOf();
                if (f != null && f !== e) {
                    return Buffer.from(f, r, t);
                }
                var n = fromObject(e);
                if (n) return n;
                if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof e[Symbol.toPrimitive] === "function") {
                    return Buffer.from(e[Symbol.toPrimitive]("string"), r, t);
                }
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
            }
            Buffer.from = function(e, r, t) {
                return from(e, r, t);
            };
            Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
            Object.setPrototypeOf(Buffer, Uint8Array);
            function assertSize(e) {
                if (typeof e !== "number") {
                    throw new TypeError('"size" argument must be of type number');
                } else if (e < 0) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
            }
            function alloc(e, r, t) {
                assertSize(e);
                if (e <= 0) {
                    return createBuffer(e);
                }
                if (r !== undefined) {
                    return typeof t === "string" ? createBuffer(e).fill(r, t) : createBuffer(e).fill(r);
                }
                return createBuffer(e);
            }
            Buffer.alloc = function(e, r, t) {
                return alloc(e, r, t);
            };
            function allocUnsafe(e) {
                assertSize(e);
                return createBuffer(e < 0 ? 0 : checked(e) | 0);
            }
            Buffer.allocUnsafe = function(e) {
                return allocUnsafe(e);
            };
            Buffer.allocUnsafeSlow = function(e) {
                return allocUnsafe(e);
            };
            function fromString(e, r) {
                if (typeof r !== "string" || r === "") {
                    r = "utf8";
                }
                if (!Buffer.isEncoding(r)) {
                    throw new TypeError("Unknown encoding: " + r);
                }
                var t = byteLength(e, r) | 0;
                var f = createBuffer(t);
                var n = f.write(e, r);
                if (n !== t) {
                    f = f.slice(0, n);
                }
                return f;
            }
            function fromArrayLike(e) {
                var r = e.length < 0 ? 0 : checked(e.length) | 0;
                var t = createBuffer(r);
                for(var f = 0; f < r; f += 1){
                    t[f] = e[f] & 255;
                }
                return t;
            }
            function fromArrayBuffer(e, r, t) {
                if (r < 0 || e.byteLength < r) {
                    throw new RangeError('"offset" is outside of buffer bounds');
                }
                if (e.byteLength < r + (t || 0)) {
                    throw new RangeError('"length" is outside of buffer bounds');
                }
                var f;
                if (r === undefined && t === undefined) {
                    f = new Uint8Array(e);
                } else if (t === undefined) {
                    f = new Uint8Array(e, r);
                } else {
                    f = new Uint8Array(e, r, t);
                }
                Object.setPrototypeOf(f, Buffer.prototype);
                return f;
            }
            function fromObject(e) {
                if (Buffer.isBuffer(e)) {
                    var r = checked(e.length) | 0;
                    var t = createBuffer(r);
                    if (t.length === 0) {
                        return t;
                    }
                    e.copy(t, 0, 0, r);
                    return t;
                }
                if (e.length !== undefined) {
                    if (typeof e.length !== "number" || numberIsNaN(e.length)) {
                        return createBuffer(0);
                    }
                    return fromArrayLike(e);
                }
                if (e.type === "Buffer" && Array.isArray(e.data)) {
                    return fromArrayLike(e.data);
                }
            }
            function checked(e) {
                if (e >= o) {
                    throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + o.toString(16) + " bytes");
                }
                return e | 0;
            }
            function SlowBuffer(e) {
                if (+e != e) {
                    e = 0;
                }
                return Buffer.alloc(+e);
            }
            Buffer.isBuffer = function isBuffer(e) {
                return e != null && e._isBuffer === true && e !== Buffer.prototype;
            };
            Buffer.compare = function compare(e, r) {
                if (isInstance(e, Uint8Array)) e = Buffer.from(e, e.offset, e.byteLength);
                if (isInstance(r, Uint8Array)) r = Buffer.from(r, r.offset, r.byteLength);
                if (!Buffer.isBuffer(e) || !Buffer.isBuffer(r)) {
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                }
                if (e === r) return 0;
                var t = e.length;
                var f = r.length;
                for(var n = 0, i = Math.min(t, f); n < i; ++n){
                    if (e[n] !== r[n]) {
                        t = e[n];
                        f = r[n];
                        break;
                    }
                }
                if (t < f) return -1;
                if (f < t) return 1;
                return 0;
            };
            Buffer.isEncoding = function isEncoding(e) {
                switch(String(e).toLowerCase()){
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return true;
                    default:
                        return false;
                }
            };
            Buffer.concat = function concat(e, r) {
                if (!Array.isArray(e)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                if (e.length === 0) {
                    return Buffer.alloc(0);
                }
                var t;
                if (r === undefined) {
                    r = 0;
                    for(t = 0; t < e.length; ++t){
                        r += e[t].length;
                    }
                }
                var f = Buffer.allocUnsafe(r);
                var n = 0;
                for(t = 0; t < e.length; ++t){
                    var i = e[t];
                    if (isInstance(i, Uint8Array)) {
                        i = Buffer.from(i);
                    }
                    if (!Buffer.isBuffer(i)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    i.copy(f, n);
                    n += i.length;
                }
                return f;
            };
            function byteLength(e, r) {
                if (Buffer.isBuffer(e)) {
                    return e.length;
                }
                if (ArrayBuffer.isView(e) || isInstance(e, ArrayBuffer)) {
                    return e.byteLength;
                }
                if (typeof e !== "string") {
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + "Received type " + typeof e);
                }
                var t = e.length;
                var f = arguments.length > 2 && arguments[2] === true;
                if (!f && t === 0) return 0;
                var n = false;
                for(;;){
                    switch(r){
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return t;
                        case "utf8":
                        case "utf-8":
                            return utf8ToBytes(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return t * 2;
                        case "hex":
                            return t >>> 1;
                        case "base64":
                            return base64ToBytes(e).length;
                        default:
                            if (n) {
                                return f ? -1 : utf8ToBytes(e).length;
                            }
                            r = ("" + r).toLowerCase();
                            n = true;
                    }
                }
            }
            Buffer.byteLength = byteLength;
            function slowToString(e, r, t) {
                var f = false;
                if (r === undefined || r < 0) {
                    r = 0;
                }
                if (r > this.length) {
                    return "";
                }
                if (t === undefined || t > this.length) {
                    t = this.length;
                }
                if (t <= 0) {
                    return "";
                }
                t >>>= 0;
                r >>>= 0;
                if (t <= r) {
                    return "";
                }
                if (!e) e = "utf8";
                while(true){
                    switch(e){
                        case "hex":
                            return hexSlice(this, r, t);
                        case "utf8":
                        case "utf-8":
                            return utf8Slice(this, r, t);
                        case "ascii":
                            return asciiSlice(this, r, t);
                        case "latin1":
                        case "binary":
                            return latin1Slice(this, r, t);
                        case "base64":
                            return base64Slice(this, r, t);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return utf16leSlice(this, r, t);
                        default:
                            if (f) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase();
                            f = true;
                    }
                }
            }
            Buffer.prototype._isBuffer = true;
            function swap(e, r, t) {
                var f = e[r];
                e[r] = e[t];
                e[t] = f;
            }
            Buffer.prototype.swap16 = function swap16() {
                var e = this.length;
                if (e % 2 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                }
                for(var r = 0; r < e; r += 2){
                    swap(this, r, r + 1);
                }
                return this;
            };
            Buffer.prototype.swap32 = function swap32() {
                var e = this.length;
                if (e % 4 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                }
                for(var r = 0; r < e; r += 4){
                    swap(this, r, r + 3);
                    swap(this, r + 1, r + 2);
                }
                return this;
            };
            Buffer.prototype.swap64 = function swap64() {
                var e = this.length;
                if (e % 8 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                }
                for(var r = 0; r < e; r += 8){
                    swap(this, r, r + 7);
                    swap(this, r + 1, r + 6);
                    swap(this, r + 2, r + 5);
                    swap(this, r + 3, r + 4);
                }
                return this;
            };
            Buffer.prototype.toString = function toString() {
                var e = this.length;
                if (e === 0) return "";
                if (arguments.length === 0) return utf8Slice(this, 0, e);
                return slowToString.apply(this, arguments);
            };
            Buffer.prototype.toLocaleString = Buffer.prototype.toString;
            Buffer.prototype.equals = function equals(e) {
                if (!Buffer.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (this === e) return true;
                return Buffer.compare(this, e) === 0;
            };
            Buffer.prototype.inspect = function inspect() {
                var e = "";
                var t = r.INSPECT_MAX_BYTES;
                e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim();
                if (this.length > t) e += " ... ";
                return "<Buffer " + e + ">";
            };
            if (i) {
                Buffer.prototype[i] = Buffer.prototype.inspect;
            }
            Buffer.prototype.compare = function compare(e, r, t, f, n) {
                if (isInstance(e, Uint8Array)) {
                    e = Buffer.from(e, e.offset, e.byteLength);
                }
                if (!Buffer.isBuffer(e)) {
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + "Received type " + typeof e);
                }
                if (r === undefined) {
                    r = 0;
                }
                if (t === undefined) {
                    t = e ? e.length : 0;
                }
                if (f === undefined) {
                    f = 0;
                }
                if (n === undefined) {
                    n = this.length;
                }
                if (r < 0 || t > e.length || f < 0 || n > this.length) {
                    throw new RangeError("out of range index");
                }
                if (f >= n && r >= t) {
                    return 0;
                }
                if (f >= n) {
                    return -1;
                }
                if (r >= t) {
                    return 1;
                }
                r >>>= 0;
                t >>>= 0;
                f >>>= 0;
                n >>>= 0;
                if (this === e) return 0;
                var i = n - f;
                var o = t - r;
                var u = Math.min(i, o);
                var a = this.slice(f, n);
                var s = e.slice(r, t);
                for(var h = 0; h < u; ++h){
                    if (a[h] !== s[h]) {
                        i = a[h];
                        o = s[h];
                        break;
                    }
                }
                if (i < o) return -1;
                if (o < i) return 1;
                return 0;
            };
            function bidirectionalIndexOf(e, r, t, f, n) {
                if (e.length === 0) return -1;
                if (typeof t === "string") {
                    f = t;
                    t = 0;
                } else if (t > 2147483647) {
                    t = 2147483647;
                } else if (t < -2147483648) {
                    t = -2147483648;
                }
                t = +t;
                if (numberIsNaN(t)) {
                    t = n ? 0 : e.length - 1;
                }
                if (t < 0) t = e.length + t;
                if (t >= e.length) {
                    if (n) return -1;
                    else t = e.length - 1;
                } else if (t < 0) {
                    if (n) t = 0;
                    else return -1;
                }
                if (typeof r === "string") {
                    r = Buffer.from(r, f);
                }
                if (Buffer.isBuffer(r)) {
                    if (r.length === 0) {
                        return -1;
                    }
                    return arrayIndexOf(e, r, t, f, n);
                } else if (typeof r === "number") {
                    r = r & 255;
                    if (typeof Uint8Array.prototype.indexOf === "function") {
                        if (n) {
                            return Uint8Array.prototype.indexOf.call(e, r, t);
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(e, r, t);
                        }
                    }
                    return arrayIndexOf(e, [
                        r
                    ], t, f, n);
                }
                throw new TypeError("val must be string, number or Buffer");
            }
            function arrayIndexOf(e, r, t, f, n) {
                var i = 1;
                var o = e.length;
                var u = r.length;
                if (f !== undefined) {
                    f = String(f).toLowerCase();
                    if (f === "ucs2" || f === "ucs-2" || f === "utf16le" || f === "utf-16le") {
                        if (e.length < 2 || r.length < 2) {
                            return -1;
                        }
                        i = 2;
                        o /= 2;
                        u /= 2;
                        t /= 2;
                    }
                }
                function read(e, r) {
                    if (i === 1) {
                        return e[r];
                    } else {
                        return e.readUInt16BE(r * i);
                    }
                }
                var a;
                if (n) {
                    var s = -1;
                    for(a = t; a < o; a++){
                        if (read(e, a) === read(r, s === -1 ? 0 : a - s)) {
                            if (s === -1) s = a;
                            if (a - s + 1 === u) return s * i;
                        } else {
                            if (s !== -1) a -= a - s;
                            s = -1;
                        }
                    }
                } else {
                    if (t + u > o) t = o - u;
                    for(a = t; a >= 0; a--){
                        var h = true;
                        for(var c = 0; c < u; c++){
                            if (read(e, a + c) !== read(r, c)) {
                                h = false;
                                break;
                            }
                        }
                        if (h) return a;
                    }
                }
                return -1;
            }
            Buffer.prototype.includes = function includes(e, r, t) {
                return this.indexOf(e, r, t) !== -1;
            };
            Buffer.prototype.indexOf = function indexOf(e, r, t) {
                return bidirectionalIndexOf(this, e, r, t, true);
            };
            Buffer.prototype.lastIndexOf = function lastIndexOf(e, r, t) {
                return bidirectionalIndexOf(this, e, r, t, false);
            };
            function hexWrite(e, r, t, f) {
                t = Number(t) || 0;
                var n = e.length - t;
                if (!f) {
                    f = n;
                } else {
                    f = Number(f);
                    if (f > n) {
                        f = n;
                    }
                }
                var i = r.length;
                if (f > i / 2) {
                    f = i / 2;
                }
                for(var o = 0; o < f; ++o){
                    var u = parseInt(r.substr(o * 2, 2), 16);
                    if (numberIsNaN(u)) return o;
                    e[t + o] = u;
                }
                return o;
            }
            function utf8Write(e, r, t, f) {
                return blitBuffer(utf8ToBytes(r, e.length - t), e, t, f);
            }
            function asciiWrite(e, r, t, f) {
                return blitBuffer(asciiToBytes(r), e, t, f);
            }
            function latin1Write(e, r, t, f) {
                return asciiWrite(e, r, t, f);
            }
            function base64Write(e, r, t, f) {
                return blitBuffer(base64ToBytes(r), e, t, f);
            }
            function ucs2Write(e, r, t, f) {
                return blitBuffer(utf16leToBytes(r, e.length - t), e, t, f);
            }
            Buffer.prototype.write = function write(e, r, t, f) {
                if (r === undefined) {
                    f = "utf8";
                    t = this.length;
                    r = 0;
                } else if (t === undefined && typeof r === "string") {
                    f = r;
                    t = this.length;
                    r = 0;
                } else if (isFinite(r)) {
                    r = r >>> 0;
                    if (isFinite(t)) {
                        t = t >>> 0;
                        if (f === undefined) f = "utf8";
                    } else {
                        f = t;
                        t = undefined;
                    }
                } else {
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                }
                var n = this.length - r;
                if (t === undefined || t > n) t = n;
                if (e.length > 0 && (t < 0 || r < 0) || r > this.length) {
                    throw new RangeError("Attempt to write outside buffer bounds");
                }
                if (!f) f = "utf8";
                var i = false;
                for(;;){
                    switch(f){
                        case "hex":
                            return hexWrite(this, e, r, t);
                        case "utf8":
                        case "utf-8":
                            return utf8Write(this, e, r, t);
                        case "ascii":
                            return asciiWrite(this, e, r, t);
                        case "latin1":
                        case "binary":
                            return latin1Write(this, e, r, t);
                        case "base64":
                            return base64Write(this, e, r, t);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return ucs2Write(this, e, r, t);
                        default:
                            if (i) throw new TypeError("Unknown encoding: " + f);
                            f = ("" + f).toLowerCase();
                            i = true;
                    }
                }
            };
            Buffer.prototype.toJSON = function toJSON() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function base64Slice(e, r, t) {
                if (r === 0 && t === e.length) {
                    return f.fromByteArray(e);
                } else {
                    return f.fromByteArray(e.slice(r, t));
                }
            }
            function utf8Slice(e, r, t) {
                t = Math.min(e.length, t);
                var f = [];
                var n = r;
                while(n < t){
                    var i = e[n];
                    var o = null;
                    var u = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
                    if (n + u <= t) {
                        var a, s, h, c;
                        switch(u){
                            case 1:
                                if (i < 128) {
                                    o = i;
                                }
                                break;
                            case 2:
                                a = e[n + 1];
                                if ((a & 192) === 128) {
                                    c = (i & 31) << 6 | a & 63;
                                    if (c > 127) {
                                        o = c;
                                    }
                                }
                                break;
                            case 3:
                                a = e[n + 1];
                                s = e[n + 2];
                                if ((a & 192) === 128 && (s & 192) === 128) {
                                    c = (i & 15) << 12 | (a & 63) << 6 | s & 63;
                                    if (c > 2047 && (c < 55296 || c > 57343)) {
                                        o = c;
                                    }
                                }
                                break;
                            case 4:
                                a = e[n + 1];
                                s = e[n + 2];
                                h = e[n + 3];
                                if ((a & 192) === 128 && (s & 192) === 128 && (h & 192) === 128) {
                                    c = (i & 15) << 18 | (a & 63) << 12 | (s & 63) << 6 | h & 63;
                                    if (c > 65535 && c < 1114112) {
                                        o = c;
                                    }
                                }
                        }
                    }
                    if (o === null) {
                        o = 65533;
                        u = 1;
                    } else if (o > 65535) {
                        o -= 65536;
                        f.push(o >>> 10 & 1023 | 55296);
                        o = 56320 | o & 1023;
                    }
                    f.push(o);
                    n += u;
                }
                return decodeCodePointsArray(f);
            }
            var u = 4096;
            function decodeCodePointsArray(e) {
                var r = e.length;
                if (r <= u) {
                    return String.fromCharCode.apply(String, e);
                }
                var t = "";
                var f = 0;
                while(f < r){
                    t += String.fromCharCode.apply(String, e.slice(f, f += u));
                }
                return t;
            }
            function asciiSlice(e, r, t) {
                var f = "";
                t = Math.min(e.length, t);
                for(var n = r; n < t; ++n){
                    f += String.fromCharCode(e[n] & 127);
                }
                return f;
            }
            function latin1Slice(e, r, t) {
                var f = "";
                t = Math.min(e.length, t);
                for(var n = r; n < t; ++n){
                    f += String.fromCharCode(e[n]);
                }
                return f;
            }
            function hexSlice(e, r, t) {
                var f = e.length;
                if (!r || r < 0) r = 0;
                if (!t || t < 0 || t > f) t = f;
                var n = "";
                for(var i = r; i < t; ++i){
                    n += s[e[i]];
                }
                return n;
            }
            function utf16leSlice(e, r, t) {
                var f = e.slice(r, t);
                var n = "";
                for(var i = 0; i < f.length; i += 2){
                    n += String.fromCharCode(f[i] + f[i + 1] * 256);
                }
                return n;
            }
            Buffer.prototype.slice = function slice(e, r) {
                var t = this.length;
                e = ~~e;
                r = r === undefined ? t : ~~r;
                if (e < 0) {
                    e += t;
                    if (e < 0) e = 0;
                } else if (e > t) {
                    e = t;
                }
                if (r < 0) {
                    r += t;
                    if (r < 0) r = 0;
                } else if (r > t) {
                    r = t;
                }
                if (r < e) r = e;
                var f = this.subarray(e, r);
                Object.setPrototypeOf(f, Buffer.prototype);
                return f;
            };
            function checkOffset(e, r, t) {
                if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + r > t) throw new RangeError("Trying to access beyond buffer length");
            }
            Buffer.prototype.readUIntLE = function readUIntLE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = this[e];
                var n = 1;
                var i = 0;
                while(++i < r && (n *= 256)){
                    f += this[e + i] * n;
                }
                return f;
            };
            Buffer.prototype.readUIntBE = function readUIntBE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) {
                    checkOffset(e, r, this.length);
                }
                var f = this[e + --r];
                var n = 1;
                while(r > 0 && (n *= 256)){
                    f += this[e + --r] * n;
                }
                return f;
            };
            Buffer.prototype.readUInt8 = function readUInt8(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 1, this.length);
                return this[e];
            };
            Buffer.prototype.readUInt16LE = function readUInt16LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                return this[e] | this[e + 1] << 8;
            };
            Buffer.prototype.readUInt16BE = function readUInt16BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                return this[e] << 8 | this[e + 1];
            };
            Buffer.prototype.readUInt32LE = function readUInt32LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
            };
            Buffer.prototype.readUInt32BE = function readUInt32BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
            };
            Buffer.prototype.readIntLE = function readIntLE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = this[e];
                var n = 1;
                var i = 0;
                while(++i < r && (n *= 256)){
                    f += this[e + i] * n;
                }
                n *= 128;
                if (f >= n) f -= Math.pow(2, 8 * r);
                return f;
            };
            Buffer.prototype.readIntBE = function readIntBE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = r;
                var n = 1;
                var i = this[e + --f];
                while(f > 0 && (n *= 256)){
                    i += this[e + --f] * n;
                }
                n *= 128;
                if (i >= n) i -= Math.pow(2, 8 * r);
                return i;
            };
            Buffer.prototype.readInt8 = function readInt8(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 1, this.length);
                if (!(this[e] & 128)) return this[e];
                return (255 - this[e] + 1) * -1;
            };
            Buffer.prototype.readInt16LE = function readInt16LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                var t = this[e] | this[e + 1] << 8;
                return t & 32768 ? t | 4294901760 : t;
            };
            Buffer.prototype.readInt16BE = function readInt16BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                var t = this[e + 1] | this[e] << 8;
                return t & 32768 ? t | 4294901760 : t;
            };
            Buffer.prototype.readInt32LE = function readInt32LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
            };
            Buffer.prototype.readInt32BE = function readInt32BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
            };
            Buffer.prototype.readFloatLE = function readFloatLE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return n.read(this, e, true, 23, 4);
            };
            Buffer.prototype.readFloatBE = function readFloatBE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return n.read(this, e, false, 23, 4);
            };
            Buffer.prototype.readDoubleLE = function readDoubleLE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 8, this.length);
                return n.read(this, e, true, 52, 8);
            };
            Buffer.prototype.readDoubleBE = function readDoubleBE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 8, this.length);
                return n.read(this, e, false, 52, 8);
            };
            function checkInt(e, r, t, f, n, i) {
                if (!Buffer.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (r > n || r < i) throw new RangeError('"value" argument is out of bounds');
                if (t + f > e.length) throw new RangeError("Index out of range");
            }
            Buffer.prototype.writeUIntLE = function writeUIntLE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                t = t >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t) - 1;
                    checkInt(this, e, r, t, n, 0);
                }
                var i = 1;
                var o = 0;
                this[r] = e & 255;
                while(++o < t && (i *= 256)){
                    this[r + o] = e / i & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeUIntBE = function writeUIntBE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                t = t >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t) - 1;
                    checkInt(this, e, r, t, n, 0);
                }
                var i = t - 1;
                var o = 1;
                this[r + i] = e & 255;
                while(--i >= 0 && (o *= 256)){
                    this[r + i] = e / o & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeUInt8 = function writeUInt8(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 1, 255, 0);
                this[r] = e & 255;
                return r + 1;
            };
            Buffer.prototype.writeUInt16LE = function writeUInt16LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 65535, 0);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                return r + 2;
            };
            Buffer.prototype.writeUInt16BE = function writeUInt16BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 65535, 0);
                this[r] = e >>> 8;
                this[r + 1] = e & 255;
                return r + 2;
            };
            Buffer.prototype.writeUInt32LE = function writeUInt32LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                this[r + 3] = e >>> 24;
                this[r + 2] = e >>> 16;
                this[r + 1] = e >>> 8;
                this[r] = e & 255;
                return r + 4;
            };
            Buffer.prototype.writeUInt32BE = function writeUInt32BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                this[r] = e >>> 24;
                this[r + 1] = e >>> 16;
                this[r + 2] = e >>> 8;
                this[r + 3] = e & 255;
                return r + 4;
            };
            Buffer.prototype.writeIntLE = function writeIntLE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t - 1);
                    checkInt(this, e, r, t, n - 1, -n);
                }
                var i = 0;
                var o = 1;
                var u = 0;
                this[r] = e & 255;
                while(++i < t && (o *= 256)){
                    if (e < 0 && u === 0 && this[r + i - 1] !== 0) {
                        u = 1;
                    }
                    this[r + i] = (e / o >> 0) - u & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeIntBE = function writeIntBE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t - 1);
                    checkInt(this, e, r, t, n - 1, -n);
                }
                var i = t - 1;
                var o = 1;
                var u = 0;
                this[r + i] = e & 255;
                while(--i >= 0 && (o *= 256)){
                    if (e < 0 && u === 0 && this[r + i + 1] !== 0) {
                        u = 1;
                    }
                    this[r + i] = (e / o >> 0) - u & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeInt8 = function writeInt8(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 1, 127, -128);
                if (e < 0) e = 255 + e + 1;
                this[r] = e & 255;
                return r + 1;
            };
            Buffer.prototype.writeInt16LE = function writeInt16LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 32767, -32768);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                return r + 2;
            };
            Buffer.prototype.writeInt16BE = function writeInt16BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 32767, -32768);
                this[r] = e >>> 8;
                this[r + 1] = e & 255;
                return r + 2;
            };
            Buffer.prototype.writeInt32LE = function writeInt32LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 2147483647, -2147483648);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                this[r + 2] = e >>> 16;
                this[r + 3] = e >>> 24;
                return r + 4;
            };
            Buffer.prototype.writeInt32BE = function writeInt32BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 2147483647, -2147483648);
                if (e < 0) e = 4294967295 + e + 1;
                this[r] = e >>> 24;
                this[r + 1] = e >>> 16;
                this[r + 2] = e >>> 8;
                this[r + 3] = e & 255;
                return r + 4;
            };
            function checkIEEE754(e, r, t, f, n, i) {
                if (t + f > e.length) throw new RangeError("Index out of range");
                if (t < 0) throw new RangeError("Index out of range");
            }
            function writeFloat(e, r, t, f, i) {
                r = +r;
                t = t >>> 0;
                if (!i) {
                    checkIEEE754(e, r, t, 4, 34028234663852886e22, -34028234663852886e22);
                }
                n.write(e, r, t, f, 23, 4);
                return t + 4;
            }
            Buffer.prototype.writeFloatLE = function writeFloatLE(e, r, t) {
                return writeFloat(this, e, r, true, t);
            };
            Buffer.prototype.writeFloatBE = function writeFloatBE(e, r, t) {
                return writeFloat(this, e, r, false, t);
            };
            function writeDouble(e, r, t, f, i) {
                r = +r;
                t = t >>> 0;
                if (!i) {
                    checkIEEE754(e, r, t, 8, 17976931348623157e292, -17976931348623157e292);
                }
                n.write(e, r, t, f, 52, 8);
                return t + 8;
            }
            Buffer.prototype.writeDoubleLE = function writeDoubleLE(e, r, t) {
                return writeDouble(this, e, r, true, t);
            };
            Buffer.prototype.writeDoubleBE = function writeDoubleBE(e, r, t) {
                return writeDouble(this, e, r, false, t);
            };
            Buffer.prototype.copy = function copy(e, r, t, f) {
                if (!Buffer.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                if (!t) t = 0;
                if (!f && f !== 0) f = this.length;
                if (r >= e.length) r = e.length;
                if (!r) r = 0;
                if (f > 0 && f < t) f = t;
                if (f === t) return 0;
                if (e.length === 0 || this.length === 0) return 0;
                if (r < 0) {
                    throw new RangeError("targetStart out of bounds");
                }
                if (t < 0 || t >= this.length) throw new RangeError("Index out of range");
                if (f < 0) throw new RangeError("sourceEnd out of bounds");
                if (f > this.length) f = this.length;
                if (e.length - r < f - t) {
                    f = e.length - r + t;
                }
                var n = f - t;
                if (this === e && typeof Uint8Array.prototype.copyWithin === "function") {
                    this.copyWithin(r, t, f);
                } else if (this === e && t < r && r < f) {
                    for(var i = n - 1; i >= 0; --i){
                        e[i + r] = this[i + t];
                    }
                } else {
                    Uint8Array.prototype.set.call(e, this.subarray(t, f), r);
                }
                return n;
            };
            Buffer.prototype.fill = function fill(e, r, t, f) {
                if (typeof e === "string") {
                    if (typeof r === "string") {
                        f = r;
                        r = 0;
                        t = this.length;
                    } else if (typeof t === "string") {
                        f = t;
                        t = this.length;
                    }
                    if (f !== undefined && typeof f !== "string") {
                        throw new TypeError("encoding must be a string");
                    }
                    if (typeof f === "string" && !Buffer.isEncoding(f)) {
                        throw new TypeError("Unknown encoding: " + f);
                    }
                    if (e.length === 1) {
                        var n = e.charCodeAt(0);
                        if (f === "utf8" && n < 128 || f === "latin1") {
                            e = n;
                        }
                    }
                } else if (typeof e === "number") {
                    e = e & 255;
                } else if (typeof e === "boolean") {
                    e = Number(e);
                }
                if (r < 0 || this.length < r || this.length < t) {
                    throw new RangeError("Out of range index");
                }
                if (t <= r) {
                    return this;
                }
                r = r >>> 0;
                t = t === undefined ? this.length : t >>> 0;
                if (!e) e = 0;
                var i;
                if (typeof e === "number") {
                    for(i = r; i < t; ++i){
                        this[i] = e;
                    }
                } else {
                    var o = Buffer.isBuffer(e) ? e : Buffer.from(e, f);
                    var u = o.length;
                    if (u === 0) {
                        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                    }
                    for(i = 0; i < t - r; ++i){
                        this[i + r] = o[i % u];
                    }
                }
                return this;
            };
            var a = /[^+/0-9A-Za-z-_]/g;
            function base64clean(e) {
                e = e.split("=")[0];
                e = e.trim().replace(a, "");
                if (e.length < 2) return "";
                while(e.length % 4 !== 0){
                    e = e + "=";
                }
                return e;
            }
            function utf8ToBytes(e, r) {
                r = r || Infinity;
                var t;
                var f = e.length;
                var n = null;
                var i = [];
                for(var o = 0; o < f; ++o){
                    t = e.charCodeAt(o);
                    if (t > 55295 && t < 57344) {
                        if (!n) {
                            if (t > 56319) {
                                if ((r -= 3) > -1) i.push(239, 191, 189);
                                continue;
                            } else if (o + 1 === f) {
                                if ((r -= 3) > -1) i.push(239, 191, 189);
                                continue;
                            }
                            n = t;
                            continue;
                        }
                        if (t < 56320) {
                            if ((r -= 3) > -1) i.push(239, 191, 189);
                            n = t;
                            continue;
                        }
                        t = (n - 55296 << 10 | t - 56320) + 65536;
                    } else if (n) {
                        if ((r -= 3) > -1) i.push(239, 191, 189);
                    }
                    n = null;
                    if (t < 128) {
                        if ((r -= 1) < 0) break;
                        i.push(t);
                    } else if (t < 2048) {
                        if ((r -= 2) < 0) break;
                        i.push(t >> 6 | 192, t & 63 | 128);
                    } else if (t < 65536) {
                        if ((r -= 3) < 0) break;
                        i.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
                    } else if (t < 1114112) {
                        if ((r -= 4) < 0) break;
                        i.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
                    } else {
                        throw new Error("Invalid code point");
                    }
                }
                return i;
            }
            function asciiToBytes(e) {
                var r = [];
                for(var t = 0; t < e.length; ++t){
                    r.push(e.charCodeAt(t) & 255);
                }
                return r;
            }
            function utf16leToBytes(e, r) {
                var t, f, n;
                var i = [];
                for(var o = 0; o < e.length; ++o){
                    if ((r -= 2) < 0) break;
                    t = e.charCodeAt(o);
                    f = t >> 8;
                    n = t % 256;
                    i.push(n);
                    i.push(f);
                }
                return i;
            }
            function base64ToBytes(e) {
                return f.toByteArray(base64clean(e));
            }
            function blitBuffer(e, r, t, f) {
                for(var n = 0; n < f; ++n){
                    if (n + t >= r.length || n >= e.length) break;
                    r[n + t] = e[n];
                }
                return n;
            }
            function isInstance(e, r) {
                return e instanceof r || e != null && e.constructor != null && e.constructor.name != null && e.constructor.name === r.name;
            }
            function numberIsNaN(e) {
                return e !== e;
            }
            var s = function() {
                var e = "0123456789abcdef";
                var r = new Array(256);
                for(var t = 0; t < 16; ++t){
                    var f = t * 16;
                    for(var n = 0; n < 16; ++n){
                        r[f + n] = e[t] + e[n];
                    }
                }
                return r;
            }();
        },
        783: function(e, r) {
            /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ r.read = function(e, r, t, f, n) {
                var i, o;
                var u = n * 8 - f - 1;
                var a = (1 << u) - 1;
                var s = a >> 1;
                var h = -7;
                var c = t ? n - 1 : 0;
                var l = t ? -1 : 1;
                var p = e[r + c];
                c += l;
                i = p & (1 << -h) - 1;
                p >>= -h;
                h += u;
                for(; h > 0; i = i * 256 + e[r + c], c += l, h -= 8){}
                o = i & (1 << -h) - 1;
                i >>= -h;
                h += f;
                for(; h > 0; o = o * 256 + e[r + c], c += l, h -= 8){}
                if (i === 0) {
                    i = 1 - s;
                } else if (i === a) {
                    return o ? NaN : (p ? -1 : 1) * Infinity;
                } else {
                    o = o + Math.pow(2, f);
                    i = i - s;
                }
                return (p ? -1 : 1) * o * Math.pow(2, i - f);
            };
            r.write = function(e, r, t, f, n, i) {
                var o, u, a;
                var s = i * 8 - n - 1;
                var h = (1 << s) - 1;
                var c = h >> 1;
                var l = n === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var p = f ? 0 : i - 1;
                var y = f ? 1 : -1;
                var g = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
                r = Math.abs(r);
                if (isNaN(r) || r === Infinity) {
                    u = isNaN(r) ? 1 : 0;
                    o = h;
                } else {
                    o = Math.floor(Math.log(r) / Math.LN2);
                    if (r * (a = Math.pow(2, -o)) < 1) {
                        o--;
                        a *= 2;
                    }
                    if (o + c >= 1) {
                        r += l / a;
                    } else {
                        r += l * Math.pow(2, 1 - c);
                    }
                    if (r * a >= 2) {
                        o++;
                        a /= 2;
                    }
                    if (o + c >= h) {
                        u = 0;
                        o = h;
                    } else if (o + c >= 1) {
                        u = (r * a - 1) * Math.pow(2, n);
                        o = o + c;
                    } else {
                        u = r * Math.pow(2, c - 1) * Math.pow(2, n);
                        o = 0;
                    }
                }
                for(; n >= 8; e[t + p] = u & 255, p += y, u /= 256, n -= 8){}
                o = o << n | u;
                s += n;
                for(; s > 0; e[t + p] = o & 255, p += y, o /= 256, s -= 8){}
                e[t + p - y] |= g * 128;
            };
        }
    };
    var r = {};
    function __nccwpck_require__(t) {
        var f = r[t];
        if (f !== undefined) {
            return f.exports;
        }
        var n = r[t] = {
            exports: {}
        };
        var i = true;
        try {
            e[t](n, n.exports, __nccwpck_require__);
            i = false;
        } finally{
            if (i) delete r[t];
        }
        return n.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/buffer") + "/";
    var t = __nccwpck_require__(72);
    module.exports = t;
})();
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/path-browserify/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function() {
    "use strict";
    var e = {
        114: function(e) {
            function assertPath(e) {
                if (typeof e !== "string") {
                    throw new TypeError("Path must be a string. Received " + JSON.stringify(e));
                }
            }
            function normalizeStringPosix(e, r) {
                var t = "";
                var i = 0;
                var n = -1;
                var a = 0;
                var f;
                for(var l = 0; l <= e.length; ++l){
                    if (l < e.length) f = e.charCodeAt(l);
                    else if (f === 47) break;
                    else f = 47;
                    if (f === 47) {
                        if (n === l - 1 || a === 1) {} else if (n !== l - 1 && a === 2) {
                            if (t.length < 2 || i !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
                                if (t.length > 2) {
                                    var s = t.lastIndexOf("/");
                                    if (s !== t.length - 1) {
                                        if (s === -1) {
                                            t = "";
                                            i = 0;
                                        } else {
                                            t = t.slice(0, s);
                                            i = t.length - 1 - t.lastIndexOf("/");
                                        }
                                        n = l;
                                        a = 0;
                                        continue;
                                    }
                                } else if (t.length === 2 || t.length === 1) {
                                    t = "";
                                    i = 0;
                                    n = l;
                                    a = 0;
                                    continue;
                                }
                            }
                            if (r) {
                                if (t.length > 0) t += "/..";
                                else t = "..";
                                i = 2;
                            }
                        } else {
                            if (t.length > 0) t += "/" + e.slice(n + 1, l);
                            else t = e.slice(n + 1, l);
                            i = l - n - 1;
                        }
                        n = l;
                        a = 0;
                    } else if (f === 46 && a !== -1) {
                        ++a;
                    } else {
                        a = -1;
                    }
                }
                return t;
            }
            function _format(e, r) {
                var t = r.dir || r.root;
                var i = r.base || (r.name || "") + (r.ext || "");
                if (!t) {
                    return i;
                }
                if (t === r.root) {
                    return t + i;
                }
                return t + e + i;
            }
            var r = {
                resolve: function resolve() {
                    var e = "";
                    var r = false;
                    var t;
                    for(var i = arguments.length - 1; i >= -1 && !r; i--){
                        var n;
                        if (i >= 0) n = arguments[i];
                        else {
                            if (t === undefined) t = "";
                            n = t;
                        }
                        assertPath(n);
                        if (n.length === 0) {
                            continue;
                        }
                        e = n + "/" + e;
                        r = n.charCodeAt(0) === 47;
                    }
                    e = normalizeStringPosix(e, !r);
                    if (r) {
                        if (e.length > 0) return "/" + e;
                        else return "/";
                    } else if (e.length > 0) {
                        return e;
                    } else {
                        return ".";
                    }
                },
                normalize: function normalize(e) {
                    assertPath(e);
                    if (e.length === 0) return ".";
                    var r = e.charCodeAt(0) === 47;
                    var t = e.charCodeAt(e.length - 1) === 47;
                    e = normalizeStringPosix(e, !r);
                    if (e.length === 0 && !r) e = ".";
                    if (e.length > 0 && t) e += "/";
                    if (r) return "/" + e;
                    return e;
                },
                isAbsolute: function isAbsolute(e) {
                    assertPath(e);
                    return e.length > 0 && e.charCodeAt(0) === 47;
                },
                join: function join() {
                    if (arguments.length === 0) return ".";
                    var e;
                    for(var t = 0; t < arguments.length; ++t){
                        var i = arguments[t];
                        assertPath(i);
                        if (i.length > 0) {
                            if (e === undefined) e = i;
                            else e += "/" + i;
                        }
                    }
                    if (e === undefined) return ".";
                    return r.normalize(e);
                },
                relative: function relative(e, t) {
                    assertPath(e);
                    assertPath(t);
                    if (e === t) return "";
                    e = r.resolve(e);
                    t = r.resolve(t);
                    if (e === t) return "";
                    var i = 1;
                    for(; i < e.length; ++i){
                        if (e.charCodeAt(i) !== 47) break;
                    }
                    var n = e.length;
                    var a = n - i;
                    var f = 1;
                    for(; f < t.length; ++f){
                        if (t.charCodeAt(f) !== 47) break;
                    }
                    var l = t.length;
                    var s = l - f;
                    var o = a < s ? a : s;
                    var u = -1;
                    var h = 0;
                    for(; h <= o; ++h){
                        if (h === o) {
                            if (s > o) {
                                if (t.charCodeAt(f + h) === 47) {
                                    return t.slice(f + h + 1);
                                } else if (h === 0) {
                                    return t.slice(f + h);
                                }
                            } else if (a > o) {
                                if (e.charCodeAt(i + h) === 47) {
                                    u = h;
                                } else if (h === 0) {
                                    u = 0;
                                }
                            }
                            break;
                        }
                        var c = e.charCodeAt(i + h);
                        var v = t.charCodeAt(f + h);
                        if (c !== v) break;
                        else if (c === 47) u = h;
                    }
                    var g = "";
                    for(h = i + u + 1; h <= n; ++h){
                        if (h === n || e.charCodeAt(h) === 47) {
                            if (g.length === 0) g += "..";
                            else g += "/..";
                        }
                    }
                    if (g.length > 0) return g + t.slice(f + u);
                    else {
                        f += u;
                        if (t.charCodeAt(f) === 47) ++f;
                        return t.slice(f);
                    }
                },
                _makeLong: function _makeLong(e) {
                    return e;
                },
                dirname: function dirname(e) {
                    assertPath(e);
                    if (e.length === 0) return ".";
                    var r = e.charCodeAt(0);
                    var t = r === 47;
                    var i = -1;
                    var n = true;
                    for(var a = e.length - 1; a >= 1; --a){
                        r = e.charCodeAt(a);
                        if (r === 47) {
                            if (!n) {
                                i = a;
                                break;
                            }
                        } else {
                            n = false;
                        }
                    }
                    if (i === -1) return t ? "/" : ".";
                    if (t && i === 1) return "//";
                    return e.slice(0, i);
                },
                basename: function basename(e, r) {
                    if (r !== undefined && typeof r !== "string") throw new TypeError('"ext" argument must be a string');
                    assertPath(e);
                    var t = 0;
                    var i = -1;
                    var n = true;
                    var a;
                    if (r !== undefined && r.length > 0 && r.length <= e.length) {
                        if (r.length === e.length && r === e) return "";
                        var f = r.length - 1;
                        var l = -1;
                        for(a = e.length - 1; a >= 0; --a){
                            var s = e.charCodeAt(a);
                            if (s === 47) {
                                if (!n) {
                                    t = a + 1;
                                    break;
                                }
                            } else {
                                if (l === -1) {
                                    n = false;
                                    l = a + 1;
                                }
                                if (f >= 0) {
                                    if (s === r.charCodeAt(f)) {
                                        if (--f === -1) {
                                            i = a;
                                        }
                                    } else {
                                        f = -1;
                                        i = l;
                                    }
                                }
                            }
                        }
                        if (t === i) i = l;
                        else if (i === -1) i = e.length;
                        return e.slice(t, i);
                    } else {
                        for(a = e.length - 1; a >= 0; --a){
                            if (e.charCodeAt(a) === 47) {
                                if (!n) {
                                    t = a + 1;
                                    break;
                                }
                            } else if (i === -1) {
                                n = false;
                                i = a + 1;
                            }
                        }
                        if (i === -1) return "";
                        return e.slice(t, i);
                    }
                },
                extname: function extname(e) {
                    assertPath(e);
                    var r = -1;
                    var t = 0;
                    var i = -1;
                    var n = true;
                    var a = 0;
                    for(var f = e.length - 1; f >= 0; --f){
                        var l = e.charCodeAt(f);
                        if (l === 47) {
                            if (!n) {
                                t = f + 1;
                                break;
                            }
                            continue;
                        }
                        if (i === -1) {
                            n = false;
                            i = f + 1;
                        }
                        if (l === 46) {
                            if (r === -1) r = f;
                            else if (a !== 1) a = 1;
                        } else if (r !== -1) {
                            a = -1;
                        }
                    }
                    if (r === -1 || i === -1 || a === 0 || a === 1 && r === i - 1 && r === t + 1) {
                        return "";
                    }
                    return e.slice(r, i);
                },
                format: function format(e) {
                    if (e === null || typeof e !== "object") {
                        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
                    }
                    return _format("/", e);
                },
                parse: function parse(e) {
                    assertPath(e);
                    var r = {
                        root: "",
                        dir: "",
                        base: "",
                        ext: "",
                        name: ""
                    };
                    if (e.length === 0) return r;
                    var t = e.charCodeAt(0);
                    var i = t === 47;
                    var n;
                    if (i) {
                        r.root = "/";
                        n = 1;
                    } else {
                        n = 0;
                    }
                    var a = -1;
                    var f = 0;
                    var l = -1;
                    var s = true;
                    var o = e.length - 1;
                    var u = 0;
                    for(; o >= n; --o){
                        t = e.charCodeAt(o);
                        if (t === 47) {
                            if (!s) {
                                f = o + 1;
                                break;
                            }
                            continue;
                        }
                        if (l === -1) {
                            s = false;
                            l = o + 1;
                        }
                        if (t === 46) {
                            if (a === -1) a = o;
                            else if (u !== 1) u = 1;
                        } else if (a !== -1) {
                            u = -1;
                        }
                    }
                    if (a === -1 || l === -1 || u === 0 || u === 1 && a === l - 1 && a === f + 1) {
                        if (l !== -1) {
                            if (f === 0 && i) r.base = r.name = e.slice(1, l);
                            else r.base = r.name = e.slice(f, l);
                        }
                    } else {
                        if (f === 0 && i) {
                            r.name = e.slice(1, a);
                            r.base = e.slice(1, l);
                        } else {
                            r.name = e.slice(f, a);
                            r.base = e.slice(f, l);
                        }
                        r.ext = e.slice(a, l);
                    }
                    if (f > 0) r.dir = e.slice(0, f - 1);
                    else if (i) r.dir = "/";
                    return r;
                },
                sep: "/",
                delimiter: ":",
                win32: null,
                posix: null
            };
            r.posix = r;
            e.exports = r;
        }
    };
    var r = {};
    function __nccwpck_require__(t) {
        var i = r[t];
        if (i !== undefined) {
            return i.exports;
        }
        var n = r[t] = {
            exports: {}
        };
        var a = true;
        try {
            e[t](n, n.exports, __nccwpck_require__);
            a = false;
        } finally{
            if (a) delete r[t];
        }
        return n.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/path-browserify") + "/";
    var t = __nccwpck_require__(114);
    module.exports = t;
})();
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/querystring-es3/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function() {
    "use strict";
    var e = {
        815: function(e) {
            function hasOwnProperty(e, r) {
                return Object.prototype.hasOwnProperty.call(e, r);
            }
            e.exports = function(e, n, t, o) {
                n = n || "&";
                t = t || "=";
                var a = {};
                if (typeof e !== "string" || e.length === 0) {
                    return a;
                }
                var i = /\+/g;
                e = e.split(n);
                var u = 1e3;
                if (o && typeof o.maxKeys === "number") {
                    u = o.maxKeys;
                }
                var c = e.length;
                if (u > 0 && c > u) {
                    c = u;
                }
                for(var p = 0; p < c; ++p){
                    var f = e[p].replace(i, "%20"), s = f.indexOf(t), _, l, y, d;
                    if (s >= 0) {
                        _ = f.substr(0, s);
                        l = f.substr(s + 1);
                    } else {
                        _ = f;
                        l = "";
                    }
                    y = decodeURIComponent(_);
                    d = decodeURIComponent(l);
                    if (!hasOwnProperty(a, y)) {
                        a[y] = d;
                    } else if (r(a[y])) {
                        a[y].push(d);
                    } else {
                        a[y] = [
                            a[y],
                            d
                        ];
                    }
                }
                return a;
            };
            var r = Array.isArray || function(e) {
                return Object.prototype.toString.call(e) === "[object Array]";
            };
        },
        577: function(e) {
            var stringifyPrimitive = function(e) {
                switch(typeof e){
                    case "string":
                        return e;
                    case "boolean":
                        return e ? "true" : "false";
                    case "number":
                        return isFinite(e) ? e : "";
                    default:
                        return "";
                }
            };
            e.exports = function(e, t, o, a) {
                t = t || "&";
                o = o || "=";
                if (e === null) {
                    e = undefined;
                }
                if (typeof e === "object") {
                    return map(n(e), function(n) {
                        var a = encodeURIComponent(stringifyPrimitive(n)) + o;
                        if (r(e[n])) {
                            return map(e[n], function(e) {
                                return a + encodeURIComponent(stringifyPrimitive(e));
                            }).join(t);
                        } else {
                            return a + encodeURIComponent(stringifyPrimitive(e[n]));
                        }
                    }).join(t);
                }
                if (!a) return "";
                return encodeURIComponent(stringifyPrimitive(a)) + o + encodeURIComponent(stringifyPrimitive(e));
            };
            var r = Array.isArray || function(e) {
                return Object.prototype.toString.call(e) === "[object Array]";
            };
            function map(e, r) {
                if (e.map) return e.map(r);
                var n = [];
                for(var t = 0; t < e.length; t++){
                    n.push(r(e[t], t));
                }
                return n;
            }
            var n = Object.keys || function(e) {
                var r = [];
                for(var n in e){
                    if (Object.prototype.hasOwnProperty.call(e, n)) r.push(n);
                }
                return r;
            };
        }
    };
    var r = {};
    function __nccwpck_require__(n) {
        var t = r[n];
        if (t !== undefined) {
            return t.exports;
        }
        var o = r[n] = {
            exports: {}
        };
        var a = true;
        try {
            e[n](o, o.exports, __nccwpck_require__);
            a = false;
        } finally{
            if (a) delete r[n];
        }
        return o.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/querystring-es3") + "/";
    var n = {};
    !function() {
        var e = n;
        e.decode = e.parse = __nccwpck_require__(815);
        e.encode = e.stringify = __nccwpck_require__(577);
    }();
    module.exports = n;
})();
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/native-url/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function() {
    var e = {
        452: function(e) {
            "use strict";
            e.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/querystring-es3/index.js [app-client] (ecmascript)");
        }
    };
    var t = {};
    function __nccwpck_require__(o) {
        var a = t[o];
        if (a !== undefined) {
            return a.exports;
        }
        var s = t[o] = {
            exports: {}
        };
        var n = true;
        try {
            e[o](s, s.exports, __nccwpck_require__);
            n = false;
        } finally{
            if (n) delete t[o];
        }
        return s.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/native-url") + "/";
    var o = {};
    !function() {
        var e = o;
        var t, a = (t = __nccwpck_require__(452)) && "object" == typeof t && "default" in t ? t.default : t, s = /https?|ftp|gopher|file/;
        function r(e) {
            "string" == typeof e && (e = d(e));
            var t = function(e, t, o) {
                var a = e.auth, s = e.hostname, n = e.protocol || "", p = e.pathname || "", c = e.hash || "", i = e.query || "", u = !1;
                a = a ? encodeURIComponent(a).replace(/%3A/i, ":") + "@" : "", e.host ? u = a + e.host : s && (u = a + (~s.indexOf(":") ? "[" + s + "]" : s), e.port && (u += ":" + e.port)), i && "object" == typeof i && (i = t.encode(i));
                var f = e.search || i && "?" + i || "";
                return n && ":" !== n.substr(-1) && (n += ":"), e.slashes || (!n || o.test(n)) && !1 !== u ? (u = "//" + (u || ""), p && "/" !== p[0] && (p = "/" + p)) : u || (u = ""), c && "#" !== c[0] && (c = "#" + c), f && "?" !== f[0] && (f = "?" + f), {
                    protocol: n,
                    host: u,
                    pathname: p = p.replace(/[?#]/g, encodeURIComponent),
                    search: f = f.replace("#", "%23"),
                    hash: c
                };
            }(e, a, s);
            return "" + t.protocol + t.host + t.pathname + t.search + t.hash;
        }
        var n = "http://", p = "w.w", c = n + p, i = /^([a-z0-9.+-]*:\/\/\/)([a-z0-9.+-]:\/*)?/i, u = /https?|ftp|gopher|file/;
        function h(e, t) {
            var o = "string" == typeof e ? d(e) : e;
            e = "object" == typeof e ? r(e) : e;
            var a = d(t), s = "";
            o.protocol && !o.slashes && (s = o.protocol, e = e.replace(o.protocol, ""), s += "/" === t[0] || "/" === e[0] ? "/" : ""), s && a.protocol && (s = "", a.slashes || (s = a.protocol, t = t.replace(a.protocol, "")));
            var p = e.match(i);
            p && !a.protocol && (e = e.substr((s = p[1] + (p[2] || "")).length), /^\/\/[^/]/.test(t) && (s = s.slice(0, -1)));
            var f = new URL(e, c + "/"), m = new URL(t, f).toString().replace(c, ""), v = a.protocol || o.protocol;
            return v += o.slashes || a.slashes ? "//" : "", !s && v ? m = m.replace(n, v) : s && (m = m.replace(n, "")), u.test(m) || ~t.indexOf(".") || "/" === e.slice(-1) || "/" === t.slice(-1) || "/" !== m.slice(-1) || (m = m.slice(0, -1)), s && (m = s + ("/" === m[0] ? m.substr(1) : m)), m;
        }
        function l() {}
        l.prototype.parse = d, l.prototype.format = r, l.prototype.resolve = h, l.prototype.resolveObject = h;
        var f = /^https?|ftp|gopher|file/, m = /^(.*?)([#?].*)/, v = /^([a-z0-9.+-]*:)(\/{0,3})(.*)/i, _ = /^([a-z0-9.+-]*:)?\/\/\/*/i, b = /^([a-z0-9.+-]*:)(\/{0,2})\[(.*)\]$/i;
        function d(e, t, o) {
            if (void 0 === t && (t = !1), void 0 === o && (o = !1), e && "object" == typeof e && e instanceof l) return e;
            var s = (e = e.trim()).match(m);
            e = s ? s[1].replace(/\\/g, "/") + s[2] : e.replace(/\\/g, "/"), b.test(e) && "/" !== e.slice(-1) && (e += "/");
            var n = !/(^javascript)/.test(e) && e.match(v), i = _.test(e), u = "";
            n && (f.test(n[1]) || (u = n[1].toLowerCase(), e = "" + n[2] + n[3]), n[2] || (i = !1, f.test(n[1]) ? (u = n[1], e = "" + n[3]) : e = "//" + n[3]), 3 !== n[2].length && 1 !== n[2].length || (u = n[1], e = "/" + n[3]));
            var g, y = (s ? s[1] : e).match(/^https?:\/\/[^/]+(:[0-9]+)(?=\/|$)/), w = y && y[1], x = new l, C = "", U = "";
            try {
                g = new URL(e);
            } catch (t) {
                C = t, u || o || !/^\/\//.test(e) || /^\/\/.+[@.]/.test(e) || (U = "/", e = e.substr(1));
                try {
                    g = new URL(e, c);
                } catch (e) {
                    return x.protocol = u, x.href = u, x;
                }
            }
            x.slashes = i && !U, x.host = g.host === p ? "" : g.host, x.hostname = g.hostname === p ? "" : g.hostname.replace(/(\[|\])/g, ""), x.protocol = C ? u || null : g.protocol, x.search = g.search.replace(/\\/g, "%5C"), x.hash = g.hash.replace(/\\/g, "%5C");
            var j = e.split("#");
            !x.search && ~j[0].indexOf("?") && (x.search = "?"), x.hash || "" !== j[1] || (x.hash = "#"), x.query = t ? a.decode(g.search.substr(1)) : x.search.substr(1), x.pathname = U + (n ? function(e) {
                return e.replace(/['^|`]/g, function(e) {
                    return "%" + e.charCodeAt().toString(16).toUpperCase();
                }).replace(/((?:%[0-9A-F]{2})+)/g, function(e, t) {
                    try {
                        return decodeURIComponent(t).split("").map(function(e) {
                            var t = e.charCodeAt();
                            return t > 256 || /^[a-z0-9]$/i.test(e) ? e : "%" + t.toString(16).toUpperCase();
                        }).join("");
                    } catch (e) {
                        return t;
                    }
                });
            }(g.pathname) : g.pathname), "about:" === x.protocol && "blank" === x.pathname && (x.protocol = "", x.pathname = ""), C && "/" !== e[0] && (x.pathname = x.pathname.substr(1)), u && !f.test(u) && "/" !== e.slice(-1) && "/" === x.pathname && (x.pathname = ""), x.path = x.pathname + x.search, x.auth = [
                g.username,
                g.password
            ].map(decodeURIComponent).filter(Boolean).join(":"), x.port = g.port, w && !x.host.endsWith(w) && (x.host += w, x.port = w.slice(1)), x.href = U ? "" + x.pathname + x.search + x.hash : r(x);
            var q = /^(file)/.test(x.href) ? [
                "host",
                "hostname"
            ] : [];
            return Object.keys(x).forEach(function(e) {
                ~q.indexOf(e) || (x[e] = x[e] || null);
            }), x;
        }
        e.parse = d, e.format = r, e.resolve = h, e.resolveObject = function(e, t) {
            return d(h(e, t));
        }, e.Url = l;
    }();
    module.exports = o;
})();
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/util/util.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
(function() {
    var r = {
        992: function(r) {
            r.exports = function(r, t, n) {
                if (r.filter) return r.filter(t, n);
                if (void 0 === r || null === r) throw new TypeError;
                if ("function" != typeof t) throw new TypeError;
                var o = [];
                for(var i = 0; i < r.length; i++){
                    if (!e.call(r, i)) continue;
                    var a = r[i];
                    if (t.call(n, a, i, r)) o.push(a);
                }
                return o;
            };
            var e = Object.prototype.hasOwnProperty;
        },
        256: function(r, e, t) {
            "use strict";
            var n = t(192);
            var o = t(139);
            var i = o(n("String.prototype.indexOf"));
            r.exports = function callBoundIntrinsic(r, e) {
                var t = n(r, !!e);
                if (typeof t === "function" && i(r, ".prototype.") > -1) {
                    return o(t);
                }
                return t;
            };
        },
        139: function(r, e, t) {
            "use strict";
            var n = t(212);
            var o = t(192);
            var i = o("%Function.prototype.apply%");
            var a = o("%Function.prototype.call%");
            var f = o("%Reflect.apply%", true) || n.call(a, i);
            var u = o("%Object.getOwnPropertyDescriptor%", true);
            var s = o("%Object.defineProperty%", true);
            var c = o("%Math.max%");
            if (s) {
                try {
                    s({}, "a", {
                        value: 1
                    });
                } catch (r) {
                    s = null;
                }
            }
            r.exports = function callBind(r) {
                var e = f(n, a, arguments);
                if (u && s) {
                    var t = u(e, "length");
                    if (t.configurable) {
                        s(e, "length", {
                            value: 1 + c(0, r.length - (arguments.length - 1))
                        });
                    }
                }
                return e;
            };
            var y = function applyBind() {
                return f(n, i, arguments);
            };
            if (s) {
                s(r.exports, "apply", {
                    value: y
                });
            } else {
                r.exports.apply = y;
            }
        },
        181: function(r) {
            "use strict";
            r.exports = EvalError;
        },
        545: function(r) {
            "use strict";
            r.exports = Error;
        },
        22: function(r) {
            "use strict";
            r.exports = RangeError;
        },
        803: function(r) {
            "use strict";
            r.exports = ReferenceError;
        },
        182: function(r) {
            "use strict";
            r.exports = SyntaxError;
        },
        202: function(r) {
            "use strict";
            r.exports = TypeError;
        },
        284: function(r) {
            "use strict";
            r.exports = URIError;
        },
        144: function(r) {
            var e = Object.prototype.hasOwnProperty;
            var t = Object.prototype.toString;
            r.exports = function forEach(r, n, o) {
                if (t.call(n) !== "[object Function]") {
                    throw new TypeError("iterator must be a function");
                }
                var i = r.length;
                if (i === +i) {
                    for(var a = 0; a < i; a++){
                        n.call(o, r[a], a, r);
                    }
                } else {
                    for(var f in r){
                        if (e.call(r, f)) {
                            n.call(o, r[f], f, r);
                        }
                    }
                }
            };
        },
        136: function(r) {
            "use strict";
            var e = "Function.prototype.bind called on incompatible ";
            var t = Object.prototype.toString;
            var n = Math.max;
            var o = "[object Function]";
            var i = function concatty(r, e) {
                var t = [];
                for(var n = 0; n < r.length; n += 1){
                    t[n] = r[n];
                }
                for(var o = 0; o < e.length; o += 1){
                    t[o + r.length] = e[o];
                }
                return t;
            };
            var a = function slicy(r, e) {
                var t = [];
                for(var n = e || 0, o = 0; n < r.length; n += 1, o += 1){
                    t[o] = r[n];
                }
                return t;
            };
            var joiny = function(r, e) {
                var t = "";
                for(var n = 0; n < r.length; n += 1){
                    t += r[n];
                    if (n + 1 < r.length) {
                        t += e;
                    }
                }
                return t;
            };
            r.exports = function bind(r) {
                var f = this;
                if (typeof f !== "function" || t.apply(f) !== o) {
                    throw new TypeError(e + f);
                }
                var u = a(arguments, 1);
                var s;
                var binder = function() {
                    if (this instanceof s) {
                        var e = f.apply(this, i(u, arguments));
                        if (Object(e) === e) {
                            return e;
                        }
                        return this;
                    }
                    return f.apply(r, i(u, arguments));
                };
                var c = n(0, f.length - u.length);
                var y = [];
                for(var p = 0; p < c; p++){
                    y[p] = "$" + p;
                }
                s = Function("binder", "return function (" + joiny(y, ",") + "){ return binder.apply(this,arguments); }")(binder);
                if (f.prototype) {
                    var l = function Empty() {};
                    l.prototype = f.prototype;
                    s.prototype = new l;
                    l.prototype = null;
                }
                return s;
            };
        },
        212: function(r, e, t) {
            "use strict";
            var n = t(136);
            r.exports = Function.prototype.bind || n;
        },
        192: function(r, e, t) {
            "use strict";
            var n;
            var o = t(545);
            var i = t(181);
            var a = t(22);
            var f = t(803);
            var u = t(182);
            var s = t(202);
            var c = t(284);
            var y = Function;
            var getEvalledConstructor = function(r) {
                try {
                    return y('"use strict"; return (' + r + ").constructor;")();
                } catch (r) {}
            };
            var p = Object.getOwnPropertyDescriptor;
            if (p) {
                try {
                    p({}, "");
                } catch (r) {
                    p = null;
                }
            }
            var throwTypeError = function() {
                throw new s;
            };
            var l = p ? function() {
                try {
                    arguments.callee;
                    return throwTypeError;
                } catch (r) {
                    try {
                        return p(arguments, "callee").get;
                    } catch (r) {
                        return throwTypeError;
                    }
                }
            }() : throwTypeError;
            var g = t(115)();
            var v = t(14)();
            var b = Object.getPrototypeOf || (v ? function(r) {
                return r.__proto__;
            } : null);
            var d = {};
            var m = typeof Uint8Array === "undefined" || !b ? n : b(Uint8Array);
            var S = {
                __proto__: null,
                "%AggregateError%": typeof AggregateError === "undefined" ? n : AggregateError,
                "%Array%": Array,
                "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? n : ArrayBuffer,
                "%ArrayIteratorPrototype%": g && b ? b([][Symbol.iterator]()) : n,
                "%AsyncFromSyncIteratorPrototype%": n,
                "%AsyncFunction%": d,
                "%AsyncGenerator%": d,
                "%AsyncGeneratorFunction%": d,
                "%AsyncIteratorPrototype%": d,
                "%Atomics%": typeof Atomics === "undefined" ? n : Atomics,
                "%BigInt%": typeof BigInt === "undefined" ? n : BigInt,
                "%BigInt64Array%": typeof BigInt64Array === "undefined" ? n : BigInt64Array,
                "%BigUint64Array%": typeof BigUint64Array === "undefined" ? n : BigUint64Array,
                "%Boolean%": Boolean,
                "%DataView%": typeof DataView === "undefined" ? n : DataView,
                "%Date%": Date,
                "%decodeURI%": decodeURI,
                "%decodeURIComponent%": decodeURIComponent,
                "%encodeURI%": encodeURI,
                "%encodeURIComponent%": encodeURIComponent,
                "%Error%": o,
                "%eval%": eval,
                "%EvalError%": i,
                "%Float32Array%": typeof Float32Array === "undefined" ? n : Float32Array,
                "%Float64Array%": typeof Float64Array === "undefined" ? n : Float64Array,
                "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? n : FinalizationRegistry,
                "%Function%": y,
                "%GeneratorFunction%": d,
                "%Int8Array%": typeof Int8Array === "undefined" ? n : Int8Array,
                "%Int16Array%": typeof Int16Array === "undefined" ? n : Int16Array,
                "%Int32Array%": typeof Int32Array === "undefined" ? n : Int32Array,
                "%isFinite%": isFinite,
                "%isNaN%": isNaN,
                "%IteratorPrototype%": g && b ? b(b([][Symbol.iterator]())) : n,
                "%JSON%": typeof JSON === "object" ? JSON : n,
                "%Map%": typeof Map === "undefined" ? n : Map,
                "%MapIteratorPrototype%": typeof Map === "undefined" || !g || !b ? n : b((new Map)[Symbol.iterator]()),
                "%Math%": Math,
                "%Number%": Number,
                "%Object%": Object,
                "%parseFloat%": parseFloat,
                "%parseInt%": parseInt,
                "%Promise%": typeof Promise === "undefined" ? n : Promise,
                "%Proxy%": typeof Proxy === "undefined" ? n : Proxy,
                "%RangeError%": a,
                "%ReferenceError%": f,
                "%Reflect%": typeof Reflect === "undefined" ? n : Reflect,
                "%RegExp%": RegExp,
                "%Set%": typeof Set === "undefined" ? n : Set,
                "%SetIteratorPrototype%": typeof Set === "undefined" || !g || !b ? n : b((new Set)[Symbol.iterator]()),
                "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? n : SharedArrayBuffer,
                "%String%": String,
                "%StringIteratorPrototype%": g && b ? b(""[Symbol.iterator]()) : n,
                "%Symbol%": g ? Symbol : n,
                "%SyntaxError%": u,
                "%ThrowTypeError%": l,
                "%TypedArray%": m,
                "%TypeError%": s,
                "%Uint8Array%": typeof Uint8Array === "undefined" ? n : Uint8Array,
                "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? n : Uint8ClampedArray,
                "%Uint16Array%": typeof Uint16Array === "undefined" ? n : Uint16Array,
                "%Uint32Array%": typeof Uint32Array === "undefined" ? n : Uint32Array,
                "%URIError%": c,
                "%WeakMap%": typeof WeakMap === "undefined" ? n : WeakMap,
                "%WeakRef%": typeof WeakRef === "undefined" ? n : WeakRef,
                "%WeakSet%": typeof WeakSet === "undefined" ? n : WeakSet
            };
            if (b) {
                try {
                    null.error;
                } catch (r) {
                    var A = b(b(r));
                    S["%Error.prototype%"] = A;
                }
            }
            var h = function doEval(r) {
                var e;
                if (r === "%AsyncFunction%") {
                    e = getEvalledConstructor("async function () {}");
                } else if (r === "%GeneratorFunction%") {
                    e = getEvalledConstructor("function* () {}");
                } else if (r === "%AsyncGeneratorFunction%") {
                    e = getEvalledConstructor("async function* () {}");
                } else if (r === "%AsyncGenerator%") {
                    var t = doEval("%AsyncGeneratorFunction%");
                    if (t) {
                        e = t.prototype;
                    }
                } else if (r === "%AsyncIteratorPrototype%") {
                    var n = doEval("%AsyncGenerator%");
                    if (n && b) {
                        e = b(n.prototype);
                    }
                }
                S[r] = e;
                return e;
            };
            var O = {
                __proto__: null,
                "%ArrayBufferPrototype%": [
                    "ArrayBuffer",
                    "prototype"
                ],
                "%ArrayPrototype%": [
                    "Array",
                    "prototype"
                ],
                "%ArrayProto_entries%": [
                    "Array",
                    "prototype",
                    "entries"
                ],
                "%ArrayProto_forEach%": [
                    "Array",
                    "prototype",
                    "forEach"
                ],
                "%ArrayProto_keys%": [
                    "Array",
                    "prototype",
                    "keys"
                ],
                "%ArrayProto_values%": [
                    "Array",
                    "prototype",
                    "values"
                ],
                "%AsyncFunctionPrototype%": [
                    "AsyncFunction",
                    "prototype"
                ],
                "%AsyncGenerator%": [
                    "AsyncGeneratorFunction",
                    "prototype"
                ],
                "%AsyncGeneratorPrototype%": [
                    "AsyncGeneratorFunction",
                    "prototype",
                    "prototype"
                ],
                "%BooleanPrototype%": [
                    "Boolean",
                    "prototype"
                ],
                "%DataViewPrototype%": [
                    "DataView",
                    "prototype"
                ],
                "%DatePrototype%": [
                    "Date",
                    "prototype"
                ],
                "%ErrorPrototype%": [
                    "Error",
                    "prototype"
                ],
                "%EvalErrorPrototype%": [
                    "EvalError",
                    "prototype"
                ],
                "%Float32ArrayPrototype%": [
                    "Float32Array",
                    "prototype"
                ],
                "%Float64ArrayPrototype%": [
                    "Float64Array",
                    "prototype"
                ],
                "%FunctionPrototype%": [
                    "Function",
                    "prototype"
                ],
                "%Generator%": [
                    "GeneratorFunction",
                    "prototype"
                ],
                "%GeneratorPrototype%": [
                    "GeneratorFunction",
                    "prototype",
                    "prototype"
                ],
                "%Int8ArrayPrototype%": [
                    "Int8Array",
                    "prototype"
                ],
                "%Int16ArrayPrototype%": [
                    "Int16Array",
                    "prototype"
                ],
                "%Int32ArrayPrototype%": [
                    "Int32Array",
                    "prototype"
                ],
                "%JSONParse%": [
                    "JSON",
                    "parse"
                ],
                "%JSONStringify%": [
                    "JSON",
                    "stringify"
                ],
                "%MapPrototype%": [
                    "Map",
                    "prototype"
                ],
                "%NumberPrototype%": [
                    "Number",
                    "prototype"
                ],
                "%ObjectPrototype%": [
                    "Object",
                    "prototype"
                ],
                "%ObjProto_toString%": [
                    "Object",
                    "prototype",
                    "toString"
                ],
                "%ObjProto_valueOf%": [
                    "Object",
                    "prototype",
                    "valueOf"
                ],
                "%PromisePrototype%": [
                    "Promise",
                    "prototype"
                ],
                "%PromiseProto_then%": [
                    "Promise",
                    "prototype",
                    "then"
                ],
                "%Promise_all%": [
                    "Promise",
                    "all"
                ],
                "%Promise_reject%": [
                    "Promise",
                    "reject"
                ],
                "%Promise_resolve%": [
                    "Promise",
                    "resolve"
                ],
                "%RangeErrorPrototype%": [
                    "RangeError",
                    "prototype"
                ],
                "%ReferenceErrorPrototype%": [
                    "ReferenceError",
                    "prototype"
                ],
                "%RegExpPrototype%": [
                    "RegExp",
                    "prototype"
                ],
                "%SetPrototype%": [
                    "Set",
                    "prototype"
                ],
                "%SharedArrayBufferPrototype%": [
                    "SharedArrayBuffer",
                    "prototype"
                ],
                "%StringPrototype%": [
                    "String",
                    "prototype"
                ],
                "%SymbolPrototype%": [
                    "Symbol",
                    "prototype"
                ],
                "%SyntaxErrorPrototype%": [
                    "SyntaxError",
                    "prototype"
                ],
                "%TypedArrayPrototype%": [
                    "TypedArray",
                    "prototype"
                ],
                "%TypeErrorPrototype%": [
                    "TypeError",
                    "prototype"
                ],
                "%Uint8ArrayPrototype%": [
                    "Uint8Array",
                    "prototype"
                ],
                "%Uint8ClampedArrayPrototype%": [
                    "Uint8ClampedArray",
                    "prototype"
                ],
                "%Uint16ArrayPrototype%": [
                    "Uint16Array",
                    "prototype"
                ],
                "%Uint32ArrayPrototype%": [
                    "Uint32Array",
                    "prototype"
                ],
                "%URIErrorPrototype%": [
                    "URIError",
                    "prototype"
                ],
                "%WeakMapPrototype%": [
                    "WeakMap",
                    "prototype"
                ],
                "%WeakSetPrototype%": [
                    "WeakSet",
                    "prototype"
                ]
            };
            var j = t(212);
            var w = t(270);
            var P = j.call(Function.call, Array.prototype.concat);
            var B = j.call(Function.apply, Array.prototype.splice);
            var E = j.call(Function.call, String.prototype.replace);
            var x = j.call(Function.call, String.prototype.slice);
            var T = j.call(Function.call, RegExp.prototype.exec);
            var I = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
            var k = /\\(\\)?/g;
            var F = function stringToPath(r) {
                var e = x(r, 0, 1);
                var t = x(r, -1);
                if (e === "%" && t !== "%") {
                    throw new u("invalid intrinsic syntax, expected closing `%`");
                } else if (t === "%" && e !== "%") {
                    throw new u("invalid intrinsic syntax, expected opening `%`");
                }
                var n = [];
                E(r, I, function(r, e, t, o) {
                    n[n.length] = t ? E(o, k, "$1") : e || r;
                });
                return n;
            };
            var U = function getBaseIntrinsic(r, e) {
                var t = r;
                var n;
                if (w(O, t)) {
                    n = O[t];
                    t = "%" + n[0] + "%";
                }
                if (w(S, t)) {
                    var o = S[t];
                    if (o === d) {
                        o = h(t);
                    }
                    if (typeof o === "undefined" && !e) {
                        throw new s("intrinsic " + r + " exists, but is not available. Please file an issue!");
                    }
                    return {
                        alias: n,
                        name: t,
                        value: o
                    };
                }
                throw new u("intrinsic " + r + " does not exist!");
            };
            r.exports = function GetIntrinsic(r, e) {
                if (typeof r !== "string" || r.length === 0) {
                    throw new s("intrinsic name must be a non-empty string");
                }
                if (arguments.length > 1 && typeof e !== "boolean") {
                    throw new s('"allowMissing" argument must be a boolean');
                }
                if (T(/^%?[^%]*%?$/, r) === null) {
                    throw new u("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
                }
                var t = F(r);
                var o = t.length > 0 ? t[0] : "";
                var i = U("%" + o + "%", e);
                var a = i.name;
                var f = i.value;
                var c = false;
                var y = i.alias;
                if (y) {
                    o = y[0];
                    B(t, P([
                        0,
                        1
                    ], y));
                }
                for(var l = 1, g = true; l < t.length; l += 1){
                    var v = t[l];
                    var b = x(v, 0, 1);
                    var d = x(v, -1);
                    if ((b === '"' || b === "'" || b === "`" || d === '"' || d === "'" || d === "`") && b !== d) {
                        throw new u("property names with quotes must have matching quotes");
                    }
                    if (v === "constructor" || !g) {
                        c = true;
                    }
                    o += "." + v;
                    a = "%" + o + "%";
                    if (w(S, a)) {
                        f = S[a];
                    } else if (f != null) {
                        if (!(v in f)) {
                            if (!e) {
                                throw new s("base intrinsic for " + r + " exists, but the property is not available.");
                            }
                            return void n;
                        }
                        if (p && l + 1 >= t.length) {
                            var m = p(f, v);
                            g = !!m;
                            if (g && "get" in m && !("originalValue" in m.get)) {
                                f = m.get;
                            } else {
                                f = f[v];
                            }
                        } else {
                            g = w(f, v);
                            f = f[v];
                        }
                        if (g && !c) {
                            S[a] = f;
                        }
                    }
                }
                return f;
            };
        },
        14: function(r) {
            "use strict";
            var e = {
                __proto__: null,
                foo: {}
            };
            var t = Object;
            r.exports = function hasProto() {
                return ({
                    __proto__: e
                }).foo === e.foo && !(e instanceof t);
            };
        },
        942: function(r, e, t) {
            "use strict";
            var n = typeof Symbol !== "undefined" && Symbol;
            var o = t(773);
            r.exports = function hasNativeSymbols() {
                if (typeof n !== "function") {
                    return false;
                }
                if (typeof Symbol !== "function") {
                    return false;
                }
                if (typeof n("foo") !== "symbol") {
                    return false;
                }
                if (typeof Symbol("bar") !== "symbol") {
                    return false;
                }
                return o();
            };
        },
        773: function(r) {
            "use strict";
            r.exports = function hasSymbols() {
                if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
                    return false;
                }
                if (typeof Symbol.iterator === "symbol") {
                    return true;
                }
                var r = {};
                var e = Symbol("test");
                var t = Object(e);
                if (typeof e === "string") {
                    return false;
                }
                if (Object.prototype.toString.call(e) !== "[object Symbol]") {
                    return false;
                }
                if (Object.prototype.toString.call(t) !== "[object Symbol]") {
                    return false;
                }
                var n = 42;
                r[e] = n;
                for(e in r){
                    return false;
                }
                if (typeof Object.keys === "function" && Object.keys(r).length !== 0) {
                    return false;
                }
                if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(r).length !== 0) {
                    return false;
                }
                var o = Object.getOwnPropertySymbols(r);
                if (o.length !== 1 || o[0] !== e) {
                    return false;
                }
                if (!Object.prototype.propertyIsEnumerable.call(r, e)) {
                    return false;
                }
                if (typeof Object.getOwnPropertyDescriptor === "function") {
                    var i = Object.getOwnPropertyDescriptor(r, e);
                    if (i.value !== n || i.enumerable !== true) {
                        return false;
                    }
                }
                return true;
            };
        },
        115: function(r, e, t) {
            "use strict";
            var n = typeof Symbol !== "undefined" && Symbol;
            var o = t(832);
            r.exports = function hasNativeSymbols() {
                if (typeof n !== "function") {
                    return false;
                }
                if (typeof Symbol !== "function") {
                    return false;
                }
                if (typeof n("foo") !== "symbol") {
                    return false;
                }
                if (typeof Symbol("bar") !== "symbol") {
                    return false;
                }
                return o();
            };
        },
        832: function(r) {
            "use strict";
            r.exports = function hasSymbols() {
                if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
                    return false;
                }
                if (typeof Symbol.iterator === "symbol") {
                    return true;
                }
                var r = {};
                var e = Symbol("test");
                var t = Object(e);
                if (typeof e === "string") {
                    return false;
                }
                if (Object.prototype.toString.call(e) !== "[object Symbol]") {
                    return false;
                }
                if (Object.prototype.toString.call(t) !== "[object Symbol]") {
                    return false;
                }
                var n = 42;
                r[e] = n;
                for(e in r){
                    return false;
                }
                if (typeof Object.keys === "function" && Object.keys(r).length !== 0) {
                    return false;
                }
                if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(r).length !== 0) {
                    return false;
                }
                var o = Object.getOwnPropertySymbols(r);
                if (o.length !== 1 || o[0] !== e) {
                    return false;
                }
                if (!Object.prototype.propertyIsEnumerable.call(r, e)) {
                    return false;
                }
                if (typeof Object.getOwnPropertyDescriptor === "function") {
                    var i = Object.getOwnPropertyDescriptor(r, e);
                    if (i.value !== n || i.enumerable !== true) {
                        return false;
                    }
                }
                return true;
            };
        },
        270: function(r, e, t) {
            "use strict";
            var n = Function.prototype.call;
            var o = Object.prototype.hasOwnProperty;
            var i = t(212);
            r.exports = i.call(n, o);
        },
        782: function(r) {
            if (typeof Object.create === "function") {
                r.exports = function inherits(r, e) {
                    if (e) {
                        r.super_ = e;
                        r.prototype = Object.create(e.prototype, {
                            constructor: {
                                value: r,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                    }
                };
            } else {
                r.exports = function inherits(r, e) {
                    if (e) {
                        r.super_ = e;
                        var TempCtor = function() {};
                        TempCtor.prototype = e.prototype;
                        r.prototype = new TempCtor;
                        r.prototype.constructor = r;
                    }
                };
            }
        },
        157: function(r) {
            "use strict";
            var e = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
            var t = Object.prototype.toString;
            var n = function isArguments(r) {
                if (e && r && typeof r === "object" && Symbol.toStringTag in r) {
                    return false;
                }
                return t.call(r) === "[object Arguments]";
            };
            var o = function isArguments(r) {
                if (n(r)) {
                    return true;
                }
                return r !== null && typeof r === "object" && typeof r.length === "number" && r.length >= 0 && t.call(r) !== "[object Array]" && t.call(r.callee) === "[object Function]";
            };
            var i = function() {
                return n(arguments);
            }();
            n.isLegacyArguments = o;
            r.exports = i ? n : o;
        },
        391: function(r) {
            "use strict";
            var e = Object.prototype.toString;
            var t = Function.prototype.toString;
            var n = /^\s*(?:function)?\*/;
            var o = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
            var i = Object.getPrototypeOf;
            var getGeneratorFunc = function() {
                if (!o) {
                    return false;
                }
                try {
                    return Function("return function*() {}")();
                } catch (r) {}
            };
            var a = getGeneratorFunc();
            var f = a ? i(a) : {};
            r.exports = function isGeneratorFunction(r) {
                if (typeof r !== "function") {
                    return false;
                }
                if (n.test(t.call(r))) {
                    return true;
                }
                if (!o) {
                    var a = e.call(r);
                    return a === "[object GeneratorFunction]";
                }
                return i(r) === f;
            };
        },
        994: function(r, e, t) {
            "use strict";
            var n = t(144);
            var o = t(349);
            var i = t(256);
            var a = i("Object.prototype.toString");
            var f = t(942)();
            var u = f && typeof Symbol.toStringTag === "symbol";
            var s = o();
            var c = i("Array.prototype.indexOf", true) || function indexOf(r, e) {
                for(var t = 0; t < r.length; t += 1){
                    if (r[t] === e) {
                        return t;
                    }
                }
                return -1;
            };
            var y = i("String.prototype.slice");
            var p = {};
            var l = t(24);
            var g = Object.getPrototypeOf;
            if (u && l && g) {
                n(s, function(r) {
                    var e = new /*TURBOPACK member replacement*/ __turbopack_context__.g[r];
                    if (!(Symbol.toStringTag in e)) {
                        throw new EvalError("this engine has support for Symbol.toStringTag, but " + r + " does not have the property! Please report this.");
                    }
                    var t = g(e);
                    var n = l(t, Symbol.toStringTag);
                    if (!n) {
                        var o = g(t);
                        n = l(o, Symbol.toStringTag);
                    }
                    p[r] = n.get;
                });
            }
            var v = function tryAllTypedArrays(r) {
                var e = false;
                n(p, function(t, n) {
                    if (!e) {
                        try {
                            e = t.call(r) === n;
                        } catch (r) {}
                    }
                });
                return e;
            };
            r.exports = function isTypedArray(r) {
                if (!r || typeof r !== "object") {
                    return false;
                }
                if (!u) {
                    var e = y(a(r), 8, -1);
                    return c(s, e) > -1;
                }
                if (!l) {
                    return false;
                }
                return v(r);
            };
        },
        369: function(r) {
            r.exports = function isBuffer(r) {
                return r instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"];
            };
        },
        584: function(r, e, t) {
            "use strict";
            var n = t(157);
            var o = t(391);
            var i = t(490);
            var a = t(994);
            function uncurryThis(r) {
                return r.call.bind(r);
            }
            var f = typeof BigInt !== "undefined";
            var u = typeof Symbol !== "undefined";
            var s = uncurryThis(Object.prototype.toString);
            var c = uncurryThis(Number.prototype.valueOf);
            var y = uncurryThis(String.prototype.valueOf);
            var p = uncurryThis(Boolean.prototype.valueOf);
            if (f) {
                var l = uncurryThis(BigInt.prototype.valueOf);
            }
            if (u) {
                var g = uncurryThis(Symbol.prototype.valueOf);
            }
            function checkBoxedPrimitive(r, e) {
                if (typeof r !== "object") {
                    return false;
                }
                try {
                    e(r);
                    return true;
                } catch (r) {
                    return false;
                }
            }
            e.isArgumentsObject = n;
            e.isGeneratorFunction = o;
            e.isTypedArray = a;
            function isPromise(r) {
                return typeof Promise !== "undefined" && r instanceof Promise || r !== null && typeof r === "object" && typeof r.then === "function" && typeof r.catch === "function";
            }
            e.isPromise = isPromise;
            function isArrayBufferView(r) {
                if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
                    return ArrayBuffer.isView(r);
                }
                return a(r) || isDataView(r);
            }
            e.isArrayBufferView = isArrayBufferView;
            function isUint8Array(r) {
                return i(r) === "Uint8Array";
            }
            e.isUint8Array = isUint8Array;
            function isUint8ClampedArray(r) {
                return i(r) === "Uint8ClampedArray";
            }
            e.isUint8ClampedArray = isUint8ClampedArray;
            function isUint16Array(r) {
                return i(r) === "Uint16Array";
            }
            e.isUint16Array = isUint16Array;
            function isUint32Array(r) {
                return i(r) === "Uint32Array";
            }
            e.isUint32Array = isUint32Array;
            function isInt8Array(r) {
                return i(r) === "Int8Array";
            }
            e.isInt8Array = isInt8Array;
            function isInt16Array(r) {
                return i(r) === "Int16Array";
            }
            e.isInt16Array = isInt16Array;
            function isInt32Array(r) {
                return i(r) === "Int32Array";
            }
            e.isInt32Array = isInt32Array;
            function isFloat32Array(r) {
                return i(r) === "Float32Array";
            }
            e.isFloat32Array = isFloat32Array;
            function isFloat64Array(r) {
                return i(r) === "Float64Array";
            }
            e.isFloat64Array = isFloat64Array;
            function isBigInt64Array(r) {
                return i(r) === "BigInt64Array";
            }
            e.isBigInt64Array = isBigInt64Array;
            function isBigUint64Array(r) {
                return i(r) === "BigUint64Array";
            }
            e.isBigUint64Array = isBigUint64Array;
            function isMapToString(r) {
                return s(r) === "[object Map]";
            }
            isMapToString.working = typeof Map !== "undefined" && isMapToString(new Map);
            function isMap(r) {
                if (typeof Map === "undefined") {
                    return false;
                }
                return isMapToString.working ? isMapToString(r) : r instanceof Map;
            }
            e.isMap = isMap;
            function isSetToString(r) {
                return s(r) === "[object Set]";
            }
            isSetToString.working = typeof Set !== "undefined" && isSetToString(new Set);
            function isSet(r) {
                if (typeof Set === "undefined") {
                    return false;
                }
                return isSetToString.working ? isSetToString(r) : r instanceof Set;
            }
            e.isSet = isSet;
            function isWeakMapToString(r) {
                return s(r) === "[object WeakMap]";
            }
            isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(new WeakMap);
            function isWeakMap(r) {
                if (typeof WeakMap === "undefined") {
                    return false;
                }
                return isWeakMapToString.working ? isWeakMapToString(r) : r instanceof WeakMap;
            }
            e.isWeakMap = isWeakMap;
            function isWeakSetToString(r) {
                return s(r) === "[object WeakSet]";
            }
            isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(new WeakSet);
            function isWeakSet(r) {
                return isWeakSetToString(r);
            }
            e.isWeakSet = isWeakSet;
            function isArrayBufferToString(r) {
                return s(r) === "[object ArrayBuffer]";
            }
            isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer);
            function isArrayBuffer(r) {
                if (typeof ArrayBuffer === "undefined") {
                    return false;
                }
                return isArrayBufferToString.working ? isArrayBufferToString(r) : r instanceof ArrayBuffer;
            }
            e.isArrayBuffer = isArrayBuffer;
            function isDataViewToString(r) {
                return s(r) === "[object DataView]";
            }
            isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
            function isDataView(r) {
                if (typeof DataView === "undefined") {
                    return false;
                }
                return isDataViewToString.working ? isDataViewToString(r) : r instanceof DataView;
            }
            e.isDataView = isDataView;
            var v = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : undefined;
            function isSharedArrayBufferToString(r) {
                return s(r) === "[object SharedArrayBuffer]";
            }
            function isSharedArrayBuffer(r) {
                if (typeof v === "undefined") {
                    return false;
                }
                if (typeof isSharedArrayBufferToString.working === "undefined") {
                    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new v);
                }
                return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(r) : r instanceof v;
            }
            e.isSharedArrayBuffer = isSharedArrayBuffer;
            function isAsyncFunction(r) {
                return s(r) === "[object AsyncFunction]";
            }
            e.isAsyncFunction = isAsyncFunction;
            function isMapIterator(r) {
                return s(r) === "[object Map Iterator]";
            }
            e.isMapIterator = isMapIterator;
            function isSetIterator(r) {
                return s(r) === "[object Set Iterator]";
            }
            e.isSetIterator = isSetIterator;
            function isGeneratorObject(r) {
                return s(r) === "[object Generator]";
            }
            e.isGeneratorObject = isGeneratorObject;
            function isWebAssemblyCompiledModule(r) {
                return s(r) === "[object WebAssembly.Module]";
            }
            e.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
            function isNumberObject(r) {
                return checkBoxedPrimitive(r, c);
            }
            e.isNumberObject = isNumberObject;
            function isStringObject(r) {
                return checkBoxedPrimitive(r, y);
            }
            e.isStringObject = isStringObject;
            function isBooleanObject(r) {
                return checkBoxedPrimitive(r, p);
            }
            e.isBooleanObject = isBooleanObject;
            function isBigIntObject(r) {
                return f && checkBoxedPrimitive(r, l);
            }
            e.isBigIntObject = isBigIntObject;
            function isSymbolObject(r) {
                return u && checkBoxedPrimitive(r, g);
            }
            e.isSymbolObject = isSymbolObject;
            function isBoxedPrimitive(r) {
                return isNumberObject(r) || isStringObject(r) || isBooleanObject(r) || isBigIntObject(r) || isSymbolObject(r);
            }
            e.isBoxedPrimitive = isBoxedPrimitive;
            function isAnyArrayBuffer(r) {
                return typeof Uint8Array !== "undefined" && (isArrayBuffer(r) || isSharedArrayBuffer(r));
            }
            e.isAnyArrayBuffer = isAnyArrayBuffer;
            [
                "isProxy",
                "isExternal",
                "isModuleNamespaceObject"
            ].forEach(function(r) {
                Object.defineProperty(e, r, {
                    enumerable: false,
                    value: function() {
                        throw new Error(r + " is not supported in userland");
                    }
                });
            });
        },
        177: function(r, e, t) {
            var n = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(r) {
                var e = Object.keys(r);
                var t = {};
                for(var n = 0; n < e.length; n++){
                    t[e[n]] = Object.getOwnPropertyDescriptor(r, e[n]);
                }
                return t;
            };
            var o = /%[sdj%]/g;
            e.format = function(r) {
                if (!isString(r)) {
                    var e = [];
                    for(var t = 0; t < arguments.length; t++){
                        e.push(inspect(arguments[t]));
                    }
                    return e.join(" ");
                }
                var t = 1;
                var n = arguments;
                var i = n.length;
                var a = String(r).replace(o, function(r) {
                    if (r === "%%") return "%";
                    if (t >= i) return r;
                    switch(r){
                        case "%s":
                            return String(n[t++]);
                        case "%d":
                            return Number(n[t++]);
                        case "%j":
                            try {
                                return JSON.stringify(n[t++]);
                            } catch (r) {
                                return "[Circular]";
                            }
                        default:
                            return r;
                    }
                });
                for(var f = n[t]; t < i; f = n[++t]){
                    if (isNull(f) || !isObject(f)) {
                        a += " " + f;
                    } else {
                        a += " " + inspect(f);
                    }
                }
                return a;
            };
            e.deprecate = function(r, t) {
                if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].noDeprecation === true) {
                    return r;
                }
                if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === "undefined") {
                    return function() {
                        return e.deprecate(r, t).apply(this, arguments);
                    };
                }
                var n = false;
                function deprecated() {
                    if (!n) {
                        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].throwDeprecation) {
                            throw new Error(t);
                        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].traceDeprecation) {
                            console.trace(t);
                        } else {
                            console.error(t);
                        }
                        n = true;
                    }
                    return r.apply(this, arguments);
                }
                return deprecated;
            };
            var i = {};
            var a = /^$/;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NODE_DEBUG) {
                var f = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NODE_DEBUG;
                f = f.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
                a = new RegExp("^" + f + "$", "i");
            }
            e.debuglog = function(r) {
                r = r.toUpperCase();
                if (!i[r]) {
                    if (a.test(r)) {
                        var t = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].pid;
                        i[r] = function() {
                            var n = e.format.apply(e, arguments);
                            console.error("%s %d: %s", r, t, n);
                        };
                    } else {
                        i[r] = function() {};
                    }
                }
                return i[r];
            };
            function inspect(r, t) {
                var n = {
                    seen: [],
                    stylize: stylizeNoColor
                };
                if (arguments.length >= 3) n.depth = arguments[2];
                if (arguments.length >= 4) n.colors = arguments[3];
                if (isBoolean(t)) {
                    n.showHidden = t;
                } else if (t) {
                    e._extend(n, t);
                }
                if (isUndefined(n.showHidden)) n.showHidden = false;
                if (isUndefined(n.depth)) n.depth = 2;
                if (isUndefined(n.colors)) n.colors = false;
                if (isUndefined(n.customInspect)) n.customInspect = true;
                if (n.colors) n.stylize = stylizeWithColor;
                return formatValue(n, r, n.depth);
            }
            e.inspect = inspect;
            inspect.colors = {
                bold: [
                    1,
                    22
                ],
                italic: [
                    3,
                    23
                ],
                underline: [
                    4,
                    24
                ],
                inverse: [
                    7,
                    27
                ],
                white: [
                    37,
                    39
                ],
                grey: [
                    90,
                    39
                ],
                black: [
                    30,
                    39
                ],
                blue: [
                    34,
                    39
                ],
                cyan: [
                    36,
                    39
                ],
                green: [
                    32,
                    39
                ],
                magenta: [
                    35,
                    39
                ],
                red: [
                    31,
                    39
                ],
                yellow: [
                    33,
                    39
                ]
            };
            inspect.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
            };
            function stylizeWithColor(r, e) {
                var t = inspect.styles[e];
                if (t) {
                    return "[" + inspect.colors[t][0] + "m" + r + "[" + inspect.colors[t][1] + "m";
                } else {
                    return r;
                }
            }
            function stylizeNoColor(r, e) {
                return r;
            }
            function arrayToHash(r) {
                var e = {};
                r.forEach(function(r, t) {
                    e[r] = true;
                });
                return e;
            }
            function formatValue(r, t, n) {
                if (r.customInspect && t && isFunction(t.inspect) && t.inspect !== e.inspect && !(t.constructor && t.constructor.prototype === t)) {
                    var o = t.inspect(n, r);
                    if (!isString(o)) {
                        o = formatValue(r, o, n);
                    }
                    return o;
                }
                var i = formatPrimitive(r, t);
                if (i) {
                    return i;
                }
                var a = Object.keys(t);
                var f = arrayToHash(a);
                if (r.showHidden) {
                    a = Object.getOwnPropertyNames(t);
                }
                if (isError(t) && (a.indexOf("message") >= 0 || a.indexOf("description") >= 0)) {
                    return formatError(t);
                }
                if (a.length === 0) {
                    if (isFunction(t)) {
                        var u = t.name ? ": " + t.name : "";
                        return r.stylize("[Function" + u + "]", "special");
                    }
                    if (isRegExp(t)) {
                        return r.stylize(RegExp.prototype.toString.call(t), "regexp");
                    }
                    if (isDate(t)) {
                        return r.stylize(Date.prototype.toString.call(t), "date");
                    }
                    if (isError(t)) {
                        return formatError(t);
                    }
                }
                var s = "", c = false, y = [
                    "{",
                    "}"
                ];
                if (isArray(t)) {
                    c = true;
                    y = [
                        "[",
                        "]"
                    ];
                }
                if (isFunction(t)) {
                    var p = t.name ? ": " + t.name : "";
                    s = " [Function" + p + "]";
                }
                if (isRegExp(t)) {
                    s = " " + RegExp.prototype.toString.call(t);
                }
                if (isDate(t)) {
                    s = " " + Date.prototype.toUTCString.call(t);
                }
                if (isError(t)) {
                    s = " " + formatError(t);
                }
                if (a.length === 0 && (!c || t.length == 0)) {
                    return y[0] + s + y[1];
                }
                if (n < 0) {
                    if (isRegExp(t)) {
                        return r.stylize(RegExp.prototype.toString.call(t), "regexp");
                    } else {
                        return r.stylize("[Object]", "special");
                    }
                }
                r.seen.push(t);
                var l;
                if (c) {
                    l = formatArray(r, t, n, f, a);
                } else {
                    l = a.map(function(e) {
                        return formatProperty(r, t, n, f, e, c);
                    });
                }
                r.seen.pop();
                return reduceToSingleString(l, s, y);
            }
            function formatPrimitive(r, e) {
                if (isUndefined(e)) return r.stylize("undefined", "undefined");
                if (isString(e)) {
                    var t = "'" + JSON.stringify(e).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                    return r.stylize(t, "string");
                }
                if (isNumber(e)) return r.stylize("" + e, "number");
                if (isBoolean(e)) return r.stylize("" + e, "boolean");
                if (isNull(e)) return r.stylize("null", "null");
            }
            function formatError(r) {
                return "[" + Error.prototype.toString.call(r) + "]";
            }
            function formatArray(r, e, t, n, o) {
                var i = [];
                for(var a = 0, f = e.length; a < f; ++a){
                    if (hasOwnProperty(e, String(a))) {
                        i.push(formatProperty(r, e, t, n, String(a), true));
                    } else {
                        i.push("");
                    }
                }
                o.forEach(function(o) {
                    if (!o.match(/^\d+$/)) {
                        i.push(formatProperty(r, e, t, n, o, true));
                    }
                });
                return i;
            }
            function formatProperty(r, e, t, n, o, i) {
                var a, f, u;
                u = Object.getOwnPropertyDescriptor(e, o) || {
                    value: e[o]
                };
                if (u.get) {
                    if (u.set) {
                        f = r.stylize("[Getter/Setter]", "special");
                    } else {
                        f = r.stylize("[Getter]", "special");
                    }
                } else {
                    if (u.set) {
                        f = r.stylize("[Setter]", "special");
                    }
                }
                if (!hasOwnProperty(n, o)) {
                    a = "[" + o + "]";
                }
                if (!f) {
                    if (r.seen.indexOf(u.value) < 0) {
                        if (isNull(t)) {
                            f = formatValue(r, u.value, null);
                        } else {
                            f = formatValue(r, u.value, t - 1);
                        }
                        if (f.indexOf("\n") > -1) {
                            if (i) {
                                f = f.split("\n").map(function(r) {
                                    return "  " + r;
                                }).join("\n").substr(2);
                            } else {
                                f = "\n" + f.split("\n").map(function(r) {
                                    return "   " + r;
                                }).join("\n");
                            }
                        }
                    } else {
                        f = r.stylize("[Circular]", "special");
                    }
                }
                if (isUndefined(a)) {
                    if (i && o.match(/^\d+$/)) {
                        return f;
                    }
                    a = JSON.stringify("" + o);
                    if (a.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                        a = a.substr(1, a.length - 2);
                        a = r.stylize(a, "name");
                    } else {
                        a = a.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
                        a = r.stylize(a, "string");
                    }
                }
                return a + ": " + f;
            }
            function reduceToSingleString(r, e, t) {
                var n = 0;
                var o = r.reduce(function(r, e) {
                    n++;
                    if (e.indexOf("\n") >= 0) n++;
                    return r + e.replace(/\u001b\[\d\d?m/g, "").length + 1;
                }, 0);
                if (o > 60) {
                    return t[0] + (e === "" ? "" : e + "\n ") + " " + r.join(",\n  ") + " " + t[1];
                }
                return t[0] + e + " " + r.join(", ") + " " + t[1];
            }
            e.types = t(584);
            function isArray(r) {
                return Array.isArray(r);
            }
            e.isArray = isArray;
            function isBoolean(r) {
                return typeof r === "boolean";
            }
            e.isBoolean = isBoolean;
            function isNull(r) {
                return r === null;
            }
            e.isNull = isNull;
            function isNullOrUndefined(r) {
                return r == null;
            }
            e.isNullOrUndefined = isNullOrUndefined;
            function isNumber(r) {
                return typeof r === "number";
            }
            e.isNumber = isNumber;
            function isString(r) {
                return typeof r === "string";
            }
            e.isString = isString;
            function isSymbol(r) {
                return typeof r === "symbol";
            }
            e.isSymbol = isSymbol;
            function isUndefined(r) {
                return r === void 0;
            }
            e.isUndefined = isUndefined;
            function isRegExp(r) {
                return isObject(r) && objectToString(r) === "[object RegExp]";
            }
            e.isRegExp = isRegExp;
            e.types.isRegExp = isRegExp;
            function isObject(r) {
                return typeof r === "object" && r !== null;
            }
            e.isObject = isObject;
            function isDate(r) {
                return isObject(r) && objectToString(r) === "[object Date]";
            }
            e.isDate = isDate;
            e.types.isDate = isDate;
            function isError(r) {
                return isObject(r) && (objectToString(r) === "[object Error]" || r instanceof Error);
            }
            e.isError = isError;
            e.types.isNativeError = isError;
            function isFunction(r) {
                return typeof r === "function";
            }
            e.isFunction = isFunction;
            function isPrimitive(r) {
                return r === null || typeof r === "boolean" || typeof r === "number" || typeof r === "string" || typeof r === "symbol" || typeof r === "undefined";
            }
            e.isPrimitive = isPrimitive;
            e.isBuffer = t(369);
            function objectToString(r) {
                return Object.prototype.toString.call(r);
            }
            function pad(r) {
                return r < 10 ? "0" + r.toString(10) : r.toString(10);
            }
            var u = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ];
            function timestamp() {
                var r = new Date;
                var e = [
                    pad(r.getHours()),
                    pad(r.getMinutes()),
                    pad(r.getSeconds())
                ].join(":");
                return [
                    r.getDate(),
                    u[r.getMonth()],
                    e
                ].join(" ");
            }
            e.log = function() {
                console.log("%s - %s", timestamp(), e.format.apply(e, arguments));
            };
            e.inherits = t(782);
            e._extend = function(r, e) {
                if (!e || !isObject(e)) return r;
                var t = Object.keys(e);
                var n = t.length;
                while(n--){
                    r[t[n]] = e[t[n]];
                }
                return r;
            };
            function hasOwnProperty(r, e) {
                return Object.prototype.hasOwnProperty.call(r, e);
            }
            var s = typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : undefined;
            e.promisify = function promisify(r) {
                if (typeof r !== "function") throw new TypeError('The "original" argument must be of type Function');
                if (s && r[s]) {
                    var e = r[s];
                    if (typeof e !== "function") {
                        throw new TypeError('The "util.promisify.custom" argument must be of type Function');
                    }
                    Object.defineProperty(e, s, {
                        value: e,
                        enumerable: false,
                        writable: false,
                        configurable: true
                    });
                    return e;
                }
                function e() {
                    var e, t;
                    var n = new Promise(function(r, n) {
                        e = r;
                        t = n;
                    });
                    var o = [];
                    for(var i = 0; i < arguments.length; i++){
                        o.push(arguments[i]);
                    }
                    o.push(function(r, n) {
                        if (r) {
                            t(r);
                        } else {
                            e(n);
                        }
                    });
                    try {
                        r.apply(this, o);
                    } catch (r) {
                        t(r);
                    }
                    return n;
                }
                Object.setPrototypeOf(e, Object.getPrototypeOf(r));
                if (s) Object.defineProperty(e, s, {
                    value: e,
                    enumerable: false,
                    writable: false,
                    configurable: true
                });
                return Object.defineProperties(e, n(r));
            };
            e.promisify.custom = s;
            function callbackifyOnRejected(r, e) {
                if (!r) {
                    var t = new Error("Promise was rejected with a falsy value");
                    t.reason = r;
                    r = t;
                }
                return e(r);
            }
            function callbackify(r) {
                if (typeof r !== "function") {
                    throw new TypeError('The "original" argument must be of type Function');
                }
                function callbackified() {
                    var e = [];
                    for(var t = 0; t < arguments.length; t++){
                        e.push(arguments[t]);
                    }
                    var n = e.pop();
                    if (typeof n !== "function") {
                        throw new TypeError("The last argument must be of type Function");
                    }
                    var o = this;
                    var cb = function() {
                        return n.apply(o, arguments);
                    };
                    r.apply(this, e).then(function(r) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(cb.bind(null, null, r));
                    }, function(r) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(callbackifyOnRejected.bind(null, r, cb));
                    });
                }
                Object.setPrototypeOf(callbackified, Object.getPrototypeOf(r));
                Object.defineProperties(callbackified, n(r));
                return callbackified;
            }
            e.callbackify = callbackify;
        },
        490: function(r, e, t) {
            "use strict";
            var n = t(144);
            var o = t(349);
            var i = t(256);
            var a = i("Object.prototype.toString");
            var f = t(942)();
            var u = f && typeof Symbol.toStringTag === "symbol";
            var s = o();
            var c = i("String.prototype.slice");
            var y = {};
            var p = t(24);
            var l = Object.getPrototypeOf;
            if (u && p && l) {
                n(s, function(r) {
                    if (typeof /*TURBOPACK member replacement*/ __turbopack_context__.g[r] === "function") {
                        var e = new /*TURBOPACK member replacement*/ __turbopack_context__.g[r];
                        if (!(Symbol.toStringTag in e)) {
                            throw new EvalError("this engine has support for Symbol.toStringTag, but " + r + " does not have the property! Please report this.");
                        }
                        var t = l(e);
                        var n = p(t, Symbol.toStringTag);
                        if (!n) {
                            var o = l(t);
                            n = p(o, Symbol.toStringTag);
                        }
                        y[r] = n.get;
                    }
                });
            }
            var g = function tryAllTypedArrays(r) {
                var e = false;
                n(y, function(t, n) {
                    if (!e) {
                        try {
                            var o = t.call(r);
                            if (o === n) {
                                e = o;
                            }
                        } catch (r) {}
                    }
                });
                return e;
            };
            var v = t(994);
            r.exports = function whichTypedArray(r) {
                if (!v(r)) {
                    return false;
                }
                if (!u) {
                    return c(a(r), 8, -1);
                }
                return g(r);
            };
        },
        349: function(r, e, t) {
            "use strict";
            var n = t(992);
            r.exports = function availableTypedArrays() {
                return n([
                    "BigInt64Array",
                    "BigUint64Array",
                    "Float32Array",
                    "Float64Array",
                    "Int16Array",
                    "Int32Array",
                    "Int8Array",
                    "Uint16Array",
                    "Uint32Array",
                    "Uint8Array",
                    "Uint8ClampedArray"
                ], function(r) {
                    return typeof /*TURBOPACK member replacement*/ __turbopack_context__.g[r] === "function";
                });
            };
        },
        24: function(r, e, t) {
            "use strict";
            var n = t(192);
            var o = n("%Object.getOwnPropertyDescriptor%", true);
            if (o) {
                try {
                    o([], "length");
                } catch (r) {
                    o = null;
                }
            }
            r.exports = o;
        }
    };
    var e = {};
    function __nccwpck_require__(t) {
        var n = e[t];
        if (n !== undefined) {
            return n.exports;
        }
        var o = e[t] = {
            exports: {}
        };
        var i = true;
        try {
            r[t](o, o.exports, __nccwpck_require__);
            i = false;
        } finally{
            if (i) delete e[t];
        }
        return o.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/util") + "/";
    var t = __nccwpck_require__(177);
    module.exports = t;
})();
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/stream-browserify/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
(function() {
    var e = {
        782: function(e) {
            if (typeof Object.create === "function") {
                e.exports = function inherits(e, t) {
                    if (t) {
                        e.super_ = t;
                        e.prototype = Object.create(t.prototype, {
                            constructor: {
                                value: e,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                    }
                };
            } else {
                e.exports = function inherits(e, t) {
                    if (t) {
                        e.super_ = t;
                        var TempCtor = function() {};
                        TempCtor.prototype = t.prototype;
                        e.prototype = new TempCtor;
                        e.prototype.constructor = e;
                    }
                };
            }
        },
        646: function(e) {
            "use strict";
            const t = {};
            function createErrorType(e, r, n) {
                if (!n) {
                    n = Error;
                }
                function getMessage(e, t, n) {
                    if (typeof r === "string") {
                        return r;
                    } else {
                        return r(e, t, n);
                    }
                }
                class NodeError extends n {
                    constructor(e, t, r){
                        super(getMessage(e, t, r));
                    }
                }
                NodeError.prototype.name = n.name;
                NodeError.prototype.code = e;
                t[e] = NodeError;
            }
            function oneOf(e, t) {
                if (Array.isArray(e)) {
                    const r = e.length;
                    e = e.map((e)=>String(e));
                    if (r > 2) {
                        return "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(", "), ", or ") + e[r - 1];
                    } else if (r === 2) {
                        return "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]);
                    } else {
                        return "of ".concat(t, " ").concat(e[0]);
                    }
                } else {
                    return "of ".concat(t, " ").concat(String(e));
                }
            }
            function startsWith(e, t, r) {
                return e.substr(!r || r < 0 ? 0 : +r, t.length) === t;
            }
            function endsWith(e, t, r) {
                if (r === undefined || r > e.length) {
                    r = e.length;
                }
                return e.substring(r - t.length, r) === t;
            }
            function includes(e, t, r) {
                if (typeof r !== "number") {
                    r = 0;
                }
                if (r + t.length > e.length) {
                    return false;
                } else {
                    return e.indexOf(t, r) !== -1;
                }
            }
            createErrorType("ERR_INVALID_OPT_VALUE", function(e, t) {
                return 'The value "' + t + '" is invalid for option "' + e + '"';
            }, TypeError);
            createErrorType("ERR_INVALID_ARG_TYPE", function(e, t, r) {
                let n;
                if (typeof t === "string" && startsWith(t, "not ")) {
                    n = "must not be";
                    t = t.replace(/^not /, "");
                } else {
                    n = "must be";
                }
                let i;
                if (endsWith(e, " argument")) {
                    i = "The ".concat(e, " ").concat(n, " ").concat(oneOf(t, "type"));
                } else {
                    const r = includes(e, ".") ? "property" : "argument";
                    i = 'The "'.concat(e, '" ').concat(r, " ").concat(n, " ").concat(oneOf(t, "type"));
                }
                i += ". Received type ".concat(typeof r);
                return i;
            }, TypeError);
            createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
            createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(e) {
                return "The " + e + " method is not implemented";
            });
            createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
            createErrorType("ERR_STREAM_DESTROYED", function(e) {
                return "Cannot call " + e + " after a stream was destroyed";
            });
            createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
            createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
            createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
            createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
            createErrorType("ERR_UNKNOWN_ENCODING", function(e) {
                return "Unknown encoding: " + e;
            }, TypeError);
            createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
            e.exports.q = t;
        },
        403: function(e, t, r) {
            "use strict";
            var n = Object.keys || function(e) {
                var t = [];
                for(var r in e){
                    t.push(r);
                }
                return t;
            };
            e.exports = Duplex;
            var i = r(709);
            var a = r(337);
            r(782)(Duplex, i);
            {
                var o = n(a.prototype);
                for(var s = 0; s < o.length; s++){
                    var f = o[s];
                    if (!Duplex.prototype[f]) Duplex.prototype[f] = a.prototype[f];
                }
            }
            function Duplex(e) {
                if (!(this instanceof Duplex)) return new Duplex(e);
                i.call(this, e);
                a.call(this, e);
                this.allowHalfOpen = true;
                if (e) {
                    if (e.readable === false) this.readable = false;
                    if (e.writable === false) this.writable = false;
                    if (e.allowHalfOpen === false) {
                        this.allowHalfOpen = false;
                        this.once("end", onend);
                    }
                }
            }
            Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
                enumerable: false,
                get: function get() {
                    return this._writableState.highWaterMark;
                }
            });
            Object.defineProperty(Duplex.prototype, "writableBuffer", {
                enumerable: false,
                get: function get() {
                    return this._writableState && this._writableState.getBuffer();
                }
            });
            Object.defineProperty(Duplex.prototype, "writableLength", {
                enumerable: false,
                get: function get() {
                    return this._writableState.length;
                }
            });
            function onend() {
                if (this._writableState.ended) return;
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(onEndNT, this);
            }
            function onEndNT(e) {
                e.end();
            }
            Object.defineProperty(Duplex.prototype, "destroyed", {
                enumerable: false,
                get: function get() {
                    if (this._readableState === undefined || this._writableState === undefined) {
                        return false;
                    }
                    return this._readableState.destroyed && this._writableState.destroyed;
                },
                set: function set(e) {
                    if (this._readableState === undefined || this._writableState === undefined) {
                        return;
                    }
                    this._readableState.destroyed = e;
                    this._writableState.destroyed = e;
                }
            });
        },
        889: function(e, t, r) {
            "use strict";
            e.exports = PassThrough;
            var n = r(170);
            r(782)(PassThrough, n);
            function PassThrough(e) {
                if (!(this instanceof PassThrough)) return new PassThrough(e);
                n.call(this, e);
            }
            PassThrough.prototype._transform = function(e, t, r) {
                r(null, e);
            };
        },
        709: function(e, t, r) {
            "use strict";
            e.exports = Readable;
            var n;
            Readable.ReadableState = ReadableState;
            var i = r(361).EventEmitter;
            var a = function EElistenerCount(e, t) {
                return e.listeners(t).length;
            };
            var o = r(678);
            var s = r(300).Buffer;
            var f = /*TURBOPACK member replacement*/ __turbopack_context__.g.Uint8Array || function() {};
            function _uint8ArrayToBuffer(e) {
                return s.from(e);
            }
            function _isUint8Array(e) {
                return s.isBuffer(e) || e instanceof f;
            }
            var l = r(837);
            var u;
            if (l && l.debuglog) {
                u = l.debuglog("stream");
            } else {
                u = function debug() {};
            }
            var d = r(379);
            var c = r(25);
            var h = r(776), p = h.getHighWaterMark;
            var b = r(646).q, g = b.ERR_INVALID_ARG_TYPE, y = b.ERR_STREAM_PUSH_AFTER_EOF, _ = b.ERR_METHOD_NOT_IMPLEMENTED, v = b.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
            var w;
            var m;
            var S;
            r(782)(Readable, o);
            var R = c.errorOrDestroy;
            var E = [
                "error",
                "close",
                "destroy",
                "pause",
                "resume"
            ];
            function prependListener(e, t, r) {
                if (typeof e.prependListener === "function") return e.prependListener(t, r);
                if (!e._events || !e._events[t]) e.on(t, r);
                else if (Array.isArray(e._events[t])) e._events[t].unshift(r);
                else e._events[t] = [
                    r,
                    e._events[t]
                ];
            }
            function ReadableState(e, t, i) {
                n = n || r(403);
                e = e || {};
                if (typeof i !== "boolean") i = t instanceof n;
                this.objectMode = !!e.objectMode;
                if (i) this.objectMode = this.objectMode || !!e.readableObjectMode;
                this.highWaterMark = p(this, e, "readableHighWaterMark", i);
                this.buffer = new d;
                this.length = 0;
                this.pipes = null;
                this.pipesCount = 0;
                this.flowing = null;
                this.ended = false;
                this.endEmitted = false;
                this.reading = false;
                this.sync = true;
                this.needReadable = false;
                this.emittedReadable = false;
                this.readableListening = false;
                this.resumeScheduled = false;
                this.paused = true;
                this.emitClose = e.emitClose !== false;
                this.autoDestroy = !!e.autoDestroy;
                this.destroyed = false;
                this.defaultEncoding = e.defaultEncoding || "utf8";
                this.awaitDrain = 0;
                this.readingMore = false;
                this.decoder = null;
                this.encoding = null;
                if (e.encoding) {
                    if (!w) w = r(704).s;
                    this.decoder = new w(e.encoding);
                    this.encoding = e.encoding;
                }
            }
            function Readable(e) {
                n = n || r(403);
                if (!(this instanceof Readable)) return new Readable(e);
                var t = this instanceof n;
                this._readableState = new ReadableState(e, this, t);
                this.readable = true;
                if (e) {
                    if (typeof e.read === "function") this._read = e.read;
                    if (typeof e.destroy === "function") this._destroy = e.destroy;
                }
                o.call(this);
            }
            Object.defineProperty(Readable.prototype, "destroyed", {
                enumerable: false,
                get: function get() {
                    if (this._readableState === undefined) {
                        return false;
                    }
                    return this._readableState.destroyed;
                },
                set: function set(e) {
                    if (!this._readableState) {
                        return;
                    }
                    this._readableState.destroyed = e;
                }
            });
            Readable.prototype.destroy = c.destroy;
            Readable.prototype._undestroy = c.undestroy;
            Readable.prototype._destroy = function(e, t) {
                t(e);
            };
            Readable.prototype.push = function(e, t) {
                var r = this._readableState;
                var n;
                if (!r.objectMode) {
                    if (typeof e === "string") {
                        t = t || r.defaultEncoding;
                        if (t !== r.encoding) {
                            e = s.from(e, t);
                            t = "";
                        }
                        n = true;
                    }
                } else {
                    n = true;
                }
                return readableAddChunk(this, e, t, false, n);
            };
            Readable.prototype.unshift = function(e) {
                return readableAddChunk(this, e, null, true, false);
            };
            function readableAddChunk(e, t, r, n, i) {
                u("readableAddChunk", t);
                var a = e._readableState;
                if (t === null) {
                    a.reading = false;
                    onEofChunk(e, a);
                } else {
                    var o;
                    if (!i) o = chunkInvalid(a, t);
                    if (o) {
                        R(e, o);
                    } else if (a.objectMode || t && t.length > 0) {
                        if (typeof t !== "string" && !a.objectMode && Object.getPrototypeOf(t) !== s.prototype) {
                            t = _uint8ArrayToBuffer(t);
                        }
                        if (n) {
                            if (a.endEmitted) R(e, new v);
                            else addChunk(e, a, t, true);
                        } else if (a.ended) {
                            R(e, new y);
                        } else if (a.destroyed) {
                            return false;
                        } else {
                            a.reading = false;
                            if (a.decoder && !r) {
                                t = a.decoder.write(t);
                                if (a.objectMode || t.length !== 0) addChunk(e, a, t, false);
                                else maybeReadMore(e, a);
                            } else {
                                addChunk(e, a, t, false);
                            }
                        }
                    } else if (!n) {
                        a.reading = false;
                        maybeReadMore(e, a);
                    }
                }
                return !a.ended && (a.length < a.highWaterMark || a.length === 0);
            }
            function addChunk(e, t, r, n) {
                if (t.flowing && t.length === 0 && !t.sync) {
                    t.awaitDrain = 0;
                    e.emit("data", r);
                } else {
                    t.length += t.objectMode ? 1 : r.length;
                    if (n) t.buffer.unshift(r);
                    else t.buffer.push(r);
                    if (t.needReadable) emitReadable(e);
                }
                maybeReadMore(e, t);
            }
            function chunkInvalid(e, t) {
                var r;
                if (!_isUint8Array(t) && typeof t !== "string" && t !== undefined && !e.objectMode) {
                    r = new g("chunk", [
                        "string",
                        "Buffer",
                        "Uint8Array"
                    ], t);
                }
                return r;
            }
            Readable.prototype.isPaused = function() {
                return this._readableState.flowing === false;
            };
            Readable.prototype.setEncoding = function(e) {
                if (!w) w = r(704).s;
                var t = new w(e);
                this._readableState.decoder = t;
                this._readableState.encoding = this._readableState.decoder.encoding;
                var n = this._readableState.buffer.head;
                var i = "";
                while(n !== null){
                    i += t.write(n.data);
                    n = n.next;
                }
                this._readableState.buffer.clear();
                if (i !== "") this._readableState.buffer.push(i);
                this._readableState.length = i.length;
                return this;
            };
            var T = 1073741824;
            function computeNewHighWaterMark(e) {
                if (e >= T) {
                    e = T;
                } else {
                    e--;
                    e |= e >>> 1;
                    e |= e >>> 2;
                    e |= e >>> 4;
                    e |= e >>> 8;
                    e |= e >>> 16;
                    e++;
                }
                return e;
            }
            function howMuchToRead(e, t) {
                if (e <= 0 || t.length === 0 && t.ended) return 0;
                if (t.objectMode) return 1;
                if (e !== e) {
                    if (t.flowing && t.length) return t.buffer.head.data.length;
                    else return t.length;
                }
                if (e > t.highWaterMark) t.highWaterMark = computeNewHighWaterMark(e);
                if (e <= t.length) return e;
                if (!t.ended) {
                    t.needReadable = true;
                    return 0;
                }
                return t.length;
            }
            Readable.prototype.read = function(e) {
                u("read", e);
                e = parseInt(e, 10);
                var t = this._readableState;
                var r = e;
                if (e !== 0) t.emittedReadable = false;
                if (e === 0 && t.needReadable && ((t.highWaterMark !== 0 ? t.length >= t.highWaterMark : t.length > 0) || t.ended)) {
                    u("read: emitReadable", t.length, t.ended);
                    if (t.length === 0 && t.ended) endReadable(this);
                    else emitReadable(this);
                    return null;
                }
                e = howMuchToRead(e, t);
                if (e === 0 && t.ended) {
                    if (t.length === 0) endReadable(this);
                    return null;
                }
                var n = t.needReadable;
                u("need readable", n);
                if (t.length === 0 || t.length - e < t.highWaterMark) {
                    n = true;
                    u("length less than watermark", n);
                }
                if (t.ended || t.reading) {
                    n = false;
                    u("reading or ended", n);
                } else if (n) {
                    u("do read");
                    t.reading = true;
                    t.sync = true;
                    if (t.length === 0) t.needReadable = true;
                    this._read(t.highWaterMark);
                    t.sync = false;
                    if (!t.reading) e = howMuchToRead(r, t);
                }
                var i;
                if (e > 0) i = fromList(e, t);
                else i = null;
                if (i === null) {
                    t.needReadable = t.length <= t.highWaterMark;
                    e = 0;
                } else {
                    t.length -= e;
                    t.awaitDrain = 0;
                }
                if (t.length === 0) {
                    if (!t.ended) t.needReadable = true;
                    if (r !== e && t.ended) endReadable(this);
                }
                if (i !== null) this.emit("data", i);
                return i;
            };
            function onEofChunk(e, t) {
                u("onEofChunk");
                if (t.ended) return;
                if (t.decoder) {
                    var r = t.decoder.end();
                    if (r && r.length) {
                        t.buffer.push(r);
                        t.length += t.objectMode ? 1 : r.length;
                    }
                }
                t.ended = true;
                if (t.sync) {
                    emitReadable(e);
                } else {
                    t.needReadable = false;
                    if (!t.emittedReadable) {
                        t.emittedReadable = true;
                        emitReadable_(e);
                    }
                }
            }
            function emitReadable(e) {
                var t = e._readableState;
                u("emitReadable", t.needReadable, t.emittedReadable);
                t.needReadable = false;
                if (!t.emittedReadable) {
                    u("emitReadable", t.flowing);
                    t.emittedReadable = true;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitReadable_, e);
                }
            }
            function emitReadable_(e) {
                var t = e._readableState;
                u("emitReadable_", t.destroyed, t.length, t.ended);
                if (!t.destroyed && (t.length || t.ended)) {
                    e.emit("readable");
                    t.emittedReadable = false;
                }
                t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark;
                flow(e);
            }
            function maybeReadMore(e, t) {
                if (!t.readingMore) {
                    t.readingMore = true;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(maybeReadMore_, e, t);
                }
            }
            function maybeReadMore_(e, t) {
                while(!t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && t.length === 0)){
                    var r = t.length;
                    u("maybeReadMore read 0");
                    e.read(0);
                    if (r === t.length) break;
                }
                t.readingMore = false;
            }
            Readable.prototype._read = function(e) {
                R(this, new _("_read()"));
            };
            Readable.prototype.pipe = function(e, t) {
                var r = this;
                var n = this._readableState;
                switch(n.pipesCount){
                    case 0:
                        n.pipes = e;
                        break;
                    case 1:
                        n.pipes = [
                            n.pipes,
                            e
                        ];
                        break;
                    default:
                        n.pipes.push(e);
                        break;
                }
                n.pipesCount += 1;
                u("pipe count=%d opts=%j", n.pipesCount, t);
                var i = (!t || t.end !== false) && e !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stdout && e !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stderr;
                var o = i ? onend : unpipe;
                if (n.endEmitted) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(o);
                else r.once("end", o);
                e.on("unpipe", onunpipe);
                function onunpipe(e, t) {
                    u("onunpipe");
                    if (e === r) {
                        if (t && t.hasUnpiped === false) {
                            t.hasUnpiped = true;
                            cleanup();
                        }
                    }
                }
                function onend() {
                    u("onend");
                    e.end();
                }
                var s = pipeOnDrain(r);
                e.on("drain", s);
                var f = false;
                function cleanup() {
                    u("cleanup");
                    e.removeListener("close", onclose);
                    e.removeListener("finish", onfinish);
                    e.removeListener("drain", s);
                    e.removeListener("error", onerror);
                    e.removeListener("unpipe", onunpipe);
                    r.removeListener("end", onend);
                    r.removeListener("end", unpipe);
                    r.removeListener("data", ondata);
                    f = true;
                    if (n.awaitDrain && (!e._writableState || e._writableState.needDrain)) s();
                }
                r.on("data", ondata);
                function ondata(t) {
                    u("ondata");
                    var i = e.write(t);
                    u("dest.write", i);
                    if (i === false) {
                        if ((n.pipesCount === 1 && n.pipes === e || n.pipesCount > 1 && indexOf(n.pipes, e) !== -1) && !f) {
                            u("false write response, pause", n.awaitDrain);
                            n.awaitDrain++;
                        }
                        r.pause();
                    }
                }
                function onerror(t) {
                    u("onerror", t);
                    unpipe();
                    e.removeListener("error", onerror);
                    if (a(e, "error") === 0) R(e, t);
                }
                prependListener(e, "error", onerror);
                function onclose() {
                    e.removeListener("finish", onfinish);
                    unpipe();
                }
                e.once("close", onclose);
                function onfinish() {
                    u("onfinish");
                    e.removeListener("close", onclose);
                    unpipe();
                }
                e.once("finish", onfinish);
                function unpipe() {
                    u("unpipe");
                    r.unpipe(e);
                }
                e.emit("pipe", r);
                if (!n.flowing) {
                    u("pipe resume");
                    r.resume();
                }
                return e;
            };
            function pipeOnDrain(e) {
                return function pipeOnDrainFunctionResult() {
                    var t = e._readableState;
                    u("pipeOnDrain", t.awaitDrain);
                    if (t.awaitDrain) t.awaitDrain--;
                    if (t.awaitDrain === 0 && a(e, "data")) {
                        t.flowing = true;
                        flow(e);
                    }
                };
            }
            Readable.prototype.unpipe = function(e) {
                var t = this._readableState;
                var r = {
                    hasUnpiped: false
                };
                if (t.pipesCount === 0) return this;
                if (t.pipesCount === 1) {
                    if (e && e !== t.pipes) return this;
                    if (!e) e = t.pipes;
                    t.pipes = null;
                    t.pipesCount = 0;
                    t.flowing = false;
                    if (e) e.emit("unpipe", this, r);
                    return this;
                }
                if (!e) {
                    var n = t.pipes;
                    var i = t.pipesCount;
                    t.pipes = null;
                    t.pipesCount = 0;
                    t.flowing = false;
                    for(var a = 0; a < i; a++){
                        n[a].emit("unpipe", this, {
                            hasUnpiped: false
                        });
                    }
                    return this;
                }
                var o = indexOf(t.pipes, e);
                if (o === -1) return this;
                t.pipes.splice(o, 1);
                t.pipesCount -= 1;
                if (t.pipesCount === 1) t.pipes = t.pipes[0];
                e.emit("unpipe", this, r);
                return this;
            };
            Readable.prototype.on = function(e, t) {
                var r = o.prototype.on.call(this, e, t);
                var n = this._readableState;
                if (e === "data") {
                    n.readableListening = this.listenerCount("readable") > 0;
                    if (n.flowing !== false) this.resume();
                } else if (e === "readable") {
                    if (!n.endEmitted && !n.readableListening) {
                        n.readableListening = n.needReadable = true;
                        n.flowing = false;
                        n.emittedReadable = false;
                        u("on readable", n.length, n.reading);
                        if (n.length) {
                            emitReadable(this);
                        } else if (!n.reading) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(nReadingNextTick, this);
                        }
                    }
                }
                return r;
            };
            Readable.prototype.addListener = Readable.prototype.on;
            Readable.prototype.removeListener = function(e, t) {
                var r = o.prototype.removeListener.call(this, e, t);
                if (e === "readable") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(updateReadableListening, this);
                }
                return r;
            };
            Readable.prototype.removeAllListeners = function(e) {
                var t = o.prototype.removeAllListeners.apply(this, arguments);
                if (e === "readable" || e === undefined) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(updateReadableListening, this);
                }
                return t;
            };
            function updateReadableListening(e) {
                var t = e._readableState;
                t.readableListening = e.listenerCount("readable") > 0;
                if (t.resumeScheduled && !t.paused) {
                    t.flowing = true;
                } else if (e.listenerCount("data") > 0) {
                    e.resume();
                }
            }
            function nReadingNextTick(e) {
                u("readable nexttick read 0");
                e.read(0);
            }
            Readable.prototype.resume = function() {
                var e = this._readableState;
                if (!e.flowing) {
                    u("resume");
                    e.flowing = !e.readableListening;
                    resume(this, e);
                }
                e.paused = false;
                return this;
            };
            function resume(e, t) {
                if (!t.resumeScheduled) {
                    t.resumeScheduled = true;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(resume_, e, t);
                }
            }
            function resume_(e, t) {
                u("resume", t.reading);
                if (!t.reading) {
                    e.read(0);
                }
                t.resumeScheduled = false;
                e.emit("resume");
                flow(e);
                if (t.flowing && !t.reading) e.read(0);
            }
            Readable.prototype.pause = function() {
                u("call pause flowing=%j", this._readableState.flowing);
                if (this._readableState.flowing !== false) {
                    u("pause");
                    this._readableState.flowing = false;
                    this.emit("pause");
                }
                this._readableState.paused = true;
                return this;
            };
            function flow(e) {
                var t = e._readableState;
                u("flow", t.flowing);
                while(t.flowing && e.read() !== null){}
            }
            Readable.prototype.wrap = function(e) {
                var t = this;
                var r = this._readableState;
                var n = false;
                e.on("end", function() {
                    u("wrapped end");
                    if (r.decoder && !r.ended) {
                        var e = r.decoder.end();
                        if (e && e.length) t.push(e);
                    }
                    t.push(null);
                });
                e.on("data", function(i) {
                    u("wrapped data");
                    if (r.decoder) i = r.decoder.write(i);
                    if (r.objectMode && (i === null || i === undefined)) return;
                    else if (!r.objectMode && (!i || !i.length)) return;
                    var a = t.push(i);
                    if (!a) {
                        n = true;
                        e.pause();
                    }
                });
                for(var i in e){
                    if (this[i] === undefined && typeof e[i] === "function") {
                        this[i] = function methodWrap(t) {
                            return function methodWrapReturnFunction() {
                                return e[t].apply(e, arguments);
                            };
                        }(i);
                    }
                }
                for(var a = 0; a < E.length; a++){
                    e.on(E[a], this.emit.bind(this, E[a]));
                }
                this._read = function(t) {
                    u("wrapped _read", t);
                    if (n) {
                        n = false;
                        e.resume();
                    }
                };
                return this;
            };
            if (typeof Symbol === "function") {
                Readable.prototype[Symbol.asyncIterator] = function() {
                    if (m === undefined) {
                        m = r(871);
                    }
                    return m(this);
                };
            }
            Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
                enumerable: false,
                get: function get() {
                    return this._readableState.highWaterMark;
                }
            });
            Object.defineProperty(Readable.prototype, "readableBuffer", {
                enumerable: false,
                get: function get() {
                    return this._readableState && this._readableState.buffer;
                }
            });
            Object.defineProperty(Readable.prototype, "readableFlowing", {
                enumerable: false,
                get: function get() {
                    return this._readableState.flowing;
                },
                set: function set(e) {
                    if (this._readableState) {
                        this._readableState.flowing = e;
                    }
                }
            });
            Readable._fromList = fromList;
            Object.defineProperty(Readable.prototype, "readableLength", {
                enumerable: false,
                get: function get() {
                    return this._readableState.length;
                }
            });
            function fromList(e, t) {
                if (t.length === 0) return null;
                var r;
                if (t.objectMode) r = t.buffer.shift();
                else if (!e || e >= t.length) {
                    if (t.decoder) r = t.buffer.join("");
                    else if (t.buffer.length === 1) r = t.buffer.first();
                    else r = t.buffer.concat(t.length);
                    t.buffer.clear();
                } else {
                    r = t.buffer.consume(e, t.decoder);
                }
                return r;
            }
            function endReadable(e) {
                var t = e._readableState;
                u("endReadable", t.endEmitted);
                if (!t.endEmitted) {
                    t.ended = true;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(endReadableNT, t, e);
                }
            }
            function endReadableNT(e, t) {
                u("endReadableNT", e.endEmitted, e.length);
                if (!e.endEmitted && e.length === 0) {
                    e.endEmitted = true;
                    t.readable = false;
                    t.emit("end");
                    if (e.autoDestroy) {
                        var r = t._writableState;
                        if (!r || r.autoDestroy && r.finished) {
                            t.destroy();
                        }
                    }
                }
            }
            if (typeof Symbol === "function") {
                Readable.from = function(e, t) {
                    if (S === undefined) {
                        S = r(727);
                    }
                    return S(Readable, e, t);
                };
            }
            function indexOf(e, t) {
                for(var r = 0, n = e.length; r < n; r++){
                    if (e[r] === t) return r;
                }
                return -1;
            }
        },
        170: function(e, t, r) {
            "use strict";
            e.exports = Transform;
            var n = r(646).q, i = n.ERR_METHOD_NOT_IMPLEMENTED, a = n.ERR_MULTIPLE_CALLBACK, o = n.ERR_TRANSFORM_ALREADY_TRANSFORMING, s = n.ERR_TRANSFORM_WITH_LENGTH_0;
            var f = r(403);
            r(782)(Transform, f);
            function afterTransform(e, t) {
                var r = this._transformState;
                r.transforming = false;
                var n = r.writecb;
                if (n === null) {
                    return this.emit("error", new a);
                }
                r.writechunk = null;
                r.writecb = null;
                if (t != null) this.push(t);
                n(e);
                var i = this._readableState;
                i.reading = false;
                if (i.needReadable || i.length < i.highWaterMark) {
                    this._read(i.highWaterMark);
                }
            }
            function Transform(e) {
                if (!(this instanceof Transform)) return new Transform(e);
                f.call(this, e);
                this._transformState = {
                    afterTransform: afterTransform.bind(this),
                    needTransform: false,
                    transforming: false,
                    writecb: null,
                    writechunk: null,
                    writeencoding: null
                };
                this._readableState.needReadable = true;
                this._readableState.sync = false;
                if (e) {
                    if (typeof e.transform === "function") this._transform = e.transform;
                    if (typeof e.flush === "function") this._flush = e.flush;
                }
                this.on("prefinish", prefinish);
            }
            function prefinish() {
                var e = this;
                if (typeof this._flush === "function" && !this._readableState.destroyed) {
                    this._flush(function(t, r) {
                        done(e, t, r);
                    });
                } else {
                    done(this, null, null);
                }
            }
            Transform.prototype.push = function(e, t) {
                this._transformState.needTransform = false;
                return f.prototype.push.call(this, e, t);
            };
            Transform.prototype._transform = function(e, t, r) {
                r(new i("_transform()"));
            };
            Transform.prototype._write = function(e, t, r) {
                var n = this._transformState;
                n.writecb = r;
                n.writechunk = e;
                n.writeencoding = t;
                if (!n.transforming) {
                    var i = this._readableState;
                    if (n.needTransform || i.needReadable || i.length < i.highWaterMark) this._read(i.highWaterMark);
                }
            };
            Transform.prototype._read = function(e) {
                var t = this._transformState;
                if (t.writechunk !== null && !t.transforming) {
                    t.transforming = true;
                    this._transform(t.writechunk, t.writeencoding, t.afterTransform);
                } else {
                    t.needTransform = true;
                }
            };
            Transform.prototype._destroy = function(e, t) {
                f.prototype._destroy.call(this, e, function(e) {
                    t(e);
                });
            };
            function done(e, t, r) {
                if (t) return e.emit("error", t);
                if (r != null) e.push(r);
                if (e._writableState.length) throw new s;
                if (e._transformState.transforming) throw new o;
                return e.push(null);
            }
        },
        337: function(e, t, r) {
            "use strict";
            e.exports = Writable;
            function WriteReq(e, t, r) {
                this.chunk = e;
                this.encoding = t;
                this.callback = r;
                this.next = null;
            }
            function CorkedRequest(e) {
                var t = this;
                this.next = null;
                this.entry = null;
                this.finish = function() {
                    onCorkedFinish(t, e);
                };
            }
            var n;
            Writable.WritableState = WritableState;
            var i = {
                deprecate: r(769)
            };
            var a = r(678);
            var o = r(300).Buffer;
            var s = /*TURBOPACK member replacement*/ __turbopack_context__.g.Uint8Array || function() {};
            function _uint8ArrayToBuffer(e) {
                return o.from(e);
            }
            function _isUint8Array(e) {
                return o.isBuffer(e) || e instanceof s;
            }
            var f = r(25);
            var l = r(776), u = l.getHighWaterMark;
            var d = r(646).q, c = d.ERR_INVALID_ARG_TYPE, h = d.ERR_METHOD_NOT_IMPLEMENTED, p = d.ERR_MULTIPLE_CALLBACK, b = d.ERR_STREAM_CANNOT_PIPE, g = d.ERR_STREAM_DESTROYED, y = d.ERR_STREAM_NULL_VALUES, _ = d.ERR_STREAM_WRITE_AFTER_END, v = d.ERR_UNKNOWN_ENCODING;
            var w = f.errorOrDestroy;
            r(782)(Writable, a);
            function nop() {}
            function WritableState(e, t, i) {
                n = n || r(403);
                e = e || {};
                if (typeof i !== "boolean") i = t instanceof n;
                this.objectMode = !!e.objectMode;
                if (i) this.objectMode = this.objectMode || !!e.writableObjectMode;
                this.highWaterMark = u(this, e, "writableHighWaterMark", i);
                this.finalCalled = false;
                this.needDrain = false;
                this.ending = false;
                this.ended = false;
                this.finished = false;
                this.destroyed = false;
                var a = e.decodeStrings === false;
                this.decodeStrings = !a;
                this.defaultEncoding = e.defaultEncoding || "utf8";
                this.length = 0;
                this.writing = false;
                this.corked = 0;
                this.sync = true;
                this.bufferProcessing = false;
                this.onwrite = function(e) {
                    onwrite(t, e);
                };
                this.writecb = null;
                this.writelen = 0;
                this.bufferedRequest = null;
                this.lastBufferedRequest = null;
                this.pendingcb = 0;
                this.prefinished = false;
                this.errorEmitted = false;
                this.emitClose = e.emitClose !== false;
                this.autoDestroy = !!e.autoDestroy;
                this.bufferedRequestCount = 0;
                this.corkedRequestsFree = new CorkedRequest(this);
            }
            WritableState.prototype.getBuffer = function getBuffer() {
                var e = this.bufferedRequest;
                var t = [];
                while(e){
                    t.push(e);
                    e = e.next;
                }
                return t;
            };
            (function() {
                try {
                    Object.defineProperty(WritableState.prototype, "buffer", {
                        get: i.deprecate(function writableStateBufferGetter() {
                            return this.getBuffer();
                        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer " + "instead.", "DEP0003")
                    });
                } catch (e) {}
            })();
            var m;
            if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
                m = Function.prototype[Symbol.hasInstance];
                Object.defineProperty(Writable, Symbol.hasInstance, {
                    value: function value(e) {
                        if (m.call(this, e)) return true;
                        if (this !== Writable) return false;
                        return e && e._writableState instanceof WritableState;
                    }
                });
            } else {
                m = function realHasInstance(e) {
                    return e instanceof this;
                };
            }
            function Writable(e) {
                n = n || r(403);
                var t = this instanceof n;
                if (!t && !m.call(Writable, this)) return new Writable(e);
                this._writableState = new WritableState(e, this, t);
                this.writable = true;
                if (e) {
                    if (typeof e.write === "function") this._write = e.write;
                    if (typeof e.writev === "function") this._writev = e.writev;
                    if (typeof e.destroy === "function") this._destroy = e.destroy;
                    if (typeof e.final === "function") this._final = e.final;
                }
                a.call(this);
            }
            Writable.prototype.pipe = function() {
                w(this, new b);
            };
            function writeAfterEnd(e, t) {
                var r = new _;
                w(e, r);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(t, r);
            }
            function validChunk(e, t, r, n) {
                var i;
                if (r === null) {
                    i = new y;
                } else if (typeof r !== "string" && !t.objectMode) {
                    i = new c("chunk", [
                        "string",
                        "Buffer"
                    ], r);
                }
                if (i) {
                    w(e, i);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(n, i);
                    return false;
                }
                return true;
            }
            Writable.prototype.write = function(e, t, r) {
                var n = this._writableState;
                var i = false;
                var a = !n.objectMode && _isUint8Array(e);
                if (a && !o.isBuffer(e)) {
                    e = _uint8ArrayToBuffer(e);
                }
                if (typeof t === "function") {
                    r = t;
                    t = null;
                }
                if (a) t = "buffer";
                else if (!t) t = n.defaultEncoding;
                if (typeof r !== "function") r = nop;
                if (n.ending) writeAfterEnd(this, r);
                else if (a || validChunk(this, n, e, r)) {
                    n.pendingcb++;
                    i = writeOrBuffer(this, n, a, e, t, r);
                }
                return i;
            };
            Writable.prototype.cork = function() {
                this._writableState.corked++;
            };
            Writable.prototype.uncork = function() {
                var e = this._writableState;
                if (e.corked) {
                    e.corked--;
                    if (!e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest) clearBuffer(this, e);
                }
            };
            Writable.prototype.setDefaultEncoding = function setDefaultEncoding(e) {
                if (typeof e === "string") e = e.toLowerCase();
                if (!([
                    "hex",
                    "utf8",
                    "utf-8",
                    "ascii",
                    "binary",
                    "base64",
                    "ucs2",
                    "ucs-2",
                    "utf16le",
                    "utf-16le",
                    "raw"
                ].indexOf((e + "").toLowerCase()) > -1)) throw new v(e);
                this._writableState.defaultEncoding = e;
                return this;
            };
            Object.defineProperty(Writable.prototype, "writableBuffer", {
                enumerable: false,
                get: function get() {
                    return this._writableState && this._writableState.getBuffer();
                }
            });
            function decodeChunk(e, t, r) {
                if (!e.objectMode && e.decodeStrings !== false && typeof t === "string") {
                    t = o.from(t, r);
                }
                return t;
            }
            Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
                enumerable: false,
                get: function get() {
                    return this._writableState.highWaterMark;
                }
            });
            function writeOrBuffer(e, t, r, n, i, a) {
                if (!r) {
                    var o = decodeChunk(t, n, i);
                    if (n !== o) {
                        r = true;
                        i = "buffer";
                        n = o;
                    }
                }
                var s = t.objectMode ? 1 : n.length;
                t.length += s;
                var f = t.length < t.highWaterMark;
                if (!f) t.needDrain = true;
                if (t.writing || t.corked) {
                    var l = t.lastBufferedRequest;
                    t.lastBufferedRequest = {
                        chunk: n,
                        encoding: i,
                        isBuf: r,
                        callback: a,
                        next: null
                    };
                    if (l) {
                        l.next = t.lastBufferedRequest;
                    } else {
                        t.bufferedRequest = t.lastBufferedRequest;
                    }
                    t.bufferedRequestCount += 1;
                } else {
                    doWrite(e, t, false, s, n, i, a);
                }
                return f;
            }
            function doWrite(e, t, r, n, i, a, o) {
                t.writelen = n;
                t.writecb = o;
                t.writing = true;
                t.sync = true;
                if (t.destroyed) t.onwrite(new g("write"));
                else if (r) e._writev(i, t.onwrite);
                else e._write(i, a, t.onwrite);
                t.sync = false;
            }
            function onwriteError(e, t, r, n, i) {
                --t.pendingcb;
                if (r) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(i, n);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(finishMaybe, e, t);
                    e._writableState.errorEmitted = true;
                    w(e, n);
                } else {
                    i(n);
                    e._writableState.errorEmitted = true;
                    w(e, n);
                    finishMaybe(e, t);
                }
            }
            function onwriteStateUpdate(e) {
                e.writing = false;
                e.writecb = null;
                e.length -= e.writelen;
                e.writelen = 0;
            }
            function onwrite(e, t) {
                var r = e._writableState;
                var n = r.sync;
                var i = r.writecb;
                if (typeof i !== "function") throw new p;
                onwriteStateUpdate(r);
                if (t) onwriteError(e, r, n, t, i);
                else {
                    var a = needFinish(r) || e.destroyed;
                    if (!a && !r.corked && !r.bufferProcessing && r.bufferedRequest) {
                        clearBuffer(e, r);
                    }
                    if (n) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(afterWrite, e, r, a, i);
                    } else {
                        afterWrite(e, r, a, i);
                    }
                }
            }
            function afterWrite(e, t, r, n) {
                if (!r) onwriteDrain(e, t);
                t.pendingcb--;
                n();
                finishMaybe(e, t);
            }
            function onwriteDrain(e, t) {
                if (t.length === 0 && t.needDrain) {
                    t.needDrain = false;
                    e.emit("drain");
                }
            }
            function clearBuffer(e, t) {
                t.bufferProcessing = true;
                var r = t.bufferedRequest;
                if (e._writev && r && r.next) {
                    var n = t.bufferedRequestCount;
                    var i = new Array(n);
                    var a = t.corkedRequestsFree;
                    a.entry = r;
                    var o = 0;
                    var s = true;
                    while(r){
                        i[o] = r;
                        if (!r.isBuf) s = false;
                        r = r.next;
                        o += 1;
                    }
                    i.allBuffers = s;
                    doWrite(e, t, true, t.length, i, "", a.finish);
                    t.pendingcb++;
                    t.lastBufferedRequest = null;
                    if (a.next) {
                        t.corkedRequestsFree = a.next;
                        a.next = null;
                    } else {
                        t.corkedRequestsFree = new CorkedRequest(t);
                    }
                    t.bufferedRequestCount = 0;
                } else {
                    while(r){
                        var f = r.chunk;
                        var l = r.encoding;
                        var u = r.callback;
                        var d = t.objectMode ? 1 : f.length;
                        doWrite(e, t, false, d, f, l, u);
                        r = r.next;
                        t.bufferedRequestCount--;
                        if (t.writing) {
                            break;
                        }
                    }
                    if (r === null) t.lastBufferedRequest = null;
                }
                t.bufferedRequest = r;
                t.bufferProcessing = false;
            }
            Writable.prototype._write = function(e, t, r) {
                r(new h("_write()"));
            };
            Writable.prototype._writev = null;
            Writable.prototype.end = function(e, t, r) {
                var n = this._writableState;
                if (typeof e === "function") {
                    r = e;
                    e = null;
                    t = null;
                } else if (typeof t === "function") {
                    r = t;
                    t = null;
                }
                if (e !== null && e !== undefined) this.write(e, t);
                if (n.corked) {
                    n.corked = 1;
                    this.uncork();
                }
                if (!n.ending) endWritable(this, n, r);
                return this;
            };
            Object.defineProperty(Writable.prototype, "writableLength", {
                enumerable: false,
                get: function get() {
                    return this._writableState.length;
                }
            });
            function needFinish(e) {
                return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
            }
            function callFinal(e, t) {
                e._final(function(r) {
                    t.pendingcb--;
                    if (r) {
                        w(e, r);
                    }
                    t.prefinished = true;
                    e.emit("prefinish");
                    finishMaybe(e, t);
                });
            }
            function prefinish(e, t) {
                if (!t.prefinished && !t.finalCalled) {
                    if (typeof e._final === "function" && !t.destroyed) {
                        t.pendingcb++;
                        t.finalCalled = true;
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(callFinal, e, t);
                    } else {
                        t.prefinished = true;
                        e.emit("prefinish");
                    }
                }
            }
            function finishMaybe(e, t) {
                var r = needFinish(t);
                if (r) {
                    prefinish(e, t);
                    if (t.pendingcb === 0) {
                        t.finished = true;
                        e.emit("finish");
                        if (t.autoDestroy) {
                            var n = e._readableState;
                            if (!n || n.autoDestroy && n.endEmitted) {
                                e.destroy();
                            }
                        }
                    }
                }
                return r;
            }
            function endWritable(e, t, r) {
                t.ending = true;
                finishMaybe(e, t);
                if (r) {
                    if (t.finished) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(r);
                    else e.once("finish", r);
                }
                t.ended = true;
                e.writable = false;
            }
            function onCorkedFinish(e, t, r) {
                var n = e.entry;
                e.entry = null;
                while(n){
                    var i = n.callback;
                    t.pendingcb--;
                    i(r);
                    n = n.next;
                }
                t.corkedRequestsFree.next = e;
            }
            Object.defineProperty(Writable.prototype, "destroyed", {
                enumerable: false,
                get: function get() {
                    if (this._writableState === undefined) {
                        return false;
                    }
                    return this._writableState.destroyed;
                },
                set: function set(e) {
                    if (!this._writableState) {
                        return;
                    }
                    this._writableState.destroyed = e;
                }
            });
            Writable.prototype.destroy = f.destroy;
            Writable.prototype._undestroy = f.undestroy;
            Writable.prototype._destroy = function(e, t) {
                t(e);
            };
        },
        871: function(e, t, r) {
            "use strict";
            var n;
            function _defineProperty(e, t, r) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = r;
                }
                return e;
            }
            var i = r(698);
            var a = Symbol("lastResolve");
            var o = Symbol("lastReject");
            var s = Symbol("error");
            var f = Symbol("ended");
            var l = Symbol("lastPromise");
            var u = Symbol("handlePromise");
            var d = Symbol("stream");
            function createIterResult(e, t) {
                return {
                    value: e,
                    done: t
                };
            }
            function readAndResolve(e) {
                var t = e[a];
                if (t !== null) {
                    var r = e[d].read();
                    if (r !== null) {
                        e[l] = null;
                        e[a] = null;
                        e[o] = null;
                        t(createIterResult(r, false));
                    }
                }
            }
            function onReadable(e) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(readAndResolve, e);
            }
            function wrapForNext(e, t) {
                return function(r, n) {
                    e.then(function() {
                        if (t[f]) {
                            r(createIterResult(undefined, true));
                            return;
                        }
                        t[u](r, n);
                    }, n);
                };
            }
            var c = Object.getPrototypeOf(function() {});
            var h = Object.setPrototypeOf((n = {
                get stream () {
                    return this[d];
                },
                next: function next() {
                    var e = this;
                    var t = this[s];
                    if (t !== null) {
                        return Promise.reject(t);
                    }
                    if (this[f]) {
                        return Promise.resolve(createIterResult(undefined, true));
                    }
                    if (this[d].destroyed) {
                        return new Promise(function(t, r) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(function() {
                                if (e[s]) {
                                    r(e[s]);
                                } else {
                                    t(createIterResult(undefined, true));
                                }
                            });
                        });
                    }
                    var r = this[l];
                    var n;
                    if (r) {
                        n = new Promise(wrapForNext(r, this));
                    } else {
                        var i = this[d].read();
                        if (i !== null) {
                            return Promise.resolve(createIterResult(i, false));
                        }
                        n = new Promise(this[u]);
                    }
                    this[l] = n;
                    return n;
                }
            }, _defineProperty(n, Symbol.asyncIterator, function() {
                return this;
            }), _defineProperty(n, "return", function _return() {
                var e = this;
                return new Promise(function(t, r) {
                    e[d].destroy(null, function(e) {
                        if (e) {
                            r(e);
                            return;
                        }
                        t(createIterResult(undefined, true));
                    });
                });
            }), n), c);
            var p = function createReadableStreamAsyncIterator(e) {
                var t;
                var r = Object.create(h, (t = {}, _defineProperty(t, d, {
                    value: e,
                    writable: true
                }), _defineProperty(t, a, {
                    value: null,
                    writable: true
                }), _defineProperty(t, o, {
                    value: null,
                    writable: true
                }), _defineProperty(t, s, {
                    value: null,
                    writable: true
                }), _defineProperty(t, f, {
                    value: e._readableState.endEmitted,
                    writable: true
                }), _defineProperty(t, u, {
                    value: function value(e, t) {
                        var n = r[d].read();
                        if (n) {
                            r[l] = null;
                            r[a] = null;
                            r[o] = null;
                            e(createIterResult(n, false));
                        } else {
                            r[a] = e;
                            r[o] = t;
                        }
                    },
                    writable: true
                }), t));
                r[l] = null;
                i(e, function(e) {
                    if (e && e.code !== "ERR_STREAM_PREMATURE_CLOSE") {
                        var t = r[o];
                        if (t !== null) {
                            r[l] = null;
                            r[a] = null;
                            r[o] = null;
                            t(e);
                        }
                        r[s] = e;
                        return;
                    }
                    var n = r[a];
                    if (n !== null) {
                        r[l] = null;
                        r[a] = null;
                        r[o] = null;
                        n(createIterResult(undefined, true));
                    }
                    r[f] = true;
                });
                e.on("readable", onReadable.bind(null, r));
                return r;
            };
            e.exports = p;
        },
        379: function(e, t, r) {
            "use strict";
            function ownKeys(e, t) {
                var r = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    if (t) n = n.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                    });
                    r.push.apply(r, n);
                }
                return r;
            }
            function _objectSpread(e) {
                for(var t = 1; t < arguments.length; t++){
                    var r = arguments[t] != null ? arguments[t] : {};
                    if (t % 2) {
                        ownKeys(Object(r), true).forEach(function(t) {
                            _defineProperty(e, t, r[t]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(e, Object.getOwnPropertyDescriptors(r));
                    } else {
                        ownKeys(Object(r)).forEach(function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                        });
                    }
                }
                return e;
            }
            function _defineProperty(e, t, r) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = r;
                }
                return e;
            }
            function _classCallCheck(e, t) {
                if (!(e instanceof t)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            function _defineProperties(e, t) {
                for(var r = 0; r < t.length; r++){
                    var n = t[r];
                    n.enumerable = n.enumerable || false;
                    n.configurable = true;
                    if ("value" in n) n.writable = true;
                    Object.defineProperty(e, n.key, n);
                }
            }
            function _createClass(e, t, r) {
                if (t) _defineProperties(e.prototype, t);
                if (r) _defineProperties(e, r);
                return e;
            }
            var n = r(300), i = n.Buffer;
            var a = r(837), o = a.inspect;
            var s = o && o.custom || "inspect";
            function copyBuffer(e, t, r) {
                i.prototype.copy.call(e, t, r);
            }
            e.exports = function() {
                function BufferList() {
                    _classCallCheck(this, BufferList);
                    this.head = null;
                    this.tail = null;
                    this.length = 0;
                }
                _createClass(BufferList, [
                    {
                        key: "push",
                        value: function push(e) {
                            var t = {
                                data: e,
                                next: null
                            };
                            if (this.length > 0) this.tail.next = t;
                            else this.head = t;
                            this.tail = t;
                            ++this.length;
                        }
                    },
                    {
                        key: "unshift",
                        value: function unshift(e) {
                            var t = {
                                data: e,
                                next: this.head
                            };
                            if (this.length === 0) this.tail = t;
                            this.head = t;
                            ++this.length;
                        }
                    },
                    {
                        key: "shift",
                        value: function shift() {
                            if (this.length === 0) return;
                            var e = this.head.data;
                            if (this.length === 1) this.head = this.tail = null;
                            else this.head = this.head.next;
                            --this.length;
                            return e;
                        }
                    },
                    {
                        key: "clear",
                        value: function clear() {
                            this.head = this.tail = null;
                            this.length = 0;
                        }
                    },
                    {
                        key: "join",
                        value: function join(e) {
                            if (this.length === 0) return "";
                            var t = this.head;
                            var r = "" + t.data;
                            while(t = t.next){
                                r += e + t.data;
                            }
                            return r;
                        }
                    },
                    {
                        key: "concat",
                        value: function concat(e) {
                            if (this.length === 0) return i.alloc(0);
                            var t = i.allocUnsafe(e >>> 0);
                            var r = this.head;
                            var n = 0;
                            while(r){
                                copyBuffer(r.data, t, n);
                                n += r.data.length;
                                r = r.next;
                            }
                            return t;
                        }
                    },
                    {
                        key: "consume",
                        value: function consume(e, t) {
                            var r;
                            if (e < this.head.data.length) {
                                r = this.head.data.slice(0, e);
                                this.head.data = this.head.data.slice(e);
                            } else if (e === this.head.data.length) {
                                r = this.shift();
                            } else {
                                r = t ? this._getString(e) : this._getBuffer(e);
                            }
                            return r;
                        }
                    },
                    {
                        key: "first",
                        value: function first() {
                            return this.head.data;
                        }
                    },
                    {
                        key: "_getString",
                        value: function _getString(e) {
                            var t = this.head;
                            var r = 1;
                            var n = t.data;
                            e -= n.length;
                            while(t = t.next){
                                var i = t.data;
                                var a = e > i.length ? i.length : e;
                                if (a === i.length) n += i;
                                else n += i.slice(0, e);
                                e -= a;
                                if (e === 0) {
                                    if (a === i.length) {
                                        ++r;
                                        if (t.next) this.head = t.next;
                                        else this.head = this.tail = null;
                                    } else {
                                        this.head = t;
                                        t.data = i.slice(a);
                                    }
                                    break;
                                }
                                ++r;
                            }
                            this.length -= r;
                            return n;
                        }
                    },
                    {
                        key: "_getBuffer",
                        value: function _getBuffer(e) {
                            var t = i.allocUnsafe(e);
                            var r = this.head;
                            var n = 1;
                            r.data.copy(t);
                            e -= r.data.length;
                            while(r = r.next){
                                var a = r.data;
                                var o = e > a.length ? a.length : e;
                                a.copy(t, t.length - e, 0, o);
                                e -= o;
                                if (e === 0) {
                                    if (o === a.length) {
                                        ++n;
                                        if (r.next) this.head = r.next;
                                        else this.head = this.tail = null;
                                    } else {
                                        this.head = r;
                                        r.data = a.slice(o);
                                    }
                                    break;
                                }
                                ++n;
                            }
                            this.length -= n;
                            return t;
                        }
                    },
                    {
                        key: s,
                        value: function value(e, t) {
                            return o(this, _objectSpread({}, t, {
                                depth: 0,
                                customInspect: false
                            }));
                        }
                    }
                ]);
                return BufferList;
            }();
        },
        25: function(e) {
            "use strict";
            function destroy(e, t) {
                var r = this;
                var n = this._readableState && this._readableState.destroyed;
                var i = this._writableState && this._writableState.destroyed;
                if (n || i) {
                    if (t) {
                        t(e);
                    } else if (e) {
                        if (!this._writableState) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitErrorNT, this, e);
                        } else if (!this._writableState.errorEmitted) {
                            this._writableState.errorEmitted = true;
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitErrorNT, this, e);
                        }
                    }
                    return this;
                }
                if (this._readableState) {
                    this._readableState.destroyed = true;
                }
                if (this._writableState) {
                    this._writableState.destroyed = true;
                }
                this._destroy(e || null, function(e) {
                    if (!t && e) {
                        if (!r._writableState) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitErrorAndCloseNT, r, e);
                        } else if (!r._writableState.errorEmitted) {
                            r._writableState.errorEmitted = true;
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitErrorAndCloseNT, r, e);
                        } else {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitCloseNT, r);
                        }
                    } else if (t) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitCloseNT, r);
                        t(e);
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(emitCloseNT, r);
                    }
                });
                return this;
            }
            function emitErrorAndCloseNT(e, t) {
                emitErrorNT(e, t);
                emitCloseNT(e);
            }
            function emitCloseNT(e) {
                if (e._writableState && !e._writableState.emitClose) return;
                if (e._readableState && !e._readableState.emitClose) return;
                e.emit("close");
            }
            function undestroy() {
                if (this._readableState) {
                    this._readableState.destroyed = false;
                    this._readableState.reading = false;
                    this._readableState.ended = false;
                    this._readableState.endEmitted = false;
                }
                if (this._writableState) {
                    this._writableState.destroyed = false;
                    this._writableState.ended = false;
                    this._writableState.ending = false;
                    this._writableState.finalCalled = false;
                    this._writableState.prefinished = false;
                    this._writableState.finished = false;
                    this._writableState.errorEmitted = false;
                }
            }
            function emitErrorNT(e, t) {
                e.emit("error", t);
            }
            function errorOrDestroy(e, t) {
                var r = e._readableState;
                var n = e._writableState;
                if (r && r.autoDestroy || n && n.autoDestroy) e.destroy(t);
                else e.emit("error", t);
            }
            e.exports = {
                destroy: destroy,
                undestroy: undestroy,
                errorOrDestroy: errorOrDestroy
            };
        },
        698: function(e, t, r) {
            "use strict";
            var n = r(646).q.ERR_STREAM_PREMATURE_CLOSE;
            function once(e) {
                var t = false;
                return function() {
                    if (t) return;
                    t = true;
                    for(var r = arguments.length, n = new Array(r), i = 0; i < r; i++){
                        n[i] = arguments[i];
                    }
                    e.apply(this, n);
                };
            }
            function noop() {}
            function isRequest(e) {
                return e.setHeader && typeof e.abort === "function";
            }
            function eos(e, t, r) {
                if (typeof t === "function") return eos(e, null, t);
                if (!t) t = {};
                r = once(r || noop);
                var i = t.readable || t.readable !== false && e.readable;
                var a = t.writable || t.writable !== false && e.writable;
                var o = function onlegacyfinish() {
                    if (!e.writable) f();
                };
                var s = e._writableState && e._writableState.finished;
                var f = function onfinish() {
                    a = false;
                    s = true;
                    if (!i) r.call(e);
                };
                var l = e._readableState && e._readableState.endEmitted;
                var u = function onend() {
                    i = false;
                    l = true;
                    if (!a) r.call(e);
                };
                var d = function onerror(t) {
                    r.call(e, t);
                };
                var c = function onclose() {
                    var t;
                    if (i && !l) {
                        if (!e._readableState || !e._readableState.ended) t = new n;
                        return r.call(e, t);
                    }
                    if (a && !s) {
                        if (!e._writableState || !e._writableState.ended) t = new n;
                        return r.call(e, t);
                    }
                };
                var h = function onrequest() {
                    e.req.on("finish", f);
                };
                if (isRequest(e)) {
                    e.on("complete", f);
                    e.on("abort", c);
                    if (e.req) h();
                    else e.on("request", h);
                } else if (a && !e._writableState) {
                    e.on("end", o);
                    e.on("close", o);
                }
                e.on("end", u);
                e.on("finish", f);
                if (t.error !== false) e.on("error", d);
                e.on("close", c);
                return function() {
                    e.removeListener("complete", f);
                    e.removeListener("abort", c);
                    e.removeListener("request", h);
                    if (e.req) e.req.removeListener("finish", f);
                    e.removeListener("end", o);
                    e.removeListener("close", o);
                    e.removeListener("finish", f);
                    e.removeListener("end", u);
                    e.removeListener("error", d);
                    e.removeListener("close", c);
                };
            }
            e.exports = eos;
        },
        727: function(e, t, r) {
            "use strict";
            function asyncGeneratorStep(e, t, r, n, i, a, o) {
                try {
                    var s = e[a](o);
                    var f = s.value;
                } catch (e) {
                    r(e);
                    return;
                }
                if (s.done) {
                    t(f);
                } else {
                    Promise.resolve(f).then(n, i);
                }
            }
            function _asyncToGenerator(e) {
                return function() {
                    var t = this, r = arguments;
                    return new Promise(function(n, i) {
                        var a = e.apply(t, r);
                        function _next(e) {
                            asyncGeneratorStep(a, n, i, _next, _throw, "next", e);
                        }
                        function _throw(e) {
                            asyncGeneratorStep(a, n, i, _next, _throw, "throw", e);
                        }
                        _next(undefined);
                    });
                };
            }
            function ownKeys(e, t) {
                var r = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    if (t) n = n.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                    });
                    r.push.apply(r, n);
                }
                return r;
            }
            function _objectSpread(e) {
                for(var t = 1; t < arguments.length; t++){
                    var r = arguments[t] != null ? arguments[t] : {};
                    if (t % 2) {
                        ownKeys(Object(r), true).forEach(function(t) {
                            _defineProperty(e, t, r[t]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(e, Object.getOwnPropertyDescriptors(r));
                    } else {
                        ownKeys(Object(r)).forEach(function(t) {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                        });
                    }
                }
                return e;
            }
            function _defineProperty(e, t, r) {
                if (t in e) {
                    Object.defineProperty(e, t, {
                        value: r,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    e[t] = r;
                }
                return e;
            }
            var n = r(646).q.ERR_INVALID_ARG_TYPE;
            function from(e, t, r) {
                var i;
                if (t && typeof t.next === "function") {
                    i = t;
                } else if (t && t[Symbol.asyncIterator]) i = t[Symbol.asyncIterator]();
                else if (t && t[Symbol.iterator]) i = t[Symbol.iterator]();
                else throw new n("iterable", [
                    "Iterable"
                ], t);
                var a = new e(_objectSpread({
                    objectMode: true
                }, r));
                var o = false;
                a._read = function() {
                    if (!o) {
                        o = true;
                        next();
                    }
                };
                function next() {
                    return _next2.apply(this, arguments);
                }
                function _next2() {
                    _next2 = _asyncToGenerator(function*() {
                        try {
                            var e = yield i.next(), t = e.value, r = e.done;
                            if (r) {
                                a.push(null);
                            } else if (a.push((yield t))) {
                                next();
                            } else {
                                o = false;
                            }
                        } catch (e) {
                            a.destroy(e);
                        }
                    });
                    return _next2.apply(this, arguments);
                }
                return a;
            }
            e.exports = from;
        },
        442: function(e, t, r) {
            "use strict";
            var n;
            function once(e) {
                var t = false;
                return function() {
                    if (t) return;
                    t = true;
                    e.apply(void 0, arguments);
                };
            }
            var i = r(646).q, a = i.ERR_MISSING_ARGS, o = i.ERR_STREAM_DESTROYED;
            function noop(e) {
                if (e) throw e;
            }
            function isRequest(e) {
                return e.setHeader && typeof e.abort === "function";
            }
            function destroyer(e, t, i, a) {
                a = once(a);
                var s = false;
                e.on("close", function() {
                    s = true;
                });
                if (n === undefined) n = r(698);
                n(e, {
                    readable: t,
                    writable: i
                }, function(e) {
                    if (e) return a(e);
                    s = true;
                    a();
                });
                var f = false;
                return function(t) {
                    if (s) return;
                    if (f) return;
                    f = true;
                    if (isRequest(e)) return e.abort();
                    if (typeof e.destroy === "function") return e.destroy();
                    a(t || new o("pipe"));
                };
            }
            function call(e) {
                e();
            }
            function pipe(e, t) {
                return e.pipe(t);
            }
            function popCallback(e) {
                if (!e.length) return noop;
                if (typeof e[e.length - 1] !== "function") return noop;
                return e.pop();
            }
            function pipeline() {
                for(var e = arguments.length, t = new Array(e), r = 0; r < e; r++){
                    t[r] = arguments[r];
                }
                var n = popCallback(t);
                if (Array.isArray(t[0])) t = t[0];
                if (t.length < 2) {
                    throw new a("streams");
                }
                var i;
                var o = t.map(function(e, r) {
                    var a = r < t.length - 1;
                    var s = r > 0;
                    return destroyer(e, a, s, function(e) {
                        if (!i) i = e;
                        if (e) o.forEach(call);
                        if (a) return;
                        o.forEach(call);
                        n(i);
                    });
                });
                return t.reduce(pipe);
            }
            e.exports = pipeline;
        },
        776: function(e, t, r) {
            "use strict";
            var n = r(646).q.ERR_INVALID_OPT_VALUE;
            function highWaterMarkFrom(e, t, r) {
                return e.highWaterMark != null ? e.highWaterMark : t ? e[r] : null;
            }
            function getHighWaterMark(e, t, r, i) {
                var a = highWaterMarkFrom(t, i, r);
                if (a != null) {
                    if (!(isFinite(a) && Math.floor(a) === a) || a < 0) {
                        var o = i ? r : "highWaterMark";
                        throw new n(o, a);
                    }
                    return Math.floor(a);
                }
                return e.objectMode ? 16 : 16 * 1024;
            }
            e.exports = {
                getHighWaterMark: getHighWaterMark
            };
        },
        678: function(e, t, r) {
            e.exports = r(781);
        },
        55: function(e, t, r) {
            var n = r(300);
            var i = n.Buffer;
            function copyProps(e, t) {
                for(var r in e){
                    t[r] = e[r];
                }
            }
            if (i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow) {
                e.exports = n;
            } else {
                copyProps(n, t);
                t.Buffer = SafeBuffer;
            }
            function SafeBuffer(e, t, r) {
                return i(e, t, r);
            }
            SafeBuffer.prototype = Object.create(i.prototype);
            copyProps(i, SafeBuffer);
            SafeBuffer.from = function(e, t, r) {
                if (typeof e === "number") {
                    throw new TypeError("Argument must not be a number");
                }
                return i(e, t, r);
            };
            SafeBuffer.alloc = function(e, t, r) {
                if (typeof e !== "number") {
                    throw new TypeError("Argument must be a number");
                }
                var n = i(e);
                if (t !== undefined) {
                    if (typeof r === "string") {
                        n.fill(t, r);
                    } else {
                        n.fill(t);
                    }
                } else {
                    n.fill(0);
                }
                return n;
            };
            SafeBuffer.allocUnsafe = function(e) {
                if (typeof e !== "number") {
                    throw new TypeError("Argument must be a number");
                }
                return i(e);
            };
            SafeBuffer.allocUnsafeSlow = function(e) {
                if (typeof e !== "number") {
                    throw new TypeError("Argument must be a number");
                }
                return n.SlowBuffer(e);
            };
        },
        173: function(e, t, r) {
            e.exports = Stream;
            var n = r(361).EventEmitter;
            var i = r(782);
            i(Stream, n);
            Stream.Readable = r(709);
            Stream.Writable = r(337);
            Stream.Duplex = r(403);
            Stream.Transform = r(170);
            Stream.PassThrough = r(889);
            Stream.finished = r(698);
            Stream.pipeline = r(442);
            Stream.Stream = Stream;
            function Stream() {
                n.call(this);
            }
            Stream.prototype.pipe = function(e, t) {
                var r = this;
                function ondata(t) {
                    if (e.writable) {
                        if (false === e.write(t) && r.pause) {
                            r.pause();
                        }
                    }
                }
                r.on("data", ondata);
                function ondrain() {
                    if (r.readable && r.resume) {
                        r.resume();
                    }
                }
                e.on("drain", ondrain);
                if (!e._isStdio && (!t || t.end !== false)) {
                    r.on("end", onend);
                    r.on("close", onclose);
                }
                var i = false;
                function onend() {
                    if (i) return;
                    i = true;
                    e.end();
                }
                function onclose() {
                    if (i) return;
                    i = true;
                    if (typeof e.destroy === "function") e.destroy();
                }
                function onerror(e) {
                    cleanup();
                    if (n.listenerCount(this, "error") === 0) {
                        throw e;
                    }
                }
                r.on("error", onerror);
                e.on("error", onerror);
                function cleanup() {
                    r.removeListener("data", ondata);
                    e.removeListener("drain", ondrain);
                    r.removeListener("end", onend);
                    r.removeListener("close", onclose);
                    r.removeListener("error", onerror);
                    e.removeListener("error", onerror);
                    r.removeListener("end", cleanup);
                    r.removeListener("close", cleanup);
                    e.removeListener("close", cleanup);
                }
                r.on("end", cleanup);
                r.on("close", cleanup);
                e.on("close", cleanup);
                e.emit("pipe", r);
                return e;
            };
        },
        704: function(e, t, r) {
            "use strict";
            var n = r(55).Buffer;
            var i = n.isEncoding || function(e) {
                e = "" + e;
                switch(e && e.toLowerCase()){
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                    case "raw":
                        return true;
                    default:
                        return false;
                }
            };
            function _normalizeEncoding(e) {
                if (!e) return "utf8";
                var t;
                while(true){
                    switch(e){
                        case "utf8":
                        case "utf-8":
                            return "utf8";
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return "utf16le";
                        case "latin1":
                        case "binary":
                            return "latin1";
                        case "base64":
                        case "ascii":
                        case "hex":
                            return e;
                        default:
                            if (t) return;
                            e = ("" + e).toLowerCase();
                            t = true;
                    }
                }
            }
            function normalizeEncoding(e) {
                var t = _normalizeEncoding(e);
                if (typeof t !== "string" && (n.isEncoding === i || !i(e))) throw new Error("Unknown encoding: " + e);
                return t || e;
            }
            t.s = StringDecoder;
            function StringDecoder(e) {
                this.encoding = normalizeEncoding(e);
                var t;
                switch(this.encoding){
                    case "utf16le":
                        this.text = utf16Text;
                        this.end = utf16End;
                        t = 4;
                        break;
                    case "utf8":
                        this.fillLast = utf8FillLast;
                        t = 4;
                        break;
                    case "base64":
                        this.text = base64Text;
                        this.end = base64End;
                        t = 3;
                        break;
                    default:
                        this.write = simpleWrite;
                        this.end = simpleEnd;
                        return;
                }
                this.lastNeed = 0;
                this.lastTotal = 0;
                this.lastChar = n.allocUnsafe(t);
            }
            StringDecoder.prototype.write = function(e) {
                if (e.length === 0) return "";
                var t;
                var r;
                if (this.lastNeed) {
                    t = this.fillLast(e);
                    if (t === undefined) return "";
                    r = this.lastNeed;
                    this.lastNeed = 0;
                } else {
                    r = 0;
                }
                if (r < e.length) return t ? t + this.text(e, r) : this.text(e, r);
                return t || "";
            };
            StringDecoder.prototype.end = utf8End;
            StringDecoder.prototype.text = utf8Text;
            StringDecoder.prototype.fillLast = function(e) {
                if (this.lastNeed <= e.length) {
                    e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
                }
                e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length);
                this.lastNeed -= e.length;
            };
            function utf8CheckByte(e) {
                if (e <= 127) return 0;
                else if (e >> 5 === 6) return 2;
                else if (e >> 4 === 14) return 3;
                else if (e >> 3 === 30) return 4;
                return e >> 6 === 2 ? -1 : -2;
            }
            function utf8CheckIncomplete(e, t, r) {
                var n = t.length - 1;
                if (n < r) return 0;
                var i = utf8CheckByte(t[n]);
                if (i >= 0) {
                    if (i > 0) e.lastNeed = i - 1;
                    return i;
                }
                if (--n < r || i === -2) return 0;
                i = utf8CheckByte(t[n]);
                if (i >= 0) {
                    if (i > 0) e.lastNeed = i - 2;
                    return i;
                }
                if (--n < r || i === -2) return 0;
                i = utf8CheckByte(t[n]);
                if (i >= 0) {
                    if (i > 0) {
                        if (i === 2) i = 0;
                        else e.lastNeed = i - 3;
                    }
                    return i;
                }
                return 0;
            }
            function utf8CheckExtraBytes(e, t, r) {
                if ((t[0] & 192) !== 128) {
                    e.lastNeed = 0;
                    return "�";
                }
                if (e.lastNeed > 1 && t.length > 1) {
                    if ((t[1] & 192) !== 128) {
                        e.lastNeed = 1;
                        return "�";
                    }
                    if (e.lastNeed > 2 && t.length > 2) {
                        if ((t[2] & 192) !== 128) {
                            e.lastNeed = 2;
                            return "�";
                        }
                    }
                }
            }
            function utf8FillLast(e) {
                var t = this.lastTotal - this.lastNeed;
                var r = utf8CheckExtraBytes(this, e, t);
                if (r !== undefined) return r;
                if (this.lastNeed <= e.length) {
                    e.copy(this.lastChar, t, 0, this.lastNeed);
                    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
                }
                e.copy(this.lastChar, t, 0, e.length);
                this.lastNeed -= e.length;
            }
            function utf8Text(e, t) {
                var r = utf8CheckIncomplete(this, e, t);
                if (!this.lastNeed) return e.toString("utf8", t);
                this.lastTotal = r;
                var n = e.length - (r - this.lastNeed);
                e.copy(this.lastChar, 0, n);
                return e.toString("utf8", t, n);
            }
            function utf8End(e) {
                var t = e && e.length ? this.write(e) : "";
                if (this.lastNeed) return t + "�";
                return t;
            }
            function utf16Text(e, t) {
                if ((e.length - t) % 2 === 0) {
                    var r = e.toString("utf16le", t);
                    if (r) {
                        var n = r.charCodeAt(r.length - 1);
                        if (n >= 55296 && n <= 56319) {
                            this.lastNeed = 2;
                            this.lastTotal = 4;
                            this.lastChar[0] = e[e.length - 2];
                            this.lastChar[1] = e[e.length - 1];
                            return r.slice(0, -1);
                        }
                    }
                    return r;
                }
                this.lastNeed = 1;
                this.lastTotal = 2;
                this.lastChar[0] = e[e.length - 1];
                return e.toString("utf16le", t, e.length - 1);
            }
            function utf16End(e) {
                var t = e && e.length ? this.write(e) : "";
                if (this.lastNeed) {
                    var r = this.lastTotal - this.lastNeed;
                    return t + this.lastChar.toString("utf16le", 0, r);
                }
                return t;
            }
            function base64Text(e, t) {
                var r = (e.length - t) % 3;
                if (r === 0) return e.toString("base64", t);
                this.lastNeed = 3 - r;
                this.lastTotal = 3;
                if (r === 1) {
                    this.lastChar[0] = e[e.length - 1];
                } else {
                    this.lastChar[0] = e[e.length - 2];
                    this.lastChar[1] = e[e.length - 1];
                }
                return e.toString("base64", t, e.length - r);
            }
            function base64End(e) {
                var t = e && e.length ? this.write(e) : "";
                if (this.lastNeed) return t + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
                return t;
            }
            function simpleWrite(e) {
                return e.toString(this.encoding);
            }
            function simpleEnd(e) {
                return e && e.length ? this.write(e) : "";
            }
        },
        769: function(e) {
            e.exports = deprecate;
            function deprecate(e, t) {
                if (config("noDeprecation")) {
                    return e;
                }
                var r = false;
                function deprecated() {
                    if (!r) {
                        if (config("throwDeprecation")) {
                            throw new Error(t);
                        } else if (config("traceDeprecation")) {
                            console.trace(t);
                        } else {
                            console.warn(t);
                        }
                        r = true;
                    }
                    return e.apply(this, arguments);
                }
                return deprecated;
            }
            function config(e) {
                try {
                    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.localStorage) return false;
                } catch (e) {
                    return false;
                }
                var t = /*TURBOPACK member replacement*/ __turbopack_context__.g.localStorage[e];
                if (null == t) return false;
                return String(t).toLowerCase() === "true";
            }
        },
        300: function(e) {
            "use strict";
            e.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/buffer@6.0.3/node_modules/buffer/index.js [app-client] (ecmascript)");
        },
        361: function(e) {
            "use strict";
            e.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/events@3.3.0/node_modules/events/events.js [app-client] (ecmascript)");
        },
        781: function(e) {
            "use strict";
            e.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/events@3.3.0/node_modules/events/events.js [app-client] (ecmascript)").EventEmitter;
        },
        837: function(e) {
            "use strict";
            e.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/util/util.js [app-client] (ecmascript)");
        }
    };
    var t = {};
    function __nccwpck_require__(r) {
        var n = t[r];
        if (n !== undefined) {
            return n.exports;
        }
        var i = t[r] = {
            exports: {}
        };
        var a = true;
        try {
            e[r](i, i.exports, __nccwpck_require__);
            a = false;
        } finally{
            if (a) delete t[r];
        }
        return i.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/stream-browserify") + "/";
    var r = __nccwpck_require__(173);
    module.exports = r;
})();
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/events/events.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function() {
    "use strict";
    var e = {
        864: function(e) {
            var t = typeof Reflect === "object" ? Reflect : null;
            var n = t && typeof t.apply === "function" ? t.apply : function ReflectApply(e, t, n) {
                return Function.prototype.apply.call(e, t, n);
            };
            var r;
            if (t && typeof t.ownKeys === "function") {
                r = t.ownKeys;
            } else if (Object.getOwnPropertySymbols) {
                r = function ReflectOwnKeys(e) {
                    return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
                };
            } else {
                r = function ReflectOwnKeys(e) {
                    return Object.getOwnPropertyNames(e);
                };
            }
            function ProcessEmitWarning(e) {
                if (console && console.warn) console.warn(e);
            }
            var i = Number.isNaN || function NumberIsNaN(e) {
                return e !== e;
            };
            function EventEmitter() {
                EventEmitter.init.call(this);
            }
            e.exports = EventEmitter;
            e.exports.once = once;
            EventEmitter.EventEmitter = EventEmitter;
            EventEmitter.prototype._events = undefined;
            EventEmitter.prototype._eventsCount = 0;
            EventEmitter.prototype._maxListeners = undefined;
            var s = 10;
            function checkListener(e) {
                if (typeof e !== "function") {
                    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e);
                }
            }
            Object.defineProperty(EventEmitter, "defaultMaxListeners", {
                enumerable: true,
                get: function() {
                    return s;
                },
                set: function(e) {
                    if (typeof e !== "number" || e < 0 || i(e)) {
                        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
                    }
                    s = e;
                }
            });
            EventEmitter.init = function() {
                if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
                    this._events = Object.create(null);
                    this._eventsCount = 0;
                }
                this._maxListeners = this._maxListeners || undefined;
            };
            EventEmitter.prototype.setMaxListeners = function setMaxListeners(e) {
                if (typeof e !== "number" || e < 0 || i(e)) {
                    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
                }
                this._maxListeners = e;
                return this;
            };
            function _getMaxListeners(e) {
                if (e._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
                return e._maxListeners;
            }
            EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
                return _getMaxListeners(this);
            };
            EventEmitter.prototype.emit = function emit(e) {
                var t = [];
                for(var r = 1; r < arguments.length; r++)t.push(arguments[r]);
                var i = e === "error";
                var s = this._events;
                if (s !== undefined) i = i && s.error === undefined;
                else if (!i) return false;
                if (i) {
                    var o;
                    if (t.length > 0) o = t[0];
                    if (o instanceof Error) {
                        throw o;
                    }
                    var f = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
                    f.context = o;
                    throw f;
                }
                var u = s[e];
                if (u === undefined) return false;
                if (typeof u === "function") {
                    n(u, this, t);
                } else {
                    var a = u.length;
                    var c = arrayClone(u, a);
                    for(var r = 0; r < a; ++r)n(c[r], this, t);
                }
                return true;
            };
            function _addListener(e, t, n, r) {
                var i;
                var s;
                var o;
                checkListener(n);
                s = e._events;
                if (s === undefined) {
                    s = e._events = Object.create(null);
                    e._eventsCount = 0;
                } else {
                    if (s.newListener !== undefined) {
                        e.emit("newListener", t, n.listener ? n.listener : n);
                        s = e._events;
                    }
                    o = s[t];
                }
                if (o === undefined) {
                    o = s[t] = n;
                    ++e._eventsCount;
                } else {
                    if (typeof o === "function") {
                        o = s[t] = r ? [
                            n,
                            o
                        ] : [
                            o,
                            n
                        ];
                    } else if (r) {
                        o.unshift(n);
                    } else {
                        o.push(n);
                    }
                    i = _getMaxListeners(e);
                    if (i > 0 && o.length > i && !o.warned) {
                        o.warned = true;
                        var f = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(t) + " listeners " + "added. Use emitter.setMaxListeners() to " + "increase limit");
                        f.name = "MaxListenersExceededWarning";
                        f.emitter = e;
                        f.type = t;
                        f.count = o.length;
                        ProcessEmitWarning(f);
                    }
                }
                return e;
            }
            EventEmitter.prototype.addListener = function addListener(e, t) {
                return _addListener(this, e, t, false);
            };
            EventEmitter.prototype.on = EventEmitter.prototype.addListener;
            EventEmitter.prototype.prependListener = function prependListener(e, t) {
                return _addListener(this, e, t, true);
            };
            function onceWrapper() {
                if (!this.fired) {
                    this.target.removeListener(this.type, this.wrapFn);
                    this.fired = true;
                    if (arguments.length === 0) return this.listener.call(this.target);
                    return this.listener.apply(this.target, arguments);
                }
            }
            function _onceWrap(e, t, n) {
                var r = {
                    fired: false,
                    wrapFn: undefined,
                    target: e,
                    type: t,
                    listener: n
                };
                var i = onceWrapper.bind(r);
                i.listener = n;
                r.wrapFn = i;
                return i;
            }
            EventEmitter.prototype.once = function once(e, t) {
                checkListener(t);
                this.on(e, _onceWrap(this, e, t));
                return this;
            };
            EventEmitter.prototype.prependOnceListener = function prependOnceListener(e, t) {
                checkListener(t);
                this.prependListener(e, _onceWrap(this, e, t));
                return this;
            };
            EventEmitter.prototype.removeListener = function removeListener(e, t) {
                var n, r, i, s, o;
                checkListener(t);
                r = this._events;
                if (r === undefined) return this;
                n = r[e];
                if (n === undefined) return this;
                if (n === t || n.listener === t) {
                    if (--this._eventsCount === 0) this._events = Object.create(null);
                    else {
                        delete r[e];
                        if (r.removeListener) this.emit("removeListener", e, n.listener || t);
                    }
                } else if (typeof n !== "function") {
                    i = -1;
                    for(s = n.length - 1; s >= 0; s--){
                        if (n[s] === t || n[s].listener === t) {
                            o = n[s].listener;
                            i = s;
                            break;
                        }
                    }
                    if (i < 0) return this;
                    if (i === 0) n.shift();
                    else {
                        spliceOne(n, i);
                    }
                    if (n.length === 1) r[e] = n[0];
                    if (r.removeListener !== undefined) this.emit("removeListener", e, o || t);
                }
                return this;
            };
            EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
            EventEmitter.prototype.removeAllListeners = function removeAllListeners(e) {
                var t, n, r;
                n = this._events;
                if (n === undefined) return this;
                if (n.removeListener === undefined) {
                    if (arguments.length === 0) {
                        this._events = Object.create(null);
                        this._eventsCount = 0;
                    } else if (n[e] !== undefined) {
                        if (--this._eventsCount === 0) this._events = Object.create(null);
                        else delete n[e];
                    }
                    return this;
                }
                if (arguments.length === 0) {
                    var i = Object.keys(n);
                    var s;
                    for(r = 0; r < i.length; ++r){
                        s = i[r];
                        if (s === "removeListener") continue;
                        this.removeAllListeners(s);
                    }
                    this.removeAllListeners("removeListener");
                    this._events = Object.create(null);
                    this._eventsCount = 0;
                    return this;
                }
                t = n[e];
                if (typeof t === "function") {
                    this.removeListener(e, t);
                } else if (t !== undefined) {
                    for(r = t.length - 1; r >= 0; r--){
                        this.removeListener(e, t[r]);
                    }
                }
                return this;
            };
            function _listeners(e, t, n) {
                var r = e._events;
                if (r === undefined) return [];
                var i = r[t];
                if (i === undefined) return [];
                if (typeof i === "function") return n ? [
                    i.listener || i
                ] : [
                    i
                ];
                return n ? unwrapListeners(i) : arrayClone(i, i.length);
            }
            EventEmitter.prototype.listeners = function listeners(e) {
                return _listeners(this, e, true);
            };
            EventEmitter.prototype.rawListeners = function rawListeners(e) {
                return _listeners(this, e, false);
            };
            EventEmitter.listenerCount = function(e, t) {
                if (typeof e.listenerCount === "function") {
                    return e.listenerCount(t);
                } else {
                    return listenerCount.call(e, t);
                }
            };
            EventEmitter.prototype.listenerCount = listenerCount;
            function listenerCount(e) {
                var t = this._events;
                if (t !== undefined) {
                    var n = t[e];
                    if (typeof n === "function") {
                        return 1;
                    } else if (n !== undefined) {
                        return n.length;
                    }
                }
                return 0;
            }
            EventEmitter.prototype.eventNames = function eventNames() {
                return this._eventsCount > 0 ? r(this._events) : [];
            };
            function arrayClone(e, t) {
                var n = new Array(t);
                for(var r = 0; r < t; ++r)n[r] = e[r];
                return n;
            }
            function spliceOne(e, t) {
                for(; t + 1 < e.length; t++)e[t] = e[t + 1];
                e.pop();
            }
            function unwrapListeners(e) {
                var t = new Array(e.length);
                for(var n = 0; n < t.length; ++n){
                    t[n] = e[n].listener || e[n];
                }
                return t;
            }
            function once(e, t) {
                return new Promise(function(n, r) {
                    function errorListener(n) {
                        e.removeListener(t, resolver);
                        r(n);
                    }
                    function resolver() {
                        if (typeof e.removeListener === "function") {
                            e.removeListener("error", errorListener);
                        }
                        n([].slice.call(arguments));
                    }
                    eventTargetAgnosticAddListener(e, t, resolver, {
                        once: true
                    });
                    if (t !== "error") {
                        addErrorHandlerIfEventEmitter(e, errorListener, {
                            once: true
                        });
                    }
                });
            }
            function addErrorHandlerIfEventEmitter(e, t, n) {
                if (typeof e.on === "function") {
                    eventTargetAgnosticAddListener(e, "error", t, n);
                }
            }
            function eventTargetAgnosticAddListener(e, t, n, r) {
                if (typeof e.on === "function") {
                    if (r.once) {
                        e.once(t, n);
                    } else {
                        e.on(t, n);
                    }
                } else if (typeof e.addEventListener === "function") {
                    e.addEventListener(t, function wrapListener(i) {
                        if (r.once) {
                            e.removeEventListener(t, wrapListener);
                        }
                        n(i);
                    });
                } else {
                    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
                }
            }
        }
    };
    var t = {};
    function __nccwpck_require__(n) {
        var r = t[n];
        if (r !== undefined) {
            return r.exports;
        }
        var i = t[n] = {
            exports: {}
        };
        var s = true;
        try {
            e[n](i, i.exports, __nccwpck_require__);
            s = false;
        } finally{
            if (s) delete t[n];
        }
        return i.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/events") + "/";
    var n = __nccwpck_require__(864);
    module.exports = n;
})();
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/router/utils/disable-smooth-scroll.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "disableSmoothScrollDuringRouteTransition", {
    enumerable: true,
    get: function() {
        return disableSmoothScrollDuringRouteTransition;
    }
});
const _warnonce = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
function disableSmoothScrollDuringRouteTransition(fn, options) {
    if (options === void 0) options = {};
    // if only the hash is changed, we don't need to disable smooth scrolling
    // we only care to prevent smooth scrolling when navigating to a new page to avoid jarring UX
    if (options.onlyHashChange) {
        fn();
        return;
    }
    const htmlElement = document.documentElement;
    const hasDataAttribute = htmlElement.dataset.scrollBehavior === 'smooth';
    // Since this is a breaking change, this is temporarily flagged
    // and will be false by default.
    // In the next major (v16), this will be automatically enabled
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        // Old behavior: always manipulate styles, but warn about upcoming change
        // Warn if smooth scrolling is detected but no data attribute is present
        if (("TURBOPACK compile-time value", "development") === 'development' && !hasDataAttribute && getComputedStyle(htmlElement).scrollBehavior === 'smooth') {
            (0, _warnonce.warnOnce)('Detected `scroll-behavior: smooth` on the `<html>` element. In a future version, ' + 'Next.js will no longer automatically disable smooth scrolling during route transitions. ' + 'To prepare for this change, add `data-scroll-behavior="smooth"` to your <html> element. ' + 'Learn more: https://nextjs.org/docs/messages/missing-data-scroll-behavior');
        }
    }
    // Proceed with temporarily disabling smooth scrolling
    const existing = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = 'auto';
    if (!options.dontForceLayout) {
        // In Chrome-based browsers we need to force reflow before calling `scrollTo`.
        // Otherwise it will not pickup the change in scrollBehavior
        // More info here: https://github.com/vercel/next.js/issues/40719#issuecomment-1336248042
        htmlElement.getClientRects();
    }
    fn();
    htmlElement.style.scrollBehavior = existing;
} //# sourceMappingURL=disable-smooth-scroll.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/bfcache.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRouterBFCache", {
    enumerable: true,
    get: function() {
        return useRouterBFCache;
    }
});
const _react = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// When the flag is disabled, only track the currently active tree
const MAX_BF_CACHE_ENTRIES = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 1;
function useRouterBFCache(activeTree, activeStateKey) {
    // The currently active entry. The entries form a linked list, sorted in
    // order of most recently active. This allows us to reuse parts of the list
    // without cloning, unless there's a reordering or removal.
    // TODO: Once we start tracking back/forward history at each route level,
    // we should use the history order instead. In other words, when traversing
    // to an existing entry as a result of a popstate event, we should maintain
    // the existing order instead of moving it to the front of the list. I think
    // an initial implementation of this could be to pass an incrementing id
    // to history.pushState/replaceState, then use that here for ordering.
    const [prevActiveEntry, setPrevActiveEntry] = (0, _react.useState)(()=>{
        const initialEntry = {
            tree: activeTree,
            stateKey: activeStateKey,
            next: null
        };
        return initialEntry;
    });
    if (prevActiveEntry.tree === activeTree) {
        // Fast path. The active tree hasn't changed, so we can reuse the
        // existing state.
        return prevActiveEntry;
    }
    // The route tree changed. Note that this doesn't mean that the tree changed
    // *at this level* — the change may be due to a child route. Either way, we
    // need to either add or update the router tree in the bfcache.
    //
    // The rest of the code looks more complicated than it actually is because we
    // can't mutate the state in place; we have to copy-on-write.
    // Create a new entry for the active cache key. This is the head of the new
    // linked list.
    const newActiveEntry = {
        tree: activeTree,
        stateKey: activeStateKey,
        next: null
    };
    // We need to append the old list onto the new list. If the head of the new
    // list was already present in the cache, then we'll need to clone everything
    // that came before it. Then we can reuse the rest.
    let n = 1;
    let oldEntry = prevActiveEntry;
    let clonedEntry = newActiveEntry;
    while(oldEntry !== null && n < MAX_BF_CACHE_ENTRIES){
        if (oldEntry.stateKey === activeStateKey) {
            // Fast path. This entry in the old list that corresponds to the key that
            // is now active. We've already placed a clone of this entry at the front
            // of the new list. We can reuse the rest of the old list without cloning.
            // NOTE: We don't need to worry about eviction in this case because we
            // haven't increased the size of the cache, and we assume the max size
            // is constant across renders. If we were to change it to a dynamic limit,
            // then the implementation would need to account for that.
            clonedEntry.next = oldEntry.next;
            break;
        } else {
            // Clone the entry and append it to the list.
            n++;
            const entry = {
                tree: oldEntry.tree,
                stateKey: oldEntry.stateKey,
                next: null
            };
            clonedEntry.next = entry;
            clonedEntry = entry;
        }
        oldEntry = oldEntry.next;
    }
    setPrevActiveEntry(newActiveEntry);
    return newActiveEntry;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=bfcache.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * OuterLayoutRouter handles the current segment as well as <Offscreen> rendering of other segments.
 * It can be rendered next to each other with a different `parallelRouterKey`, allowing for Parallel routes.
 */ "default", {
    enumerable: true,
    get: function() {
        return OuterLayoutRouter;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/.pnpm/@swc+helpers@0.5.15/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/.pnpm/@swc+helpers@0.5.15/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _routerreducertypes = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/router-reducer/router-reducer-types.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _reactdom = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)"));
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _fetchserverresponse = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/router-reducer/fetch-server-response.js [app-client] (ecmascript)");
const _unresolvedthenable = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/unresolved-thenable.js [app-client] (ecmascript)");
const _errorboundary = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/error-boundary.js [app-client] (ecmascript)");
const _matchsegments = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/match-segments.js [app-client] (ecmascript)");
const _disablesmoothscroll = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/router/utils/disable-smooth-scroll.js [app-client] (ecmascript)");
const _redirectboundary = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/redirect-boundary.js [app-client] (ecmascript)");
const _errorboundary1 = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js [app-client] (ecmascript)");
const _createroutercachekey = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/router-reducer/create-router-cache-key.js [app-client] (ecmascript)");
const _hasinterceptionrouteincurrenttree = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/router-reducer/reducers/has-interception-route-in-current-tree.js [app-client] (ecmascript)");
const _useactionqueue = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/use-action-queue.js [app-client] (ecmascript)");
const _bfcache = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/bfcache.js [app-client] (ecmascript)");
const _apppaths = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/router/utils/app-paths.js [app-client] (ecmascript)");
const Activity = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
/**
 * Add refetch marker to router state at the point of the current layout segment.
 * This ensures the response returned is not further down than the current layout segment.
 */ function walkAddRefetch(segmentPathToWalk, treeToRecreate) {
    if (segmentPathToWalk) {
        const [segment, parallelRouteKey] = segmentPathToWalk;
        const isLast = segmentPathToWalk.length === 2;
        if ((0, _matchsegments.matchSegment)(treeToRecreate[0], segment)) {
            if (treeToRecreate[1].hasOwnProperty(parallelRouteKey)) {
                if (isLast) {
                    const subTree = walkAddRefetch(undefined, treeToRecreate[1][parallelRouteKey]);
                    return [
                        treeToRecreate[0],
                        {
                            ...treeToRecreate[1],
                            [parallelRouteKey]: [
                                subTree[0],
                                subTree[1],
                                subTree[2],
                                'refetch'
                            ]
                        }
                    ];
                }
                return [
                    treeToRecreate[0],
                    {
                        ...treeToRecreate[1],
                        [parallelRouteKey]: walkAddRefetch(segmentPathToWalk.slice(2), treeToRecreate[1][parallelRouteKey])
                    }
                ];
            }
        }
    }
    return treeToRecreate;
}
const __DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = _reactdom.default.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
// TODO-APP: Replace with new React API for finding dom nodes without a `ref` when available
/**
 * Wraps ReactDOM.findDOMNode with additional logic to hide React Strict Mode warning
 */ function findDOMNode(instance) {
    // Tree-shake for server bundle
    if (typeof window === 'undefined') return null;
    // __DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.findDOMNode is null during module init.
    // We need to lazily reference it.
    const internal_reactDOMfindDOMNode = __DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.findDOMNode;
    return internal_reactDOMfindDOMNode(instance);
}
const rectProperties = [
    'bottom',
    'height',
    'left',
    'right',
    'top',
    'width',
    'x',
    'y'
];
/**
 * Check if a HTMLElement is hidden or fixed/sticky position
 */ function shouldSkipElement(element) {
    // we ignore fixed or sticky positioned elements since they'll likely pass the "in-viewport" check
    // and will result in a situation we bail on scroll because of something like a fixed nav,
    // even though the actual page content is offscreen
    if ([
        'sticky',
        'fixed'
    ].includes(getComputedStyle(element).position)) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('Skipping auto-scroll behavior due to `position: sticky` or `position: fixed` on element:', element);
        }
        return true;
    }
    // Uses `getBoundingClientRect` to check if the element is hidden instead of `offsetParent`
    // because `offsetParent` doesn't consider document/body
    const rect = element.getBoundingClientRect();
    return rectProperties.every((item)=>rect[item] === 0);
}
/**
 * Check if the top corner of the HTMLElement is in the viewport.
 */ function topOfElementInViewport(element, viewportHeight) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.top <= viewportHeight;
}
/**
 * Find the DOM node for a hash fragment.
 * If `top` the page has to scroll to the top of the page. This mirrors the browser's behavior.
 * If the hash fragment is an id, the page has to scroll to the element with that id.
 * If the hash fragment is a name, the page has to scroll to the first element with that name.
 */ function getHashFragmentDomNode(hashFragment) {
    // If the hash fragment is `top` the page has to scroll to the top of the page.
    if (hashFragment === 'top') {
        return document.body;
    }
    var _document_getElementById;
    // If the hash fragment is an id, the page has to scroll to the element with that id.
    return (_document_getElementById = document.getElementById(hashFragment)) != null ? _document_getElementById : document.getElementsByName(hashFragment)[0];
}
class InnerScrollAndFocusHandler extends _react.default.Component {
    componentDidMount() {
        this.handlePotentialScroll();
    }
    componentDidUpdate() {
        // Because this property is overwritten in handlePotentialScroll it's fine to always run it when true as it'll be set to false for subsequent renders.
        if (this.props.focusAndScrollRef.apply) {
            this.handlePotentialScroll();
        }
    }
    render() {
        return this.props.children;
    }
    constructor(...args){
        super(...args), this.handlePotentialScroll = ()=>{
            // Handle scroll and focus, it's only applied once in the first useEffect that triggers that changed.
            const { focusAndScrollRef, segmentPath } = this.props;
            if (focusAndScrollRef.apply) {
                // segmentPaths is an array of segment paths that should be scrolled to
                // if the current segment path is not in the array, the scroll is not applied
                // unless the array is empty, in which case the scroll is always applied
                if (focusAndScrollRef.segmentPaths.length !== 0 && !focusAndScrollRef.segmentPaths.some((scrollRefSegmentPath)=>segmentPath.every((segment, index)=>(0, _matchsegments.matchSegment)(segment, scrollRefSegmentPath[index])))) {
                    return;
                }
                let domNode = null;
                const hashFragment = focusAndScrollRef.hashFragment;
                if (hashFragment) {
                    domNode = getHashFragmentDomNode(hashFragment);
                }
                // `findDOMNode` is tricky because it returns just the first child if the component is a fragment.
                // This already caused a bug where the first child was a <link/> in head.
                if (!domNode) {
                    domNode = findDOMNode(this);
                }
                // If there is no DOM node this layout-router level is skipped. It'll be handled higher-up in the tree.
                if (!(domNode instanceof Element)) {
                    return;
                }
                // Verify if the element is a HTMLElement and if we want to consider it for scroll behavior.
                // If the element is skipped, try to select the next sibling and try again.
                while(!(domNode instanceof HTMLElement) || shouldSkipElement(domNode)){
                    if ("TURBOPACK compile-time truthy", 1) {
                        var _domNode_parentElement;
                        if (((_domNode_parentElement = domNode.parentElement) == null ? void 0 : _domNode_parentElement.localName) === 'head') {
                        // TODO: We enter this state when metadata was rendered as part of the page or via Next.js.
                        // This is always a bug in Next.js and caused by React hoisting metadata.
                        // We need to replace `findDOMNode` in favor of Fragment Refs (when available) so that we can skip over metadata.
                        }
                    }
                    // No siblings found that match the criteria are found, so handle scroll higher up in the tree instead.
                    if (domNode.nextElementSibling === null) {
                        return;
                    }
                    domNode = domNode.nextElementSibling;
                }
                // State is mutated to ensure that the focus and scroll is applied only once.
                focusAndScrollRef.apply = false;
                focusAndScrollRef.hashFragment = null;
                focusAndScrollRef.segmentPaths = [];
                (0, _disablesmoothscroll.disableSmoothScrollDuringRouteTransition)(()=>{
                    // In case of hash scroll, we only need to scroll the element into view
                    if (hashFragment) {
                        ;
                        domNode.scrollIntoView();
                        return;
                    }
                    // Store the current viewport height because reading `clientHeight` causes a reflow,
                    // and it won't change during this function.
                    const htmlElement = document.documentElement;
                    const viewportHeight = htmlElement.clientHeight;
                    // If the element's top edge is already in the viewport, exit early.
                    if (topOfElementInViewport(domNode, viewportHeight)) {
                        return;
                    }
                    // Otherwise, try scrolling go the top of the document to be backward compatible with pages
                    // scrollIntoView() called on `<html/>` element scrolls horizontally on chrome and firefox (that shouldn't happen)
                    // We could use it to scroll horizontally following RTL but that also seems to be broken - it will always scroll left
                    // scrollLeft = 0 also seems to ignore RTL and manually checking for RTL is too much hassle so we will scroll just vertically
                    htmlElement.scrollTop = 0;
                    // Scroll to domNode if domNode is not in viewport when scrolled to top of document
                    if (!topOfElementInViewport(domNode, viewportHeight)) {
                        // Scroll into view doesn't scroll horizontally by default when not needed
                        ;
                        domNode.scrollIntoView();
                    }
                }, {
                    // We will force layout by querying domNode position
                    dontForceLayout: true,
                    onlyHashChange: focusAndScrollRef.onlyHashChange
                });
                // Mutate after scrolling so that it can be read by `disableSmoothScrollDuringRouteTransition`
                focusAndScrollRef.onlyHashChange = false;
                // Set focus on the element
                domNode.focus();
            }
        };
    }
}
function ScrollAndFocusHandler(param) {
    let { segmentPath, children } = param;
    const context = (0, _react.useContext)(_approutercontextsharedruntime.GlobalLayoutRouterContext);
    if (!context) {
        throw Object.defineProperty(new Error('invariant global layout router not mounted'), "__NEXT_ERROR_CODE", {
            value: "E473",
            enumerable: false,
            configurable: true
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(InnerScrollAndFocusHandler, {
        segmentPath: segmentPath,
        focusAndScrollRef: context.focusAndScrollRef,
        children: children
    });
}
/**
 * InnerLayoutRouter handles rendering the provided segment based on the cache.
 */ function InnerLayoutRouter(param) {
    let { tree, segmentPath, cacheNode, url } = param;
    const context = (0, _react.useContext)(_approutercontextsharedruntime.GlobalLayoutRouterContext);
    if (!context) {
        throw Object.defineProperty(new Error('invariant global layout router not mounted'), "__NEXT_ERROR_CODE", {
            value: "E473",
            enumerable: false,
            configurable: true
        });
    }
    const { tree: fullTree } = context;
    // `rsc` represents the renderable node for this segment.
    // If this segment has a `prefetchRsc`, it's the statically prefetched data.
    // We should use that on initial render instead of `rsc`. Then we'll switch
    // to `rsc` when the dynamic response streams in.
    //
    // If no prefetch data is available, then we go straight to rendering `rsc`.
    const resolvedPrefetchRsc = cacheNode.prefetchRsc !== null ? cacheNode.prefetchRsc : cacheNode.rsc;
    // We use `useDeferredValue` to handle switching between the prefetched and
    // final values. The second argument is returned on initial render, then it
    // re-renders with the first argument.
    const rsc = (0, _react.useDeferredValue)(cacheNode.rsc, resolvedPrefetchRsc);
    // `rsc` is either a React node or a promise for a React node, except we
    // special case `null` to represent that this segment's data is missing. If
    // it's a promise, we need to unwrap it so we can determine whether or not the
    // data is missing.
    const resolvedRsc = typeof rsc === 'object' && rsc !== null && typeof rsc.then === 'function' ? (0, _react.use)(rsc) : rsc;
    if (!resolvedRsc) {
        // The data for this segment is not available, and there's no pending
        // navigation that will be able to fulfill it. We need to fetch more from
        // the server and patch the cache.
        // Check if there's already a pending request.
        let lazyData = cacheNode.lazyData;
        if (lazyData === null) {
            /**
       * Router state with refetch marker added
       */ // TODO-APP: remove ''
            const refetchTree = walkAddRefetch([
                '',
                ...segmentPath
            ], fullTree);
            const includeNextUrl = (0, _hasinterceptionrouteincurrenttree.hasInterceptionRouteInCurrentTree)(fullTree);
            const navigatedAt = Date.now();
            cacheNode.lazyData = lazyData = (0, _fetchserverresponse.fetchServerResponse)(new URL(url, location.origin), {
                flightRouterState: refetchTree,
                nextUrl: includeNextUrl ? context.nextUrl : null
            }).then((serverResponse)=>{
                (0, _react.startTransition)(()=>{
                    (0, _useactionqueue.dispatchAppRouterAction)({
                        type: _routerreducertypes.ACTION_SERVER_PATCH,
                        previousTree: fullTree,
                        serverResponse,
                        navigatedAt
                    });
                });
                return serverResponse;
            });
            // Suspend while waiting for lazyData to resolve
            (0, _react.use)(lazyData);
        }
        // Suspend infinitely as `changeByServerResponse` will cause a different part of the tree to be rendered.
        // A falsey `resolvedRsc` indicates missing data -- we should not commit that branch, and we need to wait for the data to arrive.
        (0, _react.use)(_unresolvedthenable.unresolvedThenable);
    }
    // If we get to this point, then we know we have something we can render.
    const subtree = /*#__PURE__*/ (0, _jsxruntime.jsx)(_approutercontextsharedruntime.LayoutRouterContext.Provider, {
        value: {
            parentTree: tree,
            parentCacheNode: cacheNode,
            parentSegmentPath: segmentPath,
            // TODO-APP: overriding of url for parallel routes
            url: url
        },
        children: resolvedRsc
    });
    // Ensure root layout is not wrapped in a div as the root layout renders `<html>`
    return subtree;
}
/**
 * Renders suspense boundary with the provided "loading" property as the fallback.
 * If no loading property is provided it renders the children without a suspense boundary.
 */ function LoadingBoundary(param) {
    let { loading, children } = param;
    // If loading is a promise, unwrap it. This happens in cases where we haven't
    // yet received the loading data from the server — which includes whether or
    // not this layout has a loading component at all.
    //
    // It's OK to suspend here instead of inside the fallback because this
    // promise will resolve simultaneously with the data for the segment itself.
    // So it will never suspend for longer than it would have if we didn't use
    // a Suspense fallback at all.
    let loadingModuleData;
    if (typeof loading === 'object' && loading !== null && typeof loading.then === 'function') {
        const promiseForLoading = loading;
        loadingModuleData = (0, _react.use)(promiseForLoading);
    } else {
        loadingModuleData = loading;
    }
    if (loadingModuleData) {
        const loadingRsc = loadingModuleData[0];
        const loadingStyles = loadingModuleData[1];
        const loadingScripts = loadingModuleData[2];
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(_react.Suspense, {
            fallback: /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
                children: [
                    loadingStyles,
                    loadingScripts,
                    loadingRsc
                ]
            }),
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: children
    });
}
function OuterLayoutRouter(param) {
    let { parallelRouterKey, error, errorStyles, errorScripts, templateStyles, templateScripts, template, notFound, forbidden, unauthorized, segmentViewBoundaries } = param;
    const context = (0, _react.useContext)(_approutercontextsharedruntime.LayoutRouterContext);
    if (!context) {
        throw Object.defineProperty(new Error('invariant expected layout router to be mounted'), "__NEXT_ERROR_CODE", {
            value: "E56",
            enumerable: false,
            configurable: true
        });
    }
    const { parentTree, parentCacheNode, parentSegmentPath, url } = context;
    // Get the CacheNode for this segment by reading it from the parent segment's
    // child map.
    const parentParallelRoutes = parentCacheNode.parallelRoutes;
    let segmentMap = parentParallelRoutes.get(parallelRouterKey);
    // If the parallel router cache node does not exist yet, create it.
    // This writes to the cache when there is no item in the cache yet. It never *overwrites* existing cache items which is why it's safe in concurrent mode.
    if (!segmentMap) {
        segmentMap = new Map();
        parentParallelRoutes.set(parallelRouterKey, segmentMap);
    }
    const parentTreeSegment = parentTree[0];
    const segmentPath = parentSegmentPath === null ? // the code. We should clean this up.
    [
        parallelRouterKey
    ] : parentSegmentPath.concat([
        parentTreeSegment,
        parallelRouterKey
    ]);
    // The "state" key of a segment is the one passed to React — it represents the
    // identity of the UI tree. Whenever the state key changes, the tree is
    // recreated and the state is reset. In the App Router model, search params do
    // not cause state to be lost, so two segments with the same segment path but
    // different search params should have the same state key.
    //
    // The "cache" key of a segment, however, *does* include the search params, if
    // it's possible that the segment accessed the search params on the server.
    // (This only applies to page segments; layout segments cannot access search
    // params on the server.)
    const activeTree = parentTree[1][parallelRouterKey];
    const activeSegment = activeTree[0];
    const activeStateKey = (0, _createroutercachekey.createRouterCacheKey)(activeSegment, true) // no search params
    ;
    // At each level of the route tree, not only do we render the currently
    // active segment — we also render the last N segments that were active at
    // this level inside a hidden <Activity> boundary, to preserve their state
    // if or when the user navigates to them again.
    //
    // bfcacheEntry is a linked list of FlightRouterStates.
    let bfcacheEntry = (0, _bfcache.useRouterBFCache)(activeTree, activeStateKey);
    let children = [];
    do {
        const tree = bfcacheEntry.tree;
        const stateKey = bfcacheEntry.stateKey;
        const segment = tree[0];
        const cacheKey = (0, _createroutercachekey.createRouterCacheKey)(segment);
        // Read segment path from the parallel router cache node.
        let cacheNode = segmentMap.get(cacheKey);
        if (cacheNode === undefined) {
            // When data is not available during rendering client-side we need to fetch
            // it from the server.
            const newLazyCacheNode = {
                lazyData: null,
                rsc: null,
                prefetchRsc: null,
                head: null,
                prefetchHead: null,
                parallelRoutes: new Map(),
                loading: null,
                navigatedAt: -1
            };
            // Flight data fetch kicked off during render and put into the cache.
            cacheNode = newLazyCacheNode;
            segmentMap.set(cacheKey, newLazyCacheNode);
        }
        /*
    - Error boundary
      - Only renders error boundary if error component is provided.
      - Rendered for each segment to ensure they have their own error state.
      - When gracefully degrade for bots, skip rendering error boundary.
    - Loading boundary
      - Only renders suspense boundary if loading components is provided.
      - Rendered for each segment to ensure they have their own loading state.
      - Passed to the router during rendering to ensure it can be immediately rendered when suspending on a Flight fetch.
  */ let segmentBoundaryTriggerNode = null;
        let segmentViewStateNode = null;
        if ("TURBOPACK compile-time truthy", 1) {
            const { SegmentBoundaryTriggerNode, SegmentViewStateNode } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)");
            const pagePrefix = (0, _apppaths.normalizeAppPath)(url);
            segmentViewStateNode = /*#__PURE__*/ (0, _jsxruntime.jsx)(SegmentViewStateNode, {
                page: pagePrefix
            }, pagePrefix);
            segmentBoundaryTriggerNode = /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
                children: /*#__PURE__*/ (0, _jsxruntime.jsx)(SegmentBoundaryTriggerNode, {})
            });
        }
        // TODO: The loading module data for a segment is stored on the parent, then
        // applied to each of that parent segment's parallel route slots. In the
        // simple case where there's only one parallel route (the `children` slot),
        // this is no different from if the loading module data where stored on the
        // child directly. But I'm not sure this actually makes sense when there are
        // multiple parallel routes. It's not a huge issue because you always have
        // the option to define a narrower loading boundary for a particular slot. But
        // this sort of smells like an implementation accident to me.
        const loadingModuleData = parentCacheNode.loading;
        let child = /*#__PURE__*/ (0, _jsxruntime.jsxs)(_approutercontextsharedruntime.TemplateContext.Provider, {
            value: /*#__PURE__*/ (0, _jsxruntime.jsxs)(ScrollAndFocusHandler, {
                segmentPath: segmentPath,
                children: [
                    /*#__PURE__*/ (0, _jsxruntime.jsx)(_errorboundary.ErrorBoundary, {
                        errorComponent: error,
                        errorStyles: errorStyles,
                        errorScripts: errorScripts,
                        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(LoadingBoundary, {
                            loading: loadingModuleData,
                            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_errorboundary1.HTTPAccessFallbackBoundary, {
                                notFound: notFound,
                                forbidden: forbidden,
                                unauthorized: unauthorized,
                                children: /*#__PURE__*/ (0, _jsxruntime.jsxs)(_redirectboundary.RedirectBoundary, {
                                    children: [
                                        /*#__PURE__*/ (0, _jsxruntime.jsx)(InnerLayoutRouter, {
                                            url: url,
                                            tree: tree,
                                            cacheNode: cacheNode,
                                            segmentPath: segmentPath
                                        }),
                                        segmentBoundaryTriggerNode
                                    ]
                                })
                            })
                        })
                    }),
                    segmentViewStateNode
                ]
            }),
            children: [
                templateStyles,
                templateScripts,
                template
            ]
        }, stateKey);
        if ("TURBOPACK compile-time truthy", 1) {
            const { SegmentStateProvider } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)");
            child = /*#__PURE__*/ (0, _jsxruntime.jsxs)(SegmentStateProvider, {
                children: [
                    child,
                    segmentViewBoundaries
                ]
            }, stateKey);
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        children.push(child);
        bfcacheEntry = bfcacheEntry.next;
    }while (bfcacheEntry !== null)
    return children;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=layout-router.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return RenderFromTemplateContext;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/.pnpm/@swc+helpers@0.5.15/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
function RenderFromTemplateContext() {
    const children = (0, _react.useContext)(_approutercontextsharedruntime.TemplateContext);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: children
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=render-from-template-context.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReflectAdapter", {
    enumerable: true,
    get: function() {
        return ReflectAdapter;
    }
});
class ReflectAdapter {
    static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'function') {
            return value.bind(target);
        }
        return value;
    }
    static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    }
    static has(target, prop) {
        return Reflect.has(target, prop);
    }
    static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
} //# sourceMappingURL=reflect.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This regex will have fast negatives meaning valid identifiers may not pass
// this test. However this is only used during static generation to provide hints
// about why a page bailed out of some or all prerendering and we can use bracket notation
// for example while `ಠ_ಠ` is a valid identifier it's ok to print `searchParams['ಠ_ಠ']`
// even if this would have been fine too `searchParams.ಠ_ಠ`
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    describeHasCheckingStringProperty: null,
    describeStringPropertyAccess: null,
    wellKnownProperties: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    describeHasCheckingStringProperty: function() {
        return describeHasCheckingStringProperty;
    },
    describeStringPropertyAccess: function() {
        return describeStringPropertyAccess;
    },
    wellKnownProperties: function() {
        return wellKnownProperties;
    }
});
const isDefinitelyAValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function describeStringPropertyAccess(target, prop) {
    if (isDefinitelyAValidIdentifier.test(prop)) {
        return "`" + target + "." + prop + "`";
    }
    return "`" + target + "[" + JSON.stringify(prop) + "]`";
}
function describeHasCheckingStringProperty(target, prop) {
    const stringifiedProp = JSON.stringify(prop);
    return "`Reflect.has(" + target + ", " + stringifiedProp + ")`, `" + stringifiedProp + " in " + target + "`, or similar";
}
const wellKnownProperties = new Set([
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'valueOf',
    'toLocaleString',
    // Promise prototype
    // fallthrough
    'then',
    'catch',
    'finally',
    // React Promise extension
    // fallthrough
    'status',
    // React introspection
    'displayName',
    '_debugInfo',
    // Common tested properties
    // fallthrough
    'toJSON',
    '$$typeof',
    '__esModule'
]); //# sourceMappingURL=reflect-utils.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/request/search-params.browser.dev.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderSearchParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderSearchParamsFromClient;
    }
});
const _reflect = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)");
const _reflectutils = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)");
const CachedSearchParams = new WeakMap();
function makeUntrackedExoticSearchParamsWithDevWarnings(underlyingSearchParams) {
    const cachedSearchParams = CachedSearchParams.get(underlyingSearchParams);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const proxiedProperties = new Set();
    const unproxiedProperties = [];
    const promise = Promise.resolve(underlyingSearchParams);
    Object.keys(underlyingSearchParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
            // These properties cannot be shadowed because they need to be the
            // true underlying value for Promises to work correctly at runtime
            unproxiedProperties.push(prop);
        } else {
            proxiedProperties.add(prop);
            promise[prop] = underlyingSearchParams[prop];
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('searchParams', prop);
                    warnForSyncAccess(expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return Reflect.set(target, prop, value, receiver);
        },
        has (target, prop) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeHasCheckingStringProperty)('searchParams', prop);
                    warnForSyncAccess(expression);
                }
            }
            return Reflect.has(target, prop);
        },
        ownKeys (target) {
            warnForSyncSpread();
            return Reflect.ownKeys(target);
        }
    });
    CachedSearchParams.set(underlyingSearchParams, proxiedPromise);
    return proxiedPromise;
}
// Similar to `makeUntrackedExoticSearchParamsWithDevWarnings`, but just logging
// the sync access without actually defining the search params on the promise.
function makeUntrackedSearchParamsWithDevWarnings(underlyingSearchParams) {
    const cachedSearchParams = CachedSearchParams.get(underlyingSearchParams);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const proxiedProperties = new Set();
    const unproxiedProperties = [];
    const promise = Promise.resolve(underlyingSearchParams);
    Object.keys(underlyingSearchParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
            // These properties cannot be shadowed because they need to be the
            // true underlying value for Promises to work correctly at runtime
            unproxiedProperties.push(prop);
        } else {
            proxiedProperties.add(prop);
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('searchParams', prop);
                    warnForSyncAccess(expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return Reflect.set(target, prop, value, receiver);
        },
        has (target, prop) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeHasCheckingStringProperty)('searchParams', prop);
                    warnForSyncAccess(expression);
                }
            }
            return Reflect.has(target, prop);
        },
        ownKeys (target) {
            warnForSyncSpread();
            return Reflect.ownKeys(target);
        }
    });
    CachedSearchParams.set(underlyingSearchParams, proxiedPromise);
    return proxiedPromise;
}
function warnForSyncAccess(expression) {
    console.error("A searchParam property was accessed directly with " + expression + ". " + "`searchParams` should be unwrapped with `React.use()` before accessing its properties. " + "Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis");
}
function warnForSyncSpread() {
    console.error("The keys of `searchParams` were accessed directly. " + "`searchParams` should be unwrapped with `React.use()` before accessing its properties. " + "Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis");
}
function createRenderSearchParamsFromClient(underlyingSearchParams) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return makeUntrackedExoticSearchParamsWithDevWarnings(underlyingSearchParams);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=search-params.browser.dev.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/request/search-params.browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderSearchParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderSearchParamsFromClient;
    }
});
const createRenderSearchParamsFromClient = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/request/search-params.browser.dev.js [app-client] (ecmascript)").createRenderSearchParamsFromClient : "TURBOPACK unreachable";
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=search-params.browser.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/request/params.browser.dev.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderParamsFromClient;
    }
});
const _reflect = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/invariant-error.js [app-client] (ecmascript)");
const _reflectutils = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)");
const CachedParams = new WeakMap();
function makeDynamicallyTrackedExoticParamsWithDevWarnings(underlyingParams) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    // We don't use makeResolvedReactPromise here because params
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = Promise.resolve(underlyingParams);
    const proxiedProperties = new Set();
    const unproxiedProperties = [];
    Object.keys(underlyingParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            proxiedProperties.add(prop);
            promise[prop] = underlyingParams[prop];
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (proxiedProperties.has(prop)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('params', prop);
                    warnForSyncAccess(expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return _reflect.ReflectAdapter.set(target, prop, value, receiver);
        },
        ownKeys (target) {
            warnForEnumeration(unproxiedProperties);
            return Reflect.ownKeys(target);
        }
    });
    CachedParams.set(underlyingParams, proxiedPromise);
    return proxiedPromise;
}
// Similar to `makeDynamicallyTrackedExoticParamsWithDevWarnings`, but just
// logging the sync access without actually defining the params on the promise.
function makeDynamicallyTrackedParamsWithDevWarnings(underlyingParams) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    // We don't use makeResolvedReactPromise here because params
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = Promise.resolve(underlyingParams);
    const proxiedProperties = new Set();
    const unproxiedProperties = [];
    Object.keys(underlyingParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            proxiedProperties.add(prop);
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (proxiedProperties.has(prop)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('params', prop);
                    warnForSyncAccess(expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return _reflect.ReflectAdapter.set(target, prop, value, receiver);
        },
        ownKeys (target) {
            warnForEnumeration(unproxiedProperties);
            return Reflect.ownKeys(target);
        }
    });
    CachedParams.set(underlyingParams, proxiedPromise);
    return proxiedPromise;
}
function warnForSyncAccess(expression) {
    console.error("A param property was accessed directly with " + expression + ". `params` is now a Promise and should be unwrapped with `React.use()` before accessing properties of the underlying params object. In this version of Next.js direct access to param properties is still supported to facilitate migration but in a future version you will be required to unwrap `params` with `React.use()`.");
}
function warnForEnumeration(missingProperties) {
    if (missingProperties.length) {
        const describedMissingProperties = describeListOfPropertyNames(missingProperties);
        console.error("params are being enumerated incompletely missing these properties: " + describedMissingProperties + ". " + "`params` should be unwrapped with `React.use()` before using its value. " + "Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis");
    } else {
        console.error("params are being enumerated. " + "`params` should be unwrapped with `React.use()` before using its value. " + "Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis");
    }
}
function describeListOfPropertyNames(properties) {
    switch(properties.length){
        case 0:
            throw Object.defineProperty(new _invarianterror.InvariantError('Expected describeListOfPropertyNames to be called with a non-empty list of strings.'), "__NEXT_ERROR_CODE", {
                value: "E531",
                enumerable: false,
                configurable: true
            });
        case 1:
            return "`" + properties[0] + "`";
        case 2:
            return "`" + properties[0] + "` and `" + properties[1] + "`";
        default:
            {
                let description = '';
                for(let i = 0; i < properties.length - 1; i++){
                    description += "`" + properties[i] + "`, ";
                }
                description += ", and `" + properties[properties.length - 1] + "`";
                return description;
            }
    }
}
function createRenderParamsFromClient(clientParams) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return makeDynamicallyTrackedExoticParamsWithDevWarnings(clientParams);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=params.browser.dev.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/request/params.browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderParamsFromClient;
    }
});
const createRenderParamsFromClient = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/request/params.browser.dev.js [app-client] (ecmascript)").createRenderParamsFromClient : "TURBOPACK unreachable";
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=params.browser.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createDedupedByCallsiteServerErrorLoggerDev", {
    enumerable: true,
    get: function() {
        return createDedupedByCallsiteServerErrorLoggerDev;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(__turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const errorRef = {
    current: null
};
// React.cache is currently only available in canary/experimental React channels.
const cache = typeof _react.cache === 'function' ? _react.cache : (fn)=>fn;
// When Cache Components is enabled, we record these as errors so that they
// are captured by the dev overlay as it's more critical to fix these
// when enabled.
const logErrorOrWarn = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : console.warn;
// We don't want to dedupe across requests.
// The developer might've just attempted to fix the warning so we should warn again if it still happens.
const flushCurrentErrorIfNew = cache((key)=>{
    try {
        logErrorOrWarn(errorRef.current);
    } finally{
        errorRef.current = null;
    }
});
function createDedupedByCallsiteServerErrorLoggerDev(getMessage) {
    return function logDedupedError() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        const message = getMessage(...args);
        if ("TURBOPACK compile-time truthy", 1) {
            var _stack;
            const callStackFrames = (_stack = new Error().stack) == null ? void 0 : _stack.split('\n');
            if (callStackFrames === undefined || callStackFrames.length < 4) {
                logErrorOrWarn(message);
            } else {
                // Error:
                //   logDedupedError
                //   asyncApiBeingAccessedSynchronously
                //   <userland callsite>
                // TODO: This breaks if sourcemaps with ignore lists are enabled.
                const key = callStackFrames[4];
                errorRef.current = message;
                flushCurrentErrorIfNew(key);
            }
        } else //TURBOPACK unreachable
        ;
    };
} //# sourceMappingURL=create-deduped-by-callsite-server-error-logger.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/after-task-async-storage-instance.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "afterTaskAsyncStorageInstance", {
    enumerable: true,
    get: function() {
        return afterTaskAsyncStorageInstance;
    }
});
const _asynclocalstorage = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/async-local-storage.js [app-client] (ecmascript)");
const afterTaskAsyncStorageInstance = (0, _asynclocalstorage.createAsyncLocalStorage)(); //# sourceMappingURL=after-task-async-storage-instance.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/after-task-async-storage.external.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "afterTaskAsyncStorage", {
    enumerable: true,
    get: function() {
        return _aftertaskasyncstorageinstance.afterTaskAsyncStorageInstance;
    }
});
const _aftertaskasyncstorageinstance = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/after-task-async-storage-instance.js [app-client] (ecmascript)"); //# sourceMappingURL=after-task-async-storage.external.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/request/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isRequestAPICallableInsideAfter: null,
    throwForSearchParamsAccessInUseCache: null,
    throwWithStaticGenerationBailoutError: null,
    throwWithStaticGenerationBailoutErrorWithDynamicError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isRequestAPICallableInsideAfter: function() {
        return isRequestAPICallableInsideAfter;
    },
    throwForSearchParamsAccessInUseCache: function() {
        return throwForSearchParamsAccessInUseCache;
    },
    throwWithStaticGenerationBailoutError: function() {
        return throwWithStaticGenerationBailoutError;
    },
    throwWithStaticGenerationBailoutErrorWithDynamicError: function() {
        return throwWithStaticGenerationBailoutErrorWithDynamicError;
    }
});
const _staticgenerationbailout = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/static-generation-bailout.js [app-client] (ecmascript)");
const _aftertaskasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/after-task-async-storage.external.js [app-client] (ecmascript)");
function throwWithStaticGenerationBailoutError(route, expression) {
    throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError("Route ".concat(route, " couldn't be rendered statically because it used ").concat(expression, ". See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering")), "__NEXT_ERROR_CODE", {
        value: "E576",
        enumerable: false,
        configurable: true
    });
}
function throwWithStaticGenerationBailoutErrorWithDynamicError(route, expression) {
    throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError("Route ".concat(route, ' with `dynamic = "error"` couldn\'t be rendered statically because it used ').concat(expression, ". See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering")), "__NEXT_ERROR_CODE", {
        value: "E543",
        enumerable: false,
        configurable: true
    });
}
function throwForSearchParamsAccessInUseCache(workStore, constructorOpt) {
    var _workStore;
    const error = Object.defineProperty(new Error("Route ".concat(workStore.route, ' used "searchParams" inside "use cache". Accessing dynamic request data inside a cache scope is not supported. If you need some search params inside a cached function await "searchParams" outside of the cached function and pass only the required search params as arguments to the cached function. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache')), "__NEXT_ERROR_CODE", {
        value: "E779",
        enumerable: false,
        configurable: true
    });
    Error.captureStackTrace(error, constructorOpt);
    var _invalidDynamicUsageError;
    (_invalidDynamicUsageError = (_workStore = workStore).invalidDynamicUsageError) !== null && _invalidDynamicUsageError !== void 0 ? _invalidDynamicUsageError : _workStore.invalidDynamicUsageError = error;
    throw error;
}
function isRequestAPICallableInsideAfter() {
    const afterTaskStore = _aftertaskasyncstorageexternal.afterTaskAsyncStorage.getStore();
    return (afterTaskStore == null ? void 0 : afterTaskStore.rootTaskSpawnPhase) === 'action';
} //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/request/search-params.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createPrerenderSearchParamsForClientPage: null,
    createSearchParamsFromClient: null,
    createServerSearchParamsForMetadata: null,
    createServerSearchParamsForServerPage: null,
    makeErroringSearchParamsForUseCache: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createPrerenderSearchParamsForClientPage: function() {
        return createPrerenderSearchParamsForClientPage;
    },
    createSearchParamsFromClient: function() {
        return createSearchParamsFromClient;
    },
    createServerSearchParamsForMetadata: function() {
        return createServerSearchParamsForMetadata;
    },
    createServerSearchParamsForServerPage: function() {
        return createServerSearchParamsForServerPage;
    },
    makeErroringSearchParamsForUseCache: function() {
        return makeErroringSearchParamsForUseCache;
    }
});
const _reflect = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)");
const _dynamicrendering = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-client] (ecmascript)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/work-unit-async-storage.external.js [app-client] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/invariant-error.js [app-client] (ecmascript)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/dynamic-rendering-utils.js [app-client] (ecmascript)");
const _creatededupedbycallsiteservererrorlogger = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-client] (ecmascript)");
const _reflectutils = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/request/utils.js [app-client] (ecmascript)");
function createSearchParamsFromClient(underlyingSearchParams, workStore) {
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
            case 'prerender-legacy':
                return createStaticPrerenderSearchParams(workStore, workUnitStore);
            case 'prerender-runtime':
                throw Object.defineProperty(new _invarianterror.InvariantError('createSearchParamsFromClient should not be called in a runtime prerender.'), "__NEXT_ERROR_CODE", {
                    value: "E769",
                    enumerable: false,
                    configurable: true
                });
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new _invarianterror.InvariantError('createSearchParamsFromClient should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E739",
                    enumerable: false,
                    configurable: true
                });
            case 'request':
                return createRenderSearchParams(underlyingSearchParams, workStore);
            default:
                workUnitStore;
        }
    }
    (0, _workunitasyncstorageexternal.throwInvariantForMissingStore)();
}
const createServerSearchParamsForMetadata = createServerSearchParamsForServerPage;
function createServerSearchParamsForServerPage(underlyingSearchParams, workStore) {
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
            case 'prerender-legacy':
                return createStaticPrerenderSearchParams(workStore, workUnitStore);
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new _invarianterror.InvariantError('createServerSearchParamsForServerPage should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E747",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-runtime':
                return createRuntimePrerenderSearchParams(underlyingSearchParams, workUnitStore);
            case 'request':
                return createRenderSearchParams(underlyingSearchParams, workStore);
            default:
                workUnitStore;
        }
    }
    (0, _workunitasyncstorageexternal.throwInvariantForMissingStore)();
}
function createPrerenderSearchParamsForClientPage(workStore) {
    if (workStore.forceStatic) {
        // When using forceStatic we override all other logic and always just return an empty
        // dictionary object.
        return Promise.resolve({});
    }
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
                // We're prerendering in a mode that aborts (cacheComponents) and should stall
                // the promise to ensure the RSC side is considered dynamic
                return (0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, workStore.route, '`searchParams`');
            case 'prerender-runtime':
                throw Object.defineProperty(new _invarianterror.InvariantError('createPrerenderSearchParamsForClientPage should not be called in a runtime prerender.'), "__NEXT_ERROR_CODE", {
                    value: "E768",
                    enumerable: false,
                    configurable: true
                });
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new _invarianterror.InvariantError('createPrerenderSearchParamsForClientPage should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E746",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-ppr':
            case 'prerender-legacy':
            case 'request':
                return Promise.resolve({});
            default:
                workUnitStore;
        }
    }
    (0, _workunitasyncstorageexternal.throwInvariantForMissingStore)();
}
function createStaticPrerenderSearchParams(workStore, prerenderStore) {
    if (workStore.forceStatic) {
        // When using forceStatic we override all other logic and always just return an empty
        // dictionary object.
        return Promise.resolve({});
    }
    switch(prerenderStore.type){
        case 'prerender':
        case 'prerender-client':
            // We are in a cacheComponents (PPR or otherwise) prerender
            return makeHangingSearchParams(workStore, prerenderStore);
        case 'prerender-ppr':
        case 'prerender-legacy':
            // We are in a legacy static generation and need to interrupt the
            // prerender when search params are accessed.
            return makeErroringExoticSearchParams(workStore, prerenderStore);
        default:
            return prerenderStore;
    }
}
function createRuntimePrerenderSearchParams(underlyingSearchParams, workUnitStore) {
    return (0, _dynamicrendering.delayUntilRuntimeStage)(workUnitStore, ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : makeUntrackedExoticSearchParams(underlyingSearchParams));
}
function createRenderSearchParams(underlyingSearchParams, workStore) {
    if (workStore.forceStatic) {
        // When using forceStatic we override all other logic and always just return an empty
        // dictionary object.
        return Promise.resolve({});
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            // Semantically we only need the dev tracking when running in `next dev`
            // but since you would never use next dev with production NODE_ENV we use this
            // as a proxy so we can statically exclude this code from production builds.
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return makeDynamicallyTrackedExoticSearchParamsWithDevWarnings(underlyingSearchParams, workStore);
        } else //TURBOPACK unreachable
        ;
    }
}
const CachedSearchParams = new WeakMap();
const CachedSearchParamsForUseCache = new WeakMap();
function makeHangingSearchParams(workStore, prerenderStore) {
    const cachedSearchParams = CachedSearchParams.get(prerenderStore);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const promise = (0, _dynamicrenderingutils.makeHangingPromise)(prerenderStore.renderSignal, workStore.route, '`searchParams`');
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (Object.hasOwn(promise, prop)) {
                // The promise has this property directly. we must return it.
                // We know it isn't a dynamic access because it can only be something
                // that was previously written to the promise and thus not an underlying searchParam value
                return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
            switch(prop){
                case 'then':
                    {
                        const expression = '`await searchParams`, `searchParams.then`, or similar';
                        (0, _dynamicrendering.annotateDynamicAccess)(expression, prerenderStore);
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                    }
                case 'status':
                    {
                        const expression = '`use(searchParams)`, `searchParams.status`, or similar';
                        (0, _dynamicrendering.annotateDynamicAccess)(expression, prerenderStore);
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                    }
                default:
                    {
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                    }
            }
        }
    });
    CachedSearchParams.set(prerenderStore, proxiedPromise);
    return proxiedPromise;
}
function makeErroringExoticSearchParams(workStore, prerenderStore) {
    const cachedSearchParams = CachedSearchParams.get(workStore);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const underlyingSearchParams = {};
    // For search params we don't construct a ReactPromise because we want to interrupt
    // rendering on any property access that was not set from outside and so we only want
    // to have properties like value and status if React sets them.
    const promise = Promise.resolve(underlyingSearchParams);
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (Object.hasOwn(promise, prop)) {
                // The promise has this property directly. we must return it.
                // We know it isn't a dynamic access because it can only be something
                // that was previously written to the promise and thus not an underlying searchParam value
                return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
            switch(prop){
                case 'then':
                    {
                        const expression = '`await searchParams`, `searchParams.then`, or similar';
                        if (workStore.dynamicShouldError) {
                            (0, _utils.throwWithStaticGenerationBailoutErrorWithDynamicError)(workStore.route, expression);
                        } else if (prerenderStore.type === 'prerender-ppr') {
                            // PPR Prerender (no cacheComponents)
                            (0, _dynamicrendering.postponeWithTracking)(workStore.route, expression, prerenderStore.dynamicTracking);
                        } else {
                            // Legacy Prerender
                            (0, _dynamicrendering.throwToInterruptStaticGeneration)(expression, workStore, prerenderStore);
                        }
                        return;
                    }
                case 'status':
                    {
                        const expression = '`use(searchParams)`, `searchParams.status`, or similar';
                        if (workStore.dynamicShouldError) {
                            (0, _utils.throwWithStaticGenerationBailoutErrorWithDynamicError)(workStore.route, expression);
                        } else if (prerenderStore.type === 'prerender-ppr') {
                            // PPR Prerender (no cacheComponents)
                            (0, _dynamicrendering.postponeWithTracking)(workStore.route, expression, prerenderStore.dynamicTracking);
                        } else {
                            // Legacy Prerender
                            (0, _dynamicrendering.throwToInterruptStaticGeneration)(expression, workStore, prerenderStore);
                        }
                        return;
                    }
                default:
                    {
                        if (typeof prop === 'string' && !_reflectutils.wellKnownProperties.has(prop)) {
                            const expression = (0, _reflectutils.describeStringPropertyAccess)('searchParams', prop);
                            if (workStore.dynamicShouldError) {
                                (0, _utils.throwWithStaticGenerationBailoutErrorWithDynamicError)(workStore.route, expression);
                            } else if (prerenderStore.type === 'prerender-ppr') {
                                // PPR Prerender (no cacheComponents)
                                (0, _dynamicrendering.postponeWithTracking)(workStore.route, expression, prerenderStore.dynamicTracking);
                            } else {
                                // Legacy Prerender
                                (0, _dynamicrendering.throwToInterruptStaticGeneration)(expression, workStore, prerenderStore);
                            }
                        }
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                    }
            }
        },
        has (target, prop) {
            // We don't expect key checking to be used except for testing the existence of
            // searchParams so we make all has tests trigger dynamic. this means that `promise.then`
            // can resolve to the then function on the Promise prototype but 'then' in promise will assume
            // you are testing whether the searchParams has a 'then' property.
            if (typeof prop === 'string') {
                const expression = (0, _reflectutils.describeHasCheckingStringProperty)('searchParams', prop);
                if (workStore.dynamicShouldError) {
                    (0, _utils.throwWithStaticGenerationBailoutErrorWithDynamicError)(workStore.route, expression);
                } else if (prerenderStore.type === 'prerender-ppr') {
                    // PPR Prerender (no cacheComponents)
                    (0, _dynamicrendering.postponeWithTracking)(workStore.route, expression, prerenderStore.dynamicTracking);
                } else {
                    // Legacy Prerender
                    (0, _dynamicrendering.throwToInterruptStaticGeneration)(expression, workStore, prerenderStore);
                }
                return false;
            }
            return _reflect.ReflectAdapter.has(target, prop);
        },
        ownKeys () {
            const expression = '`{...searchParams}`, `Object.keys(searchParams)`, or similar';
            if (workStore.dynamicShouldError) {
                (0, _utils.throwWithStaticGenerationBailoutErrorWithDynamicError)(workStore.route, expression);
            } else if (prerenderStore.type === 'prerender-ppr') {
                // PPR Prerender (no cacheComponents)
                (0, _dynamicrendering.postponeWithTracking)(workStore.route, expression, prerenderStore.dynamicTracking);
            } else {
                // Legacy Prerender
                (0, _dynamicrendering.throwToInterruptStaticGeneration)(expression, workStore, prerenderStore);
            }
        }
    });
    CachedSearchParams.set(workStore, proxiedPromise);
    return proxiedPromise;
}
function makeErroringSearchParamsForUseCache(workStore) {
    const cachedSearchParams = CachedSearchParamsForUseCache.get(workStore);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const promise = Promise.resolve({});
    const proxiedPromise = new Proxy(promise, {
        get: function get(target, prop, receiver) {
            if (Object.hasOwn(promise, prop)) {
                // The promise has this property directly. we must return it. We know it
                // isn't a dynamic access because it can only be something that was
                // previously written to the promise and thus not an underlying
                // searchParam value
                return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
            if (typeof prop === 'string' && (prop === 'then' || !_reflectutils.wellKnownProperties.has(prop))) {
                (0, _utils.throwForSearchParamsAccessInUseCache)(workStore, get);
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        has: function has(target, prop) {
            // We don't expect key checking to be used except for testing the existence of
            // searchParams so we make all has tests throw an error. this means that `promise.then`
            // can resolve to the then function on the Promise prototype but 'then' in promise will assume
            // you are testing whether the searchParams has a 'then' property.
            if (typeof prop === 'string' && (prop === 'then' || !_reflectutils.wellKnownProperties.has(prop))) {
                (0, _utils.throwForSearchParamsAccessInUseCache)(workStore, has);
            }
            return _reflect.ReflectAdapter.has(target, prop);
        },
        ownKeys: function ownKeys() {
            (0, _utils.throwForSearchParamsAccessInUseCache)(workStore, ownKeys);
        }
    });
    CachedSearchParamsForUseCache.set(workStore, proxiedPromise);
    return proxiedPromise;
}
function makeUntrackedExoticSearchParams(underlyingSearchParams) {
    const cachedSearchParams = CachedSearchParams.get(underlyingSearchParams);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    // We don't use makeResolvedReactPromise here because searchParams
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = Promise.resolve(underlyingSearchParams);
    CachedSearchParams.set(underlyingSearchParams, promise);
    Object.keys(underlyingSearchParams).forEach((prop)=>{
        if (!_reflectutils.wellKnownProperties.has(prop)) {
            Object.defineProperty(promise, prop, {
                get () {
                    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
                    if (workUnitStore) {
                        (0, _dynamicrendering.trackDynamicDataInDynamicRender)(workUnitStore);
                    }
                    return underlyingSearchParams[prop];
                },
                set (value) {
                    Object.defineProperty(promise, prop, {
                        value,
                        writable: true,
                        enumerable: true
                    });
                },
                enumerable: true,
                configurable: true
            });
        }
    });
    return promise;
}
function makeUntrackedSearchParams(underlyingSearchParams) {
    const cachedSearchParams = CachedSearchParams.get(underlyingSearchParams);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const promise = Promise.resolve(underlyingSearchParams);
    CachedSearchParams.set(underlyingSearchParams, promise);
    return promise;
}
function makeDynamicallyTrackedExoticSearchParamsWithDevWarnings(underlyingSearchParams, store) {
    const cachedSearchParams = CachedSearchParams.get(underlyingSearchParams);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const proxiedProperties = new Set();
    const unproxiedProperties = [];
    // We have an unfortunate sequence of events that requires this initialization logic. We want to instrument the underlying
    // searchParams object to detect if you are accessing values in dev. This is used for warnings and for things like the static prerender
    // indicator. However when we pass this proxy to our Promise.resolve() below the VM checks if the resolved value is a promise by looking
    // at the `.then` property. To our dynamic tracking logic this is indistinguishable from a `then` searchParam and so we would normally trigger
    // dynamic tracking. However we know that this .then is not real dynamic access, it's just how thenables resolve in sequence. So we introduce
    // this initialization concept so we omit the dynamic check until after we've constructed our resolved promise.
    let promiseInitialized = false;
    const proxiedUnderlying = new Proxy(underlyingSearchParams, {
        get (target, prop, receiver) {
            if (typeof prop === 'string' && promiseInitialized) {
                if (store.dynamicShouldError) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('searchParams', prop);
                    (0, _utils.throwWithStaticGenerationBailoutErrorWithDynamicError)(store.route, expression);
                }
                const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
                if (workUnitStore) {
                    (0, _dynamicrendering.trackDynamicDataInDynamicRender)(workUnitStore);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        has (target, prop) {
            if (typeof prop === 'string') {
                if (store.dynamicShouldError) {
                    const expression = (0, _reflectutils.describeHasCheckingStringProperty)('searchParams', prop);
                    (0, _utils.throwWithStaticGenerationBailoutErrorWithDynamicError)(store.route, expression);
                }
            }
            return Reflect.has(target, prop);
        },
        ownKeys (target) {
            if (store.dynamicShouldError) {
                const expression = '`{...searchParams}`, `Object.keys(searchParams)`, or similar';
                (0, _utils.throwWithStaticGenerationBailoutErrorWithDynamicError)(store.route, expression);
            }
            return Reflect.ownKeys(target);
        }
    });
    // We don't use makeResolvedReactPromise here because searchParams
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = (0, _dynamicrenderingutils.makeDevtoolsIOAwarePromise)(underlyingSearchParams);
    promise.then(()=>{
        promiseInitialized = true;
    });
    Object.keys(underlyingSearchParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
            // These properties cannot be shadowed because they need to be the
            // true underlying value for Promises to work correctly at runtime
            unproxiedProperties.push(prop);
        } else {
            proxiedProperties.add(prop);
            Object.defineProperty(promise, prop, {
                get () {
                    return proxiedUnderlying[prop];
                },
                set (newValue) {
                    Object.defineProperty(promise, prop, {
                        value: newValue,
                        writable: true,
                        enumerable: true
                    });
                },
                enumerable: true,
                configurable: true
            });
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (prop === 'then' && store.dynamicShouldError) {
                const expression = '`searchParams.then`';
                (0, _utils.throwWithStaticGenerationBailoutErrorWithDynamicError)(store.route, expression);
            }
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('searchParams', prop);
                    syncIODev(store.route, expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return Reflect.set(target, prop, value, receiver);
        },
        has (target, prop) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeHasCheckingStringProperty)('searchParams', prop);
                    syncIODev(store.route, expression);
                }
            }
            return Reflect.has(target, prop);
        },
        ownKeys (target) {
            const expression = '`Object.keys(searchParams)` or similar';
            syncIODev(store.route, expression, unproxiedProperties);
            return Reflect.ownKeys(target);
        }
    });
    CachedSearchParams.set(underlyingSearchParams, proxiedPromise);
    return proxiedPromise;
}
// Similar to `makeDynamicallyTrackedExoticSearchParamsWithDevWarnings`, but
// just logging the sync access without actually defining the search params on
// the promise.
function makeUntrackedSearchParamsWithDevWarnings(underlyingSearchParams, store) {
    const cachedSearchParams = CachedSearchParams.get(underlyingSearchParams);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const proxiedProperties = new Set();
    const unproxiedProperties = [];
    const promise = (0, _dynamicrenderingutils.makeDevtoolsIOAwarePromise)(underlyingSearchParams);
    Object.keys(underlyingSearchParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
            // These properties cannot be shadowed because they need to be the
            // true underlying value for Promises to work correctly at runtime
            unproxiedProperties.push(prop);
        } else {
            proxiedProperties.add(prop);
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('searchParams', prop);
                    warnForSyncAccess(store.route, expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return Reflect.set(target, prop, value, receiver);
        },
        has (target, prop) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeHasCheckingStringProperty)('searchParams', prop);
                    warnForSyncAccess(store.route, expression);
                }
            }
            return Reflect.has(target, prop);
        },
        ownKeys (target) {
            const expression = '`Object.keys(searchParams)` or similar';
            warnForIncompleteEnumeration(store.route, expression, unproxiedProperties);
            return Reflect.ownKeys(target);
        }
    });
    CachedSearchParams.set(underlyingSearchParams, proxiedPromise);
    return proxiedPromise;
}
function syncIODev(route, expression, missingProperties) {
    // In all cases we warn normally
    if (missingProperties && missingProperties.length > 0) {
        warnForIncompleteEnumeration(route, expression, missingProperties);
    } else {
        warnForSyncAccess(route, expression);
    }
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'request':
                if (workUnitStore.prerenderPhase === true) {
                    // When we're rendering dynamically in dev, we need to advance out of
                    // the Prerender environment when we read Request data synchronously.
                    (0, _dynamicrendering.trackSynchronousRequestDataAccessInDev)(workUnitStore);
                }
                break;
            case 'prerender':
            case 'prerender-client':
            case 'prerender-runtime':
            case 'prerender-ppr':
            case 'prerender-legacy':
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                break;
            default:
                workUnitStore;
        }
    }
}
const warnForSyncAccess = (0, _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(createSearchAccessError);
const warnForIncompleteEnumeration = (0, _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(createIncompleteEnumerationError);
function createSearchAccessError(route, expression) {
    const prefix = route ? 'Route "'.concat(route, '" ') : 'This route ';
    return Object.defineProperty(new Error("".concat(prefix, "used ").concat(expression, ". ") + "`searchParams` should be awaited before using its properties. " + "Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis"), "__NEXT_ERROR_CODE", {
        value: "E249",
        enumerable: false,
        configurable: true
    });
}
function createIncompleteEnumerationError(route, expression, missingProperties) {
    const prefix = route ? 'Route "'.concat(route, '" ') : 'This route ';
    return Object.defineProperty(new Error("".concat(prefix, "used ").concat(expression, ". ") + "`searchParams` should be awaited before using its properties. " + "The following properties were not available through enumeration " + "because they conflict with builtin or well-known property names: " + "".concat(describeListOfPropertyNames(missingProperties), ". ") + "Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis"), "__NEXT_ERROR_CODE", {
        value: "E2",
        enumerable: false,
        configurable: true
    });
}
function describeListOfPropertyNames(properties) {
    switch(properties.length){
        case 0:
            throw Object.defineProperty(new _invarianterror.InvariantError('Expected describeListOfPropertyNames to be called with a non-empty list of strings.'), "__NEXT_ERROR_CODE", {
                value: "E531",
                enumerable: false,
                configurable: true
            });
        case 1:
            return "`".concat(properties[0], "`");
        case 2:
            return "`".concat(properties[0], "` and `").concat(properties[1], "`");
        default:
            {
                let description = '';
                for(let i = 0; i < properties.length - 1; i++){
                    description += "`".concat(properties[i], "`, ");
                }
                description += ", and `".concat(properties[properties.length - 1], "`");
                return description;
            }
    }
} //# sourceMappingURL=search-params.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/dynamic-access-async-storage-instance.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "dynamicAccessAsyncStorageInstance", {
    enumerable: true,
    get: function() {
        return dynamicAccessAsyncStorageInstance;
    }
});
const _asynclocalstorage = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/async-local-storage.js [app-client] (ecmascript)");
const dynamicAccessAsyncStorageInstance = (0, _asynclocalstorage.createAsyncLocalStorage)(); //# sourceMappingURL=dynamic-access-async-storage-instance.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/dynamic-access-async-storage.external.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "dynamicAccessAsyncStorage", {
    enumerable: true,
    get: function() {
        return _dynamicaccessasyncstorageinstance.dynamicAccessAsyncStorageInstance;
    }
});
const _dynamicaccessasyncstorageinstance = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/dynamic-access-async-storage-instance.js [app-client] (ecmascript)"); //# sourceMappingURL=dynamic-access-async-storage.external.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/request/params.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createParamsFromClient: null,
    createPrerenderParamsForClientSegment: null,
    createServerParamsForMetadata: null,
    createServerParamsForRoute: null,
    createServerParamsForServerSegment: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createParamsFromClient: function() {
        return createParamsFromClient;
    },
    createPrerenderParamsForClientSegment: function() {
        return createPrerenderParamsForClientSegment;
    },
    createServerParamsForMetadata: function() {
        return createServerParamsForMetadata;
    },
    createServerParamsForRoute: function() {
        return createServerParamsForRoute;
    },
    createServerParamsForServerSegment: function() {
        return createServerParamsForServerSegment;
    }
});
const _workasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
const _reflect = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)");
const _dynamicrendering = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-client] (ecmascript)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/work-unit-async-storage.external.js [app-client] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/invariant-error.js [app-client] (ecmascript)");
const _reflectutils = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/dynamic-rendering-utils.js [app-client] (ecmascript)");
const _creatededupedbycallsiteservererrorlogger = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-client] (ecmascript)");
const _dynamicaccessasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/dynamic-access-async-storage.external.js [app-client] (ecmascript)");
function createParamsFromClient(underlyingParams, workStore) {
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
            case 'prerender-legacy':
                return createStaticPrerenderParams(underlyingParams, workStore, workUnitStore);
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new _invarianterror.InvariantError('createParamsFromClient should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E736",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-runtime':
                throw Object.defineProperty(new _invarianterror.InvariantError('createParamsFromClient should not be called in a runtime prerender.'), "__NEXT_ERROR_CODE", {
                    value: "E770",
                    enumerable: false,
                    configurable: true
                });
            case 'request':
                if ("TURBOPACK compile-time truthy", 1) {
                    // Semantically we only need the dev tracking when running in `next dev`
                    // but since you would never use next dev with production NODE_ENV we use this
                    // as a proxy so we can statically exclude this code from production builds.
                    const devFallbackParams = workUnitStore.devFallbackParams;
                    return createRenderParamsInDev(underlyingParams, devFallbackParams, workStore);
                } else //TURBOPACK unreachable
                ;
            default:
                workUnitStore;
        }
    }
    (0, _workunitasyncstorageexternal.throwInvariantForMissingStore)();
}
const createServerParamsForMetadata = createServerParamsForServerSegment;
function createServerParamsForRoute(underlyingParams, workStore) {
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
            case 'prerender-legacy':
                return createStaticPrerenderParams(underlyingParams, workStore, workUnitStore);
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new _invarianterror.InvariantError('createServerParamsForRoute should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E738",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-runtime':
                return createRuntimePrerenderParams(underlyingParams, workUnitStore);
            case 'request':
                if ("TURBOPACK compile-time truthy", 1) {
                    // Semantically we only need the dev tracking when running in `next dev`
                    // but since you would never use next dev with production NODE_ENV we use this
                    // as a proxy so we can statically exclude this code from production builds.
                    const devFallbackParams = workUnitStore.devFallbackParams;
                    return createRenderParamsInDev(underlyingParams, devFallbackParams, workStore);
                } else //TURBOPACK unreachable
                ;
            default:
                workUnitStore;
        }
    }
    (0, _workunitasyncstorageexternal.throwInvariantForMissingStore)();
}
function createServerParamsForServerSegment(underlyingParams, workStore) {
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
            case 'prerender-ppr':
            case 'prerender-legacy':
                return createStaticPrerenderParams(underlyingParams, workStore, workUnitStore);
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new _invarianterror.InvariantError('createServerParamsForServerSegment should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E743",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-runtime':
                return createRuntimePrerenderParams(underlyingParams, workUnitStore);
            case 'request':
                if ("TURBOPACK compile-time truthy", 1) {
                    // Semantically we only need the dev tracking when running in `next dev`
                    // but since you would never use next dev with production NODE_ENV we use this
                    // as a proxy so we can statically exclude this code from production builds.
                    const devFallbackParams = workUnitStore.devFallbackParams;
                    return createRenderParamsInDev(underlyingParams, devFallbackParams, workStore);
                } else //TURBOPACK unreachable
                ;
            default:
                workUnitStore;
        }
    }
    (0, _workunitasyncstorageexternal.throwInvariantForMissingStore)();
}
function createPrerenderParamsForClientSegment(underlyingParams) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (!workStore) {
        throw Object.defineProperty(new _invarianterror.InvariantError('Missing workStore in createPrerenderParamsForClientSegment'), "__NEXT_ERROR_CODE", {
            value: "E773",
            enumerable: false,
            configurable: true
        });
    }
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender':
            case 'prerender-client':
                const fallbackParams = workUnitStore.fallbackRouteParams;
                if (fallbackParams) {
                    for(let key in underlyingParams){
                        if (fallbackParams.has(key)) {
                            // This params object has one or more fallback params, so we need
                            // to consider the awaiting of this params object "dynamic". Since
                            // we are in cacheComponents mode we encode this as a promise that never
                            // resolves.
                            return (0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, workStore.route, '`params`');
                        }
                    }
                }
                break;
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                throw Object.defineProperty(new _invarianterror.InvariantError('createPrerenderParamsForClientSegment should not be called in cache contexts.'), "__NEXT_ERROR_CODE", {
                    value: "E734",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-ppr':
            case 'prerender-legacy':
            case 'prerender-runtime':
            case 'request':
                break;
            default:
                workUnitStore;
        }
    }
    // We're prerendering in a mode that does not abort. We resolve the promise without
    // any tracking because we're just transporting a value from server to client where the tracking
    // will be applied.
    return Promise.resolve(underlyingParams);
}
function createStaticPrerenderParams(underlyingParams, workStore, prerenderStore) {
    switch(prerenderStore.type){
        case 'prerender':
        case 'prerender-client':
            {
                const fallbackParams = prerenderStore.fallbackRouteParams;
                if (fallbackParams) {
                    for(const key in underlyingParams){
                        if (fallbackParams.has(key)) {
                            // This params object has one or more fallback params, so we need
                            // to consider the awaiting of this params object "dynamic". Since
                            // we are in cacheComponents mode we encode this as a promise that never
                            // resolves.
                            return makeHangingParams(underlyingParams, workStore, prerenderStore);
                        }
                    }
                }
                break;
            }
        case 'prerender-ppr':
            {
                const fallbackParams = prerenderStore.fallbackRouteParams;
                if (fallbackParams) {
                    for(const key in underlyingParams){
                        if (fallbackParams.has(key)) {
                            return makeErroringExoticParams(underlyingParams, fallbackParams, workStore, prerenderStore);
                        }
                    }
                }
                break;
            }
        case 'prerender-legacy':
            break;
        default:
            prerenderStore;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return makeUntrackedExoticParams(underlyingParams);
    }
}
function createRuntimePrerenderParams(underlyingParams, workUnitStore) {
    return (0, _dynamicrendering.delayUntilRuntimeStage)(workUnitStore, ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : makeUntrackedExoticParams(underlyingParams));
}
function createRenderParamsInProd(underlyingParams) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return makeUntrackedExoticParams(underlyingParams);
}
function createRenderParamsInDev(underlyingParams, devFallbackParams, workStore) {
    let hasFallbackParams = false;
    if (devFallbackParams) {
        for(let key in underlyingParams){
            if (devFallbackParams.has(key)) {
                hasFallbackParams = true;
                break;
            }
        }
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return makeDynamicallyTrackedExoticParamsWithDevWarnings(underlyingParams, hasFallbackParams, workStore);
}
const CachedParams = new WeakMap();
const fallbackParamsProxyHandler = {
    get: function get(target, prop, receiver) {
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
            const originalMethod = _reflect.ReflectAdapter.get(target, prop, receiver);
            return ({
                [prop]: function() {
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                        args[_key] = arguments[_key];
                    }
                    const store = _dynamicaccessasyncstorageexternal.dynamicAccessAsyncStorage.getStore();
                    if (store) {
                        store.abortController.abort(Object.defineProperty(new Error("Accessed fallback `params` during prerendering."), "__NEXT_ERROR_CODE", {
                            value: "E691",
                            enumerable: false,
                            configurable: true
                        }));
                    }
                    return new Proxy(originalMethod.apply(target, args), fallbackParamsProxyHandler);
                }
            })[prop];
        }
        return _reflect.ReflectAdapter.get(target, prop, receiver);
    }
};
function makeHangingParams(underlyingParams, workStore, prerenderStore) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    const promise = new Proxy((0, _dynamicrenderingutils.makeHangingPromise)(prerenderStore.renderSignal, workStore.route, '`params`'), fallbackParamsProxyHandler);
    CachedParams.set(underlyingParams, promise);
    return promise;
}
function makeErroringExoticParams(underlyingParams, fallbackParams, workStore, prerenderStore) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    const augmentedUnderlying = {
        ...underlyingParams
    };
    // We don't use makeResolvedReactPromise here because params
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = Promise.resolve(augmentedUnderlying);
    CachedParams.set(underlyingParams, promise);
    Object.keys(underlyingParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            if (fallbackParams.has(prop)) {
                Object.defineProperty(augmentedUnderlying, prop, {
                    get () {
                        const expression = (0, _reflectutils.describeStringPropertyAccess)('params', prop);
                        // In most dynamic APIs we also throw if `dynamic = "error"` however
                        // for params is only dynamic when we're generating a fallback shell
                        // and even when `dynamic = "error"` we still support generating dynamic
                        // fallback shells
                        // TODO remove this comment when cacheComponents is the default since there
                        // will be no `dynamic = "error"`
                        if (prerenderStore.type === 'prerender-ppr') {
                            // PPR Prerender (no cacheComponents)
                            (0, _dynamicrendering.postponeWithTracking)(workStore.route, expression, prerenderStore.dynamicTracking);
                        } else {
                            // Legacy Prerender
                            (0, _dynamicrendering.throwToInterruptStaticGeneration)(expression, workStore, prerenderStore);
                        }
                    },
                    enumerable: true
                });
                Object.defineProperty(promise, prop, {
                    get () {
                        const expression = (0, _reflectutils.describeStringPropertyAccess)('params', prop);
                        // In most dynamic APIs we also throw if `dynamic = "error"` however
                        // for params is only dynamic when we're generating a fallback shell
                        // and even when `dynamic = "error"` we still support generating dynamic
                        // fallback shells
                        // TODO remove this comment when cacheComponents is the default since there
                        // will be no `dynamic = "error"`
                        if (prerenderStore.type === 'prerender-ppr') {
                            // PPR Prerender (no cacheComponents)
                            (0, _dynamicrendering.postponeWithTracking)(workStore.route, expression, prerenderStore.dynamicTracking);
                        } else {
                            // Legacy Prerender
                            (0, _dynamicrendering.throwToInterruptStaticGeneration)(expression, workStore, prerenderStore);
                        }
                    },
                    set (newValue) {
                        Object.defineProperty(promise, prop, {
                            value: newValue,
                            writable: true,
                            enumerable: true
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
            } else {
                ;
                promise[prop] = underlyingParams[prop];
            }
        }
    });
    return promise;
}
function makeUntrackedExoticParams(underlyingParams) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    // We don't use makeResolvedReactPromise here because params
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = Promise.resolve(underlyingParams);
    CachedParams.set(underlyingParams, promise);
    Object.keys(underlyingParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            ;
            promise[prop] = underlyingParams[prop];
        }
    });
    return promise;
}
function makeUntrackedParams(underlyingParams) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    const promise = Promise.resolve(underlyingParams);
    CachedParams.set(underlyingParams, promise);
    return promise;
}
function makeDynamicallyTrackedExoticParamsWithDevWarnings(underlyingParams, hasFallbackParams, store) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    // We don't use makeResolvedReactPromise here because params
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = hasFallbackParams ? (0, _dynamicrenderingutils.makeDevtoolsIOAwarePromise)(underlyingParams) : Promise.resolve(underlyingParams);
    const proxiedProperties = new Set();
    const unproxiedProperties = [];
    Object.keys(underlyingParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
            // These properties cannot be shadowed because they need to be the
            // true underlying value for Promises to work correctly at runtime
            unproxiedProperties.push(prop);
        } else {
            proxiedProperties.add(prop);
            promise[prop] = underlyingParams[prop];
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (proxiedProperties.has(prop)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('params', prop);
                    syncIODev(store.route, expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return _reflect.ReflectAdapter.set(target, prop, value, receiver);
        },
        ownKeys (target) {
            const expression = '`...params` or similar expression';
            syncIODev(store.route, expression, unproxiedProperties);
            return Reflect.ownKeys(target);
        }
    });
    CachedParams.set(underlyingParams, proxiedPromise);
    return proxiedPromise;
}
// Similar to `makeDynamicallyTrackedExoticParamsWithDevWarnings`, but just
// logging the sync access without actually defining the params on the promise.
function makeDynamicallyTrackedParamsWithDevWarnings(underlyingParams, hasFallbackParams, store) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    // We don't use makeResolvedReactPromise here because params
    // supports copying with spread and we don't want to unnecessarily
    // instrument the promise with spreadable properties of ReactPromise.
    const promise = hasFallbackParams ? (0, _dynamicrenderingutils.makeDevtoolsIOAwarePromise)(underlyingParams) : Promise.resolve(underlyingParams);
    const proxiedProperties = new Set();
    const unproxiedProperties = [];
    Object.keys(underlyingParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
            // These properties cannot be shadowed because they need to be the
            // true underlying value for Promises to work correctly at runtime
            unproxiedProperties.push(prop);
        } else {
            proxiedProperties.add(prop);
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (proxiedProperties.has(prop)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('params', prop);
                    warnForSyncAccess(store.route, expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return _reflect.ReflectAdapter.set(target, prop, value, receiver);
        },
        ownKeys (target) {
            const expression = '`...params` or similar expression';
            warnForIncompleteEnumeration(store.route, expression, unproxiedProperties);
            return Reflect.ownKeys(target);
        }
    });
    CachedParams.set(underlyingParams, proxiedPromise);
    return proxiedPromise;
}
function syncIODev(route, expression, missingProperties) {
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'request':
                if (workUnitStore.prerenderPhase === true) {
                    // When we're rendering dynamically in dev, we need to advance out of
                    // the Prerender environment when we read Request data synchronously.
                    (0, _dynamicrendering.trackSynchronousRequestDataAccessInDev)(workUnitStore);
                }
                break;
            case 'prerender':
            case 'prerender-client':
            case 'prerender-runtime':
            case 'prerender-ppr':
            case 'prerender-legacy':
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
                break;
            default:
                workUnitStore;
        }
    }
    // In all cases we warn normally
    if (missingProperties && missingProperties.length > 0) {
        warnForIncompleteEnumeration(route, expression, missingProperties);
    } else {
        warnForSyncAccess(route, expression);
    }
}
const warnForSyncAccess = (0, _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(createParamsAccessError);
const warnForIncompleteEnumeration = (0, _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(createIncompleteEnumerationError);
function createParamsAccessError(route, expression) {
    const prefix = route ? 'Route "'.concat(route, '" ') : 'This route ';
    return Object.defineProperty(new Error("".concat(prefix, "used ").concat(expression, ". ") + "`params` should be awaited before using its properties. " + "Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis"), "__NEXT_ERROR_CODE", {
        value: "E307",
        enumerable: false,
        configurable: true
    });
}
function createIncompleteEnumerationError(route, expression, missingProperties) {
    const prefix = route ? 'Route "'.concat(route, '" ') : 'This route ';
    return Object.defineProperty(new Error("".concat(prefix, "used ").concat(expression, ". ") + "`params` should be awaited before using its properties. " + "The following properties were not available through enumeration " + "because they conflict with builtin property names: " + "".concat(describeListOfPropertyNames(missingProperties), ". ") + "Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis"), "__NEXT_ERROR_CODE", {
        value: "E482",
        enumerable: false,
        configurable: true
    });
}
function describeListOfPropertyNames(properties) {
    switch(properties.length){
        case 0:
            throw Object.defineProperty(new _invarianterror.InvariantError('Expected describeListOfPropertyNames to be called with a non-empty list of strings.'), "__NEXT_ERROR_CODE", {
                value: "E531",
                enumerable: false,
                configurable: true
            });
        case 1:
            return "`".concat(properties[0], "`");
        case 2:
            return "`".concat(properties[0], "` and `").concat(properties[1], "`");
        default:
            {
                let description = '';
                for(let i = 0; i < properties.length - 1; i++){
                    description += "`".concat(properties[i], "`, ");
                }
                description += ", and `".concat(properties[properties.length - 1], "`");
                return description;
            }
    }
} //# sourceMappingURL=params.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/client-page.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClientPageRoot", {
    enumerable: true,
    get: function() {
        return ClientPageRoot;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/invariant-error.js [app-client] (ecmascript)");
function ClientPageRoot(param) {
    let { Component, searchParams, params, promises } = param;
    if (typeof window === 'undefined') {
        const { workAsyncStorage } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
        let clientSearchParams;
        let clientParams;
        // We are going to instrument the searchParams prop with tracking for the
        // appropriate context. We wrap differently in prerendering vs rendering
        const store = workAsyncStorage.getStore();
        if (!store) {
            throw Object.defineProperty(new _invarianterror.InvariantError('Expected workStore to exist when handling searchParams in a client Page.'), "__NEXT_ERROR_CODE", {
                value: "E564",
                enumerable: false,
                configurable: true
            });
        }
        const { createSearchParamsFromClient } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/request/search-params.js [app-client] (ecmascript)");
        clientSearchParams = createSearchParamsFromClient(searchParams, store);
        const { createParamsFromClient } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/request/params.js [app-client] (ecmascript)");
        clientParams = createParamsFromClient(params, store);
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Component, {
            params: clientParams,
            searchParams: clientSearchParams
        });
    } else {
        const { createRenderSearchParamsFromClient } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/request/search-params.browser.js [app-client] (ecmascript)");
        const clientSearchParams = createRenderSearchParamsFromClient(searchParams);
        const { createRenderParamsFromClient } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/request/params.browser.js [app-client] (ecmascript)");
        const clientParams = createRenderParamsFromClient(params);
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Component, {
            params: clientParams,
            searchParams: clientSearchParams
        });
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=client-page.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/client-segment.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClientSegmentRoot", {
    enumerable: true,
    get: function() {
        return ClientSegmentRoot;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/invariant-error.js [app-client] (ecmascript)");
function ClientSegmentRoot(param) {
    let { Component, slots, params, promise } = param;
    if (typeof window === 'undefined') {
        const { workAsyncStorage } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
        let clientParams;
        // We are going to instrument the searchParams prop with tracking for the
        // appropriate context. We wrap differently in prerendering vs rendering
        const store = workAsyncStorage.getStore();
        if (!store) {
            throw Object.defineProperty(new _invarianterror.InvariantError('Expected workStore to exist when handling params in a client segment such as a Layout or Template.'), "__NEXT_ERROR_CODE", {
                value: "E600",
                enumerable: false,
                configurable: true
            });
        }
        const { createParamsFromClient } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/request/params.js [app-client] (ecmascript)");
        clientParams = createParamsFromClient(params, store);
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Component, {
            ...slots,
            params: clientParams
        });
    } else {
        const { createRenderParamsFromClient } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/request/params.browser.js [app-client] (ecmascript)");
        const clientParams = createRenderParamsFromClient(params);
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Component, {
            ...slots,
            params: clientParams
        });
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=client-segment.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IconMark", {
    enumerable: true,
    get: function() {
        return IconMark;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const IconMark = ()=>{
    if (typeof window !== 'undefined') {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("meta", {
        name: "\xabnxt-icon\xbb"
    });
}; //# sourceMappingURL=icon-mark.js.map
}),
"[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/metadata/async-metadata.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AsyncMetadataOutlet", {
    enumerable: true,
    get: function() {
        return AsyncMetadataOutlet;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function MetadataOutlet(param) {
    let { promise } = param;
    const { error, digest } = (0, _react.use)(promise);
    if (error) {
        if (digest) {
            // The error will lose its original digest after passing from server layer to client layer；
            // We recover the digest property here to override the React created one if original digest exists.
            ;
            error.digest = digest;
        }
        throw error;
    }
    return null;
}
function AsyncMetadataOutlet(param) {
    let { promise } = param;
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_react.Suspense, {
        fallback: null,
        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(MetadataOutlet, {
            promise: promise
        })
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=async-metadata.js.map
}),
]);

//# sourceMappingURL=9fc53_next_dist_5432ede4._.js.map