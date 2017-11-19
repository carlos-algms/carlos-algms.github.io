System.register([], function(exports_1) {
    var Todo;
    return {
        setters:[],
        execute: function() {
            Todo = (function () {
                function Todo(id, text) {
                    this.id = id;
                    this.text = text;
                }
                return Todo;
            })();
            exports_1("Todo", Todo);
        }
    }
});
