System.register(['angular2/core'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var AnalyticsDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AnalyticsDirective = (function () {
                function AnalyticsDirective() {
                    this.analytics = "<!-- Google Analytics -->\n<script type=\"text/javascript\">\n(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\nm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n})(window,document,'script','//www.google-analytics.com/analytics.js','ga');\n\nga('create', 'UA-52188553-1', 'auto');\nga('send', 'pageview');\n\n</script>\n<!-- End Google Analytics -->";
                    if (location.hostname.indexOf('localhost') === -1) {
                        $('head').append(this.analytics);
                    }
                }
                AnalyticsDirective = __decorate([
                    core_1.Directive({
                        selector: 'todo-form',
                    }), 
                    __metadata('design:paramtypes', [])
                ], AnalyticsDirective);
                return AnalyticsDirective;
            })();
            exports_1("AnalyticsDirective", AnalyticsDirective);
        }
    }
});
