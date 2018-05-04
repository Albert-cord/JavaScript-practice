// 多态在面向对象程序设计中的作用

var googleMap = {
		show: function(){
			console.log( '开始渲染谷歌地图' )
		}
	}
var baiduMap = {
		show: function(){
			console.log( '开始渲染百度地图' )
		}
	}

var renderMap = function (map) {
    if(map.show instanceof Function){
        map.show() //多态的体现
    }
}

renderMap(googleMap)
renderMap(baiduMap)

var sosoMap = {
		show: function(){
			console.log( '开始渲染搜搜地图' )
		}
	}

renderMap( sosoMap )

// 封装

// 封装数据
var myObject = (function () { //声明一个变量承载立即调用函数
    var __name = 'seve' //IIFE里的私有变量
    return {
        getName: function() { //公开方法
        return __name
    }}
})()

// 封装类型
// 因为Js是弱类型语言，不必如此，类型经常可以变换

// 封装变化
// 设计模式中：找到变化并封装之

// 使用克隆的原型模式

var Plane = function(){
    this.blood = 100;
    this.attackLevel = 1;
    this.defenseLevel = 1;
};

var plane = new Plane();
plane.blood = 500;
plane.attackLevel = 10;
plane.defenseLevel = 7;

var clonePlane = Object.create(plane)
console.log(clonePlane)

Object.create = Object.create || function(obj) {
    var F = function(){}
    F.prototype = obj
    return new F()
}


// Js里函数既可以当普通函数调用也可以当做函数构造器使用

function Person( name ){
    this.name = name;
};

Person.prototype.getName = function(){
    return this.name;
};

var a = new Person( 'sven' )
console.log( a.name ); // 输出：sven
console.log( a.getName() ); // 输出：sven
console.log( Object.getPrototypeOf( a ) === Person.prototype ); // 输出：true

//在Chrome 和Firefox 等向外暴露了对象__proto__属性的浏览器下，我们可以通过下面这段代码来理解new 运算的过程：
function Person(name) {
    this.name = name
}

Person.prototype.getName = function () {
    return this.name
}

function objectFactory() {
    var obj = new Object()
    var Constructor = [].shift.call(arguments)
    obj.__proto__ = Constructor.prototype
    var ret = Constructor.apply(obj, arguments)
    return typeof ret === 'object' ? ret : obj
}

var a = objectFactory( Person, 'sven' )

	console.log( a.name ); // 输出：sven
	console.log( a.getName() ); // 输出：sven
	console.log( Object.getPrototypeOf( a ) === Person.prototype ) // 输出：true
    
//下面的代码是我们最常用的原型继承方式：

var obj = { name: 'sven' };
var A = function(){};
A.prototype = obj;
var a = new A();
console.log( a.name ); // 输出：sven

//当我们期望得到一个“类”继承自另外一个“类”的效果时，往往会用下面的代码来模拟实现：
var A = function(){};
A.prototype = { name: 'sven' };
var B = function(){};
B.prototype = new A();
var b = new B();
console.log( b.name ); // 输出：sven

//通过Class 创建对象的一段简单示例代码①如下所示 ：
class Animal {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name);
    }
    speak() {
        return "woof";
    }
}

var dog = new Dog("Scamp");
console.log(dog.getName() + ' says ' + dog.speak());
