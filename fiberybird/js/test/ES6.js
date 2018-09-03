class Animal {
    constructor(name = "nihao", age = 0) {
        this.name = name;
        this.age = age;
    }

    say(){
        console.log("这是父类" + this.name)
    }
}

class Cat extends Animal{
    constructor(name = "小猫", age = 1){
        super(name, age);
    }

    say(){
        super.
        console.log("这是子类" + this.name);
    }
}

let cat = new Cat("可爱的小猫", 1);
cat.say();