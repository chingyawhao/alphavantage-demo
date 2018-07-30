import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {withStyles, Theme, StyleRules, StyleRulesCallback} from '@material-ui/core/styles'
import {green, red} from '@material-ui/core/colors'

import {Graph} from '../store/alphavantage'

const yInterval = 10
const xAmount = 50
const ySize = 50
const xSize = 20
const styles = (theme:Theme):StyleRules<string> | StyleRulesCallback<string> => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  yAxis: {
    width: '48px',
    position: 'relative',
    borderRight: '2px solid black'
  },
  yAxisLabel: {
    position: 'absolute',
    right: '0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  yAxisPointer: {
    background: 'black',
    height: '2px',
    width: '8px',
    marginLeft: '4px'
  },
  xAxis: {
    width: xSize + 'px',
    position: 'relative'
  },
  tickStem: {
    position: 'absolute',
    width: '2px',
    left: (xSize / 2 - 1) + 'px'
  },
  tickOpen: {
    position: 'absolute',
    height: '2px',
    width: '6px',
    left: (xSize / 2 - 7) + 'px'
  },
  tickClose: {
    position: 'absolute',
    height: '2px',
    width: '6px',
    left: (xSize / 2 + 1) + 'px'
  },
})
@(withStyles as any)(styles)
class GraphComponent extends React.Component<GraphComponentProps, GraphComponentState> {
  render() {
    const {classes, graph} = this.props
    const graphProcessed = graph && graph.sort((a, b) => a.time.getTime() - b.time.getTime()).slice(graph.length - xAmount)
    const allValue = graphProcessed && graphProcessed.reduce<number[]>((values, graphTick) => [...values, graphTick.close, graphTick.open, graphTick.high, graphTick.low], [])
    const minValue = allValue && Math.floor(Math.min(...allValue) / yInterval) * yInterval
    const maxValue = allValue && Math.ceil(Math.max(...allValue) / yInterval) * yInterval

    const calcRelativeHeight = (value) => value / yInterval * ySize
    const height = maxValue && minValue && calcRelativeHeight(maxValue - minValue) + 2
    
    return (
      <div className={classes.container}>
        <div className={classes.yAxis} style={{height}}>
          {graph && Array((maxValue - minValue) / yInterval + 1).fill(undefined).map((ignored, index) =>
            <div key={index} className={classes.yAxisLabel} style={{top:index * ySize - 9 + 1}}>
              ${maxValue - index * yInterval}
              <div className={classes.yAxisPointer}/>
            </div>
          )}
        </div>
        {graphProcessed && graphProcessed.map(graphTick => {
          const color = graphTick.open >= graphTick.close? green[500]:red[500]
          return <div key={graphTick.time.getTime()} className={classes.xAxis} style={{height}}>
            <div className={classes.tickStem} style={{
              background: color,
              top: calcRelativeHeight(maxValue - graphTick.high),
              height: calcRelativeHeight(graphTick.high - graphTick.low) + 2
            }}/>
            <div className={classes.tickOpen} style={{
              background: color,
              top: calcRelativeHeight(maxValue - graphTick.open)
            }}/>
            <div className={classes.tickClose} style={{
              background: color,
              top: calcRelativeHeight(maxValue - graphTick.close)
            }}/>
          </div>
        })}
      </div>
    )
  } 
}
interface GraphComponentProps extends React.Props<{}> {
  classes?: any
  graph: Graph[]
}
interface GraphComponentState {
}

export default GraphComponent