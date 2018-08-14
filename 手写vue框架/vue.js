
// Dep的作用是作为Observer与Watcher的中转站，接收Observer发出的变化通知，转告给Watcher并进行变化后相应的处理
class Dep {
    constructor() {
        // subs是一个依赖池，里面放了所有的Watcher
        this.subs = []
    }

    addSub(sub) {
        this.subs.push(sub)
    }
    // notify用来通知变化给Watcher，每一个Watcher就是一个sub
    notify(newVal, val) {
        for (const sub of this.subs) {
            sub.update(newVal, val)
        }
    }
}

// Observer的作用将数据进行getter与setter的转化，使其变为可响应的
class Observer {
    constructor(data) {
        this.init(data)
    }
    // init方法使用核心的Object.defineProperty进行实际的转化操作，
    init(data) {
        if (!data || typeof data !== 'object') return
        for (const key in data) {
            this.defineProperty(data, key, data[key])
            // 递归尾调用优化，感兴趣的看下http://es6.ruanyifeng.com/#docs/function#尾调用优化
            this.init(data[key])
        }
    }

    defineProperty(data, key, val) {
        let objVal = val
        const dep = new Dep()
        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            get() {
                // 为保证不会重复添加依赖，使用Dep.target进行判断
                if (Dep.target) {
                    dep.addSub(Dep.target)
                }

                return objVal
            },
            set(val) {
                // 进行简单的值对比，相同就不触发后续操作
                if (objVal === val) return
                dep.notify(val, objVal)
                objVal = val
            }
        })
    }
}

// Watcher的作用是接收变化的通知，并且执行相应的函数
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
        this.get()
    }
    // 当数据发生变化的时候就会触发这个事件
    update(newVal, val) {
        this.cb.call(this.vm, newVal, val)
    }
    // 当我new的时候就触发这个函数，把自己丢进Dep中
    get() {
        Dep.target = this
        const val = this.vm[this.key]
        Dep.target = null
    }
}

// Complie是用于进行模板解析的
class Compile {
    constructor(el, vm) {
        this.vm = vm
        // childNodes可以用来获取dom下的所有子节点
        this.compileNode(document.querySelector(el).childNodes)
    }

    compileNode(nodes) {
        for (const node of nodes) {
            // 判断节点的类型，1为标签类型，3为文本类型
            switch (node.nodeType) {
                // 对于标签类型，我们需要解析attr属性用来获取标签上监听了什么事件
                case 1:
                    this.compileEvent(node)
                    break
                    // 对于文本类型，我们需要解析内部的属性，用来填充内部的文本
                case 3:
                    this.compileText(node)
                    break
            }
            node.childNodes && node.childNodes.length && this.compileNode(node.childNodes)
        }
    }

    compileText(node) {
        const reg = /\{\{(.*)\}\}/
        if (node.textContent && reg.test(node.textContent)) {
            // 获取文本绑定的data属性的key
            const key = reg.exec(node.textContent)[1]
            // 获取vue上data的值
            const val = this.vm[key]
            node.textContent = val
            // new Watcher用来进行依赖的收集，当我绑定的这个值发生改变的时候再执行相应的函数
            new Watcher(this.vm, key, function (newVal) {
                node.textContent = newVal
            })
        }
    }

    compileEvent(node) {
        const attrs = node.attributes
        for (const attr of attrs) {
            // 解析事件，这里跟上面的差不多
            if (attr.name.indexOf('@') !== -1) {
                const event = attr.name.split('@')[1]
                const fn = this.vm[attr.value]
                node.addEventListener(event, fn.bind(this.vm))
            }
        }
    }
}

class Vue {
    // new命令生成对象实例时，自动调用该方法
    constructor({
        el,
        data,
        methods,
        beforeCreate,
        created,
        beforeMounte,
        mounted,
        watch
    }) {
        this.data = data()
        this.methods = methods
        this.watch = watch
        // 用来代理vue的各种属性
        this.proxyKey()
        // 生命周期，位置有待商榷
        beforeCreate && beforeCreate()
        // 进行数据转化
        new Observer(this.data)
        // 生命周期，位置有待商榷
        created && created.call(this)
        // 初始化watch
        this.initWatch()
        // 生命周期，位置有待商榷
        beforeMounte && beforeMounte.call(this)
        // 模板解析
        new Compile(el, this)
        // 生命周期，位置有待商榷
        mounted && mounted.call(this)

        return this
    }

    initWatch() {
        for (const key in this.watch) {
            new Watcher(this, key, this.watch[key])
        }
    }

    proxyKey() {
        // 代理vue，用来实现this.title替代this.data.title的效果
        const _this = this
        for (const key in this.data) {
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: false,
                get() {
                    return _this.data[key]
                },
                set(val) {
                    _this.data[key] = val
                }
            })
        }
        for (const key in this.methods) {
            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: false,
                get() {
                    return _this.methods[key]
                },
                set(val) {
                    _this.methods[key] = val
                }
            })
        }
    }
}


