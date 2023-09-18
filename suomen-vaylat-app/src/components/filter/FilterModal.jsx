import { useState, useContext, useEffect } from "react";
import { useAppSelector } from "../../state/hooks";
import { ReactReduxContext } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/fi";
import "dayjs/locale/sv";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import strings from "../../translations";
import Dropdown from "../select/Dropdown";
import { faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { setFilters, setActiveGFILayer } from "../../state/slices/rpcSlice";

const StyledFilterProp = styled.div``;

const StyledFilterPropContainer = styled.div`
  width: 95%;
`;

const StyledFilterHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const StyledModalContainer = styled.div`
  :after {
    content: "";
    display: table;
    clear: both;
  }
  margin-left: 1em;
  margin-right: 1em;
  margin-top: 1em;
  margin-bottom: 1em;
  min-width: 20em;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledModalSelectionContainer = styled.div`
  :after {
    content: "";
    display: table;
    clear: both;
  }
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledModalResultContainer = styled.div`
  :after {
    content: "";
    display: table;
    clear: both;
  }
  margin-top: 1em;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledModalFloatingChapter = styled.div`
  float: left;
  height: '3em'
  width: 100%;
  position: relative;
`;
const StyledModalFloatingActionChapter = styled.div`
  width: 7%;
  margin-left: ".5em";
  float: left;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  align-self: flex-end;
`;

const StyledInput = styled.input`
  width: 100%;
  padding-left: 12px;
  font-size: 16px;
  padding-top: 10px;
  border-radius: 4px;
  border: 2px solid;
  border-color: hsl(0, 0%, 80%);
  padding: 5px 10px;
`;

const StyledFilterContainer = styled.div`
  padding-top: 1em;
  margin-left: ".5em";
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledFilterResultContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledFilterReusltButtons = styled.div`
  display: flex;
  align-items: flex-end;
`;

const StyledFilter = styled.div`
  background-color: #f2f2f2;
  border: solid 1px black;
  border-radius: 7px;
  margin-bottom: 5px;
  padding-left: 3px;
  padding-right: 3px;
  :nth-child(odd) {
    background-color: white;
  }
  :nth-child(3) {
    //float: none;
  }
  display: flex;
`;

const StyledSelectedTabDisplayOptionsButton = styled.div`
  display: flex;
  position: relative;
  right: 0px;
  margin: 0.5em 0 0.5em 0.5em;
  cursor: pointer;
  color: ${(props) => props.theme.colors.mainColor1};
  svg {
    font-size: 24px;
  }
`;

const StyledTimesIconWrapper = styled.div`
  margin: 0.5em;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.mainColor1};
  svg {
    font-size: 20px;
    transition: all 0.1s ease-out;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.mainColor2};
    }
  }
  float: right;
`;

const StyledTrashIconWrapper = styled.div`
  display: flex;
  align-items: center;
  text-align: end;
  margin: 1em 0 0 1em;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.mainColor1};
  svg {
    font-size: 20px;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.mainColor2};
    }
  }
`;

export const FilterModal = () => {
  const {
    filters,
    activeGFILayer,
    filteringInfo,
    gfiLocations,
    selectedLayers,
    channel,
  } = useAppSelector((state) => state.rpc);
  const { store } = useContext(ReactReduxContext);
  const [operatorValue, setOperatorValue] = useState({});
  const [filterValue, setFilterValue] = useState({ value: "", type: null });
  const [propValue, setPropValue] = useState({});
  const [fieldNameLocales, setFieldNameLocales] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSetPropValue = (value) => {
    setStartDate(null);
    setEndDate(null);
    setFilterValue({ value: "", type: null });
    setOperatorValue({});
    setPropValue(value);
  };

  const addFilter = () => {
    const prop = propValue.value;
    var value;
    if (startDate || endDate) {
      value = {
        start: startDate ? new Date(startDate) : null,
        end: endDate ? new Date(endDate) : null,
      };
    } else {
      value = filterValue.value;
    }
    const type = propValue.type;
    const oper = type === "date" ? "date" : operatorValue.value;
    const layer = filteringInfo?.layer?.id;

    if (!prop || !value) {
      //lisää popup varoitus
      return;
    }
    store.dispatch(
      setFilters([
        ...filters,
        {
          layer: layer,
          property: prop,
          operator: oper,
          value: value,
          type: type,
        },
      ])
    );
    setStartDate(null);
    setEndDate(null);
    setPropValue({});
    setFilterValue({ value: "", type: null });
    setOperatorValue({});
  };

  const gfiFilteringNumberOptions = [
    { value: "equals", label: strings.gfifiltering.operators.equals },
    { value: "notEquals", label: strings.gfifiltering.operators.notEquals },
    { value: "smallerThan", label: strings.gfifiltering.operators.smallerThan },
    { value: "biggerThan", label: strings.gfifiltering.operators.biggerThan },
  ];

  const gfiFilteringStringOptions = [
    { value: "equals", label: strings.gfifiltering.operators.equals },
    { value: "notEquals", label: strings.gfifiltering.operators.notEquals },
    { value: "includes", label: strings.gfifiltering.operators.includes },
    {
      value: "doesntInclude",
      label: strings.gfifiltering.operators.doesntInclude,
    },
  ];

  var comparisonOperatorsHash = {
    number: gfiFilteringNumberOptions,
    string: gfiFilteringStringOptions,
  };

  useEffect(() => {
    if (activeGFILayer === null) {
      const layer = selectedLayers.filter(
        (l) => l.id == gfiLocations[0].layerId
      );
      store.dispatch(setActiveGFILayer(layer));
    }

    var layer = filteringInfo?.layer;
    channel.getFieldNameLocales(
      [layer?.id],
      (data) => {
        setFieldNameLocales(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  const [activeFilters, setActiveFilters] = useState();

  useEffect(() => {
    if (filteringInfo && filteringInfo?.layer && filters) {
      const updatedActivefilters = filters.filter(
        (filter) => filter.layer === filteringInfo?.layer.id
      );
      setActiveFilters(updatedActivefilters);
    }
  }, [filters, filteringInfo]);

  const handleRemoveFilter = (filter) => {
    if (filters && filters.length > 0 && filters.includes(filter)) {
      const updatedFilters = filters.filter(
        (existingFilter) => existingFilter !== filter
      );
      store.dispatch(setFilters(updatedFilters));
    }
  };

  const handleRemoveAllFilters = () => {
    if (filters && filters.length > 0) {
      const updatedFilters = filters.filter(
        (filter) => filter.layer !== activeGFILayer[0]?.id
      );
      store.dispatch(setFilters(updatedFilters));
    }
  };

  const filterOptions = () => {
    var layer = filteringInfo?.layer;
    const options = layer?.tableProps?.filterableColumns?.map((column) => {
      if (Object.keys(fieldNameLocales).length > 0) {
        return {
          value: column.key,
          label: fieldNameLocales[column.title],
          type: column.type,
        };
      } else {
        return {
          value: column.key,
          label: column.title,
          type: column.type,
        };
      }
    });
    return options;
  };

  return (
    <StyledModalContainer>
      <StyledModalSelectionContainer>
        <StyledModalFloatingChapter>
          <Dropdown
            options={filterOptions()}
            placeholder={strings.gfifiltering.placeholders.chooseProp}
            value={propValue}
            setValue={(value) => handleSetPropValue(value)}
            isDisabled={false}
          />
        </StyledModalFloatingChapter>
        {propValue.type === "date" ? (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={strings.getLanguage()}>
              <DatePicker
                sx={{ marginTop: ".5em" }}
                label={strings.gfifiltering.startDate}
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
              <DatePicker
                sx={{ marginTop: ".5em" }}
                label={strings.gfifiltering.endDate}
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
            </LocalizationProvider>
          </>
        ) : (
          <>
            <StyledModalFloatingChapter style={{ marginTop: ".5em" }}>
              <Dropdown
                options={comparisonOperatorsHash[propValue.type]}
                placeholder={strings.gfifiltering.placeholders.chooseOperator}
                value={operatorValue}
                setValue={setOperatorValue}
                isDisabled={Object.keys(propValue).length === 0}
              />
            </StyledModalFloatingChapter>
            <StyledModalFloatingChapter style={{ marginTop: ".5em" }}>
              <StyledInput
                type="text"
                value={filterValue.value}
                placeholder={strings.gfifiltering.placeholders.chooseValue}
                onChange={(e) =>
                  setFilterValue({
                    value: e.target.value,
                    type: propValue.type,
                  })
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addFilter();
                  }
                }}
                disabled={Object.keys(operatorValue).length === 0}
              />
            </StyledModalFloatingChapter>
          </>
        )}
        <StyledModalFloatingActionChapter>
          <StyledSelectedTabDisplayOptionsButton onClick={() => addFilter()}>
            {strings.gfifiltering.addFilter}{" "}
            <FontAwesomeIcon style={{ marginLeft: ".3em" }} icon={faPlus} />
          </StyledSelectedTabDisplayOptionsButton>
        </StyledModalFloatingActionChapter>
      </StyledModalSelectionContainer>

      <StyledModalResultContainer>
        {activeFilters && activeFilters.length > 0 && (
          <StyledFilterContainer>
            <StyledFilterResultContainer>
              <StyledFilterHeader style={{ marginBottom: ".5em" }}>
                {strings.gfifiltering.activeFilters}
              </StyledFilterHeader>
              {activeFilters.map((filter) => (
                <StyledFilter>
                  <StyledFilterPropContainer>
                    <StyledFilterProp>
                      {strings.gfifiltering.property}:{" "}
                      {Object.keys(fieldNameLocales).length > 0 ? fieldNameLocales[filter.property] : filter.property}
                    </StyledFilterProp>
                    <StyledFilterProp>
                      {filter.operator === "date" ? (
                        <>
                          {strings.gfifiltering.operator}:{" "}
                          {strings.gfifiltering.dateRange}{" "}
                        </>
                      ) : (
                        <>
                          {strings.gfifiltering.operator}:{" "}
                          {strings.gfifiltering.operators[filter.operator]}{" "}
                        </>
                      )}
                    </StyledFilterProp>
                    {filter.type === "date" ? (
                      <>
                        <StyledFilterProp>
                          {strings.gfifiltering.startDate}:{" "}
                          {filter.value.start
                            ? filter.value.start.toLocaleString([strings.getLanguage()], {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              })
                            : "-"}
                        </StyledFilterProp>
                        <StyledFilterProp>
                          {strings.gfifiltering.endDate}:{" "}
                          {filter.value.end
                            ? filter.value.end.toLocaleString([strings.getLanguage()], {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              })
                            : "-"}
                        </StyledFilterProp>
                      </>
                    ) : (
                      <StyledFilterProp>
                        {strings.gfifiltering.value}: {filter.value}
                      </StyledFilterProp>
                    )}
                  </StyledFilterPropContainer>
                  <StyledTimesIconWrapper
                    onClick={() => {
                      handleRemoveFilter(filter);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      size="6x"
                      style={{ marginLeft: ".5em" }}
                    />
                  </StyledTimesIconWrapper>
                </StyledFilter>
              ))}
            </StyledFilterResultContainer>
            <StyledFilterReusltButtons>
              <StyledTrashIconWrapper
                onClick={() => {
                  handleRemoveAllFilters();
                }}
              >
                {strings.gfifiltering.removeAllFilters}{" "}
                <FontAwesomeIcon
                  icon={faTrash}
                  size="6x"
                  style={{ marginLeft: ".5em" }}
                />
              </StyledTrashIconWrapper>
            </StyledFilterReusltButtons>
          </StyledFilterContainer>
        )}
      </StyledModalResultContainer>
    </StyledModalContainer>
  );
};
