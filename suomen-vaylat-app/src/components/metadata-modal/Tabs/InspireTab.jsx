import strings from '../../../translations';
import styled from 'styled-components';
import Citation from './Components/Citation';
import CitationDate from './Components/CitationDate';
import Languages from './Components/Languages';
import LineageStatements from './Components/LineageStatements';
import MetadataGraphic from './Components/MetadataGraphic';
import OnlineResources from './Components/OnlineResources';
import ResponsibleParties from './Components/ResponsibleParties';
import SpatialResolutions from './Components/SpatialResolutions';
import TemporalExtents from './Components/TemporalExtents';
import HeaderAndParagraph from './Components/HeaderAndParagraph';
import TopicCategories from './Components/TopicCategories';
import ScopeCodes from './Components/ScopeCodes';
import ResourceIdentifiers from './Components/ResourceIdentifiers';
import OperatesOn from './Components/OperatesOn';
import ServiceType from './Components/ServiceType';
import DescriptiveKeywords from './Components/DescriptiveKeywords';
import DataQualities from './Components/DataQualities';
import AccessConstraints from './Components/AccessConstraints';
import OtherConstraints from './Components/OtherConstraints';
import Classifications from './Components/Classifications';
import UseLimitations from './Components/UseLimitations';

const StyledArticle = styled.article`
`;

export const InspireTab = ({ identification, data }) => {
    return (
        <StyledArticle>
            <MetadataGraphic identification={identification}></MetadataGraphic>
            <Citation identification={identification}></Citation>
            <HeaderAndParagraph
                visible={identification.abstractText.length > 0}
                header={(identification.type === 'data' ? strings.metadata.heading.abstractTextData : strings.metadata.heading.abstractTextService)}
                text={identification.abstractText}
            ></HeaderAndParagraph>
            <HeaderAndParagraph
                visible={data.metadataDateStamp.length > 0}
                header={strings.metadata.heading.metadataDateStamp}
                text={data.metadataDateStamp}
                momentFormat={'DD.MM.YYYY hh:mm:ss'}
            ></HeaderAndParagraph>
            <OnlineResources onlineResources={data.onlineResources}></OnlineResources>
            <Languages identification={identification}></Languages>
            <TopicCategories identification={identification}></TopicCategories>
            <TemporalExtents identification={identification}></TemporalExtents>
            <LineageStatements lineageStatements={data.lineageStatements}></LineageStatements>
            <SpatialResolutions identification={identification}></SpatialResolutions>
            <ResponsibleParties
                visible={identification.responsibleParties && identification.responsibleParties.length > 0}
                header={strings.metadata.heading.responsibleParty}
                responsibleParties={identification.responsibleParties}></ResponsibleParties>
            <CitationDate identification={identification}></CitationDate>
            <ScopeCodes scopeCodes={data.scopeCodes}></ScopeCodes>
            <ResourceIdentifiers identification={identification}></ResourceIdentifiers>
            <OperatesOn identification={identification}></OperatesOn>
            <ServiceType identification={identification}></ServiceType>
            <DescriptiveKeywords identification={identification}></DescriptiveKeywords>
            <DataQualities dataQualities={data.dataQualities}></DataQualities>
            <AccessConstraints identification={identification}></AccessConstraints>
            <OtherConstraints identification={identification}></OtherConstraints>
            <Classifications identification={identification}></Classifications>
            <UseLimitations identification={identification}></UseLimitations>
        </StyledArticle>
    );
};
export default InspireTab;