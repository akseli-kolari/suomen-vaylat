import { useAppSelector } from '../../state/hooks';
import strings from '../../translations';

export const PageTitle = () => {
    document.title = strings.title;
    if (process.env.REACT_APP_EXTRANET === "true"){
        document.title += " " + strings.extranet
    }

    useAppSelector((state) => state.language);

    return (
        <div></div>
    );
 }

 export default PageTitle;