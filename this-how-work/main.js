
//this的调用，不是使用

// 当函数作为对象的方法被调用时，this指向该对象

var obj = {
    a: 1,
    getName: function () {
        return this.a
    }
}

// 调用对象的方法时
// this 指向 obj
obj.getName()

// 当普通函数调用时,this 指向全局对象
// 在浏览器的JavaScript 里，这个全局对象是window 对象
var thisToWindow = obj.getName
thisToWindow()
// 一般保存this指向的方法,即 let self = this
<html>
	<body>
		<div id="div1">我是一个div</div>
	</body>
	<script>

	window.id = 'window';

	document.getElementById( 'div1' ).onclick = function(){
		alert ( this.id ); // 输出：'div1'
		var callback = function(){
			alert ( this.id ); // 输出：'window'
		}
		callback();
	};


	document.getElementById( 'div1' ).onclick = function(){
		var self = this; // 保存div 的引用
		var callback = function(){
			alert ( self.id ); // 输出：'div1'
		}
		callback();
	};

	</script>
</html>

// 注意，这个指向全局对象的 this 在严格模式下 undefined


	function func(){
		"use strict"
		alert ( this ); // 输出：undefined
	}

	func();

//（函数）构造器里的this 就指向返回(隐式return)的这个对象
var MyClass = function(){
    this.name = 'sven';
};

var obj = new MyClass();
alert ( obj.name ); // 输出：sven

// 但是显式声明返回的对象（注意是对象，非对象则不影响）则会覆盖隐式的
var MyClass = function(){
       this.name = 'sven';
       return { // 显式地返回一个对象
           name: 'anne'
       }
   };

var obj = new MyClass();
alert ( obj.name ); // 输出：anne

var MyClass = function(){
		this.name = 'sven'
		return 'anne'; // 返回string 类型
	};

var obj = new MyClass();
alert ( obj.name ); // 输出：sven，不影响

// 使用call、apply等函数显式指定 this

var obj1 = {
    name: 'sven',
    getName: function(){
        return this.name;
    }
};

var obj2 = {
    name: 'anne'
};

console.log( obj1.getName() ); // 输出: sven
console.log( obj1.getName.call( obj2 ) ); // 输出：anne
// 上面的obj1的this指向obj2

// prototype.js做过的事情：
var getId = function( id ){
    return document.getElementById( id );
};

getId( 'div1' );

//我们也许思考过为什么不能用下面这种更简单的方式：

var getId = document.getElementById;
getId( 'div1' );
//这里的this不会指向document，而是全局对象
// 改为：
document.getElementById = (function (func) {
    //这里还要返回一个函数
    // 但是为什么呢？这里是不是为了指向调用该方法的对象
    // 即document
    // 注释掉就会返回null，不注释则返回函数，是不是document被执行过后，
    // 里面的还要访问document，即变量循环引用，形成闭包，则可以延续
    // document变量的使用？
    return function () {
        return func.apply(document, arguments)
    }
})(document.getElementById)
// 这里就能指向document了
var getId = document.getElementById;
getId( 'div1' );
