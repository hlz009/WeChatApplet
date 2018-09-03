(function(){
    var Animal = function (name, age) {
        this.name = name;
        this.age = age;
    }

    Animal.prototype.say = function() {
        console.log(this.name + "我的爱" + this.age);
    }

    var Cat = function (name, age) {
        Animal.apply(this, arguments);
        //Animal.apply(this, [name, age]); 与上面等价
        //Animal.call(this, name, age); 与上面等价
    }

    // 建议写成这种
    Cat.prototype = Object.create(Animal.prototype);
    //或者写成(记得区分这种形式)
    //Cat.prototype = new Animal()
    Cat.prototype.say = function () {
        console.log("这是子类-->" + this.name);
    }

    var cat1 = new Cat("子猫", 1);
    cat1.say();
})();