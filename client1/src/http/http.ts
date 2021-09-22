// headers信息类型
interface HeadersProps{
  [key:string]:any
}
// 初始化配置数据类型
interface OptionsProps{
  baseURL:string; // 服务器地址
  headers?:HeadersProps;  // header信息
  timeout?:number;  // 超时时长设置
}
// 请求参数
interface FetchParams{
  url:string; // 请求地址
  method:string;  // 请求方法，POST、GET
  params: { // 请求参数
    [key:string]:any
  }
}
// 请求参数，调用Get或Post时不需要method
interface FetchOptions{
  url:string;
  params:{
    [key:string]:any
  }
}

class Http{
  baseURL:string = '';
  headers:HeadersProps = {};
  timeout:number = 0;
  // 保存初始化信息、请求前和请求后的拦截可以在这里保存到实例上，在doGet和doPost分别调用就可以了
  constructor(options:OptionsProps){
    const {baseURL = '',headers = {},timeout = 100000} = options
    this.baseURL = baseURL
    this.headers = headers || {}
    this.timeout = timeout
  }
  // GET方式处理，
  private doGet(options:FetchParams){
    const {url,method,params} = options
    // get参数是在地址栏进行传输，需要将参数进行转换
    let query = ''
    Object.keys(params).forEach((key,index)=>{
      query += `${index === 0 ? '?' : '&'}${key}=${params[key]}`
    })
    // 超时控制，使用Promise.race控制
    return this.timeoutFetch(fetch(`${this.baseURL}${url}${query}`, {
      method
    }).then((res) => res.json()))
  }
  // post请求处理
  private doPost(options:FetchParams){
    const {url,method,params} = options
    return this.timeoutFetch(fetch(`${this.baseURL}${url}`, {
      method,
      body: JSON.stringify(params),
      // headers需要在options里面接收，再对初始化参数进行合并，目前没有处理
      // TODO...
      headers: new Headers(this.headers)
    }).then(res=> res.json()))
  }
  // 暴露给外层调用的post方法
  Post(options:FetchOptions){
    return this.doPost(Object.assign(options,{method: 'POST'}))
  }
  // 暴露给外层调用的get方法
  Get(options:FetchOptions){
    return this.doGet(Object.assign(options,{method: 'GET'}))
  }
  // 超时控制
  private timeoutFetch(promise:Promise<any>){
    const timeoutPromise = (timeout:number)=>{
      return new Promise((resolve,reject)=>{
        setTimeout(()=>{
          reject(new Error('超时'))
        },timeout)
      })
    }
    // race接收多个Promise，哪个promise先返回结果就返回哪个promise，超时后就不会再等待fetch了
    return Promise.race([timeoutPromise(this.timeout),promise])
  }
}
export default Http
