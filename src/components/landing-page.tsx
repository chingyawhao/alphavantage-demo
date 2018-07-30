import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReSub from 'resub'
import {withStyles, Theme, StyleRules, StyleRulesCallback} from '@material-ui/core/styles'
import {grey} from '@material-ui/core/colors'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import screenStore from '../store/screen'
import alphavantageStore, {Graph} from '../store/alphavantage'
import GraphComponent from './graph-component'

const styles = (theme:Theme):StyleRules<string> | StyleRulesCallback<string> => ({
  container: {
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pageContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexGrow: 1
  },
  drawer: {
    position: 'relative',
    zIndex: 100
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 32px',
    [`@media (max-width:${theme.breakpoints.values.sm}px)`]: {
      padding: '0 16px',
    }
  },
  selectedOption: {
    color: theme.palette.primary.dark
  }
})
@(withStyles as any)(styles)
class LandingPage extends ReSub.ComponentBase<LandingPageProps, LandingPageState> {
  protected _buildState(props:{}, initial:boolean):LandingPageState {
    return {
      screenType: screenStore.type(),
      symbol: alphavantageStore.symbol(),
      graph: alphavantageStore.graph()
    }
  }
  componentDidMount() {
    document.querySelector('body').style.background = grey[800]
  }
  render() {
    const {classes} = this.props
    const {screenType, symbol, graph} = this.state
    return (
      <div className={classes.container}>
        <AppBar position='static' color='primary'>
          <Toolbar>
            <Typography variant='title' color='inherit'>ALPHA VANTAGE</Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.pageContainer}>
          <Paper classes={{root:classes.drawer}} square elevation={5}>
            <List>
              {[
                'MSFT',
                'AAPL',
                'INTC'
              ].map(symbolOption =>
                <ListItem key={symbolOption} button>
                  <ListItemText
                    classes={{primary:symbolOption === symbol? classes.selectedOption:undefined}}
                    onClick={() => alphavantageStore.changeSymbol(symbolOption)}
                  >
                    {symbolOption}
                  </ListItemText>
                </ListItem>
              )}
            </List>
          </Paper>
          <Paper classes={{root:classes.mainContent}} square>
            <GraphComponent graph={graph}/>
          </Paper>
        </div>
        <AppBar position='static' color='default'>
          <Toolbar variant='dense'>
            <Typography variant='body1' color='inherit'>Developed by Ching Yaw Hao</Typography>
          </Toolbar>
        </AppBar>
      </div>
    )
  } 
}
interface LandingPageProps extends React.Props<{}> {
  classes?: any
}
interface LandingPageState {
  screenType: 'xl-desktop' | 'lg-desktop' | 'md-desktop' | 'sm-tablet' | 'xs-phone'
  symbol: string
  graph: Graph[]
}

export default LandingPage