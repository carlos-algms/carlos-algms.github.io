System.register(['angular2/core', './todo.service', './todo-form.component', '../analytics.directive'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, todo_service_1, todo_form_component_1, analytics_directive_1;
    var TodoComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (todo_service_1_1) {
                todo_service_1 = todo_service_1_1;
            },
            function (todo_form_component_1_1) {
                todo_form_component_1 = todo_form_component_1_1;
            },
            function (analytics_directive_1_1) {
                analytics_directive_1 = analytics_directive_1_1;
            }],
        execute: function() {
            TodoComponent = (function () {
                function TodoComponent(todoService) {
                    this.todoService = todoService;
                }
                TodoComponent = __decorate([
                    core_1.Component({
                        selector: 'todo-list',
                        providers: [todo_service_1.TodoService],
                    }),
                    core_1.View({
                        template: "\n    <todo-form></todo-form>\n    <ul class=\"collection\" *ngIf=\"todoService.todos && todoService.todos.length > 0\">\n      <li class=\"collection-item\" *ngFor=\"#item of todoService.todos\">\n        <div>\n          {{ item.text }}\n          <a href=\"#!\" class=\"secondary-content\">\n            <i class=\"material-icons\">send</i>\n          </a>\n        </div>\n      </li>\n    </ul>\n  ",
                        directives: [todo_form_component_1.TodoFormComponent, analytics_directive_1.AnalyticsDirective]
                    }), 
                    __metadata('design:paramtypes', [todo_service_1.TodoService])
                ], TodoComponent);
                return TodoComponent;
            })();
            exports_1("TodoComponent", TodoComponent);
        }
    }
});
