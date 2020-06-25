import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import * as similarity from 'string-similarity';
export var KEY_CODE;
(function (KEY_CODE) {
    KEY_CODE[KEY_CODE["ENTER"] = 13] = "ENTER";
    KEY_CODE[KEY_CODE["UP_ARROW"] = 38] = "UP_ARROW";
    KEY_CODE[KEY_CODE["DOWN_ARROW"] = 40] = "DOWN_ARROW";
})(KEY_CODE || (KEY_CODE = {}));
export class NgBootstrapNestedSelectDefaultSetting {
    constructor() {
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
}
let NgBootstrapNestedSelectComponent = class NgBootstrapNestedSelectComponent {
    constructor(cb, ngbConfig) {
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
        this.selected = new EventEmitter();
        // Emit action value when action is selected
        this.actionSelected = new EventEmitter();
        // Array of filted options
        this._optionsFiltered = [];
        // The filter string to search through options
        this._searchTerm = '';
        // The selected option
        this._selected = {};
        this.filterOn = true;
        this.ngbConfig.autoClose = 'outside';
    }
    // List of options to display in the dropdown
    set options(options) {
        this.setOptions(options);
        // resetSelected needs to wait for the settings var to populate, so use setTimeout to delay execution.
        setTimeout(() => {
            this.resetSelected(this._options);
        }, 500);
    }
    // Default option to be set
    set default(defautOption) {
        if (typeof defautOption === 'object') {
            this._selected = Object.assign({}, defautOption);
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
    }
    // Disabled the select box
    set disabled(bool) {
        if (bool)
            this.disable = true;
        else
            this.disable = false;
        this._disabled = bool;
    }
    /**
     * Init the default settings if they aren't provided in the settings object
     */
    ngOnInit() {
        let defaultSettings = new NgBootstrapNestedSelectDefaultSetting();
        for (let key in defaultSettings) {
            if (!this.settings[key] && this.settings[key] !== false)
                this.settings[key] = defaultSettings[key];
        }
        // Add 'required' class
        if (this.settings.required) {
            this.required = true;
            this.validate();
        }
        this.cb.markForCheck();
    }
    /**
     * Handle a keyboard event when toggle through the options list
     * @param {KeyboardEvent} event
     */
    keyEvent(event) {
        switch (event.keyCode) {
            case KEY_CODE.UP_ARROW:
            case KEY_CODE.DOWN_ARROW:
                this.arrowOption(event.keyCode);
                break;
            case KEY_CODE.ENTER:
                this.selectOption(null, this._selected);
                break;
        }
    }
    /**
     * Check if we have any options to select from
     * @returns {boolean}
     */
    hasOptions() {
        return this._options.filter((op) => {
            if (op[this.settings.label] && op[this.settings.label] !== '')
                return true;
        }).length > 0;
    }
    /**
     * Resursively reset the "selected" flag for every option
     * @param options
     */
    resetSelected(options = []) {
        options.forEach(opt => {
            opt.selected = false;
            opt.collapsed = false;
            // Check if this options has child options
            if (this.settings && opt[this.settings.field] && opt[this.settings.field].length > 0) {
                this.resetSelected(opt[this.settings.field]);
            }
        });
    }
    /**
     * Select a value from the options and emit output
     * @param {MouseEvent|null} event
     * @param {any=null} option
     * @param {boolean=false} toggle
     */
    selectOption(event, option = null, toggle = false) {
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
            this._selected = Object.assign({}, option);
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
    }
    /**
     * Check if we have a value selected
     */
    validate() {
        if (Object.keys(this._selected).length > 0)
            this.invalid = false;
        else
            this.invalid = true;
    }
    /**
     * Resursive filter the list of options based on the kyeboard input
     * @param {string} searchTerm - The text to search for
     * @param {any[]} options - The options array to search through
     * @returns {number} found - value is > 1 if match is found, < 0 if no match
     */
    filterOptions(searchTerm = null, options = []) {
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
        let found = -1;
        options.forEach((opt, index) => {
            this.settings.filter.fields.forEach(field => {
                let optTerm = opt[field];
                found = optTerm.search(new RegExp(searchTerm, 'i'));
                let similar = similarity.compareTwoStrings(optTerm, searchTerm);
                if ((found >= 0 || similar >= this.settings.matchRating) && this._optionsFiltered.indexOf(opt) < 0) {
                    opt.match = similar;
                    this._optionsFiltered.push(opt);
                }
            });
            if (opt[this.settings.field] && opt[this.settings.field].length) {
                found = this.filterOptions(searchTerm, opt[this.settings.field]);
            }
        });
        this._optionsFiltered.sort((a, b) => {
            return b.match - a.match;
        });
        return found;
    }
    /**
     * Change the selected value based on if the up/down arrow key is typed
     * @param {number} direction - The keycode of the key selected
     */
    arrowOption(direction) {
        this.filterOn = false;
        if (!this._selected)
            this._selected = this._optionsFiltered[0];
        else {
            // Do for loop so that we can break out of it.
            for (let index = 0; index < this._optionsFiltered.length; index++) {
                let opt = this._optionsFiltered[index];
                let moveSelected = 1;
                if (direction === KEY_CODE.UP_ARROW)
                    moveSelected = -1;
                if (opt === this._selected && this._optionsFiltered[(index + moveSelected)]) {
                    this._selected = this._optionsFiltered[(index + moveSelected)];
                    break;
                }
            }
        }
    }
    /**
     * Emit the action selected to the parent component
     * @param action
     */
    selectAction(action) {
        this.actionSelected.emit(action);
    }
    /**
     * Display the keyboard input filter
     */
    showFilter() {
        this._optionsFiltered = this._options.slice(0);
        this.filterOn = true;
        this._searchTerm = '';
        setTimeout(() => {
            this.filterInputRef.nativeElement.focus();
            this.nestedDropRef.open();
        }, 100);
    }
    /**
     * Hide the keyboard input filter
     */
    hideFilter() {
        this.filterOn = false;
    }
    /**
     * Set the local this._options array
     * @param {array} options - Array of objects or values.
     */
    setOptions(options) {
        this._options = [];
        options.forEach(opt => {
            if (typeof opt === 'object') { // "options" is an array of objects
                let objCopy = Object.assign({}, opt);
                objCopy.selected = false;
                this._options.push(objCopy);
            }
            else { // "options" is an array of values
                this._options.push({
                    name: opt,
                    selected: false
                });
            }
            this._optionsFiltered = this._options.slice(0);
        });
    }
};
NgBootstrapNestedSelectComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NgbDropdownConfig }
];
tslib_1.__decorate([
    HostBinding('class.disabled')
], NgBootstrapNestedSelectComponent.prototype, "disable", void 0);
tslib_1.__decorate([
    HostBinding('class.required')
], NgBootstrapNestedSelectComponent.prototype, "required", void 0);
tslib_1.__decorate([
    HostBinding('class.invalid')
], NgBootstrapNestedSelectComponent.prototype, "invalid", void 0);
tslib_1.__decorate([
    ViewChild('filterInput', { static: false })
], NgBootstrapNestedSelectComponent.prototype, "filterInputRef", void 0);
tslib_1.__decorate([
    ViewChild('nestedDrop', { static: false })
], NgBootstrapNestedSelectComponent.prototype, "nestedDropRef", void 0);
tslib_1.__decorate([
    Input()
], NgBootstrapNestedSelectComponent.prototype, "options", null);
tslib_1.__decorate([
    Input()
], NgBootstrapNestedSelectComponent.prototype, "default", null);
tslib_1.__decorate([
    Input()
], NgBootstrapNestedSelectComponent.prototype, "settings", void 0);
tslib_1.__decorate([
    Input()
], NgBootstrapNestedSelectComponent.prototype, "disabled", null);
tslib_1.__decorate([
    Input()
], NgBootstrapNestedSelectComponent.prototype, "actions", void 0);
tslib_1.__decorate([
    Output()
], NgBootstrapNestedSelectComponent.prototype, "selected", void 0);
tslib_1.__decorate([
    Output()
], NgBootstrapNestedSelectComponent.prototype, "actionSelected", void 0);
tslib_1.__decorate([
    HostListener('window:keyup', ['$event'])
], NgBootstrapNestedSelectComponent.prototype, "keyEvent", null);
NgBootstrapNestedSelectComponent = tslib_1.__decorate([
    Component({
        selector: 'nested-select',
        template: "<ng-template #optionTemplate let-options=\"options\" let-i=\"index\">\n  <ng-template ngFor [ngForOf]=\"options\" let-opt>\n    <div\n         [ngClass]=\"{\n               'option':true,\n               'and-end':true,\n               'text-primary': opt == _selected\n             }\"\n         (click)=\"selectOption($event, opt)\">\n\t\t\t\t\t\t<div *ngIf=\"opt[settings.field] && opt[settings.field].length && settings.collapsed\"\n                  class=\"fa mr-2 toggle-icon\"\n                  [ngClass]=\"{\n                    'arrow-right': !opt.selected && !settings.selectAll,\n                    'arrow-down': opt.selected && !settings.selectAll,\n                    'click-arrow-right': !opt.selected,\n                    'click-arrow-down': opt.selected,\n                    'click-arrow': settings.selectAll\n                  }\"\n                  (click)=\"selectOption($event, opt, true)\">\n            </div>\n      <span [innerHTML]=\"opt[settings.label]\" class=\"option-label\"></span>\n    </div>\n    <div class=\"option-container\" *ngIf=\"opt[settings.field] && opt[settings.field].length && (!settings.collapsed || opt.selected)\">\n      <div\n        [ngTemplateOutlet]=\"optionTemplate\"\n        [ngTemplateOutletContext]=\"{options: opt[settings.field], index: (i+1)}\">\n      </div>\n    </div>\n  </ng-template>\n</ng-template>\n<div *ngIf=\"_disabled && settings.popoverTitle\"\n     class=\"filter-read\"\n     [innerHTML]=\"_selected[settings.label]\"\n     placement=\"top\"\n     popoverTitle={{settings.popoverTitle}}\n     #p=\"ngbPopover\"\n     [ngbPopover]=\"productName\"\n     triggers=\"mouseenter:mouseleave\">\n</div>\n<div [ngStyle]=\"{'display':!_disabled?'block':'none'}\">\n  <div\n       ngbDropdown=\"\"\n       class=\"nested-select\"\n       #nestedDrop=\"ngbDropdown\"\n       (openChange)=\"resetSelected(_options)\">\n    <ng-template [ngIf]=\"!settings.strict\">\n      <div *ngIf=\"settings.filter && filterOn\">\n        <input\n               ngbDropdownAnchor=\"\"\n               (focus)=\"nestedDrop.open()\"\n               type=\"text\"\n               name=\"filterInput\"\n               id=\"filterInput\"\n               [(ngModel)]=\"_searchTerm\"\n               (ngModelChange)=\"filterOptions()\"\n               #filterInput (click)=\"filterOptions()\"\n               (focusout)=\"hideFilter()\"\n               autocomplete=\"off\" />\n      </div>\n      <div *ngIf=\"!settings.filter\">\n        <input\n               ngbDropdownAnchor=\"\"\n               (focus)=\"nestedDrop.open()\"\n               [type]=\"(settings.numberInput ? 'number' : 'text')\"\n               name=\"typedInput\"\n               id=\"typedInput\"\n               [(ngModel)]=\"_selected[settings.label]\"\n               #typedInput\n               (ngModelChange)=\"selectOption($event)\"\n               autocomplete=\"off\" />\n      </div>\n      <div *ngIf=\"settings.filter && !filterOn\">\n        <div\n             ngbDropdownToggle=\"\"\n             class=\"filter-read\"\n             [innerHTML]=\"_selected[settings.label]\"\n             (click)=\"showFilter();\">\n        </div>\n      </div>\n    </ng-template>\n    <div *ngIf=\"settings.strict\">\n      <div\n           ngbDropdownToggle=\"\"\n           class=\"filter-read\"\n           [innerHTML]=\"_selected[settings.label]\">\n      </div>\n    </div>\n  \n    <div ngbDropdownMenu=\"\"\n         aria-labelledby=\"dropdownMenuButton\"\n         [ngClass]=\"{\n              'scroll': settings.scroll,\n              'top': settings.top\n            }\">\n  \n      <div *ngIf=\"hasOptions() && settings.clear && settings.actions != 'buttons'\"\n           class=\"option text-secondary dropdown-item clear\"\n           (click)=\"selectOption(null)\">\n        {{settings.clear}}\n      </div>\n      <ng-template [ngIf]=\"(actions.length > 0) && settings.actions != 'buttons'\">\n        <div class=\"option text-secondary dropdown-item\"\n             *ngFor=\"let action of actions\"\n             (click)=\"selectAction(action)\"\n             [innerHTML]=\"action.label\">\n        </div>\n      </ng-template>\n  \n      <div class=\"option dropdown-item\" *ngIf=\"settings.actions == 'buttons'\">\n        <ng-template [ngIf]=\"(actions.length > 0)\">\n          <div class=\"btn btn-xs btn-light float-right ml-1\"\n               *ngFor=\"let action of actions\"\n               (click)=\"selectAction(action)\"\n               [innerHTML]=\"action.label\">\n          </div>\n        </ng-template>\n        <div class=\"btn btn-xs btn-light float-right ml-1\"\n             *ngIf=\"hasOptions() && settings.clear\"\n             (click)=\"selectOption(null)\">\n          {{settings.clear}}\n        </div>\n      </div>\n  \n      <div class=\"option\" *ngIf=\"!hasOptions()\">{{settings.emptyText}}</div>\n      <div\n        [ngTemplateOutlet]=\"optionTemplate\"\n        [ngTemplateOutletContext]=\"{options: _optionsFiltered, index: 1}\">\n      </div>\n    </div>\n  </div>\n</div>\n\n<ng-template #productName>\n  <div [innerHTML]=\"_selected[settings.label]\"></div>\n</ng-template>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [".nested-select{border:none;padding:0;margin:0;height:100%;width:100%;position:relative}.dropdown-toggle::after{position:absolute;right:0;top:40%}.dropdown-menu{width:100%}.dropdown-menu.scroll{overflow-y:scroll;max-height:300px}.dropdown-menu.show{left:0}.dropdown-toggle{height:100%;width:100%;cursor:pointer;position:relative}.option{padding:0 .3rem;font-style:italic}.dropdown-item{color:#000;cursor:pointer;font-style:normal}.and-end{display:block;width:100%;padding:.25rem 1.5rem;clear:both;font-weight:400;text-align:inherit;white-space:nowrap;background-color:transparent;border:0;color:#000;cursor:pointer;font-style:normal}.option-container{border-left:1px solid #ccc;margin-left:.8rem}input{border:none}.clear{font-style:italic;color:#aaa!important}.filter-read{overflow:hidden;padding-right:4px;text-overflow:ellipsis}.option:hover .option-label{color:var(--primary)}.option:hover .toggle-icon{color:initial}.toggle-icon:hover{color:var(--primary)!important}.arrow-right{width:0;height:0;display:inline-block;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:5px solid #aaa}.arrow-down{width:0;height:0;display:inline-block;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #ccc}.click-arrow{display:inline-block;height:16px;width:16px;vertical-align:middle}.click-arrow-right{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByUlEQVQ4jZ2TMWiTURSFv/OTIUiGUEoRCcUhBAdxea8gIg4dOzopuGkQJ5HgXDqLdA7azcHRqZM4FCli/wfiVIo4lAxSghQJpRTJcXl/+E0mvcuDd94599x735Ux85HK1Aa6QDtfnQLfQgyn829VF0hlKoCbtp9Iug1cztAPYA8Y2v4U1+J0QSCVqbB9V9ILYBUogHE+l4ApcAwMbL+rRIqamxuSXgJX8/0x0Ace2v5uu8jYtqTrFanI2ZtA33anAmyPbR8Cu5I2JU0y1LHdLw/K5kzAds/2erZ5AoyAFUmbQCPE8AZ4BvzMnHVJPYAGgKRl2x1Jo/xwIqky08jnW9tXJD3PPVqegbabki7lce2GGC7mxxVimKQyvQbuS+rZbtYdnANnttuSNlKZJjXu5xDDr1Smlu1HQEfSWebM7I1z3V1gCFzYBvgoaT+7vCfpKdCyfShpXB/jEfBBUgGs5CxjSVvA71SmB5K2bVf/4b3to5lAiOEc2MkusI3tJdvXbG/Y3gJaubEjSTtxLf5VAsAX24P8mTrAqqRXQJHFpjnBQNLXirSwC7ZvAY8l3cnlAJzY3gOGkvZDDIu7UI9UprbtrqR/28b/iT8f8eQJZ91doAAAAABJRU5ErkJggg==) top left no-repeat}.click-arrow-down{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvElEQVQ4jZ2Tv2tTURTHP9+HQ5AMoQRRCEWkZBIH3xNExKGzIAiVgpsQRBFE8geIs9TgInTwPxAU5+LQoQi+C8WxlA4lqJQORcKjU74OOS88m0nPdu853x/33HNkzNlIZeoAK0Anrk6A/bzIT87WqkmQypQBN20/kXQbuBipX8A2sGn7a3GjmC4QpDJltu9Leg0s255KOoq6C0AGHAJD259qkqzh5pqkDeAykEn6AawBa7bHtrPIjSRdrUFZqLeAge1enbB9ClTARNKppDrVsz0ov5WtOYHtvu3VOFfApNko28RdFTWrkvoA5wAkdUO9At7Z/gk8bHBMbL+UdAl4CiwD3TmB7Zak88Ae8BY4lrQP/A6BV7a3gK7tu5L6tltNB/V7e7YfSXqTF/nnhoODVKY2MJDUA6rAzH/hGBjbbkt6DqyzGOvAM6BtexyYmYOw/iUaswSMUpkq2x/C4QNgFAJTYMv2Hvw9SNeBj8yGCOBA0otwuQFcCbFD4F5e5LtNBwC7tocxTL0AvAcy20vAFBgDQ0nfa9DCLti+BTyWdIfZCAMc2d4GNiXt5EW+uAvNSGXq2F6R9G/b+D/xB+z71+BSnjoVAAAAAElFTkSuQmCC) top left no-repeat}:host{text-align:left}:host .disabled{background-color:#e9ecef;cursor:not-allowed}@media (min-width:576px){.filter-read{white-space:nowrap}.dropdown-menu{min-width:500px}}"]
    })
], NgBootstrapNestedSelectComponent);
export { NgBootstrapNestedSelectComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctYm9vdHN0cmFwLW5lc3RlZC1zZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctYm9vdHN0cmFwLW5lc3RlZC1zZWxlY3QvIiwic291cmNlcyI6WyJsaWIvbmctYm9vdHN0cmFwLW5lc3RlZC1zZWxlY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsV0FBVyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDMUUsT0FBTyxLQUFLLFVBQVUsTUFBTSxtQkFBbUIsQ0FBQztBQUVoRCxNQUFNLENBQU4sSUFBWSxRQUlYO0FBSkQsV0FBWSxRQUFRO0lBQ2xCLDBDQUFVLENBQUE7SUFDVixnREFBYSxDQUFBO0lBQ2Isb0RBQWUsQ0FBQTtBQUNqQixDQUFDLEVBSlcsUUFBUSxLQUFSLFFBQVEsUUFJbkI7QUEwQkQsTUFBTSxPQUFPLHFDQUFxQztJQUFsRDtRQUNFLFdBQU0sR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDOUIsVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUNsQixXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsUUFBRyxHQUFHLEtBQUssQ0FBQztRQUNaLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsVUFBSyxHQUFHLE1BQU0sQ0FBQztRQUNmLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsVUFBSyxHQUFHLE9BQU8sQ0FBQztRQUNoQixXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsWUFBTyxHQUFHLElBQUksQ0FBQztRQUNmLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFD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VixpQkFBaUI7O0FBakVQO0lBQTlCLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztpRUFBaUI7QUFDaEI7SUFBOUIsV0FBVyxDQUFDLGdCQUFnQixDQUFDO2tFQUFrQjtBQUNsQjtJQUE3QixXQUFXLENBQUMsZUFBZSxDQUFDO2lFQUFnQjtBQUNGO0lBQTFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7d0VBQW9DO0FBQ3BDO0lBQXpDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7dUVBQW9DO0FBTXBFO0lBQVIsS0FBSyxFQUFFOytEQU1QO0FBR1E7SUFBUixLQUFLLEVBQUU7K0RBV1A7QUFHUTtJQUFSLEtBQUssRUFBRTtrRUFBeUY7QUFJeEY7SUFBUixLQUFLLEVBQUU7Z0VBSVA7QUFHUTtJQUFSLEtBQUssRUFBRTtpRUFBK0M7QUFHN0M7SUFBVCxNQUFNLEVBQUU7a0VBQWtEO0FBR2pEO0lBQVQsTUFBTSxFQUFFO3dFQUF3RDtBQTJDakU7SUFEQyxZQUFZLENBQUMsY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7Z0VBV3hDO0FBeEdVLGdDQUFnQztJQU41QyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsZUFBZTtRQUN6QiwraUtBQTBEO1FBRTFELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztLQUNoRCxDQUFDO0dBQ1csZ0NBQWdDLENBdVI1QztTQXZSWSxnQ0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRHJvcGRvd24sIE5nYkRyb3Bkb3duQ29uZmlnfSBmcm9tICdAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcCc7XG5pbXBvcnQgKiBhcyBzaW1pbGFyaXR5IGZyb20gJ3N0cmluZy1zaW1pbGFyaXR5JztcblxuZXhwb3J0IGVudW0gS0VZX0NPREUge1xuICBFTlRFUiA9IDEzLFxuICBVUF9BUlJPVyA9IDM4LFxuICBET1dOX0FSUk9XID0gNDBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOZ0Jvb3RzdHJhcE5lc3RlZFNlbGVjdEFjdGlvbiB7XG4gIGlkOiBhbnk7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmdCb290c3RyYXBOZXN0ZWRTZWxlY3RTZXR0aW5ncyB7XG4gIGZpbHRlcjogeyBmaWVsZHM6IGFueVtdIH07XG4gIGZpZWxkOiBzdHJpbmc7XG4gIHNjcm9sbDogYm9vbGVhbjtcbiAgdG9wOiBib29sZWFuO1xuICBzZWxlY3RBbGw6IGJvb2xlYW47XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGNvbGxhcHNlZDogYm9vbGVhbjtcbiAgY2xlYXI6IGJvb2xlYW58c3RyaW5nO1xuICBzdHJpY3Q6IGJvb2xlYW47XG4gIGFjdGlvbnM6IHN0cmluZztcbiAgcmVxdWlyZWQ6IGJvb2xlYW47XG4gIGluZGV4ZWRPcHRpb25zOiBib29sZWFuO1xuICBudW1iZXJJbnB1dDogYm9vbGVhbjtcbiAgbWF0Y2hSYXRpbmc6IG51bWJlcjtcbiAgZW1wdHlUZXh0OiBzdHJpbmc7XG4gIHBvcG92ZXJUaXRsZTogYm9vbGVhbnxzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBOZ0Jvb3RzdHJhcE5lc3RlZFNlbGVjdERlZmF1bHRTZXR0aW5nIGltcGxlbWVudHMgTmdCb290c3RyYXBOZXN0ZWRTZWxlY3RTZXR0aW5ncyB7XG4gIGZpbHRlciA9IHsgZmllbGRzOiBbJ25hbWUnXSB9O1xuICBmaWVsZCA9ICdvcHRpb25zJztcbiAgc2Nyb2xsID0gdHJ1ZTtcbiAgdG9wID0gZmFsc2U7XG4gIHNlbGVjdEFsbCA9IGZhbHNlO1xuICBsYWJlbCA9ICduYW1lJztcbiAgY29sbGFwc2VkID0gZmFsc2U7XG4gIGNsZWFyID0gJ0NsZWFyJztcbiAgc3RyaWN0ID0gdHJ1ZTtcbiAgYWN0aW9ucyA9IG51bGw7XG4gIHJlcXVpcmVkID0gZmFsc2U7XG4gIGluZGV4ZWRPcHRpb25zID0gZmFsc2U7XG4gIG51bWJlcklucHV0ID0gZmFsc2U7XG4gIG1hdGNoUmF0aW5nID0gLjQ7XG4gIGVtcHR5VGV4dCA9ICdObyBPcHRpb25zIEF2YWlsYWJsZSc7XG4gIHBvcG92ZXJUaXRsZSA9ICdEZXRhaWxzOic7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25lc3RlZC1zZWxlY3QnLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctYm9vdHN0cmFwLW5lc3RlZC1zZWxlY3QuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZy1ib290c3RyYXAtbmVzdGVkLXNlbGVjdC5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOZ0Jvb3RzdHJhcE5lc3RlZFNlbGVjdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MuZGlzYWJsZWQnKSBkaXNhYmxlID0gZmFsc2U7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucmVxdWlyZWQnKSByZXF1aXJlZCA9IGZhbHNlO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmludmFsaWQnKSBpbnZhbGlkID0gdHJ1ZTtcbiAgQFZpZXdDaGlsZCgnZmlsdGVySW5wdXQnLCB7c3RhdGljOiBmYWxzZX0pIHByaXZhdGUgZmlsdGVySW5wdXRSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ25lc3RlZERyb3AnLCB7c3RhdGljOiBmYWxzZX0pIHByaXZhdGUgbmVzdGVkRHJvcFJlZjogTmdiRHJvcGRvd247XG5cbiAgLy8gTG9jYWwgbGlzdCBvZiBvcHRpb25zXG4gIF9vcHRpb25zOiBhbnlbXSA9IFtdO1xuXG4gIC8vIExpc3Qgb2Ygb3B0aW9ucyB0byBkaXNwbGF5IGluIHRoZSBkcm9wZG93blxuICBASW5wdXQoKSBzZXQgb3B0aW9ucyhvcHRpb25zKSB7XG4gICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIC8vIHJlc2V0U2VsZWN0ZWQgbmVlZHMgdG8gd2FpdCBmb3IgdGhlIHNldHRpbmdzIHZhciB0byBwb3B1bGF0ZSwgc28gdXNlIHNldFRpbWVvdXQgdG8gZGVsYXkgZXhlY3V0aW9uLlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5yZXNldFNlbGVjdGVkKHRoaXMuX29wdGlvbnMpO1xuICAgIH0sIDUwMCk7XG4gIH1cblxuICAvLyBEZWZhdWx0IG9wdGlvbiB0byBiZSBzZXRcbiAgQElucHV0KCkgc2V0IGRlZmF1bHQoZGVmYXV0T3B0aW9uKSB7XG4gICAgaWYodHlwZW9mIGRlZmF1dE9wdGlvbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gey4uLmRlZmF1dE9wdGlvbn07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0ge1xuICAgICAgICBuYW1lOiBkZWZhdXRPcHRpb24sXG4gICAgICAgIHNlbGVjdGVkOiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICBpZihkZWZhdXRPcHRpb24pIHRoaXMuZmlsdGVyT24gPSBmYWxzZTtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gIH1cblxuICAvLyBTZXR0aW5ncyB0byBjb250cm9sIGNvbXBvbmVudFxuICBASW5wdXQoKSBzZXR0aW5nczogTmdCb290c3RyYXBOZXN0ZWRTZWxlY3RTZXR0aW5ncyA9IG5ldyBOZ0Jvb3RzdHJhcE5lc3RlZFNlbGVjdERlZmF1bHRTZXR0aW5nKCk7XG4gIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIERpc2FibGVkIHRoZSBzZWxlY3QgYm94XG4gIEBJbnB1dCgpIHNldCBkaXNhYmxlZChib29sKSB7XG4gICAgaWYoYm9vbCkgdGhpcy5kaXNhYmxlID0gdHJ1ZTtcbiAgICBlbHNlIHRoaXMuZGlzYWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2Rpc2FibGVkID0gYm9vbDtcbiAgfVxuXG4gIC8vIEFycmF5IG9mIGFjdGlvbiBidXR0b25zL2xpbmtzIHRvIGFkZCB0byBzZWxlY3QgYm94XG4gIEBJbnB1dCgpIGFjdGlvbnM6IE5nQm9vdHN0cmFwTmVzdGVkU2VsZWN0QWN0aW9uW10gPSBbXTtcblxuICAvLyBFbWl0IHNlbGVjdGVkIHZhbHVlIHdoZW4gc2VsZWN0ZWRcbiAgQE91dHB1dCgpIHNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvLyBFbWl0IGFjdGlvbiB2YWx1ZSB3aGVuIGFjdGlvbiBpcyBzZWxlY3RlZFxuICBAT3V0cHV0KCkgYWN0aW9uU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8vIEFycmF5IG9mIGZpbHRlZCBvcHRpb25zXG4gIF9vcHRpb25zRmlsdGVyZWQ6IGFueVtdID0gW107XG5cbiAgLy8gVGhlIGZpbHRlciBzdHJpbmcgdG8gc2VhcmNoIHRocm91Z2ggb3B0aW9uc1xuICBfc2VhcmNoVGVybTogc3RyaW5nID0gJyc7XG5cbiAgLy8gVGhlIHNlbGVjdGVkIG9wdGlvblxuICBfc2VsZWN0ZWQ6IGFueSA9IHt9O1xuXG4gIHB1YmxpYyBmaWx0ZXJPbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjYjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBuZ2JDb25maWc6IE5nYkRyb3Bkb3duQ29uZmlnXG4gICkge1xuICAgIHRoaXMubmdiQ29uZmlnLmF1dG9DbG9zZSA9ICdvdXRzaWRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0IHRoZSBkZWZhdWx0IHNldHRpbmdzIGlmIHRoZXkgYXJlbid0IHByb3ZpZGVkIGluIHRoZSBzZXR0aW5ncyBvYmplY3RcbiAgICovXG4gIG5nT25Jbml0KCkge1xuICAgIGxldCBkZWZhdWx0U2V0dGluZ3MgPSBuZXcgTmdCb290c3RyYXBOZXN0ZWRTZWxlY3REZWZhdWx0U2V0dGluZygpO1xuICAgIGZvcihsZXQga2V5IGluIGRlZmF1bHRTZXR0aW5ncykge1xuICAgICAgaWYoIXRoaXMuc2V0dGluZ3Nba2V5XSAmJiB0aGlzLnNldHRpbmdzW2tleV0gIT09IGZhbHNlKSB0aGlzLnNldHRpbmdzW2tleV0gPSBkZWZhdWx0U2V0dGluZ3Nba2V5XTtcbiAgICB9XG5cbiAgICAvLyBBZGQgJ3JlcXVpcmVkJyBjbGFzc1xuICAgIGlmKHRoaXMuc2V0dGluZ3MucmVxdWlyZWQpIHtcbiAgICAgIHRoaXMucmVxdWlyZWQgPSB0cnVlO1xuICAgICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuY2IubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlIGEga2V5Ym9hcmQgZXZlbnQgd2hlbiB0b2dnbGUgdGhyb3VnaCB0aGUgb3B0aW9ucyBsaXN0XG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnRcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzprZXl1cCcsIFsnJGV2ZW50J10pXG4gIGtleUV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgc3dpdGNoKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgS0VZX0NPREUuVVBfQVJST1c6XG4gICAgICBjYXNlIEtFWV9DT0RFLkRPV05fQVJST1c6XG4gICAgICAgIHRoaXMuYXJyb3dPcHRpb24oZXZlbnQua2V5Q29kZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBLRVlfQ09ERS5FTlRFUjpcbiAgICAgICAgdGhpcy5zZWxlY3RPcHRpb24obnVsbCwgdGhpcy5fc2VsZWN0ZWQpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgd2UgaGF2ZSBhbnkgb3B0aW9ucyB0byBzZWxlY3QgZnJvbVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGhhc09wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnMuZmlsdGVyKChvcCkgPT4ge1xuICAgICAgaWYob3BbdGhpcy5zZXR0aW5ncy5sYWJlbF0gJiYgb3BbdGhpcy5zZXR0aW5ncy5sYWJlbF0gIT09ICcnKSByZXR1cm4gdHJ1ZTtcbiAgICB9KS5sZW5ndGggPiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3Vyc2l2ZWx5IHJlc2V0IHRoZSBcInNlbGVjdGVkXCIgZmxhZyBmb3IgZXZlcnkgb3B0aW9uXG4gICAqIEBwYXJhbSBvcHRpb25zXG4gICAqL1xuICByZXNldFNlbGVjdGVkKG9wdGlvbnM6IGFueVtdID0gW10pIHtcbiAgICBvcHRpb25zLmZvckVhY2gob3B0ID0+IHtcbiAgICAgIG9wdC5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgb3B0LmNvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBvcHRpb25zIGhhcyBjaGlsZCBvcHRpb25zXG4gICAgICBpZih0aGlzLnNldHRpbmdzICYmIG9wdFt0aGlzLnNldHRpbmdzLmZpZWxkXSAmJiBvcHRbdGhpcy5zZXR0aW5ncy5maWVsZF0ubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnJlc2V0U2VsZWN0ZWQob3B0W3RoaXMuc2V0dGluZ3MuZmllbGRdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3QgYSB2YWx1ZSBmcm9tIHRoZSBvcHRpb25zIGFuZCBlbWl0IG91dHB1dFxuICAgKiBAcGFyYW0ge01vdXNlRXZlbnR8bnVsbH0gZXZlbnRcbiAgICogQHBhcmFtIHthbnk9bnVsbH0gb3B0aW9uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj1mYWxzZX0gdG9nZ2xlXG4gICAqL1xuICBzZWxlY3RPcHRpb24oZXZlbnQ6IChNb3VzZUV2ZW50fG51bGwpLCBvcHRpb246IGFueSA9IG51bGwsIHRvZ2dsZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYoIW9wdGlvbikge1xuICAgICAgb3B0aW9uID0ge3NlbGVjdGVkOiB0cnVlfTtcbiAgICAgIG9wdGlvblt0aGlzLnNldHRpbmdzLmxhYmVsXSA9IGV2ZW50O1xuICAgIH1cblxuICAgIGlmKHRvZ2dsZSB8fCAob3B0aW9uW3RoaXMuc2V0dGluZ3MuZmllbGRdICYmIG9wdGlvblt0aGlzLnNldHRpbmdzLmZpZWxkXS5sZW5ndGggJiYgIXRoaXMuc2V0dGluZ3Muc2VsZWN0QWxsKSkge1xuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gIW9wdGlvbi5zZWxlY3RlZDtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB7Li4ub3B0aW9ufTtcbiAgICAgIHRoaXMuX3NlYXJjaFRlcm0gPSB0aGlzLl9zZWxlY3RlZFt0aGlzLnNldHRpbmdzLmxhYmVsXTtcblxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5pbmRleGVkT3B0aW9ucykgdGhpcy5zZWxlY3RlZC5lbWl0KG9wdGlvblt0aGlzLnNldHRpbmdzLmxhYmVsXSk7XG4gICAgICBlbHNlIHRoaXMuc2VsZWN0ZWQuZW1pdChvcHRpb24pO1xuXG4gICAgICBpZighdGhpcy5zZXR0aW5ncy5zZWxlY3RBbGwpIHRoaXMuZmlsdGVyT24gPSBmYWxzZTtcbiAgICAgIHRoaXMubmVzdGVkRHJvcFJlZi5jbG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMudmFsaWRhdGUoKTtcblxuICAgIHRoaXMuY2IuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHdlIGhhdmUgYSB2YWx1ZSBzZWxlY3RlZFxuICAgKi9cbiAgdmFsaWRhdGUoKSB7XG4gICAgaWYoT2JqZWN0LmtleXModGhpcy5fc2VsZWN0ZWQpLmxlbmd0aCA+IDApIHRoaXMuaW52YWxpZCA9IGZhbHNlO1xuICAgIGVsc2UgdGhpcy5pbnZhbGlkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN1cnNpdmUgZmlsdGVyIHRoZSBsaXN0IG9mIG9wdGlvbnMgYmFzZWQgb24gdGhlIGt5ZWJvYXJkIGlucHV0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWFyY2hUZXJtIC0gVGhlIHRleHQgdG8gc2VhcmNoIGZvclxuICAgKiBAcGFyYW0ge2FueVtdfSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgYXJyYXkgdG8gc2VhcmNoIHRocm91Z2hcbiAgICogQHJldHVybnMge251bWJlcn0gZm91bmQgLSB2YWx1ZSBpcyA+IDEgaWYgbWF0Y2ggaXMgZm91bmQsIDwgMCBpZiBubyBtYXRjaFxuICAgKi9cbiAgZmlsdGVyT3B0aW9ucyhzZWFyY2hUZXJtOiBzdHJpbmcgPSBudWxsLCBvcHRpb25zOiBhbnlbXSA9IFtdKSB7XG4gICAgdGhpcy5uZXN0ZWREcm9wUmVmLm9wZW4oKTtcbiAgICBpZih0aGlzLl9zZWFyY2hUZXJtLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgaWYoIXNlYXJjaFRlcm0pIHtcbiAgICAgIHRoaXMuX29wdGlvbnNGaWx0ZXJlZCA9IFtdO1xuICAgICAgaWYoIXRoaXMuX3NlYXJjaFRlcm0pIHRoaXMuX29wdGlvbnNGaWx0ZXJlZCA9IHRoaXMuX29wdGlvbnMuc2xpY2UoMCk7XG4gICAgICBzZWFyY2hUZXJtID0gdGhpcy5fc2VhcmNoVGVybTtcbiAgICAgIG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zLnNsaWNlKDApO1xuICAgIH1cblxuICAgIGxldCBmb3VuZCA9IC0xO1xuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0LCBpbmRleCkgPT4ge1xuICAgICAgdGhpcy5zZXR0aW5ncy5maWx0ZXIuZmllbGRzLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICBsZXQgb3B0VGVybSA9IG9wdFtmaWVsZF07XG4gICAgICAgIGZvdW5kID0gb3B0VGVybS5zZWFyY2gobmV3IFJlZ0V4cChzZWFyY2hUZXJtLCAnaScpKTtcbiAgICAgICAgbGV0IHNpbWlsYXIgPSBzaW1pbGFyaXR5LmNvbXBhcmVUd29TdHJpbmdzKG9wdFRlcm0sIHNlYXJjaFRlcm0pO1xuICAgICAgICBpZigoZm91bmQgPj0gMCB8fCBzaW1pbGFyID49IHRoaXMuc2V0dGluZ3MubWF0Y2hSYXRpbmcpICYmIHRoaXMuX29wdGlvbnNGaWx0ZXJlZC5pbmRleE9mKG9wdCkgPCAwKSB7XG4gICAgICAgICAgb3B0Lm1hdGNoID0gc2ltaWxhcjtcbiAgICAgICAgICB0aGlzLl9vcHRpb25zRmlsdGVyZWQucHVzaChvcHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYob3B0W3RoaXMuc2V0dGluZ3MuZmllbGRdICYmIG9wdFt0aGlzLnNldHRpbmdzLmZpZWxkXS5sZW5ndGgpIHtcbiAgICAgICAgZm91bmQgPSB0aGlzLmZpbHRlck9wdGlvbnMoc2VhcmNoVGVybSwgb3B0W3RoaXMuc2V0dGluZ3MuZmllbGRdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9vcHRpb25zRmlsdGVyZWQuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGIubWF0Y2ggLSBhLm1hdGNoO1xuICAgIH0pO1xuICAgIHJldHVybiBmb3VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIHNlbGVjdGVkIHZhbHVlIGJhc2VkIG9uIGlmIHRoZSB1cC9kb3duIGFycm93IGtleSBpcyB0eXBlZFxuICAgKiBAcGFyYW0ge251bWJlcn0gZGlyZWN0aW9uIC0gVGhlIGtleWNvZGUgb2YgdGhlIGtleSBzZWxlY3RlZFxuICAgKi9cbiAgYXJyb3dPcHRpb24oZGlyZWN0aW9uOiBudW1iZXIpIHtcbiAgICB0aGlzLmZpbHRlck9uID0gZmFsc2U7XG4gICAgaWYoIXRoaXMuX3NlbGVjdGVkKSB0aGlzLl9zZWxlY3RlZCA9IHRoaXMuX29wdGlvbnNGaWx0ZXJlZFswXTtcbiAgICBlbHNlIHtcbiAgICAgIC8vIERvIGZvciBsb29wIHNvIHRoYXQgd2UgY2FuIGJyZWFrIG91dCBvZiBpdC5cbiAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuX29wdGlvbnNGaWx0ZXJlZC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgbGV0IG9wdCA9IHRoaXMuX29wdGlvbnNGaWx0ZXJlZFtpbmRleF07XG4gICAgICAgIGxldCBtb3ZlU2VsZWN0ZWQgPSAxO1xuICAgICAgICBpZihkaXJlY3Rpb24gPT09IEtFWV9DT0RFLlVQX0FSUk9XKSBtb3ZlU2VsZWN0ZWQgPSAtMTtcbiAgICAgICAgaWYob3B0ID09PSB0aGlzLl9zZWxlY3RlZCAmJiB0aGlzLl9vcHRpb25zRmlsdGVyZWRbKGluZGV4ICsgbW92ZVNlbGVjdGVkKV0pIHtcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZCA9IHRoaXMuX29wdGlvbnNGaWx0ZXJlZFsoaW5kZXggKyBtb3ZlU2VsZWN0ZWQpXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0IHRoZSBhY3Rpb24gc2VsZWN0ZWQgdG8gdGhlIHBhcmVudCBjb21wb25lbnRcbiAgICogQHBhcmFtIGFjdGlvblxuICAgKi9cbiAgc2VsZWN0QWN0aW9uKGFjdGlvbjogTmdCb290c3RyYXBOZXN0ZWRTZWxlY3RBY3Rpb24pIHtcbiAgICB0aGlzLmFjdGlvblNlbGVjdGVkLmVtaXQoYWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IHRoZSBrZXlib2FyZCBpbnB1dCBmaWx0ZXJcbiAgICovXG4gIHNob3dGaWx0ZXIoKSB7XG4gICAgdGhpcy5fb3B0aW9uc0ZpbHRlcmVkID0gdGhpcy5fb3B0aW9ucy5zbGljZSgwKTtcbiAgICB0aGlzLmZpbHRlck9uID0gdHJ1ZTtcbiAgICB0aGlzLl9zZWFyY2hUZXJtID0gJyc7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmZpbHRlcklucHV0UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMubmVzdGVkRHJvcFJlZi5vcGVuKCk7XG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSBrZXlib2FyZCBpbnB1dCBmaWx0ZXJcbiAgICovXG4gIGhpZGVGaWx0ZXIoKSB7XG4gICAgdGhpcy5maWx0ZXJPbiA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgbG9jYWwgdGhpcy5fb3B0aW9ucyBhcnJheVxuICAgKiBAcGFyYW0ge2FycmF5fSBvcHRpb25zIC0gQXJyYXkgb2Ygb2JqZWN0cyBvciB2YWx1ZXMuXG4gICAqL1xuICBzZXRPcHRpb25zKG9wdGlvbnM6IEFycmF5PGFueT4pIHtcbiAgICB0aGlzLl9vcHRpb25zID0gW107XG4gICAgb3B0aW9ucy5mb3JFYWNoKG9wdCA9PiB7XG4gICAgICBpZih0eXBlb2Ygb3B0ID09PSAnb2JqZWN0JykgeyAvLyBcIm9wdGlvbnNcIiBpcyBhbiBhcnJheSBvZiBvYmplY3RzXG4gICAgICAgIGxldCBvYmpDb3B5ID0gey4uLm9wdH07XG4gICAgICAgIG9iakNvcHkuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fb3B0aW9ucy5wdXNoKG9iakNvcHkpO1xuICAgICAgfSBlbHNlIHsgLy8gXCJvcHRpb25zXCIgaXMgYW4gYXJyYXkgb2YgdmFsdWVzXG4gICAgICAgIHRoaXMuX29wdGlvbnMucHVzaCh7XG4gICAgICAgICAgbmFtZTogb3B0LFxuICAgICAgICAgIHNlbGVjdGVkOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX29wdGlvbnNGaWx0ZXJlZCA9IHRoaXMuX29wdGlvbnMuc2xpY2UoMCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==