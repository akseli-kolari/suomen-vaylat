import './_colors.scss';
import './custom.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import SimpleReactLightbox from 'simple-react-lightbox';
import styled from 'styled-components';
import Layout from './components/layout/Layout';
import PageTitle from './components/layout/PageTitle';
import { HandleSharedWebSiteLink } from './components/share-web-site/HandleSharedWebSiteLink';
import { history, store } from './state/store';
import Theme from './theme/theme';

import { setIsFullScreen } from './state/slices/uiSlice';

const StyledAppContainer = styled.div`
    width: 100%;
    height: var(--app-height);
    margin: 0;
    padding: 0;
`;

document.addEventListener('fullscreenchange', (event) => {
    if (document.fullscreenElement) {
        store.dispatch(setIsFullScreen(true));
    } else {
        store.dispatch(setIsFullScreen(false));
    }
});

/**
 * Top class for the application.
 * Everything else is under this.
 *
 * @class App
 * @extends {React.Component}
 */
const App = () => {



    let routerPrefix = '/';
    if (process.env.REACT_APP_ROUTER_PREFIX) {
        routerPrefix = process.env.REACT_APP_ROUTER_PREFIX;
    }

    const appContainer = <StyledAppContainer>
        <HandleSharedWebSiteLink />
        <PageTitle />
        <Layout />
        </StyledAppContainer>;

    return (
        <SimpleReactLightbox>
            <Provider store={store}>
                <Router history={history}>
                    <Theme>
                        <Route exact path={routerPrefix} render={() =>
                            <StyledAppContainer>
                                <PageTitle />
                                <Layout />
                            </StyledAppContainer>
                        }/>
                        <Route exact path={routerPrefix + 'theme/:lang/:zoom/:x/:y/:themeId?'} render={() => {
                            return (appContainer);
                        }}/>

                        <Route exact path={routerPrefix + 'link/:lang/:zoom/:x/:y/:maplayers?'} render={() => {
                            return (appContainer);
                        }}/>
                    </Theme>
                </Router>
            </Provider>
        </SimpleReactLightbox>
    );
}

export default App;
