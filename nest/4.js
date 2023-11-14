
let context = {
    outlet:null,
    matches:[1,2]
}

let vdom1 = {
    outlet:context.outlet,
    matches:context.matches
}

context.outlet = {age:1};
context.matches =[3,4]

let vdom2 = {
    outlet:context.outlet,
    matches:context.matches
}

console.log(vdom1.outlet);
console.log(vdom1.matches);

const {outlet } = useOutlet() 
//是不是outlet 不会变了


//地址不变，指针在变
//每循环一次，就会产生新的地址，让指针指向新的地址

/*
outlet 如果不是解构出来的会不会不行
不会
无有
所谓的Context.Provider 会在被编译成 createElement，然后每次循环，都会在对应作用域生成不同的 outlet

*/