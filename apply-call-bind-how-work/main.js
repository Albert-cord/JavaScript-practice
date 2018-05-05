
//apply 方法把这个集合中的元素作为参数传递给被调用的函数：
var func = function (a, b, c) {
    alert([a, b, c])
}

func.apply(null, [1, 2, 3])

//从第二个参数开始往后，每个参数被依次传入函数：
var func = function( a, b, c ){
    alert ( [ a, b, c ] ); // 输出 [ 1, 2, 3 ]
};

func.call( null, 1, 2, 3 );
//当使用call 或者apply 的时候，如果我们传入的第一个参数为null，函数体内的this 会指向默认的宿主对象，在浏览器中则是window：
var func = function( a, b, c ){
    alert ( this === window ); // 输出true
};

func.apply( null, [ 1, 2, 3 ] );

//但如果是在严格模式下，函数体内的this 还是为null：

var func = function( a, b, c ){
    "use strict";
    alert ( this === null ); // 输出true
}

func.apply( null, [ 1, 2, 3 ] );

//比如借用其他对象的方法。那么我们可以传入null 来代替某个具体的对象：

Math.max.apply(null, [1, 2, 5, 4, 3])// 输出：5

//call 和apply 最常见的用途是改变函数内部的this 指向，我们来看个例子：

var obj1 = {
    name: 'sven'
};

var obj2 = {
    name: 'anne'
};

window.name = 'window';

var getName = function(){
    alert ( this.name );
};

getName(); // 输出: window
getName.call( obj1 ); // 输出: sven
getName.call( obj2 ); // 输出: anne

// 让我们来模拟实现下Function.prototype.bind

Function.prototype.bind = function (context) { //传入绑定的 this，
                                                // 即运行时上下文
    var self = this //保存原函数
    return function () {  //返回一个新的函数
        return self.apply( context, arguments)
        // 执行新得函数，会为this绑定到context去
    }
}

var obj = {
    name: 'sven'
};

var func = function(){
    alert ( this.name ); // 输出：sven
}.bind( obj);

func();

//再更新下

Function.prototype.bind = function () {
    var self = this // 保存原函数
    var context = [].shift.call(null, arguments) // 需要绑定的this 上下文
    args = [].slice.call(arguments) // 剩余的参数转成数组
    return function () { // 返回一个新的函数
        return self.apply( context, [].concat.call(args, [].slice.call(arguments)))
        // 执行新的函数的时候，会把之前传入的context 当作新函数体内的this
				// 并且组合两次分别传入的参数，作为新函数的参数
                // 为什么说是两次呢？记得这里只暴露return 的function， 上面的数据都是私有的
    }

}
var obj = {
		name: 'sven'
	};

var func = function( a, b, c, d ){
	alert ( this.name ); // 输出：sven
	alert ( [ a, b, c, d ] ) // 输出：[ 1, 2, 3, 4 ]
}.bind( obj, 1, 2 );

func( 3, 4 );

var A = function( name ){
    this.name = name;
};

var B = function(){
    A.apply( (0, self = this), arguments );
    // 明白了，这里apply把A的this绑给了B，即B冒充了A，
    // 然后args传入A里赋值
    console.log('1', self)
    console.log('2', self.name)
    console.log('3', this.name)
};
B.prototype.getName = function(){
    return this.name;
};

var b = new B( 'sven' );
console.log('4', b.getName() ); // 输出： 'sven'

//通常会借用Array.prototype.push：.
// 更能说明对象冒充的
(function(){
    Array.prototype.push.call( arguments, 3 );
    console.log ( arguments ); // 输出[1,2,3]
})( 1, 2 );

//看看V8 引擎中的具体实现：
function ArrayPush() {
    var n = TO_UINT32( this.length ); // 被push 的对象的length
    var m = %_ArgumentsLength(); // push 的参数个数
    for (var i = 0; i < m; i++) {
        this[ i + n ] = %_Arguments( i ); // 复制元素 (1)
    }
    this.length = n + m; // 修正length 属性的值 (2)
    return this.length;
};

// 模拟下apply 跟 call 的实现

Function.prototype.call = function (context) {
    var context = context || window;
    //不理解为什么把this赋值给context.fn
    // 回去看下红宝书
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }

Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
