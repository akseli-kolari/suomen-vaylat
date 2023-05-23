import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { theme, isMobile } from '../../theme/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const StyledSwitchContainer = styled.div`
    position: relative;
    width: 52px;
    height: 26px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    background-color: ${props => props.isSelected ? "#8DCB6D" : "#AAAAAA"};
    cursor: pointer;
    float: left;
    margin-top: 6px;
`;

const StyledSwitchButton = styled.div`
    position: absolute;
    left: ${props => props.isSelected ? "25px" : "1px"};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    margin-left: 2px;
    margin-right: 2px;
    margin-top: 0.8px;
    transition: all 0.3s ease-out;
    background-color: ${props => props.theme.colors.mainWhite};
`;

const StyledBold = styled.div`
    display: inline-block;
    font-weigt: bold;
    padding-left: 12px;
    font-size: 18px;
    color: grey;
    padding-top: 6px;
`;


const StyledHeaderButton = styled.div`
    margin-right: 8px;
    padding: 8px;
    cursor: pointer;
    float: right;
`;

const SwitchWrapper = styled.div`
    width: 100%;
`;

const StyledToolTipContainer = styled.div`
    width: 80%;
    border-radius: 3px;
    display: inline-block;
    font-size: 15px;
    opacity: 1;
    padding: 8px 21px;
    position: ${(props) => props.isMobile ? "static;" : "position: absolute;"};
    pointer-events: none;
    visibility: visible;
    z-index: 999;
    background: #0064af;
    color: white;
    left: -92%;
    ::selection {
        color: red;
        background: yellow;
    }
`;

const Switch = ({   
    action,
    isSelected, 
    title,
    tooltipText, 
    tooltipAddress,
    id,
    tooltipEnabled=false
    }) => {
    const [isOpen, setOpen] = useState(false);
    return (
        <SwitchWrapper>
            <StyledSwitchContainer
                isSelected={isSelected}
                onClick={event => { action(event);  }}
            >
            <StyledSwitchButton isSelected={isSelected}/>
            </StyledSwitchContainer>
            <StyledBold>{title}</StyledBold>
          
            <StyledHeaderButton
                data-tip
                data-for={id}
                onClick={() => {setOpen(!isOpen); }}
            >
                <FontAwesomeIcon
                    icon={faInfoCircle}
                    style={{
                    float: 'right',
                    marginRight: '16px',
                    color: 'blue', 
                    marginBottom: '10px',
                    }}
                    size='lg'  
                />
                {isOpen && tooltipText !== undefined && tooltipEnabled &&
                    <StyledToolTipContainer>
                    <span>{tooltipAddress}  <br />  
                    {tooltipText.map(element => { return<span>   {element}  <br /> </span>}  )} </span>
                    </StyledToolTipContainer>
                 }
            </StyledHeaderButton>   
            {
         
            }
            
        </SwitchWrapper> 
    );
};

export default Switch;