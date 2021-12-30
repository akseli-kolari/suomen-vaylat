import { faInfoCircle, faQuestion, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useContext, useState} from 'react';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { setIsInfoOpen, setIsMainScreen, setIsUserGuideOpen } from '../../state/slices/uiSlice';
import { mapMoveRequest, setZoomTo } from '../../state/slices/rpcSlice';
import { resetThemeGroupsForMainScreen, removeDuplicates } from '../../utils/rpcUtil';
import strings from '../../translations';
import LanguageSelector from '../language-selector/LanguageSelector';
import { WebSiteShareButton } from '../share-web-site/ShareLinkButtons';
import { ReactComponent as VaylaLogoEn } from './images/vayla_sivussa_en_white.svg';
import { ReactComponent as VaylaLogoFi } from './images/vayla_sivussa_fi_white.svg';
import { ReactComponent as VaylaLogoSv } from './images/vayla_sivussa_sv_white.svg';
import { updateLayers } from '../../utils/rpcUtil';

const StyledHeaderContainer = styled.div`
    height: 64px;
    display: grid;
    position: relative;
    z-index: 5;
    grid-template-columns: 1fr 1fr 1fr;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    @media ${props => props.theme.device.tablet} {
        // grid-template-columns: 1fr 1fr 1fr;
        height: 56px;
    };
`;

const StyledSubNavContainer = styled.div`
    height: 64px;
    display: grid;
    position: absolute;
    top: ${props => props.isSubNavOpen ? "100%" : "-100%"};
    width: 100%;
    z-index: ${props => props.isSubNavOpen ? "99999" : "-5"};
    transition: all 0.3s ease-out;
    background-color: ${props => props.theme.colors.mainColor1};
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    @media ${props => props.theme.device.desktop} {
        height: 60px;
        display: none;
    }; 
    @media ${props => props.theme.device.mobileL} {
        grid-template-columns: 1fr 1fr;
        height: 56px;
        display: grid;
    };
`;

const StyledHeaderButton = styled.div`
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right:5px;
    background-color: transparent;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
    };
`;

const StyledHeaderTitleContainer = styled.p`
    cursor: pointer;
    height: inherit;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0;
    color: ${props => props.theme.colors.mainWhite};
    padding-left: 10px;
    font-weight: 600;
    @media ${props => props.theme.device.desktop} {
        font-size: 25px;
    };
    @media ${props => props.theme.device.tablet} {
        font-size: 15px;
    };
   
`;

const StyledHeaderLogoContainer = styled.div`
    height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        height: inherit;
    };
`;

const StyledRightCornerButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    padding-right: 10px;
    @media ${props => props.theme.device.desktop} {
        font-size: 25px;
    };
`;

const MobileButtons = styled.div`
    display: flex;
    @media ${props => props.theme.device.desktop} {
        display: none;
    };
    @media ${props => props.theme.device.mobileL} {
        display: flex;
    };
`;

const DesktopButtons = styled.div`
    display: flex;
    @media ${props => props.theme.device.mobileL} {
        display: none;
    };
`;

const StyledRightCornerButtonsMobile = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${props => props.theme.colors.mainWhite};
    padding-right: 10px;
`;

export const Header = () => {
    const lang = useAppSelector((state) => state.language);
    const [ isSubNavOpen, setSubNavOpen ] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const isInfoOpen = useAppSelector((state) => state.ui.isInfoOpen);
    const isUserGuideOpen = useAppSelector((state) => state.ui.isUserGuideOpen);

    const {
        channel,
        allLayers,
        selectedLayers,
        lastSelectedTheme,
        selectedThemeIndex
    } = useAppSelector((state) => state.rpc);

    const handleSelectGroup = (index, theme) => {
        resetThemeGroupsForMainScreen(store, channel, index, theme, lastSelectedTheme, selectedThemeIndex);
    };

    const setToMainScreen = () => {
        store.dispatch(mapMoveRequest({
            x: 435211,
            y: 7109206
        }));
        store.dispatch(setIsMainScreen());
        handleSelectGroup(null, lastSelectedTheme);
        const visibleMapLayerIds = [793,1354, 1388, 1387]
        const filteredLayers = [];
        if (allLayers) {
            visibleMapLayerIds.forEach((id) => {
                allLayers.forEach((layer) => {
                    if(id === layer.id) {
                        filteredLayers.push(layer)
                    }
                })
            })
        };
        const combinedLayers = filteredLayers.concat(selectedLayers)
        const uniqueArray = removeDuplicates(combinedLayers, 'id');
        uniqueArray.forEach(layer => {
            if(visibleMapLayerIds.includes(layer.id)) {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, true]);
            } else {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
            }
        })
        store.dispatch(setZoomTo(0))
        updateLayers(store, channel)
    };

    return (
        <>
            <StyledHeaderContainer>
                <ReactTooltip disable={isMobile} id={'show_info'} place='bottom' type='dark' effect='float'>
                    <span>{strings.tooltips.showPageInfo}</span>
                </ReactTooltip>
                <ReactTooltip disable={isMobile} id={'show_user_guide'} place='bottom' type='dark' effect='float'>
                    <span>{strings.tooltips.showUserGuide}</span>
                </ReactTooltip>
                <StyledHeaderTitleContainer onClick={() => setToMainScreen()}>
                        {strings.title}
                </StyledHeaderTitleContainer>
                <StyledHeaderLogoContainer>
                    {   lang.current === 'fi' ? <VaylaLogoFi /> :
                        lang.current === 'en' ? <VaylaLogoEn /> :
                        lang.current === 'sv' ? <VaylaLogoSv /> : <VaylaLogoFi />}
                </StyledHeaderLogoContainer>
                <StyledRightCornerButtons>
                    <MobileButtons>
                        <StyledHeaderButton onClick={() => setSubNavOpen(!isSubNavOpen)}>
                            <FontAwesomeIcon
                                icon={faEllipsisV}
                            />
                        </StyledHeaderButton>
                    </MobileButtons>
                    <DesktopButtons>
                        <WebSiteShareButton />
                        <StyledHeaderButton data-tip data-for={'show_user_guide'} onClick={() => store.dispatch(setIsUserGuideOpen(!isUserGuideOpen))}>
                            <FontAwesomeIcon
                                icon={faQuestion}
                            />
                        </StyledHeaderButton>
                        <StyledHeaderButton data-tip data-for={'show_info'} onClick={() => store.dispatch(setIsInfoOpen(!isInfoOpen))}>
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                            />
                        </StyledHeaderButton>
                        <LanguageSelector />
                    </DesktopButtons>
                </StyledRightCornerButtons>
                <StyledSubNavContainer isSubNavOpen={isSubNavOpen}>
                    <ReactTooltip disable={isMobile} id={'show_info'} place='bottom' type='dark' effect='float'>
                        <span>{strings.tooltips.showPageInfo}</span>
                    </ReactTooltip>
                    <ReactTooltip disable={isMobile} id={'show_user_guide'} place='bottom' type='dark' effect='float'>
                        <span>{strings.tooltips.showUserGuide}</span>
                    </ReactTooltip>
                    <StyledRightCornerButtonsMobile>
                        <WebSiteShareButton/>
                        <StyledHeaderButton data-tip data-for={'show_user_guide'}
                                            onClick={() => store.dispatch(setIsUserGuideOpen(!isUserGuideOpen))}>
                            <FontAwesomeIcon
                                icon={faQuestion}
                            />
                        </StyledHeaderButton>
                        <StyledHeaderButton data-tip data-for={'show_info'}
                                            onClick={() => store.dispatch(setIsInfoOpen(!isInfoOpen))}>
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                            />
                        </StyledHeaderButton>
                        <LanguageSelector/>
                    </StyledRightCornerButtonsMobile>
                </StyledSubNavContainer>
            </StyledHeaderContainer>
        </>
    );
 }

 export default Header;
