import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';

import {
    faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledLanguageSelector = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: ${(props) => props.theme.colors.mainWhite};
    padding-left: 8px;
    svg {
        font-size: 22px;
    };
`;

const StyledSelect = styled.select`
    width: 45px;
    height: 30px;
    cursor: pointer;
    color: ${(props) => props.theme.colors.mainWhite};
    background-color: transparent;
    border: none;
    font-size: 18px;
    option {
        width: 45px;
        height: 30px;
        background-color: ${(props) => props.theme.colors.mainColor1};
        border: none;
        font-size: 18px;
    };
    &:focus {
            outline: 0;
            outline-color: transparent;
            outline-style: none;
    };
`;

export const LanguageSelector = () => {

    const lang = useAppSelector((state) => state.language);

    const redirect = (key, value) => {
        let urlParams = new URLSearchParams(window.location.search);
        urlParams.delete(key);
        urlParams.set(key, value);
        window.location.search = urlParams.toString();
    };

    return (
        <StyledLanguageSelector aria-label={strings.accessibility.langSelectMenu} >
                <FontAwesomeIcon
                    icon={faGlobe}
                />
            <StyledSelect
                aria-label={strings.accessibility.langSelect}
                name="language_selector"
                value={lang.current}
                onChange={(event) => {
                    redirect('lang', event.target.value);
                }}
            >
                {strings.getAvailableLanguages().map((value, index) => {
                        return  (
                        <option
                            aria-label={strings.accessibility.lang + value}
                            key={'lang-'+value}
                            value={value}
                        >
                            {strings.getString('language.languageSelection.' + value)}
                        </option>
                    )})}
            </StyledSelect>
        </StyledLanguageSelector>
    );
 }

 export default LanguageSelector;