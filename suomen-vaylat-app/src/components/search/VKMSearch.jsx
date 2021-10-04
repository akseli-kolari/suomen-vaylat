import { useEffect } from 'react';
import { debounce } from 'tlence';
import { addFeaturesToMap, removeFeaturesFromMap, searchVKMRoad } from '../../state/slices/rpcSlice';
import { emptySearchResult, setFormData, setSearching, setSearchResult } from '../../state/slices/searchSlice';
import strings from '../../translations';
import { ShowError } from '../messages/Messages';
import { StyledContainer, StyledSelectInput, StyledTextField, ToastMessage } from './CommonComponents';
import { VKMGeoJsonHoverStyles, VKMGeoJsonStyles } from './VKMSearchStyles';

let debounceSearchVKM = null;

const VKMSearch = ({visible, search, store, vectorLayerId, onEnterHandler}) => {
    if (search.selected === 'vkm' && search.searchResult.geom !== null && search.searching === false) {
        let style = 'tie';
        if ((search.formData.vkm.tieosa !== null || search.formData.vkm.ajorata !== null) && search.searchResult.osa) {
            style = 'osa';
        } else if (search.formData.vkm.etaisyys !== null) {
            style = 'etaisyys';
        }
        let featureStyle = VKMGeoJsonStyles[style];
        let hover = VKMGeoJsonHoverStyles[style];

        if (style === 'tie') {
            store.dispatch(removeFeaturesFromMap(vectorLayerId + '_vkm_osa'));
        }

        store.dispatch(addFeaturesToMap({
            geojson: search.searchResult.geom,
            layerId: vectorLayerId + '_vkm_' + style,
            featureStyle: featureStyle,
            hover: hover,
            maxZoomLevel: 10
        }));
    }

    const onChange = (name, value) => {
        let formData = {
            tie: (name === 'tie') ? value : search.formData.vkm.tie,
            tieosa: (name === 'tieosa') ? value : search.formData.vkm.tieosa,
            ajorata: (name === 'ajorata') ? value : search.formData.vkm.ajorata,
            etaisyys: (name === 'etaisyys') ? value : search.formData.vkm.etaisyys
        };
        let data = [];

        if (name === 'tie') {
            if (value === null) {
                return;
            }
            data.push(value);
            store.dispatch(emptySearchResult());
            formData.tieosa = null;
            formData.ajorata = null;
            formData.etaisyys = null;
        } else {
            data.push(formData.tie);
        }
        if (name === 'tieosa') {
            data.push(value);
            formData.ajorata = null;
            formData.etaisyys = null;
        } else {
            data.push(formData.tieosa);
        }
        if (name === 'ajorata') {
            data.push(value);
            formData.etaisyys = null;
        } else {
            data.push(formData.ajorata);
        }
        if (name === 'etaisyys') {
            data.push(value);
        } else {
            data.push(formData.etaisyys);
        }

        store.dispatch(setFormData(formData));

        if (name !== 'etaisyys') {
            debounceSearchVKM(data);
        }
    };

    useEffect(() => {
        const vkmSearchHandler = (data) => {
            store.dispatch(setSearchResult(data));
        };

        const vkmSearchErrorHandler = (errors) => {
            store.dispatch(setSearching(false));

            ShowError(<ToastMessage title={strings.search.vkm.error.title}
                message={strings.search.vkm.error.text}
                errors={errors}/>);
        };

        const searchVKM = (data) => {
            store.dispatch(setSearching(true));
            store.dispatch(searchVKMRoad({
                search: data,
                handler: vkmSearchHandler,
                errorHandler: vkmSearchErrorHandler
            }));
        };
        debounceSearchVKM = debounce(searchVKM, 1000);
    }, [store]);



    return (
            <StyledContainer visible={visible} className="search-inputs">
                <StyledTextField
                    placeholder={strings.search.vkm.tie}
                    onChange={(event) => {
                        onChange('tie', parseFloat(event.target.value));
                    }}
                    value={search.formData.vkm.tie ? search.formData.vkm.tie : ''}
                    min="1"
                    type="number"
                >
                </StyledTextField>

                <StyledSelectInput
                    placeholder={strings.search.vkm.osa}
                    onChange={(event) => {
                        onChange('tieosa', parseFloat(event.target.value));
                    }}
                    value={search.formData.vkm.tieosa}
                    disabled={search.searchResult.tieosat.length <= 0}
                    marginTop={true}
                    options={search.searchResult.tieosat.map((value, index) => {
                        return { value: value, label: value }
                    })}
                >
                </StyledSelectInput>

                <StyledSelectInput
                    placeholder={strings.search.vkm.ajorata}
                    onChange={(event) => {
                        onChange('ajorata', parseFloat(event.target.value));
                    }}
                    value={search.formData.vkm.ajorata}
                    disabled={search.searchResult.ajoradat.length <= 0}
                    marginTop={true}
                    options={search.searchResult.ajoradat.map((value, index) => {
                        return { value: value, label: value }
                    })}
                >
                </StyledSelectInput>

                <StyledTextField
                    placeholder={strings.search.vkm.etaisyys}
                    onChange={(event) => {
                        onChange('etaisyys', parseFloat(event.target.value));
                    }}
                    value={search.formData.vkm.etaisyys !== null ? search.formData.vkm.etaisyys : ''}
                    disabled={search.formData.vkm.tie === null || search.formData.vkm.tieosa === null || search.formData.vkm.ajorata === null}
                    marginTop={true}
                    min="0"
                    type="number"
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            onEnterHandler();
                        }
                    }}
                >
                </StyledTextField>
            </StyledContainer>
    );
};

export default VKMSearch;