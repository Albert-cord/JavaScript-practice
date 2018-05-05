
// 变量的生命周期： 被引用则还存在不会被回收
// JavaScript的回收机制： 1、引用计数（IE）； 2、是否被引用
//另外一种情况是用var 关键字在函数中声明变量，这时候的变量即是局部变量，只有在该函数内部才能访问到这个变量，在函数外面是访问不到的。代码如下：
var func = function(){
    var a = 1;
    alert ( a ); // 输出: 1
};

func();
alert ( a ); // 输出：Uncaught ReferenceError: a is not defined


// 变量搜索过程： 由内向外
var a = 1;
var func1 = function(){
    var b = 2;
    var func2 = function(){
        var c = 3;
        alert ( b ); // 输出：2
        alert ( a ); // 输出：1
    }
    func2();
    alert ( c ); // 输出：Uncaught ReferenceError: c is not defined
};

func1();

// 下面则是一个经典的闭包函数：
// 内部函数调用外部变量，该变量不会被销毁
var func = function(){
    var a = 1;
    return function(){
        a++;
        alert ( a );
    }
};

var f = func();

f(); // 输出：2
f(); // 输出：3
f(); // 输出：4
f(); // 输出：5

var Type = {};
//注意： 在这类循环中由于Js是异步编程，
// 即此函数一开始确实赋值i: 1 2 3
// 但是由于循环可以一直进行，当i = 1时，里面的事件没被触发
// 则不会赋值Type[isString]为那个函数，因为异步
// 先不执行里面的函数，但是type局部变量是共有的
// 此时则会覆盖旧有的type，i = 2 3 4 ... type一直被覆盖
// 所以我们应该这样，把for下给闭包起来
// 这样type则是私有的，则如果异步，每个人独有的type，即好
// 但这样的内存可能会泄露，则要在程序结束后，
// 把闭包里的变量给赋值null
for ( var i = 0, type; type = [ 'String', 'Array', 'Number' ][ i++ ]; ){
    (function( type ){
        Type[ 'is' + type ] = function( obj ){
            return Object.prototype.toString.call( obj ) === '[object '+ type +']';
        }
    })( type )
};

Type.isArray( [] ); // 输出：true
Type.isString( "str" ); // 输出：true

//假设有一个计算乘积的简单函数：
var mult = function(){
    var a = 1;
    for ( var i = 0, l = arguments.length; i < l; i++ ){
        a = a * arguments[i];
    }
    return a;
};

//我们可以加入缓存机制来提高这个函数的性能：
var cache = {};
var mult = function(){
    var args = Array.prototype.join.call( arguments, ',' );
    if ( cache[ args ] ){
        return cache[ args ];
    }

    var a = 1;
    for ( var i = 0, l = arguments.length; i < l; i++ ){
        a = a * arguments[i];
    }
    return cache[ args ] = a;
};

alert ( mult( 1,2,3 ) ); // 输出：6
alert ( mult( 1,2,3 ) ); // 输出：6


//以避免这个变量在其他地方被不小心修改而引发错误。代码如下：
var mult = (function(){
    var cache = {};
    return function(){
        var args = Array.prototype.join.call( arguments, ',' );
        if ( args in cache ){
            return cache[ args ];
        }
        var a = 1;
        for ( var i = 0, l = arguments.length; i < l; i++ ){
            a = a * arguments[i];
        }
        return cache[ args ] = a;
    }
})();

//最好是把它们用闭包封闭起来。代码如下：
// 这里就体现了把不变的数据、过程闭包起来，返回变化部分
var mult = (function(){
    var cache = {};
    var calculate = function(){ // 封闭calculate 函数
        var a = 1;
        for ( var i = 0, l = arguments.length; i < l; i++ ){
            a = a * arguments[i];
        }
        return a;
    };

    return function(){
        var args = Array.prototype.join.call( arguments, ',' );
        if ( args in cache ){
            return cache[ args ];
        }

        return cache[ args ] = calculate.apply( null, arguments );
    }

})();

//img 对象经常用于进行数据上报，如下所示：
var report = function( src ){
var img = new Image();
    img.src = src;
};
report( 'http://xxx.com/getUserInfo' );

//现在我们把img 变量用闭包封闭起来，便能解决请求丢失的问题：
var report = (function(){
    var imgs = [];
    return function( src ){
        var img = new Image();
        imgs.push( img );
        img.src = src;
    }
})();


//下面来看看这段跟闭包相关的代码：
// 1.返回函数模式
var extent = function(){
    var value = 0;
    return {
        call: function(){
            value++;
            console.log( value );
        }
    }
};

var extent = extent();
extent.call(); // 输出：1
extent.call(); // 输出：2
extent.call(); // 输出：3

//如果换成面向对象的写法，就是：
// 1.调用对象模式
var extent = {
    value: 0,
    call: function(){
        this.value++;
        console.log( this.value );
    }
};

extent.call(); // 输出：1
extent.call(); // 输出：2
extent.call(); // 输出：3

//或者：
// 1.原型链调用函数模式
// 其实可以看成第一种吧
var Extent = function(){
    this.value = 0;
};

Extent.prototype.call = function(){
    this.value++;
    console.log( this.value );
};

var extent = new Extent();

extent.call();
extent.call();
extent.call();
