import {StoreBase, AutoSubscribeStore, autoSubscribe} from 'resub'

const ALPHAVANTAGE_API = 'demo' // 'B4I08MQVCK3OPW8U'

@AutoSubscribeStore
export class AlphavantageStore extends StoreBase {
  private _symbol:string
  private _graph:Graph[]

  constructor() {
    super()
    
    const symbol = localStorage.getItem('symbol')
    if(symbol) {
      this._symbol = symbol
    } else {
      this._symbol = 'MSFT'
    }
    this.trackSymbol()
  }

  changeSymbol = (symbol:string) => {
    this._symbol = symbol
    localStorage.setItem('symbol', symbol)
    this.trackSymbol()
  }

  trackSymbol = () => 
    new Promise((resolve, reject) => {
      fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${this._symbol}&apikey=${ALPHAVANTAGE_API}`, {
        method: 'GET'
      }).then(response => response.json()).then(response => {
        const timeSeries = Object.keys(response).find(key => key.toLowerCase().includes('time series'))
        const graphs = Object.keys(response[timeSeries]).map(timeKey => {
          const time = new Date(Date.parse(timeKey))
          const graph:Graph = {
            time,
            open: parseFloat(response[timeSeries][timeKey]['1. open']),
            high: parseFloat(response[timeSeries][timeKey]['2. high']),
            low: parseFloat(response[timeSeries][timeKey]['3. low']),
            close: parseFloat(response[timeSeries][timeKey]['4. close']),
            volume: parseFloat(response[timeSeries][timeKey]['5. volume'])
          }
          return graph
        })
        this._graph = graphs
        resolve(this._graph)
        this.trigger()
      }).catch(reject)
    })

  @autoSubscribe
  symbol() {
    return this._symbol
  }
  @autoSubscribe
  graph() {
    return this._graph
  }
}
export interface Graph {
  time: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export default new AlphavantageStore()