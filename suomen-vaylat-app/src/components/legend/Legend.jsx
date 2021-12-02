import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import '../../custom.scss';
import styled from 'styled-components';
import strings from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { LegendGroup } from './LegendGroup';


const StyledLegendContainer = styled(motion.div)`
    position: absolute;
    right: 58px;
    border-radius: 4px;
    min-width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${props => props.theme.colors.mainWhite};
    overflow: hidden;
    opacity: 0;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledHeaderContent = styled.div`
    height: 56px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color:  ${props => props.theme.colors.mainColor1};
    padding: 16px;
    box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.20);
    p {
        margin: 0px;
        font-size: 18px;
        font-weight: bold;
        color:  ${props => props.theme.colors.mainWhite};
    };
    svg {
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledTitleContent = styled.div`
    display: flex;
    align-items: center;
    svg {
        font-size: 20px;
        margin-right: 8px;
    }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    font-size: 20px;
`;

const StyledGroupsContainer = styled.div`
    overflow-y: scroll;
    padding: 8px 4px 8px 8px;
`;

const listVariants = {
    visible: {
        y: 0,
        //height: 585,
        opacity: 1,
        pointerEvents: "auto"
    },
    hidden: {
        y: "100%",
        //height: 0,
        opacity: 0,
        pointerEvents: "none"
    },
};

export const Legend = ({
    selectedLayers,
    zoomLevelsLayers,
    currentZoomLevel,
    isExpanded,
    setIsExpanded
}) => {
    const legends = [];
    const noLegends = [];
    const allLegends = useSelector((state) => state.rpc.legends);
    const [currentLayersInfoLayers, setCurrentLayersInfoLayers] = useState([]);

    if (selectedLayers) {
        selectedLayers.forEach((layer) => {
            const legend = allLegends.filter((l) => {
                return l.layerId === layer.id;
            });
            if (legend[0] && legend[0].legend) {
                legends.push(legend[0]);
            } else if (legend[0]) {
                noLegends.push(legend[0]);
            }
        });
    }
    legends.push.apply(legends, noLegends);

    useEffect(() => {
        zoomLevelsLayers && zoomLevelsLayers[currentZoomLevel] !== undefined && setCurrentLayersInfoLayers(Object.values(zoomLevelsLayers)[currentZoomLevel].layers);
    }, [zoomLevelsLayers, currentZoomLevel]);

    return(
        <StyledLegendContainer
            key={legends}
            //initial='visible'
            animate={isExpanded ? 'visible' : 'hidden'}
            variants={listVariants}
            transition={{
                duration: 0.5,
                type: "tween"
            }}
        >
            <StyledHeaderContent>
                <StyledTitleContent>
                    <p>{strings.legend.title}</p>
                </StyledTitleContent>
                    <StyledCloseIcon
                        icon={faTimes}
                        onClick={() => setIsExpanded(false)}
                    />
            </StyledHeaderContent>
            <StyledGroupsContainer id='legend-main-container'>
                {currentLayersInfoLayers.map((zoomLevelLayer, index) => {
                    const legend = legends.find(layer => layer.layerId === zoomLevelLayer.id);
                    return legend && <LegendGroup
                        key={currentZoomLevel !== null ?
                            zoomLevelLayer.id+'_'+currentZoomLevel :
                            zoomLevelLayer.id+'_'+currentZoomLevel
                        }
                        legend={legend}
                        zoomLevelLayer={zoomLevelLayer}
                        index={index}
                        layer={legend}
                    />
                })}
            </StyledGroupsContainer>
        </StyledLegendContainer>
    );
};
