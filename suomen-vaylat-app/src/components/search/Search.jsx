import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
    faSearch,
    faTimes,
    faTrash,
    faEllipsisV,
    faAngleUp
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddressSearch from './AddressSearch';
import VKMSearch from './VKMSearch';
import MetadataSearch from './MetadataSearch';
import Layer from '../menus/hierarchical-layerlist/Layer';
import SvLoder from '../loader/SvLoader';
import strings from '../../translations';

import { isMobile } from '../../theme/theme';

import {
    addMarkerRequest,
    mapMoveRequest,
    //removeFeaturesFromMap,
    //removeMarkerRequest,
    //searchRequest,
    //searchVKMRoad,
    //setSelectError,
} from '../../state/slices/rpcSlice';

// import {
//     emptyFormData,
//     emptySearchResult,
//     setSearching,
//     setSearchResult,
//     setSelectedIndex,
//     setMarker,
//     setSearchResultOnMapId,
//     setSearchSelected
// } from '../../state/slices/searchSlice';

import { setIsSearchOpen } from '../../state/slices/uiSlice';

const StyledSearchContainer = styled.div`
    z-index: 2;
    position: relative;
    grid-column-start: 3;
    grid-column-end: 4;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    height: 48px;
    @media ${props => props.theme.device.mobileL} {
        grid-column-start: ${props => props.isSearchOpen ? 1 : 2};
        grid-column-end: 4;
        height: 40px;
    };
`;

const StyledSearchWrapper = styled(motion.div)`
    position: relative;
    transition: all 0.3s ease-out;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    overflow: hidden;
    padding-right: 48px;
    height: 100%;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    pointer-events: auto;
    @media ${props => props.theme.device.mobileL} {
        border-radius: 20px;
        padding-right: 40px;
    };
`;

const StyledLeftContentWrapper = styled.div`
    width: 100%;
    display: flex;
`;

const StyledSearchActionButton = styled(FontAwesomeIcon)`
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 16px;
    cursor: pointer;
`;

const StyledSearchMethodSelector = styled.div`
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
    cursor: pointer;
    color: ${props => props.isSearchMethodSelectorOpen ? props.theme.colors.mainColor1 : 'rgba(0,0,0,0.5)'};
    p {
        margin: 0;
    };
    svg {
        font-size: 16px;
    }
`;

const StyledSelectedSearchMethod = styled.div`
    width: 100%;
    p {
        padding: 6px 8px;
        font-size: 14px;
        margin: 0;
        color: #6c757d;
    }
`;

const StyledMenuBarButton = styled.div`
    position: absolute;
    right: 0px;
    z-index: 1;
    pointer-events: auto;
    cursor: pointer;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.isActive ? props.theme.colors.buttonActive : props.theme.colors.button};
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 22px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
        svg {
            font-size: 18px;
        };
    };
`;

const StyledDropDown = styled(motion.div)`
    z-index: -1;
    position: absolute;
    top: 0px;
    right: 0px;
    max-width: 400px;
    width: 100%;
    height: auto;
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    background-color: ${props => props.theme.colors.mainWhite};
    padding: 56px 16px 0px 16px;
    pointer-events: auto;
    overflow: auto;
    @media ${props => props.theme.device.mobileL} {
        max-width: 100%;
    };
`;

const StyledDropdownContentItem = styled.div`
    user-select: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 5px;
    background-color: ${props => props.itemSelected ? props.theme.colors.mainColor3 : ""};
    &:hover{
        background-color: ${props => props.theme.colors.mainColor3};
    };
    p {
        margin: 0;
        padding: 0;
    }
`;

const StyledDropdownContentItemTitle = styled.p`
    font-size: 14px;
    color: #807A7A;
`;

const StyledDropdownContentItemSubtitle = styled.p`
    font-size: 12px;
    color: #807A7A;
`;

const StyledHideSearchResultsButton = styled.div`
    position: sticky;
    bottom: 0px;
    background-color: white;
    text-align: center;
    padding-bottom: 4px;
    cursor: pointer;
    svg {
    font-size: 23px;
      color:  ${props => props.theme.colors.mainColor1}  
    };
`;

const Search = () => {
    const [searchValue, setSearchValue ] = useState("");
    const [lastSearchValue, setLastSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [showSearchResults, setShowSearchResults] = useState(true);
    const [isSearchMethodSelectorOpen, setIsSearchMethodSelectorOpen] = useState(false);
    const [searchTypeIndex, setSearchTypeIndex] = useState(0);

    const { isSearchOpen } = useAppSelector((state) => state.ui);
    const { channel, allLayers } = useAppSelector((state) => state.rpc);

    const { store } = useContext(ReactReduxContext);

    const markerId = 'SEARCH_MARKER';

    const handleAddressSearch = (value) => {
        setIsSearching(true);
        channel.postRequest('SearchRequest', [value]);
        setLastSearchValue(value);
    };

    const handleMetadataSearch = (value) => {
        setIsSearching(true);
        channel.postRequest('MetadataSearchRequest', [{
            search: value,
            srs: 'EPSG:3067',
            OrganisationName: 'Väylävirasto'
        }]);
        setLastSearchValue(value);
    };


    const searchTypes = [
        {
            value: 'address',
            label: strings.search.address.title,
            subtitle: strings.search.address.subtitle,
            content: <AddressSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setIsSearching={setIsSearching}
                handleAddressSearch={handleAddressSearch}
            />
        },
        {
            value: 'vkm',
            label: strings.search.vkm.title,
            subtitle: strings.search.vkm.subtitle,
            content: <p>{strings.search.vkm.title}...</p>
        },
        {
            value: 'metadata',
            label: strings.search.metadata.title,
            subtitle: strings.search.metadata.subtitle,
            content: <MetadataSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setIsSearching={setIsSearching}
                handleMetadataSearch={handleMetadataSearch}
            />
        }
    ];

    useEffect(() => {
        channel && channel.handleEvent('SearchResultEvent', function(data) {
            setIsSearching(false);
            if(data.success){
                if(data.result){
                    setSearchResults(data);
                } else {
                    console.log(data);
                }
            };
        });

        channel && channel.handleEvent('MetadataSearchResultEvent', function(data) {
            setIsSearching(false);
            if(data.success){
                if(data.results){
                    setSearchResults(data.results);
                } else {
                    console.log(data);
                }
            };
         });

    },[channel]);

    const handleAddressSelect = (name, lon, lat, id) => {
        store.dispatch(addMarkerRequest({
            x: lon,
            y: lat,
            msg: name || '',
            markerId: markerId,
        }));

        store.dispatch(mapMoveRequest({
            x: lon,
            y: lat
        }));
    };

    return (
        <StyledSearchContainer
            isSearchOpen={isSearchOpen}
        >
            <StyledMenuBarButton
                onClick={() => {
                        isSearchOpen && channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', []);
                        isSearchOpen && channel.postRequest('MapModulePlugin.RemoveMarkersRequest', []);
                        isSearchOpen && setSearchResults(null);
                        isSearchOpen && setSearchValue('');
                        store.dispatch(setIsSearchOpen(!isSearchOpen));
                        isSearchMethodSelectorOpen && setIsSearchMethodSelectorOpen(false);

                    }}
                    isActive={isSearchOpen}
                >
                    <FontAwesomeIcon
                        icon={isSearchOpen ? faTimes : faSearch}
                    />
            </StyledMenuBarButton>
            <AnimatePresence>
                {
                isSearchOpen && <StyledSearchWrapper
                    initial={{
                        maxWidth: 0,
                        opacity: 0
                    }}
                    animate={{
                        maxWidth: "400px",
                        opacity: 1
                    }}
                    exit={{
                        maxWidth: 0,
                        opacity: 0
                    }}
                    transition={{
                        duration: 0.3,
                        type: "tween"
                    }}
                >
                    <StyledLeftContentWrapper>
                        <StyledSearchMethodSelector
                            onClick={() => {
                                setIsSearchMethodSelectorOpen(!isSearchMethodSelectorOpen);
                            }}
                            isSearchMethodSelectorOpen={isSearchMethodSelectorOpen}
                        >
                            <FontAwesomeIcon
                                icon={faEllipsisV}
                            />
                        </StyledSearchMethodSelector>
                        {
                            !isSearching ?
                                <StyledSelectedSearchMethod
                                    onClick={() => {
                                        setShowSearchResults(true);
                                        isSearchMethodSelectorOpen && setIsSearchMethodSelectorOpen(false);
                                    }}
                                >
                                    {
                                        searchTypes[searchTypeIndex].content
                                    }
                                </StyledSelectedSearchMethod> : <SvLoder />
                        }
                    </StyledLeftContentWrapper>
                    {
                      searchResults !== null && (searchValue === lastSearchValue)?
                      <StyledSearchActionButton
                            onClick={() => {
                                setSearchResults(null);
                                setSearchValue('');
                            }}
                            icon={faTrash}
                        /> :
                        <StyledSearchActionButton
                            onClick={() => {
                                searchTypes[searchTypeIndex].value === 'address' && handleAddressSearch(searchValue);
                                searchTypes[searchTypeIndex].value === 'metadata' && handleMetadataSearch(searchValue);
                            }}
                            icon={faSearch}
                        /> 
                    }

                 </StyledSearchWrapper>
                }
            </AnimatePresence>
            <AnimatePresence>
                {
                    isSearchMethodSelectorOpen ?
                    <StyledDropDown
                        key={"dropdown-content-searchmethods"}
                        initial={{
                            height: 0,
                            opacity: 0
                        }}
                        animate={{
                            height: "auto",
                            maxHeight: "calc(var(--app-height) - 100px)",
                            opacity: 1
                        }}
                        exit={{
                            height: 0,
                            opacity: 0
                        }}
                        transition={{
                            duration: 0.5,
                            type: "tween"
                        }}
                    >
                        {
                            searchTypes.map((searchType, index) => {
                                return (
                                    <StyledDropdownContentItem
                                        onClick={() => {
                                            setSearchResults(null);
                                            setSearchTypeIndex(index);
                                            setIsSearchMethodSelectorOpen(false);
                                            setSearchValue('');
                                            isSearchOpen && channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', []);
                                            isSearchOpen && channel.postRequest('MapModulePlugin.RemoveMarkersRequest', []);
                                        }}
                                        key={'search-type-' + searchType.value}
                                    >
                                        <StyledDropdownContentItemTitle>{searchType.label}</StyledDropdownContentItemTitle>
                                        <StyledDropdownContentItemSubtitle>{searchType.subtitle}</StyledDropdownContentItemSubtitle>
                                    </StyledDropdownContentItem>
                                );
                            })
                        }
                   </StyledDropDown> :
                    isSearchOpen &&
                    searchResults !== null &&
                    showSearchResults &&
                    searchTypes[searchTypeIndex].value === 'address' ?
                    <StyledDropDown
                        key={"dropdown-content-address"}
                        initial={{
                            height: 0,
                            opacity: 0
                        }}
                        animate={{
                            height: "auto",
                            maxHeight: "calc(var(--app-height) - 100px)",
                            opacity: 1
                        }}
                        exit={{
                            height: 0,
                            opacity: 0
                        }}
                        transition={{
                            duration: 0.5,
                            type: "tween"
                        }}
                    >
                        {
                            searchResults.result.locations.length > 0 ? searchResults.result.locations.map(({ name, region, type, lon, lat, id }, index) => {
                                let visibleText;
                                if (name === region) {
                                    visibleText = name;
                                    if (type) {
                                        visibleText += ' (' + type.toLowerCase() +')';
                                    }
                                } else if (region && type) {
                                    visibleText = name + ', ' + region + ' (' + type.toLowerCase() +')';
                                } else if (type) {
                                    visibleText = name + ' (' + type.toLowerCase() +')';
                                } else {
                                    visibleText = name;
                                }
                                return <StyledDropdownContentItem
                                    key={name + '_' + index}
                                    onClick={() => {
                                        setSearchValue(visibleText);
                                        setLastSearchValue(visibleText);
                                        handleAddressSelect(name, lon, lat, id);
                                        isMobile && setShowSearchResults(false);
                                    }}
                                >
                                   <StyledDropdownContentItemTitle>{ visibleText }</StyledDropdownContentItemTitle>
                                </StyledDropdownContentItem>
                            }) :
                            <StyledDropdownContentItem
                                key={'no-results'}
                            >
                                <StyledDropdownContentItemTitle>No results</StyledDropdownContentItemTitle>
                            </StyledDropdownContentItem>
                        } 
                    <StyledHideSearchResultsButton>
                        <FontAwesomeIcon
                            icon={faAngleUp}
                            onClick={() => setShowSearchResults(false)}
                        />
                    </StyledHideSearchResultsButton>
                    </StyledDropDown> :
                    isSearchOpen &&
                    showSearchResults &&
                    searchTypes[searchTypeIndex].value === 'vkm' ?
                    <StyledDropDown
                        key={"dropdown-content-vkm"}
                        initial={{
                            height: 0,
                            opacity: 0
                        }}
                        animate={{
                            height: "auto",
                            maxHeight: "calc(var(--app-height) - 100px)",
                            opacity: 1
                        }}
                        exit={{
                            height: 0,
                            opacity: 0
                        }}
                        transition={{
                            duration: 0.5,
                            type: "tween"
                        }}
                    >
                        <VKMSearch
                            setIsSearching={setIsSearching}
                        />
                    </StyledDropDown> : 
                    isSearchOpen &&
                    searchResults !== null &&
                    showSearchResults &&
                    searchTypes[searchTypeIndex].value === 'metadata' &&
                    <StyledDropDown
                        key={"dropdown-content-metadata"}
                        initial={{
                            height: 0,
                            opacity: 0
                        }}
                        animate={{
                            height: "auto",
                            maxHeight: "calc(var(--app-height) - 100px)",
                            opacity: 1
                        }}
                        exit={{
                            height: 0,
                            opacity: 0
                        }}
                        transition={{
                            duration: 0.5,
                            type: "tween"
                        }}
                    >
                        {
                            searchResults.length > 0 ? searchResults.map(result => {
                                const layers = allLayers.filter(layer => layer.metadataIdentifier === result.id);
                                return layers.map(layer => {
                                    return <Layer key={`metadata_${layer.id}`}layer={layer}/>
                                })
                            }) : 
                            <StyledDropdownContentItem
                                key={'no-results'}
                            >
                                <StyledDropdownContentItemTitle>No results</StyledDropdownContentItemTitle>
                            </StyledDropdownContentItem>

                        }
                    <StyledHideSearchResultsButton>
                        <FontAwesomeIcon
                            icon={faAngleUp}
                            onClick={() => setShowSearchResults(false)}
                        />
                    </StyledHideSearchResultsButton>
                    </StyledDropDown>
                }
            </AnimatePresence>
        </StyledSearchContainer>
    );
};

export default Search;