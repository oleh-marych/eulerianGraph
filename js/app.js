(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    var PipsMode;
    (function(PipsMode) {
        PipsMode["Range"] = "range";
        PipsMode["Steps"] = "steps";
        PipsMode["Positions"] = "positions";
        PipsMode["Count"] = "count";
        PipsMode["Values"] = "values";
    })(PipsMode || (PipsMode = {}));
    var PipsType;
    (function(PipsType) {
        PipsType[PipsType["None"] = -1] = "None";
        PipsType[PipsType["NoValue"] = 0] = "NoValue";
        PipsType[PipsType["LargeValue"] = 1] = "LargeValue";
        PipsType[PipsType["SmallValue"] = 2] = "SmallValue";
    })(PipsType || (PipsType = {}));
    function isValidFormatter(entry) {
        return isValidPartialFormatter(entry) && typeof entry.from === "function";
    }
    function isValidPartialFormatter(entry) {
        return typeof entry === "object" && typeof entry.to === "function";
    }
    function removeElement(el) {
        el.parentElement.removeChild(el);
    }
    function isSet(value) {
        return value !== null && value !== void 0;
    }
    function preventDefault(e) {
        e.preventDefault();
    }
    function unique(array) {
        return array.filter((function(a) {
            return !this[a] ? this[a] = true : false;
        }), {});
    }
    function closest(value, to) {
        return Math.round(value / to) * to;
    }
    function offset(elem, orientation) {
        var rect = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var docElem = doc.documentElement;
        var pageOffset = getPageOffset(doc);
        if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) pageOffset.x = 0;
        return orientation ? rect.top + pageOffset.y - docElem.clientTop : rect.left + pageOffset.x - docElem.clientLeft;
    }
    function isNumeric(a) {
        return typeof a === "number" && !isNaN(a) && isFinite(a);
    }
    function addClassFor(element, className, duration) {
        if (duration > 0) {
            addClass(element, className);
            setTimeout((function() {
                removeClass(element, className);
            }), duration);
        }
    }
    function limit(a) {
        return Math.max(Math.min(a, 100), 0);
    }
    function asArray(a) {
        return Array.isArray(a) ? a : [ a ];
    }
    function countDecimals(numStr) {
        numStr = String(numStr);
        var pieces = numStr.split(".");
        return pieces.length > 1 ? pieces[1].length : 0;
    }
    function addClass(el, className) {
        if (el.classList && !/\s/.test(className)) el.classList.add(className); else el.className += " " + className;
    }
    function removeClass(el, className) {
        if (el.classList && !/\s/.test(className)) el.classList.remove(className); else el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    }
    function hasClass(el, className) {
        return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);
    }
    function getPageOffset(doc) {
        var supportPageOffset = window.pageXOffset !== void 0;
        var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
        var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? doc.documentElement.scrollLeft : doc.body.scrollLeft;
        var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop;
        return {
            x,
            y
        };
    }
    function getActions() {
        return window.navigator.pointerEnabled ? {
            start: "pointerdown",
            move: "pointermove",
            end: "pointerup"
        } : window.navigator.msPointerEnabled ? {
            start: "MSPointerDown",
            move: "MSPointerMove",
            end: "MSPointerUp"
        } : {
            start: "mousedown touchstart",
            move: "mousemove touchmove",
            end: "mouseup touchend"
        };
    }
    function getSupportsPassive() {
        var supportsPassive = false;
        try {
            var opts = Object.defineProperty({}, "passive", {
                get: function() {
                    supportsPassive = true;
                }
            });
            window.addEventListener("test", null, opts);
        } catch (e) {}
        return supportsPassive;
    }
    function getSupportsTouchActionNone() {
        return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
    }
    function subRangeRatio(pa, pb) {
        return 100 / (pb - pa);
    }
    function fromPercentage(range, value, startRange) {
        return value * 100 / (range[startRange + 1] - range[startRange]);
    }
    function toPercentage(range, value) {
        return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
    }
    function isPercentage(range, value) {
        return value * (range[1] - range[0]) / 100 + range[0];
    }
    function getJ(value, arr) {
        var j = 1;
        while (value >= arr[j]) j += 1;
        return j;
    }
    function toStepping(xVal, xPct, value) {
        if (value >= xVal.slice(-1)[0]) return 100;
        var j = getJ(value, xVal);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];
        return pa + toPercentage([ va, vb ], value) / subRangeRatio(pa, pb);
    }
    function fromStepping(xVal, xPct, value) {
        if (value >= 100) return xVal.slice(-1)[0];
        var j = getJ(value, xPct);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];
        return isPercentage([ va, vb ], (value - pa) * subRangeRatio(pa, pb));
    }
    function getStep(xPct, xSteps, snap, value) {
        if (value === 100) return value;
        var j = getJ(value, xPct);
        var a = xPct[j - 1];
        var b = xPct[j];
        if (snap) {
            if (value - a > (b - a) / 2) return b;
            return a;
        }
        if (!xSteps[j - 1]) return value;
        return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
    }
    var Spectrum = function() {
        function Spectrum(entry, snap, singleStep) {
            this.xPct = [];
            this.xVal = [];
            this.xSteps = [];
            this.xNumSteps = [];
            this.xHighestCompleteStep = [];
            this.xSteps = [ singleStep || false ];
            this.xNumSteps = [ false ];
            this.snap = snap;
            var index;
            var ordered = [];
            Object.keys(entry).forEach((function(index) {
                ordered.push([ asArray(entry[index]), index ]);
            }));
            ordered.sort((function(a, b) {
                return a[0][0] - b[0][0];
            }));
            for (index = 0; index < ordered.length; index++) this.handleEntryPoint(ordered[index][1], ordered[index][0]);
            this.xNumSteps = this.xSteps.slice(0);
            for (index = 0; index < this.xNumSteps.length; index++) this.handleStepPoint(index, this.xNumSteps[index]);
        }
        Spectrum.prototype.getDistance = function(value) {
            var distances = [];
            for (var index = 0; index < this.xNumSteps.length - 1; index++) distances[index] = fromPercentage(this.xVal, value, index);
            return distances;
        };
        Spectrum.prototype.getAbsoluteDistance = function(value, distances, direction) {
            var xPct_index = 0;
            if (value < this.xPct[this.xPct.length - 1]) while (value > this.xPct[xPct_index + 1]) xPct_index++; else if (value === this.xPct[this.xPct.length - 1]) xPct_index = this.xPct.length - 2;
            if (!direction && value === this.xPct[xPct_index + 1]) xPct_index++;
            if (distances === null) distances = [];
            var start_factor;
            var rest_factor = 1;
            var rest_rel_distance = distances[xPct_index];
            var range_pct = 0;
            var rel_range_distance = 0;
            var abs_distance_counter = 0;
            var range_counter = 0;
            if (direction) start_factor = (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]); else start_factor = (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
            while (rest_rel_distance > 0) {
                range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter];
                if (distances[xPct_index + range_counter] * rest_factor + 100 - start_factor * 100 > 100) {
                    rel_range_distance = range_pct * start_factor;
                    rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter];
                    start_factor = 1;
                } else {
                    rel_range_distance = distances[xPct_index + range_counter] * range_pct / 100 * rest_factor;
                    rest_factor = 0;
                }
                if (direction) {
                    abs_distance_counter -= rel_range_distance;
                    if (this.xPct.length + range_counter >= 1) range_counter--;
                } else {
                    abs_distance_counter += rel_range_distance;
                    if (this.xPct.length - range_counter >= 1) range_counter++;
                }
                rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
            }
            return value + abs_distance_counter;
        };
        Spectrum.prototype.toStepping = function(value) {
            value = toStepping(this.xVal, this.xPct, value);
            return value;
        };
        Spectrum.prototype.fromStepping = function(value) {
            return fromStepping(this.xVal, this.xPct, value);
        };
        Spectrum.prototype.getStep = function(value) {
            value = getStep(this.xPct, this.xSteps, this.snap, value);
            return value;
        };
        Spectrum.prototype.getDefaultStep = function(value, isDown, size) {
            var j = getJ(value, this.xPct);
            if (value === 100 || isDown && value === this.xPct[j - 1]) j = Math.max(j - 1, 1);
            return (this.xVal[j] - this.xVal[j - 1]) / size;
        };
        Spectrum.prototype.getNearbySteps = function(value) {
            var j = getJ(value, this.xPct);
            return {
                stepBefore: {
                    startValue: this.xVal[j - 2],
                    step: this.xNumSteps[j - 2],
                    highestStep: this.xHighestCompleteStep[j - 2]
                },
                thisStep: {
                    startValue: this.xVal[j - 1],
                    step: this.xNumSteps[j - 1],
                    highestStep: this.xHighestCompleteStep[j - 1]
                },
                stepAfter: {
                    startValue: this.xVal[j],
                    step: this.xNumSteps[j],
                    highestStep: this.xHighestCompleteStep[j]
                }
            };
        };
        Spectrum.prototype.countStepDecimals = function() {
            var stepDecimals = this.xNumSteps.map(countDecimals);
            return Math.max.apply(null, stepDecimals);
        };
        Spectrum.prototype.hasNoSize = function() {
            return this.xVal[0] === this.xVal[this.xVal.length - 1];
        };
        Spectrum.prototype.convert = function(value) {
            return this.getStep(this.toStepping(value));
        };
        Spectrum.prototype.handleEntryPoint = function(index, value) {
            var percentage;
            if (index === "min") percentage = 0; else if (index === "max") percentage = 100; else percentage = parseFloat(index);
            if (!isNumeric(percentage) || !isNumeric(value[0])) throw new Error("noUiSlider: 'range' value isn't numeric.");
            this.xPct.push(percentage);
            this.xVal.push(value[0]);
            var value1 = Number(value[1]);
            if (!percentage) {
                if (!isNaN(value1)) this.xSteps[0] = value1;
            } else this.xSteps.push(isNaN(value1) ? false : value1);
            this.xHighestCompleteStep.push(0);
        };
        Spectrum.prototype.handleStepPoint = function(i, n) {
            if (!n) return;
            if (this.xVal[i] === this.xVal[i + 1]) {
                this.xSteps[i] = this.xHighestCompleteStep[i] = this.xVal[i];
                return;
            }
            this.xSteps[i] = fromPercentage([ this.xVal[i], this.xVal[i + 1] ], n, 0) / subRangeRatio(this.xPct[i], this.xPct[i + 1]);
            var totalSteps = (this.xVal[i + 1] - this.xVal[i]) / this.xNumSteps[i];
            var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
            var step = this.xVal[i] + this.xNumSteps[i] * highestStep;
            this.xHighestCompleteStep[i] = step;
        };
        return Spectrum;
    }();
    var defaultFormatter = {
        to: function(value) {
            return value === void 0 ? "" : value.toFixed(2);
        },
        from: Number
    };
    var cssClasses = {
        target: "target",
        base: "base",
        origin: "origin",
        handle: "handle",
        handleLower: "handle-lower",
        handleUpper: "handle-upper",
        touchArea: "touch-area",
        horizontal: "horizontal",
        vertical: "vertical",
        background: "background",
        connect: "connect",
        connects: "connects",
        ltr: "ltr",
        rtl: "rtl",
        textDirectionLtr: "txt-dir-ltr",
        textDirectionRtl: "txt-dir-rtl",
        draggable: "draggable",
        drag: "state-drag",
        tap: "state-tap",
        active: "active",
        tooltip: "tooltip",
        pips: "pips",
        pipsHorizontal: "pips-horizontal",
        pipsVertical: "pips-vertical",
        marker: "marker",
        markerHorizontal: "marker-horizontal",
        markerVertical: "marker-vertical",
        markerNormal: "marker-normal",
        markerLarge: "marker-large",
        markerSub: "marker-sub",
        value: "value",
        valueHorizontal: "value-horizontal",
        valueVertical: "value-vertical",
        valueNormal: "value-normal",
        valueLarge: "value-large",
        valueSub: "value-sub"
    };
    var INTERNAL_EVENT_NS = {
        tooltips: ".__tooltips",
        aria: ".__aria"
    };
    function testStep(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'step' is not numeric.");
        parsed.singleStep = entry;
    }
    function testKeyboardPageMultiplier(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
        parsed.keyboardPageMultiplier = entry;
    }
    function testKeyboardMultiplier(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
        parsed.keyboardMultiplier = entry;
    }
    function testKeyboardDefaultStep(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
        parsed.keyboardDefaultStep = entry;
    }
    function testRange(parsed, entry) {
        if (typeof entry !== "object" || Array.isArray(entry)) throw new Error("noUiSlider: 'range' is not an object.");
        if (entry.min === void 0 || entry.max === void 0) throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
        parsed.spectrum = new Spectrum(entry, parsed.snap || false, parsed.singleStep);
    }
    function testStart(parsed, entry) {
        entry = asArray(entry);
        if (!Array.isArray(entry) || !entry.length) throw new Error("noUiSlider: 'start' option is incorrect.");
        parsed.handles = entry.length;
        parsed.start = entry;
    }
    function testSnap(parsed, entry) {
        if (typeof entry !== "boolean") throw new Error("noUiSlider: 'snap' option must be a boolean.");
        parsed.snap = entry;
    }
    function testAnimate(parsed, entry) {
        if (typeof entry !== "boolean") throw new Error("noUiSlider: 'animate' option must be a boolean.");
        parsed.animate = entry;
    }
    function testAnimationDuration(parsed, entry) {
        if (typeof entry !== "number") throw new Error("noUiSlider: 'animationDuration' option must be a number.");
        parsed.animationDuration = entry;
    }
    function testConnect(parsed, entry) {
        var connect = [ false ];
        var i;
        if (entry === "lower") entry = [ true, false ]; else if (entry === "upper") entry = [ false, true ];
        if (entry === true || entry === false) {
            for (i = 1; i < parsed.handles; i++) connect.push(entry);
            connect.push(false);
        } else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) throw new Error("noUiSlider: 'connect' option doesn't match handle count."); else connect = entry;
        parsed.connect = connect;
    }
    function testOrientation(parsed, entry) {
        switch (entry) {
          case "horizontal":
            parsed.ort = 0;
            break;

          case "vertical":
            parsed.ort = 1;
            break;

          default:
            throw new Error("noUiSlider: 'orientation' option is invalid.");
        }
    }
    function testMargin(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'margin' option must be numeric.");
        if (entry === 0) return;
        parsed.margin = parsed.spectrum.getDistance(entry);
    }
    function testLimit(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'limit' option must be numeric.");
        parsed.limit = parsed.spectrum.getDistance(entry);
        if (!parsed.limit || parsed.handles < 2) throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
    }
    function testPadding(parsed, entry) {
        var index;
        if (!isNumeric(entry) && !Array.isArray(entry)) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
        if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
        if (entry === 0) return;
        if (!Array.isArray(entry)) entry = [ entry, entry ];
        parsed.padding = [ parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1]) ];
        for (index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
        var totalPadding = entry[0] + entry[1];
        var firstValue = parsed.spectrum.xVal[0];
        var lastValue = parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1];
        if (totalPadding / (lastValue - firstValue) > 1) throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
    }
    function testDirection(parsed, entry) {
        switch (entry) {
          case "ltr":
            parsed.dir = 0;
            break;

          case "rtl":
            parsed.dir = 1;
            break;

          default:
            throw new Error("noUiSlider: 'direction' option was not recognized.");
        }
    }
    function testBehaviour(parsed, entry) {
        if (typeof entry !== "string") throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
        var tap = entry.indexOf("tap") >= 0;
        var drag = entry.indexOf("drag") >= 0;
        var fixed = entry.indexOf("fixed") >= 0;
        var snap = entry.indexOf("snap") >= 0;
        var hover = entry.indexOf("hover") >= 0;
        var unconstrained = entry.indexOf("unconstrained") >= 0;
        var dragAll = entry.indexOf("drag-all") >= 0;
        var smoothSteps = entry.indexOf("smooth-steps") >= 0;
        if (fixed) {
            if (parsed.handles !== 2) throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
            testMargin(parsed, parsed.start[1] - parsed.start[0]);
        }
        if (unconstrained && (parsed.margin || parsed.limit)) throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
        parsed.events = {
            tap: tap || snap,
            drag,
            dragAll,
            smoothSteps,
            fixed,
            snap,
            hover,
            unconstrained
        };
    }
    function testTooltips(parsed, entry) {
        if (entry === false) return;
        if (entry === true || isValidPartialFormatter(entry)) {
            parsed.tooltips = [];
            for (var i = 0; i < parsed.handles; i++) parsed.tooltips.push(entry);
        } else {
            entry = asArray(entry);
            if (entry.length !== parsed.handles) throw new Error("noUiSlider: must pass a formatter for all handles.");
            entry.forEach((function(formatter) {
                if (typeof formatter !== "boolean" && !isValidPartialFormatter(formatter)) throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
            }));
            parsed.tooltips = entry;
        }
    }
    function testHandleAttributes(parsed, entry) {
        if (entry.length !== parsed.handles) throw new Error("noUiSlider: must pass a attributes for all handles.");
        parsed.handleAttributes = entry;
    }
    function testAriaFormat(parsed, entry) {
        if (!isValidPartialFormatter(entry)) throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
        parsed.ariaFormat = entry;
    }
    function testFormat(parsed, entry) {
        if (!isValidFormatter(entry)) throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
        parsed.format = entry;
    }
    function testKeyboardSupport(parsed, entry) {
        if (typeof entry !== "boolean") throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
        parsed.keyboardSupport = entry;
    }
    function testDocumentElement(parsed, entry) {
        parsed.documentElement = entry;
    }
    function testCssPrefix(parsed, entry) {
        if (typeof entry !== "string" && entry !== false) throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
        parsed.cssPrefix = entry;
    }
    function testCssClasses(parsed, entry) {
        if (typeof entry !== "object") throw new Error("noUiSlider: 'cssClasses' must be an object.");
        if (typeof parsed.cssPrefix === "string") {
            parsed.cssClasses = {};
            Object.keys(entry).forEach((function(key) {
                parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
            }));
        } else parsed.cssClasses = entry;
    }
    function testOptions(options) {
        var parsed = {
            margin: null,
            limit: null,
            padding: null,
            animate: true,
            animationDuration: 300,
            ariaFormat: defaultFormatter,
            format: defaultFormatter
        };
        var tests = {
            step: {
                r: false,
                t: testStep
            },
            keyboardPageMultiplier: {
                r: false,
                t: testKeyboardPageMultiplier
            },
            keyboardMultiplier: {
                r: false,
                t: testKeyboardMultiplier
            },
            keyboardDefaultStep: {
                r: false,
                t: testKeyboardDefaultStep
            },
            start: {
                r: true,
                t: testStart
            },
            connect: {
                r: true,
                t: testConnect
            },
            direction: {
                r: true,
                t: testDirection
            },
            snap: {
                r: false,
                t: testSnap
            },
            animate: {
                r: false,
                t: testAnimate
            },
            animationDuration: {
                r: false,
                t: testAnimationDuration
            },
            range: {
                r: true,
                t: testRange
            },
            orientation: {
                r: false,
                t: testOrientation
            },
            margin: {
                r: false,
                t: testMargin
            },
            limit: {
                r: false,
                t: testLimit
            },
            padding: {
                r: false,
                t: testPadding
            },
            behaviour: {
                r: true,
                t: testBehaviour
            },
            ariaFormat: {
                r: false,
                t: testAriaFormat
            },
            format: {
                r: false,
                t: testFormat
            },
            tooltips: {
                r: false,
                t: testTooltips
            },
            keyboardSupport: {
                r: true,
                t: testKeyboardSupport
            },
            documentElement: {
                r: false,
                t: testDocumentElement
            },
            cssPrefix: {
                r: true,
                t: testCssPrefix
            },
            cssClasses: {
                r: true,
                t: testCssClasses
            },
            handleAttributes: {
                r: false,
                t: testHandleAttributes
            }
        };
        var defaults = {
            connect: false,
            direction: "ltr",
            behaviour: "tap",
            orientation: "horizontal",
            keyboardSupport: true,
            cssPrefix: "noUi-",
            cssClasses,
            keyboardPageMultiplier: 5,
            keyboardMultiplier: 1,
            keyboardDefaultStep: 10
        };
        if (options.format && !options.ariaFormat) options.ariaFormat = options.format;
        Object.keys(tests).forEach((function(name) {
            if (!isSet(options[name]) && defaults[name] === void 0) {
                if (tests[name].r) throw new Error("noUiSlider: '" + name + "' is required.");
                return;
            }
            tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
        }));
        parsed.pips = options.pips;
        var d = document.createElement("div");
        var msPrefix = d.style.msTransform !== void 0;
        var noPrefix = d.style.transform !== void 0;
        parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";
        var styles = [ [ "left", "top" ], [ "right", "bottom" ] ];
        parsed.style = styles[parsed.dir][parsed.ort];
        return parsed;
    }
    function scope(target, options, originalOptions) {
        var actions = getActions();
        var supportsTouchActionNone = getSupportsTouchActionNone();
        var supportsPassive = supportsTouchActionNone && getSupportsPassive();
        var scope_Target = target;
        var scope_Base;
        var scope_Handles;
        var scope_Connects;
        var scope_Pips;
        var scope_Tooltips;
        var scope_Spectrum = options.spectrum;
        var scope_Values = [];
        var scope_Locations = [];
        var scope_HandleNumbers = [];
        var scope_ActiveHandlesCount = 0;
        var scope_Events = {};
        var scope_Document = target.ownerDocument;
        var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
        var scope_Body = scope_Document.body;
        var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;
        function addNodeTo(addTarget, className) {
            var div = scope_Document.createElement("div");
            if (className) addClass(div, className);
            addTarget.appendChild(div);
            return div;
        }
        function addOrigin(base, handleNumber) {
            var origin = addNodeTo(base, options.cssClasses.origin);
            var handle = addNodeTo(origin, options.cssClasses.handle);
            addNodeTo(handle, options.cssClasses.touchArea);
            handle.setAttribute("data-handle", String(handleNumber));
            if (options.keyboardSupport) {
                handle.setAttribute("tabindex", "0");
                handle.addEventListener("keydown", (function(event) {
                    return eventKeydown(event, handleNumber);
                }));
            }
            if (options.handleAttributes !== void 0) {
                var attributes_1 = options.handleAttributes[handleNumber];
                Object.keys(attributes_1).forEach((function(attribute) {
                    handle.setAttribute(attribute, attributes_1[attribute]);
                }));
            }
            handle.setAttribute("role", "slider");
            handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");
            if (handleNumber === 0) addClass(handle, options.cssClasses.handleLower); else if (handleNumber === options.handles - 1) addClass(handle, options.cssClasses.handleUpper);
            origin.handle = handle;
            return origin;
        }
        function addConnect(base, add) {
            if (!add) return false;
            return addNodeTo(base, options.cssClasses.connect);
        }
        function addElements(connectOptions, base) {
            var connectBase = addNodeTo(base, options.cssClasses.connects);
            scope_Handles = [];
            scope_Connects = [];
            scope_Connects.push(addConnect(connectBase, connectOptions[0]));
            for (var i = 0; i < options.handles; i++) {
                scope_Handles.push(addOrigin(base, i));
                scope_HandleNumbers[i] = i;
                scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
            }
        }
        function addSlider(addTarget) {
            addClass(addTarget, options.cssClasses.target);
            if (options.dir === 0) addClass(addTarget, options.cssClasses.ltr); else addClass(addTarget, options.cssClasses.rtl);
            if (options.ort === 0) addClass(addTarget, options.cssClasses.horizontal); else addClass(addTarget, options.cssClasses.vertical);
            var textDirection = getComputedStyle(addTarget).direction;
            if (textDirection === "rtl") addClass(addTarget, options.cssClasses.textDirectionRtl); else addClass(addTarget, options.cssClasses.textDirectionLtr);
            return addNodeTo(addTarget, options.cssClasses.base);
        }
        function addTooltip(handle, handleNumber) {
            if (!options.tooltips || !options.tooltips[handleNumber]) return false;
            return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
        }
        function isSliderDisabled() {
            return scope_Target.hasAttribute("disabled");
        }
        function isHandleDisabled(handleNumber) {
            var handleOrigin = scope_Handles[handleNumber];
            return handleOrigin.hasAttribute("disabled");
        }
        function disable(handleNumber) {
            if (handleNumber !== null && handleNumber !== void 0) {
                scope_Handles[handleNumber].setAttribute("disabled", "");
                scope_Handles[handleNumber].handle.removeAttribute("tabindex");
            } else {
                scope_Target.setAttribute("disabled", "");
                scope_Handles.forEach((function(handle) {
                    handle.handle.removeAttribute("tabindex");
                }));
            }
        }
        function enable(handleNumber) {
            if (handleNumber !== null && handleNumber !== void 0) {
                scope_Handles[handleNumber].removeAttribute("disabled");
                scope_Handles[handleNumber].handle.setAttribute("tabindex", "0");
            } else {
                scope_Target.removeAttribute("disabled");
                scope_Handles.forEach((function(handle) {
                    handle.removeAttribute("disabled");
                    handle.handle.setAttribute("tabindex", "0");
                }));
            }
        }
        function removeTooltips() {
            if (scope_Tooltips) {
                removeEvent("update" + INTERNAL_EVENT_NS.tooltips);
                scope_Tooltips.forEach((function(tooltip) {
                    if (tooltip) removeElement(tooltip);
                }));
                scope_Tooltips = null;
            }
        }
        function tooltips() {
            removeTooltips();
            scope_Tooltips = scope_Handles.map(addTooltip);
            bindEvent("update" + INTERNAL_EVENT_NS.tooltips, (function(values, handleNumber, unencoded) {
                if (!scope_Tooltips || !options.tooltips) return;
                if (scope_Tooltips[handleNumber] === false) return;
                var formattedValue = values[handleNumber];
                if (options.tooltips[handleNumber] !== true) formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
                scope_Tooltips[handleNumber].innerHTML = formattedValue;
            }));
        }
        function aria() {
            removeEvent("update" + INTERNAL_EVENT_NS.aria);
            bindEvent("update" + INTERNAL_EVENT_NS.aria, (function(values, handleNumber, unencoded, tap, positions) {
                scope_HandleNumbers.forEach((function(index) {
                    var handle = scope_Handles[index];
                    var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
                    var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);
                    var now = positions[index];
                    var text = String(options.ariaFormat.to(unencoded[index]));
                    min = scope_Spectrum.fromStepping(min).toFixed(1);
                    max = scope_Spectrum.fromStepping(max).toFixed(1);
                    now = scope_Spectrum.fromStepping(now).toFixed(1);
                    handle.children[0].setAttribute("aria-valuemin", min);
                    handle.children[0].setAttribute("aria-valuemax", max);
                    handle.children[0].setAttribute("aria-valuenow", now);
                    handle.children[0].setAttribute("aria-valuetext", text);
                }));
            }));
        }
        function getGroup(pips) {
            if (pips.mode === PipsMode.Range || pips.mode === PipsMode.Steps) return scope_Spectrum.xVal;
            if (pips.mode === PipsMode.Count) {
                if (pips.values < 2) throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
                var interval = pips.values - 1;
                var spread = 100 / interval;
                var values = [];
                while (interval--) values[interval] = interval * spread;
                values.push(100);
                return mapToRange(values, pips.stepped);
            }
            if (pips.mode === PipsMode.Positions) return mapToRange(pips.values, pips.stepped);
            if (pips.mode === PipsMode.Values) {
                if (pips.stepped) return pips.values.map((function(value) {
                    return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
                }));
                return pips.values;
            }
            return [];
        }
        function mapToRange(values, stepped) {
            return values.map((function(value) {
                return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
            }));
        }
        function generateSpread(pips) {
            function safeIncrement(value, increment) {
                return Number((value + increment).toFixed(7));
            }
            var group = getGroup(pips);
            var indexes = {};
            var firstInRange = scope_Spectrum.xVal[0];
            var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
            var ignoreFirst = false;
            var ignoreLast = false;
            var prevPct = 0;
            group = unique(group.slice().sort((function(a, b) {
                return a - b;
            })));
            if (group[0] !== firstInRange) {
                group.unshift(firstInRange);
                ignoreFirst = true;
            }
            if (group[group.length - 1] !== lastInRange) {
                group.push(lastInRange);
                ignoreLast = true;
            }
            group.forEach((function(current, index) {
                var step;
                var i;
                var q;
                var low = current;
                var high = group[index + 1];
                var newPct;
                var pctDifference;
                var pctPos;
                var type;
                var steps;
                var realSteps;
                var stepSize;
                var isSteps = pips.mode === PipsMode.Steps;
                if (isSteps) step = scope_Spectrum.xNumSteps[index];
                if (!step) step = high - low;
                if (high === void 0) high = low;
                step = Math.max(step, 1e-7);
                for (i = low; i <= high; i = safeIncrement(i, step)) {
                    newPct = scope_Spectrum.toStepping(i);
                    pctDifference = newPct - prevPct;
                    steps = pctDifference / (pips.density || 1);
                    realSteps = Math.round(steps);
                    stepSize = pctDifference / realSteps;
                    for (q = 1; q <= realSteps; q += 1) {
                        pctPos = prevPct + q * stepSize;
                        indexes[pctPos.toFixed(5)] = [ scope_Spectrum.fromStepping(pctPos), 0 ];
                    }
                    type = group.indexOf(i) > -1 ? PipsType.LargeValue : isSteps ? PipsType.SmallValue : PipsType.NoValue;
                    if (!index && ignoreFirst && i !== high) type = 0;
                    if (!(i === high && ignoreLast)) indexes[newPct.toFixed(5)] = [ i, type ];
                    prevPct = newPct;
                }
            }));
            return indexes;
        }
        function addMarking(spread, filterFunc, formatter) {
            var _a, _b;
            var element = scope_Document.createElement("div");
            var valueSizeClasses = (_a = {}, _a[PipsType.None] = "", _a[PipsType.NoValue] = options.cssClasses.valueNormal, 
            _a[PipsType.LargeValue] = options.cssClasses.valueLarge, _a[PipsType.SmallValue] = options.cssClasses.valueSub, 
            _a);
            var markerSizeClasses = (_b = {}, _b[PipsType.None] = "", _b[PipsType.NoValue] = options.cssClasses.markerNormal, 
            _b[PipsType.LargeValue] = options.cssClasses.markerLarge, _b[PipsType.SmallValue] = options.cssClasses.markerSub, 
            _b);
            var valueOrientationClasses = [ options.cssClasses.valueHorizontal, options.cssClasses.valueVertical ];
            var markerOrientationClasses = [ options.cssClasses.markerHorizontal, options.cssClasses.markerVertical ];
            addClass(element, options.cssClasses.pips);
            addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);
            function getClasses(type, source) {
                var a = source === options.cssClasses.value;
                var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
                var sizeClasses = a ? valueSizeClasses : markerSizeClasses;
                return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
            }
            function addSpread(offset, value, type) {
                type = filterFunc ? filterFunc(value, type) : type;
                if (type === PipsType.None) return;
                var node = addNodeTo(element, false);
                node.className = getClasses(type, options.cssClasses.marker);
                node.style[options.style] = offset + "%";
                if (type > PipsType.NoValue) {
                    node = addNodeTo(element, false);
                    node.className = getClasses(type, options.cssClasses.value);
                    node.setAttribute("data-value", String(value));
                    node.style[options.style] = offset + "%";
                    node.innerHTML = String(formatter.to(value));
                }
            }
            Object.keys(spread).forEach((function(offset) {
                addSpread(offset, spread[offset][0], spread[offset][1]);
            }));
            return element;
        }
        function removePips() {
            if (scope_Pips) {
                removeElement(scope_Pips);
                scope_Pips = null;
            }
        }
        function pips(pips) {
            removePips();
            var spread = generateSpread(pips);
            var filter = pips.filter;
            var format = pips.format || {
                to: function(value) {
                    return String(Math.round(value));
                }
            };
            scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));
            return scope_Pips;
        }
        function baseSize() {
            var rect = scope_Base.getBoundingClientRect();
            var alt = "offset" + [ "Width", "Height" ][options.ort];
            return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
        }
        function attachEvent(events, element, callback, data) {
            var method = function(event) {
                var e = fixEvent(event, data.pageOffset, data.target || element);
                if (!e) return false;
                if (isSliderDisabled() && !data.doNotReject) return false;
                if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) return false;
                if (events === actions.start && e.buttons !== void 0 && e.buttons > 1) return false;
                if (data.hover && e.buttons) return false;
                if (!supportsPassive) e.preventDefault();
                e.calcPoint = e.points[options.ort];
                callback(e, data);
                return;
            };
            var methods = [];
            events.split(" ").forEach((function(eventName) {
                element.addEventListener(eventName, method, supportsPassive ? {
                    passive: true
                } : false);
                methods.push([ eventName, method ]);
            }));
            return methods;
        }
        function fixEvent(e, pageOffset, eventTarget) {
            var touch = e.type.indexOf("touch") === 0;
            var mouse = e.type.indexOf("mouse") === 0;
            var pointer = e.type.indexOf("pointer") === 0;
            var x = 0;
            var y = 0;
            if (e.type.indexOf("MSPointer") === 0) pointer = true;
            if (e.type === "mousedown" && !e.buttons && !e.touches) return false;
            if (touch) {
                var isTouchOnTarget = function(checkTouch) {
                    var target = checkTouch.target;
                    return target === eventTarget || eventTarget.contains(target) || e.composed && e.composedPath().shift() === eventTarget;
                };
                if (e.type === "touchstart") {
                    var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);
                    if (targetTouches.length > 1) return false;
                    x = targetTouches[0].pageX;
                    y = targetTouches[0].pageY;
                } else {
                    var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);
                    if (!targetTouch) return false;
                    x = targetTouch.pageX;
                    y = targetTouch.pageY;
                }
            }
            pageOffset = pageOffset || getPageOffset(scope_Document);
            if (mouse || pointer) {
                x = e.clientX + pageOffset.x;
                y = e.clientY + pageOffset.y;
            }
            e.pageOffset = pageOffset;
            e.points = [ x, y ];
            e.cursor = mouse || pointer;
            return e;
        }
        function calcPointToPercentage(calcPoint) {
            var location = calcPoint - offset(scope_Base, options.ort);
            var proposal = location * 100 / baseSize();
            proposal = limit(proposal);
            return options.dir ? 100 - proposal : proposal;
        }
        function getClosestHandle(clickedPosition) {
            var smallestDifference = 100;
            var handleNumber = false;
            scope_Handles.forEach((function(handle, index) {
                if (isHandleDisabled(index)) return;
                var handlePosition = scope_Locations[index];
                var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);
                var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;
                var isCloser = differenceWithThisHandle < smallestDifference;
                var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;
                if (isCloser || isCloserAfter || clickAtEdge) {
                    handleNumber = index;
                    smallestDifference = differenceWithThisHandle;
                }
            }));
            return handleNumber;
        }
        function documentLeave(event, data) {
            if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) eventEnd(event, data);
        }
        function eventMove(event, data) {
            if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) return eventEnd(event, data);
            var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);
            var proposal = movement * 100 / data.baseSize;
            moveHandles(movement > 0, proposal, data.locations, data.handleNumbers, data.connect);
        }
        function eventEnd(event, data) {
            if (data.handle) {
                removeClass(data.handle, options.cssClasses.active);
                scope_ActiveHandlesCount -= 1;
            }
            data.listeners.forEach((function(c) {
                scope_DocumentElement.removeEventListener(c[0], c[1]);
            }));
            if (scope_ActiveHandlesCount === 0) {
                removeClass(scope_Target, options.cssClasses.drag);
                setZindex();
                if (event.cursor) {
                    scope_Body.style.cursor = "";
                    scope_Body.removeEventListener("selectstart", preventDefault);
                }
            }
            if (options.events.smoothSteps) {
                data.handleNumbers.forEach((function(handleNumber) {
                    setHandle(handleNumber, scope_Locations[handleNumber], true, true, false, false);
                }));
                data.handleNumbers.forEach((function(handleNumber) {
                    fireEvent("update", handleNumber);
                }));
            }
            data.handleNumbers.forEach((function(handleNumber) {
                fireEvent("change", handleNumber);
                fireEvent("set", handleNumber);
                fireEvent("end", handleNumber);
            }));
        }
        function eventStart(event, data) {
            if (data.handleNumbers.some(isHandleDisabled)) return;
            var handle;
            if (data.handleNumbers.length === 1) {
                var handleOrigin = scope_Handles[data.handleNumbers[0]];
                handle = handleOrigin.children[0];
                scope_ActiveHandlesCount += 1;
                addClass(handle, options.cssClasses.active);
            }
            event.stopPropagation();
            var listeners = [];
            var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
                target: event.target,
                handle,
                connect: data.connect,
                listeners,
                startCalcPoint: event.calcPoint,
                baseSize: baseSize(),
                pageOffset: event.pageOffset,
                handleNumbers: data.handleNumbers,
                buttonsProperty: event.buttons,
                locations: scope_Locations.slice()
            });
            var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
                target: event.target,
                handle,
                listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers
            });
            var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
                target: event.target,
                handle,
                listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers
            });
            listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));
            if (event.cursor) {
                scope_Body.style.cursor = getComputedStyle(event.target).cursor;
                if (scope_Handles.length > 1) addClass(scope_Target, options.cssClasses.drag);
                scope_Body.addEventListener("selectstart", preventDefault, false);
            }
            data.handleNumbers.forEach((function(handleNumber) {
                fireEvent("start", handleNumber);
            }));
        }
        function eventTap(event) {
            event.stopPropagation();
            var proposal = calcPointToPercentage(event.calcPoint);
            var handleNumber = getClosestHandle(proposal);
            if (handleNumber === false) return;
            if (!options.events.snap) addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            setHandle(handleNumber, proposal, true, true);
            setZindex();
            fireEvent("slide", handleNumber, true);
            fireEvent("update", handleNumber, true);
            if (!options.events.snap) {
                fireEvent("change", handleNumber, true);
                fireEvent("set", handleNumber, true);
            } else eventStart(event, {
                handleNumbers: [ handleNumber ]
            });
        }
        function eventHover(event) {
            var proposal = calcPointToPercentage(event.calcPoint);
            var to = scope_Spectrum.getStep(proposal);
            var value = scope_Spectrum.fromStepping(to);
            Object.keys(scope_Events).forEach((function(targetEvent) {
                if ("hover" === targetEvent.split(".")[0]) scope_Events[targetEvent].forEach((function(callback) {
                    callback.call(scope_Self, value);
                }));
            }));
        }
        function eventKeydown(event, handleNumber) {
            if (isSliderDisabled() || isHandleDisabled(handleNumber)) return false;
            var horizontalKeys = [ "Left", "Right" ];
            var verticalKeys = [ "Down", "Up" ];
            var largeStepKeys = [ "PageDown", "PageUp" ];
            var edgeKeys = [ "Home", "End" ];
            if (options.dir && !options.ort) horizontalKeys.reverse(); else if (options.ort && !options.dir) {
                verticalKeys.reverse();
                largeStepKeys.reverse();
            }
            var key = event.key.replace("Arrow", "");
            var isLargeDown = key === largeStepKeys[0];
            var isLargeUp = key === largeStepKeys[1];
            var isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown;
            var isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp;
            var isMin = key === edgeKeys[0];
            var isMax = key === edgeKeys[1];
            if (!isDown && !isUp && !isMin && !isMax) return true;
            event.preventDefault();
            var to;
            if (isUp || isDown) {
                var direction = isDown ? 0 : 1;
                var steps = getNextStepsForHandle(handleNumber);
                var step = steps[direction];
                if (step === null) return false;
                if (step === false) step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, options.keyboardDefaultStep);
                if (isLargeUp || isLargeDown) step *= options.keyboardPageMultiplier; else step *= options.keyboardMultiplier;
                step = Math.max(step, 1e-7);
                step *= isDown ? -1 : 1;
                to = scope_Values[handleNumber] + step;
            } else if (isMax) to = options.spectrum.xVal[options.spectrum.xVal.length - 1]; else to = options.spectrum.xVal[0];
            setHandle(handleNumber, scope_Spectrum.toStepping(to), true, true);
            fireEvent("slide", handleNumber);
            fireEvent("update", handleNumber);
            fireEvent("change", handleNumber);
            fireEvent("set", handleNumber);
            return false;
        }
        function bindSliderEvents(behaviour) {
            if (!behaviour.fixed) scope_Handles.forEach((function(handle, index) {
                attachEvent(actions.start, handle.children[0], eventStart, {
                    handleNumbers: [ index ]
                });
            }));
            if (behaviour.tap) attachEvent(actions.start, scope_Base, eventTap, {});
            if (behaviour.hover) attachEvent(actions.move, scope_Base, eventHover, {
                hover: true
            });
            if (behaviour.drag) scope_Connects.forEach((function(connect, index) {
                if (connect === false || index === 0 || index === scope_Connects.length - 1) return;
                var handleBefore = scope_Handles[index - 1];
                var handleAfter = scope_Handles[index];
                var eventHolders = [ connect ];
                var handlesToDrag = [ handleBefore, handleAfter ];
                var handleNumbersToDrag = [ index - 1, index ];
                addClass(connect, options.cssClasses.draggable);
                if (behaviour.fixed) {
                    eventHolders.push(handleBefore.children[0]);
                    eventHolders.push(handleAfter.children[0]);
                }
                if (behaviour.dragAll) {
                    handlesToDrag = scope_Handles;
                    handleNumbersToDrag = scope_HandleNumbers;
                }
                eventHolders.forEach((function(eventHolder) {
                    attachEvent(actions.start, eventHolder, eventStart, {
                        handles: handlesToDrag,
                        handleNumbers: handleNumbersToDrag,
                        connect
                    });
                }));
            }));
        }
        function bindEvent(namespacedEvent, callback) {
            scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
            scope_Events[namespacedEvent].push(callback);
            if (namespacedEvent.split(".")[0] === "update") scope_Handles.forEach((function(a, index) {
                fireEvent("update", index);
            }));
        }
        function isInternalNamespace(namespace) {
            return namespace === INTERNAL_EVENT_NS.aria || namespace === INTERNAL_EVENT_NS.tooltips;
        }
        function removeEvent(namespacedEvent) {
            var event = namespacedEvent && namespacedEvent.split(".")[0];
            var namespace = event ? namespacedEvent.substring(event.length) : namespacedEvent;
            Object.keys(scope_Events).forEach((function(bind) {
                var tEvent = bind.split(".")[0];
                var tNamespace = bind.substring(tEvent.length);
                if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) if (!isInternalNamespace(tNamespace) || namespace === tNamespace) delete scope_Events[bind];
            }));
        }
        function fireEvent(eventName, handleNumber, tap) {
            Object.keys(scope_Events).forEach((function(targetEvent) {
                var eventType = targetEvent.split(".")[0];
                if (eventName === eventType) scope_Events[targetEvent].forEach((function(callback) {
                    callback.call(scope_Self, scope_Values.map(options.format.to), handleNumber, scope_Values.slice(), tap || false, scope_Locations.slice(), scope_Self);
                }));
            }));
        }
        function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue, smoothSteps) {
            var distance;
            if (scope_Handles.length > 1 && !options.events.unconstrained) {
                if (lookBackward && handleNumber > 0) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, false);
                    to = Math.max(to, distance);
                }
                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, true);
                    to = Math.min(to, distance);
                }
            }
            if (scope_Handles.length > 1 && options.limit) {
                if (lookBackward && handleNumber > 0) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, false);
                    to = Math.min(to, distance);
                }
                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, true);
                    to = Math.max(to, distance);
                }
            }
            if (options.padding) {
                if (handleNumber === 0) {
                    distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], false);
                    to = Math.max(to, distance);
                }
                if (handleNumber === scope_Handles.length - 1) {
                    distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], true);
                    to = Math.min(to, distance);
                }
            }
            if (!smoothSteps) to = scope_Spectrum.getStep(to);
            to = limit(to);
            if (to === reference[handleNumber] && !getValue) return false;
            return to;
        }
        function inRuleOrder(v, a) {
            var o = options.ort;
            return (o ? a : v) + ", " + (o ? v : a);
        }
        function moveHandles(upward, proposal, locations, handleNumbers, connect) {
            var proposals = locations.slice();
            var firstHandle = handleNumbers[0];
            var smoothSteps = options.events.smoothSteps;
            var b = [ !upward, upward ];
            var f = [ upward, !upward ];
            handleNumbers = handleNumbers.slice();
            if (upward) handleNumbers.reverse();
            if (handleNumbers.length > 1) handleNumbers.forEach((function(handleNumber, o) {
                var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false, smoothSteps);
                if (to === false) proposal = 0; else {
                    proposal = to - proposals[handleNumber];
                    proposals[handleNumber] = to;
                }
            })); else b = f = [ true ];
            var state = false;
            handleNumbers.forEach((function(handleNumber, o) {
                state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o], false, smoothSteps) || state;
            }));
            if (state) {
                handleNumbers.forEach((function(handleNumber) {
                    fireEvent("update", handleNumber);
                    fireEvent("slide", handleNumber);
                }));
                if (connect != void 0) fireEvent("drag", firstHandle);
            }
        }
        function transformDirection(a, b) {
            return options.dir ? 100 - a - b : a;
        }
        function updateHandlePosition(handleNumber, to) {
            scope_Locations[handleNumber] = to;
            scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);
            var translation = transformDirection(to, 0) - scope_DirOffset;
            var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";
            scope_Handles[handleNumber].style[options.transformRule] = translateRule;
            updateConnect(handleNumber);
            updateConnect(handleNumber + 1);
        }
        function setZindex() {
            scope_HandleNumbers.forEach((function(handleNumber) {
                var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
                var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
                scope_Handles[handleNumber].style.zIndex = String(zIndex);
            }));
        }
        function setHandle(handleNumber, to, lookBackward, lookForward, exactInput, smoothSteps) {
            if (!exactInput) to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false, smoothSteps);
            if (to === false) return false;
            updateHandlePosition(handleNumber, to);
            return true;
        }
        function updateConnect(index) {
            if (!scope_Connects[index]) return;
            var l = 0;
            var h = 100;
            if (index !== 0) l = scope_Locations[index - 1];
            if (index !== scope_Connects.length - 1) h = scope_Locations[index];
            var connectWidth = h - l;
            var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
            var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";
            scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
        }
        function resolveToValue(to, handleNumber) {
            if (to === null || to === false || to === void 0) return scope_Locations[handleNumber];
            if (typeof to === "number") to = String(to);
            to = options.format.from(to);
            if (to !== false) to = scope_Spectrum.toStepping(to);
            if (to === false || isNaN(to)) return scope_Locations[handleNumber];
            return to;
        }
        function valueSet(input, fireSetEvent, exactInput) {
            var values = asArray(input);
            var isInit = scope_Locations[0] === void 0;
            fireSetEvent = fireSetEvent === void 0 ? true : fireSetEvent;
            if (options.animate && !isInit) addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            scope_HandleNumbers.forEach((function(handleNumber) {
                setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false, exactInput);
            }));
            var i = scope_HandleNumbers.length === 1 ? 0 : 1;
            if (isInit && scope_Spectrum.hasNoSize()) {
                exactInput = true;
                scope_Locations[0] = 0;
                if (scope_HandleNumbers.length > 1) {
                    var space_1 = 100 / (scope_HandleNumbers.length - 1);
                    scope_HandleNumbers.forEach((function(handleNumber) {
                        scope_Locations[handleNumber] = handleNumber * space_1;
                    }));
                }
            }
            for (;i < scope_HandleNumbers.length; ++i) scope_HandleNumbers.forEach((function(handleNumber) {
                setHandle(handleNumber, scope_Locations[handleNumber], true, true, exactInput);
            }));
            setZindex();
            scope_HandleNumbers.forEach((function(handleNumber) {
                fireEvent("update", handleNumber);
                if (values[handleNumber] !== null && fireSetEvent) fireEvent("set", handleNumber);
            }));
        }
        function valueReset(fireSetEvent) {
            valueSet(options.start, fireSetEvent);
        }
        function valueSetHandle(handleNumber, value, fireSetEvent, exactInput) {
            handleNumber = Number(handleNumber);
            if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) throw new Error("noUiSlider: invalid handle number, got: " + handleNumber);
            setHandle(handleNumber, resolveToValue(value, handleNumber), true, true, exactInput);
            fireEvent("update", handleNumber);
            if (fireSetEvent) fireEvent("set", handleNumber);
        }
        function valueGet(unencoded) {
            if (unencoded === void 0) unencoded = false;
            if (unencoded) return scope_Values.length === 1 ? scope_Values[0] : scope_Values.slice(0);
            var values = scope_Values.map(options.format.to);
            if (values.length === 1) return values[0];
            return values;
        }
        function destroy() {
            removeEvent(INTERNAL_EVENT_NS.aria);
            removeEvent(INTERNAL_EVENT_NS.tooltips);
            Object.keys(options.cssClasses).forEach((function(key) {
                removeClass(scope_Target, options.cssClasses[key]);
            }));
            while (scope_Target.firstChild) scope_Target.removeChild(scope_Target.firstChild);
            delete scope_Target.noUiSlider;
        }
        function getNextStepsForHandle(handleNumber) {
            var location = scope_Locations[handleNumber];
            var nearbySteps = scope_Spectrum.getNearbySteps(location);
            var value = scope_Values[handleNumber];
            var increment = nearbySteps.thisStep.step;
            var decrement = null;
            if (options.snap) return [ value - nearbySteps.stepBefore.startValue || null, nearbySteps.stepAfter.startValue - value || null ];
            if (increment !== false) if (value + increment > nearbySteps.stepAfter.startValue) increment = nearbySteps.stepAfter.startValue - value;
            if (value > nearbySteps.thisStep.startValue) decrement = nearbySteps.thisStep.step; else if (nearbySteps.stepBefore.step === false) decrement = false; else decrement = value - nearbySteps.stepBefore.highestStep;
            if (location === 100) increment = null; else if (location === 0) decrement = null;
            var stepDecimals = scope_Spectrum.countStepDecimals();
            if (increment !== null && increment !== false) increment = Number(increment.toFixed(stepDecimals));
            if (decrement !== null && decrement !== false) decrement = Number(decrement.toFixed(stepDecimals));
            return [ decrement, increment ];
        }
        function getNextSteps() {
            return scope_HandleNumbers.map(getNextStepsForHandle);
        }
        function updateOptions(optionsToUpdate, fireSetEvent) {
            var v = valueGet();
            var updateAble = [ "margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips" ];
            updateAble.forEach((function(name) {
                if (optionsToUpdate[name] !== void 0) originalOptions[name] = optionsToUpdate[name];
            }));
            var newOptions = testOptions(originalOptions);
            updateAble.forEach((function(name) {
                if (optionsToUpdate[name] !== void 0) options[name] = newOptions[name];
            }));
            scope_Spectrum = newOptions.spectrum;
            options.margin = newOptions.margin;
            options.limit = newOptions.limit;
            options.padding = newOptions.padding;
            if (options.pips) pips(options.pips); else removePips();
            if (options.tooltips) tooltips(); else removeTooltips();
            scope_Locations = [];
            valueSet(isSet(optionsToUpdate.start) ? optionsToUpdate.start : v, fireSetEvent);
        }
        function setupSlider() {
            scope_Base = addSlider(scope_Target);
            addElements(options.connect, scope_Base);
            bindSliderEvents(options.events);
            valueSet(options.start);
            if (options.pips) pips(options.pips);
            if (options.tooltips) tooltips();
            aria();
        }
        setupSlider();
        var scope_Self = {
            destroy,
            steps: getNextSteps,
            on: bindEvent,
            off: removeEvent,
            get: valueGet,
            set: valueSet,
            setHandle: valueSetHandle,
            reset: valueReset,
            disable,
            enable,
            __moveHandles: function(upward, proposal, handleNumbers) {
                moveHandles(upward, proposal, scope_Locations, handleNumbers);
            },
            options: originalOptions,
            updateOptions,
            target: scope_Target,
            removePips,
            removeTooltips,
            getPositions: function() {
                return scope_Locations.slice();
            },
            getTooltips: function() {
                return scope_Tooltips;
            },
            getOrigins: function() {
                return scope_Handles;
            },
            pips
        };
        return scope_Self;
    }
    function initialize(target, originalOptions) {
        if (!target || !target.nodeName) throw new Error("noUiSlider: create requires a single element, got: " + target);
        if (target.noUiSlider) throw new Error("noUiSlider: Slider was already initialized.");
        var options = testOptions(originalOptions);
        var api = scope(target, options, originalOptions);
        target.noUiSlider = api;
        return api;
    }
    function rangeInit(id) {
        const priceSlider = document.getElementById(id);
        if (priceSlider) return initialize(priceSlider, {
            start: 45,
            connect: [ true, false ],
            range: {
                min: [ 10 ],
                max: [ 80 ]
            }
        });
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class Vertex {
        constructor(value, id = 0) {
            this.id = id;
            this.value = value;
            this.inEdges = new Set;
            this.outEdges = new Set;
        }
        addEdge(toVertex) {
            if (!this.outEdges.has(toVertex)) this.outEdges.add(toVertex);
            if (!toVertex.inEdges.has(this)) toVertex.inEdges.add(this);
        }
        isIncidentTo(vertex) {
            return this.outEdges.has(vertex);
        }
        getAllNeighbors() {
            return Array.from(this.getInEdges()).concat(Array.from(this.getOutEdges()));
        }
        getInEdges() {
            return this.inEdges.values();
        }
        getOutEdges() {
            return this.outEdges.values();
        }
        getInDegree() {
            return this.inEdges.size;
        }
        getOutDegree() {
            return this.outEdges.size;
        }
        getDegree() {
            return this.getInDegree() + this.getOutDegree();
        }
        clone() {
            const clonedVertex = new Vertex(this.value, this.id);
            return clonedVertex;
        }
    }
    class Graph {
        constructor(isDirected = false) {
            this.n = 0;
            this.isDirected = isDirected;
            this.adjacencyList = new Map;
            this.isEulerian = -3;
        }
        getEilerPath() {
            this.isEulerian = this.isEulerianOrSemiEulerian();
            if (this.isEulerian == -1 || this.isEulerian == -2) return this.isEulerian;
            let graphClone = this.clone();
            let startVertex = graphClone.getStartingVertex();
            let path = graphClone.eulerianPath(startVertex);
            return path.map((v => this.adjacencyList.get(v.value)));
        }
        getStartingVertex() {
            const vertices = Array.from(this.adjacencyList.values());
            if (vertices.length === 0) return null;
            if (this.isEulerian === 0) return vertices[0];
            let start = vertices[0];
            for (const vertex of vertices) if (this.isDirected) {
                const degree = vertex.getOutDegree() - vertex.getInDegree();
                if (degree === 1) start = vertex;
            } else {
                const degree = vertex.getOutDegree();
                if (degree % 2 !== 0) start = vertex;
            }
            return start.value;
        }
        isEulerianOrSemiEulerian() {
            const vertices = Array.from(this.adjacencyList.keys());
            if (vertices.length === 0) return -1;
            if (!this.isGraphConnected()) return -2;
            let oddDegreeCount = 0, oddOutDegreeCount = 0, oddInDegreeCount = 0;
            for (const vertex of vertices) if (this.isDirected) {
                const degree = this.adjacencyList.get(vertex).getOutDegree() - this.adjacencyList.get(vertex).getInDegree();
                if (degree === 1) oddOutDegreeCount++; else if (degree === -1) oddInDegreeCount++; else if (Math.abs(degree) > 1) return -1;
            } else {
                const degree = this.adjacencyList.get(vertex).getOutDegree();
                if (degree % 2 !== 0) oddDegreeCount++;
            }
            if (this.isDirected) {
                if (oddInDegreeCount == 0 && oddOutDegreeCount == 0) return 0;
                if (oddInDegreeCount == 1 && oddOutDegreeCount == 1) return 1;
                return -1;
            }
            if (oddDegreeCount === 0) return 0; else if (oddDegreeCount === 2) return 1; else return -1;
        }
        isGraphConnected=() => {
            const vertices = Array.from(this.adjacencyList.values());
            if (vertices.length === 0) return false;
            const visited = new Set;
            const queue = [];
            const startVertex = vertices[0];
            queue.push(startVertex);
            visited.add(startVertex);
            while (queue.length > 0) {
                const currentVertex = queue.shift();
                for (const neighbor of currentVertex.getAllNeighbors()) if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
            return visited.size === vertices.length;
        };
        eulerianPath(startingVertexValue) {
            const stack = [];
            const circuit = [];
            stack.push(this.adjacencyList.get(startingVertexValue));
            while (stack.length > 0) {
                const currentVertex = stack[stack.length - 1];
                if (currentVertex.outEdges.size > 0) {
                    const nextVertex = currentVertex.outEdges.values().next().value;
                    stack.push(nextVertex);
                    this.removeEdge(currentVertex, nextVertex);
                } else circuit.push(stack.pop());
            }
            return circuit.reverse();
        }
        addEdge(vertex1, vertex2) {
            const adjList = this.adjacencyList;
            let v1 = null, v2 = null;
            if (!adjList.has(vertex1)) {
                v1 = new Vertex(vertex1, this.n);
                this.n++;
                adjList.set(vertex1, v1);
            } else v1 = adjList.get(vertex1);
            if (!adjList.has(vertex2)) {
                v2 = new Vertex(vertex2, this.n);
                this.n++;
                adjList.set(vertex2, v2);
            } else v2 = adjList.get(vertex2);
            v1.addEdge(v2);
            if (!this.isDirected) v2.addEdge(v1);
        }
        removeEdge(vertex1, vertex2) {
            vertex1.outEdges.delete(vertex2);
            vertex2.inEdges.delete(vertex1);
            if (!this.isDirected) {
                vertex2.outEdges.delete(vertex1);
                vertex1.inEdges.delete(vertex2);
            }
        }
        clone() {
            const clonedGraph = new Graph(this.isDirected);
            for (const vertex of this.adjacencyList.values()) for (const neighbor of vertex.getOutEdges()) clonedGraph.addEdge(vertex.value, neighbor.value);
            return clonedGraph;
        }
        switchDirected() {
            this.isDirected = !this.isDirected;
        }
        clear() {
            this.n = 0;
            this.adjacencyList = new Map;
        }
        build(s) {
            if (!s.trim()) {
                alert("Input is empty!");
                return;
            }
            const re = /(\d+|[^,\s\n]+)-(\d+|[^,\s\n]+)(?:,(?: |\n)?(\d+|[^,\s\n]+)-(\d+|[^,\s\n]+))*/g;
            if (!re.test(s)) {
                alert("Wrong graph code!");
                return;
            }
            this.clear();
            const regex = /(\d+|[^,\s\n]+)-(\d+|[^,\s\n]+)/g;
            let vertices = Array.from(s.matchAll(regex), (match => match[0]));
            let a, b, e;
            for (var i = 0; i < vertices.length; i++) {
                e = vertices[i].split("-");
                a = e[0];
                b = e[1];
                this.addEdge(a, b);
            }
        }
    }
    class PointToDraw {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.f = new Point(0, 0, 0);
            this.v = new Point(0, 0, 0);
            this.px = 0;
            this.py = 0;
        }
    }
    function Point(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Point.prototype.distance = function(a, b) {
        return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y) + (b.z - a.z) * (b.z - a.z));
    };
    Point.prototype.distance2D = function(a, b) {
        return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
    };
    const colors = [ "#E30613", "#008ef1", "#f1b900", "#4b9700", "#970051", "#69058b", "#4f2e00", "#000547" ];
    class GraphTo2D {
        constructor() {
            this.vertices = [];
            this.vcolors = [];
            this.repulsion = 900;
            this.attraction = .045;
            this.damping = .9;
            this.stable = false;
            this.physics = true;
            this.colored = false;
            this.is3D = false;
            this.dragged = null;
            this.graph = new Graph;
            var min = Number.NEGATIVE_INFINITY;
            var max = Number.POSITIVE_INFINITY;
            this.bounds = {
                l: min,
                r: max,
                u: min,
                d: max,
                f: min,
                b: max
            };
        }
        makeGraph(s) {
            this.graph.build(s);
            this.vertices = [];
            this.colored = false;
            var rx, ry, rz;
            for (var i = 0; i < this.graph.n; i++) {
                rx = -100 + Math.random() * 200;
                ry = -100 + Math.random() * 200;
                rz = -100 + Math.random() * 200;
                this.vertices.push(new PointToDraw(rx, ry, this.is3D ? rz : 0));
            }
            this.stable = false;
        }
        setBounds(lt, rt, up, dn, ft, bk) {
            this.bounds.l = lt;
            this.bounds.r = rt;
            this.bounds.u = up;
            this.bounds.d = dn;
            this.bounds.f = ft;
            this.bounds.b = bk;
        }
        minColoring() {
            const n = this.graph.n;
            this.colored = !this.colored;
            if (!this.colored) {
                for (let i = 0; i < n; i++) this.vcolors[i] = 0;
                return this.colored;
            }
            this.vcolors = [];
            for (let i = 0; i < n; i++) this.vcolors[i] = -1;
            for (const key of this.graph.adjacencyList.keys()) this.colorKthVertex(key);
            return this.colored;
        }
        colorKthVertex(k) {
            const g = this.graph;
            let kVertex = g.adjacencyList.get(k);
            if (this.vcolors[kVertex.id] > -1) return;
            let nb = kVertex.getAllNeighbors();
            let cols = this.vcolors;
            let i, col = 0;
            let cbu = false;
            while (!cbu) {
                cbu = true;
                for (i = 0; i < nb.length; i++) if (cols[nb[i].id] == col) {
                    cbu = false;
                    ++col;
                    break;
                }
            }
            cols[kVertex.id] = col;
            for (i = 0; i < nb.length; i++) this.colorKthVertex(nb[i].value);
        }
        computePhysics() {
            if (this.stable) return this.stable;
            if (!this.physics) {
                this.stable = true;
                return false;
            }
            let v_point, u_point, dsq;
            for (const v of this.graph.adjacencyList.values()) {
                const v_id = v.id;
                v_point = this.vertices[v_id];
                v_point.f.x = v_point.f.y = v_point.f.z = 0;
                for (const u of this.graph.adjacencyList.values()) {
                    const u_id = u.id;
                    if (v_id == u_id) continue;
                    u_point = this.vertices[u_id];
                    dsq = (v_point.x - u_point.x) * (v_point.x - u_point.x) + (v_point.y - u_point.y) * (v_point.y - u_point.y) + (v_point.z - u_point.z) * (v_point.z - u_point.z);
                    if (dsq == 0) dsq = .001;
                    let coul = this.repulsion / dsq;
                    v_point.f.x += coul * (v_point.x - u_point.x);
                    v_point.f.y += coul * (v_point.y - u_point.y);
                    v_point.f.z += coul * (v_point.z - u_point.z);
                }
            }
            for (const v of this.graph.adjacencyList.values()) {
                const v_id = v.id;
                v_point = this.vertices[v_id];
                for (const u of v.getOutEdges()) {
                    const u_id = u.id;
                    u_point = this.vertices[u_id];
                    v_point.f.x += this.attraction * (u_point.x - v_point.x);
                    v_point.f.y += this.attraction * (u_point.y - v_point.y);
                    v_point.f.z += this.attraction * (u_point.z - v_point.z);
                    u_point.f.x += this.attraction * (v_point.x - u_point.x);
                    u_point.f.y += this.attraction * (v_point.y - u_point.y);
                    u_point.f.z += this.attraction * (v_point.z - u_point.z);
                }
            }
            let dis = 0;
            let bs = this.bounds;
            for (let i = 0; i < this.graph.n; i++) {
                let v = this.vertices[i];
                if (v == this.dragged) continue;
                v.v.x = (v.v.x + v.f.x) * this.damping;
                v.v.y = (v.v.y + v.f.y) * this.damping;
                v.v.z = (v.v.z + v.f.z) * this.damping;
                dis += Math.abs(v.v.x) + Math.abs(v.v.y) + Math.abs(v.v.z);
                v.x += v.v.x;
                v.y += v.v.y;
                v.z += v.v.z;
                v.x = this.clamp(bs.l, v.x, bs.r);
                v.y = this.clamp(bs.u, v.y, bs.d);
                v.z = this.clamp(bs.f, v.z, bs.b);
            }
            this.stable = dis < .5;
            return this.stable && this.dragged == null;
        }
        clamp(l, x, r) {
            if (x < l) return l;
            if (x > r) return r;
            return x;
        }
        setDragged(x, y, r) {
            var u = new Point(x, y, 0);
            var v;
            for (let i = 0; i < this.graph.n; i++) {
                v = this.vertices[i];
                if (u.distance2D(u, v) < r) {
                    this.dragged = v;
                    this.stable = false;
                    break;
                }
            }
        }
        moveDragged(x, y) {
            if (!this.dragged) return;
            this.dragged.x = x;
            this.dragged.y = y;
            this.stable = false;
        }
        stopDragging() {
            this.dragged = null;
        }
        switchPhysics() {
            this.physics = !this.physics;
            if (this.physics) this.stable = false;
        }
        switch3D() {
            this.is3D = !this.is3D;
            if (this.is3D) {
                for (let i = 0; i < this.graph.n; i++) this.vertices[i].z = -80 + Math.random() * 160;
                this.stable = false;
            } else {
                for (let i = 0; i < this.graph.n; i++) {
                    this.vertices[i].z = 0;
                    this.vertices[i].f.z = 0;
                    this.vertices[i].v.z = 0;
                }
                this.stable = false;
            }
        }
    }
    class Controller {
        constructor(id) {
            this.svg = getEl(id);
            this.physicsCheck = getEl("physicsCHK");
            this.labelCheck = getEl("labelCHK");
            this.colorCheck = getEl("colorCHK");
            this.directedCheck = getEl("directedCHK");
            this.is3dCheck = getEl("is3dCHK");
            this.drawGraphButton = getEl("drawBTN");
            this.showResultButton = getEl("resultBTN");
            this.viewPathBTN = getEl("viewPathBTN");
            this.inputField = getEl("inputTXT");
            this.outputField = getEl("outputTXT");
            this.repultionRNG = rangeInit("repultionRNG");
            this.attractionRNG = rangeInit("attractionRNG");
            this.animControls = getEl("animation-controls");
            this.graph2D = new GraphTo2D;
            this.isShowingPath = false;
            const svg = this.svg;
            svg.addEventListener("mousedown", this.onMD, false);
            svg.addEventListener("mousemove", this.onMM, false);
            svg.addEventListener("mouseup", this.onMU, false);
            svg.addEventListener("touchmove", this.blck, false);
            svg.addEventListener("touchstart", this.onMD, false);
            svg.addEventListener("touchend", this.onMU, false);
            svg.addEventListener("touchmove", this.onMM, false);
            this.initAnimContols();
            this.onEF = this.onEF.bind(this);
            window.addEventListener("resize", this.onRS, false);
            this.physicsCheck.addEventListener("click", this.chPhysics, false);
            this.labelCheck.addEventListener("click", this.chLabels, false);
            this.colorCheck.addEventListener("click", this.minCol, false);
            this.directedCheck.addEventListener("click", this.switchDirectedGraph, false);
            this.is3dCheck.addEventListener("click", (e => this.ch3D(e)), false);
            this.drawGraphButton.onclick = () => this.rebuildURL();
            this.showResultButton.onclick = () => this.showResult();
            this.repultionRNG.on("change", (value => this.repChange(value)));
            this.attractionRNG.on("change", (value => this.attChange(value)));
            this.viewPathBTN.addEventListener("click", (e => {
                this.playBTN.textContent = "Stop animation";
                this.playBTN.dataset.role = "Stop";
                this.animControls.classList.remove("hidden");
                this.clearHighLight();
                this.showPath();
            }));
            this.c3d = {
                camz: 900,
                ang: 0,
                d: .015
            };
            this.circs = [];
            this.lines = [];
            this.labls = [];
            this.timerShowPath = null;
            window.onhashchange = () => this.rebuild();
            this.svgTopOffset = this.svg.getBoundingClientRect().y;
            this.svgLeftOffset = this.svg.getBoundingClientRect().x;
            window.addEventListener("scroll", (() => {
                this.svgTopOffset = this.svg.getBoundingClientRect().y + window.scrollY;
                this.svgLeftOffset = this.svg.getBoundingClientRect().x + window.scrollX;
            }));
            this.w = this.svg.getBoundingClientRect().width;
            this.h = this.svg.getBoundingClientRect().height;
            this.hw = this.w / 2;
            this.hh = this.h / 2;
            this.labels = false;
            this.rebuild();
            this.onEF();
        }
        initAnimContols() {
            this.playBTN = this.animControls.querySelector("#playBTN");
            this.playBTN.addEventListener("click", (e => this.playAnimBTNClick()));
        }
        playAnimBTNClick() {
            this.playBTN.dataset.role;
            this.playBTN.textContent = "Stop animation";
            this.playBTN.dataset.role = "Play";
            if (this.timerShowPath !== null) {
                clearTimeout(this.timerShowPath);
                this.timerShowPath = null;
            }
        }
        showNextVertex=currentVertex => {
            if (currentVertex.classList.contains("highlight")) this.unHighlightVertexAndPrevEdge(currentVertex); else this.highlightVertexAndPrevEdge(currentVertex);
        };
        clearHighLight() {
            if (this.timerShowPath !== null) {
                clearTimeout(this.timerShowPath);
                this.timerShowPath = null;
            }
            this.lines.forEach((l => l.classList.remove("highlight")));
            this.circs.forEach((c => c.classList.remove("highlight")));
            let path = this.outputField.querySelector(".path").childNodes;
            path.forEach((p => p.classList.remove("highlight")));
        }
        showPath=() => {
            this.animationSpeed = 500;
            this.isShowingPath = true;
            let path = this.outputField.querySelector(".path").childNodes;
            let i = 0, reverse = 1;
            let funcShowNexVertex = this.showNextVertex;
            function run(animationSpeed) {
                let currentVertex = path[i];
                i += reverse;
                if (i === path.length) {
                    reverse = -1;
                    i += reverse;
                } else if (i === -1) {
                    reverse = 1;
                    i += reverse;
                }
                if (this.timerShowPath === null) return;
                funcShowNexVertex(currentVertex);
                if (this.timerShowPath === null) return;
                this.timerShowPath = setTimeout(run, animationSpeed, animationSpeed);
            }
            run = run.bind(this);
            this.timerShowPath = setTimeout(run, this.animationSpeed, this.animationSpeed);
        };
        showResult=e => {
            const output = this.outputField;
            const resultText = output.querySelector("#resultText");
            const graph = this.graph2D.graph;
            output.innerHTML = "";
            output.insertAdjacentElement("afterbegin", resultText);
            if (graph.adjacencyList.size < 2) {
                resultText.textContent = "This graph is empty. The graph must have at least two vertices incident to one another";
                return;
            }
            let result = this.graph2D.graph.getEilerPath();
            if (graph.isEulerian === -2) {
                resultText.textContent = "This graph isn`t connected. The graph must be connected";
                return;
            }
            if (graph.isEulerian === -1) {
                resultText.textContent = "This graph isn`t eulerian";
                output.insertAdjacentHTML("beforeend", `<ul class='hints'>${graph.isDirected ? `<li>There should be at most one vertices with one more outgoing edge than incoming edges</li>\n\t\t\t\t\t<li>There should be at most one vertices with one more incoming edge than outgoing edges</li>\n\t\t\t\t\t<li>All other vertices should have an equal number of incoming and outgoing edges</li>` : `<li>There are zero or two vertices with an odd degree</li>\n\t\t\t\t\t<li>All other vertices should have an even degree</li>`}</ul>`);
                return;
            }
            resultText.textContent = "The graph has eulerian " + (result[0].value === result[result.length - 1].value ? "cicle:" : "path:");
            const listOfPath = document.createElement("ul");
            listOfPath.className = "path";
            result.forEach((vertex => {
                const elementOfPath = document.createElement("li");
                elementOfPath.textContent = vertex.value;
                elementOfPath.dataVertex = vertex;
                listOfPath.insertAdjacentElement("beforeend", elementOfPath);
            }));
            this.viewPathBTN.removeAttribute("disabled");
            listOfPath.addEventListener("click", (e => this.onClickElementsOfPath(e)));
            output.insertAdjacentElement("beforeend", listOfPath);
        };
        onMD=e => {
            this.graph2D.setDragged(mouseX(e) - this.hw - this.svgLeftOffset, mouseY(e) - this.hh - this.svgTopOffset, 30);
        };
        onMM=e => {
            this.graph2D.moveDragged(mouseX(e) - this.hw - this.svgLeftOffset, mouseY(e) - this.hh - this.svgTopOffset);
        };
        onMU=e => {
            this.graph2D.stopDragging();
        };
        onClickElementsOfPath=e => {
            if (e.target.tagName != "LI" || this.isShowingPath) return;
            if (e.target.classList.contains("highlight")) this.unHighlightVertexAndPrevEdge(e.target); else this.highlightVertexAndPrevEdge(e.target);
        };
        highlightVertexAndPrevEdge(target) {
            const vertex = target.dataVertex;
            const circleSVG = this.circs.find((u => u.dataVertex.value === vertex.value));
            circleSVG.classList.add("highlight");
            circleSVG.dataAmountOfUse++;
            target.classList.add("highlight");
            const previousVertex = target.previousElementSibling;
            if (previousVertex) {
                const fromVertex = previousVertex.dataVertex;
                const edgeLine = this.lines.find((u => u.dataVertexFrom.value === fromVertex.value && u.dataVertexTo.value === vertex.value));
                edgeLine.classList.add("highlight");
                if (!this.graph2D.graph.isDirected) {
                    const backEdgeLine = this.lines.find((u => u.dataVertexFrom.value === vertex.value && u.dataVertexTo.value === fromVertex.value));
                    backEdgeLine.classList.add("highlight");
                }
            }
        }
        unHighlightVertexAndPrevEdge(target) {
            const vertex = target.dataVertex;
            const circleSVG = this.circs.find((u => u.dataVertex.value === vertex.value));
            circleSVG.dataAmountOfUse--;
            if (circleSVG.dataAmountOfUse === 0) circleSVG.classList.remove("highlight");
            target.classList.remove("highlight");
            const previousVertex = target.previousElementSibling;
            if (previousVertex) {
                const fromVertex = previousVertex.dataVertex;
                const edgeLine = this.lines.find((u => u.dataVertexFrom.value === fromVertex.value && u.dataVertexTo.value === vertex.value));
                edgeLine.classList.remove("highlight");
                if (!this.graph2D.graph.isDirected) {
                    const backEdgeLine = this.lines.find((u => u.dataVertexFrom.value === vertex.value && u.dataVertexTo.value === fromVertex.value));
                    backEdgeLine.classList.remove("highlight");
                }
            }
        }
        setOutputPlaceHolder() {
            const output = this.outputField;
            const resultText = output.querySelector("#resultText");
            output.innerHTML = "";
            resultText.textContent = resultText.dataset.placeholder;
            output.insertAdjacentElement("afterbegin", resultText);
        }
        blck(e) {
            e.preventDefault();
        }
        onRS=e => {
            this.w = this.svg.getBoundingClientRect().width;
            this.hw = this.w / 2;
            this.redraw();
        };
        chPhysics=e => {
            this.changePhysics();
        };
        changePhysics() {
            this.graph2D.switchPhysics();
            this.physicsCheck.checked = this.graph2D.physics;
        }
        ch3D=e => {
            this.change3D();
        };
        change3D=() => {
            this.graph2D.switch3D();
            this.is3dCheck.checked = this.graph2D.is3D;
        };
        repChange=value => {
            this.graph2D.repulsion = 20 * value;
            this.graph2D.stable = false;
        };
        attChange=value => {
            this.graph2D.attraction = .001 * value;
            this.graph2D.stable = false;
        };
        switchDirectedGraph=() => {
            this.graph2D.graph.switchDirected();
            this.graph2D.stable = false;
            this._rebuildGraph();
        };
        chLabels=e => {
            this.changeLabels();
        };
        changeLabels() {
            this.labels = !this.labels;
            for (var i = 0; i < this.labls.length; i++) this.labls[i].style.visibility = this.labels ? "visible" : "hidden";
            this.labelCheck.checked = this.labels;
        }
        minCol=e => {
            this.minColoring();
        };
        minColoring=e => {
            this.colorCheck.checked = this.graph2D.minColoring();
            for (var i = 0; i < this.circs.length; i++) this.circs[i].setAttribute("style", this.colorCheck.checked ? `fill:${colors[this.graph2D.vcolors[i] % colors.length]};` : "");
        };
        rebuild() {
            this._rebuildGraph.call(this);
        }
        _rebuildGraph(gr) {
            gr = window.location.href.slice(window.location.href.indexOf("#") + 1);
            if (window.location.href.indexOf("#") < 1 || gr == "") {
                gr = "1-2,2-3,3-1";
                window.location = "#" + gr;
            }
            this.inputField.value = gr.replace(/,/g, "\n");
            this.colorCheck.checked = false;
            this.isShowingPath = false;
            this.setOutputPlaceHolder();
            this.viewPathBTN.setAttribute("disabled", "");
            this.animControls.classList.add("hidden");
            if (this.timerShowPath !== null) {
                clearTimeout(this.timerShowPath);
                this.timerShowPath = null;
            }
            this.graph2D.makeGraph(gr);
            var svg = this.svg;
            for (var i = 0; i < this.circs.length; i++) svg.removeChild(this.circs[i]);
            for (i = 0; i < this.lines.length; i++) svg.removeChild(this.lines[i]);
            for (i = 0; i < this.labls.length; i++) svg.removeChild(this.labls[i]);
            this.circs = [];
            this.lines = [];
            this.labls = [];
            for (const vertex of this.graph2D.graph.adjacencyList.values()) {
                const neighbors = Array.from(vertex.getOutEdges());
                if (neighbors) neighbors.forEach((neighbor => {
                    var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    l.dataVertexFrom = vertex;
                    l.dataVertexTo = neighbor;
                    svg.appendChild(l);
                    this.lines.push(l);
                }));
            }
            for (const vertex of this.graph2D.graph.adjacencyList.values()) {
                var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                c.dataVertex = vertex;
                c.dataAmountOfUse = 0;
                svg.appendChild(c);
                this.circs.push(c);
                var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
                t.style.visibility = this.labels ? "visible" : "hidden";
                t.textContent = vertex.value;
                t.dataVertex = vertex;
                svg.appendChild(t);
                this.labls.push(t);
            }
            this.redraw();
        }
        redraw() {
            var c3d = this.c3d;
            var g = this.graph2D;
            c3d.ang += c3d.d;
            var sn = Math.sin(this.c3d.ang);
            var cs = Math.cos(this.c3d.ang);
            for (var i = 0; i < g.graph.n; i++) {
                var nx, ny, nz;
                var v = g.vertices[i];
                if (g.is3D) {
                    nx = cs * v.x - sn * v.z;
                    nz = sn * v.x + cs * v.z;
                    ny = v.y;
                } else {
                    nx = v.x;
                    ny = v.y;
                    nz = v.z;
                }
                v.px = c3d.camz * nx / (c3d.camz - nz);
                v.py = c3d.camz * ny / (c3d.camz - nz);
                v.pz = nz;
            }
            const hw = this.hw, hh = this.hh;
            let iw, curLine = 0;
            for (const vertex of g.graph.adjacencyList.values()) {
                const u = g.vertices[vertex.id];
                const x = u.px + hw;
                const y = u.py + hh;
                iw = c3d.camz * 13 / (c3d.camz - u.pz);
                this.circs[vertex.id].setAttribute("cx", x);
                this.circs[vertex.id].setAttribute("cy", y);
                this.circs[vertex.id].setAttribute("r", Math.max(0, iw));
                this.labls[vertex.id].setAttribute("x", x - (i > 8 ? 10 : 5));
                this.labls[vertex.id].setAttribute("y", y + 6);
                const neighbors = Array.from(vertex.getOutEdges());
                if (neighbors) neighbors.forEach((neighbor => {
                    const v = g.vertices[neighbor.id];
                    let x1 = x;
                    let y1 = y;
                    let x2 = v.px + hw;
                    let y2 = v.py + hh;
                    iw = c3d.camz * 13 / (c3d.camz - v.pz);
                    this.circs[neighbor.id].setAttribute("cx", x2);
                    this.circs[neighbor.id].setAttribute("cy", y2);
                    this.circs[neighbor.id].setAttribute("r", Math.max(0, iw));
                    this.labls[neighbor.id].setAttribute("x", x2 - (i > 8 ? 10 : 5));
                    this.labls[neighbor.id].setAttribute("y", y2 + 6);
                    const angle = Math.atan2(v.py - u.py, v.px - u.px);
                    const offset = 5;
                    if (g.graph.isDirected && neighbor.isIncidentTo(vertex)) {
                        x1 += offset * Math.cos(angle + Math.PI / 2);
                        y1 += offset * Math.sin(angle + Math.PI / 2);
                        x2 += offset * Math.cos(angle + Math.PI / 2);
                        y2 += offset * Math.sin(angle + Math.PI / 2);
                    }
                    this.lines[curLine].setAttribute("x1", x1);
                    this.lines[curLine].setAttribute("y1", y1);
                    const endX = x2 - Math.max(0, iw) * Math.cos(angle) * 2.5;
                    const endY = y2 - Math.max(0, iw) * Math.sin(angle) * 2.5;
                    this.lines[curLine].setAttribute("x2", endX);
                    this.lines[curLine].setAttribute("y2", endY);
                    if (g.graph.isDirected) this.lines[curLine].setAttribute("marker-end", "url(#arrowhead)"); else this.lines[curLine].setAttribute("marker-end", "");
                    curLine++;
                }));
            }
        }
        onEF() {
            window.requestAnimationFrame(this.onEF, document);
            let stable = this.graph2D.computePhysics();
            if (stable && !this.graph2D.is3D) return;
            this.redraw();
        }
        rebuildURL() {
            let gr = this.inputField.value;
            gr = gr.replace(/[\s,\n]+/g, ",");
            window.location = "#" + gr;
        }
    }
    function getEl(s) {
        return document.getElementById(s);
    }
    function mouseX(e) {
        var cx;
        if (e.type == "touchstart" || e.type == "touchmove") cx = e.touches.item(0).clientX; else cx = e.clientX;
        return cx + document.body.scrollLeft + document.documentElement.scrollLeft;
    }
    function mouseY(e) {
        var cy;
        if (e.type == "touchstart" || e.type == "touchmove") cy = e.touches.item(0).clientY; else cy = e.clientY;
        return cy + document.body.scrollTop + document.documentElement.scrollTop;
    }
    window.onload = () => {
        new Controller("plane");
    };
    window["FLS"] = true;
    isWebp();
})();