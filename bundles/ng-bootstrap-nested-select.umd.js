(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ng-bootstrap/ng-bootstrap'), require('string-similarity'), require('@angular/common'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('ng-bootstrap-nested-select', ['exports', '@angular/core', '@ng-bootstrap/ng-bootstrap', 'string-similarity', '@angular/common', '@angular/forms'], factory) :
    (global = global || self, factory(global['ng-bootstrap-nested-select'] = {}, global.ng.core, global['@ng-bootstrap/ng-bootstrap'], global['string-similarity'], global.ng.common, global.ng.forms));
}(this, (function (exports, core, ngBootstrap, stringSimilarity, common, forms) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __createBinding(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }

    function __exportStar(m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    (function (KEY_CODE) {
        KEY_CODE[KEY_CODE["ENTER"] = 13] = "ENTER";
        KEY_CODE[KEY_CODE["UP_ARROW"] = 38] = "UP_ARROW";
        KEY_CODE[KEY_CODE["DOWN_ARROW"] = 40] = "DOWN_ARROW";
    })(exports.KEY_CODE || (exports.KEY_CODE = {}));
    var NgBootstrapNestedSelectDefaultSetting = /** @class */ (function () {
        function NgBootstrapNestedSelectDefaultSetting() {
            this.filter = { fields: ['name'] };
            this.field = 'options';
            this.scroll = true;
            this.top = false;
            this.selectAll = false;
            this.label = 'name';
            this.collapsed = false;
            this.clear = 'Clear';
            this.strict = true;
            this.actions = null;
            this.required = false;
            this.indexedOptions = false;
            this.numberInput = false;
            this.matchRating = .4;
            this.emptyText = 'No Options Available';
            this.popoverTitle = 'Details:';
        }
        return NgBootstrapNestedSelectDefaultSetting;
    }());
    var NgBootstrapNestedSelectComponent = /** @class */ (function () {
        function NgBootstrapNestedSelectComponent(cb, ngbConfig) {
            this.cb = cb;
            this.ngbConfig = ngbConfig;
            this.disable = false;
            this.required = false;
            this.invalid = true;
            // Local list of options
            this._options = [];
            // Settings to control component
            this.settings = new NgBootstrapNestedSelectDefaultSetting();
            this._disabled = false;
            // Array of action buttons/links to add to select box
            this.actions = [];
            // Emit selected value when selected
            this.selected = new core.EventEmitter();
            // Emit action value when action is selected
            this.actionSelected = new core.EventEmitter();
            // Array of filted options
            this._optionsFiltered = [];
            // The filter string to search through options
            this._searchTerm = '';
            // The selected option
            this._selected = {};
            this.filterOn = true;
            this.ngbConfig.autoClose = 'outside';
        }
        Object.defineProperty(NgBootstrapNestedSelectComponent.prototype, "options", {
            // List of options to display in the dropdown
            set: function (options) {
                var _this = this;
                this.setOptions(options);
                // resetSelected needs to wait for the settings var to populate, so use setTimeout to delay execution.
                setTimeout(function () {
                    _this.resetSelected(_this._options);
                }, 500);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgBootstrapNestedSelectComponent.prototype, "default", {
            // Default option to be set
            set: function (defautOption) {
                if (typeof defautOption === 'object') {
                    this._selected = __assign({}, defautOption);
                }
                else {
                    this._selected = {
                        name: defautOption,
                        selected: true
                    };
                }
                if (defautOption)
                    this.filterOn = false;
                this.validate();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgBootstrapNestedSelectComponent.prototype, "disabled", {
            // Disabled the select box
            set: function (bool) {
                if (bool)
                    this.disable = true;
                else
                    this.disable = false;
                this._disabled = bool;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Init the default settings if they aren't provided in the settings object
         */
        NgBootstrapNestedSelectComponent.prototype.ngOnInit = function () {
            var defaultSettings = new NgBootstrapNestedSelectDefaultSetting();
            for (var key in defaultSettings) {
                if (!this.settings[key] && this.settings[key] !== false)
                    this.settings[key] = defaultSettings[key];
            }
            // Add 'required' class
            if (this.settings.required) {
                this.required = true;
                this.validate();
            }
            this.cb.markForCheck();
        };
        /**
         * Handle a keyboard event when toggle through the options list
         * @param {KeyboardEvent} event
         */
        NgBootstrapNestedSelectComponent.prototype.keyEvent = function (event) {
            switch (event.keyCode) {
                case exports.KEY_CODE.UP_ARROW:
                case exports.KEY_CODE.DOWN_ARROW:
                    this.arrowOption(event.keyCode);
                    break;
                case exports.KEY_CODE.ENTER:
                    this.selectOption(null, this._selected);
                    break;
            }
        };
        /**
         * Check if we have any options to select from
         * @returns {boolean}
         */
        NgBootstrapNestedSelectComponent.prototype.hasOptions = function () {
            var _this = this;
            return this._options.filter(function (op) {
                if (op[_this.settings.label] && op[_this.settings.label] !== '')
                    return true;
            }).length > 0;
        };
        /**
         * Resursively reset the "selected" flag for every option
         * @param options
         */
        NgBootstrapNestedSelectComponent.prototype.resetSelected = function (options) {
            var _this = this;
            if (options === void 0) { options = []; }
            options.forEach(function (opt) {
                opt.selected = false;
                opt.collapsed = false;
                // Check if this options has child options
                if (_this.settings && opt[_this.settings.field] && opt[_this.settings.field].length > 0) {
                    _this.resetSelected(opt[_this.settings.field]);
                }
            });
        };
        /**
         * Select a value from the options and emit output
         * @param {MouseEvent|null} event
         * @param {any=null} option
         * @param {boolean=false} toggle
         */
        NgBootstrapNestedSelectComponent.prototype.selectOption = function (event, option, toggle) {
            if (option === void 0) { option = null; }
            if (toggle === void 0) { toggle = false; }
            if (!option) {
                option = { selected: true };
                option[this.settings.label] = event;
            }
            if (toggle || (option[this.settings.field] && option[this.settings.field].length && !this.settings.selectAll)) {
                option.selected = !option.selected;
                event.stopPropagation();
                event.preventDefault();
            }
            else {
                this._selected = __assign({}, option);
                this._searchTerm = this._selected[this.settings.label];
                if (this.settings.indexedOptions)
                    this.selected.emit(option[this.settings.label]);
                else
                    this.selected.emit(option);
                if (!this.settings.selectAll)
                    this.filterOn = false;
                this.nestedDropRef.close();
            }
            this.validate();
            this.cb.detectChanges();
        };
        /**
         * Check if we have a value selected
         */
        NgBootstrapNestedSelectComponent.prototype.validate = function () {
            if (Object.keys(this._selected).length > 0)
                this.invalid = false;
            else
                this.invalid = true;
        };
        /**
         * Resursive filter the list of options based on the kyeboard input
         * @param {string} searchTerm - The text to search for
         * @param {any[]} options - The options array to search through
         * @returns {number} found - value is > 1 if match is found, < 0 if no match
         */
        NgBootstrapNestedSelectComponent.prototype.filterOptions = function (searchTerm, options) {
            var _this = this;
            if (searchTerm === void 0) { searchTerm = null; }
            if (options === void 0) { options = []; }
            this.nestedDropRef.open();
            if (this._searchTerm.length === 0)
                return;
            if (!searchTerm) {
                this._optionsFiltered = [];
                if (!this._searchTerm)
                    this._optionsFiltered = this._options.slice(0);
                searchTerm = this._searchTerm;
                options = this._options.slice(0);
            }
            var found = -1;
            options.forEach(function (opt, index) {
                _this.settings.filter.fields.forEach(function (field) {
                    var optTerm = opt[field];
                    found = optTerm.search(new RegExp(searchTerm, 'i'));
                    var similar = stringSimilarity.compareTwoStrings(optTerm, searchTerm);
                    if ((found >= 0 || similar >= _this.settings.matchRating) && _this._optionsFiltered.indexOf(opt) < 0) {
                        opt.match = similar;
                        _this._optionsFiltered.push(opt);
                    }
                });
                if (opt[_this.settings.field] && opt[_this.settings.field].length) {
                    found = _this.filterOptions(searchTerm, opt[_this.settings.field]);
                }
            });
            this._optionsFiltered.sort(function (a, b) {
                return b.match - a.match;
            });
            return found;
        };
        /**
         * Change the selected value based on if the up/down arrow key is typed
         * @param {number} direction - The keycode of the key selected
         */
        NgBootstrapNestedSelectComponent.prototype.arrowOption = function (direction) {
            this.filterOn = false;
            if (!this._selected)
                this._selected = this._optionsFiltered[0];
            else {
                // Do for loop so that we can break out of it.
                for (var index = 0; index < this._optionsFiltered.length; index++) {
                    var opt = this._optionsFiltered[index];
                    var moveSelected = 1;
                    if (direction === exports.KEY_CODE.UP_ARROW)
                        moveSelected = -1;
                    if (opt === this._selected && this._optionsFiltered[(index + moveSelected)]) {
                        this._selected = this._optionsFiltered[(index + moveSelected)];
                        break;
                    }
                }
            }
        };
        /**
         * Emit the action selected to the parent component
         * @param action
         */
        NgBootstrapNestedSelectComponent.prototype.selectAction = function (action) {
            this.actionSelected.emit(action);
        };
        /**
         * Display the keyboard input filter
         */
        NgBootstrapNestedSelectComponent.prototype.showFilter = function () {
            var _this = this;
            this._optionsFiltered = this._options.slice(0);
            this.filterOn = true;
            this._searchTerm = '';
            setTimeout(function () {
                _this.filterInputRef.nativeElement.focus();
                _this.nestedDropRef.open();
            }, 100);
        };
        /**
         * Hide the keyboard input filter
         */
        NgBootstrapNestedSelectComponent.prototype.hideFilter = function () {
            this.filterOn = false;
        };
        /**
         * Set the local this._options array
         * @param {array} options - Array of objects or values.
         */
        NgBootstrapNestedSelectComponent.prototype.setOptions = function (options) {
            var _this = this;
            this._options = [];
            options.forEach(function (opt) {
                if (typeof opt === 'object') { // "options" is an array of objects
                    var objCopy = __assign({}, opt);
                    objCopy.selected = false;
                    _this._options.push(objCopy);
                }
                else { // "options" is an array of values
                    _this._options.push({
                        name: opt,
                        selected: false
                    });
                }
                _this._optionsFiltered = _this._options.slice(0);
            });
        };
        NgBootstrapNestedSelectComponent.ctorParameters = function () { return [
            { type: core.ChangeDetectorRef },
            { type: ngBootstrap.NgbDropdownConfig }
        ]; };
        __decorate([
            core.HostBinding('class.disabled')
        ], NgBootstrapNestedSelectComponent.prototype, "disable", void 0);
        __decorate([
            core.HostBinding('class.required')
        ], NgBootstrapNestedSelectComponent.prototype, "required", void 0);
        __decorate([
            core.HostBinding('class.invalid')
        ], NgBootstrapNestedSelectComponent.prototype, "invalid", void 0);
        __decorate([
            core.ViewChild('filterInput', { static: false })
        ], NgBootstrapNestedSelectComponent.prototype, "filterInputRef", void 0);
        __decorate([
            core.ViewChild('nestedDrop', { static: false })
        ], NgBootstrapNestedSelectComponent.prototype, "nestedDropRef", void 0);
        __decorate([
            core.Input()
        ], NgBootstrapNestedSelectComponent.prototype, "options", null);
        __decorate([
            core.Input()
        ], NgBootstrapNestedSelectComponent.prototype, "default", null);
        __decorate([
            core.Input()
        ], NgBootstrapNestedSelectComponent.prototype, "settings", void 0);
        __decorate([
            core.Input()
        ], NgBootstrapNestedSelectComponent.prototype, "disabled", null);
        __decorate([
            core.Input()
        ], NgBootstrapNestedSelectComponent.prototype, "actions", void 0);
        __decorate([
            core.Output()
        ], NgBootstrapNestedSelectComponent.prototype, "selected", void 0);
        __decorate([
            core.Output()
        ], NgBootstrapNestedSelectComponent.prototype, "actionSelected", void 0);
        __decorate([
            core.HostListener('window:keyup', ['$event'])
        ], NgBootstrapNestedSelectComponent.prototype, "keyEvent", null);
        NgBootstrapNestedSelectComponent = __decorate([
            core.Component({
                selector: 'nested-select',
                template: "<ng-template #optionTemplate let-options=\"options\" let-i=\"index\">\n  <ng-template ngFor [ngForOf]=\"options\" let-opt>\n    <div\n         [ngClass]=\"{\n               'option':true,\n               'and-end':true,\n               'text-primary': opt == _selected\n             }\"\n         (click)=\"selectOption($event, opt)\">\n\t\t\t\t\t\t<div *ngIf=\"opt[settings.field] && opt[settings.field].length && settings.collapsed\"\n                  class=\"fa mr-2 toggle-icon\"\n                  [ngClass]=\"{\n                    'arrow-right': !opt.selected && !settings.selectAll,\n                    'arrow-down': opt.selected && !settings.selectAll,\n                    'click-arrow-right': !opt.selected,\n                    'click-arrow-down': opt.selected,\n                    'click-arrow': settings.selectAll\n                  }\"\n                  (click)=\"selectOption($event, opt, true)\">\n            </div>\n      <span [innerHTML]=\"opt[settings.label]\" class=\"option-label\"></span>\n    </div>\n    <div class=\"option-container\" *ngIf=\"opt[settings.field] && opt[settings.field].length && (!settings.collapsed || opt.selected)\">\n      <div\n        [ngTemplateOutlet]=\"optionTemplate\"\n        [ngTemplateOutletContext]=\"{options: opt[settings.field], index: (i+1)}\">\n      </div>\n    </div>\n  </ng-template>\n</ng-template>\n<div *ngIf=\"_disabled && settings.popoverTitle\"\n     class=\"filter-read\"\n     [innerHTML]=\"_selected[settings.label]\"\n     placement=\"top\"\n     popoverTitle={{settings.popoverTitle}}\n     #p=\"ngbPopover\"\n     [ngbPopover]=\"productName\"\n     triggers=\"mouseenter:mouseleave\">\n</div>\n<div [ngStyle]=\"{'display':!_disabled?'block':'none'}\">\n  <div\n       ngbDropdown=\"\"\n       class=\"nested-select\"\n       #nestedDrop=\"ngbDropdown\"\n       (openChange)=\"resetSelected(_options)\">\n    <ng-template [ngIf]=\"!settings.strict\">\n      <div *ngIf=\"settings.filter && filterOn\">\n        <input\n               ngbDropdownAnchor=\"\"\n               (focus)=\"nestedDrop.open()\"\n               type=\"text\"\n               name=\"filterInput\"\n               id=\"filterInput\"\n               [(ngModel)]=\"_searchTerm\"\n               (ngModelChange)=\"filterOptions()\"\n               #filterInput (click)=\"filterOptions()\"\n               (focusout)=\"hideFilter()\"\n               autocomplete=\"off\" />\n      </div>\n      <div *ngIf=\"!settings.filter\">\n        <input\n               ngbDropdownAnchor=\"\"\n               (focus)=\"nestedDrop.open()\"\n               [type]=\"(settings.numberInput ? 'number' : 'text')\"\n               name=\"typedInput\"\n               id=\"typedInput\"\n               [(ngModel)]=\"_selected[settings.label]\"\n               #typedInput\n               (ngModelChange)=\"selectOption($event)\"\n               autocomplete=\"off\" />\n      </div>\n      <div *ngIf=\"settings.filter && !filterOn\">\n        <div\n             ngbDropdownToggle=\"\"\n             class=\"filter-read\"\n             [innerHTML]=\"_selected[settings.label]\"\n             (click)=\"showFilter();\">\n        </div>\n      </div>\n    </ng-template>\n    <div *ngIf=\"settings.strict\">\n      <div\n           ngbDropdownToggle=\"\"\n           class=\"filter-read\"\n           [innerHTML]=\"_selected[settings.label]\">\n      </div>\n    </div>\n  \n    <div ngbDropdownMenu=\"\"\n         aria-labelledby=\"dropdownMenuButton\"\n         [ngClass]=\"{\n              'scroll': settings.scroll,\n              'top': settings.top\n            }\">\n  \n      <div *ngIf=\"hasOptions() && settings.clear && settings.actions != 'buttons'\"\n           class=\"option text-secondary dropdown-item clear\"\n           (click)=\"selectOption(null)\">\n        {{settings.clear}}\n      </div>\n      <ng-template [ngIf]=\"(actions.length > 0) && settings.actions != 'buttons'\">\n        <div class=\"option text-secondary dropdown-item\"\n             *ngFor=\"let action of actions\"\n             (click)=\"selectAction(action)\"\n             [innerHTML]=\"action.label\">\n        </div>\n      </ng-template>\n  \n      <div class=\"option dropdown-item\" *ngIf=\"settings.actions == 'buttons'\">\n        <ng-template [ngIf]=\"(actions.length > 0)\">\n          <div class=\"btn btn-xs btn-light float-right ml-1\"\n               *ngFor=\"let action of actions\"\n               (click)=\"selectAction(action)\"\n               [innerHTML]=\"action.label\">\n          </div>\n        </ng-template>\n        <div class=\"btn btn-xs btn-light float-right ml-1\"\n             *ngIf=\"hasOptions() && settings.clear\"\n             (click)=\"selectOption(null)\">\n          {{settings.clear}}\n        </div>\n      </div>\n  \n      <div class=\"option\" *ngIf=\"!hasOptions()\">{{settings.emptyText}}</div>\n      <div\n        [ngTemplateOutlet]=\"optionTemplate\"\n        [ngTemplateOutletContext]=\"{options: _optionsFiltered, index: 1}\">\n      </div>\n    </div>\n  </div>\n</div>\n\n<ng-template #productName>\n  <div [innerHTML]=\"_selected[settings.label]\"></div>\n</ng-template>\n",
                changeDetection: core.ChangeDetectionStrategy.OnPush,
                styles: [".nested-select{border:none;padding:0;margin:0;height:100%;width:100%;position:relative}.dropdown-toggle::after{position:absolute;right:0;top:40%}.dropdown-menu{width:100%}.dropdown-menu.scroll{overflow-y:scroll;max-height:300px}.dropdown-menu.show{left:0}.dropdown-toggle{height:100%;width:100%;cursor:pointer;position:relative}.option{padding:0 .3rem;font-style:italic}.dropdown-item{color:#000;cursor:pointer;font-style:normal}.and-end{display:block;width:100%;padding:.25rem 1.5rem;clear:both;font-weight:400;text-align:inherit;white-space:nowrap;background-color:transparent;border:0;color:#000;cursor:pointer;font-style:normal}.option-container{border-left:1px solid #ccc;margin-left:.8rem}input{border:none}.clear{font-style:italic;color:#aaa!important}.filter-read{overflow:hidden;padding-right:4px;text-overflow:ellipsis}.option:hover .option-label{color:var(--primary)}.option:hover .toggle-icon{color:initial}.toggle-icon:hover{color:var(--primary)!important}.arrow-right{width:0;height:0;display:inline-block;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #aaa}.arrow-down{width:0;height:0;display:inline-block;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #ccc}.click-arrow{display:inline-block;height:16px;width:16px;vertical-align:middle}.click-arrow-right{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByUlEQVQ4jZ2TMWiTURSFv/OTIUiGUEoRCcUhBAdxea8gIg4dOzopuGkQJ5HgXDqLdA7azcHRqZM4FCli/wfiVIo4lAxSghQJpRTJcXl/+E0mvcuDd94599x735Ux85HK1Aa6QDtfnQLfQgyn829VF0hlKoCbtp9Iug1cztAPYA8Y2v4U1+J0QSCVqbB9V9ILYBUogHE+l4ApcAwMbL+rRIqamxuSXgJX8/0x0Ace2v5uu8jYtqTrFanI2ZtA33anAmyPbR8Cu5I2JU0y1LHdLw/K5kzAds/2erZ5AoyAFUmbQCPE8AZ4BvzMnHVJPYAGgKRl2x1Jo/xwIqky08jnW9tXJD3PPVqegbabki7lce2GGC7mxxVimKQyvQbuS+rZbtYdnANnttuSNlKZJjXu5xDDr1Smlu1HQEfSWebM7I1z3V1gCFzYBvgoaT+7vCfpKdCyfShpXB/jEfBBUgGs5CxjSVvA71SmB5K2bVf/4b3to5lAiOEc2MkusI3tJdvXbG/Y3gJaubEjSTtxLf5VAsAX24P8mTrAqqRXQJHFpjnBQNLXirSwC7ZvAY8l3cnlAJzY3gOGkvZDDIu7UI9UprbtrqR/28b/iT8f8eQJZ91doAAAAABJRU5ErkJggg==) top left no-repeat}.click-arrow-down{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvElEQVQ4jZ2Tv2tTURTHP9+HQ5AMoQRRCEWkZBIH3xNExKGzIAiVgpsQRBFE8geIs9TgInTwPxAU5+LQoQi+C8WxlA4lqJQORcKjU74OOS88m0nPdu853x/33HNkzNlIZeoAK0Anrk6A/bzIT87WqkmQypQBN20/kXQbuBipX8A2sGn7a3GjmC4QpDJltu9Leg0s255KOoq6C0AGHAJD259qkqzh5pqkDeAykEn6AawBa7bHtrPIjSRdrUFZqLeAge1enbB9ClTARNKppDrVsz0ov5WtOYHtvu3VOFfApNko28RdFTWrkvoA5wAkdUO9At7Z/gk8bHBMbL+UdAl4CiwD3TmB7Zak88Ae8BY4lrQP/A6BV7a3gK7tu5L6tltNB/V7e7YfSXqTF/nnhoODVKY2MJDUA6rAzH/hGBjbbkt6DqyzGOvAM6BtexyYmYOw/iUaswSMUpkq2x/C4QNgFAJTYMv2Hvw9SNeBj8yGCOBA0otwuQFcCbFD4F5e5LtNBwC7tocxTL0AvAcy20vAFBgDQ0nfa9DCLti+BTyWdIfZCAMc2d4GNiXt5EW+uAvNSGXq2F6R9G/b+D/xB+z71+BSnjoVAAAAAElFTkSuQmCC) top left no-repeat}:host{text-align:left}:host .disabled{background-color:#e9ecef;cursor:not-allowed}@media (min-width:576px){.filter-read{white-space:nowrap}.dropdown-menu{min-width:500px}}"]
            })
        ], NgBootstrapNestedSelectComponent);
        return NgBootstrapNestedSelectComponent;
    }());

    var NgBootstrapNestedSelectModule = /** @class */ (function () {
        function NgBootstrapNestedSelectModule() {
        }
        NgBootstrapNestedSelectModule = __decorate([
            core.NgModule({
                declarations: [NgBootstrapNestedSelectComponent],
                imports: [
                    common.CommonModule,
                    forms.FormsModule,
                    ngBootstrap.NgbPopoverModule,
                    ngBootstrap.NgbDropdownModule,
                    ngBootstrap.NgbPopoverModule
                ],
                exports: [NgBootstrapNestedSelectComponent]
            })
        ], NgBootstrapNestedSelectModule);
        return NgBootstrapNestedSelectModule;
    }());

    exports.NgBootstrapNestedSelectComponent = NgBootstrapNestedSelectComponent;
    exports.NgBootstrapNestedSelectDefaultSetting = NgBootstrapNestedSelectDefaultSetting;
    exports.NgBootstrapNestedSelectModule = NgBootstrapNestedSelectModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng-bootstrap-nested-select.umd.js.map
