import styled from 'styled-components';
import strings from '../../translations';

const StyledInput = styled.input`
    border: none;
    width: 100%;
    padding-left: 26px;
    &:focus {
        outline: none;
    };
    font-size: 16px;
    padding-top: 10px;
    border-radius: 24px;
`;

const MetadataSearch = ({
    searchValue,
    setSearchValue,
    handleMetadataSearch
}) => {

    return (
        <StyledInput
            type="text"
            value={searchValue}
            placeholder={strings.search.metadata.title }
            onChange={e => setSearchValue(e.target.value)}
            onKeyPress={e => {
                if (e.key === 'Enter') {
                    handleMetadataSearch(e.target.value);
                }
            }}
        />
    );
};

export default MetadataSearch;