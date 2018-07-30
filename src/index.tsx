import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'

import LandingPage from './components/landing-page'

const theme = createMuiTheme()

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <LandingPage/>
  </MuiThemeProvider>
, document.getElementById('root'))