System.register(['rxjs/Rx'], function(exports_1) {
    var Rx_1;
    var Storer;
    return {
        setters:[
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            Storer = (function () {
                function Storer(index) {
                    this.index = index;
                    this.subject = new Rx_1.Subject();
                }
                Storer.prototype._read = function () {
                    var _this = this;
                    return new Rx_1.Observable(function (observer) {
                        var json = window.localStorage[_this.index.toString()];
                        if (json === null || typeof json === 'undefined' || json === 'undefined') {
                            json = null;
                        }
                        setTimeout(function () {
                            observer.next(json);
                            observer.complete();
                        }, 0);
                    });
                };
                Storer.prototype.read = function () {
                    var _this = this;
                    this._read().subscribe(function (json) {
                        _this.subject.next(json ? Storer.convertToObject(json) : null);
                    });
                    return this.subject;
                };
                Storer.prototype.write = function (data) {
                    localStorage[this.index] = JSON.stringify(data);
                    this.read();
                };
                Storer.convertToObject = function (json) {
                    var data;
                    try {
                        data = JSON.parse(json);
                    }
                    catch (err) {
                        console.error(err);
                        data = null;
                    }
                    return data;
                };
                return Storer;
            })();
            exports_1("Storer", Storer);
        }
    }
});
