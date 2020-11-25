import React from 'react'
import InfiniteScroll from './InfiniteScroll';
import { ThemeProvider, createMuiTheme, responsiveFontSizes} from "@material-ui/core/styles";


const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#282828'
        }
    }
});

class App extends React.Component {
    render() {
        return (
            <ThemeProvider theme={responsiveFontSizes(theme)}>
                <InfiniteScroll/>
            </ThemeProvider>
        )
    }
};

export default App