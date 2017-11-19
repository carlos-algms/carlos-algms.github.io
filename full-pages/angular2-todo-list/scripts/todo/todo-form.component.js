System.register(['angular2/core', './todo.service', './todo'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, todo_service_1, todo_1;
    var TodoFormComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (todo_service_1_1) {
                todo_service_1 = todo_service_1_1;
            },
            function (todo_1_1) {
                todo_1 = todo_1_1;
            }],
        execute: function() {
            TodoFormComponent = (function () {
                function TodoFormComponent(_todoService) {
                    this._todoService = _todoService;
                    this.active = true;
                }
                TodoFormComponent.prototype.ngOnInit = function () {
                    this.formModel = new todo_1.Todo(0, '');
                };
                TodoFormComponent.prototype.onSubmit = function () {
                    var _this = this;
                    this.active = false;
                    this._todoService.add(this.formModel);
                    this.ngOnInit();
                    setTimeout(function () { return _this.active = true; }, 0);
                };
                TodoFormComponent = __decorate([
                    core_1.Component({
                        selector: 'todo-form',
                        template: "\n    <div class=\"row\">\n      <form class=\"col s12\" *ngIf=\"active\" (ngSubmit)=\"onSubmit()\">\n        <div class=\"row\">\n          <div class=\"input-field col s9 m8\">\n            <input id=\"text\" type=\"text\" class=\"validate\" [(ngModel)]=\"formModel.text\" required />\n            <label for=\"text\">Description</label>\n          </div>\n          <div class=\"input-field col s3 m4\">\n            <button type=\"submit\" class=\"waves-effect waves-light btn col s12\">\n              <i class=\"material-icons left\">add</i>\n              Insert\n            </button>\n          </div>\n        </div>\n      </form>\n    </div>\n  "
                    }), 
                    __metadata('design:paramtypes', [todo_service_1.TodoService])
                ], TodoFormComponent);
                return TodoFormComponent;
            })();
            exports_1("TodoFormComponent", TodoFormComponent);
        }
    }
});
