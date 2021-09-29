import React from 'react';
import Layout from './components/layout/Layout';
import PageTitle from './components/layout/PageTitle';
import { Route, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { history, store } from './state/store';
import Theme from './theme/theme';
import SimpleReactLightbox from 'simple-react-lightbox';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';
import styled from 'styled-components';
import { HandleSharedWebSiteLink } from './components/share-web-site/HandleSharedWebSiteLink';

Modal.setAppElement('#root');

const StyledAppContainer = styled.div`
    margin: 0;
    padding: 0;
    width: 100%;
    height: var(--app-height);
`;

/**
 * Top class for the application.
 * Everything else is under this.
 *
 * @class App
 * @extends {React.Component}
 */
const App = () => {

    const appContainer = <StyledAppContainer>
        <HandleSharedWebSiteLink/>
        <PageTitle />
        <Layout />
        </StyledAppContainer>;

    return (
        <SimpleReactLightbox>
            <Provider store={store}>
                <Router history={history}>
                    <Theme>
                        <Route exact path="/" render={() =>
                            <StyledAppContainer>
                                <PageTitle />
                                <Layout />
                            </StyledAppContainer>
                        }/>
                        <Route exact path="/theme/:lang/:zoom/:x/:y/:themename?" render={() => {
                            return (appContainer);
                        }}/>

                        <Route exact path="/link/:lang/:layerlistType/:zoom/:x/:y/:maplayers?" render={() => {
                            return (appContainer);
                        }}/>
                    </Theme>
                </Router>
            </Provider>
        </SimpleReactLightbox>
    );
}

export default App;
